"use client"

import React, { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useCart } from "@/context/cart-context"
import { useCustomerAuth } from "@/context/customer-auth-context"
import { Button } from "@/components/ui/button"
import { CartSheet } from "@/components/cart/cart-sheet"
import { KidsModeToggle } from "@/components/kids/kids-mode-toggle"
import {
  ShoppingBag,
  User,
  Globe,
  Search,
  Menu,
  X,
  Sparkles,
  BookOpen,
  Headphones,
  Crown,
  Compass,
  Feather,
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
  const [searchQuery, setSearchQuery] = useState("")

  const toggleLanguage = () => {
    const nextLocale = locale === "ar" ? "en" : "ar"
    document.cookie = `NEXT_LOCALE=${nextLocale}; path=/; max-age=31536000`

    const segments = pathname.split("/")
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
      <header className="sticky top-0 z-40 w-full stitch-glass border-b border-amber-500/15 transition-all">
        {/* Top Luxury Announcement Ribbon */}
        <div className="bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-700 text-slate-950 px-4 py-1.5 text-center text-xs font-bold flex items-center justify-center gap-2 shadow-inner">
          <Sparkles className="w-3.5 h-3.5 fill-current text-slate-950" />
          <span>
            {locale === "ar"
              ? "دار النشر المعيارية: روايات فاخرة ورقية، كتب صوتية مشفرة، وتفعيل اشتراك VIP الشهري الفوري"
              : "Sovereign Literary Platform: Deluxe Hardcover Novels, DRM-Protected Audiobooks & VIP Pass"}
          </span>
          <span className="hidden sm:inline-block bg-slate-950/15 text-slate-950 px-2 py-0.2 rounded-full text-[10px] font-black uppercase">
            STITCH DESIGN
          </span>
        </div>

        {/* Main Header Bar */}
        <div className="container mx-auto px-4 h-18 flex items-center justify-between gap-4">
          {/* Mobile Menu Toggle & Brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-muted-foreground hover:text-foreground rounded-lg"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <Link href={`/${locale}`} className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 text-slate-950 flex items-center justify-center font-black shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
                <Feather className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-black text-base sm:text-lg tracking-tight text-foreground group-hover:text-primary transition-colors flex items-center gap-1.5">
                  <span>{locale === "ar" ? "دار الروايات العالمية" : "Sovereign Stories"}</span>
                  <Crown className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                </span>
                <span className="hidden sm:inline-block text-[10px] text-muted-foreground font-semibold tracking-wider uppercase">
                  {locale === "ar" ? "منصة النشر والأدب الرقمي والسمعي" : "Multi-Format Publishing House"}
                </span>
              </div>
            </Link>
          </div>

          {/* Search Bar (Desktop) with Google Stitch Styling */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex flex-1 max-w-md items-center relative"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={locale === "ar" ? "ابحث بالرواية، اسم المؤلف، الراوي الصوتي..." : "Search stories, authors, narrators..."}
              className="w-full h-10 px-4 ps-10 pe-16 rounded-full border border-amber-500/25 bg-background/60 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all shadow-inner"
            />
            <Search className="w-4 h-4 text-amber-600/70 absolute start-3.5 pointer-events-none" />
            <kbd className="absolute end-3 hidden sm:inline-block bg-muted text-muted-foreground text-[10px] font-mono px-1.5 py-0.5 rounded border border-border">
              ⌘K
            </kbd>
          </form>

          {/* Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-bold">
            <Link
              href={`/${locale}/books`}
              className="text-foreground/90 hover:text-primary transition-colors flex items-center gap-1.5 py-1"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-600" />
              <span>{locale === "ar" ? "معرض الروايات" : "Catalog"}</span>
            </Link>

            <Link
              href={`/${locale}/subscriptions`}
              className="text-amber-600 dark:text-amber-400 font-extrabold hover:text-amber-700 transition-colors flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/25 px-3 py-1 rounded-full shadow-xs"
            >
              <Crown className="w-3.5 h-3.5 text-amber-500" />
              <span>{locale === "ar" ? "نادي القراء VIP" : "VIP Pass"}</span>
            </Link>

            <Link
              href={`/${locale}/library`}
              className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5 py-1"
            >
              <Headphones className="w-3.5 h-3.5 text-purple-600" />
              <span>{locale === "ar" ? "مكتبتي الصوتية" : "My Library"}</span>
            </Link>
          </nav>

          {/* Action Icons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Safe Kids Mode Switcher */}
            <KidsModeToggle locale={locale} />

            {/* Language Switcher */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 text-xs font-bold px-2.5 h-9 rounded-full hover:bg-amber-500/10 text-foreground"
              title={dict.nav.change_language}
            >
              <Globe className="w-4 h-4 text-amber-600" />
              <span>{locale === "ar" ? "EN" : "عربي"}</span>
            </Button>

            {/* Account Link */}
            <Button variant="ghost" size="sm" asChild className="h-9 px-2.5 rounded-full gap-1.5 hover:bg-amber-500/10">
              <Link href={`/${locale}/account`} title={dict.nav.account}>
                {customer?.avatar ? (
                  <img
                    src={customer.avatar}
                    alt={customer.name}
                    className="w-6 h-6 rounded-full object-cover border-2 border-amber-500"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-700 flex items-center justify-center font-bold text-[11px]">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
                <span className="hidden sm:inline text-xs font-bold text-foreground">
                  {customer ? customer.name.split(" ")[0] : (locale === "ar" ? "حسابي" : "Account")}
                </span>
              </Link>
            </Button>

            {/* Luxury Cart Trigger Button */}
            <Button
              size="sm"
              onClick={() => setIsOpen(true)}
              className="relative h-10 px-3.5 gap-2 rounded-full stitch-gold-gradient font-black text-xs hover:opacity-95 transition-all"
            >
              <ShoppingBag className="w-4 h-4 text-slate-950" />
              <span className="hidden sm:inline font-bold text-slate-950">{locale === "ar" ? "السلة" : "Cart"}</span>
              {itemsCount > 0 && (
                <span className="bg-slate-950 text-amber-400 text-[11px] font-black h-5 min-w-[20px] px-1.5 rounded-full flex items-center justify-center shadow-xs">
                  {itemsCount}
                </span>
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-amber-500/20 p-4 bg-background/95 backdrop-blur space-y-3 text-xs font-bold">
            <Link
              href={`/${locale}/books`}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 p-2.5 hover:bg-muted rounded-lg"
            >
              <BookOpen className="w-4 h-4 text-amber-600" />
              <span>{locale === "ar" ? "معرض الروايات والإصدارات" : "All Stories"}</span>
            </Link>
            <Link
              href={`/${locale}/subscriptions`}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 p-2.5 bg-amber-500/10 text-amber-600 rounded-lg font-black"
            >
              <Crown className="w-4 h-4 text-amber-500" />
              <span>{locale === "ar" ? "نادي القراء VIP والعضويات" : "VIP Memberships"}</span>
            </Link>
            <Link
              href={`/${locale}/library`}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 p-2.5 hover:bg-muted rounded-lg"
            >
              <Headphones className="w-4 h-4 text-purple-600" />
              <span>{locale === "ar" ? "مكتبتي الرقمية والصوتية" : "My Library"}</span>
            </Link>
          </div>
        )}
      </header>

      {/* Slide-over Cart component */}
      <CartSheet locale={locale} dict={dict} />
    </>
  )
}
