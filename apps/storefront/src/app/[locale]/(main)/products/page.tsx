import React from "react"
import Link from "next/link"
import { getDictionary, isValidLocale, defaultLocale, Locale } from "@/lib/i18n"
import { ProductCard } from "@/components/products/product-card"
import { Button } from "@/components/ui/button"
import { SlidersHorizontal, ArrowUpDown, SearchX } from "lucide-react"

// Complete catalog collection
const catalogProducts = [
  {
    id: "prod_01HQWXYZ1",
    title: "سماعات الرأس اللاسلكية الاحترافية ANC Pro Max",
    handle: "pro-wireless-headphones-anc",
    price: 89900,
    category: "audio",
    thumbnail: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
    inStock: true,
    defaultVariantId: "variant_headphones_01",
  },
  {
    id: "prod_01HQWXYZ2",
    title: "الساعة الذكية المتطورة Ultra Titanium Edition",
    handle: "ultra-smartwatch-titanium",
    price: 145000,
    category: "wearables",
    thumbnail: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
    inStock: true,
    defaultVariantId: "variant_smartwatch_01",
  },
  {
    id: "prod_01HQWXYZ3",
    title: "لوحة المفاتيح الميكانيكية المخصصة RGB Pro Wireless",
    handle: "mechanical-keyboard-rgb-pro",
    price: 49900,
    category: "computing",
    thumbnail: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80",
    inStock: true,
    defaultVariantId: "variant_keyboard_01",
  },
  {
    id: "prod_01HQWXYZ4",
    title: "مكبر الصوت الذكي عالي النقاء Spatial Audio Home",
    handle: "spatial-audio-home-speaker",
    price: 65000,
    category: "audio",
    thumbnail: "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&q=80",
    inStock: true,
    defaultVariantId: "variant_speaker_01",
  },
  {
    id: "prod_01HQWXYZ5",
    title: "فأرة الألعاب اللاسلكية بدقة 30,000 DPI UltraLight",
    handle: "ultralight-gaming-mouse-wireless",
    price: 32000,
    category: "computing",
    thumbnail: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&q=80",
    inStock: true,
    defaultVariantId: "variant_mouse_01",
  },
  {
    id: "prod_01HQWXYZ6",
    title: "شاحن الطاقة المحمول GaN بقوة 140W ثلاثي المنافذ",
    handle: "gan-fast-charger-140w",
    price: 24000,
    category: "accessories",
    thumbnail: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&q=80",
    inStock: true,
    defaultVariantId: "variant_charger_01",
  },
]

export default async function ProductsCatalogPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ q?: string; category?: string; sort?: string }>
}) {
  const { locale } = await params
  const { q, category, sort } = await searchParams
  const validLocale = isValidLocale(locale) ? (locale as Locale) : defaultLocale
  const dict = getDictionary(validLocale)

  // Filter products by query and category
  let filtered = [...catalogProducts]

  if (q) {
    const query = q.toLowerCase()
    filtered = filtered.filter(
      (p) =>
        p.title.toLowerCase().includes(query) ||
        p.handle.toLowerCase().includes(query)
    )
  }

  if (category && category !== "all") {
    filtered = filtered.filter((p) => p.category === category)
  }

  if (sort === "price_asc") {
    filtered.sort((a, b) => a.price - b.price)
  } else if (sort === "price_desc") {
    filtered.sort((a, b) => b.price - a.price)
  }

  const categories = [
    { id: "all", nameAr: "الكل", nameEn: "All" },
    { id: "audio", nameAr: "الصوتيات", nameEn: "Audio" },
    { id: "wearables", nameAr: "الأجهزة القابلة للارتداء", nameEn: "Wearables" },
    { id: "computing", nameAr: "الملحقات والكمبيوتر", nameEn: "Computing" },
    { id: "accessories", nameAr: "الشواحن والطاقة", nameEn: "Power & Chargers" },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Title & Description */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-foreground">
          {dict.nav.products}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {validLocale === "ar"
            ? "استعرض جميع المنتجات المتاحة مع التحقق التلقائي من المخزون والأسعار الخاضعة للضريبة"
            : "Browse all authenticated products with real-time stock levels and verified server pricing"}
        </p>
      </div>

      {/* Filter and Category Pills */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border mb-8">
        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
          {categories.map((cat) => {
            const isActive = (!category && cat.id === "all") || category === cat.id
            return (
              <Button
                key={cat.id}
                asChild
                variant={isActive ? "default" : "outline"}
                size="sm"
                className="rounded-full text-xs shrink-0"
              >
                <Link
                  href={`/${validLocale}/products?${new URLSearchParams({
                    ...(q ? { q } : {}),
                    ...(cat.id !== "all" ? { category: cat.id } : {}),
                    ...(sort ? { sort } : {}),
                  }).toString()}`}
                >
                  {validLocale === "ar" ? cat.nameAr : cat.nameEn}
                </Link>
              </Button>
            )
          })}
        </div>

        {/* Sorting Dropdown Links */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground shrink-0">
          <ArrowUpDown className="w-3.5 h-3.5" />
          <span>{validLocale === "ar" ? "الترتيب:" : "Sort:"}</span>
          <Link
            href={`/${validLocale}/products?${new URLSearchParams({
              ...(q ? { q } : {}),
              ...(category ? { category } : {}),
              sort: "price_asc",
            }).toString()}`}
            className={`hover:text-primary transition-colors ${
              sort === "price_asc" ? "font-bold text-primary" : ""
            }`}
          >
            {validLocale === "ar" ? "الأقل سعراً" : "Price: Low to High"}
          </Link>
          <span>•</span>
          <Link
            href={`/${validLocale}/products?${new URLSearchParams({
              ...(q ? { q } : {}),
              ...(category ? { category } : {}),
              sort: "price_desc",
            }).toString()}`}
            className={`hover:text-primary transition-colors ${
              sort === "price_desc" ? "font-bold text-primary" : ""
            }`}
          >
            {validLocale === "ar" ? "الأعلى سعراً" : "Price: High to Low"}
          </Link>
        </div>
      </div>

      {/* Products Grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
            <SearchX className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-foreground">
            {validLocale === "ar" ? "لم نجد أي منتجات تطابق بحثك" : "No products found"}
          </h3>
          <p className="text-xs text-muted-foreground max-w-sm">
            {validLocale === "ar"
              ? "يرجى تجربة كلمات بحث أخرى أو إزالة بعض معايير التصفية."
              : "Try adjusting your search criteria or filters to find what you are looking for."}
          </p>
          <Button asChild variant="outline" className="mt-2">
            <Link href={`/${validLocale}/products`}>
              {validLocale === "ar" ? "عرض جميع المنتجات" : "Reset All Filters"}
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              title={
                validLocale === "ar"
                  ? product.title
                  : product.handle.replace(/-/g, " ").toUpperCase()
              }
              handle={product.handle}
              thumbnail={product.thumbnail}
              price={product.price}
              inStock={product.inStock}
              defaultVariantId={product.defaultVariantId}
              currencyCode="SAR"
              locale={validLocale}
              dict={dict}
            />
          ))}
        </div>
      )}
    </div>
  )
}
