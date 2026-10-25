import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { getDbPool } from "../../../utils/db"

export const GET = async (_req: MedusaRequest, res: MedusaResponse) => {
  const pool = getDbPool()
  try {
    const reviewsRes = await pool.query(
      `SELECT * FROM product_reviews ORDER BY created_at DESC`
    )
    const statsRes = await pool.query(`
      SELECT
        COUNT(*) as total_reviews,
        COALESCE(AVG(rating), 0) as average_rating,
        COUNT(*) FILTER (WHERE status = 'approved') as approved_count,
        COUNT(*) FILTER (WHERE status = 'pending') as pending_count,
        COUNT(*) FILTER (WHERE verified_purchase = true) as verified_count
      FROM product_reviews
    `)

    return res.status(200).json({
      reviews: reviewsRes.rows,
      summary: statsRes.rows[0],
    })
  } catch (error: any) {
    return res.status(500).json({ error: error.message })
  }
}

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const pool = getDbPool()
  const { id, status } = req.body as any

  if (!id || !status) {
    return res.status(400).json({ message: "id and status are required" })
  }

  try {
    const updateRes = await pool.query(
      `UPDATE product_reviews SET status = $1 WHERE id = $2 RETURNING *`,
      [status, id]
    )
    if (updateRes.rowCount === 0) {
      return res.status(404).json({ message: "Review not found" })
    }
    return res.status(200).json({ review: updateRes.rows[0] })
  } catch (error: any) {
    return res.status(500).json({ error: error.message })
  }
}
