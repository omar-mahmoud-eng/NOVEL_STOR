const path = require("node:path")
require("dotenv").config({ path: path.resolve(__dirname, "../apps/backend/.env"), quiet: true })
const { Pool } = require("pg")
const fixtures = {
  "samsem-the-bunny-adventure": [45, 20, 25],
  "where-did-my-shiny-star-go": [38, 15, 20],
  "secret-spaceship-emerald-planet": [55, 25, 30],
  "alhambra-code-andalusian-manuscript": [75, 35, 45],
  "spectres-of-ancient-baghdad": [85, 40, 50],
}
async function main() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL required")
  const pool = new Pool({ connectionString: process.env.DATABASE_URL })
  const client = await pool.connect()
  try {
    await client.query("BEGIN")
    const { rows } = await client.query(`SELECT pr.id, pr.amount, pr.raw_amount, p.handle, v.sku
      FROM product p JOIN product_variant v ON v.product_id = p.id
      JOIN product_variant_price_set l ON l.variant_id = v.id
      JOIN price pr ON pr.price_set_id = l.price_set_id
      WHERE p.handle = ANY($1) AND p.deleted_at IS NULL AND v.deleted_at IS NULL
        AND l.deleted_at IS NULL AND pr.deleted_at IS NULL AND pr.currency_code = 'sar'
        AND pr.price_list_id IS NULL FOR UPDATE OF pr`, [Object.keys(fixtures)])
    const changes = rows.flatMap((row) => {
      const index = ["PAPERBACK", "EBOOK", "AUDIOBOOK"].findIndex((format) => row.sku === `${row.handle.toUpperCase()}-${format}`)
      if (index < 0) return []
      const expected = fixtures[row.handle][index]
      if (Number(row.amount) === expected) return []
      if (!fixtures[row.handle].some((value) => Number(row.amount) === value * 100)) throw new Error(`Unexpected non-fixture price for ${row.sku}; refusing to overwrite`)
      return [{ ...row, expected }]
    })
    console.log(`Seed price corrections: ${changes.length}. Historical orders are untouched.`)
    if (!process.argv.includes("--apply")) { await client.query("ROLLBACK"); return }
    await client.query(`CREATE TABLE IF NOT EXISTS storyverse_price_repair_backup
      (price_id text PRIMARY KEY, amount numeric NOT NULL, raw_amount jsonb, repaired_at timestamptz NOT NULL DEFAULT NOW())`)
    for (const change of changes) {
      await client.query("INSERT INTO storyverse_price_repair_backup (price_id, amount, raw_amount) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING", [change.id, change.amount, change.raw_amount])
      await client.query("UPDATE price SET amount = $2::numeric, raw_amount = jsonb_build_object('value', $3::text, 'precision', 20), updated_at = NOW() WHERE id = $1", [change.id, change.expected, String(change.expected)])
    }
    await client.query("COMMIT")
    console.log("Corrections committed; original price values retained in storyverse_price_repair_backup.")
  } catch (error) { await client.query("ROLLBACK"); throw error }
  finally { client.release(); await pool.end() }
}
main().catch((error) => { console.error(error.message); process.exitCode = 1 })
