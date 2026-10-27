import {notFound} from "next/navigation"
import {isValidLocale} from "@/lib/i18n"
import {ArticlesView} from "@/components/common/articles-view"
import {backendFetch} from "@/lib/medusa-server"
export const dynamic="force-dynamic"
export default async function Page({params}:{params:Promise<{locale:string;slug:string}>}){const{locale,slug}=await params;if(!isValidLocale(locale))notFound();const response=await backendFetch(`/store/articles?slug=${encodeURIComponent(slug)}`);if(!response.ok)throw Error("Articles unavailable");if(!(await response.json()).articles.length)notFound();return <ArticlesView locale={locale} slug={slug}/>}
