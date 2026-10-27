import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { getDbPool } from "../../../../utils/db"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const { customer_id } = req.params
  const actorId = (req as any).auth_context?.actor_id
  if (!actorId) return res.status(401).json({ code: "UNAUTHORIZED", message: "Authentication required." })
  if (actorId !== customer_id) return res.status(403).json({ code: "FORBIDDEN", message: "Access denied." })
  res.setHeader("Cache-Control", "private, no-store")
  const pool = getDbPool()

  try {
    const accountRes = await pool.query(
      `SELECT * FROM loyalty_accounts WHERE customer_id = $1 LIMIT 1`,
      [customer_id]
    )

    const rewardsRes = await pool.query(
      `SELECT * FROM loyalty_rewards WHERE is_active = true ORDER BY points_cost ASC`
    )

    let account = accountRes.rows[0]

    // Default loyalty profile if customer has not yet earned points
    if (!account) {
      account = {
        customer_id,
        tier_level: "bronze",
        points_balance: 0,
        lifetime_points: 0,
        tier_expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      }
    }

    const tierPerks: Record<string, { titleAr: string; discountMultiplier: string; freeShipping: boolean }> = {
      bronze: { titleAr: "عضوية القارئ المبتدئ", discountMultiplier: "5%", freeShipping: false },
      silver: { titleAr: "عضوية القارئ الفضي", discountMultiplier: "10%", freeShipping: true },
      gold: { titleAr: "عضوية نادي النخبة الذهبي", discountMultiplier: "15%", freeShipping: true },
      platinum: { titleAr: "عضوية الصالون البلاتيني الممتاز", discountMultiplier: "25%", freeShipping: true },
    }

    return res.status(200).json({
      status: "success",
      loyalty: {
        points_balance: account.points_balance || 0,
        lifetime_points: account.lifetime_points || 0,
        tier: account.tier_level || "silver",
        tier_details: tierPerks[account.tier_level] || tierPerks.silver,
        available_rewards: rewardsRes.rows,
      },
    })
  } catch (error: any) {
    console.error("[Loyalty Store API Error]:", error)
    return res.status(500).json({
      code: "LOYALTY_FETCH_ERROR",
      message: "حدث خطأ أثناء استرجاع بيانات نقاط الولاء.",
    })
  }
}
