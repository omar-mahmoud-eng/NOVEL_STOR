require("./scripts/project-env.cjs")
const { Client } = require("pg")

const client = new Client({
  connectionString: process.env.DATABASE_URL
})

async function testConnection() {
  try {
    await client.connect()
    console.log(">>> SUCCESS: Connected to REAL PostgreSQL Database running in Docker!")
    const res = await client.query("SELECT version();")
    console.log("PostgreSQL Version:", res.rows[0].version)
    await client.end()
  } catch (err) {
    console.error(">>> ERROR connecting to Postgres:", err.message)
    process.exit(1)
  }
}

testConnection()
