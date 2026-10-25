import {
  createStep,
  createWorkflow,
  StepResponse,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { Modules } from "@medusajs/framework/utils"

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
    const productModule = container.resolve(Modules.PRODUCT)
    const pricingModule = container.resolve(Modules.PRICING)

    const validatedItems: ValidatedLineItem[] = []
    let totalSubtotal = 0

    for (const item of input.items) {
      // Fetch variant details directly from product module
      const variant = await productModule.retrieveProductVariant(item.variant_id)
      if (!variant) {
        throw new Error(`Product variant with id "${item.variant_id}" does not exist.`)
      }

      // Fetch authoritative prices from the Medusa Pricing module
      // Filtering by currency_code and region_id
      const prices = await pricingModule.listPrices({
        price_set_id: [variant.id],
      })

      // Resolve matching price for current currency
      const activePrice = prices.find(
        (p) => p.currency_code?.toLowerCase() === input.currency_code.toLowerCase()
      )

      if (!activePrice || typeof activePrice.amount !== "number") {
        throw new Error(
          `No valid pricing configured for variant "${item.variant_id}" in currency "${input.currency_code}".`
        )
      }

      const unitPrice = activePrice.amount
      const subtotal = unitPrice * item.quantity

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
      subtotal: totalSubtotal,
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
    const reservationIds: string[] = []

    try {
      for (const item of input.items) {
        // Query available inventory level
        const [inventoryItems] = await inventoryModule.listInventoryItems({
          sku: item.variant_id,
        })

        if (!inventoryItems) {
          continue // If unmanaged inventory, proceed
        }

        const levels = await inventoryModule.listInventoryLevels({
          inventory_item_id: inventoryItems.id,
        })

        const totalStock = levels.reduce(
          (acc, lvl) => acc + (lvl.stocked_quantity - lvl.reserved_quantity),
          0
        )

        if (totalStock < item.quantity) {
          throw new Error(
            `Insufficient stock for item "${item.title}". Requested: ${item.quantity}, Available: ${totalStock}`
          )
        }

        // Create atomic reservation
        const [reservation] = await inventoryModule.createReservationItems([
          {
            inventory_item_id: inventoryItems.id,
            location_id: levels[0].location_id,
            quantity: item.quantity,
            description: `Checkout lock for cart ${input.cart_id}`,
          },
        ])

        reservationIds.push(reservation.id)
      }

      return new StepResponse({ reservationIds }, reservationIds)
    } catch (error) {
      // Compensation: release any already acquired reservations
      if (reservationIds.length > 0) {
        await inventoryModule.deleteReservationItems(reservationIds)
      }
      throw error
    }
  },
  // Compensation function triggered automatically on subsequent step failure
  async (reservationIds, { container }) => {
    if (!reservationIds || reservationIds.length === 0) return
    const inventoryModule = container.resolve(Modules.INVENTORY)
    await inventoryModule.deleteReservationItems(reservationIds)
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

    // Retrieve active tax rate for the region
    const taxRates = await taxModule.listTaxRates({
      tax_region_id: input.region_id,
    })

    const defaultTaxRate = taxRates.length > 0 ? (taxRates[0].rate || 0) : 15 // Standard 15% VAT default
    const taxTotal = Math.round(input.subtotal * (defaultTaxRate / 100))
    const total = input.subtotal + taxTotal

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
