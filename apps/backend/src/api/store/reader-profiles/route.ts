import type {MedusaRequest,MedusaResponse} from "@medusajs/framework/http"
import {z} from "zod"
import {randomUUID} from "node:crypto"
import {getDbPool} from "../../../utils/db"
import {lockActiveReader,requireFamilyStepup} from "../../../utils/reader-profiles"
import {apiError} from "../../../utils/api-error"
export async function GET(req:MedusaRequest,res:MedusaResponse){
 const id=(req as any).auth_context?.actor_id
 const rows=await getDbPool().query("SELECT id,name,realm,settings,created_at,updated_at FROM reader_profiles WHERE customer_id=$1 AND deleted_at IS NULL ORDER BY created_at",[id])
 res.setHeader("Cache-Control","private, no-store");return res.json({profiles:rows.rows})
}
export async function POST(req:MedusaRequest,res:MedusaResponse){
 const client=await getDbPool().connect()
 try{
  const id=await requireFamilyStepup(req),body=z.object({id:z.string().regex(/^[A-Za-z0-9_-]{8,100}$/).optional(),name:z.string().trim().min(1).max(40),realm:z.enum(["little","kids","teens"]),settings:z.object({voice:z.boolean().default(false),reports:z.boolean().default(false),dailyLimit:z.number().int().min(5).max(180).default(30)}).default({voice:false,reports:false,dailyLimit:30})}).parse(req.body)
  await client.query("BEGIN");await lockActiveReader(client,id);await client.query("SELECT pg_advisory_xact_lock(hashtext($1))",["family:"+id])
  const existing=body.id?(await client.query("SELECT * FROM reader_profiles WHERE id=$1 FOR UPDATE",[body.id])).rows[0]:null
  if(existing&&(existing.customer_id!==id||existing.deleted_at||existing.realm!==body.realm))throw Object.assign(new Error("تعذر تعديل الملف؛ المعرّف مستخدم أو وصل عدد الملفات إلى الحد الأقصى"),{status:409})
  const count=(await client.query("SELECT count(*)::int AS count FROM reader_profiles WHERE customer_id=$1 AND deleted_at IS NULL",[id])).rows[0].count
  if(!existing&&count>=20)throw Object.assign(new Error("تعذر تعديل الملف؛ المعرّف مستخدم أو وصل عدد الملفات إلى الحد الأقصى"),{status:409})
  const profileId=body.id||"profile_"+randomUUID()
  const result=await client.query(`INSERT INTO reader_profiles(id,customer_id,name,realm,settings) VALUES($1,$2,$3,$4,$5::jsonb) ON CONFLICT(id) DO UPDATE SET name=EXCLUDED.name,settings=EXCLUDED.settings,updated_at=now() RETURNING id,name,realm,settings`,[profileId,id,body.name,body.realm,JSON.stringify(body.settings)])
  await client.query(`INSERT INTO reader_states(customer_id,profile_id,analytics_opt_in) VALUES($1,$2,$3) ON CONFLICT(customer_id,profile_id) DO UPDATE SET analytics_opt_in=EXCLUDED.analytics_opt_in,updated_at=now()`,[id,profileId,body.settings.reports])
  if(!body.settings.reports)await client.query("DELETE FROM reading_events WHERE customer_id=$1 AND profile_id=$2",[id,profileId])
  await client.query("COMMIT");return res.status(existing?200:201).json({profile:result.rows[0]})
 }catch(error){await client.query("ROLLBACK");return apiError(res,error)}finally{client.release()}
}
