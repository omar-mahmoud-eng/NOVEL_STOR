import {notFound} from "next/navigation"
import {isValidLocale} from "@/lib/i18n"
import {ArticlesView} from "@/components/common/articles-view"
export default async function Page({params}:{params:Promise<{locale:string}>}){const{locale}=await params;if(!isValidLocale(locale))notFound();return <ArticlesView locale={locale}/>}
