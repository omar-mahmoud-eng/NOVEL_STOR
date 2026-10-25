import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { z } from "zod"
import { getDbPool } from "../../../utils/db"

const CreateTicketMessageSchema = z.object({
  ticket_id: z.string().min(1, "Ticket ID is required").max(100),
  sender_name: z.string().max(100).optional().default("فريق الدعم الموحد"),
  message: z.string().min(1, "Message is required").max(5000),
  new_status: z.enum(["open", "in_progress", "resolved", "closed"]).optional(),
})

export const GET = async (_req: MedusaRequest, res: MedusaResponse) => {
  const pool = getDbPool()
  try {
    const ticketsRes = await pool.query(
      `SELECT * FROM support_tickets ORDER BY 
        CASE 
          WHEN status = 'open' THEN 1
          WHEN status = 'in_progress' THEN 2
          ELSE 3
        END, created_at DESC`
    )
    const messagesRes = await pool.query(
      `SELECT * FROM ticket_messages ORDER BY created_at ASC`
    )
    const statsRes = await pool.query(`
      SELECT
        COUNT(*) as total_tickets,
        COUNT(*) FILTER (WHERE status = 'open') as open_count,
        COUNT(*) FILTER (WHERE status = 'in_progress') as in_progress_count,
        COUNT(*) FILTER (WHERE status = 'resolved') as resolved_count,
        COUNT(*) FILTER (WHERE priority = 'urgent' AND status != 'resolved') as urgent_count
      FROM support_tickets
    `)

    return res.status(200).json({
      tickets: ticketsRes.rows,
      messages: messagesRes.rows,
      summary: statsRes.rows[0],
    })
  } catch (error: any) {
    console.error("[Helpdesk GET Error]", error)
    return res.status(500).json({ code: "INTERNAL_ERROR", message: "Failed to fetch support tickets." })
  }
}

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const pool = getDbPool()

  let validated
  try {
    validated = CreateTicketMessageSchema.parse(req.body)
  } catch (err: any) {
    return res.status(400).json({ code: "VALIDATION_ERROR", errors: err.errors })
  }

  const msgId = `msg_${Date.now()}`
  try {
    await pool.query(
      `INSERT INTO ticket_messages (id, ticket_id, sender_type, sender_name, message)
       VALUES ($1, $2, 'agent', $3, $4)`,
      [msgId, validated.ticket_id, validated.sender_name, validated.message]
    )

    if (validated.new_status) {
      await pool.query(
        `UPDATE support_tickets SET status = $1, updated_at = NOW() WHERE id = $2`,
        [validated.new_status, validated.ticket_id]
      )
    }

    return res.status(201).json({ success: true, message_id: msgId })
  } catch (error: any) {
    console.error("[Helpdesk POST Error]", error)
    return res.status(500).json({ code: "INTERNAL_ERROR", message: "Failed to post message." })
  }
}
