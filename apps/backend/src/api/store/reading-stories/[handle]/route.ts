import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { getDbPool } from "../../../../utils/db"
import { readingBook } from "../../../../utils/reading-content"
export async function GET(req: MedusaRequest,res:MedusaResponse) {
  const result=await getDbPool().query(`SELECT * FROM reading_stories WHERE (handle=$1 OR id=$1) AND status='published' AND deleted_at IS NULL`,[req.params.handle])
  res.setHeader("Cache-Control","no-store")
  if(!result.rowCount)return res.status(404).json({message:"Story not found"})
  return res.json({book:readingBook(result.rows[0])})
}
