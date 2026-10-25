import React from "react"
import { isValidLocale, defaultLocale, Locale } from "@/lib/i18n"
import { FamilyHubView } from "@/components/family/family-hub-view"

export const metadata = {
  title: "مركز الأسرة والرقابة الأبوية | StoryVerse",
  description: "مساحة آمنة ومحمية لعائلتك: إدارة ملفات الأطفال، تحديد أوقات الشاشات، وفصل صارم بين روايات البالغين وحكايات الصغار.",
}

export default async function FamilyHubPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const validLocale = isValidLocale(locale) ? (locale as Locale) : defaultLocale

  return <FamilyHubView locale={validLocale} />
}
