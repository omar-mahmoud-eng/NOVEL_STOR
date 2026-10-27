import type { ExecArgs } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import { repairMissingOrderSummaries } from "../utils/order-summary-repair"

export default async function repairOrderSummaries({ container }: ExecArgs) {
  const ids = process.env.ORDER_SUMMARY_REPAIR_IDS?.split(",").map(id => id.trim()).filter(Boolean)
  if (ids?.some(id => !/^order_[A-Za-z0-9_-]+$/.test(id))) throw new Error("Invalid order ID")
  const result = await repairMissingOrderSummaries(container.resolve(Modules.ORDER), process.env.ORDER_SUMMARY_REPAIR_APPLY === "true", ids)
  console.log(JSON.stringify(result))
}
