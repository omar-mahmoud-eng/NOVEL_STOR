import {
  createStep,
  createWorkflow,
  StepResponse,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { Modules } from "@medusajs/framework/utils"
import { STORY_MODULE } from "../../modules/story"
import { SUBSCRIPTION_MODULE } from "../../modules/subscription"
import { generateDrmPresignedUrl } from "../../utils/s3-drm"

export type VerifyMediaAccessInput = {
  media_id: string
  customer_id?: string
}

/**
 * Step 1: Resolves digital media asset record from the StoryModule
 */
export const resolveMediaDetailsStep = createStep(
  "resolve-media-details-step",
  async (input: VerifyMediaAccessInput, { container }) => {
    const storyService = container.resolve(STORY_MODULE) as any
    const media = await storyService.retrieveDigitalMedia(input.media_id)

    if (!media) {
      throw new Error(`Digital media asset with id "${input.media_id}" does not exist.`)
    }

    return new StepResponse({ media })
  }
)

/**
 * Step 2: Strict DRM Authorization Gatekeeper
 * Verifies direct variant purchase in Medusa Orders OR active VIP membership subscription.
 */
export const verifyCustomerLicenseStep = createStep(
  "verify-customer-license-step",
  async (
    input: { media: any; customer_id?: string },
    { container }
  ) => {
    // 1. Free sample previews bypass authorization
    if (input.media.is_sample) {
      return new StepResponse({
        authorized: true,
        reason: "free_public_sample",
      })
    }

    // 2. Full media requires authenticated customer
    if (!input.customer_id) {
      throw new Error("Authentication required: You must be logged in to stream full DRM protected content.")
    }

    const orderModule = container.resolve(Modules.ORDER) as any
    const subscriptionService = container.resolve(SUBSCRIPTION_MODULE) as any

    // 3. Check for direct variant purchase in customer's order history
    if (input.media.variant_id) {
      const orders = await orderModule.listOrders({
        customer_id: input.customer_id,
      })

      for (const order of orders) {
        const fullOrder = await orderModule.retrieveOrder(order.id, {
          relations: ["items"],
        })
        const hasPurchasedVariant = fullOrder.items?.some(
          (item: any) => item.variant_id === input.media.variant_id
        )

        if (hasPurchasedVariant) {
          return new StepResponse({
            authorized: true,
            reason: "direct_purchase",
            order_id: order.id,
          })
        }
      }
    }

    // 4. Fallback: Check for active VIP Reader & Listener Subscription
    const subCheck = await subscriptionService.isCustomerSubscribed(input.customer_id)
    if (subCheck.isSubscribed) {
      return new StepResponse({
        authorized: true,
        reason: "vip_subscription",
        subscription_id: subCheck.subscription.id,
      })
    }

    // 5. Access Denied: User has neither purchased nor subscribed
    throw new Error(
      "DRM Access Denied: This content is protected. Please purchase the digital edition or subscribe to the VIP Reader Pass."
    )
  }
)

/**
 * Step 3: Generates short-lived 60-second cryptographic pre-signed URL
 */
export const generateStreamTokenStep = createStep(
  "generate-stream-token-step",
  async (input: { media: any }) => {
    const streamUrl = await generateDrmPresignedUrl(
      input.media.private_storage_key,
      60 // 60 seconds strict expiration
    )

    return new StepResponse({
      stream_url: streamUrl,
      expires_in_seconds: 60,
      format: input.media.format,
      title: input.media.title,
      chapter_number: input.media.chapter_number,
      duration_seconds: input.media.duration_seconds,
      mime_type: input.media.mime_type,
    })
  }
)

/**
 * Complete DRM Protected Streaming Gatekeeper Workflow
 */
export const verifyMediaAccessWorkflow = createWorkflow(
  "verify-media-access-workflow",
  function (input: VerifyMediaAccessInput) {
    const mediaDetails = resolveMediaDetailsStep(input)

    verifyCustomerLicenseStep({
      media: mediaDetails.media,
      customer_id: input.customer_id,
    })

    const streamToken = generateStreamTokenStep({
      media: mediaDetails.media,
    })

    return new WorkflowResponse(streamToken)
  }
)

export default verifyMediaAccessWorkflow
