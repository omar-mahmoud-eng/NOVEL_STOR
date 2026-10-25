import React from "react"
import { isValidLocale, defaultLocale, Locale } from "@/lib/i18n"
import { LittleRealmView } from "@/components/realms/little-realm-view"

export const metadata = {
  title: "واحة براعم الأطفال (3 - 6 سنوات) • اختاروا حكايتكم | StoryVerse Little",
  description: "قصص ما قبل النوم الهادئة للأطفال الصغار، رسوم مريحة، تشكيل كامل للحروف، وأصوات راوية مهدئة لنوم هانئ.",
}

export default async function LittleRealmPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const validLocale = isValidLocale(locale) ? (locale as Locale) : defaultLocale

  return <LittleRealmView locale={validLocale} />
}
