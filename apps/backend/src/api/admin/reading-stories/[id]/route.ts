import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { z } from "zod"
import { getDbPool } from "../../../../utils/db"
import { ReadingStoryInput, readingBook, writeReadingStory } from "../../../../utils/reading-content"
import {accessOf,can}from"../../../../utils/publishing-access"
import {transitionBook}from"../../../../utils/publishing-books"
export async function GET(req:MedusaRequest,res:MedusaResponse) {
  const result=await getDbPool().query(`SELECT * FROM reading_stories WHERE id=$1 AND deleted_at IS NULL`,[req.params.id])
  if(!result.rowCount)return res.status(404).json({message:"Story not found"})
  const row=result.rows[0];return res.json({story:{...readingBook(row),realm:row.realm}})
}
export async function POST(req:MedusaRequest,res:MedusaResponse) {
  const input=ReadingStoryInput.extend({revision:z.number().int().min(1)}).safeParse(req.body)
  if(!input.success)return res.status(400).json({message:"Invalid story",errors:input.error.issues})
  try {const before=(await getDbPool().query("SELECT status FROM reading_stories WHERE id=$1 AND deleted_at IS NULL",[req.params.id])).rows[0];if(accessOf(req)?.role!=="admin"&&input.data.status==="published"&&before?.status!=="published")return res.status(403).json({message:"أرسل المسودة للمراجعة أولًا"});const row=await writeReadingStory(input.data,req.params.id,input.data.revision,{actorId:accessOf(req)?.user_id,preservePublished:accessOf(req)?.role!=="admin"});return res.json({story:{...readingBook(row),realm:row.realm}})}
  catch(error:any){return res.status(error.code==="23505"?409:error.status||500).json({message:error.code==="23505"?"This handle is already used":error.status===409?error.message:"Unable to save story"})}
}
export async function DELETE(req:MedusaRequest,res:MedusaResponse) {
  if(!can(accessOf(req),"content.publish"))return res.status(403).json({message:"الأرشفة تتطلب صلاحية النشر"})
  const result=await getDbPool().query(`UPDATE reading_stories SET deleted_at=now(),status='archived',revision=revision+1 WHERE id=$1 AND deleted_at IS NULL RETURNING id`,[req.params.id])
  if(!result.rowCount)return res.status(404).json({message:"Story not found"})
  return res.json({id:req.params.id,deleted:true})
}
