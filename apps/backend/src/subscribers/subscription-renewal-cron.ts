import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { SUBSCRIPTION_MODULE } from "../modules/subscription"
import { subscriptionRenewalWorkflow } from "../workflows/subscriptions/subscription-renewal-workflow"

export default async function subscriptionRenewalCronHandler({
  container,
}: SubscriberArgs<Record<string, any>>) {
  const logger = container.resolve("logger") as any
  const subscriptionService = container.resolve(SUBSCRIPTION_MODULE) as any

  logger.info("[Worker:SubscriptionRenewal] Commencing scheduled scan for renewing subscriptions...")

  try {
    const activeSubs = await subscriptionService.listUserSubscriptions({
      status: "active",
    })

    const now = new Date()
    let renewedCount = 0
    let failedCount = 0

    for (const sub of activeSubs) {
      const periodEnd = new Date(sub.current_period_end)

      // Renew if current period has ended or expires within the current hour
      if (periodEnd <= now) {
        try {
          logger.info(`[Worker:SubscriptionRenewal] Renewing subscription: ${sub.id} (Customer: ${sub.customer_id})`)

          await subscriptionRenewalWorkflow(container).run({
            input: {
              user_subscription_id: sub.id,
            },
          })

          renewedCount++
        } catch (err) {
          logger.error(`[Worker:SubscriptionRenewal] Failed renewal for sub ${sub.id}: ${err}`)
          failedCount++
        }
      }
    }

    logger.info(
      `[Worker:SubscriptionRenewal] Batch completed: ${renewedCount} renewed, ${failedCount} errors.`
    )
  } catch (error) {
    logger.error(`[Worker:SubscriptionRenewal] Critical worker failure: ${error}`)
  }
}

export const config: SubscriberConfig = {
  event: "subscription.check_renewals",
}
