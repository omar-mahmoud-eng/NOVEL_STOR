const { spawn } = require("child_process")
const http = require("http")

const child = spawn("cmd.exe", ["/c", "npx", "next", "dev", "-p", "3001"], {
  cwd: "C:/Users/D/Desktop/New folder (2)/apps/storefront",
  stdio: "pipe",
})

child.stdout.on("data", (data) => {
  const str = data.toString()
  console.log("[DEV]", str)
  if (str.includes("Ready") || str.includes("started server") || str.includes("3001") || str.includes("Local:")) {
    setTimeout(() => {
      console.log("Sending test request to http://localhost:3001/ar ...")
      http.get("http://localhost:3001/ar", (res) => {
        let body = ""
        res.on("data", (chunk) => (body += chunk))
        res.on("end", () => {
          console.log("Response Status:", res.statusCode)
          if (res.statusCode >= 400 || body.includes("Error") || body.includes("invariant")) {
            console.log("Response Error Snippet:", body.slice(0, 1000))
          } else {
            console.log("SUCCESS! HTML length received:", body.length)
          }
          child.kill()
          process.exit(0)
        })
      }).on("error", (err) => {
        console.error("HTTP Error:", err.message)
        child.kill()
        process.exit(1)
      })
    }, 2000)
  }
})

child.stderr.on("data", (data) => console.error("[DEV ERR]", data.toString()))
setTimeout(() => {
  child.kill()
  process.exit(0)
}, 30000)
