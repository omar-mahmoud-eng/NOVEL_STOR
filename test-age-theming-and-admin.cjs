const http = require("http")

async function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = ""
      res.on("data", (chunk) => (data += chunk))
      res.on("end", () => resolve({ statusCode: res.statusCode, data, headers: res.headers }))
    }).on("error", reject)
  })
}

async function runTests() {
  console.log("==========================================================================")
  console.log("AUDITING ALL CORE MEDUSA V2 TABS + PUBLISHING & CRM EXTENSIONS")
  console.log("==========================================================================")

  let passed = 0
  let total = 0

  function test(name, condition) {
    total++
    if (condition) {
      console.log(`[PASS] ${name}`)
      passed++
    } else {
      console.error(`[FAIL] ${name}`)
    }
  }

  // 1. Verify ALL Core Medusa Tabs
  const coreMedusaTabs = [
    { url: "http://localhost:9000/app/orders", name: "Core Medusa: Orders (الطلبات)" },
    { url: "http://localhost:9000/app/products", name: "Core Medusa: Products (المنتجات)" },
    { url: "http://localhost:9000/app/collections", name: "Core Medusa: Collections (المجموعات)" },
    { url: "http://localhost:9000/app/categories", name: "Core Medusa: Categories (التصنيفات)" },
    { url: "http://localhost:9000/app/customers", name: "Core Medusa: Customers (العملاء)" },
    { url: "http://localhost:9000/app/promotions", name: "Core Medusa: Promotions (العروض والخصومات)" },
    { url: "http://localhost:9000/app/pricing", name: "Core Medusa: Price Lists (قوائم الأسعار)" },
    { url: "http://localhost:9000/app/inventory", name: "Core Medusa: Inventory (المخزون والمستودعات)" },
    { url: "http://localhost:9000/app/settings", name: "Core Medusa: Settings (إعدادات المتجر)" },
  ]

  for (const tab of coreMedusaTabs) {
    try {
      const res = await fetchUrl(tab.url)
      test(`${tab.name} -> HTTP 200 without 404`, res.statusCode === 200 && res.data.includes("Medusa Store"))
    } catch {
      test(`${tab.name} connection`, false)
    }
  }

  // 2. Verify Publishing Extensions inside Medusa Dashboard
  const extensionTabs = [
    { url: "http://localhost:9000/app/crm", name: "Extension: Reader CRM 360°" },
    { url: "http://localhost:9000/app/stories", name: "Extension: Stories & Media Manager" },
    { url: "http://localhost:9000/app/authors", name: "Extension: Authors & Narrators Guild" },
    { url: "http://localhost:9000/app/subscriptions", name: "Extension: VIP Subscriptions" },
    { url: "http://localhost:9000/app/security", name: "Extension: DRM Security Vault" },
  ]

  for (const tab of extensionTabs) {
    try {
      const res = await fetchUrl(tab.url)
      test(`${tab.name} -> HTTP 200 without 404`, res.statusCode === 200)
    } catch {
      test(`${tab.name} connection`, false)
    }
  }

  // 3. Verify Storefront Homepage & Account Portal
  try {
    const homeRes = await fetchUrl("http://localhost:3000/ar")
    test("Storefront Homepage: HTTP 200", homeRes.statusCode === 200)
    test("Storefront Homepage: All 4 Age Departments Present",
      homeRes.data.includes("واحة الأطفال الصغار") &&
      homeRes.data.includes("كوكب الاستكشاف والناشئة") &&
      homeRes.data.includes("روايات الغموض لليافعين") &&
      homeRes.data.includes("صالون الأدب والتاريخ")
    )
  } catch (err) {
    test("Storefront Homepage fetch", false)
  }

  try {
    const accRes = await fetchUrl("http://localhost:3000/ar/account")
    test("Storefront Account Portal: HTTP 200", accRes.statusCode === 200)
    test("Storefront Account Portal: Smart Age Group Onboarding Present",
      accRes.data.includes("بوابة القراء والتوجيه الذكي") || accRes.data.includes("أهلاً بك في رواقك الأدبي المخصص")
    )
  } catch (err) {
    test("Storefront Account Portal fetch", false)
  }

  console.log("==========================================================================")
  console.log(`AUDIT FINISHED: ${passed}/${total} TESTS PASSED`)
  console.log("==========================================================================")
  if (passed === total) {
    process.exit(0)
  } else {
    process.exit(1)
  }
}

runTests()
