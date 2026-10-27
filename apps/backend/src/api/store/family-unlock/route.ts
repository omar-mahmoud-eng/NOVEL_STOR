import type{MedusaRequest,MedusaResponse}from"@medusajs/framework/http"
import{Modules}from"@medusajs/framework/utils"
import{z}from"zod"
import{randomBytes}from"node:crypto"
import{getDbPool,withTransaction}from"../../../utils/db"
import{stepupHash,lockActiveReader}from"../../../utils/reader-profiles"
import{apiError}from"../../../utils/api-error"
export async function POST(req:MedusaRequest,res:MedusaResponse){try{const body=z.object({password:z.string().min(1).max(256)}).parse(req.body),id=(req as any).auth_context?.actor_id,customer=await(req.scope.resolve(Modules.CUSTOMER)as any).retrieveCustomer(id),auth=await(req.scope.resolve(Modules.AUTH)as any).authenticate("emailpass",{body:{email:customer.email,password:body.password}});if(!auth.success||auth.authIdentity?.app_metadata?.customer_id!==id)return res.status(401).json({message:"كلمة مرور الحساب غير صحيحة"});const token=randomBytes(32).toString("hex");await withTransaction(async client=>{await lockActiveReader(client,id);await client.query("DELETE FROM customer_stepups WHERE expires_at<=now() OR customer_id=$1",[id]);await client.query("INSERT INTO customer_stepups(token_hash,customer_id,expires_at) VALUES($1,$2,now()+interval '10 minutes')",[stepupHash(token),id]);});res.setHeader("Cache-Control","private, no-store");return res.json({token,expires_in:600})}catch(error){return apiError(res,error)}}
