export function isPaidOrder(order: any): boolean {
  if (["canceled", "cancelled"].includes(order.status)) return false
  const total = Number(order.total)
  if (!Number.isFinite(total) || total < 0) return false
  if (total === 0) return true
  const captured = (order.payment_collections || []).reduce((sum: number, collection: any) => {
    const amount = Number(collection.captured_amount || 0) - Number(collection.refunded_amount || 0)
    return sum + (Number.isFinite(amount) ? amount : 0)
  }, 0)
  return captured >= total
}

export async function purchasedVariantIds(container: any, customerId: string): Promise<Set<string>> {
  const query = container.resolve("query")
  const variants = new Set<string>()
  let skip = 0
  while (true) {
    const { data: orders } = await query.graph({
      entity: "order",
      fields: ["id", "status", "total", "items.variant_id", "payment_collections.captured_amount", "payment_collections.refunded_amount"],
      filters: { customer_id: customerId },
      pagination: { skip, take: 100 },
    })
    for (const order of orders) {
      if (!isPaidOrder(order)) continue
      for (const item of order.items || []) if (item.variant_id) variants.add(item.variant_id)
    }
    if (orders.length < 100) return variants
    skip += orders.length
  }
}
