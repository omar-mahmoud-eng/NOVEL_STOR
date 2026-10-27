const { S3Client, HeadBucketCommand, CreateBucketCommand, PutBucketCorsCommand } = require("@aws-sdk/client-s3")
const client = new S3Client({ endpoint: process.env.S3_ENDPOINT, region: process.env.S3_REGION || "us-east-1", forcePathStyle: true, credentials: { accessKeyId: process.env.S3_ACCESS_KEY, secretAccessKey: process.env.S3_SECRET_KEY } })
const Bucket = process.env.S3_BUCKET || "publishing-private-media"
async function main() {
  try { await client.send(new HeadBucketCommand({ Bucket })) }
  catch (error) { if (error.$metadata?.httpStatusCode !== 404) throw error; await client.send(new CreateBucketCommand({ Bucket })) }
  await client.send(new PutBucketCorsCommand({ Bucket, CORSConfiguration: { CORSRules: [{ AllowedOrigins: ["http://localhost:3000", "http://127.0.0.1:3000"], AllowedMethods: ["GET", "HEAD"], AllowedHeaders: ["Range", "Content-Type"], ExposeHeaders: ["Content-Length", "Content-Range", "Accept-Ranges"], MaxAgeSeconds: 3600 }] } }))
  console.log("Private S3 bucket and reader CORS are ready.")
}
main().catch(error => { console.error("Storage initialization failed:", error.name, error.$metadata?.httpStatusCode || ""); process.exitCode = 1 })
