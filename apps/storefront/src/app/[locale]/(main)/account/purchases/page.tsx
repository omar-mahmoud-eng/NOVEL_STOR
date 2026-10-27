import { isValidLocale } from "@/lib/i18n"
import { notFound } from "next/navigation"
import { CustomerLibraryView } from "@/components/library/customer-library-view"
export default async function Page({params}:{params:Promise<{locale:string}>}) { const {locale}=await params; if(!isValidLocale(locale))notFound(); return <CustomerLibraryView locale={locale} /> }
