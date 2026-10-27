import { randomUUID } from "node:crypto"
import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { z } from "zod"
import { getDbPool } from "../../../utils/db"

const CreateCampaignSchema = z.object({
  name: z.string().min(2, "Campaign name is required").max(150),
  type: z.enum(["email", "sms", "whatsapp", "push", "discount"]),
  audience_group: z.string().min(1).max(100),
  scheduled_at: z.string().datetime().optional(),
})

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
    console.error("[Marketing GET Error]", error)
    return res.status(500).json({ code: "INTERNAL_ERROR", message: "Failed to fetch campaigns." })
  }
}

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const pool = getDbPool()

  let validated
  try {
    validated = CreateCampaignSchema.parse(req.body)
  } catch (err: any) {
    return res.status(400).json({ code: "VALIDATION_ERROR", errors: err.issues })
  }

  const id = `camp_${randomUUID()}`
  try {
    const insertRes = await pool.query(
      `INSERT INTO marketing_campaigns (id, name, type, status, audience_group, scheduled_at)
       VALUES ($1, $2, $3, 'scheduled', $4, $5)
       RETURNING *`,
      [id, validated.name, validated.type, validated.audience_group, validated.scheduled_at || new Date()]
    )
    return res.status(201).json({ campaign: insertRes.rows[0] })
  } catch (error: any) {
    console.error("[Marketing POST Error]", error)
    return res.status(500).json({ code: "INTERNAL_ERROR", message: "Failed to create campaign." })
  }
}
