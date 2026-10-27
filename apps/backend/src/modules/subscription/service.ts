import { MedusaService } from "@medusajs/framework/utils"
import { SubscriptionTier } from "./models/subscription-tier"
import { UserSubscription } from "./models/user-subscription"
import { getDbPool } from "../../utils/db"

export class SubscriptionModuleService extends MedusaService({
  SubscriptionTier,
  UserSubscription,
}) {
  /**
   * Evaluates whether a customer possesses an active VIP reader subscription.
   */
  async isCustomerSubscribed(customerId: string): Promise<{
    isSubscribed: boolean
    subscription?: any
    tier?: any
  }> {
    const subscriptions = await (this as any).listUserSubscriptions({
      customer_id: customerId,
      status: "active",
    }, { take: null })

    const now = new Date()
    for (const sub of subscriptions) {
      if (!(new Date(sub.current_period_start) <= now && new Date(sub.current_period_end) > now)) continue
      const tier = await (this as any).retrieveSubscriptionTier(sub.tier_id)
      if (tier?.is_active) return { isSubscribed: true, subscription: sub, tier }
    }

    return { isSubscribed: false }
  }

  /**
   * Consumes one reader credit to unlock an audiobook or e-book.
   */
  async consumeCredit(userSubscriptionId: string): Promise<any> {
    const result = await getDbPool().query(`
      UPDATE user_subscription SET remaining_credits = remaining_credits - 1, updated_at = NOW()
      WHERE id = $1 AND deleted_at IS NULL AND status = 'active'
        AND current_period_start <= NOW() AND current_period_end > NOW() AND remaining_credits >= 1
      RETURNING *`, [userSubscriptionId])
    if (!result.rowCount) throw new Error("No active subscription with remaining book credits.")
    return result.rows[0]
  }
}

export default SubscriptionModuleService
