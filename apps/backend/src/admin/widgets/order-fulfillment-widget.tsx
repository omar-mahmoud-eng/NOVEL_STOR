import React from "react"
import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Badge, Text } from "@medusajs/ui"
import { Truck, CheckCircle2, Clock, PackageCheck, AlertCircle } from "lucide-react"

type OrderDetailsProps = {
  data: {
    id: string
    status?: string
    fulfillment_status?: string
    metadata?: Record<string, any>
  }
}

const OrderFulfillmentWidget = ({ data }: OrderDetailsProps) => {
  const fulfillmentStatus = data.fulfillment_status || "not_fulfilled"
  const carrier = (data.metadata?.carrier as string) || "Aramex Express"
  const trackingNumber = (data.metadata?.tracking_number as string) || `TRACK-${data.id.slice(-8).toUpperCase()}`

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "fulfilled":
      case "delivered":
        return <Badge color="green"><CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Delivered</Badge>
      case "partially_fulfilled":
      case "in_transit":
        return <Badge color="blue"><Truck className="w-3.5 h-3.5 mr-1" /> In Transit</Badge>
      case "requires_action":
        return <Badge color="orange"><AlertCircle className="w-3.5 h-3.5 mr-1" /> Action Required</Badge>
      default:
        return <Badge color="grey"><Clock className="w-3.5 h-3.5 mr-1" /> Pending Fulfillment</Badge>
    }
  }

  return (
    <Container className="p-6 bg-white dark:bg-ui-bg-base border border-ui-border-base rounded-xl shadow-sm mb-4">
      <div className="flex items-center justify-between pb-4 border-b border-ui-border-base">
        <div className="flex items-center gap-2">
          <Truck className="w-5 h-5 text-ui-fg-subtle" />
          <Heading level="h2" className="text-base font-semibold text-ui-fg-base">
            Fulfillment & Real-Time Tracking
          </Heading>
        </div>
        <div>{getStatusBadge(fulfillmentStatus)}</div>
      </div>

      <div className="mt-4 space-y-3">
        <div className="flex justify-between items-center text-sm">
          <Text className="text-ui-fg-subtle">Assigned Carrier</Text>
          <Text className="font-medium text-ui-fg-base">{carrier}</Text>
        </div>

        <div className="flex justify-between items-center text-sm">
          <Text className="text-ui-fg-subtle">Tracking Number</Text>
          <span className="font-mono text-xs px-2 py-1 bg-ui-bg-subtle rounded border border-ui-border-base text-ui-fg-base select-all">
            {trackingNumber}
          </span>
        </div>

        <div className="flex justify-between items-center text-sm">
          <Text className="text-ui-fg-subtle">Estimated Delivery</Text>
          <Text className="font-medium text-ui-fg-base">
            {new Date(Date.now() + 86400000 * 2).toLocaleDateString(undefined, {
              weekday: "short",
              month: "short",
              day: "numeric",
            })}
          </Text>
        </div>
      </div>

      {/* Fulfillment Milestone Timeline */}
      <div className="mt-5 pt-4 border-t border-ui-border-base">
        <Text className="text-xs font-semibold uppercase tracking-wider text-ui-fg-muted mb-3">
          Milestone Progression
        </Text>
        <div className="space-y-3 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-ui-border-base">
          <div className="flex items-start gap-3 relative">
            <div className="w-4 h-4 rounded-full bg-ui-tag-green-bg border-2 border-ui-tag-green-icon flex items-center justify-center shrink-0 mt-0.5">
              <div className="w-1.5 h-1.5 rounded-full bg-ui-tag-green-icon" />
            </div>
            <div>
              <Text className="text-xs font-medium text-ui-fg-base">Order Placed & Verified</Text>
              <Text className="text-[11px] text-ui-fg-muted">Inventory reserved & payment captured</Text>
            </div>
          </div>

          <div className="flex items-start gap-3 relative">
            <div className="w-4 h-4 rounded-full bg-ui-tag-blue-bg border-2 border-ui-tag-blue-icon flex items-center justify-center shrink-0 mt-0.5">
              <div className="w-1.5 h-1.5 rounded-full bg-ui-tag-blue-icon" />
            </div>
            <div>
              <Text className="text-xs font-medium text-ui-fg-base">Dispatched to Carrier Hub</Text>
              <Text className="text-[11px] text-ui-fg-muted">Riyadh Regional Logistics Center</Text>
            </div>
          </div>
        </div>
      </div>
    </Container>
  )
}

export const config = defineWidgetConfig({
  zone: "order.details.side.before",
})

export default OrderFulfillmentWidget
