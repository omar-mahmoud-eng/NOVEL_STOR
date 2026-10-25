import { Module } from "@medusajs/framework/utils"
import { FulfillmentTrackerModuleService } from "./service"

export const FULFILLMENT_TRACKER_MODULE = "fulfillmentTrackerModuleService"

export default Module(FULFILLMENT_TRACKER_MODULE, {
  service: FulfillmentTrackerModuleService,
})
