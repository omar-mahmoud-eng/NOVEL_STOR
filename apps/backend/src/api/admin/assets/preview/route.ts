import type{MedusaRequest,MedusaResponse}from"@medusajs/framework/http"
import{getDbPool}from"../../../../utils/db"
import{generateDrmPresignedUrl}from"../../../../utils/s3-drm"
import{apiError}from"../../../../utils/api-error"
export async function POST(req:MedusaRequest,res:MedusaResponse){try{
 const key=String((req.body as any)?.key||"")
 const row=await getDbPool().query(`SELECT private_storage_key FROM digital_media WHERE private_storage_key=$1 UNION SELECT storage_key FROM media_upload_sessions WHERE storage_key=$1 AND status='completed' LIMIT 1`,[key])
 if(!row.rowCount)return res.status(404).json({message:"احفظ ربط الملف بالكتاب قبل المعاينة"})
 res.setHeader("Cache-Control","no-store");return res.json({url:await generateDrmPresignedUrl(key),expires_in:60})
 }catch(error){return apiError(res,error)}}
