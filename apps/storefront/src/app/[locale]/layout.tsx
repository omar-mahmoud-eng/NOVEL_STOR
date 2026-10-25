import type { Metadata } from "next"
import { Providers } from "@/components/providers"
import { getDictionary, getDirection, isValidLocale, defaultLocale, Locale, locales } from "@/lib/i18n"

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const resolvedParams = await params
  const validLocale = isValidLocale(resolvedParams?.locale) ? (resolvedParams.locale as Locale) : defaultLocale
  const dict = getDictionary(validLocale)

  return {
    title: {
      default: dict.common.store_name,
      template: `%s | ${dict.common.store_name}`,
    },
    description: dict.common.tagline,
    metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"),
    robots: {
      index: true,
      follow: true,
    },
  }
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const resolvedParams = await params
  const validLocale = isValidLocale(resolvedParams?.locale) ? (resolvedParams.locale as Locale) : defaultLocale
  const dir = getDirection(validLocale)

  return (
    <div lang={validLocale} dir={dir} className="min-h-full flex flex-col flex-1">
      <Providers>{children}</Providers>
    </div>
  )
}
