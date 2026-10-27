import type{MedusaRequest,MedusaResponse}from"@medusajs/framework/http"
import{z}from"zod"
import{getDbPool}from"../../../utils/db"
import{publicReadingBook}from"../../../utils/reading-content"
import{sanitizeReadingState}from"@enterprise/schemas"
export async function GET(req:MedusaRequest,res:MedusaResponse){
 const input=z.object({realm:z.enum(["originals","little","kids","teens"]),profile_id:z.string().max(100).default("")}).safeParse(req.query)
 if(!input.success)return res.status(400).json({message:"Invalid realm"})
 const {realm,profile_id}=input.data,id=(req as any).auth_context?.actor_id,pool=getDbPool()
 if(profile_id){const profile=id?(await pool.query("SELECT realm FROM reader_profiles WHERE id=$1 AND customer_id=$2 AND deleted_at IS NULL",[profile_id,id])).rows[0]:null;if(!profile||profile.realm!==realm)return res.status(404).json({message:"ملف القراءة غير موجود في هذه المنصة"})}
 const state=id?(await pool.query("SELECT data FROM reader_states WHERE customer_id=$1 AND profile_id=$2",[id,profile_id])).rows[0]?.data:null,entries=sanitizeReadingState(state)[realm].entries
 const published=(await pool.query("SELECT * FROM reading_stories WHERE status='published' AND deleted_at IS NULL AND jsonb_typeof(published_snapshot)='object' AND published_snapshot->>'realm'=$1 ORDER BY published_at DESC NULLS LAST,id",[realm])).rows.map(publicReadingBook)
 const genres=new Map<string,number>();for(const book of published){const entry=entries[book.id];if(entry?.saved||entry?.completed)genres.set(book.genre,(genres.get(book.genre)||0)+1)}
 const recommendations=published.filter(book=>!entries[book.id]?.completed).map((book,index)=>({book,score:(genres.get(book.genre)||0)*10+(entries[book.id]?.saved?3:0),index,reason:genres.has(book.genre)?"من نفس نوع حكايات حفظتها أو أكملتها في هذه المنصة":"حكاية منشورة في منصة القراءة المختارة"})).sort((a,b)=>b.score-a.score||a.index-b.index).slice(0,6).map(({book,reason})=>({...book,recommendation_reason:reason}))
 res.setHeader("Cache-Control","private, no-store");return res.json({recommendations,personalized:genres.size>0,realm})
}
