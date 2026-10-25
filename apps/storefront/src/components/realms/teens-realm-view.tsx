"use client"

import React from "react"
import Link from "next/link"
import { PUBLISHING_BOOKS } from "@/lib/books-data"

type TeensRealmViewProps = {
  locale: "ar" | "en"
}

export function TeensRealmView({ locale }: TeensRealmViewProps) {
  const isRtl = locale === "ar"
  const teenBooks = PUBLISHING_BOOKS.filter((b) => b.ageGroup === "teens_13_17" || b.id === "book_alhambra_05")

  return (
    <div className="min-h-screen bg-[#0e111a] text-[#e0e2ef] py-10 relative overflow-hidden">
      {/* Neon Purple & Cyan glow */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-96 left-[-100px] w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-[1280px] w-full mx-auto px-4 sm:px-6 relative z-10 space-y-12">
        {/* Sub-Header Contextual Bar (Matching Stitch t01_base_1440) */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-3 rounded-2xl bg-[#161a26]/80 border border-purple-500/30 text-xs backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-ping" />
            <span className="font-bold text-purple-300">
              {isRtl ? "رواق اليافعين والناشئة (13 - 17 سنة) • مدار الزجاج" : "Teens Realm (13-17) • Glass Orbit"}
            </span>
            <span className="text-[#4e463a]">|</span>
            <span className="text-[#a5a7b7]">{isRtl ? "محتوى آمن معتمد للشباب" : "Certified Young Adult"}</span>
          </div>

          <Link
            href={`/${locale}/books?age=teens_13_17`}
            className="text-purple-400 hover:text-purple-300 font-bold flex items-center gap-1"
          >
            <span>{isRtl ? "عرض كافة روايات اليافعين" : "View All Teen Titles"}</span>
            <span className="material-symbols-outlined text-[16px]">arrow_left_alt</span>
          </Link>
        </div>

        {/* Hero Spotlight: «مدار الزجاج» (Stitch t01_base_1440) */}
        <div className="relative rounded-3xl bg-gradient-to-r from-purple-950/50 via-[#1c1f29] to-[#1c1f29] border border-purple-500/40 p-6 sm:p-10 shadow-2xl overflow-hidden">
          <div className="flex flex-col lg:flex-row items-center gap-10">
            <div className="relative w-52 sm:w-64 aspect-[2/3] shrink-0 rounded-2xl overflow-hidden shadow-2xl border border-purple-500/40 group">
              <img
                src={teenBooks[0]?.coverUrl || "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&q=80"}
                alt="مدار الزجاج"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 start-3">
                <span className="px-3 py-1 rounded-full bg-purple-600/90 text-white font-mono text-[10px] font-bold">
                  سلسلة مدار الزجاج #١
                </span>
              </div>
            </div>

            <div className="flex-1 space-y-4 text-start">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-purple-400 text-[20px]">bolt</span>
                <span className="text-purple-400 font-mono text-xs font-bold tracking-wider uppercase">
                  {isRtl ? "العمل الرئيسي لشهر أكتوبر في صالون اليافعين" : "Featured YA Masterpiece"}
                </span>
              </div>

              <h1 className="font-serif text-3xl sm:text-5xl font-black text-[#e0e2ef]">
                «مدار الزجاج» — شيفرة المحطة المدارية
              </h1>

              <p className="text-xs sm:text-sm text-[#d1c5b5] leading-relaxed max-w-2xl font-serif">
                «حين انقطعت إشارات البث عن محطة الزجاج المعلقة فوق سماء البحر الميت، اكتشف فريق من طلاب الأكاديمية العلمية أن الإشارات لم تتوقف بسبب عاصفة شمسية، بل لأن كائناً رقمياً ذكياً كان يحاول التواصل باللغة العربية القديمة.»
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href={`/${locale}/books/${teenBooks[0]?.handle || "alhambra-code-andalusian-manuscript"}`}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-purple-600 text-white font-black text-xs sm:text-sm shadow-lg shadow-purple-600/25 hover:bg-purple-500 transition-all transform hover:-translate-y-0.5"
                >
                  <span className="material-symbols-outlined text-[20px]">menu_book</span>
                  <span>{isRtl ? "ابدأ قراءة الفصل الأول" : "Read Chapter 1"}</span>
                </Link>

                <Link
                  href={`/${locale}/player/${teenBooks[0]?.handle || "alhambra-code-andalusian-manuscript"}`}
                  className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-[#272a33] text-[#e0e2ef] hover:bg-[#32343e] border border-purple-500/40 font-bold text-xs sm:text-sm transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px] text-purple-400">headphones</span>
                  <span>{isRtl ? "استمع للأداء الدرامي الصوتي" : "Play Audio Drama"}</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Interactive Decision Pathways (Stitch t01) */}
        <div className="space-y-6">
          <div className="flex items-baseline justify-between border-b border-[#4e463a]/30 pb-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-sm bg-purple-500" />
              <h2 className="font-serif text-2xl font-black text-[#e0e2ef]">
                {isRtl ? "مسارات السرد التفاعلي وقصص الاختيار" : "Interactive Branching Novels"}
              </h2>
            </div>
            <span className="text-xs text-[#d1c5b5]">{isRtl ? "قراراتك تغير نهاية الرواية" : "Choose your path"}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {teenBooks.map((book) => (
              <div
                key={book.id}
                className="group p-5 rounded-2xl bg-[#1c1f29] border border-purple-500/20 hover:border-purple-500/70 transition-all hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between space-y-4"
              >
                <div className="flex gap-4">
                  <div className="relative w-24 aspect-[2/3] shrink-0 rounded-xl overflow-hidden border border-purple-500/30">
                    <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="space-y-1.5 text-start">
                    <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono text-[10px] font-bold">
                      ١٣ - ١٧ سنة
                    </span>
                    <h3 className="font-serif text-sm font-black text-[#e0e2ef] group-hover:text-purple-400 transition-colors line-clamp-2">
                      {book.title}
                    </h3>
                    <p className="text-xs text-[#a5a7b7] line-clamp-2">{book.description}</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#4e463a]/30 flex items-center justify-between">
                  <span className="text-xs font-bold text-[#e6c184]">
                    {(book.ebookPrice / 100).toFixed(0)} {isRtl ? "ر.س" : "SAR"}
                  </span>
                  <Link
                    href={`/${locale}/books/${book.handle}`}
                    className="text-xs font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1"
                  >
                    <span>دخول الرواية</span>
                    <span className="material-symbols-outlined text-[14px]">arrow_left_alt</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
