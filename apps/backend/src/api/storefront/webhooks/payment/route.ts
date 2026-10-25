import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import crypto from "crypto"

// In-memory or Redis-backed idempotency cache to prevent duplicate webhook processing
const processedWebhookEvents = new Set<string>()

/**
 * Validates cryptographic HMAC-SHA256 signatures with replay attack protection.
 */
function verifyHmacSignature(
  payload: string,
  signatureHeader: string,
  secret: string,
  toleranceSec = 300
): boolean {
  try {
    // Signature header format: "t=1614555555,v1=5257186dbcdf97975c4d..."
    const parts = signatureHeader.split(",")
    let timestamp = 0
    let signature = ""

    for (const part of parts) {
      const [key, val] = part.split("=")
      if (key === "t") timestamp = parseInt(val, 10)
      if (key === "v1") signature = val
    }

    if (!timestamp || !signature) {
      return false
    }

    // Replay attack prevention: verify timestamp within acceptable window
    const nowSec = Math.floor(Date.now() / 1000)
    if (Math.abs(nowSec - timestamp) > toleranceSec) {
      return false
    }

    // Compute expected signature over "timestamp.payload"
    const signedPayload = `${timestamp}.${payload}`
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(signedPayload, "utf8")
      .digest("hex")

    // Constant-time buffer comparison to prevent timing vulnerabilities
    const expectedBuf = Buffer.from(expectedSignature, "hex")
    const actualBuf = Buffer.from(signature, "hex")

    if (expectedBuf.length !== actualBuf.length) {
      return false
    }

    return crypto.timingSafeEqual(expectedBuf, actualBuf)
  } catch {
    return false
  }
}

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const signature = req.headers["stripe-signature"] as string | undefined
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!signature || !webhookSecret) {
    return res.status(400).json({
      code: "MISSING_SIGNATURE_OR_SECRET",
      message: "Webhook request rejected: Missing cryptographic signature header or webhook secret.",
    })
  }

  const rawBody = typeof req.body === "string" ? req.body : JSON.stringify(req.body)

  const isValid = verifyHmacSignature(rawBody, signature, webhookSecret)
  if (!isValid) {
    return res.status(401).json({
      code: "INVALID_SIGNATURE",
      message: "Webhook request rejected: Cryptographic signature verification failed or timestamp expired.",
    })
  }

  const event = typeof req.body === "string" ? JSON.parse(req.body) : req.body
  const eventId = event?.id

  // Enforce idempotency: prevent double-crediting or duplicate processing
  if (eventId && processedWebhookEvents.has(eventId)) {
    return res.status(200).json({
      status: "ignored",
      message: `Event ${eventId} has already been securely processed.`,
    })
  }

  if (eventId) {
    processedWebhookEvents.add(eventId)
    // Clean cache after 1 hour
    setTimeout(() => processedWebhookEvents.delete(eventId), 3600000)
  }

  // Handle payment success event
  switch (event.type) {
    case "payment_intent.succeeded": {
      const paymentIntent = event.data?.object
      const cartId = paymentIntent?.metadata?.cart_id
      
      // In production, trigger Medusa order completion workflow:
      // await completeCartWorkflow(container).run({ input: { cart_id: cartId } })
      
      return res.status(200).json({
        status: "success",
        processed_event: event.type,
        cart_id: cartId,
      })
    }

    case "payment_intent.payment_failed": {
      const paymentIntent = event.data?.object
      return res.status(200).json({
        status: "acknowledged",
        reason: paymentIntent?.last_payment_error?.message || "Payment authorization failed",
      })
    }

    default:
      return res.status(200).json({
        status: "unhandled_event_type",
        event_type: event.type,
      })
  }
}
