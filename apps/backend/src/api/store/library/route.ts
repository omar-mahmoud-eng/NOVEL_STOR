import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { Modules } from "@medusajs/framework/utils"
import { STORY_MODULE } from "../../../modules/story"
import { SUBSCRIPTION_MODULE } from "../../../modules/subscription"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const customerId = (req as any).auth_context?.actor_id || (req as any).user?.customer_id

  if (!customerId) {
    return res.status(401).json({
      code: "UNAUTHORIZED",
      message: "Authentication required to access personal digital library.",
    })
  }

  const orderModule = req.scope.resolve(Modules.ORDER) as any
  const storyService = req.scope.resolve(STORY_MODULE) as any
  const subscriptionService = req.scope.resolve(SUBSCRIPTION_MODULE) as any

  // 1. Check VIP Subscription Status
  const subCheck = await subscriptionService.isCustomerSubscribed(customerId)

  // 2. Query orders for the customer
  const orders = await orderModule.listOrders({
    customer_id: customerId,
  })

  const purchasedVariantIds = new Set<string>()
  for (const order of orders) {
    const fullOrder = await orderModule.retrieveOrder(order.id, {
      relations: ["items"],
    })
    for (const item of fullOrder.items || []) {
      if (item.variant_id) {
        purchasedVariantIds.add(item.variant_id)
      }
    }
  }

  // 3. Resolve digital media assets associated with purchased variants
  const libraryItems: any[] = []
  for (const variantId of purchasedVariantIds) {
    const mediaList = await storyService.listDigitalMedias({
      variant_id: variantId,
    })
    libraryItems.push(...mediaList)
  }

  return res.status(200).json({
    customer_id: customerId,
    vip_subscription: subCheck.isSubscribed
      ? {
          active: true,
          plan: subCheck.subscription.tier_id,
          expires_at: subCheck.subscription.current_period_end,
          remaining_credits: subCheck.subscription.remaining_credits,
        }
      : { active: false },
    library_count: libraryItems.length,
    items: libraryItems.map((item: any) => ({
      id: item.id,
      title: item.title,
      format: item.format,
      chapter_number: item.chapter_number,
      duration_seconds: item.duration_seconds,
      stream_endpoint: `/store/library/stream/${item.id}`,
    })),
  })
}
