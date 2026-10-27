import React from "react"
import { isValidLocale, defaultLocale, Locale } from "@/lib/i18n"
import { ReadingHub } from "@/components/library/reading-hub"

export const metadata = {
  title: "مكتبتي الرقمية المؤمنة | قارئ الكتب والمشغل الصوتي",
  description:
    "استمتع بقراءة رواياتك الإلكترونية والاستماع للكتب الصوتية عبر مشغلات الويب المؤمنة بتقنية DRM لمنع القرصنة.",
}

export default async function LibraryPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const validLocale = isValidLocale(locale) ? (locale as Locale) : defaultLocale

  return (
    <div className="min-h-screen bg-background">
      <ReadingHub locale={validLocale} />
    </div>
  )
}
