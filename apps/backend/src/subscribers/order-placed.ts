import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { Modules } from "@medusajs/framework/utils"

export default async function orderPlacedHandler({ event: { data }, container }: SubscriberArgs<{ id: string }>) {
  const logger = container.resolve("logger")
  const template = process.env.ORDER_NOTIFICATION_TEMPLATE
  if (!template) {
    logger.info(`[OrderPlaced] Order ${data.id}: confirmation delivery is not configured.`)
    return
  }
  const order = await container.resolve(Modules.ORDER).retrieveOrder(data.id, { relations: ["items"] })
  if (!order.email) return
  // A configured notification provider renders and delivers this template.
  // Fiscal invoices require their own compliant invoicing integration.
  await container.resolve(Modules.NOTIFICATION).createNotifications({
    to: order.email,
    channel: "email",
    template,
    data: { order_id: order.id, currency_code: order.currency_code, total: Number(order.total || 0), items: order.items },
    idempotency_key: `order-confirmation-${order.id}`,
  })
}

export const config: SubscriberConfig = { event: "order.placed" }
