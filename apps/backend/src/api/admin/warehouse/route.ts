import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { z } from "zod"
import { getDbPool } from "../../../utils/db"

const CreateStockMovementSchema = z.object({
  movement_type: z.enum(["inbound", "outbound", "transfer", "adjustment", "damaged"]),
  sku: z.string().min(1, "SKU is required").max(100),
  quantity: z.number().int(),
  from_location: z.string().max(100).optional().default("-"),
  to_location: z.string().max(100).optional().default("-"),
  reference_number: z.string().min(1, "Reference number is required").max(100),
  reason: z.string().max(500).optional().default("Manual Logistics Action"),
})

export const GET = async (_req: MedusaRequest, res: MedusaResponse) => {
  const pool = getDbPool()
  try {
    const binsRes = await pool.query(
      `SELECT * FROM warehouse_bins ORDER BY location_name ASC, bin_code ASC`
    )
    const movementsRes = await pool.query(
      `SELECT * FROM stock_movements ORDER BY created_at DESC LIMIT 50`
    )
    const statsRes = await pool.query(`
      SELECT
        COUNT(*) as total_bins,
        COALESCE(SUM(current_quantity), 0) as total_units_stored,
        COALESCE(SUM(capacity), 0) as total_warehouse_capacity,
        COUNT(DISTINCT location_name) as active_warehouses
      FROM warehouse_bins
    `)

    return res.status(200).json({
      bins: binsRes.rows,
      movements: movementsRes.rows,
      summary: statsRes.rows[0],
    })
  } catch (error: any) {
    console.error("[Warehouse GET Error]", error)
    return res.status(500).json({ code: "INTERNAL_ERROR", message: "Failed to fetch warehouse data." })
  }
}

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const pool = getDbPool()

  let validated
  try {
    validated = CreateStockMovementSchema.parse(req.body)
  } catch (err: any) {
    return res.status(400).json({ code: "VALIDATION_ERROR", errors: err.errors })
  }

  const id = `mov_${Date.now()}`
  try {
    const insertRes = await pool.query(
      `INSERT INTO stock_movements (id, movement_type, sku, quantity, from_location, to_location, reference_number, reason)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        id,
        validated.movement_type,
        validated.sku,
        validated.quantity,
        validated.from_location,
        validated.to_location,
        validated.reference_number,
        validated.reason,
      ]
    )
    return res.status(201).json({ movement: insertRes.rows[0] })
  } catch (error: any) {
    console.error("[Warehouse POST Error]", error)
    return res.status(500).json({ code: "INTERNAL_ERROR", message: "Failed to record stock movement." })
  }
}
