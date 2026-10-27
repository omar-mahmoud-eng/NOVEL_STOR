import { NextResponse } from "next/server"
import { backendFetch, customerToken, sameOrigin } from "@/lib/medusa-server"

async function proxy(request: Request, context: { params: Promise<{ path: string[] }> }) {
  const { path } = await context.params
  if (path[0] !== "store" || path.some((part) => part === "." || part === ".." || /[\\/\x00-\x1f]/.test(part))) {
    return NextResponse.json({ message: "Invalid API path" }, { status: 404 })
  }
  if (request.method !== "GET" && !sameOrigin(request)) return NextResponse.json({ message: "Invalid origin" }, { status: 403 })
  try {
    const body = request.method === "GET" ? undefined : await request.text()
    if (body && Buffer.byteLength(body) > (path[1]==="reading-state"?3:1)*1024*1024) return NextResponse.json({ message: "Request too large" }, { status: 413 })
    const response = await backendFetch(`/${path.map(encodeURIComponent).join("/")}${new URL(request.url).search}`, {
      method: request.method, body: body || undefined,
    }, await customerToken())
    return new NextResponse(await response.text(), {
      status: response.status,
      headers: { "Content-Type": response.headers.get("content-type") || "application/json", "Cache-Control": "private, no-store" },
    })
  } catch {
    return NextResponse.json({ message: "Store service unavailable" }, { status: 502 })
  }
}

export const GET = proxy
export const POST = proxy
export const DELETE = proxy
export const PUT = proxy
