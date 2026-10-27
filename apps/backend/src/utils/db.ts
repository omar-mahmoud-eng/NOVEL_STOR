import { Pool, type PoolClient } from "pg"

let pool: Pool | null = null

export function getDbPool(): Pool {
  if (!pool) {
    const connStr = process.env.DATABASE_URL
    if (!connStr) throw new Error("DATABASE_URL is required")

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

export async function withTransaction<T>(action: (client: PoolClient) => Promise<T>): Promise<T> {
  const client = await getDbPool().connect()
  try {
    await client.query("BEGIN")
    const result = await action(client)
    await client.query("COMMIT")
    return result
  } catch (error) {
    await client.query("ROLLBACK")
    throw error
  } finally {
    client.release()
  }
}
