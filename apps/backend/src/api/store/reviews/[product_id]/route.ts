import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { getDbPool } from "../../../../utils/db"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const { product_id } = req.params
  const pool = getDbPool()

  try {
    const reviewsRes = await pool.query(
      `SELECT 
        id,
        customer_name,
        rating,
        title,
        comment,
        verified_purchase,
        created_at
      FROM product_reviews 
      WHERE (product_id = $1 OR product_id IS NULL) AND status = 'approved'
      ORDER BY created_at DESC 
      LIMIT 20`,
      [product_id]
    )

    const statsRes = await pool.query(
      `SELECT 
        COUNT(*) as total_reviews,
        COALESCE(AVG(rating), 5.0) as average_rating
      FROM product_reviews 
      WHERE (product_id = $1 OR product_id IS NULL) AND status = 'approved'`,
      [product_id]
    )

    return res.status(200).json({
      status: "success",
      total_reviews: parseInt(statsRes.rows[0]?.total_reviews || "0", 10),
      average_rating: parseFloat(statsRes.rows[0]?.average_rating || "5.0").toFixed(1),
      reviews: reviewsRes.rows,
    })
  } catch (error: any) {
    console.error("[Reviews Store API Error]:", error)
    return res.status(500).json({
      code: "REVIEWS_FETCH_ERROR",
      message: "حدث خطأ أثناء استرجاع تقييمات الرواية.",
    })
  }
}
