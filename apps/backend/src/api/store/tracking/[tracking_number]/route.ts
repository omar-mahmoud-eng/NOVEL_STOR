import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { getDbPool } from "../../../../utils/db"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const { tracking_number } = req.params
  const pool = getDbPool()

  try {
    const result = await pool.query(
      `SELECT 
        ft.id,
        ft.tracking_number,
        ft.carrier,
        ft.status,
        ft.estimated_delivery_date,
        ft.tracking_events,
        ft.created_at,
        o.display_id,
        o.custom_display_id,
        o.currency_code,
        oa.city,
        oa.first_name,
        oa.last_name
      FROM fulfillment_tracking ft
      JOIN "order" o ON o.id = ft.order_id
      LEFT JOIN order_address oa ON oa.id = o.shipping_address_id
      WHERE ft.tracking_number = $1 OR o.custom_display_id = $1
      LIMIT 1`,
      [tracking_number]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({
        code: "TRACKING_NOT_FOUND",
        message: "لم يتم العثور على شحنة مطابقة لرقم التتبع المدخل.",
      })
    }

    const row = result.rows[0]

    const statusTranslations: Record<string, { labelAr: string; progress: number }> = {
      pending: { labelAr: "قيد المراجعة وتأكيد الطلب", progress: 20 },
      processing: { labelAr: "قيد التجهيز والتغليف الفاخر بالمستودع", progress: 40 },
      in_transit: { labelAr: "الشحنة في طريقها مع الناقل الإقليمي", progress: 70 },
      out_for_delivery: { labelAr: "خرجت مع مندوب التوصيل للتسليم اليوم", progress: 90 },
      delivered: { labelAr: "تم تسليم الشحنة بنجاح للقارئ", progress: 100 },
      returned: { labelAr: "شحنة مرتجعة", progress: 0 },
      failed: { labelAr: "تعذر التسليم", progress: 0 },
    }

    const statusMeta = statusTranslations[row.status] || {
      labelAr: row.status,
      progress: 50,
    }

    return res.status(200).json({
      status: "success",
      tracking: {
        tracking_number: row.tracking_number,
        order_reference: row.custom_display_id || `#${row.display_id}`,
        carrier: row.carrier,
        status_code: row.status,
        status_label: statusMeta.labelAr,
        progress_percentage: statusMeta.progress,
        recipient_city: row.city,
        recipient_name: `${row.first_name || ""} ${row.last_name || ""}`.trim(),
        estimated_delivery: row.estimated_delivery_date,
        timeline: row.tracking_events || [],
        created_at: row.created_at,
      },
    })
  } catch (error: any) {
    console.error("[Tracking Store API Error]:", error)
    return res.status(500).json({
      code: "TRACKING_FETCH_ERROR",
      message: "حدث خطأ غير متوقع أثناء استرجاع بيانات الشحنة.",
    })
  }
}
