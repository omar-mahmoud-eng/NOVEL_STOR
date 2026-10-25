import { model } from "@medusajs/framework/utils"

export const FulfillmentTracking = model.define("fulfillment_tracking", {
  id: model.id().primaryKey(),
  order_id: model.text().unique(),
  tracking_number: model.text(),
  carrier: model.text(),
  status: model.enum([
    "pending",
    "processing",
    "in_transit",
    "out_for_delivery",
    "delivered",
    "returned",
    "failed",
  ]).default("pending"),
  estimated_delivery_date: model.dateTime().nullable(),
  tracking_events: model.json().nullable(),
})

export default FulfillmentTracking
