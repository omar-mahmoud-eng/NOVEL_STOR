import type { MedusaRequest,MedusaResponse } from "@medusajs/framework/http"
import { Modules } from "@medusajs/framework/utils"
import { HeadBucketCommand } from "@aws-sdk/client-s3"
import { getDbPool } from "../../../utils/db"
import { s3Client } from "../../../utils/s3-drm"
export async function GET(req:MedusaRequest,res:MedusaResponse){
 const pool=getDbPool();const [revenue,counts,shipments]=await Promise.all([
  pool.query(`SELECT currency_code,COALESCE(SUM(captured_amount),0)::text AS captured,COALESCE(SUM(refunded_amount),0)::text AS refunded,COUNT(*)::int AS collections FROM payment_collection WHERE deleted_at IS NULL GROUP BY currency_code ORDER BY currency_code`),
  pool.query(`SELECT (SELECT COUNT(*)::int FROM "order" WHERE deleted_at IS NULL) AS orders,(SELECT COUNT(*)::int FROM customer WHERE deleted_at IS NULL) AS customers,(SELECT COUNT(*)::int FROM product WHERE deleted_at IS NULL) AS products`),
  pool.query(`SELECT * FROM fulfillment_tracking WHERE deleted_at IS NULL ORDER BY created_at DESC LIMIT 50`)
 ])
 const health:{database:string;cache:string;storage:string}={database:"healthy",cache:"unavailable",storage:"unavailable"}
 try{await (req.scope.resolve(Modules.CACHE) as any).get("storyverse:health");health.cache="healthy"}catch{}
 try{await s3Client.send(new HeadBucketCommand({Bucket:process.env.S3_BUCKET||"publishing-private-media"}));health.storage="healthy"}catch{}
 res.setHeader("Cache-Control","no-store");return res.json({revenue:revenue.rows,counts:counts.rows[0],shipments:shipments.rows,health,generated_at:new Date().toISOString(),costs_configured:false})
}
