import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { getDbPool } from "../../../utils/db"
import { ReadingStoryInput, readingBook, writeReadingStory } from "../../../utils/reading-content"
export async function GET(_req:MedusaRequest,res:MedusaResponse) {
  const result=await getDbPool().query(`SELECT * FROM reading_stories WHERE deleted_at IS NULL ORDER BY updated_at DESC LIMIT 500`)
  return res.json({stories:result.rows.map(row=>({...readingBook(row),realm:row.realm,updated_at:row.updated_at})),count:result.rowCount,storefront_url:process.env.NEXT_PUBLIC_BASE_URL||"http://localhost:3000"})
}
export async function POST(req:MedusaRequest,res:MedusaResponse) {
  const input=ReadingStoryInput.safeParse(req.body)
  if(!input.success)return res.status(400).json({message:"Invalid story",errors:input.error.issues})
  try {const row=await writeReadingStory(input.data);return res.status(201).json({story:{...readingBook(row),realm:row.realm}})}
  catch(error:any){return res.status(error.code==="23505"?409:error.status||500).json({message:error.code==="23505"?"This handle is already used":"Unable to save story"})}
}
