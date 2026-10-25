import { Pool } from "pg"

let pool: Pool | null = null

export function getDbPool(): Pool {
  if (!pool) {
    pool = new Pool({
      connectionString:
        process.env.DATABASE_URL ||
        "postgres://medusa_admin:SuperSecureDbPassword2026!@localhost:5432/medusa_db",
      max: 10,
      idleTimeoutMillis: 30000,
    })
  }
  return pool
}
