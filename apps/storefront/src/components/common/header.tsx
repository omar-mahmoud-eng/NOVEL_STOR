"use client"

import React, { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useCart } from "@/context/cart-context"
import { useCustomerAuth } from "@/context/customer-auth-context"
import { CartSheet } from "@/components/cart/cart-sheet"
import {
  ShoppingBag,
  User,
  Search,
  Menu,
  X,
  ChevronDown,
  Check,
} from "lucide-react"

export function Header({
  locale,
  dict,
}: {
  locale: "ar" | "en"
  dict: any
}) {
  const { itemsCount, setIsOpen } = useCart()
  const { customer } = useCustomerAuth()
  const pathname = usePathname() || ""
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [realmDropdownOpen, setRealmDropdownOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const isRtl = locale === "ar"

  // Detect which age realm is active based on pathname
  const isLittleRealm = pathname.includes("/realms/little")
  const isKidsRealm = pathname.includes("/realms/kids")
  const isTeensRealm = pathname.includes("/realms/teens")
  const isFamilyHub = pathname.includes("/family-hub")

  const toggleLanguage = () => {
    const nextLocale = locale === "ar" ? "en" : "ar"
    document.cookie = `NEXT_LOCALE=${nextLocale}; path=/; max-age=31536000`

    const segments = (pathname || "/").split("/")
    segments[1] = nextLocale
    const nextPath = segments.join("/") || `/${nextLocale}`
    router.push(nextPath)
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/${locale}/books?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  // Common Realm Switcher Dropdown Content
  const RealmDropdownMenu = () => (
    <div
      onMouseLeave={() => setRealmDropdownOpen(false)}
      className="absolute right-0 top-full mt-2 w-72 bg-[#1c1f29] text-[#e0e2ef] rounded-2xl shadow-2xl border border-[#4e463a]/60 p-2 z-50 animate-in fade-in zoom-in-95 duration-200"
    >
      <div className="px-3 py-2 text-[11px] font-bold text-[#e6c184] uppercase tracking-wider border-b border-[#4e463a]/40 mb-1">
        {isRtl ? "عوالم StoryVerse التفاعلية" : "StoryVerse Age Realms"}
      </div>

      <Link
        href={`/${locale}`}
        onClick={() => setRealmDropdownOpen(false)}
        className={`flex items-center justify-between p-2.5 rounded-xl transition-colors ${
          !isLittleRealm && !isKidsRealm && !isTeensRealm && !isFamilyHub
            ? "bg-[#272a33] text-[#e6c184] font-bold"
            : "hover:bg-[#272a33]/60 text-slate-300"
        }`}
      >
        <div className="flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-lg bg-[#272a33] text-[#e6c184] flex items-center justify-center">
            🏛️
          </span>
          <div className="flex flex-col text-right">
            <span className="text-xs font-bold">Originals (+18)</span>
            <span className="text-[10px] text-slate-400">المكتبة العامة والروايات الكبرى</span>
          </div>
        </div>
        {!isLittleRealm && !isKidsRealm && !isTeensRealm && !isFamilyHub && <Check className="w-4 h-4 text-[#e6c184]" />}
      </Link>

      <Link
        href={`/${locale}/realms/teens`}
        onClick={() => setRealmDropdownOpen(false)}
        className={`flex items-center justify-between p-2.5 rounded-xl transition-colors ${
          isTeensRealm ? "bg-[#272a33] text-indigo-300 font-bold" : "hover:bg-[#272a33]/60 text-slate-300"
        }`}
      >
        <div className="flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-lg bg-indigo-950 text-indigo-300 flex items-center justify-center">
            🚀
          </span>
          <div className="flex flex-col text-right">
            <span className="text-xs font-bold">عالم الناشئة (١٣–١٧ سنة)</span>
            <span className="text-[10px] text-slate-400">غموض علمي وأدب تخيلي هادئ</span>
          </div>
        </div>
        {isTeensRealm && <Check className="w-4 h-4 text-indigo-400" />}
      </Link>

      <Link
        href={`/${locale}/realms/kids`}
        onClick={() => setRealmDropdownOpen(false)}
        className={`flex items-center justify-between p-2.5 rounded-xl transition-colors ${
          isKidsRealm ? "bg-[#272a33] text-emerald-300 font-bold" : "hover:bg-[#272a33]/60 text-slate-300"
        }`}
      >
        <div className="flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-lg bg-emerald-950 text-emerald-300 flex items-center justify-center">
            🧭
          </span>
          <div className="flex flex-col text-right">
            <span className="text-xs font-bold">كوكب المستكشفين (٧–١٢ سنة)</span>
            <span className="text-[10px] text-slate-400">مغامرات ساحلية وخريطة تفاعلية</span>
          </div>
        </div>
        {isKidsRealm && <Check className="w-4 h-4 text-emerald-400" />}
      </Link>

      <Link
        href={`/${locale}/realms/little`}
        onClick={() => setRealmDropdownOpen(false)}
        className={`flex items-center justify-between p-2.5 rounded-xl transition-colors ${
          isLittleRealm ? "bg-[#272a33] text-amber-300 font-bold" : "hover:bg-[#272a33]/60 text-slate-300"
        }`}
      >
        <div className="flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-lg bg-amber-950 text-amber-300 flex items-center justify-center">
            🧸
          </span>
          <div className="flex flex-col text-right">
            <span className="text-xs font-bold">واحة البراعم (٣–٦ سنوات)</span>
            <span className="text-[10px] text-slate-400">حكايات نوم دافئة وتشكيل كامل</span>
          </div>
        </div>
        {isLittleRealm && <Check className="w-4 h-4 text-amber-400" />}
      </Link>

      <div className="my-1 border-t border-[#4e463a]/40" />

      <Link
        href={`/${locale}/family-hub`}
        onClick={() => setRealmDropdownOpen(false)}
        className={`flex items-center justify-between p-2.5 rounded-xl transition-colors ${
          isFamilyHub ? "bg-[#272a33] text-teal-300 font-bold" : "hover:bg-[#272a33]/60 text-slate-300"
        }`}
      >
        <div className="flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-lg bg-teal-950 text-teal-300 flex items-center justify-center">
            🛡️
          </span>
          <div className="flex flex-col text-right">
            <span className="text-xs font-bold">مركز الأسرة والرقابة الأبوية</span>
            <span className="text-[10px] text-slate-400">إدارة الملفات ووقت السكون</span>
          </div>
        </div>
        {isFamilyHub && <Check className="w-4 h-4 text-teal-400" />}
      </Link>
    </div>
  )

  // ==========================================
  // 1. LITTLE REALM HEADER (Stitch L01 Header)
  // ==========================================
  if (isLittleRealm) {
    return (
      <>
        <header className="sticky top-0 w-full z-50 bg-[#FFF8F2]/95 backdrop-blur-xl border-b border-[#F0E7DA] shadow-[0_8px_24px_rgba(43,58,77,0.04)] text-[#1F1B13] transition-all">
          <div className="h-20 max-w-7xl w-full mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
            {/* Left: Little Brand & Subtitle */}
            <div className="flex items-center gap-4">
              <Link href={`/${locale}/realms/little`} className="flex items-center gap-3 select-none">
                <div className="w-11 h-11 rounded-2xl bg-[#F8C7A9] text-[#75513A] flex items-center justify-center shadow-sm">
                  <span className="material-symbols-outlined text-[24px]">menu_book</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-black text-xl text-[#7B563E] tracking-tight leading-tight">StoryVerse</span>
                  <span className="text-xs font-bold text-[#4A6458] leading-none">عالم الصغار (٣-٦)</span>
                </div>
              </Link>

              {/* Realm Switcher Pill */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setRealmDropdownOpen(!realmDropdownOpen)}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white hover:bg-[#F6ECE0] transition-colors text-xs font-bold text-[#7B563E] border border-[#F0E7DA] shadow-xs"
                >
                  <span>🧸 واحة البراعم</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
                {realmDropdownOpen && <RealmDropdownMenu />}
              </div>
            </div>

            {/* Center: Little Nav Links (Stitch L01) */}
            <nav className="hidden lg:flex items-center gap-1 p-1 bg-[#F6ECE0] rounded-2xl">
              <Link
                href={`/${locale}/realms/little`}
                className="px-4 py-2 rounded-xl bg-[#7B563E] text-white font-bold text-xs shadow-xs"
              >
                مكتبة الحكايات
              </Link>
              <Link
                href={`/${locale}/books?age=kids_3_6&category=bedtime`}
                className="px-4 py-2 rounded-xl text-[#50443E] hover:bg-white font-bold text-xs transition-colors"
              >
                قصص ما قبل النوم
              </Link>
              <Link
                href={`/${locale}/books?age=kids_3_6`}
                className="px-4 py-2 rounded-xl text-[#50443E] hover:bg-white font-bold text-xs transition-colors"
              >
                مسارات الاستكشاف
              </Link>
              <Link
                href={`/${locale}/audiobooks?age=kids_3_6`}
                className="px-4 py-2 rounded-xl text-[#50443E] hover:bg-white font-bold text-xs transition-colors"
              >
                أهازيج هادئة
              </Link>
            </nav>

            {/* Right: Parent Gate & Profile */}
            <div className="flex items-center gap-3">
              <Link
                href={`/${locale}/family-hub`}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#CCE9DA] text-[#1E3E32] hover:bg-[#b8d4c7] font-bold text-xs transition-colors shadow-xs"
              >
                <span className="material-symbols-outlined text-[18px]">lock</span>
                <span>بوابة الأهل</span>
              </Link>
              <div
                className="w-10 h-10 rounded-full bg-[#E5CEA0] text-[#685732] flex items-center justify-center border-2 border-white shadow-xs"
                title="الملف الشخصي للطفل"
              >
                <span className="material-symbols-outlined text-[22px]">face</span>
              </div>
            </div>
          </div>
        </header>
      </>
    )
  }

  // ==========================================
  // 2. KIDS REALM HEADER (Stitch K01 Header)
  // ==========================================
  if (isKidsRealm) {
    return (
      <>
        <header className="sticky top-0 w-full z-50 bg-[#FAF8FF]/95 backdrop-blur-xl border-b border-[#E0E2EF] shadow-[0_1px_8px_rgba(0,0,0,0.04)] text-[#181B25] transition-all">
          <div className="h-20 max-w-7xl w-full mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
            {/* Left: Kids Brand & Subtitle */}
            <div className="flex items-center gap-4">
              <Link href={`/${locale}/realms/kids`} className="flex items-center gap-3 select-none">
                <div className="w-11 h-11 rounded-2xl bg-[#2476A7] text-white flex items-center justify-center shadow-sm">
                  <span className="material-symbols-outlined text-[24px]">auto_stories</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-black text-xl text-[#005D89] tracking-tight leading-tight">StoryVerse</span>
                  <span className="text-xs font-bold text-slate-500 leading-none">عالم الأطفال (٧-١٢ سنة)</span>
                </div>
              </Link>

              {/* Realm Switcher Pill */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setRealmDropdownOpen(!realmDropdownOpen)}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white hover:bg-slate-100 transition-colors text-xs font-bold text-[#005D89] border border-slate-200 shadow-xs"
                >
                  <span>🧭 كوكب الأطفال</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
                {realmDropdownOpen && <RealmDropdownMenu />}
              </div>
            </div>

            {/* Center: Kids Nav Links (Stitch K01) */}
            <nav className="hidden lg:flex items-center gap-1 p-1 bg-slate-100 rounded-2xl">
              <Link
                href={`/${locale}/realms/kids`}
                className="px-4 py-2 rounded-xl bg-emerald-700 text-white font-bold text-xs shadow-xs"
              >
                الرئيسية
              </Link>
              <Link
                href={`/${locale}/books?age=kids_7_12`}
                className="px-4 py-2 rounded-xl text-slate-700 hover:bg-white font-bold text-xs transition-colors"
              >
                استكشف المغامرات
              </Link>
              <Link
                href={`/${locale}/library`}
                className="px-4 py-2 rounded-xl text-slate-700 hover:bg-white font-bold text-xs transition-colors"
              >
                مكتبتي الخاصة
              </Link>
              <Link
                href={`/${locale}/quest-map`}
                className="px-4 py-2 rounded-xl text-slate-700 hover:bg-white font-bold text-xs transition-colors"
              >
                خريطة المغامرة
              </Link>
            </nav>

            {/* Right: Explorer Persona & Parent Gate */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 bg-slate-100 p-1.5 rounded-full border border-slate-200 pe-3">
                <div className="w-7 h-7 rounded-full bg-[#FDC257] text-[#725000] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[16px]">face</span>
                </div>
                <div className="flex flex-col text-right leading-tight">
                  <span className="text-xs font-bold text-slate-800">زيد المستكشف</span>
                  <span className="text-[10px] font-bold text-amber-700">المستوى ٤</span>
                </div>
              </div>

              <Link
                href={`/${locale}/family-hub`}
                className="flex items-center gap-1 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors border border-slate-200"
              >
                <span className="material-symbols-outlined text-[16px] text-emerald-700">lock</span>
                <span>بوابة الأهل</span>
              </Link>
            </div>
          </div>
        </header>
      </>
    )
  }

  // ==========================================
  // 3. TEENS REALM HEADER (Stitch T01 Header)
  // ==========================================
  if (isTeensRealm) {
    return (
      <>
        <header className="sticky top-0 w-full z-50 bg-[#FAF8FF]/95 backdrop-blur-xl border-b border-indigo-100 shadow-[0_1px_8px_rgba(38,43,88,0.04)] text-[#101542] transition-all">
          <div className="h-20 max-w-7xl w-full mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
            {/* Left: Teens Brand & Tag */}
            <div className="flex items-center gap-4">
              <Link href={`/${locale}/realms/teens`} className="flex items-center gap-3 select-none">
                <div className="w-10 h-10 rounded-xl bg-[#101542] text-white flex items-center justify-center shadow-sm">
                  <span className="material-symbols-outlined text-[22px]">auto_stories</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-black text-xl text-[#101542] tracking-tight leading-tight">StoryVerse</span>
                  <span className="text-xs font-bold text-indigo-700 leading-none">عالم القراءة</span>
                </div>
              </Link>

              <span className="hidden md:inline-flex items-center px-3 py-1 rounded-full bg-indigo-100 text-indigo-900 font-bold text-xs border border-indigo-200">
                عالم الناشئة ١٣–١٧ سنة
              </span>

              {/* Realm Switcher Pill */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setRealmDropdownOpen(!realmDropdownOpen)}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-indigo-50 transition-colors text-xs font-bold text-indigo-900 border border-indigo-100 shadow-xs"
                >
                  <span>🚀 رواق الناشئة</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
                {realmDropdownOpen && <RealmDropdownMenu />}
              </div>
            </div>

            {/* Center: Teens Nav Links (Stitch T01) */}
            <nav className="hidden lg:flex items-center gap-2">
              <Link
                href={`/${locale}/realms/teens`}
                className="px-4 py-2 rounded-xl bg-[#101542] text-white font-bold text-xs shadow-xs"
              >
                الرئيسية
              </Link>
              <Link
                href={`/${locale}/books?age=teens_13_17`}
                className="px-4 py-2 rounded-xl text-slate-700 hover:bg-indigo-50 hover:text-indigo-950 font-bold text-xs transition-colors"
              >
                اكتشف
              </Link>
              <Link
                href={`/${locale}/library`}
                className="px-4 py-2 rounded-xl text-slate-700 hover:bg-indigo-50 hover:text-indigo-950 font-bold text-xs transition-colors"
              >
                مكتبتي
              </Link>
            </nav>

            {/* Right: Guardian Portal & Teen Persona */}
            <div className="flex items-center gap-4">
              <Link
                href={`/${locale}/family-hub`}
                className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-900 font-bold text-xs transition-colors border border-indigo-100"
              >
                <span className="material-symbols-outlined text-[16px]">lock</span>
                <span>حساب العائلة</span>
              </Link>
              <div className="flex items-center gap-2 text-right">
                <div className="flex flex-col leading-tight">
                  <span className="text-xs font-bold text-slate-900">ليان</span>
                  <span className="text-[10px] text-slate-500">ملف خاص آمن</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-[#101542] text-white flex items-center justify-center text-xs font-bold">
                  <span className="material-symbols-outlined text-[18px]">person</span>
                </div>
              </div>
            </div>
          </div>
        </header>
      </>
    )
  }

  // ==========================================
  // 4. FAMILY HUB HEADER (Stitch F01 Header)
  // ==========================================
  if (isFamilyHub) {
    return (
      <>
        <header className="sticky top-0 w-full z-50 bg-[#F9F9F6]/95 backdrop-blur-xl border-b border-slate-200 shadow-sm text-[#1A1C1B] transition-all">
          <div className="h-20 max-w-7xl w-full mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
            {/* Left: Family Hub Brand */}
            <div className="flex items-center gap-4">
              <Link href={`/${locale}/family-hub`} className="flex items-center gap-3 select-none">
                <div className="w-10 h-10 rounded-xl bg-[#152436] text-white flex items-center justify-center shadow-sm">
                  <span className="material-symbols-outlined text-[22px]">shield_person</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-black text-xl text-[#152436] tracking-tight leading-tight">StoryVerse</span>
                  <span className="text-xs font-bold text-teal-800 leading-none">مركز الأسرة والرقابة الأبوية</span>
                </div>
              </Link>

              {/* Realm Switcher Pill */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setRealmDropdownOpen(!realmDropdownOpen)}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 transition-colors text-xs font-bold text-[#152436] border border-slate-200 shadow-xs"
                >
                  <span>🛡️ مركز الأسرة</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
                {realmDropdownOpen && <RealmDropdownMenu />}
              </div>
            </div>

            {/* Right: Return to Store & Guardian Status */}
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex flex-col text-right leading-tight">
                <span className="text-xs font-bold text-slate-900">د. طارق السعيد</span>
                <span className="text-[10px] text-teal-700 font-semibold">المشرف الأبوي الأساسي</span>
              </div>
              <Link
                href={`/${locale}`}
                className="px-4 py-2 rounded-xl bg-[#152436] text-white hover:bg-[#2b3a4d] font-bold text-xs transition-colors shadow-xs"
              >
                {isRtl ? "العودة للمكتبة العامة" : "Back to Main Library"}
              </Link>
            </div>
          </div>
        </header>
      </>
    )
  }

  // ==========================================
  // 5. ORIGINALS (+18) HEADER (Stitch P01 Header)
  // ==========================================
  return (
    <>
      <header className="sticky top-0 w-full z-50 bg-[#10131c]/95 backdrop-blur-xl border-b border-[#4e463a]/30 shadow-sm transition-all text-[#e0e2ef]">
        {/* Main Header Bar */}
        <div className="h-20 max-w-[1280px] w-full mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
          
          {/* Brand & Realm Switcher */}
          <div className="flex items-center gap-6">
            
            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-[#d1c5b5] hover:text-[#e0e2ef] rounded-lg"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* StoryVerse Logo */}
            <Link href={`/${locale}`} className="flex items-center gap-2.5 group">
              <span className="material-symbols-outlined text-[#e6c184] text-[28px]">auto_stories</span>
              <span className="font-serif font-black text-xl text-[#e6c184] tracking-wide">StoryVerse</span>
              <span className="text-[10px] font-bold bg-[#93000a]/20 text-[#ffb4ab] px-2 py-0.5 rounded border border-[#ffb4ab]/30">
                +١٨ المكتبة العامة
              </span>
            </Link>

            {/* Stitch Multi-Realm Dropdown */}
            <div className="relative hidden xl:block">
              <button
                type="button"
                onClick={() => setRealmDropdownOpen(!realmDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1c1f29] hover:bg-[#272a33] transition-colors text-[#d1c5b5] hover:text-[#e0e2ef] text-xs font-bold border border-[#4e463a]/40"
              >
                <span className="material-symbols-outlined text-[16px] text-[#e6c184]">theater_comedy</span>
                <span>Originals (18+)</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${realmDropdownOpen ? "rotate-180" : ""}`} />
              </button>
              {realmDropdownOpen && <RealmDropdownMenu />}
            </div>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-sm relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isRtl ? "ابحث في الأرشيف والروايات..." : "Search stories & authors..."}
              className="w-full bg-[#1c1f29] border border-[#4e463a]/40 rounded-full py-2 pr-10 pl-4 text-xs text-[#e0e2ef] placeholder-[#9a8f81] focus:outline-none focus:border-[#e6c184] transition-all"
            />
            <Search className="w-4 h-4 text-[#9a8f81] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </form>

          {/* User Controls */}
          <div className="flex items-center gap-3">
            {/* Language toggle */}
            <button
              onClick={toggleLanguage}
              className="px-2.5 py-1 rounded-lg bg-[#1c1f29] border border-[#4e463a]/40 text-[#d1c5b5] hover:text-[#e6c184] text-xs font-mono font-bold transition-colors"
            >
              {locale === "ar" ? "EN" : "عربي"}
            </button>

            {/* Cart Button */}
            <button
              onClick={() => setIsOpen(true)}
              className="relative p-2 text-[#d1c5b5] hover:text-[#e6c184] transition-colors rounded-lg"
              aria-label="View Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {itemsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#e6c184] text-[#422c00] text-[10px] font-bold flex items-center justify-center">
                  {itemsCount}
                </span>
              )}
            </button>

            {/* Account / User */}
            <Link
              href={`/${locale}/account`}
              className="flex items-center gap-1.5 p-1.5 sm:px-3 sm:py-1.5 rounded-lg bg-[#1c1f29] hover:bg-[#272a33] text-[#e0e2ef] text-xs font-bold border border-[#4e463a]/40 transition-colors"
            >
              <User className="w-4 h-4 text-[#e6c184]" />
              <span className="hidden sm:inline">
                {customer?.name || (isRtl ? "تصفح كزائر" : "Guest")}
              </span>
            </Link>
          </div>
        </div>

        {/* Secondary Navigation Ribbon (Originals P01) */}
        <div className="hidden lg:block border-t border-[#4e463a]/20 bg-[#0b0e17]/80">
          <div className="max-w-[1280px] w-full mx-auto px-4 sm:px-6">
            <nav className="flex items-center justify-between text-xs py-2.5 overflow-x-auto whitespace-nowrap scrollbar-none gap-4">
              <Link href={`/${locale}`} className="text-[#e6c184] font-bold hover:underline">
                {isRtl ? "اكتشف" : "Discover"}
              </Link>
              <Link href={`/${locale}/books`} className="text-[#d1c5b5] hover:text-[#e0e2ef] transition-colors">
                {isRtl ? "الكتالوج الشامل" : "Catalog"}
              </Link>
              <Link href={`/${locale}/genres`} className="text-[#d1c5b5] hover:text-[#e0e2ef] transition-colors">
                {isRtl ? "أنواع الحكايات" : "Genres"}
              </Link>
              <Link href={`/${locale}/audiobooks`} className="text-[#d1c5b5] hover:text-[#e0e2ef] transition-colors">
                {isRtl ? "المكتبة الصوتية" : "Audiobooks"}
              </Link>
              <Link href={`/${locale}/salons`} className="text-[#d1c5b5] hover:text-[#e0e2ef] transition-colors">
                {isRtl ? "الأندية الأدبية" : "Salons"}
              </Link>
              <Link href={`/${locale}/interactive`} className="text-[#d1c5b5] hover:text-[#e0e2ef] transition-colors">
                {isRtl ? "سرد تفاعلي" : "Interactive"}
              </Link>
              <Link href={`/${locale}/atlas`} className="text-[#d1c5b5] hover:text-[#e0e2ef] transition-colors">
                {isRtl ? "أطلس السرد" : "Story Atlas"}
              </Link>
              <Link href={`/${locale}/illustrated`} className="text-[#d1c5b5] hover:text-[#e0e2ef] transition-colors">
                {isRtl ? "روايات مصورة" : "Illustrated"}
              </Link>
              <Link href={`/${locale}/products`} className="text-[#d1c5b5] hover:text-[#e0e2ef] transition-colors">
                {isRtl ? "المقتنيات الفاخرة" : "Deluxe Items"}
              </Link>
              <Link href={`/${locale}/subscriptions`} className="text-[#e6c184] font-bold hover:underline">
                {isRtl ? "باقات VIP" : "VIP Pass"}
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Cart Sheet Component */}
      <CartSheet locale={locale} dict={dict} />
    </>
  )
}
