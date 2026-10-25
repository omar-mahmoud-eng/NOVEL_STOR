import React from "react"
import { isValidLocale, defaultLocale, Locale } from "@/lib/i18n"
import { GenresView } from "@/components/genres/genres-view"

export const metadata = {
  title: "أنواع الحكايات والتصنيفات الأدبية | StoryVerse",
  description: "استكشف الروايات العربية حسب التصنيف الأدبي: أدب الغموض، السرد التاريخي، الخيال العلمي، والأدب الكلاسيكي الرفيع.",
}

export default async function GenresPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const validLocale = isValidLocale(locale) ? (locale as Locale) : defaultLocale

  return <GenresView locale={validLocale} />
}
