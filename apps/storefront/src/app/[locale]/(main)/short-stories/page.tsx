import { isValidLocale } from "@/lib/i18n"
import { notFound } from "next/navigation"
import { OriginalCatalog } from "@/components/products/original-catalog"
export default async function Page({params}:{params:Promise<{locale:string}>}) { const {locale}=await params; if(!isValidLocale(locale))notFound(); return <OriginalCatalog locale={locale} short /> }
