import { model } from "@medusajs/framework/utils"

export const UserSubscription = model.define("user_subscription", {
  id: model.id().primaryKey(),
  customer_id: model.text(),
  tier_id: model.text(),
  status: model
    .enum(["active", "past_due", "cancelled", "paused", "expired"])
    .default("active"),
  current_period_start: model.dateTime(),
  current_period_end: model.dateTime(),
  cancel_at_period_end: model.boolean().default(false),
  remaining_credits: model.number().default(0),
  metadata: model.json().nullable(),
})

export default UserSubscription
