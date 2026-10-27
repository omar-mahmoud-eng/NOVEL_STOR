import { isValidLocale } from "@/lib/i18n"
import { notFound } from "next/navigation"
import { ReadingHub } from "@/components/library/reading-hub"
export default async function Page({params}:{params:Promise<{locale:string}>}) { const {locale}=await params; if(!isValidLocale(locale))notFound(); return <ReadingHub locale={locale} mode="history" /> }
