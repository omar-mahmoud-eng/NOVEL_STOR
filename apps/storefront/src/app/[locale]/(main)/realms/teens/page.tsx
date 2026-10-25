import React from "react"
import { isValidLocale, defaultLocale, Locale } from "@/lib/i18n"
import { TeensRealmView } from "@/components/realms/teens-realm-view"

export const metadata = {
  title: "رواق اليافعين والناشئة (13 - 17 سنة) • مدار الزجاج | StoryVerse",
  description: "اكتشف روايات الخيال العلمي والغموض وتحقيقات الشفرات الأندلسية المصممة لليافعين مع مسارات سرد تفاعلية وأداء درامي صوتي.",
}

export default async function TeensRealmPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const validLocale = isValidLocale(locale) ? (locale as Locale) : defaultLocale

  return <TeensRealmView locale={validLocale} />
}
