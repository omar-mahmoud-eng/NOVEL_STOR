import React from "react"
import { isValidLocale, defaultLocale, Locale } from "@/lib/i18n"
import { AudiobooksView } from "@/components/audiobooks/audiobooks-view"

export const metadata = {
  title: "المكتبة الصوتية والإنتاجات السردية المسموعة | StoryVerse",
  description: "استمع إلى الروايات العربية المحققة بصوت نخبة من كبار الرواة بأداء استوديو احترافي وتقنية الصوت المكاني ثلاثي الأبعاد.",
}

export default async function AudiobooksPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const validLocale = isValidLocale(locale) ? (locale as Locale) : defaultLocale

  return <AudiobooksView locale={validLocale} />
}
