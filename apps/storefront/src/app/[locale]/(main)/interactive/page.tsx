import React from "react"
import { isValidLocale, defaultLocale, Locale } from "@/lib/i18n"
import { BranchingStoryView } from "@/components/interactive/branching-story-view"

export const metadata = {
  title: "الروايات التفاعلية متعددة المسارات (P10) | StoryVerse",
  description: "تجربة سرد تفاعلية حرة: اختر مسارك، تراجع عن العقد، واكشف النهايات المتعددة مع أداء صوتي درامي متزامن.",
}

export default async function InteractivePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const validLocale = isValidLocale(locale) ? (locale as Locale) : defaultLocale

  return <BranchingStoryView locale={validLocale} />
}
