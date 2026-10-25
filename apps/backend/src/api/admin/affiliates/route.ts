import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { getDbPool } from "../../../utils/db"

export const GET = async (_req: MedusaRequest, res: MedusaResponse) => {
  const pool = getDbPool()
  try {
    const affiliatesRes = await pool.query(
      `SELECT * FROM affiliates ORDER BY total_revenue DESC`
    )
    const referralsRes = await pool.query(
      `SELECT r.*, a.name as affiliate_name, a.coupon_code
       FROM affiliate_referrals r
       JOIN affiliates a ON r.affiliate_id = a.id
       ORDER BY r.created_at DESC`
    )
    const statsRes = await pool.query(`
      SELECT
        COUNT(*) as total_partners,
        COALESCE(SUM(total_revenue), 0) as total_affiliate_revenue,
        COALESCE(SUM(pending_payout), 0) as total_pending_payout,
        COALESCE(SUM(paid_payout), 0) as total_paid_payout
      FROM affiliates
    `)

    return res.status(200).json({
      affiliates: affiliatesRes.rows,
      referrals: referralsRes.rows,
      summary: statsRes.rows[0],
    })
  } catch (error: any) {
    return res.status(500).json({ error: error.message })
  }
}

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const pool = getDbPool()
  const { name, email, channel_name, coupon_code, commission_rate } = req.body as any

  if (!name || !email || !coupon_code) {
    return res.status(400).json({ message: "name, email, and coupon_code are required" })
  }

  const id = `aff_${Date.now()}`
  try {
    const insertRes = await pool.query(
      `INSERT INTO affiliates (id, name, email, channel_name, coupon_code, commission_rate, status)
       VALUES ($1, $2, $3, $4, $5, $6, 'active')
       RETURNING *`,
      [id, name, email, channel_name || "Direct Link", coupon_code, commission_rate || 15.0]
    )
    return res.status(201).json({ affiliate: insertRes.rows[0] })
  } catch (error: any) {
    return res.status(500).json({ error: error.message })
  }
}
