import { isValidLocale } from "@/lib/i18n"
import { notFound } from "next/navigation"
import Link from "next/link"
import { REALMS, realmBase, type ReadingRealm } from "@/lib/realms"
export default async function Page({params}:{params:Promise<{locale:string}>}) { const {locale}=await params; if(!isValidLocale(locale))notFound(); return <div className="original-reading-page"><div className="original-reading-width py-12 space-y-8"><h1 className="text-3xl font-bold">{locale==="ar"?"اختر منصة القراءة":"Choose your reading platform"}</h1><div className="grid sm:grid-cols-2 gap-6">{(Object.keys(REALMS) as ReadingRealm[]).map(realm=><Link key={realm} className="original-panel space-y-3" href={realmBase(locale,realm)}><h2 className="text-2xl font-bold">{REALMS[realm].en}</h2><p>{REALMS[realm].label} · {REALMS[realm].age}</p></Link>)}</div><Link href={`/${locale}/family-hub`} className="original-button">مركز الأسرة</Link></div></div> }
