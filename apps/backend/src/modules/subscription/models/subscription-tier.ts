import { model } from "@medusajs/framework/utils"

export const SubscriptionTier = model.define("subscription_tier", {
  id: model.id().primaryKey(),
  title: model.text(),
  handle: model.text().unique(),
  description: model.text().nullable(),
  interval: model.enum(["month", "year"]).default("month"),
  price_amount: model.number(),
  currency_code: model.text().default("sar"),
  book_credits_per_period: model.number().default(1),
  is_active: model.boolean().default(true),
  metadata: model.json().nullable(),
})

export default SubscriptionTier
