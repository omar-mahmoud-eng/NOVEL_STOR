const { spawn } = require("child_process")
const http = require("http")

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    http
      .get(url, (res) => {
        let body = ""
        res.on("data", (chunk) => (body += chunk))
        res.on("end", () => {
          resolve({ status: res.statusCode, length: body.length, body })
        })
      })
      .on("error", reject)
  })
}

async function runTestSuite() {
  console.log("=================================================================")
  console.log("STARTING FULL AUTOMATED INTEGRATION & UI TEST SUITE")
  console.log("=================================================================")

  const child = spawn("cmd.exe", ["/c", "npx", "next", "dev", "-p", "3003"], {
    cwd: "C:/Users/D/Desktop/New folder (2)/apps/storefront",
    stdio: "pipe",
  })

  child.stdout.on("data", (d) => {
    const s = d.toString()
    if (s.includes("Ready in") || s.includes("3003")) {
      console.log("[STOREFRONT DEV SERVER] Ready on port 3003")
    }
  })

  // Wait 4 seconds for server to boot
  await new Promise((r) => setTimeout(r, 4000))

  const testRoutes = [
    { name: "1. Arabic Homepage (RTL)", url: "http://localhost:3003/ar", expectText: "المتجر الإلكتروني" },
    { name: "2. English Homepage (LTR)", url: "http://localhost:3003/en", expectText: "Enterprise Store" },
    { name: "3. Arabic Products Catalog", url: "http://localhost:3003/ar/products", expectText: "جميع المنتجات" },
    { name: "4. English Products Catalog", url: "http://localhost:3003/en/products", expectText: "All Products" },
    { name: "5. Arabic Product Detail Page", url: "http://localhost:3003/ar/products/pro-wireless-headphones-anc", expectText: "سماعات الرأس" },
    { name: "6. English Product Detail Page", url: "http://localhost:3003/en/products/ultra-smartwatch-titanium", expectText: "WATCH-ULTRA-TI" },
    { name: "7. Arabic Multi-Step Checkout", url: "http://localhost:3003/ar/checkout", expectText: "عنوان الشحن والتوصيل" },
    { name: "8. English Multi-Step Checkout", url: "http://localhost:3003/en/checkout", expectText: "Shipping Address" },
    { name: "9. Arabic Customer Account Portal", url: "http://localhost:3003/ar/account", expectText: "سجل الطلبات" },
    { name: "10. English Customer Account Portal", url: "http://localhost:3003/en/account", expectText: "Order History" },
  ]

  let passed = 0
  let failed = 0

  for (const test of testRoutes) {
    try {
      const res = await fetchUrl(test.url)
      const hasText = res.body.includes(test.expectText)
      if (res.status === 200 && hasText) {
        console.log(`[PASS] ${test.name} -> HTTP ${res.status} | Size: ${res.length} bytes | Verified: "${test.expectText}"`)
        passed++
      } else {
        console.error(`[FAIL] ${test.name} -> HTTP ${res.status} | Content match: ${hasText}`)
        failed++
      }
    } catch (err) {
      console.error(`[ERROR] ${test.name} -> Request failed: ${err.message}`)
      failed++
    }
  }

  console.log("=================================================================")
  console.log(`FINAL TEST RESULTS: ${passed}/10 PASSED (${failed} FAILED)`)
  console.log("=================================================================")

  child.kill()
  process.exit(failed > 0 ? 1 : 0)
}

runTestSuite()
