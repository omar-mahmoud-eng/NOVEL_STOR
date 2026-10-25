import {
  createStep,
  createWorkflow,
  StepResponse,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { Modules } from "@medusajs/framework/utils"
import { STORY_MODULE } from "../../modules/story"

export type BundlePricingInput = {
  cart_id: string
  currency_code: string
  region_id: string
  items: Array<{
    variant_id: string
    quantity: number
  }>
}

export type CalculatedLineItem = {
  variant_id: string
  title: string
  format: "physical" | "ebook" | "audiobook" | "standard"
  unit_price: number
  quantity: number
  discount_amount: number
  final_subtotal: number
}

/**
 * Step 1: Resolves base prices and classifies format from StoryModule links
 */
export const classifyItemFormatsStep = createStep(
  "classify-item-formats-step",
  async (input: BundlePricingInput, { container }) => {
    const productModule = container.resolve(Modules.PRODUCT) as any
    const pricingModule = container.resolve(Modules.PRICING) as any
    const storyService = container.resolve(STORY_MODULE) as any

    const evaluatedItems: CalculatedLineItem[] = []

    for (const item of input.items) {
      const variant = await productModule.retrieveProductVariant(item.variant_id)
      if (!variant) {
        throw new Error(`Variant "${item.variant_id}" not found.`)
      }

      // Query database prices
      const prices = await pricingModule.listPrices({
        price_set_id: [variant.id],
      })
      const matchingPrice = prices.find(
        (p: any) => p.currency_code?.toLowerCase() === input.currency_code.toLowerCase()
      )

      if (!matchingPrice || typeof matchingPrice.amount !== "number") {
        throw new Error(`No valid pricing configured for variant "${item.variant_id}".`)
      }

      // Detect format from digital media links or variant title
      const digitalMedia = await storyService.listDigitalMedias({
        variant_id: variant.id,
      })

      let format: "physical" | "ebook" | "audiobook" | "standard" = "standard"
      if (digitalMedia.some((m: any) => m.format.startsWith("ebook"))) {
        format = "ebook"
      } else if (digitalMedia.some((m: any) => m.format.startsWith("audio"))) {
        format = "audiobook"
      } else if (variant.manage_inventory) {
        format = "physical"
      }

      evaluatedItems.push({
        variant_id: item.variant_id,
        title: variant.title,
        format,
        unit_price: matchingPrice.amount,
        quantity: item.quantity,
        discount_amount: 0,
        final_subtotal: matchingPrice.amount * item.quantity,
      })
    }

    return new StepResponse({ items: evaluatedItems })
  }
)

/**
 * Step 2: Authoritatively applies Multi-Format Bundling Discounts (e.g. 50% off second format)
 */
export const applyMultiFormatDiscountsStep = createStep(
  "apply-multi-format-discounts-step",
  async (input: { items: CalculatedLineItem[]; currency_code: string }) => {
    const hasEbook = input.items.some((i) => i.format === "ebook")
    const hasAudiobook = input.items.some((i) => i.format === "audiobook")
    const hasPhysical = input.items.some((i) => i.format === "physical")

    let totalSubtotal = 0
    let totalDiscount = 0

    const processedItems = input.items.map((item) => {
      let discount = 0

      // Bundle Rule: If buying E-book + Audiobook together, 50% discount on the Audiobook
      if (hasEbook && hasAudiobook && item.format === "audiobook") {
        discount = Math.round(item.unit_price * 0.5 * item.quantity)
      }
      // Bundle Rule: If buying Physical + E-Book, 50% discount on the E-book
      else if (hasPhysical && hasEbook && item.format === "ebook") {
        discount = Math.round(item.unit_price * 0.5 * item.quantity)
      }

      const finalSub = item.unit_price * item.quantity - discount
      totalSubtotal += finalSub
      totalDiscount += discount

      return {
        ...item,
        discount_amount: discount,
        final_subtotal: finalSub,
      }
    })

    const vatRate = 15 // 15% VAT
    const taxTotal = Math.round(totalSubtotal * (vatRate / 100))
    const grandTotal = totalSubtotal + taxTotal

    return new StepResponse({
      items: processedItems,
      subtotal: totalSubtotal,
      total_discount: totalDiscount,
      tax_rate: vatRate,
      tax_total: taxTotal,
      total: grandTotal,
      currency_code: input.currency_code,
    })
  }
)

/**
 * Complete Multi-Format Publishing Bundle Pricing Workflow
 */
export const bundlePricingWorkflow = createWorkflow(
  "bundle-pricing-workflow",
  function (input: BundlePricingInput) {
    const classified = classifyItemFormatsStep(input)
    const calculation = applyMultiFormatDiscountsStep({
      items: classified.items,
      currency_code: input.currency_code,
    })

    return new WorkflowResponse(calculation)
  }
)

export default bundlePricingWorkflow
