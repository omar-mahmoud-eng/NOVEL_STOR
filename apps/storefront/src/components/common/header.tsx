"use client"

import React, { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useCart } from "@/context/cart-context"
import { useCustomerAuth } from "@/context/customer-auth-context"
import { KidsModeToggle } from "@/components/kids/kids-mode-toggle"
import { CartSheet } from "@/components/cart/cart-sheet"
import {
  ShoppingBag,
  User,
  Search,
  Menu,
  X,
  Sparkles,
  BookOpen,
  Headphones,
  Crown,
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
  const pathname = usePathname()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [realmDropdownOpen, setRealmDropdownOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

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

  return (
    <>
      <header className="sticky top-0 w-full z-50 bg-[#10131c]/90 backdrop-blur-xl border-b border-[#4e463a]/30 shadow-sm transition-all">
        {/* Main Header Bar (Matching Stitch p01_base_1440) */}
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

              {realmDropdownOpen && (
                <div
                  onMouseLeave={() => setRealmDropdownOpen(false)}
                  className="absolute right-0 top-full mt-1.5 w-64 bg-[#1c1f29] rounded-xl shadow-2xl border border-[#4e463a]/60 p-1.5 z-50 animate-in fade-in duration-200"
                >
                  <Link
                    href={`/${locale}/books?age=adults_18_plus`}
                    onClick={() => setRealmDropdownOpen(false)}
                    className="flex items-center justify-between px-3 py-2 rounded-lg bg-[#272a33] text-[#e6c184] text-xs font-bold"
                  >
                    <span>Originals / صالون الأدب (+18)</span>
                    <Check className="w-3.5 h-3.5 text-[#e6c184]" />
                  </Link>

                  <Link
                    href={`/${locale}/realms/teens`}
                    onClick={() => setRealmDropdownOpen(false)}
                    className="flex items-center px-3 py-2 rounded-lg text-[#d1c5b5] hover:bg-[#272a33] hover:text-[#e0e2ef] text-xs font-medium transition-colors"
                  >
                    Teens / مدار الزجاج (13-17)
                  </Link>

                  <Link
                    href={`/${locale}/realms/kids`}
                    onClick={() => setRealmDropdownOpen(false)}
                    className="flex items-center px-3 py-2 rounded-lg text-[#d1c5b5] hover:bg-[#272a33] hover:text-[#e0e2ef] text-xs font-medium transition-colors"
                  >
                    Kids / حارس المنارة (7-12)
                  </Link>

                  <Link
                    href={`/${locale}/realms/little`}
                    onClick={() => setRealmDropdownOpen(false)}
                    className="flex items-center px-3 py-2 rounded-lg text-[#d1c5b5] hover:bg-[#272a33] hover:text-[#e0e2ef] text-xs font-medium transition-colors"
                  >
                    Little / واحة البراعم (3-6)
                  </Link>

                  <div className="my-1 bg-[#32343e] h-px" />

                  <Link
                    href={`/${locale}/family-hub`}
                    onClick={() => setRealmDropdownOpen(false)}
                    className="flex items-center px-3 py-2 rounded-lg text-[#d1c5b5] hover:bg-[#272a33] hover:text-[#e0e2ef] text-xs font-medium transition-colors"
                  >
                    Family Hub / مركز الأسرة
                  </Link>
                </div>
              )}
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-5 text-xs font-bold">
              <Link href={`/${locale}`} className="text-[#e6c184] hover:text-[#ffdeaa] transition-colors">
                اكتشف
              </Link>
              <Link href={`/${locale}/books`} className="text-[#d1c5b5] hover:text-[#e0e2ef] transition-colors">
                الكتالوج الشامل
              </Link>
              <Link href={`/${locale}/genres`} className="text-[#d1c5b5] hover:text-[#e0e2ef] transition-colors">
                أنواع الحكايات
              </Link>
              <Link href={`/${locale}/audiobooks`} className="text-[#d1c5b5] hover:text-[#e0e2ef] transition-colors">
                المكتبة الصوتية
              </Link>
              <Link href={`/${locale}/salons`} className="text-[#d1c5b5] hover:text-[#e0e2ef] transition-colors">
                الأندية الأدبية
              </Link>
              <Link href={`/${locale}/interactive`} className="text-[#d1c5b5] hover:text-[#e0e2ef] transition-colors">
                سرد تفاعلي
              </Link>
              <Link href={`/${locale}/atlas`} className="text-[#d1c5b5] hover:text-[#e0e2ef] transition-colors">
                أطلس السرد
              </Link>
              <Link href={`/${locale}/illustrated`} className="text-[#d1c5b5] hover:text-[#e0e2ef] transition-colors">
                روايات مصورة
              </Link>
              <Link href={`/${locale}/products`} className="text-[#d1c5b5] hover:text-[#e0e2ef] transition-colors">
                المقتنيات الفاخرة
              </Link>
              <Link href={`/${locale}/subscriptions`} className="text-[#d1c5b5] hover:text-[#e0e2ef] transition-colors">
                باقات VIP
              </Link>
            </nav>
          </div>

          {/* Right Action Icons & Controls */}
          <div className="flex items-center gap-3">
            
            {/* Search Input Trigger */}
            <form onSubmit={handleSearchSubmit} className="hidden sm:flex items-center relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث في الأرشيف..."
                className="w-48 h-9 px-3 ps-8 rounded-lg bg-[#1c1f29] border border-[#4e463a]/40 text-xs text-[#e0e2ef] placeholder:text-[#9a8f81] focus:outline-none focus:w-64 focus:border-[#e6c184] transition-all"
              />
              <Search className="w-3.5 h-3.5 text-[#9a8f81] absolute start-2.5 pointer-events-none" />
            </form>

            {/* Guest indicator pill */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#181b25] text-[#d1c5b5] text-[11px] font-bold border border-[#4e463a]/30">
              <span className="w-2 h-2 rounded-full bg-[#e6c184]/70 animate-pulse" />
              <span>تصفح كزائر</span>
            </div>

            {/* Kids Mode Toggle */}
            <KidsModeToggle locale={locale} />

            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="p-2 rounded-lg bg-[#1c1f29] hover:bg-[#272a33] text-[#d1c5b5] hover:text-[#e0e2ef] text-xs font-bold transition-colors"
              title="تغيير اللغة / Switch Language"
            >
              {locale === "ar" ? "EN" : "عربي"}
            </button>

            {/* Account / Portal Link */}
            <Link
              href={`/${locale}/account`}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1c1f29] hover:bg-[#272a33] text-[#e6c184] text-xs font-bold border border-[#4e463a]/40 transition-colors"
            >
              <User className="w-3.5 h-3.5" />
              <span className="hidden sm:inline-block">
                {customer ? customer.name.split(" ")[0] : "تسجيل الدخول"}
              </span>
            </Link>

            {/* Cart Button */}
            <button
              onClick={() => setIsOpen(true)}
              className="relative p-2 rounded-lg bg-[#e6c184] text-[#422c00] hover:bg-[#ffdeaa] transition-colors font-bold shadow-md"
              aria-label="سلة المقتنيات"
            >
              <ShoppingBag className="w-4 h-4" />
              {itemsCount > 0 && (
                <span className="absolute -top-1 -start-1 bg-[#ba1a1a] text-white text-[10px] font-black rounded-full w-4 h-4 flex items-center justify-center">
                  {itemsCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-[#4e463a]/30 bg-[#10131c] p-4 space-y-3">
            <nav className="flex flex-col gap-2 text-xs font-bold">
              <Link
                href={`/${locale}`}
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-lg text-[#e6c184] bg-[#1c1f29]"
              >
                اكتشف
              </Link>
              <Link
                href={`/${locale}/books`}
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-lg text-[#d1c5b5] hover:bg-[#1c1f29]"
              >
                الكتالوج الشامل
              </Link>
              <Link
                href={`/${locale}/genres`}
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-lg text-[#d1c5b5] hover:bg-[#1c1f29]"
              >
                أنواع الحكايات
              </Link>
              <Link
                href={`/${locale}/audiobooks`}
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-lg text-[#d1c5b5] hover:bg-[#1c1f29]"
              >
                المكتبة الصوتية
              </Link>
              <Link
                href={`/${locale}/salons`}
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-lg text-[#d1c5b5] hover:bg-[#1c1f29]"
              >
                الأندية الأدبية وصالونات الحوار
              </Link>
              <Link
                href={`/${locale}/interactive`}
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-lg text-[#d1c5b5] hover:bg-[#1c1f29]"
              >
                الروايات التفاعلية (مسارات متعددة)
              </Link>
              <Link
                href={`/${locale}/atlas`}
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-lg text-[#d1c5b5] hover:bg-[#1c1f29]"
              >
                أطلس السرد وشبكة الشخصيات
              </Link>
              <Link
                href={`/${locale}/illustrated`}
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-lg text-[#d1c5b5] hover:bg-[#1c1f29]"
              >
                الروايات المصورة والويب تون
              </Link>
              <Link
                href={`/${locale}/mood-selector`}
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-lg text-[#d1c5b5] hover:bg-[#1c1f29]"
              >
                محدد المزاج والوقت القرائي
              </Link>
              <Link
                href={`/${locale}/products`}
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-lg text-[#d1c5b5] hover:bg-[#1c1f29]"
              >
                المقتنيات المجلدة الفاخرة
              </Link>
              <Link
                href={`/${locale}/preferences`}
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-lg text-[#d1c5b5] hover:bg-[#1c1f29]"
              >
                تفضيلات القراءة والهدوء
              </Link>
              <Link
                href={`/${locale}/realms/teens`}
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-lg text-purple-400 hover:bg-[#1c1f29]"
              >
                مدار اليافعين (13-17)
              </Link>
              <Link
                href={`/${locale}/realms/kids`}
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-lg text-emerald-400 hover:bg-[#1c1f29]"
              >
                كوكب الأطفال (7-12)
              </Link>
              <Link
                href={`/${locale}/realms/little`}
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-lg text-amber-300 hover:bg-[#1c1f29]"
              >
                واحة البراعم (3-6)
              </Link>
              <Link
                href={`/${locale}/family-hub`}
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-lg text-[#d1c5b5] hover:bg-[#1c1f29]"
              >
                مركز الأسرة والرقابة
              </Link>
              <Link
                href={`/${locale}/library`}
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-lg text-[#d1c5b5] hover:bg-[#1c1f29]"
              >
                مكتبتي الرقمية
              </Link>
              <Link
                href={`/${locale}/subscriptions`}
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-lg text-[#d1c5b5] hover:bg-[#1c1f29]"
              >
                باقات VIP
              </Link>
              <Link
                href={`/${locale}/account`}
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-lg text-[#d1c5b5] hover:bg-[#1c1f29]"
              >
                مركز الأسرة والحساب
              </Link>
            </nav>
          </div>
        )}
      </header>

      {/* Cart Sheet Component */}
      <CartSheet locale={locale} dict={dict} />
    </>
  )
}
