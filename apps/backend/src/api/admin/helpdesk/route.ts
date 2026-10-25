import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { getDbPool } from "../../../utils/db"

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
    return res.status(500).json({ error: error.message })
  }
}

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const pool = getDbPool()
  const { ticket_id, sender_name, message, new_status } = req.body as any

  if (!ticket_id || !message) {
    return res.status(400).json({ message: "ticket_id and message are required" })
  }

  const msgId = `msg_${Date.now()}`
  try {
    await pool.query(
      `INSERT INTO ticket_messages (id, ticket_id, sender_type, sender_name, message)
       VALUES ($1, $2, 'agent', $3, $4)`,
      [msgId, ticket_id, sender_name || "فريق الدعم الموحد", message]
    )

    if (new_status) {
      await pool.query(
        `UPDATE support_tickets SET status = $1, updated_at = NOW() WHERE id = $2`,
        [new_status, ticket_id]
      )
    }

    return res.status(201).json({ success: true, message_id: msgId })
  } catch (error: any) {
    return res.status(500).json({ error: error.message })
  }
}
