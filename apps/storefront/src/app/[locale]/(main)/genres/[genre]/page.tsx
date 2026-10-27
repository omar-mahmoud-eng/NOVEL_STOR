import { isValidLocale } from "@/lib/i18n"
import { notFound } from "next/navigation"
import { OriginalCatalog } from "@/components/products/original-catalog"
export default async function Page({params}:{params:Promise<{locale:string;genre:string}>}) { const {locale,genre}=await params; if(!isValidLocale(locale)||!["mystery","historical","scifi","classics","adventure","drama"].includes(genre))notFound(); return <OriginalCatalog locale={locale} genre={genre} /> }
