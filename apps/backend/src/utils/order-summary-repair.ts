import { randomUUID } from "node:crypto"
import { createRawPropertiesFromBigNumber } from "@medusajs/framework/utils"
import { calculateOrderChange } from "@medusajs/order/dist/utils/calculate-order-change"
import { getDbPool } from "./db"

// Use Medusa's own initial-order calculator; never infer payment from status,
// alter historical prices, or synthesize summaries across order-edit history.
export function initialOrderSummary(order: any) {
  if (order.version !== 1 || order.credit_lines?.length) throw new Error("Only unchanged initial orders without credit lines can be repaired automatically")
  const calculated = calculateOrderChange({ order, transactions: order.transactions || [], actions: [] })
  createRawPropertiesFromBigNumber(calculated)
  return calculated.summary
}

export async function repairMissingOrderSummaries(orderService: any, apply = false, ids?: string[]) {
  const client = await getDbPool().connect()
  const report: { apply: boolean; repaired: string[]; candidates: string[]; skipped: { id: string; reason: string }[] } = { apply, repaired: [], candidates: [], skipped: [] }
  try {
    await client.query("BEGIN")
    await client.query("SELECT pg_advisory_xact_lock(hashtext('storyverse.order-summary-repair'))")
    const rows = await client.query(`SELECT o.id,o.version FROM "order" o
      WHERE o.deleted_at IS NULL AND ($1::text[] IS NULL OR o.id=ANY($1::text[]))
      AND NOT EXISTS(SELECT 1 FROM order_summary s WHERE s.order_id=o.id AND s.version=o.version AND s.deleted_at IS NULL)
      ORDER BY o.id FOR UPDATE OF o`, [ids || null])
    for (const row of rows.rows) {
      const changes = await client.query("SELECT id FROM order_change WHERE order_id=$1 LIMIT 1", [row.id])
      if (row.version !== 1 || changes.rowCount) { report.skipped.push({ id: row.id, reason: "Order has edit history; original financial summary must be recovered from backup" }); continue }
      const order = await orderService.retrieveOrder(row.id, { relations: ["items", "items.tax_lines", "items.adjustments", "shipping_methods", "shipping_methods.tax_lines", "shipping_methods.adjustments", "transactions", "credit_lines"] })
      if (order.credit_lines?.length) { report.skipped.push({ id: row.id, reason: "Credit lines require an explicit accounting review" }); continue }
      const totals = initialOrderSummary(order)
      report.candidates.push(row.id)
      if (!apply) continue
      const id = "ordsum_" + randomUUID().replaceAll("-", "")
      await client.query(`INSERT INTO order_summary(id,order_id,version,totals) VALUES($1,$2,$3,$4::jsonb)`, [id, row.id, row.version, JSON.stringify(totals)])
      // Record exactly what was inserted; no customer or order-line data changes.
      await client.query(`CREATE TABLE IF NOT EXISTS storyverse_order_summary_repairs (
        summary_id text PRIMARY KEY, order_id text NOT NULL, version integer NOT NULL, totals jsonb NOT NULL, created_at timestamptz NOT NULL DEFAULT now())`)
      await client.query("INSERT INTO storyverse_order_summary_repairs(summary_id,order_id,version,totals) VALUES($1,$2,$3,$4::jsonb)", [id, row.id, row.version, JSON.stringify(totals)])
      report.repaired.push(row.id)
    }
    await client.query("COMMIT")
    return report
  } catch (error) { await client.query("ROLLBACK"); throw error }
  finally { client.release() }
}
