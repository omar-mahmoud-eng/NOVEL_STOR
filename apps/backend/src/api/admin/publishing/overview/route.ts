import type{MedusaRequest,MedusaResponse}from"@medusajs/framework/http"
import{getDbPool}from"../../../../utils/db"
import{accessOf,can}from"../../../../utils/publishing-access"
import{monitorPublishing}from"../../../../utils/publishing-alerts"
export async function GET(req:MedusaRequest,res:MedusaResponse){
 const access=accessOf(req),tasks:any[]=[],counts:Record<string,number>={},pool=getDbPool()
 if(can(access,"content.read")){
  const rows=await pool.query(`SELECT id,title,workflow_state,data,realm,updated_at FROM reading_stories WHERE deleted_at IS NULL AND (workflow_state IN ('review','approved') OR COALESCE(data->>'coverUrl','')='' OR COALESCE(data->>'description','')='') ORDER BY updated_at LIMIT 100`)
  for(const row of rows.rows)tasks.push({id:row.id,title:row.title,reason:row.workflow_state==="review"?"يحتاج مراجعة":row.workflow_state==="approved"?"جاهز للنشر":"المسودة تحتاج استكمالًا",url:"/app/publishing",realm:row.realm})
  for(const row of (await pool.query("SELECT workflow_state,count(*)::int AS count FROM reading_stories WHERE deleted_at IS NULL GROUP BY workflow_state")).rows)counts[row.workflow_state]=row.count
 }
 if(can(access,"support.read")){const rows=await pool.query("SELECT id,subject,priority FROM support_tickets WHERE status IN ('open','in_progress') ORDER BY CASE WHEN priority='urgent' THEN 0 ELSE 1 END,created_at LIMIT 30");for(const row of rows.rows)tasks.push({id:row.id,title:row.subject,reason:row.priority==="urgent"?"دعم عاجل":"طلب دعم مفتوح",url:"/app/helpdesk/inbox"})}
 if(can(access,"orders.read")){counts.pending_orders=(await pool.query(`SELECT count(*)::int AS count FROM "order" WHERE status='pending' AND deleted_at IS NULL AND is_draft_order=false`)).rows[0].count;tasks.push({id:"orders",title:"طلبات قيد التنفيذ",reason:String(counts.pending_orders),url:"/app/orders"})}
 if(can(access,"inventory.read"))tasks.push({id:"stock",title:"مراجعة المخزون والشحن",reason:"المخزون الفعلي من Medusa",url:"/app/warehouse"})
 const alerts=can(access,"reports.read")?(await pool.query("SELECT * FROM publishing_alerts WHERE resolved_at IS NULL ORDER BY CASE WHEN severity='critical' THEN 0 ELSE 1 END,last_seen_at DESC LIMIT 30")).rows:[]
 res.setHeader("Cache-Control","no-store");return res.json({tasks,counts,alerts,generated_at:new Date().toISOString(),role:access?.role})
}
export async function POST(req:MedusaRequest,res:MedusaResponse){if(!can(accessOf(req),"reports.read"))return res.status(403).json({message:"لا توجد صلاحية فحص الصحة"});await monitorPublishing(req.scope);return GET(req,res)}
