const { spawnSync } = require("node:child_process")
const npm = process.platform === "win32" ? "npm.cmd" : "npm"
for (const script of ["test", "typecheck", ...(process.env.RUN_SMOKE_TESTS === "true" ? ["test:smoke"] : [])]) {
  const result = spawnSync(npm, ["run", script], { cwd: __dirname, stdio: "inherit", shell: process.platform === "win32" })
  if (result.error || result.status !== 0) process.exit(result.status || 1)
}
console.log("Requested verification suites passed. See AUDIT_REPORT.md for scope and external service requirements.")
