import React from "react"
import { Header } from "@/components/common/header"
import { Footer } from "@/components/common/footer"
import { getDictionary, isValidLocale, defaultLocale, Locale } from "@/lib/i18n"

export default async function MainLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const validLocale = isValidLocale(locale) ? (locale as Locale) : defaultLocale
  const dict = getDictionary(validLocale)

  return (
    <div className="flex flex-col min-h-screen">
      <Header locale={validLocale} dict={dict} />
      <main className="flex-1">{children}</main>
      <Footer locale={validLocale} dict={dict} />
    </div>
  )
}
