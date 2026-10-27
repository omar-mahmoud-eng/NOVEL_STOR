"use client"
import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { BookOpen, Menu, X, User, Bookmark, ChevronDown } from "lucide-react"
import { REALMS, realmBase, type ReadingRealm } from "@/lib/realms"
import { ParentGate } from "@/components/family/parent-gate"
import type { CSSProperties } from "react"

export function RealmHeader({ realm, locale }: { realm: Exclude<ReadingRealm, "originals">; locale: "ar" | "en" }) {
  const [open, setOpen] = useState(false)
  const config = REALMS[realm], base = realmBase(locale, realm), ar = locale === "ar"
  const path = usePathname(), router = useRouter()
  const links = [["", ar ? "الرئيسية" : "Home"], ["books", ar ? realm === "little" ? "مكتبة الحكايات" : "استكشف المغامرات" : "Explore stories"], ["library", ar ? "مكتبتي الخاصة" : "My shelf"], [realm === "little" ? "activities" : "levels", ar ? realm === "little" ? "نقرأ معًا" : "أدوات القراءة" : "Reading tools"]]
  return <header className="realm-header" style={{ "--realm-accent": config.color, "--realm-bg": config.background, "--realm-ink": config.ink } as CSSProperties}>
    <div className="realm-width realm-header-row">
      <Link href={base} className="realm-brand"><span className="realm-brand-icon"><BookOpen size={24} /></span><span><strong>StoryVerse</strong><small>{ar ? config.label : config.en} · {config.age}</small></span></Link>
      <nav aria-label={ar ? "التنقل الرئيسي للمنصة" : "Realm main navigation"} className="realm-desktop-nav">{links.map(([view, label]) => <Link key={view} href={view ? `${base}/${view}` : base} aria-current={path === (view ? `${base}/${view}` : base) ? "page" : undefined}>{label}</Link>)}</nav>
      <div className="realm-header-actions">
        <button aria-label={ar ? "Switch to English" : "التبديل إلى العربية"} onClick={() => { const next = ar ? "en" : "ar"; document.cookie = `NEXT_LOCALE=${next}; path=/; max-age=31536000; SameSite=Lax`; router.push(path.replace(/^\/(ar|en)/, `/${next}`) + location.search) }}>{ar ? "EN" : "عربي"}</button>
        <ParentGate locale={locale} onContinue={() => router.push(`/${locale}/family-hub`)}><span className="flex items-center gap-1"><User size={18} /><span>{ar ? "بوابة الأهل" : "Parents"}</span></span></ParentGate>
        <button className="realm-menu-toggle" aria-label={ar ? "قائمة المنصة" : "Realm menu"} aria-expanded={open} aria-controls="realm-mobile-menu" onClick={() => setOpen(!open)}>{open ? <X size={22} /> : <Menu size={22} />}</button>
      </div>
    </div>
    {open && <nav id="realm-mobile-menu" aria-label={ar ? "قائمة المنصة" : "Realm menu"} className="realm-mobile-nav">{[...links, ["offline", ar ? "دون اتصال" : "Offline"], ["preferences", ar ? "تفضيلات القراءة" : "Preferences"]].map(([view, label]) => <Link key={view} href={view ? `${base}/${view}` : base} onClick={() => setOpen(false)}>{label}</Link>)}<ParentGate locale={locale} onContinue={() => router.push(`/${locale}/platforms`)}>{ar ? "تغيير المنصة" : "Switch platform"}</ParentGate></nav>}
  </header>
}
export function RealmFooter({ realm, locale }: { realm: Exclude<ReadingRealm, "originals">; locale: "ar" | "en" }) {
  const base = realmBase(locale, realm), config = REALMS[realm], ar = locale === "ar"
  return <footer className="realm-footer" style={{ background: config.background, color: config.ink }}><div className="realm-width flex flex-wrap items-center justify-between gap-6"><div><strong>StoryVerse {config.en}</strong><p className="text-sm mt-2">{ar ? "مساحة قراءة هادئة، دون إعلانات أو رسائل خاصة بين الأطفال." : "A calm reading space without ads or child-to-child private messages."}</p></div><nav className="flex flex-wrap gap-4 text-sm" aria-label={ar ? "روابط المنصة" : "Realm footer"}><Link href={`${base}/activities`}>{ar ? "دليل الأسرة" : "Family guide"}</Link><Link href={`${base}/preferences`}>{ar ? "التفضيلات" : "Preferences"}</Link><Link href={`/${locale}/privacy`}>{ar ? "الخصوصية" : "Privacy"}</Link></nav></div></footer>
}
