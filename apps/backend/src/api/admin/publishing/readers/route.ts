import type{MedusaRequest,MedusaResponse}from"@medusajs/framework/http"
import{getDbPool}from"../../../../utils/db"
import{can,accessOf}from"../../../../utils/publishing-access"
import{purchasedVariantIds}from"../../../../utils/media-licenses"
export async function GET(req:MedusaRequest,res:MedusaResponse){
 const pool=getDbPool(),id=typeof req.query.customer_id==="string"?req.query.customer_id:null,q=typeof req.query.q==="string"?req.query.q.slice(0,200):""
 res.setHeader("Cache-Control","no-store")
 if(!id){const customers=(await pool.query("SELECT id,email,first_name,last_name,created_at FROM customer WHERE deleted_at IS NULL AND ($1='' OR email ILIKE '%'||$1||'%' OR first_name ILIKE '%'||$1||'%' OR last_name ILIKE '%'||$1||'%') ORDER BY created_at DESC LIMIT 50",[q])).rows;return res.json({customers})}
 const customer=(await pool.query("SELECT id,email,first_name,last_name,phone,created_at FROM customer WHERE id=$1 AND deleted_at IS NULL",[id])).rows[0]
 if(!customer)return res.status(404).json({message:"القارئ غير موجود"})
 const orders=can(accessOf(req),"orders.read")?(await pool.query('SELECT id,display_id,status,currency_code,created_at,is_draft_order FROM "order" WHERE customer_id=$1 AND deleted_at IS NULL ORDER BY created_at DESC LIMIT 100',[id])).rows:[]
 const tickets=can(accessOf(req),"support.read")?(await pool.query("SELECT id,ticket_number,subject,status,priority,created_at FROM support_tickets WHERE customer_id=$1 ORDER BY created_at DESC LIMIT 100",[id])).rows:[]
 const subscriptions=(await pool.query("SELECT id,tier_id,status,remaining_credits,current_period_end FROM user_subscription WHERE customer_id=$1 AND deleted_at IS NULL ORDER BY created_at DESC LIMIT 30",[id])).rows
 const events=(await pool.query("SELECT realm,kind,count(*)::int AS count FROM reading_events e JOIN reader_states s USING(customer_id,profile_id) WHERE e.customer_id=$1 AND s.analytics_opt_in=true GROUP BY realm,kind",[id])).rows
 const variants=[...await purchasedVariantIds(req.scope,id)]
 const licenses=variants.length?(await pool.query(`SELECT d.id,d.title,d.format,d.variant_id,v.product_id FROM digital_media d JOIN product_variant v ON v.id=d.variant_id AND v.deleted_at IS NULL WHERE d.variant_id=ANY($1::text[]) AND d.deleted_at IS NULL AND d.is_sample=false ORDER BY d.chapter_number`,[variants])).rows:[]
 return res.json({customer,orders,tickets,subscriptions,licenses,reading:events,privacy:"لا تعرض لوحة الإدارة نص الملاحظات أو حالة القراءة الخاصة. إحصاءات القراءة تتطلب اختيار المشاركة."})
}
