import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { getDbPool } from "../../../../utils/db"
import { publicReadingBook } from "../../../../utils/reading-content"
export async function GET(req: MedusaRequest,res:MedusaResponse) {
  const result=await getDbPool().query(`SELECT * FROM reading_stories WHERE (COALESCE(published_snapshot->>'handle',handle)=$1 OR id=$1) AND status='published' AND published_snapshot IS NOT NULL AND jsonb_typeof(published_snapshot)='object' AND deleted_at IS NULL`,[req.params.handle])
  res.setHeader("Cache-Control","no-store")
  if(!result.rowCount)return res.status(404).json({message:"Story not found"})
  return res.json({book:publicReadingBook(result.rows[0])})
}
