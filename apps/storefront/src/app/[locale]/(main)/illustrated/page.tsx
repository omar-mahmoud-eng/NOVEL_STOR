import React from "react"
import { isValidLocale, defaultLocale, Locale } from "@/lib/i18n"
import { IllustratedReaderView } from "@/components/illustrated/illustrated-reader-view"

export const metadata = {
  title: "سجل المخطوطات والإنتاج السردي المصور (P19) | StoryVerse",
  description: "قارئ الروايات المصورة الفاخرة: نمط الكتاب المزدوج، الشرائح، والويب تون الرأسي مع تكبير عالي الدقة.",
}

export default async function IllustratedPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const validLocale = isValidLocale(locale) ? (locale as Locale) : defaultLocale

  return <IllustratedReaderView locale={validLocale} />
}
