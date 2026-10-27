import type{MedusaRequest,MedusaResponse}from"@medusajs/framework/http"
import{getDbPool}from"../../../../../utils/db"
import{sanitizeReadingState,type ReadingRealmId}from"@enterprise/schemas"
export async function GET(req:MedusaRequest,res:MedusaResponse){
 const owner=(req as any).auth_context.actor_id,pool=getDbPool(),profile=(await pool.query("SELECT id,name,realm,settings FROM reader_profiles WHERE id=$1 AND customer_id=$2 AND deleted_at IS NULL",[req.params.id,owner])).rows[0]
 if(!profile)return res.status(404).json({message:"ملف القراءة غير موجود"})
 if(!profile.settings?.reports)return res.status(403).json({message:"ملخصات هذا الملف غير مفعلة من إدارة الأسرة"})
 const row=(await pool.query("SELECT data,updated_at FROM reader_states WHERE customer_id=$1 AND profile_id=$2",[owner,profile.id])).rows[0],entries=sanitizeReadingState(row?.data)[profile.realm as ReadingRealmId].entries
 const ids=Object.keys(entries),published=ids.length?(await pool.query("SELECT id,published_snapshot->>'title' AS title FROM reading_stories WHERE id=ANY($1::text[]) AND status='published' AND deleted_at IS NULL AND published_snapshot->>'realm'=$2",[ids,profile.realm])).rows:[]
 const books=published.map(book=>({id:book.id,title:book.title,page:entries[book.id].page??null,furthest:entries[book.id].furthest??null,completed:entries[book.id].completed===true,saved:entries[book.id].saved===true}))
 res.setHeader("Cache-Control","private, no-store");return res.json({profile:{id:profile.id,name:profile.name,realm:profile.realm},books,completed:books.filter(book=>book.completed).length,last_synced_at:row?.updated_at||null})
}
