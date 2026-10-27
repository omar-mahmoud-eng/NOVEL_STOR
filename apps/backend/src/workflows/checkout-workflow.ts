import {
  createStep,
  createWorkflow,
  StepResponse,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { Modules } from "@medusajs/framework/utils"
import { PricingInputSchema, resolveVariantPrice, roundMoney } from "../utils/variant-price"

export type SecureCheckoutWorkflowInput = {
  cart_id: string
  currency_code: string
  region_id: string
  items: Array<{
    variant_id: string
    quantity: number
  }>
}

export type ValidatedLineItem = {
  variant_id: string
  title: string
  quantity: number
  unit_price: number
  subtotal: number
}

/**
 * Step 1: Validate line items against database pricing tables
 * Strictly discards any price passed by the client and pulls authoritative price lists.
 */
export const validateLineItemsPriceStep = createStep(
  "validate-line-items-price-step",
  async (input: SecureCheckoutWorkflowInput, { container }) => {
    PricingInputSchema.parse(input)

    const validatedItems: ValidatedLineItem[] = []
    let totalSubtotal = 0

    for (const item of input.items) {
      const { variant, amount: unitPrice } = await resolveVariantPrice(container, item.variant_id, input.currency_code, input.region_id, item.quantity)
      const subtotal = roundMoney(unitPrice * item.quantity)

      validatedItems.push({
        variant_id: item.variant_id,
        title: variant.title,
        quantity: item.quantity,
        unit_price: unitPrice,
        subtotal,
      })

      totalSubtotal += subtotal
    }

    return new StepResponse({
      validatedItems,
      subtotal: roundMoney(totalSubtotal),
    })
  }
)

/**
 * Step 2: Atomic Inventory Reservation with compensation logic
 * Prevents overselling during high-concurrency checkout traffic.
 */
export const reserveInventoryStep = createStep(
  "reserve-inventory-step",
  async (
    input: {
      cart_id: string
      items: ValidatedLineItem[]
    },
    { container }
  ) => {
    const inventoryModule = container.resolve(Modules.INVENTORY)
    const locking = container.resolve(Modules.LOCKING)
    const query = container.resolve("query")
    const { data: carts } = await query.graph({ entity: "cart", fields: ["id", "sales_channel_id"], filters: { id: input.cart_id } })
    if (!carts[0]?.sales_channel_id) throw new Error("Cart sales channel is missing")
    const { data: channels } = await query.graph({ entity: "sales_channel", fields: ["id", "stock_locations.id"], filters: { id: carts[0].sales_channel_id } })
    const locations = new Set((channels[0]?.stock_locations || []).map((location: any) => location.id))
    const { data: variants } = await query.graph({ entity: "product_variant", fields: ["id", "manage_inventory", "allow_backorder", "inventory_items.inventory_item_id", "inventory_items.required_quantity"], filters: { id: input.items.map((item) => item.variant_id) } })
    const keys = variants.flatMap((variant: any) => variant.manage_inventory ? (variant.inventory_items || []).map((link: any) => link.inventory_item_id) : [])
    const reservationIds: string[] = []
    await locking.execute(keys, async () => {
      try {
        for (const item of input.items) {
          const variant = variants.find((value: any) => value.id === item.variant_id)
          if (!variant) throw new Error("Variant not found")
          if (!variant.manage_inventory) continue
          if (!variant.inventory_items?.length) throw new Error("Managed variant has no inventory link")
          for (const link of variant.inventory_items) {
            let remaining = item.quantity * (link.required_quantity ?? 1)
            if (!Number.isSafeInteger(remaining) || remaining <= 0) throw new Error("Invalid reservation quantity")
            const levels = await inventoryModule.listInventoryLevels({ inventory_item_id: link.inventory_item_id })
            const eligible = levels.filter((level) => locations.has(level.location_id))
            for (const level of eligible) {
              const available = Math.max(0, Number(level.stocked_quantity) - Number(level.reserved_quantity))
              const quantity = Math.min(remaining, available)
              if (!quantity) continue
              const reservation = await inventoryModule.createReservationItems({ inventory_item_id: link.inventory_item_id, location_id: level.location_id, quantity, description: "Checkout reservation for " + input.cart_id })
              reservationIds.push(reservation.id)
              remaining -= quantity
              if (!remaining) break
            }
            if (remaining && variant.allow_backorder && eligible[0]) {
              const reservation = await inventoryModule.createReservationItems({ inventory_item_id: link.inventory_item_id, location_id: eligible[0].location_id, quantity: remaining, allow_backorder: true })
              reservationIds.push(reservation.id)
              remaining = 0
            }
            if (remaining) throw new Error("Insufficient stock for " + item.title)
          }
        }
      } catch (error) {
        if (reservationIds.length) await inventoryModule.deleteReservationItems(reservationIds)
        throw error
      }
    })
    return new StepResponse({ reservationIds }, reservationIds)
  },
  // Compensation function triggered automatically on subsequent step failure
  async (reservationIds, { container }) => {
    if (!reservationIds || reservationIds.length === 0) return
    const inventoryModule = container.resolve(Modules.INVENTORY)
    const reservations = await inventoryModule.listReservationItems({ id: reservationIds })
    const keys = [...new Set(reservations.map((reservation) => reservation.inventory_item_id))]
    await container.resolve(Modules.LOCKING).execute(keys, () => inventoryModule.deleteReservationItems(reservationIds))
  }
)

/**
 * Step 3: Server-side Tax and Discount Calculation
 * Calculates VAT taxes (e.g. 15% standard in Saudi Arabia, 5% in UAE)
 */
export const calculateTaxesAndTotalsStep = createStep(
  "calculate-taxes-and-totals-step",
  async (
    input: {
      subtotal: number
      region_id: string
      currency_code: string
    },
    { container }
  ) => {
    const taxModule = container.resolve(Modules.TAX)
    const region = await container.resolve(Modules.REGION).retrieveRegion(input.region_id, { relations: ["countries"] })
    const countryCode = region.countries?.[0]?.iso_2
    if (!countryCode) throw new Error("No tax country configured for region")
    const taxRegions = await taxModule.listTaxRegions({ country_code: countryCode })
    const taxRegion = taxRegions.find((value) => !value.province_code)
    if (!taxRegion) throw new Error("Tax region is not configured")
    const taxRates = await taxModule.listTaxRates({
      tax_region_id: taxRegion.id,
    })

    const defaultRate = taxRates.find((rate) => rate.is_default)
    if (!defaultRate) throw new Error("Default tax rate is not configured")
    const defaultTaxRate = Number(defaultRate.rate ?? 0)
    const taxTotal = roundMoney(input.subtotal * (defaultTaxRate / 100))
    const total = roundMoney(input.subtotal + taxTotal)

    return new StepResponse({
      subtotal: input.subtotal,
      tax_rate: defaultTaxRate,
      tax_total: taxTotal,
      total,
      currency_code: input.currency_code,
    })
  }
)

/**
 * Complete Zero Price Manipulation Secure Checkout Workflow
 */
export const secureCheckoutWorkflow = createWorkflow(
  "secure-checkout-workflow",
  function (input: SecureCheckoutWorkflowInput) {
    const priceValidation = validateLineItemsPriceStep(input)

    const reservation = reserveInventoryStep({
      cart_id: input.cart_id,
      items: priceValidation.validatedItems,
    })

    const calculation = calculateTaxesAndTotalsStep({
      subtotal: priceValidation.subtotal,
      region_id: input.region_id,
      currency_code: input.currency_code,
    })

    return new WorkflowResponse({
      items: priceValidation.validatedItems,
      subtotal: calculation.subtotal,
      tax_rate: calculation.tax_rate,
      tax_total: calculation.tax_total,
      total: calculation.total,
      currency_code: calculation.currency_code,
      reservation_ids: reservation.reservationIds,
    })
  }
)

export default secureCheckoutWorkflow
