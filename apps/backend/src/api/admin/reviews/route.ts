import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { z } from "zod"
import { getDbPool } from "../../../utils/db"

const UpdateReviewSchema = z.object({
  id: z.string().min(1, "Review id is required").max(100),
  status: z.enum(["approved", "rejected", "pending"]),
})

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
    console.error("[Reviews GET Error]", error)
    return res.status(500).json({ code: "INTERNAL_ERROR", message: "Failed to fetch reviews." })
  }
}

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const pool = getDbPool()

  let validated
  try {
    validated = UpdateReviewSchema.parse(req.body)
  } catch (err: any) {
    return res.status(400).json({ code: "VALIDATION_ERROR", errors: err.issues })
  }

  try {
    const updateRes = await pool.query(
      `UPDATE product_reviews SET status = $1 WHERE id = $2 RETURNING *`,
      [validated.status, validated.id]
    )
    if (updateRes.rowCount === 0) {
      return res.status(404).json({ code: "NOT_FOUND", message: "Review not found" })
    }
    return res.status(200).json({ review: updateRes.rows[0] })
  } catch (error: any) {
    console.error("[Reviews POST Error]", error)
    return res.status(500).json({ code: "INTERNAL_ERROR", message: "Failed to update review status." })
  }
}
