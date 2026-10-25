"use client"

import React from "react"
import Link from "next/link"
import { PUBLISHING_BOOKS } from "@/lib/books-data"

type KidsRealmViewProps = {
  locale: "ar" | "en"
}

export function KidsRealmView({ locale }: KidsRealmViewProps) {
  const isRtl = locale === "ar"
  const kidsBooks = PUBLISHING_BOOKS.filter((b) => b.ageGroup === "kids_7_12")

  return (
    <div className="min-h-screen bg-[#0d1615] text-[#e0e2ef] py-10 relative overflow-hidden">
      {/* Emerald & Cyan glow */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-emerald-600/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-96 left-[-100px] w-[500px] h-[500px] bg-teal-600/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-[1280px] w-full mx-auto px-4 sm:px-6 relative z-10 space-y-12">
        {/* Sub-Header Contextual Bar (Matching Stitch k01_base_1440) */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-3 rounded-2xl bg-[#142321]/80 border border-emerald-500/30 text-xs backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold text-emerald-300">
              {isRtl ? "كوكب الاستكشاف والناشئة (7 - 12 سنة) • حارس المنارة" : "Kids Explorers (7-12) • Lighthouse Keeper"}
            </span>
            <span className="text-[#4e463a]">|</span>
            <span className="text-[#a5a7b7]">{isRtl ? "محتوى آمن 100% مع تشكيل الكلمات" : "100% Safe Kids Filter"}</span>
          </div>

          <Link
            href={`/${locale}/books?age=kids_7_12`}
            className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1"
          >
            <span>{isRtl ? "تصفح كل مغامرات الناشئة" : "View All Kids Adventures"}</span>
            <span className="material-symbols-outlined text-[16px]">arrow_left_alt</span>
          </Link>
        </div>

        {/* Hero Spotlight: «حارس المنارة وسفينة الفضاء» (Stitch k01_base_1440) */}
        <div className="relative rounded-3xl bg-gradient-to-r from-emerald-950/50 via-[#1c1f29] to-[#1c1f29] border border-emerald-500/40 p-6 sm:p-10 shadow-2xl overflow-hidden">
          <div className="flex flex-col lg:flex-row items-center gap-10">
            <div className="relative w-52 sm:w-64 aspect-[2/3] shrink-0 rounded-2xl overflow-hidden shadow-2xl border border-emerald-500/40 group">
              <img
                src={kidsBooks[0]?.coverUrl || "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80"}
                alt="حارس المنارة"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 start-3">
                <span className="px-3 py-1 rounded-full bg-emerald-600/90 text-white font-mono text-[10px] font-bold">
                  مغامرة الناشئة الكبرى
                </span>
              </div>
            </div>

            <div className="flex-1 space-y-4 text-start">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-emerald-400 text-[20px]">explore</span>
                <span className="text-emerald-400 font-mono text-xs font-bold tracking-wider uppercase">
                  {isRtl ? "القصة الأكثر إلهاماً هذا الشهر" : "Heroic Quest of the Month"}
                </span>
              </div>

              <h1 className="font-serif text-3xl sm:text-5xl font-black text-[#e0e2ef]">
                حارس المنارة وسفينة الفضاء الزمردية
              </h1>

              <p className="text-xs sm:text-sm text-[#d1c5b5] leading-relaxed max-w-2xl font-serif">
                «في ليلة ضبابية على شاطئ رأس الحد، لاحظ مروان أن ضوء المنارة القديمة تحول إلى اللون الأخضر الزمردي الغريب. وحين تسلق الدرج الحلزوني، وجد سفينة صغيرة طافية في الهواء تطلب المساعدة لإنقاذ مجرة الدرب التبانة!»
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href={`/${locale}/books/${kidsBooks[0]?.handle || "secret-spaceship-emerald-planet"}`}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 text-white font-black text-xs sm:text-sm shadow-lg shadow-emerald-600/25 hover:bg-emerald-500 transition-all transform hover:-translate-y-0.5"
                >
                  <span className="material-symbols-outlined text-[20px]">auto_stories</span>
                  <span>{isRtl ? "ابدأ قراءة القصة المصورة" : "Read Illustrated Book"}</span>
                </Link>

                <Link
                  href={`/${locale}/player/${kidsBooks[0]?.handle || "secret-spaceship-emerald-planet"}`}
                  className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-[#272a33] text-[#e0e2ef] hover:bg-[#32343e] border border-emerald-500/40 font-bold text-xs sm:text-sm transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px] text-emerald-400">headphones</span>
                  <span>{isRtl ? "استمع مع المؤثرات الصوتية" : "Listen with Sound FX"}</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Kids Book Quests Grid */}
        <div className="space-y-6">
          <div className="flex items-baseline justify-between border-b border-[#4e463a]/30 pb-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-sm bg-emerald-400" />
              <h2 className="font-serif text-2xl font-black text-[#e0e2ef]">
                {isRtl ? "أحدث قصص وروايات كوكب الاستكشاف" : "Latest Kids Explorer Tales"}
              </h2>
            </div>
            <span className="text-xs text-[#d1c5b5]">{isRtl ? "قصص مصورة ومسموعة بالكامل" : "Illustrated & Audio"}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {kidsBooks.map((book) => (
              <div
                key={book.id}
                className="group p-5 rounded-2xl bg-[#1c1f29] border border-emerald-500/20 hover:border-emerald-500/70 transition-all hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between space-y-4"
              >
                <div className="flex gap-4">
                  <div className="relative w-24 aspect-[2/3] shrink-0 rounded-xl overflow-hidden border border-emerald-500/30">
                    <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="space-y-1.5 text-start">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold">
                      ٧ - ١٢ سنة
                    </span>
                    <h3 className="font-serif text-sm font-black text-[#e0e2ef] group-hover:text-emerald-400 transition-colors line-clamp-2">
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
                    className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                  >
                    <span>فتح المغامرة</span>
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
