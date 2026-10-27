import { z } from "zod"
import { Modules } from "@medusajs/framework/utils"

export const PricingInputSchema = z.object({
  cart_id: z.string().min(1), currency_code: z.string().regex(/^[a-zA-Z]{3}$/), region_id: z.string().min(1),
  items: z.array(z.object({ variant_id: z.string().min(1), quantity: z.number().int().min(1).max(100) }).strict()).min(1).max(100),
}).strict()

export async function resolveVariantPrice(container: any, variantId: string, currency: string, regionId: string, quantity: number) {
  const query = container.resolve("query")
  const { data } = await query.graph({ entity: "product_variant", fields: ["id", "title", "product_id", "manage_inventory", "price_set.id"], filters: { id: variantId } })
  const variant = data[0]
  if (!variant?.price_set?.id) throw new Error(`No price set for variant ${variantId}`)
  const pricing = container.resolve(Modules.PRICING)
  const [price] = await pricing.calculatePrices({ id: [variant.price_set.id] }, { context: { currency_code: currency.toLowerCase(), region_id: regionId, quantity } })
  const amount = price?.calculated_amount == null ? NaN : Number(price.calculated_amount)
  if (!Number.isFinite(amount) || amount < 0) throw new Error(`No valid price for variant ${variantId}`)
  return { variant, amount }
}

export function roundMoney(amount: number): number { return Math.round((amount + Number.EPSILON) * 100) / 100 }
