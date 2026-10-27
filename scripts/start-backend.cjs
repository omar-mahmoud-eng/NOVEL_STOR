const { spawn } = require("node:child_process")
const path = require("node:path")
const fs = require("node:fs")
const root = path.resolve(__dirname, "..")
const backend = path.join(root, "apps", "backend")
require("dotenv").config({ path: path.join(backend, ".env"), quiet: true })
const built = path.join(backend, ".medusa", "server")
if (!fs.existsSync(path.join(built, "medusa-config.js"))) {
  console.error("Backend build missing. Run npm run build --workspace=@enterprise/backend first.")
  process.exit(1)
}
const child = spawn(process.execPath, [path.join(root, "node_modules", "@medusajs", "cli", "cli.js"), "start"], {
  cwd: built, env: { ...process.env, NODE_ENV: "production" }, stdio: "inherit",
})
child.on("error", (error) => { console.error(error.message); process.exitCode = 1 })
child.on("exit", (code) => { process.exitCode = code || 0 })
process.on("SIGINT", () => child.kill("SIGINT"))
process.on("SIGTERM", () => child.kill("SIGTERM"))
