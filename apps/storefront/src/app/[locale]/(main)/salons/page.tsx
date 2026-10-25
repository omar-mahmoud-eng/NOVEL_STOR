import React from "react"
import { isValidLocale, defaultLocale, Locale } from "@/lib/i18n"
import { SalonsView } from "@/components/salons/salons-view"

export const metadata = {
  title: "الأندية الأدبية وصالونات الحوار الراشد | StoryVerse",
  description: "مساحات حوارية منتقاة بروح سينمائية، تخضع لإشراف تحريري لحماية متعة الاكتشاف وخالية من الرسائل الخاصة والتتبع السلوكي.",
}

export default async function SalonsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const validLocale = isValidLocale(locale) ? (locale as Locale) : defaultLocale

  return <SalonsView locale={validLocale} />
}
