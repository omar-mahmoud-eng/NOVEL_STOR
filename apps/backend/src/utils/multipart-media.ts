import {randomUUID,createHash} from "node:crypto"
import {CreateMultipartUploadCommand,UploadPartCommand,CompleteMultipartUploadCommand,AbortMultipartUploadCommand,HeadObjectCommand} from "@aws-sdk/client-s3"
import {z} from "zod"
import type {MedusaRequest,MedusaResponse} from "@medusajs/framework/http"
import {s3Client,generateDrmPresignedUrl} from "./s3-drm"
import {getDbPool} from "./db"
import {apiError} from "./api-error"
const bucket=()=>process.env.S3_BUCKET||"publishing-private-media"
export const mediaTypes:Record<string,string>={"application/pdf":"pdf","application/epub+zip":"epub","audio/mpeg":"mp3","audio/mp4":"m4b","audio/x-m4a":"m4a","audio/wav":"wav"}
export function validMediaHeader(type:string,body:Buffer){
 if(type==="application/pdf")return body.subarray(0,5).toString()==="%PDF-"
 if(type==="application/epub+zip")return body[0]===0x50&&body[1]===0x4b&&body[2]===3&&body[3]===4
 if(type==="audio/mpeg")return body.subarray(0,3).toString()==="ID3"||(body[0]===255&&(body[1]&224)===224)
 if(type==="audio/wav")return body.subarray(0,4).toString()==="RIFF"&&body.subarray(8,12).toString()==="WAVE"
 return ["audio/mp4","audio/x-m4a"].includes(type)&&body.subarray(4,8).toString()==="ftyp"
}
function actor(req:MedusaRequest){return(req as any).auth_context.actor_id as string}
export async function createUpload(req:MedusaRequest,res:MedusaResponse){
 try{
  const input=z.object({filename:z.string().min(1).max(200),mime_type:z.enum(Object.keys(mediaTypes) as [string,...string[]]),total_bytes:z.number().int().min(12).max(2*1024**3)}).parse(req.body)
  const active=await getDbPool().query("SELECT count(*)::int AS count FROM media_upload_sessions WHERE actor_id=$1 AND status='uploading' AND expires_at>now()",[actor(req)])
  if(active.rows[0].count>=10)return res.status(429).json({message:"أكمل أو ألغِ عمليات الرفع السابقة أولًا"})
  const id="upload_"+randomUUID(),key=`protected/uploads/${randomUUID()}.${mediaTypes[input.mime_type]}`
  const created=await s3Client.send(new CreateMultipartUploadCommand({Bucket:bucket(),Key:key,ContentType:input.mime_type}))
  try{await getDbPool().query(`INSERT INTO media_upload_sessions(id,actor_id,filename,mime_type,total_bytes,part_size,storage_key,upload_id) VALUES($1,$2,$3,$4,$5,8388608,$6,$7)`,[id,actor(req),input.filename,input.mime_type,input.total_bytes,key,created.UploadId])}
  catch(error){await s3Client.send(new AbortMultipartUploadCommand({Bucket:bucket(),Key:key,UploadId:created.UploadId}));throw error}
  return res.status(201).json({id,part_size:8388608,parts:[]})
 }catch(error){return apiError(res,error)}
}
async function owned(req:MedusaRequest,client:any,lock=false){
 const row=(await client.query(`SELECT * FROM media_upload_sessions WHERE id=$1 AND actor_id=$2 ${lock?"FOR UPDATE":""}`,[req.params.id,actor(req)])).rows[0]
 if(!row)throw Object.assign(new Error("جلسة الرفع غير موجودة"),{status:404})
 if(new Date(row.expires_at).getTime()<Date.now()&&row.status==="uploading")throw Object.assign(new Error("انتهت جلسة الرفع؛ ابدأ رفعًا جديدًا"),{status:410})
 return row
}
export async function uploadStatus(req:MedusaRequest,res:MedusaResponse){try{
 const row=await owned(req,getDbPool()),parts=(await getDbPool().query("SELECT part_number,bytes,checksum FROM media_upload_parts WHERE session_id=$1 ORDER BY part_number",[row.id])).rows
 res.setHeader("Cache-Control","no-store");return res.json({id:row.id,status:row.status,filename:row.filename,total_bytes:Number(row.total_bytes),mime_type:row.mime_type,part_size:row.part_size,parts,...(row.status==="completed"?{key:row.storage_key,preview_url:await generateDrmPresignedUrl(row.storage_key)}:{})})
 }catch(error){return apiError(res,error)}}
export async function uploadPart(req:MedusaRequest,res:MedusaResponse){
 const client=await getDbPool().connect()
 try{
  const part=Number(req.params.part);if(!Number.isInteger(part)||part<1)throw Object.assign(new Error("رقم الجزء غير صالح"),{status:400})
  // Read a bounded part before taking the database lock; slow clients cannot
  // occupy the upload lock or force the entire file into memory.
  const chunks:Buffer[]=[];let bytes=0
  for await(const chunk of req){bytes+=chunk.length;if(bytes>8388608)throw Object.assign(new Error("حجم الجزء أكبر من المسموح"),{status:413});chunks.push(Buffer.from(chunk))}
  const body=Buffer.concat(chunks),checksum=createHash("sha256").update(body).digest("hex")
  await client.query("BEGIN");const row=await owned(req,client,true),count=Math.ceil(Number(row.total_bytes)/row.part_size)
  if(row.status!=="uploading")throw Object.assign(new Error("جلسة الرفع غير نشطة"),{status:409})
  if(part>count||bytes!==(part===count?Number(row.total_bytes)-(count-1)*row.part_size:row.part_size))throw Object.assign(new Error("حجم الجزء لا يطابق الملف"),{status:400})
  if(part===1&&!validMediaHeader(row.mime_type,body))throw Object.assign(new Error("محتوى الملف لا يطابق الصيغة المختارة"),{status:415})
  const old=(await client.query("SELECT checksum FROM media_upload_parts WHERE session_id=$1 AND part_number=$2",[row.id,part])).rows[0]
  if(old&&old.checksum!==checksum)throw Object.assign(new Error("الملف المختار مختلف عن الملف الذي بدأت رفعه"),{status:409})
  if(!old){const result=await s3Client.send(new UploadPartCommand({Bucket:bucket(),Key:row.storage_key,UploadId:row.upload_id,PartNumber:part,Body:body}));await client.query("INSERT INTO media_upload_parts(session_id,part_number,etag,checksum,bytes) VALUES($1,$2,$3,$4,$5)",[row.id,part,result.ETag,checksum,bytes])}
  await client.query("UPDATE media_upload_sessions SET updated_at=now() WHERE id=$1",[row.id]);await client.query("COMMIT");return res.json({part_number:part,bytes})
 }catch(error){await client.query("ROLLBACK");return apiError(res,error)}finally{client.release()}
}
export async function finishUpload(req:MedusaRequest,res:MedusaResponse){
 const client=await getDbPool().connect()
 try{
  await client.query("BEGIN");const row=await owned(req,client,true)
  if(row.status==="aborted")throw Object.assign(new Error("أُلغي الرفع"),{status:409})
  const parts=(await client.query("SELECT part_number,etag,bytes FROM media_upload_parts WHERE session_id=$1 ORDER BY part_number",[row.id])).rows
  if(parts.length!==Math.ceil(Number(row.total_bytes)/row.part_size)||parts.reduce((sum,p)=>sum+p.bytes,0)!==Number(row.total_bytes))throw Object.assign(new Error("لم يكتمل رفع جميع الأجزاء"),{status:409})
  if(row.status!=="completed"){
   let present=false
   try{const head=await s3Client.send(new HeadObjectCommand({Bucket:bucket(),Key:row.storage_key}));present=head.ContentLength===Number(row.total_bytes)}catch(error:any){if(![404,"NotFound","NoSuchKey"].includes(error.$metadata?.httpStatusCode)&&!["NotFound","NoSuchKey"].includes(error.name))throw error}
   if(!present)await s3Client.send(new CompleteMultipartUploadCommand({Bucket:bucket(),Key:row.storage_key,UploadId:row.upload_id,MultipartUpload:{Parts:parts.map(p=>({PartNumber:p.part_number,ETag:p.etag}))}}))
   const head=await s3Client.send(new HeadObjectCommand({Bucket:bucket(),Key:row.storage_key}));if(head.ContentLength!==Number(row.total_bytes))throw new Error("Uploaded size verification failed")
   await client.query("UPDATE media_upload_sessions SET status='completed',updated_at=now() WHERE id=$1",[row.id])
  }
  await client.query("COMMIT");return res.json({id:row.id,key:row.storage_key,mime_type:row.mime_type,file_size_bytes:Number(row.total_bytes),preview_url:await generateDrmPresignedUrl(row.storage_key)})
 }catch(error){await client.query("ROLLBACK");return apiError(res,error)}finally{client.release()}
}
export async function abortUpload(req:MedusaRequest,res:MedusaResponse){
 const client=await getDbPool().connect()
 try{await client.query("BEGIN");const row=await owned(req,client,true);if(row.status==="completed")throw Object.assign(new Error("الملف مكتمل؛ إزالة ربطه تتم من بيانات الكتاب"),{status:409});if(row.status==="uploading")await s3Client.send(new AbortMultipartUploadCommand({Bucket:bucket(),Key:row.storage_key,UploadId:row.upload_id}));await client.query("UPDATE media_upload_sessions SET status='aborted',updated_at=now() WHERE id=$1",[row.id]);await client.query("COMMIT");return res.json({cancelled:true})}catch(error){await client.query("ROLLBACK");return apiError(res,error)}finally{client.release()}
}
