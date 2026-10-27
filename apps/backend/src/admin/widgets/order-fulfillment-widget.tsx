import React from "react"
import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Badge, Text } from "@medusajs/ui"
import type { AdminOrder, AdminOrderFulfillment, AdminFulfillmentLabel } from "@medusajs/types"

type OrderWithShipments = Omit<AdminOrder, "fulfillments"> & { fulfillments?: (AdminOrderFulfillment & { labels?: AdminFulfillmentLabel[] })[] }

// Native fulfillment records determine shipping status. Creation is not payment capture.
const OrderFulfillmentWidget = ({ data }: { data: OrderWithShipments }) => {
  const shipments = data.fulfillments || []
  return <Container className="space-y-4 p-6" data-testid="order-fulfillment-summary">
    <Heading level="h2">الشحنات والتتبّع</Heading>
    {!shipments.length ? <Text className="text-ui-fg-subtle">لم تُسجّل شحنة لهذا الطلب بعد.</Text> : shipments.map(shipment => {
      const status = shipment.canceled_at ? "ملغاة" : shipment.delivered_at ? "تم التسليم" : shipment.shipped_at ? "تم الشحن" : "قيد التجهيز"
      return <div key={shipment.id} className="space-y-2 border-t border-ui-border-base pt-3">
        <div className="flex flex-wrap items-center justify-between gap-2"><Text className="font-mono text-xs">{shipment.id}</Text><Badge color={shipment.canceled_at ? "red" : shipment.delivered_at ? "green" : "grey"}>{status}</Badge></div>
        {(shipment.labels || []).map((label, index) => {
          let url: string | undefined
          try { const parsed = new URL(label.tracking_url || ""); if (["https:", "http:"].includes(parsed.protocol)) url = parsed.href } catch {}
          return <div key={label.id || index} className="text-sm">
            {label.tracking_number && <Text>رقم التتبع: <span className="font-mono select-all">{label.tracking_number}</span></Text>}
            {url && <a className="underline" href={url} target="_blank" rel="noopener noreferrer">فتح رابط التتبّع</a>}
          </div>
        })}
      </div>
    })}
  </Container>
}

export const config = defineWidgetConfig({ zone: "order.details.side.before" })
export default OrderFulfillmentWidget
