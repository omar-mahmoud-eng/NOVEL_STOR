import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { z } from "zod"
import { getDbPool } from "../../../utils/db"

const AdjustLoyaltyPointsSchema = z.object({
  customer_id: z.string().min(1, "Customer ID is required").max(100),
  points_delta: z.number().int().min(-100000).max(100000),
})

export const GET = async (_req: MedusaRequest, res: MedusaResponse) => {
  const pool = getDbPool()
  try {
    const accountsRes = await pool.query(
      `SELECT * FROM loyalty_accounts ORDER BY points_balance DESC`
    )
    const rewardsRes = await pool.query(
      `SELECT * FROM loyalty_rewards ORDER BY points_cost ASC`
    )
    const statsRes = await pool.query(`
      SELECT
        COUNT(*) as total_members,
        COALESCE(SUM(points_balance), 0) as total_circulating_points,
        COALESCE(SUM(lifetime_points), 0) as total_earned_lifetime,
        COUNT(*) FILTER (WHERE tier_level IN ('gold', 'platinum')) as vip_count
      FROM loyalty_accounts
    `)

    return res.status(200).json({
      members: accountsRes.rows,
      rewards: rewardsRes.rows,
      summary: statsRes.rows[0],
    })
  } catch (error: any) {
    console.error("[Loyalty GET Error]", error)
    return res.status(500).json({ code: "INTERNAL_ERROR", message: "Failed to fetch loyalty accounts." })
  }
}

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const pool = getDbPool()

  let validated
  try {
    validated = AdjustLoyaltyPointsSchema.parse(req.body)
  } catch (err: any) {
    return res.status(400).json({ code: "VALIDATION_ERROR", errors: err.errors })
  }

  try {
    const updateRes = await pool.query(
      `UPDATE loyalty_accounts
       SET points_balance = GREATEST(0, points_balance + $1),
           lifetime_points = CASE WHEN $1 > 0 THEN lifetime_points + $1 ELSE lifetime_points END
       WHERE customer_id = $2
       RETURNING *`,
      [validated.points_delta, validated.customer_id]
    )
    if (updateRes.rowCount === 0) {
      return res.status(404).json({ code: "NOT_FOUND", message: "Loyalty account not found for customer." })
    }
    return res.status(200).json({ account: updateRes.rows[0] })
  } catch (error: any) {
    console.error("[Loyalty POST Error]", error)
    return res.status(500).json({ code: "INTERNAL_ERROR", message: "Failed to adjust points." })
  }
}
