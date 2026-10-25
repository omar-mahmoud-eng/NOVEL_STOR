import React from "react"
import { getDictionary, isValidLocale, defaultLocale, Locale } from "@/lib/i18n"
import { CustomerAccountPortal } from "@/components/account/customer-account-portal"

export const metadata = {
  title: "حساب القارئ وبوابة العملاء | تسجيل الدخول والمكتبة",
  description: "سجّل دخولك لحسابك، تابع مشترياتك ورصيد اشتراك VIP، واقرأ واستمع للروايات في مكتبتك الرقمية.",
}

export default async function AccountPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const validLocale = isValidLocale(locale) ? (locale as Locale) : defaultLocale
  const dict = getDictionary(validLocale)

  return (
    <div className="min-h-screen bg-background">
      <CustomerAccountPortal locale={validLocale} dict={dict} />
    </div>
  )
}
