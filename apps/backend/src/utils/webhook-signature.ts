import { createHmac, timingSafeEqual } from "node:crypto"

export function verifyHmacSignature(payload: Buffer | string, header: string, secret: string, toleranceSec = 300): boolean {
  const parts = header.split(",").map((part) => part.trim().split("="))
  const timestamps = parts.filter(([key]) => key === "t")
  if (timestamps.length !== 1 || !/^\d+$/.test(timestamps[0][1] || "")) return false
  const timestamp = Number(timestamps[0][1])
  if (!Number.isSafeInteger(timestamp) || Math.abs(Math.floor(Date.now() / 1000) - timestamp) > toleranceSec) return false
  const expected = createHmac("sha256", secret).update(`${timestamp}.`).update(payload).digest()
  return parts.filter(([key, signature]) => key === "v1" && /^[a-fA-F0-9]{64}$/.test(signature || ""))
    .some(([, signature]) => timingSafeEqual(expected, Buffer.from(signature, "hex")))
}
