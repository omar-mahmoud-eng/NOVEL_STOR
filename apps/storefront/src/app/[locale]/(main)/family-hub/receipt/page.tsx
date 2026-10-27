import { FamilySetupView } from "@/components/family/family-setup-view"
import { isValidLocale } from "@/lib/i18n"
import { notFound } from "next/navigation"
export default async function Page({params}:{params:Promise<{locale:string}>}) {const {locale}=await params;if(!isValidLocale(locale))notFound();return <FamilySetupView locale={locale} mode="receipt" />}