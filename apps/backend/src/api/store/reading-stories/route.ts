import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { getDbPool } from "../../../utils/db"
import { readingBook } from "../../../utils/reading-content"
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const realm=typeof req.query.realm==="string"?req.query.realm:null
  if(realm && !["originals","little","kids","teens"].includes(realm))return res.status(400).json({message:"Invalid realm"})
  const result=await getDbPool().query(`SELECT * FROM reading_stories WHERE status='published' AND deleted_at IS NULL AND ($1::text IS NULL OR realm=$1) ORDER BY created_at,id LIMIT 500`,[realm])
  res.setHeader("Cache-Control","no-store")
  return res.json({books:result.rows.map(readingBook),count:result.rowCount})
}
