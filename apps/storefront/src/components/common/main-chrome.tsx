"use client"
import { usePathname } from "next/navigation"
import { Header } from "./header"
import { Footer } from "./footer"
import { realmFromPath } from "@/lib/realms"
import { RealmHeader, RealmFooter } from "@/components/realms/realm-chrome"
import type { Dictionary, Locale } from "@/lib/i18n"
import { ReadingBreak } from "@/components/family/reading-break"
import { CatalogNotice } from "./catalog-notice"

export function MainChrome({ children, locale, dict }: { children: React.ReactNode; locale: Locale; dict: Dictionary }) {
  const path = usePathname() || ""
  const realm = realmFromPath(path)
  const immersive = /\/(reader|player|illustrated|interactive)(\/|$)/.test(path) || /\/realms\/[^/]+\/(words|quest-map|detective|complete)(\/|$)/.test(path)
  return <div data-reading-realm={realm} className="flex flex-col min-h-screen min-w-0">
    <CatalogNotice />
    {!immersive && (realm === "originals" ? <Header locale={locale} dict={dict} /> : <RealmHeader realm={realm} locale={locale} />)}
    {realm !== "originals" && <ReadingBreak locale={locale} />}
    <main className="flex-1 min-w-0">{children}</main>
    {!immersive && realm === "originals" && <nav className="original-reading-width flex flex-wrap gap-6 py-5" aria-label={locale==="ar"?"المجلة والدعم":"Journal and support"}><a href={`/${locale}/articles`}>{locale==="ar"?"مجلة القراءة":"Reading journal"}</a><a href={`/${locale}/contact`}>{locale==="ar"?"مراسلة الدعم":"Contact support"}</a></nav>}
    {!immersive && (realm === "originals" ? <Footer locale={locale} dict={dict} /> : <RealmFooter realm={realm} locale={locale} />)}
  </div>
}
