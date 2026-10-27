import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { backendFetch, customerToken, setCustomerToken, sameOrigin, CUSTOMER_COOKIE } from "@/lib/medusa-server"
import { z } from "zod"

const credentials = z.object({
  action: z.enum(["login", "register"]),
  email: z.string().trim().email().max(255),
  password: z.string().min(8).max(256),
  name: z.string().trim().min(1).max(128).optional(),
  phone: z.string().trim().max(30).optional(),
  ageGroup: z.enum(["kids_3_6", "kids_7_12", "teens_13_17", "adults_18_plus"]).optional(),
  preferredFormat: z.enum(["paperback", "ebook", "audiobook", "hybrid"]).optional(),
})

function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status, headers: { "Cache-Control": "private, no-store" } })
}

export async function GET() {
  const token = await customerToken()
  if (!token) return json({ customer: null }, 401)
  try {
    const response = await backendFetch("/store/customers/me", {}, token)
    if (!response.ok) return json({ customer: null }, response.status)
    return json(await response.json())
  } catch {
    return json({ message: "Customer service unavailable" }, 502)
  }
}

export async function DELETE(request: Request) {
  if (!sameOrigin(request)) return json({ message: "Invalid origin" }, 403)
  ;(await cookies()).delete(CUSTOMER_COOKIE)
  return json({ success: true })
}

export async function POST(request: Request) {
  if (!sameOrigin(request)) return json({ message: "Invalid origin" }, 403)
  try {
    const input = credentials.safeParse(await request.json())
    if (!input.success) return json({ message: "Valid email and password (at least 8 characters) required" }, 400)
    const { action, email, password, name, phone, ageGroup, preferredFormat } = input.data
    const auth = await backendFetch(`/auth/customer/emailpass${action === "register" ? "/register" : ""}`, {
      method: "POST", body: JSON.stringify({ email, password }),
    })
    if (!auth.ok) return json({ message: action === "login" ? "Invalid email or password" : "Unable to register this email" }, auth.status)
    let { token } = await auth.json()
    if (typeof token !== "string") throw new Error("Missing token")
    if (action === "register") {
      const parts = (name || email.split("@")[0]).split(/\s+/)
      const created = await backendFetch("/store/customers", {
        method: "POST",
        body: JSON.stringify({ email, first_name: parts[0], last_name: parts.slice(1).join(" "), phone: phone || undefined,
          metadata: { ageGroup: ageGroup || "adults_18_plus", preferredFormat: preferredFormat || "ebook" } }),
      }, token)
      if (!created.ok) return json({ message: "Unable to create customer profile" }, created.status)
      // Obtain a token containing the newly created customer actor ID.
      const login = await backendFetch("/auth/customer/emailpass", { method: "POST", body: JSON.stringify({ email, password }) })
      if (!login.ok) throw new Error("Unable to sign in after registration")
      token = (await login.json()).token
    }
    const profile = await backendFetch("/store/customers/me", {}, token)
    if (!profile.ok) return json({ message: "Unable to load customer profile" }, profile.status)
    await setCustomerToken(token)
    return json(await profile.json())
  } catch {
    return json({ message: "Authentication service unavailable" }, 502)
  }
}
