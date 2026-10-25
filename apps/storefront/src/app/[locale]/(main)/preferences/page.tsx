import React from "react"
import { isValidLocale, defaultLocale, Locale } from "@/lib/i18n"
import { ReadingPreferencesView } from "@/components/preferences/reading-preferences-view"

export const metadata = {
  title: "تفضيلات القراءة وبيئة المطالعة والأمان (P16) | StoryVerse",
  description: "تخصيص تجربة المطالعة والاستماع، سمات الخطوط الحبرية، وضوابط الخصوصية ومنع الإزعاج الترويجي.",
}

export default async function PreferencesPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const validLocale = isValidLocale(locale) ? (locale as Locale) : defaultLocale

  return <ReadingPreferencesView locale={validLocale} />
}
