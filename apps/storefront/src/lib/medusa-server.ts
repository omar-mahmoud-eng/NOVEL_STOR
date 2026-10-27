import "server-only"
import { cookies, headers as requestHeaders } from "next/headers"
import {allowedRequestOrigin}from"./request-origin"

export const CUSTOMER_COOKIE = "storyverse_customer_token"

export async function backendFetch(path: string, init: RequestInit = {}, token?: string) {
  const headers = new Headers(init.headers)
  if(path.startsWith("/store/reader-profiles")||path.startsWith("/store/reading-state")){const stepup=(await cookies()).get("storyverse_family_stepup")?.value;if(stepup)headers.set("x-family-stepup",stepup)}
  if (process.env.TRUST_GATEWAY_HEADERS === "true") {
    // Only enabled when the storefront has no published port and sits behind
    // the gateway, which overwrites client-supplied forwarding headers.
    try {
      const ip = (await requestHeaders()).get("x-real-ip")
      if (ip && /^[a-fA-F0-9:.]+$/.test(ip)) headers.set("X-Forwarded-For", ip)
    } catch { /* Build-time rendering has no incoming request. */ }
  }
  headers.set("Content-Type", "application/json")
  const key = process.env.MEDUSA_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
  if (key) headers.set("x-publishable-api-key", key)
  if (token) headers.set("Authorization", `Bearer ${token}`)
  const base = process.env.MEDUSA_BACKEND_URL || process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"
  return fetch(`${base.replace(/\/$/, "")}${path}`, { ...init, headers, cache: "no-store", signal: AbortSignal.timeout(15000) })
}

export async function customerToken() {
  return (await cookies()).get(CUSTOMER_COOKIE)?.value
}

export function sameOrigin(request: Request) {
  const origin = request.headers.get("origin")
  return allowedRequestOrigin(request.url,origin,process.env.NEXT_PUBLIC_BASE_URL)
}

export async function setCustomerToken(token: string) {
  ;(await cookies()).delete("storyverse_family_stepup")
  ;(await cookies()).set(CUSTOMER_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NEXT_PUBLIC_BASE_URL?.startsWith("https://") || false,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24,
  })
}
