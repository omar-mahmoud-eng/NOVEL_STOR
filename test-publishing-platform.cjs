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

async function runPublishingTestSuite() {
  console.log("=================================================================")
  console.log("STARTING FULL PUBLISHING & STORYTELLING E-COMMERCE TEST SUITE")
  console.log("=================================================================")

  const testCases = [
    {
      name: "1. Arabic Homepage (RTL)",
      url: "http://localhost:3000/ar",
      expectText: "منصة النشر المتعددة",
    },
    {
      name: "2. English Homepage (LTR)",
      url: "http://localhost:3000/en",
      expectText: "Multi-Format Publishing",
    },
    {
      name: "3. Arabic Books Catalog (Safe Kids Mode & Age Categories)",
      url: "http://localhost:3000/ar/books",
      expectText: "جميع الفئات العمرية",
    },
    {
      name: "4. English Books Catalog",
      url: "http://localhost:3000/en/books",
      expectText: "All Ages",
    },
    {
      name: "5. Multi-Format Book Detail: Kids 3-6 (Samsem Adventure)",
      url: "http://localhost:3000/ar/books/samsem-the-bunny-adventure",
      expectText: "سمسم في الغابة السحرية",
    },
    {
      name: "6. Multi-Format Variant Switcher (Paperback, E-Book, Audiobook)",
      url: "http://localhost:3000/ar/books/samsem-the-bunny-adventure",
      expectText: "نسخة ورقية فاخرة",
    },
    {
      name: "7. Server-Side Bundle Discount Offer Banner",
      url: "http://localhost:3000/ar/books/samsem-the-bunny-adventure",
      expectText: "باقة القارئ والمستمع الشاملة",
    },
    {
      name: "8. Multi-Format Book Detail: Middle Grade 7-12 (Emerald Planet)",
      url: "http://localhost:3000/ar/books/secret-spaceship-emerald-planet",
      expectText: "سفينة الفضاء السرية",
    },
    {
      name: "9. Multi-Format Book Detail: Teens 13-17 (Alhambra Code)",
      url: "http://localhost:3000/ar/books/alhambra-code-andalusian-manuscript",
      expectText: "شفرة قصر الحمراء",
    },
    {
      name: "10. Multi-Format Book Detail: Adults 18+ (Spectres of Baghdad)",
      url: "http://localhost:3000/ar/books/spectres-of-ancient-baghdad",
      expectText: "أطياف بغداد القديمة",
    },
    {
      name: "11. Protected Customer Digital Library (In-Browser Web Reader & DRM)",
      url: "http://localhost:3000/ar/library",
      expectText: "مكتبتي الرقمية المؤمنة",
    },
    {
      name: "12. English Customer Digital Library",
      url: "http://localhost:3000/en/library",
      expectText: "My Protected Digital Library",
    },
    {
      name: "13. VIP Subscription & Membership Tiers (Kids, Monthly, Annual)",
      url: "http://localhost:3000/ar/subscriptions",
      expectText: "باقة القارئ والمستمع VIP",
    },
    {
      name: "14. English VIP Subscription Plans",
      url: "http://localhost:3000/en/subscriptions",
      expectText: "Monthly VIP Reader",
    },
    {
      name: "15. Multi-Step Checkout Flow",
      url: "http://localhost:3000/ar/checkout",
      expectText: "عنوان الشحن والتوصيل",
    },
  ]

  let passed = 0
  let failed = 0

  for (const test of testCases) {
    try {
      const res = await fetchUrl(test.url)
      const hasText = res.body.includes(test.expectText)
      if (res.status === 200 && hasText) {
        console.log(
          `[PASS] ${test.name}\n       -> HTTP ${res.status} | Size: ${res.length} bytes | Content match: "${test.expectText}"`
        )
        passed++
      } else {
        console.error(
          `[FAIL] ${test.name}\n       -> HTTP ${res.status} | Found: ${hasText} | Expected text: "${test.expectText}"`
        )
        failed++
      }
    } catch (err) {
      console.error(`[ERROR] ${test.name}\n       -> Request failed: ${err.message}`)
      failed++
    }
  }

  console.log("=================================================================")
  console.log(`FINAL PUBLISHING TEST RESULTS: ${passed}/${testCases.length} PASSED (${failed} FAILED)`)
  console.log("=================================================================")

  if (failed > 0) {
    process.exit(1)
  }
}

runPublishingTestSuite()
