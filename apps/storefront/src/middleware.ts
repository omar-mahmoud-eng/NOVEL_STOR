import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { locales, defaultLocale } from "@/lib/i18n"

const PUBLIC_FILE = /\.(.*)$/

function applySecurityHeaders(res: NextResponse): NextResponse {
  res.headers.set("X-Frame-Options", "DENY")
  res.headers.set("X-Content-Type-Options", "nosniff")
  res.headers.set("X-XSS-Protection", "0")
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")
  res.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=(), payment=(self)")
  res.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload")
  res.headers.set("Cross-Origin-Opener-Policy", "same-origin")
  res.headers.set("Cross-Origin-Resource-Policy", "same-origin")
  return res
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Ignore internal Next.js requests and public static files
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    PUBLIC_FILE.test(pathname)
  ) {
    return applySecurityHeaders(NextResponse.next())
  }

  // Check if pathname already starts with a supported locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (pathnameHasLocale) {
    return applySecurityHeaders(NextResponse.next())
  }

  // Detect locale from cookie or Accept-Language header
  const cookieLocale = request.cookies.get("NEXT_LOCALE")?.value
  let targetLocale = defaultLocale

  if (cookieLocale && locales.includes(cookieLocale as any)) {
    targetLocale = cookieLocale as any
  } else {
    const acceptLanguage = request.headers.get("accept-language") || ""
    if (acceptLanguage.includes("en")) {
      targetLocale = "en"
    }
  }

  // Redirect to localized path with security headers attached
  const redirectUrl = new URL(`/${targetLocale}${pathname.startsWith("/") ? "" : "/"}${pathname}`, request.url)
  redirectUrl.search = request.nextUrl.search

  return applySecurityHeaders(NextResponse.redirect(redirectUrl))
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
