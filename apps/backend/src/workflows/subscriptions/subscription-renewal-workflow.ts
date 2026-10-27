import {
  createStep,
  createWorkflow,
  StepResponse,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { SUBSCRIPTION_MODULE } from "../../modules/subscription"
import { getDbPool } from "../../utils/db"
import { nextBillingEnd } from "../../utils/billing-period"

export type SubscriptionRenewalInput = {
  user_subscription_id: string
}

/**
 * Step 1: Validates that the subscription is eligible for automatic renewal
 */
export const validateSubscriptionDueStep = createStep(
  "validate-subscription-due-step",
  async (input: SubscriptionRenewalInput, { container }) => {
    const subscriptionService = container.resolve(SUBSCRIPTION_MODULE) as any
    const subscription = await subscriptionService.retrieveUserSubscription(
      input.user_subscription_id
    )

    if (!subscription) {
      throw new Error(`User subscription "${input.user_subscription_id}" not found.`)
    }

    if (subscription.status !== "active" && subscription.status !== "past_due") {
      throw new Error(`Subscription status is "${subscription.status}". Cannot renew.`)
    }
    const periodEnd = new Date(subscription.current_period_end)
    if (!Number.isFinite(periodEnd.getTime()) || periodEnd > new Date()) throw new Error("Subscription is not due for renewal")

    if (subscription.cancel_at_period_end) {
      // Transition subscription to cancelled
      await subscriptionService.updateUserSubscriptions({
        id: subscription.id,
        status: "cancelled",
      })
      throw new Error("Subscription was marked to cancel at period end. Cancelled.")
    }

    const tier = await subscriptionService.retrieveSubscriptionTier(subscription.tier_id)
    if (!tier?.is_active) throw new Error("Subscription tier is inactive")

    return new StepResponse({ subscription, tier })
  }
)

/**
 * Step 2: Advances billing period and deposits VIP monthly book credits
 */
export const advanceBillingPeriodStep = createStep(
  "advance-billing-period-step",
  async (input: { subscription: any; tier: any }, { container }) => {
    const currentEnd = new Date(input.subscription.current_period_end)
    const nextStart = new Date(currentEnd)
    const nextEnd = nextBillingEnd(currentEnd, input.tier.interval)
    const additionalCredits = input.tier.book_credits_per_period ?? 0
    if (!Number.isSafeInteger(additionalCredits) || additionalCredits < 0) throw new Error("Invalid credit allocation")
    // A billing provider must record the verified paid-through date server-side.
    // A timer alone must never extend a paid subscription or issue free credits.
    const paidThrough = new Date(input.subscription.metadata?.paid_through || "")
    if (Number(input.tier.price_amount) > 0 && !(paidThrough >= nextEnd)) {
      await getDbPool().query(`UPDATE user_subscription SET status = 'past_due', updated_at = NOW()
        WHERE id = $1 AND current_period_end = $2 AND status = 'active'`, [input.subscription.id, currentEnd])
      throw new Error("Renewal payment has not been confirmed")
    }
    const result = await getDbPool().query(`
      UPDATE user_subscription SET status = 'active', current_period_start = $2, current_period_end = $3,
        remaining_credits = remaining_credits + $4, updated_at = NOW()
      WHERE id = $1 AND current_period_end = $2 AND current_period_end <= NOW()
        AND status IN ('active', 'past_due') AND cancel_at_period_end = false AND deleted_at IS NULL
      RETURNING *`, [input.subscription.id, nextStart, nextEnd, additionalCredits])
    if (!result.rowCount) throw new Error("Subscription was already renewed or changed")
    const updated = result.rows[0]
    const newCreditBalance = updated.remaining_credits

    return new StepResponse({
      subscription: updated,
      credits_added: additionalCredits,
      new_credit_balance: newCreditBalance,
      next_period_end: nextEnd.toISOString(),
    })
  }
)

/**
 * Complete Subscription Automatic Renewal & Book Credit Workflow
 */
export const subscriptionRenewalWorkflow = createWorkflow(
  "subscription-renewal-workflow",
  function (input: SubscriptionRenewalInput) {
    const validated = validateSubscriptionDueStep(input)
    const renewed = advanceBillingPeriodStep({
      subscription: validated.subscription,
      tier: validated.tier,
    })

    return new WorkflowResponse(renewed)
  }
)

export default subscriptionRenewalWorkflow
