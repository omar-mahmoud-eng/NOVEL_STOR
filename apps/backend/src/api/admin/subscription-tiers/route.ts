import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { z } from "zod"
import { SUBSCRIPTION_MODULE } from "../../../modules/subscription"

const CreateTierSchema = z.object({
  title: z.string().min(2, "Title is required").max(100),
  handle: z.string().min(2).max(100),
  description: z.string().max(1000).optional(),
  interval: z.enum(["month", "year"]).default("month"),
  price_amount: z.number().int().positive(),
  currency_code: z.string().default("sar"),
  book_credits_per_period: z.number().int().min(0).default(1),
  is_active: z.boolean().default(true),
})

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const subscriptionService = req.scope.resolve(SUBSCRIPTION_MODULE) as any
  const tiers = await subscriptionService.listSubscriptionTiers({})

  return res.status(200).json({
    tiers,
    count: tiers.length,
  })
}

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const subscriptionService = req.scope.resolve(SUBSCRIPTION_MODULE) as any

  try {
    const validated = CreateTierSchema.parse(req.body)
    const [tier] = await subscriptionService.createSubscriptionTiers([validated])

    return res.status(201).json({
      tier,
    })
  } catch (error: any) {
    return res.status(400).json({
      code: "INVALID_TIER_DATA",
      message: error.message || "Failed creating subscription tier",
    })
  }
}
