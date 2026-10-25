import React from "react"
import { isValidLocale, defaultLocale, Locale } from "@/lib/i18n"
import { SubscriptionPlansView } from "@/components/subscriptions/subscription-plans-view"

export const metadata = {
  title: "باقات اشتراك VIP للقراء والمستمعين | مكتبة الروايات",
  description:
    "انضم لعضوية VIP واستمتع بأرصدة شهرية لاقتناء الروايات والكتب الصوتية وخصومات خاصة على الكتب المطبوعة.",
}

export default async function SubscriptionsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const validLocale = isValidLocale(locale) ? (locale as Locale) : defaultLocale

  return (
    <div className="min-h-screen bg-background">
      <SubscriptionPlansView locale={validLocale} />
    </div>
  )
}
