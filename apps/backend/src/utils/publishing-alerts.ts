import {createHash,randomUUID} from "node:crypto"
import {HeadBucketCommand,HeadObjectCommand,AbortMultipartUploadCommand} from "@aws-sdk/client-s3"
import {Modules} from "@medusajs/framework/utils"
import {getDbPool} from "./db"
import {s3Client} from "./s3-drm"
export async function alert(input:{fingerprint:string;kind:string;title:string;message:string;severity?:string;resource_url?:string}){
 await getDbPool().query(`INSERT INTO publishing_alerts(id,fingerprint,kind,severity,title,message,resource_url) VALUES($1,$2,$3,$4,$5,$6,$7) ON CONFLICT(fingerprint) DO UPDATE SET occurrences=publishing_alerts.occurrences+1,message=EXCLUDED.message,last_seen_at=now(),resolved_at=NULL,acknowledged_by=CASE WHEN publishing_alerts.resolved_at IS NOT NULL THEN NULL ELSE publishing_alerts.acknowledged_by END,acknowledged_at=CASE WHEN publishing_alerts.resolved_at IS NOT NULL THEN NULL ELSE publishing_alerts.acknowledged_at END`,["alert_"+randomUUID(),input.fingerprint,input.kind,input.severity||"warning",input.title,input.message,input.resource_url||null])
}
export function redactClientMessage(value:string){return value.replace(/https?:\/\/[^\s)]+/g,"[url]").replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi,"[email]").replace(/\beyJ[\w.-]+/g,"[token]").replace(/(password|token|secret|authorization|cookie)\s*[:=]\s*[^\s,;]+/gi,"$1=[redacted]").slice(0,600)}
export async function recordClientError(input:{message:string;path:string;source:string}){
 const message=redactClientMessage(input.message),path=input.path.split(/[?#]/)[0].slice(0,250)
 if(!message||/AbortError|ResizeObserver loop|Failed to fetch dynamically imported module/.test(message))return
 const fingerprint="client:"+createHash("sha256").update(input.source+path+message.replace(/\d+/g,"#")).digest("hex")
 await alert({fingerprint,kind:"client_error",title:input.source==="admin"?"خطأ في لوحة الإدارة":"خطأ في واجهة القراءة",message,resource_url:input.source==="admin"&&path.startsWith("/app/")?path:undefined})
}
export async function monitorPublishing(container:any){
 const client=await getDbPool().connect();let locked=false
 try{
  locked=(await client.query("SELECT pg_try_advisory_lock(hashtext('publishing-monitor')) AS locked")).rows[0].locked;if(!locked)return
  for(const kind of ["cache","storage"]){let healthy=true;try{if(kind==="cache")await container.resolve(Modules.CACHE).get("storyverse:monitor");else await s3Client.send(new HeadBucketCommand({Bucket:process.env.S3_BUCKET||"publishing-private-media"}))}catch{healthy=false}
   const fingerprint="health:"+kind
   if(healthy)await client.query("UPDATE publishing_alerts SET resolved_at=now() WHERE fingerprint=$1 AND resolved_at IS NULL",[fingerprint]);else await alert({fingerprint,kind:"health",severity:"critical",title:kind==="cache"?"تعذر الاتصال بذاكرة التخزين المؤقت":"تعذر الاتصال بالتخزين الخاص",message:"راجع الخدمة وإعدادات الاتصال ثم حدّث فحص الصحة",resource_url:"/app/publishing-operations"})
  }
  const expired=(await client.query("SELECT * FROM media_upload_sessions WHERE status='uploading' AND expires_at<now() ORDER BY expires_at LIMIT 20")).rows
  for(const row of expired){try{await s3Client.send(new AbortMultipartUploadCommand({Bucket:process.env.S3_BUCKET||"publishing-private-media",Key:row.storage_key,UploadId:row.upload_id}));await client.query("UPDATE media_upload_sessions SET status='aborted',updated_at=now() WHERE id=$1",[row.id])}catch{await alert({fingerprint:"upload-expired:"+row.id,kind:"storage",title:"تعذر تنظيف رفع منتهي",message:row.filename})}}
  const media=(await client.query("SELECT d.id,v.product_id,d.private_storage_key,d.title FROM digital_media d LEFT JOIN product_variant v ON v.id=d.variant_id AND v.deleted_at IS NULL WHERE d.deleted_at IS NULL ORDER BY random() LIMIT 30")).rows
  for(const item of media){try{await s3Client.send(new HeadObjectCommand({Bucket:process.env.S3_BUCKET||"publishing-private-media",Key:item.private_storage_key}));await client.query("UPDATE publishing_alerts SET resolved_at=now() WHERE fingerprint=$1 AND resolved_at IS NULL",["media:"+item.id])}catch(error:any){if(error.$metadata?.httpStatusCode===404)await alert({fingerprint:"media:"+item.id,kind:"missing_media",title:"ملف مرتبط غير موجود",message:item.title||item.id,resource_url:item.product_id?"/app/products/"+item.product_id:"/app/publishing"})}}
  await client.query("DELETE FROM customer_stepups WHERE expires_at<now()")
 }finally{if(locked)await client.query("SELECT pg_advisory_unlock(hashtext('publishing-monitor'))");client.release()}
}
