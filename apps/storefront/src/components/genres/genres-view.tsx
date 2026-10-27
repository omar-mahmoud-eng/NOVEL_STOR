"use client"
import { useCatalogBooks } from "@/context/catalog-context"

import React from "react"
import Link from "@/components/common/realm-link"
import { bookGenre } from "@/components/products/original-catalog"
import { PUBLISHING_BOOKS } from "@/lib/books-data"

type GenresViewProps = {
  locale: "ar" | "en"
}

export function GenresView({ locale }: GenresViewProps) {
  const PUBLISHING_BOOKS = useCatalogBooks()
  const isRtl = locale === "ar"

  const genresList = [
    {
      id: "mystery",
      nameAr: "أدب الغموض والتحقيق",
      nameEn: "Mystery & Investigation",
      icon: "fingerprint",
      count: 14,
      descAr: "شفرات أندلسية، تحقيقات معقدة، ومخطوطات مفقودة تكشف أسراراً مدفونة منذ قرون.",
      descEn: "Cryptic codes, forensic investigations, and ancient lost manuscripts.",
      bgGradient: "from-amber-950/40 via-card to-card",
      borderGlow: "hover:border-[#e6c184]",
    },
    {
      id: "historical",
      nameAr: "السرد التاريخي والأندلسي",
      nameEn: "Historical Epics",
      icon: "account_balance",
      count: 22,
      descAr: "ملحميات بيت الحكمة، قرطبة، بغداد العباسية، وحكايات السلاطين والعلماء.",
      descEn: "House of Wisdom chronicles, ancient Baghdadi scribes, and royal courts.",
      bgGradient: "from-amber-900/30 via-card to-card",
      borderGlow: "hover:border-amber-400",
    },
    {
      id: "scifi",
      nameAr: "الخيال العلمي والآفاق السحيقة",
      nameEn: "Sci-Fi & Far Worlds",
      icon: "rocket_launch",
      count: 18,
      descAr: "سفن الفضاء المعتمة، حضارات الكواكب الزمردية، وأسفار ما وراء النجوم.",
      descEn: "Deep space voyages, cybernetic futures, and galactic civilizations.",
      bgGradient: "from-sky-950/40 via-card to-card",
      borderGlow: "hover:border-sky-400",
    },
    {
      id: "classics",
      nameAr: "ديوان الأدب الكلاسيكي الرفيع",
      nameEn: "Classical & High Literature",
      icon: "menu_book",
      count: 16,
      descAr: "نصوص رصينة بلغة عربية فصحى ساحرة، تأملات فلسفية وروايات نفسية عميقة.",
      descEn: "Profound philosophical reflections and eloquent literary masterpieces.",
      bgGradient: "from-purple-950/40 via-card to-card",
      borderGlow: "hover:border-purple-400",
    },
    {
      id: "adventure",
      nameAr: "المغامرات والرحلات الاستكشافية",
      nameEn: "Expeditions & Quests",
      icon: "explore",
      count: 12,
      descAr: "كنوز البحار السبعة، جبال الرماد، وقوافل المجهول عبر صحاري الربع الخالي.",
      descEn: "Seven seas treasures, forgotten ruins, and desert expeditions.",
      bgGradient: "from-emerald-950/40 via-card to-card",
      borderGlow: "hover:border-emerald-400",
    },
    {
      id: "drama",
      nameAr: "الدراما النفسية والاجتماعية",
      nameEn: "Psychological Drama",
      icon: "psychology",
      count: 15,
      descAr: "صراعات الضمير، متاهات الذاكرة، والعلاقات الإنسانية في تحولاتها الكبرى.",
      descEn: "Moral dilemmas, memory labyrinths, and poignant human journeys.",
      bgGradient: "from-rose-950/40 via-card to-card",
      borderGlow: "hover:border-rose-400",
    },
  ]

  const featuredCollections = [
    {
      titleAr: "دفاتر الموانئ المندثرة",
      titleEn: "Lost Harbor Chronicles",
      authorAr: "د. غسان الكيلاني",
      timeAr: "٣ روايات • ٨ ساعات استماع",
      badgeAr: "مجموعة محققة كاملة",
      descAr: "سلسلة ثلاثية توثق رحلات المراكب الشراعية العمانية نحو زنجبار والهند في القرن الثامن عشر.",
      books: PUBLISHING_BOOKS.filter(book=>book.ageGroup==="adults_18_plus" && bookGenre(book)==="mystery").slice(0,3),
    },
    {
      titleAr: "ثلاثيات السرد النفسي والذاكرة",
      titleEn: "Psychological Memory Trilogies",
      authorAr: "نخبة من الروائيين",
      timeAr: "٢ رواية • ٥ ساعات استماع",
      badgeAr: "حصري لـ StoryVerse",
      descAr: "دراسات سردية روائية تبحث في تشظي الهوية الحضرية بين عواصم الشرق والغرب.",
      books: PUBLISHING_BOOKS.filter(book=>book.ageGroup==="adults_18_plus" && bookGenre(book)==="historical").slice(0,3),
    },
  ]

  return (
    <div className="w-full bg-[#10131c] text-[#e0e2ef] min-h-screen py-10 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute -top-32 right-1/4 w-[600px] h-[600px] bg-[#e6c184]/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-96 left-[-100px] w-[500px] h-[500px] bg-indigo-950/20 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-[1280px] w-full mx-auto px-4 sm:px-6 relative z-10 space-y-12">
        {/* Breadcrumb Navigation */}
        <nav className="flex flex-wrap items-center justify-between gap-4 text-xs font-bold text-[#d1c5b5]">
          <div className="flex items-center gap-2 bg-[#181b25] px-4 py-2 rounded-xl border border-[#4e463a]/30">
            <Link href={`/${locale}`} className="hover:text-[#e6c184] transition-colors">
              {isRtl ? "المكتبة العامة (+١٨)" : "Public Library"}
            </Link>
            <span className="text-[#4e463a]">/</span>
            <span className="text-[#e6c184]">{isRtl ? "استكشاف الأنواع الأدبية" : "Literary Genres"}</span>
          </div>

          <Link
            href={`/${locale}/books`}
            className="inline-flex items-center gap-2 text-xs font-bold text-[#e6c184] hover:text-[#ffdeaa] transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">
              {isRtl ? "arrow_forward" : "arrow_back"}
            </span>
            <span>{isRtl ? "العودة إلى المعرض الكامل" : "Back to Full Catalog"}</span>
          </Link>
        </nav>

        {/* Header Statement */}
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1c1f29] border border-[#4e463a]/40 text-[#e6c184] text-xs font-bold">
            <span className="material-symbols-outlined text-[16px]">category</span>
            <span>{isRtl ? "فهرس التصنيفات والأروقة الأدبية" : "Editorial Taxonomy & Archives"}</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-black text-[#e0e2ef] tracking-tight">
            {isRtl ? "أنواع الحكايات وروافد السرد" : "Story Realms & Literary Genres"}
          </h1>
          <p className="text-xs sm:text-sm text-[#d1c5b5] leading-relaxed">
            {isRtl
              ? "بوابات العبور إلى أزمنة وعوالم متوازية. اختر التصنيف الأدبي لتصفح الأعمال المحققة والروايات الصوتية المشفرة بتقنية البث السيادي."
              : "Portals to parallel eras and untold chronicles. Select a genre to discover deluxe physical editions and encrypted DRM audiobooks."}
          </p>
        </div>

        {/* 6 Key Genre Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {genresList.map((genre) => (
            <Link
              key={genre.id}
              href={`/${locale}/books?genre=${genre.id}`}
              className={`group p-6 rounded-2xl bg-[#1c1f29] border border-[#4e463a]/40 ${genre.borderGlow} transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 flex flex-col justify-between min-h-[220px] relative overflow-hidden`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-[#272a33] text-[#e6c184] flex items-center justify-center border border-[#4e463a]/40">
                    <span className="material-symbols-outlined text-[24px]">{genre.icon}</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-[#272a33] text-[#e6c184] text-[11px] font-mono font-bold">
                    {PUBLISHING_BOOKS.filter(book=>book.ageGroup==="adults_18_plus" && bookGenre(book)===genre.id).length} {isRtl ? "عمل" : "works"}
                  </span>
                </div>

                <h3 className="font-serif text-lg font-black text-[#e0e2ef] group-hover:text-[#e6c184] transition-colors">
                  {isRtl ? genre.nameAr : genre.nameEn}
                </h3>
                <p className="text-xs text-[#d1c5b5] leading-relaxed line-clamp-3">
                  {isRtl ? genre.descAr : genre.descEn}
                </p>
              </div>

              <div className="pt-4 flex items-center gap-1.5 text-xs font-bold text-[#e6c184]">
                <span>{isRtl ? "استكشف الأعمال" : "Explore Works"}</span>
                <span className="material-symbols-outlined text-[16px] group-hover:-translate-x-1 transition-transform">
                  {isRtl ? "arrow_back" : "arrow_forward"}
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Curated Adult Collections (+18) matching Stitch p04_base_1440 */}
        <div className="pt-8 space-y-6">
          <div className="flex items-baseline justify-between border-b border-[#4e463a]/30 pb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#e6c184]" />
                <h2 className="font-serif text-2xl font-black text-[#e0e2ef]">
                  {isRtl ? "مختارات المجموعات الأدبية الخاصة (+١٨)" : "Curated Literary Collections (18+)"}
                </h2>
              </div>
              <p className="text-xs text-[#d1c5b5]">
                {isRtl
                  ? "سلاسل روائية مكتملة مع ملاحق صوتية وخرائط جغرافية موثقة."
                  : "Complete novel series with archival audio companions and cartographic appendices."}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {featuredCollections.map((col, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-[#1c1f29] border border-[#4e463a]/40 space-y-4 shadow-xl"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-[#e6c184]/15 text-[#e6c184] border border-[#e6c184]/30">
                    {col.badgeAr}
                  </span>
                  <span className="text-xs text-[#d1c5b5] font-mono">{col.timeAr}</span>
                </div>

                <div>
                  <h3 className="font-serif text-xl font-black text-[#e0e2ef]">{col.titleAr}</h3>
                  <span className="text-xs text-[#e6c184] block mt-1">إشراف: {col.authorAr}</span>
                  <p className="text-xs text-[#d1c5b5] mt-2 leading-relaxed">{col.descAr}</p>
                </div>

                <div className="grid grid-cols-3 gap-3 pt-2">
                  {col.books.map((book) => (
                    <Link
                      key={book.id}
                      href={`/${locale}/books/${book.handle}`}
                      className="group flex flex-col items-center text-center space-y-1.5"
                    >
                      <div className="relative aspect-[2/3] w-full rounded-xl overflow-hidden border border-[#4e463a]/40 group-hover:border-[#e6c184] transition-all">
                        <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover" />
                      </div>
                      <span className="text-[11px] font-bold text-[#e0e2ef] line-clamp-1 group-hover:text-[#e6c184] transition-colors">
                        {book.title}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
