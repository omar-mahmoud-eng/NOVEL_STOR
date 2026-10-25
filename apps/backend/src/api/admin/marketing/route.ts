import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { getDbPool } from "../../../utils/db"

export const GET = async (_req: MedusaRequest, res: MedusaResponse) => {
  const pool = getDbPool()
  try {
    const campaignsRes = await pool.query(
      `SELECT * FROM marketing_campaigns ORDER BY created_at DESC`
    )
    const abandonedRes = await pool.query(
      `SELECT * FROM cart_abandonment_automations ORDER BY created_at DESC`
    )

    const statsRes = await pool.query(`
      SELECT
        COUNT(*) as total_campaigns,
        COALESCE(SUM(revenue_generated), 0) as total_revenue,
        COALESCE(AVG(open_rate), 0) as avg_open_rate,
        COALESCE(AVG(click_rate), 0) as avg_click_rate,
        COALESCE(SUM(conversions_count), 0) as total_conversions
      FROM marketing_campaigns
    `)

    return res.status(200).json({
      campaigns: campaignsRes.rows,
      abandoned_carts: abandonedRes.rows,
      summary: statsRes.rows[0],
    })
  } catch (error: any) {
    return res.status(500).json({ error: error.message })
  }
}

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const pool = getDbPool()
  const { name, type, audience_group, scheduled_at } = req.body as any

  if (!name || !type || !audience_group) {
    return res.status(400).json({ message: "name, type and audience_group are required" })
  }

  const id = `camp_${Date.now()}`
  try {
    const insertRes = await pool.query(
      `INSERT INTO marketing_campaigns (id, name, type, status, audience_group, scheduled_at)
       VALUES ($1, $2, $3, 'scheduled', $4, $5)
       RETURNING *`,
      [id, name, type, audience_group, scheduled_at || new Date()]
    )
    return res.status(201).json({ campaign: insertRes.rows[0] })
  } catch (error: any) {
    return res.status(500).json({ error: error.message })
  }
}
