import type{MedusaRequest,MedusaResponse}from"@medusajs/framework/http"
import{z}from"zod"
import{getDbPool}from"../../../../utils/db"
import{apiError}from"../../../../utils/api-error"
export function csvCell(value:unknown){const text=String(value??"");return '"'+(/^[\s]*[=+@-]/.test(text)?"'"+text:text).replace(/"/g,'""')+'"'}
export async function GET(req:MedusaRequest,res:MedusaResponse){try{
 const date=z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine(s=>Number.isFinite(Date.parse(s)))
 const input=z.object({from:date.default(new Date(Date.now()-30*86400000).toISOString().slice(0,10)),to:date.default(new Date().toISOString().slice(0,10)),realm:z.enum(["originals","little","kids","teens"]).optional(),story_id:z.string().max(150).optional(),author:z.string().max(150).optional(),format:z.enum(["json","csv"]).default("json")}).parse(req.query)
 if(input.from>input.to||Date.parse(input.to)-Date.parse(input.from)>366*86400000)return res.status(400).json({message:"اختر فترة مرتبة لا تتجاوز سنة"})
 const rows=await getDbPool().query(`SELECT e.story_id,COALESCE(r.published_snapshot->>'title',r.title,e.story_id) AS title,e.realm,r.published_snapshot->'data'->'author'->>'name' AS author,
 count(*)::int AS events,count(DISTINCT (e.customer_id,e.profile_id))::int AS readers,
 count(DISTINCT (e.customer_id,e.profile_id)) FILTER(WHERE e.kind='progress')::int AS started,
 count(DISTINCT (e.customer_id,e.profile_id)) FILTER(WHERE e.kind='completed')::int AS completed,
 count(*) FILTER(WHERE e.kind='saved')::int AS saves,max(e.page) AS furthest_segment
 FROM reading_events e JOIN reader_states s ON s.customer_id=e.customer_id AND s.profile_id=e.profile_id AND s.analytics_opt_in=true
 LEFT JOIN reading_stories r ON r.id=e.story_id WHERE e.created_at>=$1::date AND e.created_at<($2::date+interval '1 day')
 AND ($3::text IS NULL OR e.realm=$3) AND ($4::text IS NULL OR e.story_id=$4) AND ($5::text IS NULL OR r.published_snapshot->'data'->'author'->>'name' ILIKE '%'||$5||'%')
 GROUP BY e.story_id,r.title,r.published_snapshot,e.realm ORDER BY readers DESC,e.story_id LIMIT 1000`,[input.from,input.to,input.realm||null,input.story_id||null,input.author||null])
 res.setHeader("Cache-Control","no-store")
 if(input.format==="csv"){const columns=["story_id","title","realm","author","readers","started","completed","saves","furthest_segment","events"];res.setHeader("Content-Type","text/csv; charset=utf-8");res.setHeader("Content-Disposition",'attachment; filename="reading-report.csv"');return res.send("\uFEFF"+[columns.map(csvCell).join(","),...rows.rows.map(row=>columns.map(key=>csvCell(row[key])).join(","))].join("\r\n"))}
 return res.json({rows:rows.rows,filters:input,generated_at:new Date().toISOString(),privacy:"أحداث فعلية من الحسابات التي اختارت المشاركة فقط. المقاطع ليست صفحات مطبوعة، والإكمال تصريح من القارئ. الاستيراد الأول لا يُحسب نشاطًا جديدًا."})
 }catch(error){return apiError(res,error)}}
