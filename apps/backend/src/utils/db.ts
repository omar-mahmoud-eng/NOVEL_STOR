import { Pool } from "pg"

let pool: Pool | null = null

export function getDbPool(): Pool {
  if (!pool) {
    const connStr =
      process.env.DATABASE_URL ||
      "postgres://medusa_admin:SuperSecureDbPassword2026!@localhost:5432/medusa_db"

    pool = new Pool({
      connectionString: connStr,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    })

    pool.on("error", (err) => {
      console.error("[PostgreSQL Pool Error]", err.message)
    })
  }
  return pool
}
