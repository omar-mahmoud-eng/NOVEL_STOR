const assert = require("node:assert/strict")
const fs = require("node:fs")
const path = require("node:path")
const { randomBytes } = require("node:crypto")
const { chromium, request } = require("playwright")
require("dotenv").config({ path: path.resolve(__dirname, "../apps/backend/.env"), quiet: true })
const base = process.env.TEST_STOREFRONT_URL || "http://localhost:3000"
const backend = process.env.TEST_BACKEND_URL || "http://localhost:9000"
const result = { pages: [], browser: [], api: [], errors: [] }

async function main() {
  const api = await request.newContext({ baseURL: base, timeout: 30000 })
  for (const url of ["/ar", `${backend}/health`]) {
    const deadline = Date.now() + 60000
    while (true) {
      try { if ((await api.get(url, { timeout: 3000 })).ok()) break } catch {}
      if (Date.now() > deadline) throw new Error(`Service did not become ready: ${url}`)
      await new Promise((resolve) => setTimeout(resolve, 500))
    }
  }
  const routes = ["", "/books", "/products", "/audiobooks", "/genres", "/account", "/library", "/subscriptions", "/family-hub", "/preferences", "/mood-selector", "/atlas", "/illustrated", "/interactive", "/salons", "/realms/little", "/realms/kids", "/realms/teens", "/checkout", "/books/samsem-the-bunny-adventure", "/reader/samsem-the-bunny-adventure", "/player/samsem-the-bunny-adventure"]
  const products = await (await api.get("/api/medusa/store/products?limit=1")).json()
  if (products.products?.length) routes.push("/products/" + products.products[0].handle)
  for (const locale of ["ar", "en"]) {
    for (const route of routes) {
      const url = `/${locale}${route}`, response = await api.get(url)
      const body = await response.text()
      assert.equal(response.status(), 200, `${url}: expected HTTP 200`)
      assert.ok(!body.includes("Application error: a client-side exception"), `${url}: application error`)
      result.pages.push(url)
    }
  }
  assert.equal((await api.get("/ar/route-that-does-not-exist")).status(), 404)
  for (const endpoint of ["/api/customer", "/api/medusa/store/library", "/api/medusa/store/loyalty/customer_other", "/api/medusa/store/tracking/unknown"]) {
    const response = await api.get(endpoint)
    assert.equal(response.status(), 401, `${endpoint}: anonymous request must be denied`)
    result.api.push({ endpoint, status: response.status() })
  }
  const login = await api.post("/api/customer", { data: { action: "login", email: "missing-audit-user@example.com", password: "wrong-password" } })
  assert.equal(login.status(), 401, "Invalid credentials must not create a local session")
  const csrf = await api.post("/api/customer", { headers: { Origin: "https://invalid.example" }, data: { action: "login", email: "a@example.com", password: "password123" } })
  assert.equal(csrf.status(), 403)
  const escaped = await api.get("/api/medusa/admin/users")
  assert.equal(escaped.status(), 404, "Store proxy must not expose the admin API")

  if (process.env.SMOKE_MUTATIONS === "true") {
    const email = `storyverse-audit-${Date.now()}@example.com`, password = randomBytes(20).toString("hex")
    let customerId
    let cartId
    try {
      const register = await api.post("/api/customer", { data: { action: "register", email, password, name: "Audit Test", ageGroup: "adults_18_plus" } })
      assert.equal(register.status(), 200, `Registration failed: ${await register.text()}`)
      customerId = (await register.json()).customer.id
      const session = await api.get("/api/customer")
      assert.equal((await session.json()).customer.id, customerId)
      const cookies = (await api.storageState()).cookies
      const cookie = cookies.find((value) => value.name === "storyverse_customer_token")
      assert.equal(cookie.httpOnly, true); assert.equal(cookie.sameSite, "Lax")
      const library = await api.get("/api/medusa/store/library")
      assert.equal(library.status(), 200, await library.text())
      assert.deepEqual((await library.json()).items, [])
      const forbidden = await api.get("/api/medusa/store/loyalty/customer_other")
      assert.equal(forbidden.status(), 403)
      const loyalty = await api.get(`/api/medusa/store/loyalty/${customerId}`)
      assert.equal(loyalty.status(), 200)
      assert.equal((await loyalty.json()).loyalty.points_balance, 0)
      const orders = await api.get("/api/medusa/store/orders")
      assert.equal(orders.status(), 200)
      const cartResponse = await api.post("/api/medusa/store/carts", { data: {} })
      assert.ok(cartResponse.ok())
      const cart = (await cartResponse.json()).cart
      cartId = cart.id
      const productResponse = await api.get(`/api/medusa/store/products?${new URLSearchParams({ handle: "samsem-the-bunny-adventure", region_id: cart.region_id, fields: "*variants.calculated_price" })}`)
      const variant = (await productResponse.json()).products[0].variants.find((value) => value.sku.endsWith("-EBOOK"))
      const added = await api.post(`/api/medusa/store/carts/${cartId}/line-items`, { data: { variant_id: variant.id, quantity: 1 } })
      assert.ok(added.ok(), await added.text())
      const line = (await added.json()).cart.items[0]
      assert.equal(line.unit_price, variant.calculated_price.calculated_amount)
      const tampered = await api.post(`/api/medusa/store/carts/${cartId}/line-items`, { data: { variant_id: variant.id, quantity: 1, unit_price: 0 } })
      assert.equal(tampered.status(), 400, "Client prices must be rejected")
      assert.ok((await api.delete(`/api/medusa/store/carts/${cartId}/line-items/${line.id}`)).ok())
      const refreshed = await api.get(`/api/medusa/store/carts/${cartId}`)
      assert.deepEqual((await refreshed.json()).cart.items, [])
      assert.match(refreshed.headers()["cache-control"], /no-store/)
      await api.delete("/api/customer")
      assert.equal((await api.get("/api/customer")).status(), 401)
      result.api.push({ registration: "passed", login: "passed", logout: "passed", ownership: "passed" })
    } finally {
      // Remove only the uniquely named test identity created by this run.
      if (process.env.DATABASE_URL) {
        const { Pool } = require("pg"), pool = new Pool({ connectionString: process.env.DATABASE_URL })
        const client = await pool.connect()
        try {
          await client.query("BEGIN")
          if (cartId) {
            await client.query("DELETE FROM cart_line_item WHERE cart_id = $1", [cartId])
            await client.query("DELETE FROM cart WHERE id = $1", [cartId])
          }
          if (customerId) await client.query("DELETE FROM customer WHERE id = $1 AND email = $2", [customerId, email])
          const identities = await client.query("SELECT auth_identity_id FROM provider_identity WHERE entity_id = $1 AND provider = 'emailpass'", [email])
          for (const row of identities.rows) {
            await client.query("DELETE FROM provider_identity WHERE auth_identity_id = $1 AND entity_id = $2", [row.auth_identity_id, email])
            await client.query("DELETE FROM auth_identity WHERE id = $1 AND NOT EXISTS (SELECT 1 FROM provider_identity WHERE auth_identity_id = $1)", [row.auth_identity_id])
          }
          await client.query("COMMIT")
        } catch (error) { await client.query("ROLLBACK"); throw error }
        finally { client.release(); await pool.end() }
      }
    }
  }

  if (process.env.TEST_ADMIN_PASSWORD) {
    const auth = await api.post(`${backend}/auth/user/emailpass`, { data: { email: process.env.TEST_ADMIN_EMAIL || process.env.ADMIN_EMAIL, password: process.env.TEST_ADMIN_PASSWORD } })
    assert.ok(auth.ok(), "Configured test admin credentials were rejected")
    const { token } = await auth.json()
    for (const endpoint of ["command-center", "marketing", "reviews", "loyalty", "affiliates", "helpdesk", "warehouse", "cms", "authors", "narrators", "subscription-tiers", "crm", "products", "orders"]) {
      const response = await api.get(`${backend}/admin/${endpoint}`, { headers: { Authorization: `Bearer ${token}` } })
      assert.equal(response.status(), 200, `/admin/${endpoint}`)
      result.api.push({ endpoint: `/admin/${endpoint}`, status: response.status() })
    }
  }

  const browser = await chromium.launch({ channel: process.env.TEST_BROWSER_CHANNEL || "msedge", headless: true })
  try {
    for (const viewport of [{ width: 1440, height: 1000 }, { width: 390, height: 844 }]) {
      const context = await browser.newContext({ viewport })
      const page = await context.newPage()
      const errors = []
      page.on("pageerror", (error) => errors.push(error.message))
      for (const url of ["/ar", "/en", "/ar/books", "/ar/books/samsem-the-bunny-adventure", "/ar/account", "/ar/library", "/ar/checkout"]) {
        const session = page.waitForResponse((response) => new URL(response.url()).pathname === "/api/customer")
        await page.goto(`${base}${url}`, { waitUntil: "domcontentloaded" })
        await session
        assert.ok((await page.locator("body").innerText()).trim().length > 20, `${url}: blank page`)
        assert.equal(await page.locator("html").evaluate((element) => element.scrollWidth > window.innerWidth + 1), false, `${url}: horizontal overflow at ${viewport.width}px`)
        if (viewport.width === 390 && url === "/ar") {
          const menu = page.getByRole("button", { name: "Toggle menu" })
          await menu.click()
          assert.equal(await page.locator("#mobile-navigation").isVisible(), true)
          assert.equal(await page.locator("#mobile-navigation a").count(), 10)
          await menu.click()
          assert.equal(await page.locator("#mobile-navigation").count(), 0)
        }
        if (url === "/ar/account") { assert.equal(await page.locator('input[type="password"]').count(), 1); assert.equal(await page.getByText("Sign In & Enter", { exact: true }).count(), 0) }
        result.browser.push({ url, width: viewport.width })
      }
      assert.deepEqual(errors, [], "Browser runtime errors")
      await context.close()
    }
  } finally { await browser.close(); await api.dispose() }
  console.log(`PASS: ${result.pages.length} HTTP pages, ${result.browser.length} browser page/viewport checks, authentication and API guards.`)
}
main().catch((error) => { result.errors.push(error.message); console.error(error.stack); process.exitCode = 1 }).finally(() => {
  fs.mkdirSync(path.resolve(__dirname, "../scratch"), { recursive: true })
  fs.writeFileSync(path.resolve(__dirname, "../scratch/smoke-results.json"), JSON.stringify(result, null, 2))
})
