import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { Modules, PaymentWebhookEvents } from "@medusajs/framework/utils"
import { verifyHmacSignature } from "../../../../utils/webhook-signature"
import { z } from "zod"

const eventSchema = z.object({ id: z.string().min(1).max(255), type: z.string().min(1), data: z.object({ object: z.record(z.string(), z.unknown()) }) })

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const signature = req.headers["stripe-signature"]
  const secret = process.env.STRIPE_WEBHOOK_SECRET
  if (!secret || !process.env.STRIPE_API_KEY) return res.status(503).json({ code: "PAYMENT_PROVIDER_NOT_CONFIGURED", message: "Stripe is not configured." })
  if (typeof signature !== "string") return res.status(400).json({ code: "MISSING_SIGNATURE" })
  if (!Buffer.isBuffer(req.rawBody) && typeof req.rawBody !== "string") return res.status(400).json({ code: "RAW_BODY_REQUIRED" })
  if (!verifyHmacSignature(req.rawBody, signature, secret)) return res.status(401).json({ code: "INVALID_SIGNATURE" })
  let event
  try {
    event = eventSchema.parse(JSON.parse(req.rawBody.toString()))
  } catch {
    return res.status(400).json({ code: "INVALID_EVENT" })
  }
  try {
    const eventBus = req.scope.resolve(Modules.EVENT_BUS)
    await eventBus.emit({ name: PaymentWebhookEvents.WebhookReceived, data: {
      provider: "stripe_stripe", payload: { data: event, rawData: req.rawBody, headers: req.headers },
    } }, { delay: 5000, attempts: 3 })
    return res.status(200).json({ status: "queued", event_id: event.id })
  } catch {
    return res.status(503).json({ code: "PAYMENT_QUEUE_UNAVAILABLE" })
  }
}
