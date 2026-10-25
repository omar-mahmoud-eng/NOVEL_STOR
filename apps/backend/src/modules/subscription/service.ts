import { MedusaService } from "@medusajs/framework/utils"
import { SubscriptionTier } from "./models/subscription-tier"
import { UserSubscription } from "./models/user-subscription"

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
  }> {
    const subscriptions = await (this as any).listUserSubscriptions({
      customer_id: customerId,
      status: "active",
    })

    const now = new Date()
    const activeSub = subscriptions.find(
      (sub: any) => new Date(sub.current_period_end) > now
    )

    if (activeSub) {
      return { isSubscribed: true, subscription: activeSub }
    }

    return { isSubscribed: false }
  }

  /**
   * Consumes one reader credit to unlock an audiobook or e-book.
   */
  async consumeCredit(userSubscriptionId: string): Promise<any> {
    const sub = await (this as any).retrieveUserSubscription(userSubscriptionId)
    if (sub.remaining_credits <= 0) {
      throw new Error("No remaining book credits in the current billing period.")
    }

    return await (this as any).updateUserSubscriptions({
      id: userSubscriptionId,
      remaining_credits: sub.remaining_credits - 1,
    })
  }
}

export default SubscriptionModuleService
