const { spawn } = require("node:child_process")
const path = require("node:path")
const npm = process.platform === "win32" ? "npm.cmd" : "npm"
const children = ["@enterprise/backend", "@enterprise/storefront"].map((workspace) => spawn(npm, ["run", "dev", `--workspace=${workspace}`], {
  cwd: path.resolve(__dirname, ".."), stdio: "inherit", shell: process.platform === "win32",
}))
let stopping = false
function stop(code = 0) {
  if (stopping) return
  stopping = true
  for (const child of children) {
    if (child.exitCode !== null) continue
    if (process.platform === "win32") spawn("taskkill", ["/pid", String(child.pid), "/T", "/F"], { stdio: "ignore" })
    else child.kill("SIGTERM")
  }
  process.exitCode = code
}
for (const child of children) { child.on("error", (error) => { console.error(error.message); stop(1) }); child.on("exit", (code) => stop(code || 0)) }
process.on("SIGINT", () => stop())
process.on("SIGTERM", () => stop())
