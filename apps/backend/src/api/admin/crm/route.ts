import { randomUUID } from "node:crypto"
import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { getDbPool, withTransaction } from "../../../utils/db"
import { z } from "zod"

const customerId = z.string().min(1).max(100)
const actions = z.discriminatedUnion("action", [
  z.object({ action: z.literal("create_segment"), name: z.string().trim().min(1).max(128), description: z.string().max(2000).optional(), rule_criteria: z.string().max(5000).optional(), sync_destination: z.string().max(128).optional() }),
  z.object({ action: z.literal("add_note"), customer_id: customerId, author_name: z.string().max(128).optional(), note_type: z.string().max(32).optional(), content: z.string().trim().min(1).max(10000) }),
  z.object({ action: z.literal("send_message"), customer_id: customerId, channel: z.enum(["whatsapp", "sms", "email"]), template_key: z.string().max(64).optional(), recipient: z.string().min(1).max(128), subject: z.string().max(255).optional(), message_body: z.string().trim().min(1).max(10000), sent_by: z.string().max(128).optional() }),
  z.object({ action: z.literal("adjust_points"), customer_id: customerId, points_delta: z.number().int().min(-100000).max(100000), reason: z.string().max(1000).optional() }),
  z.object({ action: z.literal("update_tier"), customer_id: customerId, new_tier: z.enum(["bronze_reader", "silver_club", "gold_salon", "platinum_elite"]) }),
  z.object({ action: z.literal("grant_credit"), customer_id: customerId, credits_delta: z.number().int().min(1).max(100) }),
])

export const GET = async (_req: MedusaRequest, res: MedusaResponse) => {
  const pool = getDbPool()

  try {
    // 1. Fetch Customers with Reading Profiles, Addresses, and Loyalty
    const customersQuery = `
      SELECT 
        c.id,
        c.email,
        c.first_name,
        c.last_name,
        c.phone,
        c.created_at,
        ca.city,
        ca.address_1,
        crp.preferred_format,
        crp.audio_hours_listened,
        crp.pages_read,
        crp.preferred_narration_speed,
        crp.currently_reading_title,
        crp.completed_books_count,
        crp.churn_risk_level,
        crp.churn_score,
        crp.vip_tier,
        credits.book_credits_balance,
        crp.engagement_score,
        crp.last_active_at,
        la.points_balance,
        la.lifetime_points,
        la.tier_level as loyalty_tier,
        COUNT(DISTINCT o.id) as total_orders_count,
        COALESCE(SUM(
          CASE 
            WHEN COALESCE(oi.unit_price, li.unit_price) IS NOT NULL THEN (oi.quantity::numeric * COALESCE(oi.unit_price, li.unit_price)::numeric)
            ELSE 0 
          END
        ), 0) as lifetime_spent_sar
      FROM customer c
      LEFT JOIN LATERAL (SELECT city, address_1 FROM customer_address WHERE customer_id = c.id AND deleted_at IS NULL ORDER BY created_at DESC LIMIT 1) ca ON true
      LEFT JOIN customer_reading_profiles crp ON crp.customer_id = c.id
      LEFT JOIN LATERAL (SELECT COALESCE(SUM(remaining_credits),0) AS book_credits_balance FROM user_subscription
        WHERE customer_id=c.id AND status='active' AND deleted_at IS NULL AND current_period_start<=now() AND current_period_end>now()) credits ON true
      LEFT JOIN loyalty_accounts la ON (la.customer_id = c.id OR la.customer_email = c.email)
      LEFT JOIN "order" o ON (o.customer_id = c.id AND o.deleted_at IS NULL)
      LEFT JOIN order_item oi ON oi.order_id = o.id AND oi.version = o.version AND oi.deleted_at IS NULL
      LEFT JOIN order_line_item li ON li.id = oi.item_id AND li.deleted_at IS NULL
      WHERE c.deleted_at IS NULL
      GROUP BY c.id, c.email, c.first_name, c.last_name, c.phone, c.created_at, ca.city, ca.address_1,
               crp.preferred_format, crp.audio_hours_listened, crp.pages_read, crp.preferred_narration_speed,
               crp.currently_reading_title, crp.completed_books_count, crp.churn_risk_level, crp.churn_score,
               crp.vip_tier, credits.book_credits_balance, crp.engagement_score, crp.last_active_at,
               la.points_balance, la.lifetime_points, la.tier_level
      ORDER BY c.created_at DESC;
    `
    const custRes = await pool.query(customersQuery)

    // 2. Fetch all CRM staff notes
    const notesRes = await pool.query(`
      SELECT * FROM customer_crm_notes ORDER BY created_at DESC;
    `)

    // Group notes by customer_id
    const notesByCust: Record<string, any[]> = {}
    for (const note of notesRes.rows) {
      if (!notesByCust[note.customer_id]) notesByCust[note.customer_id] = []
      notesByCust[note.customer_id].push(note)
    }

    // 3. Fetch Communications Log
    const commsRes = await pool.query(`
      SELECT * FROM crm_communications_log ORDER BY created_at DESC LIMIT 30;
    `)

    // 4. Fetch Dynamic Audience Segments
    const segsRes = await pool.query(`
      SELECT *,description_ar AS description,filter_criteria->>'description' AS rule_criteria
      FROM crm_audience_segments WHERE is_active = true ORDER BY customer_count DESC;
    `)

    // Format Customers with Arabic labels and metadata
    const formatLabelsAr: Record<string, string> = {
      hybrid: "هجين (صوتي + إلكتروني)",
      deluxe_paperback: "طبعات ورقية فاخرة وموقعة",
      audiobook_immersive: "كتب صوتية غامرة (Dolby Atmos)",
      drm_digital_ebook: "رقمي محمي ضد القرصنة (DRM EPUB)",
      collector_bundle: "باقة النخبة والمجموعات الكاملة",
    }

    const tierLabelsAr: Record<string, string> = {
      platinum_elite: "الصالون الأدبي البلاتيني الممتاز",
      gold_salon: "نادي النخبة الأدبي الذهبي",
      silver_club: "عضوية القارئ الفضي",
      bronze_reader: "عضوية القارئ المبتدئ",
    }

    const formattedCustomers = custRes.rows.map((row) => {
      const notes = notesByCust[row.id] || []
      const fullName = [row.first_name, row.last_name].filter(Boolean).join(" ") || row.email.split("@")[0]
      const preferredFormat = row.preferred_format || "ebook"
      const vipTier = row.vip_tier || "bronze_reader"

      return {
        id: row.id,
        name: fullName,
        email: row.email,
        phone: row.phone || "",
        city: row.city || "",
        address: row.address_1 || "",
        avatar: "data:image/svg+xml,"+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="32" fill="#e7e5e4"/><circle cx="32" cy="24" r="10" fill="#78716c"/><path d="M12 58a20 20 0 0 1 40 0" fill="#78716c"/></svg>'),
        preferred_format: preferredFormat,
        preferred_format_ar: formatLabelsAr[preferredFormat] || preferredFormat,
        vip_tier: vipTier,
        vip_tier_ar: tierLabelsAr[vipTier] || vipTier,
        engagement_score: parseInt(row.engagement_score ?? "0", 10),
        churn_risk: row.churn_risk_level || "unknown",
        churn_score: parseInt(row.churn_score ?? "0", 10),
        book_credits: parseInt(row.book_credits_balance ?? "0", 10),
        points_balance: parseInt(row.points_balance ?? "0", 10),
        lifetime_points: parseInt(row.lifetime_points ?? "0", 10),
        audio_hours: parseFloat(row.audio_hours_listened || "0").toFixed(1),
        pages_read: parseInt(row.pages_read || "0", 10),
        preferred_speed: row.preferred_narration_speed || "1x",
        currently_reading: row.currently_reading_title || "لم يُسجل نشاط قراءة",
        completed_books_count: parseInt(row.completed_books_count || "0", 10),
        total_orders: parseInt(row.total_orders_count || "0", 10),
        lifetime_value_sar: parseFloat(row.lifetime_spent_sar || "0").toFixed(2),
        last_active: row.last_active_at || row.created_at,
        notes,
      }
    })

    // Calculate aggregated KPIs
    const totalReaders = formattedCustomers.length
    const totalOrders = formattedCustomers.reduce((acc, c) => acc + c.total_orders, 0)
    const totalRevenueSar = formattedCustomers.reduce((acc, c) => acc + parseFloat(c.lifetime_value_sar), 0)
    const vipCount = formattedCustomers.filter((c) => ["gold_salon", "platinum_elite"].includes(c.vip_tier)).length
    const atRiskCount = formattedCustomers.filter((c) => c.churn_risk === "high" || c.churn_risk === "medium").length
    const totalAudioHours = formattedCustomers.reduce((acc, c) => acc + parseFloat(c.audio_hours), 0).toFixed(1)
    const avgOrderValue = totalOrders > 0 ? (totalRevenueSar / totalOrders).toFixed(2) : "0.00"

    return res.status(200).json({
      status: "success",
      metrics: {
        total_readers: totalReaders,
        total_orders: totalOrders,
        total_revenue_sar: totalRevenueSar.toFixed(2),
        avg_order_value_sar: avgOrderValue,
        vip_readers_count: vipCount,
        at_risk_readers_count: atRiskCount,
        total_audio_hours_listened: totalAudioHours,
        format_distribution: {
          hybrid_pct: totalReaders ? 100*formattedCustomers.filter(c=>c.preferred_format==='hybrid').length/totalReaders : 0,
          deluxe_paperback_pct: totalReaders ? 100*formattedCustomers.filter(c=>['paperback','deluxe_paperback'].includes(c.preferred_format)).length/totalReaders : 0,
          audiobook_pct: totalReaders ? 100*formattedCustomers.filter(c=>['audiobook','audiobook_immersive'].includes(c.preferred_format)).length/totalReaders : 0,
          drm_ebook_pct: totalReaders ? 100*formattedCustomers.filter(c=>['ebook','drm_digital_ebook'].includes(c.preferred_format)).length/totalReaders : 0,
        },
      },
      customers: formattedCustomers,
      segments: segsRes.rows,
      recent_communications: commsRes.rows,
    })
  } catch (error: any) {
    console.error("[CRM Admin API Error]:", error)
    return res.status(500).json({
      code: "CRM_FETCH_ERROR",
      message: "حدث خطأ أثناء استرجاع بيانات نظام علاقات القراء CRM.",
    })
  }
}

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const pool = getDbPool()
  const parsed = actions.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ code: "VALIDATION_ERROR", errors: parsed.error.issues })
  const body = parsed.data as any

  try {
    const { action, customer_id } = body

    if (!action) {
      return res.status(400).json({
        code: "INVALID_PARAMETERS",
        message: "يجب تحديد الإجراء action.",
      })
    }

    if (action === "create_segment") {
      const { name, description, rule_criteria, sync_destination } = body
      if (!name) {
        return res.status(400).json({ code: "INVALID_PARAMETERS", message: "اسم الشريحة مطلوب." })
      }
      const segId = `seg_${randomUUID()}`
      const count = 0
      await pool.query(
        `INSERT INTO crm_audience_segments (id, name, name_ar, slug, description_ar, filter_criteria, customer_count, sync_destination, is_active)
         VALUES ($1, $2, $2, $1, $3, $4, $5, $6, true)`,
        [segId, name, description || "", JSON.stringify({description:rule_criteria||"",execution_enabled:false}), count, sync_destination || "غير مربوط"]
      )
      return res.status(200).json({ status: "success", message: "تم إنشاء شريحة الجمهور بنجاح!", segment_id: segId })
    }

    if (!customer_id) {
      return res.status(400).json({
        code: "INVALID_PARAMETERS",
        message: "يجب تحديد معرف القارئ customer_id.",
      })
    }

    const customer=await pool.query('SELECT id,email,first_name,last_name FROM customer WHERE id=$1 AND deleted_at IS NULL',[customer_id])
    if(!customer.rowCount)return res.status(404).json({code:"NOT_FOUND",message:"Customer not found."})

    if (action === "add_note") {
      const { author_name, note_type, content } = body
      const noteId = `note_${randomUUID()}`
      await pool.query(
        `INSERT INTO customer_crm_notes (id, customer_id, author_name, note_type, content)
         VALUES ($1, $2, $3, $4, $5)`,
        [noteId, customer_id, author_name || "فريق خدمة النخبة", note_type || "general", content]
      )
      return res.status(200).json({ status: "success", message: "تمت إضافة الملاحظة بنجاح", note_id: noteId })
    }

    if (action === "send_message") {
      const { channel, template_key, recipient, subject, message_body, sent_by } = body
      const commId = `comm_${randomUUID()}`
      await pool.query(
        `INSERT INTO crm_communications_log (id, customer_id, channel, template_key, recipient, subject, message_body, sent_by, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'draft')`,
        [commId, customer_id, channel || "whatsapp", template_key || "custom_dispatch", recipient, subject, message_body, sent_by || "فريق إدارة القراء"]
      )
      return res.status(200).json({ status: "draft", message: "تم حفظ مسودة الرسالة. الإرسال يتطلب ربط مزود مراسلات.", comm_id: commId })
    }

    if (action === "adjust_points") {
      const { points_delta, reason } = body
      const delta = parseInt(points_delta || "0", 10)

      const changed = await withTransaction(async (client) => {
      const result = await client.query(
        `UPDATE loyalty_accounts 
         SET points_balance = GREATEST(0, points_balance + $1),
             lifetime_points = CASE WHEN $1 > 0 THEN lifetime_points + $1 ELSE lifetime_points END
         WHERE customer_id = $2 RETURNING customer_id`,
        [delta, customer_id]
      )
      if (!result.rowCount) return false

      // Add audit note
      const noteId = `note_loyalty_${randomUUID()}`
      await client.query(
        `INSERT INTO customer_crm_notes (id, customer_id, author_name, note_type, content)
         VALUES ($1, $2, $3, $4, $5)`,
        [noteId, customer_id, "نظام إدارة الولاء والمكافآت", "gift", `تم تعديل رصيد النقاط بمقدار (${delta > 0 ? "+" + delta : delta}) نقطة. السبب: ${reason || "مكافأة مباشرة من الإدارة"}`]
      )
      return true
      })
      if (!changed) return res.status(404).json({ code: "NOT_FOUND", message: "Loyalty account not found." })

      return res.status(200).json({ status: "success", message: `تم تعديل رصيد النقاط بمقدار (${delta}) بنجاح!` })
    }

    if (action === "update_tier") {
      const { new_tier } = body
      await pool.query(
        `INSERT INTO customer_reading_profiles(customer_id,vip_tier) VALUES($2,$1)
         ON CONFLICT(customer_id) DO UPDATE SET vip_tier=EXCLUDED.vip_tier,updated_at=now()`,
        [new_tier, customer_id]
      )
      return res.status(200).json({ status: "success", message: `تمت ترقية رتبة القارئ إلى ${new_tier} بنجاح!` })
    }

    if (action === "grant_credit") {
      const { credits_delta } = body
      const delta = parseInt(credits_delta || "1", 10)
      const credited=await pool.query(
        `WITH eligible AS (SELECT id FROM user_subscription WHERE customer_id=$2 AND status='active'
           AND deleted_at IS NULL AND current_period_start<=now() AND current_period_end>now() ORDER BY current_period_end DESC LIMIT 1 FOR UPDATE)
         UPDATE user_subscription s SET remaining_credits=remaining_credits+$1,updated_at=now()
         FROM eligible WHERE s.id=eligible.id RETURNING s.id`,
        [delta, customer_id]
      )
      if(!credited.rowCount)return res.status(409).json({code:"NO_ACTIVE_SUBSCRIPTION",message:"لا يوجد اشتراك نشط لمنح رصيد. أضف الاشتراك أولًا من إدارة المشتركين."})
      return res.status(200).json({ status: "success", message: `تم منح القارئ ${delta} رصيد كتب مجاني!` })
    }

    return res.status(400).json({ code: "UNKNOWN_ACTION", message: "الإجراء المطلوب غير معروف." })
  } catch (error: any) {
    console.error("[CRM Action API Error]:", error)
    return res.status(500).json({ code: "ACTION_FAILED", message: "فشل تنفيذ إجراء CRM." })
  }
}
