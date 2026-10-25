import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { z } from "zod"
import { getDbPool } from "../../../utils/db"

const CreateAffiliateSchema = z.object({
  name: z.string().min(2, "Name is required").max(100),
  email: z.string().email("Invalid email format").max(150),
  channel_name: z.string().max(100).optional().default("Direct Link"),
  coupon_code: z.string().min(2, "Coupon code is required").max(30).regex(/^[A-Z0-9_-]+$/i, "Coupon code must be alphanumeric"),
  commission_rate: z.number().min(0).max(100).default(15.0),
})

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
    console.error("[Affiliates GET Error]", error)
    return res.status(500).json({ code: "INTERNAL_ERROR", message: "Failed to fetch affiliates." })
  }
}

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const pool = getDbPool()

  let validated
  try {
    validated = CreateAffiliateSchema.parse(req.body)
  } catch (err: any) {
    return res.status(400).json({ code: "VALIDATION_ERROR", errors: err.errors })
  }

  const id = `aff_${Date.now()}`
  try {
    const insertRes = await pool.query(
      `INSERT INTO affiliates (id, name, email, channel_name, coupon_code, commission_rate, status)
       VALUES ($1, $2, $3, $4, $5, $6, 'active')
       RETURNING *`,
      [id, validated.name, validated.email, validated.channel_name, validated.coupon_code, validated.commission_rate]
    )
    return res.status(201).json({ affiliate: insertRes.rows[0] })
  } catch (error: any) {
    console.error("[Affiliates POST Error]", error)
    return res.status(500).json({ code: "INTERNAL_ERROR", message: "Failed to create affiliate." })
  }
}
