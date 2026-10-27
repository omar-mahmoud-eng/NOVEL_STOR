import { randomUUID } from "node:crypto"
import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { z } from "zod"
import { getDbPool } from "../../../utils/db"

const CreateArticleSchema = z.object({
  title: z.string().min(2, "Title is required").max(200),
  slug: z.string().min(2, "Slug is required").max(200).regex(/^[a-z0-9\u0621-\u064A-]+$/, "Slug must contain Arabic, lowercase alphanumeric characters or hyphens"),
  excerpt: z.string().max(1000).optional().default(""),
  content: z.string().min(1, "Content is required").max(100000),
  author_name: z.string().max(100).optional().default("هيئة التحرير"),
  category: z.string().max(100).optional().default("مقالات عامة"),
  cover_image: z.string().url().optional().default("https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=1200&q=80"),
  meta_title: z.string().max(200).optional(),
  meta_description: z.string().max(500).optional(),
  status:z.enum(["draft","published"]).default("published"),
})

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
    console.error("[CMS GET Error]", error)
    return res.status(500).json({ code: "INTERNAL_ERROR", message: "Failed to fetch articles." })
  }
}

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const pool = getDbPool()

  let validated
  try {
    validated = CreateArticleSchema.parse(req.body)
  } catch (err: any) {
    return res.status(400).json({ code: "VALIDATION_ERROR", errors: err.issues })
  }

  const id = `art_${randomUUID()}`
  try {
    const insertRes = await pool.query(
      `INSERT INTO cms_articles (id, title, slug, excerpt, content, author_name, category, cover_image, status, meta_title, meta_description, published_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $11, $9, $10, CASE WHEN $11='published' THEN NOW() ELSE NULL END)
       RETURNING *`,
      [
        id,
        validated.title,
        validated.slug,
        validated.excerpt,
        validated.content,
        validated.author_name,
        validated.category,
        validated.cover_image,
        validated.meta_title || validated.title,
        validated.meta_description || validated.excerpt || validated.title,
        validated.status,
      ]
    )
    return res.status(201).json({ article: insertRes.rows[0] })
  } catch (error: any) {
    console.error("[CMS POST Error]", error)
    if(error.code==="23505")return res.status(409).json({message:"الرابط الدائم مستخدم في مقال آخر."})
    return res.status(500).json({ code: "INTERNAL_ERROR", message: "Failed to create article." })
  }
}
