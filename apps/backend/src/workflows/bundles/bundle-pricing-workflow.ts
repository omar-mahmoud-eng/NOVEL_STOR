import {
  createStep,
  createWorkflow,
  StepResponse,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { Modules } from "@medusajs/framework/utils"
import { STORY_MODULE } from "../../modules/story"
import { PricingInputSchema, resolveVariantPrice, roundMoney } from "../../utils/variant-price"
import { calculateTaxesAndTotalsStep } from "../checkout-workflow"

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
  product_id?: string
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
    PricingInputSchema.parse(input)
    const storyService = container.resolve(STORY_MODULE) as any

    const evaluatedItems: CalculatedLineItem[] = []

    for (const item of input.items) {
      const { variant, amount } = await resolveVariantPrice(container, item.variant_id, input.currency_code, input.region_id, item.quantity)

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
        product_id: variant.product_id,
        variant_id: item.variant_id,
        title: variant.title,
        format,
        unit_price: amount,
        quantity: item.quantity,
        discount_amount: 0,
        final_subtotal: amount * item.quantity,
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
    return new StepResponse(calculateBundleTotals(input.items, input.currency_code))
  }
)

export function calculateBundleTotals(items: CalculatedLineItem[], currency: string) {
  const groups = new Map<string, Record<string, number>>()
  for (const item of items) {
    const key = item.product_id || item.variant_id
    const group = groups.get(key) || { ebook: 0, audiobook: 0, physical: 0 }
    group[item.format] = (group[item.format] || 0) + item.quantity
    groups.set(key, group)
  }
  const remaining = new Map([...groups].map(([id, group]) => [id, { audiobook: Math.min(group.ebook, group.audiobook), ebook: Math.min(group.physical, group.ebook) }]))
  let subtotal = 0, totalDiscount = 0
  const processed = items.map((item) => {
    const budget = remaining.get(item.product_id || item.variant_id)!
    const discountedUnits = item.format === "audiobook" || item.format === "ebook" ? Math.min(item.quantity, budget[item.format]) : 0
    if (item.format === "audiobook" || item.format === "ebook") budget[item.format] -= discountedUnits
    const discount = roundMoney(item.unit_price * 0.5 * discountedUnits)
    const final = roundMoney(item.unit_price * item.quantity - discount)
    subtotal += final; totalDiscount += discount
    return { ...item, discount_amount: discount, final_subtotal: final }
  })
  return { items: processed, subtotal: roundMoney(subtotal), total_discount: roundMoney(totalDiscount), currency_code: currency }
}

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

    const totals = calculateTaxesAndTotalsStep({ subtotal: calculation.subtotal, region_id: input.region_id, currency_code: input.currency_code })
    return new WorkflowResponse({ items: calculation.items, total_discount: calculation.total_discount, subtotal: totals.subtotal, tax_rate: totals.tax_rate, tax_total: totals.tax_total, total: totals.total, currency_code: totals.currency_code })
  }
)

export default bundlePricingWorkflow
