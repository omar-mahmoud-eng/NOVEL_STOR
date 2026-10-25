import React from "react"
import { isValidLocale, defaultLocale, Locale } from "@/lib/i18n"
import { NarrativeAtlasView } from "@/components/atlas/narrative-atlas-view"

export const metadata = {
  title: "أطلس السرد الحي وشبكة الشخصيات (P20) | StoryVerse",
  description: "مخطوطة تفاعلية لرصد العلاقات السردية والشخوص والمواقع مع عتبة حماية الحرق السردي الذكية.",
}

export default async function AtlasPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const validLocale = isValidLocale(locale) ? (locale as Locale) : defaultLocale

  return <NarrativeAtlasView locale={validLocale} />
}
