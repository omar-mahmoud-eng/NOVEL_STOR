import React from "react"
import { isValidLocale, defaultLocale, Locale } from "@/lib/i18n"
import { KidsRealmView } from "@/components/realms/kids-realm-view"

export const metadata = {
  title: "كوكب الاستكشاف والناشئة (7 - 12 سنة) • حارس المنارة | StoryVerse",
  description: "قصص مصورة ومغامرات خيال علمي شيقة للناشئة مع تشكيل الحروف ومؤثرات صوتية محفزة للشغف والقراءة.",
}

export default async function KidsRealmPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const validLocale = isValidLocale(locale) ? (locale as Locale) : defaultLocale

  return <KidsRealmView locale={validLocale} />
}
