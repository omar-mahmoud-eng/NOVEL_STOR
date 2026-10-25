import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { locales, defaultLocale } from "@/lib/i18n"

const PUBLIC_FILE = /\.(.*)$/

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Ignore internal Next.js requests and public static files
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next()
  }

  // Check if pathname already starts with a supported locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (pathnameHasLocale) {
    return NextResponse.next()
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

  // Redirect to localized path
  const redirectUrl = new URL(`/${targetLocale}${pathname.startsWith("/") ? "" : "/"}${pathname}`, request.url)
  redirectUrl.search = request.nextUrl.search

  return NextResponse.redirect(redirectUrl)
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
