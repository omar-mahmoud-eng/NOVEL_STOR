import type { MedusaRequest,MedusaResponse } from "@medusajs/framework/http"
import { getDbPool } from "../../../../utils/db"
import { readingBook } from "../../../../utils/reading-content"
import { accessOf } from "../../../../utils/publishing-access"
import { saveDraftBook } from "../../../../utils/publishing-books"
import { apiError } from "../../../../utils/api-error"
export async function GET(req:MedusaRequest,res:MedusaResponse){
 const q=typeof req.query.q==="string"?req.query.q.slice(0,200):"",realm=typeof req.query.realm==="string"?req.query.realm:null,state=typeof req.query.state==="string"?req.query.state:null
 const result=await getDbPool().query(`SELECT * FROM reading_stories WHERE deleted_at IS NULL AND ($1='' OR title ILIKE '%'||$1||'%' OR handle ILIKE '%'||$1||'%') AND ($2::text IS NULL OR realm=$2) AND ($3::text IS NULL OR workflow_state=$3) ORDER BY updated_at DESC LIMIT 500`,[q,realm,state])
 res.setHeader("Cache-Control","no-store");return res.json({books:result.rows.map(row=>({...readingBook(row),updated_at:row.updated_at,review_note:row.review_note})),count:result.rowCount,storefront_url:process.env.NEXT_PUBLIC_BASE_URL||"http://localhost:3000"})
}
export async function POST(req:MedusaRequest,res:MedusaResponse){try{const row=await saveDraftBook(req.body,undefined,undefined,accessOf(req)!);return res.status(201).json({book:readingBook(row)})}catch(error){return apiError(res,error)}}
