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
      <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        {/* Top Notification Announcement Bar */}
        <div className="bg-primary px-4 py-1.5 text-center text-xs font-medium text-primary-foreground flex items-center justify-center gap-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>
            {locale === "ar"
              ? "منصة النشر المتعددة: روايات وكتب صوتية وإلكترونية لكافة الأعمار مع اشتراك VIP غير محدود"
              : "Multi-Format Publishing: E-books, Audiobooks & VIP All-Access Subscription Passes"}
          </span>
        </div>

        {/* Main Header Bar */}
        <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
          {/* Mobile Menu Toggle & Brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-muted-foreground hover:text-foreground"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <Link href={`/${locale}`} className="flex items-center gap-2 font-bold text-lg tracking-tight">
              <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-black">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="hidden sm:inline-block font-extrabold text-foreground">
                {locale === "ar" ? "دار الروايات والنشر" : "StoryPublish"}
              </span>
            </Link>
          </div>

          {/* Search Bar (Desktop) */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex flex-1 max-w-sm items-center relative"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={locale === "ar" ? "ابحث عن رواية، كاتب، راوٍ صوتي..." : "Search stories, authors, narrators..."}
              className="w-full h-9 px-4 ps-10 rounded-full border border-input bg-muted/50 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
            <Search className="w-3.5 h-3.5 text-muted-foreground absolute start-3.5 pointer-events-none" />
          </form>

          {/* Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-5 text-xs font-semibold">
            <Link href={`/${locale}/books`} className="text-foreground hover:text-primary transition-colors">
              {locale === "ar" ? "جميع الكتب والروايات" : "All Stories"}
            </Link>
            <Link href={`/${locale}/subscriptions`} className="text-primary hover:underline transition-colors flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{locale === "ar" ? "باقات VIP للقراء" : "VIP Memberships"}</span>
            </Link>
            <Link href={`/${locale}/library`} className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
              <Headphones className="w-3.5 h-3.5" />
              <span>{locale === "ar" ? "مكتبتي الرقمية" : "My Library"}</span>
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
              className="flex items-center gap-1.5 text-xs font-semibold px-2.5 h-9"
              title={dict.nav.change_language}
            >
              <Globe className="w-4 h-4 text-muted-foreground" />
              <span>{dict.nav.change_language}</span>
            </Button>

            {/* Account Link */}
            <Button variant="ghost" size="sm" asChild className="h-9 px-2.5 rounded-full gap-1.5">
              <Link href={`/${locale}/account`} title={dict.nav.account}>
                {customer?.avatar ? (
                  <img
                    src={customer.avatar}
                    alt={customer.name}
                    className="w-5 h-5 rounded-full object-cover border"
                  />
                ) : (
                  <User className="w-4 h-4 text-muted-foreground" />
                )}
                <span className="hidden sm:inline text-xs font-bold text-foreground">
                  {customer ? customer.name.split(" ")[0] : dict.nav.account}
                </span>
                {customer?.isVip && (
                  <span className="w-2 h-2 rounded-full bg-purple-600 shrink-0" title="VIP Member" />
                )}
              </Link>
            </Button>

            {/* Cart Trigger Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsOpen(true)}
              className="relative h-9 px-3 gap-2 rounded-full border-primary/20 hover:border-primary"
            >
              <ShoppingBag className="w-4 h-4 text-primary" />
              <span className="hidden sm:inline text-xs font-semibold">{dict.nav.cart}</span>
              {itemsCount > 0 && (
                <span className="bg-primary text-primary-foreground text-[11px] font-bold h-5 min-w-[20px] px-1 rounded-full flex items-center justify-center">
                  {itemsCount}
                </span>
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border p-4 bg-background space-y-3 text-xs font-semibold">
            <Link
              href={`/${locale}/books`}
              onClick={() => setMobileMenuOpen(false)}
              className="block p-2 hover:bg-muted rounded-md"
            >
              {locale === "ar" ? "جميع الكتب والروايات" : "All Stories"}
            </Link>
            <Link
              href={`/${locale}/subscriptions`}
              onClick={() => setMobileMenuOpen(false)}
              className="block p-2 text-primary hover:bg-muted rounded-md"
            >
              {locale === "ar" ? "باقات VIP للقراء" : "VIP Memberships"}
            </Link>
            <Link
              href={`/${locale}/library`}
              onClick={() => setMobileMenuOpen(false)}
              className="block p-2 hover:bg-muted rounded-md"
            >
              {locale === "ar" ? "مكتبتي الرقمية (المشغل والقارئ)" : "My Library"}
            </Link>
          </div>
        )}
      </header>

      {/* Slide-over Cart component */}
      <CartSheet locale={locale} dict={dict} />
    </>
  )
}
