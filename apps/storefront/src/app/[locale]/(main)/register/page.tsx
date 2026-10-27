import { isValidLocale } from "@/lib/i18n"
import { notFound } from "next/navigation"
import { getDictionary } from "@/lib/i18n"
import { CustomerAccountPortal } from "@/components/account/customer-account-portal"
export default async function Page({params}:{params:Promise<{locale:string}>}) { const {locale}=await params; if(!isValidLocale(locale))notFound(); return <CustomerAccountPortal locale={locale} dict={getDictionary(locale)} initialTab="register" /> }
