import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { getDbPool } from "../../../utils/db"

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
    return res.status(500).json({ error: error.message })
  }
}

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const pool = getDbPool()
  const { customer_id, points_delta } = req.body as any

  if (!customer_id || typeof points_delta !== "number") {
    return res.status(400).json({ message: "customer_id and points_delta are required" })
  }

  try {
    const updateRes = await pool.query(
      `UPDATE loyalty_accounts
       SET points_balance = GREATEST(0, points_balance + $1),
           lifetime_points = CASE WHEN $1 > 0 THEN lifetime_points + $1 ELSE lifetime_points END
       WHERE customer_id = $2
       RETURNING *`,
      [points_delta, customer_id]
    )
    return res.status(200).json({ account: updateRes.rows[0] })
  } catch (error: any) {
    return res.status(500).json({ error: error.message })
  }
}
