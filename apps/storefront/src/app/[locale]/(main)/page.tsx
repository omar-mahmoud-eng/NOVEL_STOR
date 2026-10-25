import React from "react"
import { getDictionary, isValidLocale, defaultLocale, Locale } from "@/lib/i18n"
import { PublishingHomeView } from "@/components/home/publishing-home-view"

export const metadata = {
  title: "منصة النشر والروايات المتكاملة لجميع الأعمار | ورقي • صوتي • إلكتروني",
  description:
    "استكشف واحة الروايات والقصص للأطفال، الناشئة، اليافعين، والكبار. تسوق آمن، استماع فوري للعينات الصوتية، واشتراكات VIP شهرية بأرصدة كتب مجانية.",
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const validLocale = isValidLocale(locale) ? (locale as Locale) : defaultLocale

  return <PublishingHomeView locale={validLocale} />
}
