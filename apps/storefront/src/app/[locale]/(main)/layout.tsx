import React from "react"
import { Header } from "@/components/common/header"
import { Footer } from "@/components/common/footer"
import { getDictionary, isValidLocale, defaultLocale, Locale } from "@/lib/i18n"
import { MainChrome } from "@/components/common/main-chrome"

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
    <MainChrome locale={validLocale} dict={dict}>{children}</MainChrome>
  )
}
