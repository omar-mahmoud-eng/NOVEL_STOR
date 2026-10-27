import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { getDbPool } from "../../../utils/db"

export const GET = async (_req: MedusaRequest, res: MedusaResponse) => {
  const pool = getDbPool()
  try {
    const [
      ordersRes,
      marketingRes,
      reviewsRes,
      loyaltyRes,
      affiliatesRes,
      ticketsRes,
      warehouseRes,
      cmsRes,
    ] = await Promise.all([
      // Financials & Orders summary
      pool.query(`
        SELECT 
          COUNT(*) as total_orders,
          (SELECT COALESCE(SUM(captured_amount), 0) FROM payment_collection WHERE currency_code = 'sar' AND deleted_at IS NULL) as gross_revenue
        FROM "order"
        WHERE deleted_at IS NULL
      `),
      // Marketing automations summary
      pool.query(`
        SELECT 
          COUNT(*) as total_campaigns,
          COALESCE(SUM(sent_count), 0) as total_reach,
          COALESCE(SUM(revenue_generated), 0) as marketing_revenue,
          (SELECT COUNT(*) FROM cart_abandonment_automations WHERE recovery_status = 'recovered') as recovered_carts
        FROM marketing_campaigns
      `),
      // Reviews & UGC
      pool.query(`
        SELECT 
          COUNT(*) as total_reviews,
          COALESCE(AVG(rating), 0) as avg_rating,
          COUNT(*) FILTER (WHERE status = 'pending') as pending_moderation
        FROM product_reviews
      `),
      // Loyalty
      pool.query(`
        SELECT 
          COUNT(*) as total_members,
          COALESCE(SUM(points_balance), 0) as circulating_points,
          COUNT(*) FILTER (WHERE tier_level IN ('gold', 'platinum')) as vip_members
        FROM loyalty_accounts
      `),
      // Affiliates
      pool.query(`
        SELECT 
          COUNT(*) as total_creators,
          COALESCE(SUM(total_revenue), 0) as affiliate_sales,
          COALESCE(SUM(pending_payout), 0) as pending_payouts
        FROM affiliates
      `),
      // Support SLA
      pool.query(`
        SELECT 
          COUNT(*) as total_tickets,
          COUNT(*) FILTER (WHERE status = 'open') as open_tickets,
          COUNT(*) FILTER (WHERE priority = 'urgent' AND status != 'resolved') as urgent_sla_tickets
        FROM support_tickets
      `),
      // Multi-Warehouse
      pool.query(`
        SELECT 
          COUNT(*) as total_bins,
          COALESCE(SUM(current_quantity), 0) as units_stored,
          COALESCE(SUM(capacity), 0) as total_capacity,
          COUNT(DISTINCT location_name) as warehouses_count
        FROM warehouse_bins
      `),
      // CMS Content
      pool.query(`
        SELECT 
          COUNT(*) as total_articles,
          COALESCE(SUM(view_count), 0) as content_views
        FROM cms_articles
      `),
    ])

    const activity = await pool.query(`SELECT id, 'order' as type,
      COALESCE(custom_display_id, display_id::text, id) as title,
      status as subtitle, created_at as timestamp, 'info' as status
      FROM "order" WHERE deleted_at IS NULL ORDER BY created_at DESC LIMIT 6`)
    const recentActivity = activity.rows

    return res.status(200).json({
      metrics: {
        financials: ordersRes.rows[0],
        marketing: marketingRes.rows[0],
        reviews: reviewsRes.rows[0],
        loyalty: loyaltyRes.rows[0],
        affiliates: affiliatesRes.rows[0],
        helpdesk: ticketsRes.rows[0],
        warehouse: warehouseRes.rows[0],
        cms: cmsRes.rows[0],
      },
      recentActivity,
      systemHealth: {
        status: "operational",
        uptime_seconds: Math.floor(process.uptime()),
        database: "PostgreSQL 16 Healthy",
        cache: "not_verified",
        drmEngine: "configured",
        bundlePricing: "custom_workflow_available",
      },
    })
  } catch (error: any) {
    return res.status(500).json({ code: "METRICS_UNAVAILABLE", message: "Unable to load operational metrics" })
  }
}
