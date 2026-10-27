import React from "react"
import Link from "next/link"
import { isValidLocale, defaultLocale, Locale } from "@/lib/i18n"
import { Button } from "@/components/ui/button"
import {
  Sparkles,
  BookOpen,
  Package,
  ShieldCheck,
  Truck,
  Award,
  Star,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

import {storeProducts,catalogProduct} from "@/lib/store-products-server"

export const metadata = {
  title: "المقتنيات المجلدة والمخطوطات الفاخرة والطبعات المحدودة | StoryVerse",
  description: "اكتشف الطبعات الورقية الملكية المجلدة بجلد طبيعي فاخر، صناديق المقتنيات الخشبية، والمخطوطات المرقمة الموقعة من المؤلفين.",
}

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
  const isRtl = validLocale === "ar"

  const {products,currency}=await storeProducts()
  const editions=products.map(product=>catalogProduct(product,currency))
  const categoryValues=[...new Set(editions.map(product=>product.category))].filter(value=>value!=="uncategorized")
  let filtered = [...editions]

  if (q) {
    const query = q.toLowerCase()
    filtered = filtered.filter(
      (p) =>
        p.title.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query)
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

  return (
    <div className="min-h-screen bg-[#10131c] text-[#e0e2ef] pb-24">
      {/* Hero Header */}
      <section className="relative overflow-hidden bg-[#0b0e17] border-b border-[#4e463a]/40 pt-12 pb-16">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#e6c184]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-[#9a8f81] mb-6">
            <Link href={`/${validLocale}`} className="hover:text-[#e6c184] transition-colors">
              {isRtl ? "الرئيسية" : "Home"}
            </Link>
            <span className="material-symbols-outlined text-[14px]">chevron_left</span>
            <span className="text-[#e6c184] font-bold">
              {isRtl ? "أروقة المقتنيات والمخطوطات الفاخرة" : "Deluxe Physical Editions"}
            </span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-3xl">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2.5 py-1 rounded bg-[#e6c184]/20 text-[#e6c184] text-[11px] font-bold border border-[#e6c184]/30 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>طبعات ورقية ملكية محدودة الإصدار</span>
                </span>
                <span className="px-2.5 py-1 rounded bg-[#272a33] text-[#cdc6b8] text-xs font-bold border border-[#4e463a]/30">
                  شحن مؤمن لجميع المدن
                </span>
              </div>
              <h1 className="font-serif text-3xl sm:text-5xl font-black text-[#e0e2ef] tracking-tight">
                {isRtl ? "المنتجات والإصدارات المتاحة" : "Store Products & Editions"}
              </h1>
              <p className="font-serif text-sm sm:text-base text-[#d1c5b5] mt-3 leading-relaxed">
                {isRtl
                  ? "المنتجات المنشورة وأسعار النسخ من المتجر مباشرة. التوفر وخيارات التوصيل حسب النسخة والطلب."
                  : "Published products and variant prices from the store. Availability and delivery depend on the edition and order."}
              </p>
            </div>

            {/* Quick Trust Strip */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="p-3 rounded-2xl bg-[#1c1f29] border border-[#4e463a]/40 flex items-center gap-2 text-xs text-[#d1c5b5]">
                <Truck className="w-4 h-4 text-[#e6c184]" />
                <span>التوصيل حسب خيارات الطلب</span>
              </div>
              <div className="p-3 rounded-2xl bg-[#1c1f29] border border-[#4e463a]/40 flex items-center gap-2 text-xs text-[#d1c5b5]">
                <Award className="w-4 h-4 text-emerald-400" />
                <span>بيانات من المتجر</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Catalog Grid */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-12">
        {/* Category Pills Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b border-[#4e463a]/30">
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={`/${validLocale}/products`}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                !category || category === "all"
                  ? "bg-[#e6c184] text-[#422c00] shadow-md"
                  : "bg-[#1c1f29] text-[#cdc6b8] hover:bg-[#272a33]"
              }`}
            >
              كافة المقتنيات ({editions.length})
            </Link>
            {categoryValues.map(value=><Link key={value} href={"/"+validLocale+"/products?category="+encodeURIComponent(value)} className={category===value?"px-4 py-2 rounded-xl text-xs font-bold bg-[#e6c184] text-[#422c00]":"px-4 py-2 rounded-xl text-xs font-bold bg-[#1c1f29] text-[#cdc6b8]"}>{value}</Link>)}
          </div>

          <div className="flex items-center gap-2 text-xs text-[#9a8f81]">
            <span>ترتيب حسب:</span>
            <Link
              href={`/${validLocale}/products?sort=price_asc`}
              className="text-[#e6c184] hover:underline"
            >
              السعر الأقل
            </Link>
            <span>•</span>
            <Link
              href={`/${validLocale}/products?sort=price_desc`}
              className="text-[#e6c184] hover:underline"
            >
              السعر الأعلى
            </Link>
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-start">
          {filtered.map((item) => (
            <article
              key={item.id}
              className="group rounded-3xl bg-[#1c1f29] border border-[#4e463a]/40 hover:border-[#e6c184] transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-xl hover:-translate-y-1"
            >
              <div>
                {/* Visual Cover */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#272a33]">
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1c1f29] via-transparent to-transparent opacity-90" />
                  <div className="absolute top-3 right-3 flex flex-wrap gap-1">
                    {item.badges.map((b:string, idx:number) => (
                      <span
                        key={idx}
                        className="px-2.5 py-0.5 rounded-full bg-[#10131c]/80 backdrop-blur-md text-[#e6c184] text-[10px] font-bold border border-[#e6c184]/30"
                      >
                        {b}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Details */}
                <div className="p-6 space-y-3">
                  <div className="flex items-center justify-between text-xs text-[#9a8f81]">
                    <span className="text-[#e6c184] font-bold">{item.editionType}</span>
                    <span className="text-emerald-400 font-mono">{item.inStock?"متاح حسب النسخة":"غير متاح حاليًا"}</span>
                  </div>

                  <h3 className="font-serif text-lg font-black text-[#e0e2ef] group-hover:text-[#e6c184] transition-colors leading-snug">
                    {item.title}
                  </h3>

                  <p className="font-serif text-xs text-[#d1c5b5] line-clamp-3 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Price & Action */}
              <div className="p-6 pt-0 border-t border-[#4e463a]/30 mt-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-[#9a8f81] block">سعر الاقتناء:</span>
                  <div className="flex items-baseline gap-1">
                    <span className="font-serif text-2xl font-black text-[#e6c184]">
                      {item.hasPrice?new Intl.NumberFormat(validLocale,{style:"currency",currency:item.currencyCode}).format(item.price/100):isRtl?"السعر غير متاح":"Pricing unavailable"}
                    </span>

                  </div>
                </div>

                <Button asChild className="rounded-xl font-bold text-xs bg-[#e6c184] text-[#422c00] hover:bg-[#ffdeaa] shadow-md">
                  <Link href={`/${validLocale}/products/${item.handle}`}>
                    <span>معاينة الصندوق</span>
                    <span className="material-symbols-outlined text-[16px] ms-1">arrow_back</span>
                  </Link>
                </Button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}
