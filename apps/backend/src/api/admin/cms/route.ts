import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { getDbPool } from "../../../utils/db"

export const GET = async (_req: MedusaRequest, res: MedusaResponse) => {
  const pool = getDbPool()
  try {
    const articlesRes = await pool.query(
      `SELECT * FROM cms_articles ORDER BY created_at DESC`
    )
    const statsRes = await pool.query(`
      SELECT
        COUNT(*) as total_articles,
        COUNT(*) FILTER (WHERE status = 'published') as published_count,
        COALESCE(SUM(view_count), 0) as total_views,
        COUNT(DISTINCT category) as total_categories
      FROM cms_articles
    `)

    return res.status(200).json({
      articles: articlesRes.rows,
      summary: statsRes.rows[0],
    })
  } catch (error: any) {
    return res.status(500).json({ error: error.message })
  }
}

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const pool = getDbPool()
  const { title, slug, excerpt, content, author_name, category, cover_image, meta_title, meta_description } = req.body as any

  if (!title || !slug) {
    return res.status(400).json({ message: "title and slug are required" })
  }

  const id = `art_${Date.now()}`
  try {
    const insertRes = await pool.query(
      `INSERT INTO cms_articles (id, title, slug, excerpt, content, author_name, category, cover_image, status, meta_title, meta_description, published_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'published', $9, $10, NOW())
       RETURNING *`,
      [
        id,
        title,
        slug,
        excerpt || "",
        content || "",
        author_name || "هيئة التحرير",
        category || "مقالات عامة",
        cover_image || "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=1200&q=80",
        meta_title || title,
        meta_description || excerpt || title,
      ]
    )
    return res.status(201).json({ article: insertRes.rows[0] })
  } catch (error: any) {
    return res.status(500).json({ error: error.message })
  }
}
