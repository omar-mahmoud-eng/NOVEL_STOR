import { S3Client, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

const S3_ENDPOINT = process.env.S3_ENDPOINT || "http://localhost:9005"
const S3_BUCKET = process.env.S3_BUCKET || "publishing-private-media"
const S3_REGION = process.env.S3_REGION || "us-east-1"
const S3_ACCESS_KEY = process.env.S3_ACCESS_KEY || process.env.MINIO_ROOT_USER
const S3_SECRET_KEY = process.env.S3_SECRET_KEY || process.env.MINIO_ROOT_PASSWORD

export const s3Client = new S3Client({
  region: S3_REGION,
  endpoint: S3_ENDPOINT,
  credentials: S3_ACCESS_KEY && S3_SECRET_KEY ? {
    accessKeyId: S3_ACCESS_KEY,
    secretAccessKey: S3_SECRET_KEY,
  } : undefined,
  forcePathStyle: true, // Required for MinIO
})

// Sign against the address that the browser can actually reach. Changing a
// signed URL's host after signing invalidates its AWS signature.
const signingClient = process.env.S3_PUBLIC_ENDPOINT
  ? new S3Client({
      region: S3_REGION,
      endpoint: process.env.S3_PUBLIC_ENDPOINT,
      credentials: S3_ACCESS_KEY && S3_SECRET_KEY ? { accessKeyId: S3_ACCESS_KEY, secretAccessKey: S3_SECRET_KEY } : undefined,
      forcePathStyle: true,
    })
  : s3Client

export function validateStorageKey(key: string): string {
  if (typeof key !== "string" || !key || key.length > 1024 || key.startsWith("/") || key.includes("\\") || /[\x00-\x1f\x7f]/.test(key) || key.split("/").some((part) => part === "." || part === ".." || !part)) {
    throw new Error("Invalid private storage key")
  }
  return key
}

/**
 * Generates a short-lived cryptographically signed pre-signed GET URL for DRM-protected streaming.
 * Strictly expires in 60 seconds to eliminate direct URL harvesting and piracy.
 */
export async function generateDrmPresignedUrl(
  privateStorageKey: string,
  expiresInSeconds = 60
): Promise<string> {
  if (!Number.isInteger(expiresInSeconds) || expiresInSeconds < 1 || expiresInSeconds > 60) throw new Error("Media URL expiry must be between 1 and 60 seconds")
  const command = new GetObjectCommand({
    Bucket: S3_BUCKET,
    Key: validateStorageKey(privateStorageKey),
  })

  return await getSignedUrl(signingClient, command, {
    expiresIn: expiresInSeconds,
  })
}

/**
 * Securely uploads a protected digital media asset (E-book or Audiobook chapter)
 * to the private non-public S3/MinIO bucket.
 */
export async function uploadPrivateMedia(
  storageKey: string,
  body: Buffer | Uint8Array,
  contentType = "application/octet-stream"
): Promise<{ bucket: string; key: string }> {
  const command = new PutObjectCommand({
    Bucket: S3_BUCKET,
    Key: validateStorageKey(storageKey),
    Body: body,
    ContentType: contentType,
  })

  await s3Client.send(command)

  return {
    bucket: S3_BUCKET,
    key: storageKey,
  }
}
