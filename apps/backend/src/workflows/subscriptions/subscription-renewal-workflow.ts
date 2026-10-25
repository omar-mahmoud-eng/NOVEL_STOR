import {
  createStep,
  createWorkflow,
  StepResponse,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { SUBSCRIPTION_MODULE } from "../../modules/subscription"

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

    if (subscription.cancel_at_period_end) {
      // Transition subscription to cancelled
      await subscriptionService.updateUserSubscriptions({
        id: subscription.id,
        status: "cancelled",
      })
      throw new Error("Subscription was marked to cancel at period end. Cancelled.")
    }

    const tier = await subscriptionService.retrieveSubscriptionTier(subscription.tier_id)

    return new StepResponse({ subscription, tier })
  }
)

/**
 * Step 2: Advances billing period and deposits VIP monthly book credits
 */
export const advanceBillingPeriodStep = createStep(
  "advance-billing-period-step",
  async (input: { subscription: any; tier: any }, { container }) => {
    const subscriptionService = container.resolve(SUBSCRIPTION_MODULE) as any

    const currentEnd = new Date(input.subscription.current_period_end || Date.now())
    const nextStart = new Date(currentEnd)
    const nextEnd = new Date(currentEnd)

    if (input.tier.interval === "year") {
      nextEnd.setFullYear(nextEnd.getFullYear() + 1)
    } else {
      nextEnd.setMonth(nextEnd.getMonth() + 1)
    }

    const additionalCredits = input.tier.book_credits_per_period || 1
    const newCreditBalance = (input.subscription.remaining_credits || 0) + additionalCredits

    const updated = await subscriptionService.updateUserSubscriptions({
      id: input.subscription.id,
      status: "active",
      current_period_start: nextStart.toISOString(),
      current_period_end: nextEnd.toISOString(),
      remaining_credits: newCreditBalance,
    })

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
