import { InformationView } from "@/components/common/information-view"
import { isValidLocale } from "@/lib/i18n"
import { notFound } from "next/navigation"
export default async function Page({params}:{params:Promise<{locale:string}>}) {const {locale}=await params;if(!isValidLocale(locale))notFound();return <InformationView locale={locale} page="terms" />}