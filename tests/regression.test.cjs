const { test } = require("node:test")
const assert = require("node:assert/strict")
const { createHmac } = require("node:crypto")
const path = require("node:path")
const { loadSource, sdk, response } = require("./source-loader.cjs")
const realms = loadSource("apps/storefront/src/lib/realms.ts")
const books = loadSource("apps/storefront/src/lib/books-data.ts")
const { searchText } = loadSource("apps/storefront/src/lib/search-text.ts")
test("Arabic search finds vowelled titles and common alif variants", () => {
  assert.ok(searchText(books.getBookByHandle("book_little_01").title).includes(searchText("نونو")))
  assert.equal(searchText("  إِشَارَة  "), searchText("اشارة"))
  assert.equal(searchText("Book"), searchText("BOOK"))
})

test("unknown story handles never fall back to a different book", () => {
  for (const handle of ["unknown", "", "%E0%A4%A", "../kharaet-al-ramad"]) assert.equal(books.getBookByHandle(handle), undefined)
  assert.equal(books.getBookByHandle("kharaet-al-ramad").title, "خرائط الرماد")
})
test("catalog story identities are unique and remain in their assigned realm", () => {
  assert.equal(new Set(books.PUBLISHING_BOOKS.map(book => book.id)).size, books.PUBLISHING_BOOKS.length)
  assert.equal(new Set(books.PUBLISHING_BOOKS.map(book => book.handle)).size, books.PUBLISHING_BOOKS.length)
  assert.equal(realms.realmForAge(books.getBookByHandle("book_little_01").ageGroup), "little")
  assert.equal(realms.realmForAge(books.getBookByHandle("book_kids_01").ageGroup), "kids")
  assert.equal(realms.realmForAge(books.getBookByHandle("book_teens_01").ageGroup), "teens")
})
for (const realm of ["little", "kids", "teens"]) test(`${realm} navigation keeps reading tools and search query inside its own platform`, () => {
  for (const view of ["books", "reader/book_01", "player/book_01", "library", "illustrated", "words", "detective", "preferences"]) {
    assert.equal(realms.scopedHref(`/ar/${view}?q=hello`, realm), `/ar/realms/${realm}/${view}?q=hello`)
  }
  assert.equal(realms.scopedHref("/ar", realm), `/ar/realms/${realm}`)
  assert.equal(realms.realmFromPath(`/en/realms/${realm}/reader/one`), realm)
})
test("realm switches and external or account links keep their intended destination", () => {
  for (const url of ["/ar/realms/teens", "/en/login", "/ar/family-hub/verify", "/ar/about#privacy", "https://example.com"]) assert.equal(realms.scopedHref(url, "kids"), url)
  assert.equal(realms.scopedHref("/ar/books?age=kids_3_6&q=hi", "originals"), "/ar/realms/little/books?age=kids_3_6&q=hi")
  assert.equal(realms.realmFromPath("/ar/books"), "originals")
})
test("featured kids reading and illustration come from the supplied reference", () => {
  const reference = require("../apps/storefront/src/lib/stitch-reading-reference.json")
  const book = books.getBookByHandle("book_kids_01")
  assert.equal(book.coverUrl, reference.k04_base_1440.images[0].src)
  assert.ok(book.sampleText[1].includes("مِفْتَاحًا"))
  assert.ok(!book.sampleText.join(" ").includes("lightbulb"))
})
test("story audio data never substitutes sample music for narration", () => {
  assert.ok(books.PUBLISHING_BOOKS.every(book => !book.sampleAudioUrl.includes("soundhelix")))
})
const Modules = { PRICING: "pricing", INVENTORY: "inventory", LOCKING: "locking", REGION: "region", TAX: "tax", EVENT_BUS: "event_bus" }
const commonMocks = { "@medusajs/framework/workflows-sdk": sdk, "@medusajs/framework/utils": { Modules, PaymentWebhookEvents: { WebhookReceived: "payment.webhook_received" } } }
const dbPath = path.resolve(__dirname, "../apps/backend/src/utils/db")
const storyPath = path.resolve(__dirname, "../apps/backend/src/modules/story")
const subscriptionPath = path.resolve(__dirname, "../apps/backend/src/modules/subscription")
commonMocks[storyPath] = { STORY_MODULE: "story" }
commonMocks[subscriptionPath] = { SUBSCRIPTION_MODULE: "subscription" }
const { AddToCartSchema } = loadSource("packages/schemas/src/cart.schema.ts")
const { AddressSchema } = loadSource("packages/schemas/src/checkout.schema.ts")
const { nextBillingEnd } = loadSource("apps/backend/src/utils/billing-period.ts")
const { verifyHmacSignature } = loadSource("apps/backend/src/utils/webhook-signature.ts")
const { isPaidOrder, purchasedVariantIds } = loadSource("apps/backend/src/utils/media-licenses.ts")
const { resolveVariantPrice, roundMoney, PricingInputSchema } = loadSource("apps/backend/src/utils/variant-price.ts", commonMocks)
const checkout = loadSource("apps/backend/src/workflows/checkout-workflow.ts", commonMocks)
const { calculateBundleTotals } = loadSource("apps/backend/src/workflows/bundles/bundle-pricing-workflow.ts", commonMocks)

test("cart accepts real variant IDs containing underscores", () => assert.ok(AddToCartSchema.safeParse({ variant_id: "variant_book_ebook", quantity: 1 }).success))
for (const quantity of [-1, 0, 1.5, 101, Infinity]) test(`cart rejects invalid quantity ${quantity}`, () => assert.equal(AddToCartSchema.safeParse({ variant_id: "variant_a", quantity }).success, false))
test("cart rejects client-supplied prices", () => assert.equal(AddToCartSchema.safeParse({ variant_id: "variant_a", quantity: 1, unit_price: 0 }).success, false))
test("pricing workflow rejects empty carts and client prices", () => {
  assert.equal(PricingInputSchema.safeParse({ cart_id: "cart_a", currency_code: "sar", region_id: "reg_a", items: [] }).success, false)
  assert.equal(PricingInputSchema.safeParse({ cart_id: "cart_a", currency_code: "sar", region_id: "reg_a", items: [{ variant_id: "variant_a", quantity: 1, unit_price: 0 }] }).success, false)
})
test("billing clamps January 31 to February's final day", () => assert.equal(nextBillingEnd("2026-01-31T12:30:00Z", "month").toISOString(), "2026-02-28T12:30:00.000Z"))
test("billing handles leap-year annual renewal", () => assert.equal(nextBillingEnd("2024-02-29T00:00:00Z", "year").toISOString(), "2025-02-28T00:00:00.000Z"))
test("billing rejects malformed dates and unknown intervals", () => { assert.throws(() => nextBillingEnd("invalid", "month")); assert.throws(() => nextBillingEnd(new Date(), "week")) })

function sign(payload, timestamp = Math.floor(Date.now() / 1000), secret = "test-secret") { return `t=${timestamp},v1=${createHmac("sha256", secret).update(`${timestamp}.`).update(payload).digest("hex")}` }
const raw = '{ "id": "evt_test", "type": "payment_intent.succeeded", "data": { "object": {} } }'
test("webhooks verify exact raw bytes including whitespace", () => { assert.equal(verifyHmacSignature(raw, sign(raw), "test-secret"), true); assert.equal(verifyHmacSignature(JSON.stringify(JSON.parse(raw)), sign(raw), "test-secret"), false) })
test("webhooks support rotating signatures", () => assert.equal(verifyHmacSignature(raw, `${sign(raw)},v1=${"0".repeat(64)}`, "test-secret"), true))
test("webhooks reject expired or future timestamps", () => { assert.equal(verifyHmacSignature(raw, sign(raw, 1), "test-secret"), false); assert.equal(verifyHmacSignature(raw, sign(raw, Math.floor(Date.now() / 1000) + 1000), "test-secret"), false) })
test("webhooks reject malformed and duplicate timestamps", () => { assert.equal(verifyHmacSignature(raw, `${sign(raw)}x`, "test-secret"), false); assert.equal(verifyHmacSignature(raw, `${sign(raw)},t=1`, "test-secret"), false) })
test("webhooks queue verified events through Medusa's event bus", async () => {
  const previous = [process.env.STRIPE_API_KEY, process.env.STRIPE_WEBHOOK_SECRET]
  process.env.STRIPE_API_KEY = "sk_test_fake"; process.env.STRIPE_WEBHOOK_SECRET = "test-secret"
  try {
    const { POST } = loadSource("apps/backend/src/api/storefront/webhooks/payment/route.ts", commonMocks)
    let emitted
    const res = response()
    await POST({ headers: { "stripe-signature": sign(raw) }, rawBody: Buffer.from(raw), scope: { resolve: () => ({ emit: async (event) => { emitted = event } }) } }, res)
    assert.equal(res.statusCode, 200); assert.equal(res.body.status, "queued"); assert.equal(emitted.data.provider, "stripe_stripe")
    const missing = response(); await POST({ headers: { "stripe-signature": sign(raw) }, body: JSON.parse(raw) }, missing); assert.equal(missing.statusCode, 400)
    const failed = response(); await POST({ headers: { "stripe-signature": sign(raw) }, rawBody: Buffer.from(raw), scope: { resolve: () => ({ emit: async () => { throw new Error("offline") } }) } }, failed); assert.equal(failed.statusCode, 503)
  } finally { for (const [index, key] of ["STRIPE_API_KEY", "STRIPE_WEBHOOK_SECRET"].entries()) { if (previous[index] === undefined) delete process.env[key]; else process.env[key] = previous[index] } }
})

test("unpaid, canceled and refunded orders cannot unlock content", () => {
  assert.equal(isPaidOrder({ status: "pending", total: 20, payment_collections: [] }), false)
  assert.equal(isPaidOrder({ status: "canceled", total: 20, payment_collections: [{ captured_amount: 20 }] }), false)
  assert.equal(isPaidOrder({ total: 20, payment_collections: [{ captured_amount: 20, refunded_amount: 20 }] }), false)
  assert.equal(isPaidOrder({ total: 20, payment_collections: [{ captured_amount: 20, refunded_amount: 0 }] }), true)
})
test("license lookup paginates beyond the first 100 orders", async () => {
  const skips = []
  const licensed = await purchasedVariantIds({ resolve: () => ({ graph: async ({ pagination }) => {
    skips.push(pagination.skip)
    return { data: pagination.skip === 0 ? Array.from({ length: 100 }, () => ({ status: "pending", total: 10 })) : [{ status: "completed", total: 10, payment_collections: [{ captured_amount: 10 }], items: [{ variant_id: "variant_owned" }] }] }
  } }) }, "customer_a")
  assert.deepEqual(skips, [0, 100]); assert.deepEqual([...licensed], ["variant_owned"])
})
test("prices resolve the variant's linked price set and pricing context", async () => {
  let call
  const services = { query: { graph: async () => ({ data: [{ id: "variant_a", price_set: { id: "pset_real" } }] }) }, pricing: { calculatePrices: async (...args) => { call = args; return [{ calculated_amount: 19.95 }] } } }
  const price = await resolveVariantPrice({ resolve: (key) => services[key] }, "variant_a", "SAR", "reg_a", 3)
  assert.equal(price.amount, 19.95); assert.deepEqual(call[0], { id: ["pset_real"] }); assert.equal(call[1].context.region_id, "reg_a"); assert.equal(call[1].context.quantity, 3)
})
test("missing and negative prices fail closed", async () => {
  const container = { resolve: (key) => key === "query" ? { graph: async () => ({ data: [{ price_set: { id: "pset_a" } }] }) } : { calculatePrices: async () => [{ calculated_amount: -1 }] } }
  await assert.rejects(() => resolveVariantPrice(container, "variant_a", "sar", "reg_a", 1))
})
test("money rounds to major currency units", () => assert.equal(roundMoney(19.95 * 0.15), 2.99))
function line(product, format, quantity = 1, price = 20) { return { product_id: product, variant_id: `${product}_${format}`, title: format, format, quantity, unit_price: price, discount_amount: 0, final_subtotal: price * quantity } }
test("bundles do not discount unrelated titles", () => assert.equal(calculateBundleTotals([line("a", "ebook"), line("b", "audiobook")], "sar").total_discount, 0))
test("bundles only discount matched quantities", () => { const result = calculateBundleTotals([line("a", "ebook"), line("a", "audiobook", 10)], "sar"); assert.equal(result.total_discount, 10); assert.equal(result.subtotal, 210) })
test("duplicate bundle lines cannot reuse the same discount entitlement", () => assert.equal(calculateBundleTotals([line("a", "ebook"), line("a", "audiobook"), line("a", "audiobook")], "sar").total_discount, 10))

test("loyalty route denies anonymous and cross-customer access before querying DB", async () => {
  const { GET } = loadSource("apps/backend/src/api/store/loyalty/[customer_id]/route.ts", { [dbPath]: { getDbPool: () => { throw new Error("Must not query") } } })
  const anon = response(); await GET({ params: { customer_id: "customer_b" } }, anon); assert.equal(anon.statusCode, 401)
  const other = response(); await GET({ params: { customer_id: "customer_b" }, auth_context: { actor_id: "customer_a" } }, other); assert.equal(other.statusCode, 403)
})
test("product reviews exclude global null-product fixtures", async () => {
  const queries = []
  const { GET } = loadSource("apps/backend/src/api/store/reviews/[product_id]/route.ts", { [dbPath]: { getDbPool: () => ({ query: async (sql) => { queries.push(sql); return { rows: [{ total_reviews: "0", average_rating: "0" }] } } }) } })
  await GET({ params: { product_id: "prod_a" } }, response())
  assert.equal(queries.length, 2); assert.ok(queries.every((sql) => !sql.includes("product_id IS NULL")))
})
test("CRM rejects malformed actions before mutation", async () => {
  const { POST } = loadSource("apps/backend/src/api/admin/crm/route.ts", { [dbPath]: { getDbPool: () => ({ query: () => { throw new Error("Must not mutate") } }) } })
  for (const body of [null, {}, { action: "grant_credit", customer_id: "customer_a", credits_delta: -1 }, { action: "adjust_points", customer_id: "customer_a", points_delta: "not-a-number" }]) { const res = response(); await POST({ body }, res); assert.equal(res.statusCode, 400) }
})
test("zero-credit subscription renewals stay at zero and update conditionally", async () => {
  let values, sql
  const renewal = loadSource("apps/backend/src/workflows/subscriptions/subscription-renewal-workflow.ts", { ...commonMocks, [dbPath]: { getDbPool: () => ({ query: async (text, args) => { sql = text; values = args; return { rowCount: 1, rows: [{ remaining_credits: 0 }] } } }) } })
  const result = await renewal.advanceBillingPeriodStep.invoke({ subscription: { id: "sub_a", current_period_end: "2026-01-31T00:00:00Z" }, tier: { interval: "month", price_amount: 0, book_credits_per_period: 0 } }, {})
  assert.equal(result.result.credits_added, 0); assert.equal(values[3], 0); assert.ok(sql.includes("current_period_end = $2"))
})
test("paid subscriptions cannot renew without verified payment", async () => {
  const renewal = loadSource("apps/backend/src/workflows/subscriptions/subscription-renewal-workflow.ts", { ...commonMocks, [dbPath]: { getDbPool: () => ({ query: async () => ({ rowCount: 1 }) }) } })
  await assert.rejects(() => renewal.advanceBillingPeriodStep.invoke({ subscription: { id: "sub_a", current_period_end: "2026-01-31T00:00:00Z" }, tier: { interval: "month", price_amount: 29, book_credits_per_period: 2 } }, {}), /payment has not been confirmed/)
})

test("inventory uses variant links, locks and splits reservations across eligible locations", async () => {
  let locked = false
  const created = [], deleted = []
  const services = {
    query: { graph: async ({ entity }) => ({ data: entity === "cart" ? [{ sales_channel_id: "sc_a" }] : entity === "sales_channel" ? [{ stock_locations: [{ id: "loc_a" }, { id: "loc_b" }] }] : [{ id: "variant_a", manage_inventory: true, inventory_items: [{ inventory_item_id: "inv_real", required_quantity: 1 }] }] }) },
    locking: { execute: async (keys, run) => { assert.deepEqual(keys, ["inv_real"]); locked = true; try { return await run() } finally { locked = false } } },
    inventory: { listInventoryLevels: async () => { assert.equal(locked, true); return [{ location_id: "loc_a", stocked_quantity: 2, reserved_quantity: 0 }, { location_id: "loc_b", stocked_quantity: 2, reserved_quantity: 0 }, { location_id: "loc_ineligible", stocked_quantity: 100, reserved_quantity: 0 }] },
      createReservationItems: async (input) => { assert.equal(locked, true); created.push(input); return { id: `res_${created.length}` } },
      deleteReservationItems: async (ids) => deleted.push(...ids),
    },
  }
  const container = { resolve: (key) => services[key] }
  const result = await checkout.reserveInventoryStep.invoke({ cart_id: "cart_a", items: [{ variant_id: "variant_a", title: "Book", quantity: 3 }] }, { container })
  assert.deepEqual(created.map((item) => [item.location_id, item.quantity]), [["loc_a", 2], ["loc_b", 1]])
  assert.equal(result.result.reservationIds.length, 2)
  created.length = 0
  await assert.rejects(() => checkout.reserveInventoryStep.invoke({ cart_id: "cart_a", items: [{ variant_id: "variant_a", title: "Book", quantity: 5 }] }, { container }), /Insufficient stock/)
  assert.deepEqual(deleted, ["res_1", "res_2"])
})
test("taxes use the configured country default and retain fractions", async () => {
  const services = { region: { retrieveRegion: async () => ({ countries: [{ iso_2: "ae" }] }) }, tax: { listTaxRegions: async () => [{ id: "txreg_real", province_code: null }], listTaxRates: async (filter) => { assert.equal(filter.tax_region_id, "txreg_real"); return [{ rate: 5, is_default: true }] } } }
  const result = await checkout.calculateTaxesAndTotalsStep.invoke({ subtotal: 50, region_id: "reg_ae", currency_code: "aed" }, { container: { resolve: (key) => services[key] } })
  assert.equal(result.result.tax_total, 2.5); assert.equal(result.result.total, 52.5)
})
test("missing tax settings do not silently charge a hard-coded rate", async () => {
  const services = { region: { retrieveRegion: async () => ({ countries: [{ iso_2: "ae" }] }) }, tax: { listTaxRegions: async () => [] } }
  await assert.rejects(() => checkout.calculateTaxesAndTotalsStep.invoke({ subtotal: 50, region_id: "reg_a", currency_code: "aed" }, { container: { resolve: (key) => services[key] } }), /Tax region is not configured/)
})
test("DRM requires authorization before calling the signer", async () => {
  const drm = loadSource("apps/backend/src/workflows/drm/verify-media-access.ts", { ...commonMocks,
    [path.resolve(__dirname, "../apps/backend/src/utils/s3-drm")]: { generateDrmPresignedUrl: () => { throw new Error("Signer must not be called") } },
  })
  assert.equal((await drm.verifyCustomerLicenseStep.invoke({ media: { is_sample: true } }, {})).result.authorized, true)
  await assert.rejects(() => drm.verifyCustomerLicenseStep.invoke({ media: { is_sample: false } }, {}), /Authentication required/)
  await assert.rejects(() => drm.generateStreamTokenStep.invoke({ media: {}, authorized: false }), /DRM Access Denied/)
})
test("S3 URLs use the public endpoint and reject unsafe keys or long expiry", async () => {
  const names = ["S3_ACCESS_KEY", "S3_SECRET_KEY", "S3_PUBLIC_ENDPOINT"], previous = names.map((name) => process.env[name])
  process.env.S3_ACCESS_KEY = "test-key"; process.env.S3_SECRET_KEY = "test-secret"; process.env.S3_PUBLIC_ENDPOINT = "https://media.example.com"
  try {
    const drm = loadSource("apps/backend/src/utils/s3-drm.ts")
    for (const key of ["../secret", "/absolute", "books/../secret", "books\\secret", "", "books//one"]) assert.throws(() => drm.validateStorageKey(key))
    const url = new URL(await drm.generateDrmPresignedUrl("books/test.mp3"))
    assert.equal(url.origin, "https://media.example.com"); assert.equal(url.searchParams.get("X-Amz-Expires"), "60"); assert.ok(url.searchParams.get("X-Amz-Signature"))
    await assert.rejects(() => drm.generateDrmPresignedUrl("books/test.mp3", 61))
  } finally { names.forEach((name, index) => { if (previous[index] === undefined) delete process.env[name]; else process.env[name] = previous[index] }) }
})
