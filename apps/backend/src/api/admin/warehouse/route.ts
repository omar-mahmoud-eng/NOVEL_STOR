import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { getDbPool } from "../../../utils/db"

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
    return res.status(500).json({ error: error.message })
  }
}

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const pool = getDbPool()
  const { movement_type, sku, quantity, from_location, to_location, reference_number, reason } = req.body as any

  if (!movement_type || !sku || !quantity || !reference_number) {
    return res.status(400).json({ message: "movement_type, sku, quantity, and reference_number are required" })
  }

  const id = `mov_${Date.now()}`
  try {
    const insertRes = await pool.query(
      `INSERT INTO stock_movements (id, movement_type, sku, quantity, from_location, to_location, reference_number, reason)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [id, movement_type, sku, quantity, from_location || "-", to_location || "-", reference_number, reason || "Manual Logistics Action"]
    )
    return res.status(201).json({ movement: insertRes.rows[0] })
  } catch (error: any) {
    return res.status(500).json({ error: error.message })
  }
}
