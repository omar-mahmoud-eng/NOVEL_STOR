import React from "react"
import { isValidLocale, defaultLocale, Locale } from "@/lib/i18n"
import { MoodSelectorView } from "@/components/mood/mood-selector-view"

export const metadata = {
  title: "محدد المزاج القرائي ومساعد التفضيل (P17) | StoryVerse",
  description: "مساعد التفضيل التحريري لاقتراح قراءات تناسب وتيرة يومك والوقت المتاح لديك دون أي تتبع سلوكي.",
}

export default async function MoodSelectorPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const validLocale = isValidLocale(locale) ? (locale as Locale) : defaultLocale

  return <MoodSelectorView locale={validLocale} />
}
