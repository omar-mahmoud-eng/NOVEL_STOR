const fs = require("node:fs")
const path = require("node:path")
const { spawnSync } = require("node:child_process")
const { randomBytes } = require("node:crypto")
const dotenv = require("dotenv")
const root = path.resolve(__dirname, "..")
const envPath = path.join(root, ".env")
const existing = fs.existsSync(envPath) ? fs.readFileSync(envPath, "utf8") : fs.readFileSync(path.join(root, ".env.template"), "utf8")
const values = dotenv.parse(existing)
const backend = dotenv.parse(fs.readFileSync(path.join(root, "apps/backend/.env")))
const storefront = dotenv.parse(fs.readFileSync(path.join(root, "apps/storefront/.env.local")))
const changes = {}
for (const key of ["JWT_SECRET", "COOKIE_SECRET", "ADMIN_EMAIL", "ADMIN_PASSWORD"]) {
  if (backend[key]) changes[key] = backend[key]
}
for (const key of ["POSTGRES_PASSWORD", "REDIS_PASSWORD", "MINIO_ROOT_PASSWORD"]) {
  if (!values[key] || /^(CHANGE_ME|changeme|password)$/i.test(values[key])) changes[key] = randomBytes(32).toString("hex")
}
if (!values.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY && storefront.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY) changes.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY = storefront.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
const backup = path.join(root, "scratch", "docker-backups", new Date().toISOString().replace(/[:.]/g, "-"))
fs.mkdirSync(backup, { recursive: true })
fs.writeFileSync(path.join(backup, "environment.before.env"), existing, { mode: 0o600 })
const dump = spawnSync("docker", ["exec", "medusa-postgres", "pg_dump", "-U", values.POSTGRES_USER || "medusa_admin", "-d", values.POSTGRES_DB || "medusa_db", "--format=custom"], { maxBuffer: 128 * 1024 * 1024 })
if (dump.status !== 0) throw new Error("Database backup failed; configuration left unchanged. " + dump.stderr?.toString().replace(/postgres:\/\/[^\s]+/g, "[redacted]"))
fs.writeFileSync(path.join(backup, "database.before.dump"), dump.stdout)
let output = existing
for (const [key, value] of Object.entries(changes)) {
  const line = `${key}=${JSON.stringify(value)}`
  const pattern = new RegExp(`^${key}=.*$`, "m")
  output = pattern.test(output) ? output.replace(pattern, line) : output.trimEnd() + "\n" + line + "\n"
}
fs.writeFileSync(envPath, output, { mode: 0o600 })
console.log("Database backed up:", path.relative(root, path.join(backup, "database.before.dump")))
console.log("Docker configuration synchronized:", Object.keys(changes).join(", "))
console.log("Secret values are not printed.")
