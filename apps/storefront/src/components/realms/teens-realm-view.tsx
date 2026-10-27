"use client"
import {PublishedShelf} from "@/components/realms/published-shelf"
import { useCatalogBooks } from "@/context/catalog-context"

import React, { useState } from "react"
import Link from "@/components/common/realm-link"
import { PUBLISHING_BOOKS } from "@/lib/books-data"
import { useRouter } from "next/navigation"
import { useReadingState } from "@/context/reading-state-context"


type TeensRealmViewProps = {
  locale: "ar" | "en"
}

export function TeensRealmView({ locale }: TeensRealmViewProps) {
  const PUBLISHING_BOOKS = useCatalogBooks()
  const publishedBooks = useCatalogBooks()
  const isRtl = locale === "ar"
  const router = useRouter()
  const {state,updateEntry} = useReadingState()
  const featured=PUBLISHING_BOOKS.find(book=>book.id==="book_teens_01")!
  const progress=state.teens.entries.book_teens_01?Math.round(((state.teens.entries.book_teens_01.furthest||0)+1)/(featured?.sampleText.length || 1)*100):0
  const completed=Object.values(state.teens.entries).filter(entry=>entry.completed).length
  const reading=Object.values(state.teens.entries).filter(entry=>entry.page!==undefined).length
  const inLibrary = !!state.teens.entries.book_teens_01?.saved
  const setInLibrary = (saved:boolean) => updateEntry("teens","book_teens_01",{saved})
  const handlePlayTeensIntro = () => router.push(`/${locale}/realms/teens/player/book_teens_01`)

  if (!publishedBooks.some(book=>book.id==="book_teens_01")) return <PublishedShelf realm="teens" locale={locale}/>
  return (
    <div className="w-full min-h-screen bg-[#FAF8FF] text-[#101542] py-6 sm:py-10 relative overflow-hidden font-sans">
      {/* Cosmic Indigo & Lavender background ambient glows */}
      <div className="absolute -top-40 right-1/4 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-96 left-[-100px] w-[500px] h-[500px] bg-sky-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col gap-8">
        {/* Sub-Header Status Contextual Bar (Stitch T01) */}
        <div className="w-full bg-white/80 backdrop-blur-md rounded-2xl border border-indigo-100 p-4 shadow-sm flex flex-wrap items-center justify-between gap-4">
          {/* Breadcrumb & Private Tag */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-500">{isRtl ? "الرئيسية" : "Home"}</span>
            <span className="text-slate-400">/</span>
            <span className="text-indigo-900 font-bold">
              {isRtl ? "عالم الناشئة (١٣–١٧ سنة)" : "Teens Realm (Ages 13-17)"}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-900 font-semibold border border-indigo-100 mr-2">
              <span className="material-symbols-outlined text-[14px] text-indigo-600">lock</span>
              <span>{isRtl ? "مطالعتك الخاصة على هذا الجهاز" : "Your private reading on this device"}</span>
            </span>
          </div>

          {/* Quick Action / Guardian Link */}
          <div className="flex items-center gap-3">
            <Link
              href={`/${locale}/family-hub`}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-all border border-slate-200"
            >
              <span className="material-symbols-outlined text-[16px] text-indigo-600">tune</span>
              <span>{isRtl ? "إعدادات ولي الأمر (F11)" : "Guardian Settings"}</span>
            </Link>
            <Link
              href={`/${locale}/books?age=teens_13_17`}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-900 hover:bg-indigo-950 text-white text-xs font-bold transition-all shadow-sm"
            >
              <span>{isRtl ? "كل روايات اليافعين" : "All YA Titles"}</span>
              <span className="material-symbols-outlined text-[14px] rtl:rotate-180">arrow_forward</span>
            </Link>
          </div>
        </div>

        {/* Active Resume Strip (Stitch T01) */}
        <section className="w-full relative overflow-hidden rounded-2xl bg-white border border-indigo-100 shadow-sm p-4 sm:p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            {/* Bookmark detail */}
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-12 h-12 rounded-xl bg-indigo-900 text-white flex items-center justify-center shrink-0 shadow-inner">
                <span className="material-symbols-outlined text-[24px]">bookmark</span>
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-2 text-indigo-700 text-xs font-bold">
                  <span className="inline-block w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
                  <span>{isRtl ? "مكان توقفك الأخير" : "Your Last Reading Spot"}</span>
                </div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900 truncate mt-0.5">
                  {isRtl
                    ? "مدار الزجاج — النص المتاح للقراءة"
                    : "Glass Orbit — available reading text"}
                </h2>
                <p className="text-xs text-slate-500">
                  {isRtl ? `تقدم ${progress}% في النص المتاح` : `${progress}% of available text`}
                </p>
              </div>
            </div>

            {/* Progress bar & CTA */}
            <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end shrink-0">
              <div className="flex items-center gap-2 w-32 sm:w-40">
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200">
                  <div className="bg-indigo-600 h-full rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
                </div>
                <span className="text-xs font-mono font-bold text-slate-600">{progress}%</span>
              </div>
              <Link
                href={`/${locale}/reader/book_teens_01`}
                className="inline-flex items-center justify-center gap-2 h-11 px-5 rounded-xl bg-indigo-900 text-white hover:bg-indigo-800 text-xs sm:text-sm font-bold shadow-sm transition-all transform active:scale-95 shrink-0"
              >
                <span>{isRtl ? "استئناف القراءة فوراً (T04)" : "Resume Reading (T04)"}</span>
                <span className="material-symbols-outlined text-[18px]">play_arrow</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Featured Hero Showcase (Stitch T01) */}
        <section className="w-full rounded-3xl bg-white border border-indigo-100 shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-stretch">
            {/* Right Column: Narrative Hook & Literary Excerpt (7 cols) */}
            <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between gap-6">
              <div className="flex flex-col gap-4">
                {/* Curatorial Badge */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-100 text-indigo-900 text-xs font-bold">
                    <span className="material-symbols-outlined text-[15px] text-indigo-700">auto_awesome</span>
                    <span>{isRtl ? "العمل المميز لهذا الأسبوع • خيال علمي وألغاز" : "Featured YA Work • Sci-Fi & Mystery"}</span>
                  </span>
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
                    <span className="material-symbols-outlined text-[14px]">headphones</span>
                    <span>{isRtl ? "متوفر نصاً وصوتاً" : "Text & Audio"}</span>
                  </span>
                </div>

                {/* Title & Metadata */}
                <div>
                  <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                    {isRtl ? "«مدار الزجاج»" : "“Glass Orbit”"}
                  </h1>
                  <p className="text-xs sm:text-sm text-indigo-700 font-semibold mt-1.5">
                    {isRtl
                      ? "تأليف: د. سليم العمري • رسوم: استوديو الفلك الحديث"
                      : "By: Dr. Salim Al-Omari • Art: Modern Astronomy Studio"}
                  </p>
                </div>

                {/* Meta details pill list */}
                <div className="flex flex-wrap items-center gap-y-2 gap-x-4 py-1 text-slate-600 text-xs">
                  <span className="inline-flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px] text-indigo-600">menu_book</span>
                    <span>{isRtl ? `${featured.sampleText.length} مقاطع متاحة` : `${featured.sampleText.length} sections available`}</span>
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="inline-flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px] text-indigo-600">schedule</span>
                    <span>{isRtl ? "مدة القراءة التقديرية ١ ساعة و٢٠ دقيقة" : "Est. Reading 1h 20m"}</span>
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="inline-flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px] text-indigo-600">graphic_eq</span>
                    <span>{isRtl ? "تسجيل صوتي فصيح ونقي" : "High-Fidelity Audio"}</span>
                  </span>
                </div>

                {/* Advisory Callout */}
                <div className="p-3.5 px-4 rounded-xl bg-indigo-50/60 border border-indigo-100 text-indigo-900 flex items-center gap-3">
                  <span className="material-symbols-outlined text-indigo-600 text-[20px] shrink-0">info</span>
                  <span className="text-xs leading-relaxed font-medium">
                    {isRtl
                      ? "تصنيف الفئة: ١٣–١٧ عاماً • استكشاف علمي هادئ وتفكير تحليلي خالٍ من العنف أو المحتوى غير الملائم."
                      : "Audience: 13-17 • Deep intellectual mystery & critical thinking free from violence or inappropriate content."}
                  </span>
                </div>

                {/* Literary Prose Excerpt */}
                <div className="relative mt-1 p-5 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="absolute top-2 right-2 text-indigo-200 font-serif text-5xl leading-none select-none">
                    “
                  </span>
                  <blockquote className="text-xs sm:text-sm text-slate-800 leading-relaxed relative z-10 pt-2 text-justify font-serif">
                    {isRtl
                      ? "«لم تكن ليان تنتظر رسالة من المرصد المهجور. كانت تصلح عدسة صغيرة حين أضاء الجهاز بإشارة تتكرر كل سبع ثوانٍ. كتبت الأرقام في دفترها، ثم قارنتها بخريطة النجوم المعلقة فوق المكتب... ظهر اختلاف واحد: نقطة ضوء على طرف المدار تتحرك في الاتجاه المعاكس.»"
                      : "“Layan had never expected a transmission from the abandoned mountaintop observatory. She was calibrating a small telescope lens when the receiver flashed with a signal repeating every seven seconds. She jotted down the coordinates in her notebook, comparing them with the celestial chart above her desk... One anomaly appeared: a speck of light at the rim of the orbit moving in reverse.”"}
                  </blockquote>
                </div>
              </div>

              {/* CTA Actions */}
              <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-slate-100">
                <Link
                  href={`/${locale}/reader/book_teens_01`}
                  className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-xl bg-indigo-900 text-white hover:bg-indigo-950 font-bold text-xs sm:text-sm shadow-md transition-all transform active:scale-95"
                >
                  <span>{isRtl ? "بدء قراءة الفصل الأول: الإشارة الأولى (T03)" : "Start Reading Chapter 1 (T03)"}</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </Link>

                <button
                  type="button"
                  onClick={() => setInLibrary(!inLibrary)}
                  className={`inline-flex items-center justify-center gap-2 h-12 px-5 rounded-xl border transition-colors text-xs font-bold ${
                    inLibrary
                      ? "bg-indigo-50 border-indigo-300 text-indigo-700"
                      : "bg-white border-slate-200 hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  <span
                    className="material-symbols-outlined text-[18px]"
                    style={{ fontVariationSettings: inLibrary ? "'FILL' 1" : "'FILL' 0" }}
                  >
                    library_add
                  </span>
                  <span>
                    {inLibrary
                      ? isRtl
                        ? "موجودة في مكتبتي ✓"
                        : "In My Library ✓"
                      : isRtl
                      ? "إضافة إلى رفوف مكتبتي (T05)"
                      : "Add to My Shelf (T05)"}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={handlePlayTeensIntro}
                  className="inline-flex items-center justify-center gap-1.5 h-12 px-4 rounded-xl hover:bg-indigo-50 text-indigo-700 font-bold text-xs transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {false ? "pause_circle" : "play_circle"}
                  </span>
                  <span>{isRtl ? "استماع للمقدمة الصوتية" : "Audio Intro"}</span>
                </button>
              </div>
            </div>

            {/* Left Column: Artwork Canvas (5 cols) */}
            <div className="lg:col-span-5 relative min-h-[380px] lg:min-h-full overflow-hidden bg-slate-900">
              <img
                className="w-full h-full object-cover mix-blend-luminosity opacity-90 hover:scale-105 transition-transform duration-700"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCCzWZmdAsxHu_XMCuHGb1A6eHkLTKNxXnW5NJrlt7AlqDemw-shiYKS-852XpBtT_50ElkJcb94LBGe8FLWecnWyh-nIjaLjmxLeTh7hW0bVxGNUVMMVhjq8B2DWSa0sMUPEZWS7UXlqSRroV7H46MCGZWH4P4x_mw8QBPGy50Si2edj6ma8ZexdNO1lRp_TLqJv02kDdibOZaiMDBb8SUYmhGVFzDm0tO7Kd12E1pPByyOVvXflPe"
                alt="مدار الزجاج"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

              {/* Floating Editorial Metadata Overlay */}
              <div className="absolute bottom-6 right-6 left-6 p-4 rounded-2xl bg-black/60 backdrop-blur-md text-white border border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
                    <span className="text-xs font-bold text-cyan-200">
                      {isRtl ? "رواية الغلاف المعتمدة • إصدار جديد" : "Official Cover Story • New Edition"}
                    </span>
                  </div>
                  <span className="text-xs font-mono opacity-80">ISSUE #24</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Shelf 1: سلاسل الاستكشاف والغموض العلمي (Stitch T01) */}
        <section className="space-y-6">
          <div className="flex items-end justify-between">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-indigo-700 text-xs font-bold">
                <span className="material-symbols-outlined text-[18px]">satellite_alt</span>
                <span>{isRtl ? "العلوم والاستكشاف المعرفي" : "Science & Intellectual Exploration"}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {isRtl ? "سلاسل الاستكشاف والغموض العلمي" : "Scientific Exploration & Mystery"}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                {isRtl
                  ? "روايات تحفز الفضول والتفكير النقدي المستقل دون صخب"
                  : "Novels sparking curiosity and independent critical thinking without noise"}
              </p>
            </div>
            <Link
              href={`/${locale}/books?category=science_mystery`}
              className="text-xs font-bold text-indigo-700 hover:underline flex items-center gap-1"
            >
              <span>{isRtl ? "عرض جميع السلاسل (١٢)" : "View All (12)"}</span>
              <span className="material-symbols-outlined text-[16px] rtl:rotate-180">arrow_forward</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                id: "t_archive",
                titleAr: "«أرشيف الغد»",
                titleEn: "Archive of Tomorrow",
                tagAr: "استكشاف زمني",
                chaptersAr: "٦ فصول",
                timeAr: "٤٥ دقيقة",
                descAr: "رسائل مشفرة محفوظة في كبسولة زمنية تحت مكتبة قديمة تبوح بحقائق مذهلة عن مسار كوكب الأرض.",
                img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDbiaUOKgyrY5jo_owGDbhRE7kcbnqelPcwQeeifftdUGUcmkjJzg4jXQErHTWLyLJrl8DCiYh0JyAL7FzYMPXSP6IAnlP9haJqkYNUErDO8eqfaG1Gwyq_J1Ez7CiOdRRAAiMr8w3d0tuxPfLEXl7uLmOf9Uq8l1ljaUHMNlo-9QPjC1HTbO8wyJ0ZaB5Ao38zP3LtT3f09Ym2UF_u56cT334udQpjqLPt1e8vZVdPtxZY7p6IZUAz",
                path: "book_teens_02",
              },
              {
                id: "t_cipher",
                titleAr: "«شيفرة المرصد»",
                titleEn: "The Observatory Cipher",
                tagAr: "ألغاز فلكية",
                chaptersAr: "صوت + نص",
                timeAr: "٥٠ دقيقة",
                descAr: "مخطوطة مجهولة المصدر تقود ثلاثة زملاء في معهد الفلك إلى حل لغز تاريخي لم يُحل منذ قرن.",
                img: "https://lh3.googleusercontent.com/aida-public/AB6AXuA41QkZzjCoadIoyoJx3eDiZhLWP8TYs-BCdJ9njkbLsIiNz0Xg4jlt-WR_NJiQ-HpjonhoHD1iQ0XdrUgbu9jdufIZq9G1GMzKL3nQhb567Atc3nCskBLSfJ-6u2o75UUSYPhdTA8RZ0XJJrkLLTWB4qczKkMUiIQ4NiUXYpA-t8kFRv6DBGDZ4DWnKh9uAtDwBmkjeLcs7z-V0ef9qs9aVJ9gcJKLnB22Al36cdytsMhaAVbG62qD",
                path: "book_teens_03",
              },
              {
                id: "t_star",
                titleAr: "«رسائل إلى النجم البعيد»",
                titleEn: "Letters to the Distant Star",
                tagAr: "رحلة كونية هادئة",
                chaptersAr: "٤ فصول",
                timeAr: "٣٥ دقيقة",
                descAr: "يوميات فتاة تدون مشاعرها وأسئلتها حول معنى الحياة وترسلها عبر مسبار بحثي فضائي.",
                img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCqmkmk-Onb-Cl7zn1Ip8rayl_HUS8yf3LkwHibL0WpH1GUeZh9q49ZzzknCDrBvfPKM6EMnhJgvl4U6Ag_J8MCs5XrJT0_awhK75HGObA4U8eiF_EnsW2EuTM1iKAADCf4nGS6cmvFZSwz8WvZZZfhroUZPJa-ZT6iAx__7nWLeNtXDBpQQmmkxSDCLBe7xMyfzZcWitHvKnTaBS5VZLLY1tW1b8fWvb_E8Y38Cm4ddzTFPxmoES0w",
                path: "book_teens_04",
              },
              {
                id: "t_shadow_map",
                titleAr: "«خريطة الظل»",
                titleEn: "The Shadow Map",
                tagAr: "أسرار أثرية",
                chaptersAr: "٦ فصول",
                timeAr: "١ ساعة",
                descAr: "بحث أثري غير مسبوق في واحة معتمة تكشف عن مذكرات الرحالة الذين عبروا المسار السري.",
                img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAz3NCupVq4JGCJNkg8paa1R-wnRfi9PpjxlOICiwiffJIDKfWUTDvaJNiyRCk_bcjipBjp1wVMPS4CTlze557nOIi7fDW5tglwCm7Qbky1aZMMmvhtuX5bRXFShoDH4_ZUT_LvwUGwdCxnwrvPGMlPaSetJKkPpu7G_qnPxZOcnMeaCPmWjyRE9wUzP84zmccPzLwjtkxC2ntWlR-amvieWV97eJzbcEGrHaCvjhc1mbcasinywn7f",
                path: "book_teens_05",
              },
            ].map((book) => (
              <article
                key={book.id}
                className="flex flex-col rounded-2xl bg-white border border-indigo-100 shadow-sm hover:shadow-md transition-all duration-300 group overflow-hidden"
              >
                <div className="relative w-full aspect-[3/4] overflow-hidden bg-slate-900">
                  <img
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    src={book.img}
                    alt={book.titleAr}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <span className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-white/90 backdrop-blur-md text-indigo-900 text-xs font-bold shadow-sm">
                    {book.chaptersAr}
                  </span>
                  <div className="absolute bottom-3 right-3 left-3 text-white text-xs font-semibold">
                    {book.tagAr}
                  </div>
                </div>
                <div className="p-5 flex flex-col justify-between flex-1 gap-3">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-700 transition-colors">
                      {isRtl ? book.titleAr : book.titleEn}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {book.descAr}
                    </p>
                  </div>
                  <div className="pt-2 flex items-center justify-between mt-auto border-t border-slate-100">
                    <div className="flex items-center gap-1 text-slate-500 text-xs">
                      <span className="material-symbols-outlined text-[15px]">timer</span>
                      <span>{book.timeAr}</span>
                    </div>
                    <Link
                      href={`/${locale}/reader/${book.path}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-900 hover:text-white text-indigo-900 text-xs font-bold transition-colors"
                    >
                      <span>{isRtl ? "قراءة (T03)" : "Read (T03)"}</span>
                      <span className="material-symbols-outlined text-[14px] rtl:rotate-180">arrow_forward</span>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Shelf 2: عوالم خيالية ومغامرات هادئة (Asymmetric Mosaic - Stitch T01) */}
        <section className="space-y-6">
          <div className="flex items-end justify-between">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-indigo-700 text-xs font-bold">
                <span className="material-symbols-outlined text-[18px]">travel_explore</span>
                <span>{isRtl ? "أدب التخيل المعاصر" : "Contemporary Speculative Fiction"}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {isRtl ? "عوالم خيالية ومغامرات هادئة" : "Imaginative Realms & Gentle Quests"}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                {isRtl
                  ? "روايات قائمة على ابتكار الأفكار وبناء البيئات النظيفة دون مبالغات استعراضية"
                  : "Original world-building focused on thoughtful curiosity and clean narratives"}
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-900 text-xs font-bold">
              {isRtl ? "مختارات المنسق الأدبي" : "Curator's Choice"}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Large Speculative Anchor Card (7 cols) */}
            <article className="lg:col-span-7 flex flex-col md:flex-row rounded-3xl bg-white border border-indigo-100 shadow-sm hover:shadow-md transition-all overflow-hidden group">
              <div className="md:w-1/2 relative min-h-[260px] bg-slate-900 overflow-hidden shrink-0">
                <img
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDr68iFBY5TujRfJHN7NL_7BwLxwSnWL98LzoVwLp8-n1qrOtRMzap5cfLwWjSu-R-HbC_Mk73lOx8MqpiMQS_GTv7KwW2DZff1tMdzIvHJWCfGmTOHKZj0QlwevRfcFBvzBygrv-oy8i14-0ghDGu6mSY_DdnGksQ8jbHq7Y_qfSqXDCS3FyEFp7AVLFrA-1jQX2QCwgmCo6t1kRtpIvK6wBUvDjNwA_XD7YuHwud9LLSRI6zGY4oG"
                  alt="مدينة تحت السحاب"
                />
                <span className="absolute top-3 right-3 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-indigo-900 text-xs font-bold shadow-sm">
                  {isRtl ? "٧ فصول كاملة" : "7 Chapters"}
                </span>
              </div>
              <div className="p-6 sm:p-8 flex flex-col justify-between flex-1 gap-4">
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs font-bold text-indigo-700">
                    {isRtl ? "بناء عوالم خيالية مبتكرة" : "Innovative World-building"}
                  </span>
                  <h3 className="text-2xl font-black text-slate-900 group-hover:text-indigo-700 transition-colors">
                    {isRtl ? "«مدينة تحت السحاب»" : "“A City Beneath the Clouds”"}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {isRtl
                      ? "في مرتفعات جبلية نائية، يكتشف مجموعة من الطلبة المعماريين بقايا مجتمع اعتمد على الطاقة النظيفة واستخراج الماء من الندى، لتبدأ رحلة فهم مخططات البقاء."
                      : "In secluded mountain terraces, architecture students uncover the relics of a society powered purely by dew harvesting and clean energy, decoding ancient survival blueprints."}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="material-symbols-outlined text-[16px] text-indigo-600">schedule</span>
                    <span>{isRtl ? "١ س و١٥ د" : "1h 15m"}</span>
                    <span>•</span>
                    <span>{isRtl ? "نص فصيح مصحح" : "Verified Classical Arabic"}</span>
                  </div>
                  <Link
                    href={`/${locale}/reader/book_teens_06`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-900 text-white hover:bg-indigo-950 text-xs font-bold shadow-sm transition-colors"
                  >
                    <span>{isRtl ? "قراءة (T03)" : "Read (T03)"}</span>
                    <span className="material-symbols-outlined text-[16px] rtl:rotate-180">arrow_forward</span>
                  </Link>
                </div>
              </div>
            </article>

            {/* Right Vertical Stack (5 cols) */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              {/* Sub Card 1 */}
              <article className="flex rounded-3xl bg-white border border-indigo-100 shadow-sm hover:shadow-md transition-all overflow-hidden group flex-1">
                <div className="w-32 sm:w-36 relative shrink-0 bg-slate-900">
                  <img
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBFs-isWJbG36umhk_-tiv0T8IQn_x-csBTMrmOG4c9_j0-EW9mWw33-RxtRzCJp2F2-rcM-uE6tQpTvN0lKnbyhhS3iBdY9RkJfqTYrGe4_yThZNZDMnEkTWyFPfDgIhSVevs5RvAMatPaiVVj3V9nP8JgUCdiare7ILdQkvS4nUYIGw3HqJQNrPnWZk_VWzo6mqp0lytf1FWk5KocS78G81vUm03OCyouqdWssnZWyqcUfCgef0YZ"
                    alt="وجوه من ورق"
                  />
                </div>
                <div className="p-5 flex flex-col justify-between flex-1 gap-2">
                  <div>
                    <span className="text-[11px] font-bold text-indigo-700">
                      {isRtl ? "أسرار المخطوطات القديمة" : "Ancient Manuscript Secrets"}
                    </span>
                    <h4 className="text-base font-bold text-slate-900 group-hover:text-indigo-700 transition-colors mt-0.5">
                      {isRtl ? "«وجوه من ورق»" : "“Faces of Paper”"}
                    </h4>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                      {isRtl
                        ? "حكايات غير مدونة يفكك شفرتها ناسخ شاب في أزقة مدينة الأندلس المفقودة."
                        : "Unrecorded chronicles decoded by an apprentice scribe in the forgotten corridors of Andalusia."}
                    </p>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <span className="text-[11px] text-slate-400">{isRtl ? "٥ فصول • ٤٠ دقيقة" : "5 Ch. • 40m"}</span>
                    <Link
                      href={`/${locale}/reader/book_teens_07`}
                      className="text-indigo-900 hover:text-indigo-700 font-bold text-xs inline-flex items-center gap-1"
                    >
                      <span>{isRtl ? "قراءة" : "Read"}</span>
                      <span className="material-symbols-outlined text-[14px] rtl:rotate-180">arrow_forward</span>
                    </Link>
                  </div>
                </div>
              </article>

              {/* Sub Card 2 */}
              <article className="flex rounded-3xl bg-white border border-indigo-100 shadow-sm hover:shadow-md transition-all overflow-hidden group flex-1">
                <div className="w-32 sm:w-36 relative shrink-0 bg-slate-900">
                  <img
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCOEflcQ-Xgb70gc1uBemsYljc65YiBaKzEGU6qhtrzSP16ZIu5KJ0QlOJrPrS4ZeEq8k14golpyl9Ef9JS_0kYg-WoETcj1FTHSHFgz1jlcfA09XbTjtLo1QNK_BQvqlFVeFUh_x151_Lvkcm_N0e5Yj_94aIYZt50r14JCzlePZU1OI4KcA_qCIcJnwdzz3Q3KciF-xVgSlnd10xCkmkQpsbJrlzrTvjbVV2Gg0Sth9FwJVmLNdm4"
                    alt="آخر قطار إلى الواحة"
                  />
                </div>
                <div className="p-5 flex flex-col justify-between flex-1 gap-2">
                  <div>
                    <span className="text-[11px] font-bold text-indigo-700">
                      {isRtl ? "رحلة استكشافية" : "Exploratory Journey"}
                    </span>
                    <h4 className="text-base font-bold text-slate-900 group-hover:text-indigo-700 transition-colors mt-0.5">
                      {isRtl ? "«آخر قطار إلى الواحة»" : "“Last Train to the Oasis”"}
                    </h4>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                      {isRtl
                        ? "رحلة قطار تمتد عبر مسارات مهجورة حيث كل محطة توقف تحمل رواية مختلفة لركابها."
                        : "A night train traversing abandoned desert rails where each stop unlocks a different story for its passengers."}
                    </p>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <span className="text-[11px] text-slate-400">{isRtl ? "٤ فصول • ٣٥ دقيقة" : "4 Ch. • 35m"}</span>
                    <Link
                      href={`/${locale}/reader/book_teens_08`}
                      className="text-indigo-900 hover:text-indigo-700 font-bold text-xs inline-flex items-center gap-1"
                    >
                      <span>{isRtl ? "قراءة" : "Read"}</span>
                      <span className="material-symbols-outlined text-[14px] rtl:rotate-180">arrow_forward</span>
                    </Link>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* Reading Habit & Intellectual Growth Tracker (Minimal SVG Metric - Stitch T01) */}
        <section className="w-full rounded-3xl bg-indigo-50/70 border border-indigo-100 p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-col gap-2 max-w-xl text-right">
            <div className="flex items-center gap-2 text-indigo-700">
              <span className="material-symbols-outlined text-[22px]">psychology</span>
              <span className="text-xs font-bold">
                {isRtl ? "تطور حصيلتك الأدبية والفكرية" : "Literary & Cognitive Growth"}
              </span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
              {isRtl ? "سجل إبحارك الفكري هذا الشهر" : "Your Intellectual Horizon This Month"}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {isRtl ? (
                <>
                  بدأت <strong className="text-indigo-900 font-bold">{reading} أعمال</strong>، وأتممت {completed} نصوص في هذه المنصة على هذا الجهاز.
                </>
              ) : (
                `You started ${reading} stories and completed ${completed} texts in this realm on this device.`
              )}
            </p>
          </div>

          {/* Clean Minimal SVG Metric Display */}
          <div className="flex items-center gap-8 shrink-0">
            <div className="flex flex-col items-center gap-1.5">
              <div className="relative w-24 h-24 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  {/* Background Circle */}
                  <path
                    className="text-indigo-200"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3.5"
                  />
                  {/* Progress Circle (78%) */}
                  <path
                    className="text-indigo-600"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeDasharray={`${progress}, 100`}
                    strokeLinecap="round"
                    strokeWidth="3.5"
                  />
                </svg>
                <span className="absolute text-lg font-bold text-slate-900 font-mono">{progress}%</span>
              </div>
              <span className="text-xs font-semibold text-slate-500">
                {isRtl ? "تقدم القراءة" : "Reading progress"}
              </span>
            </div>

            <div className="h-16 w-[1px] bg-indigo-200" />

            <div className="flex flex-col gap-1 text-right">
              <span className="text-xs text-slate-500 font-medium">
                {isRtl ? "المفردات المكتشفة" : "Discovered Vocabulary"}
              </span>
              <span className="text-2xl font-black text-indigo-900 font-mono">+٣٨ كلمة</span>
              <span className="text-xs text-indigo-700 font-bold">
                {isRtl ? "ضمن معجمك الخاص 📖" : "In your lexicon 📖"}
              </span>
            </div>
          </div>
        </section>

        {/* Reassurance Banner (Safety / Trust / Dignity - Stitch T01) */}
        <section className="w-full rounded-2xl bg-white border border-indigo-100 p-6 shadow-sm mb-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-right">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-2xl bg-indigo-100 text-indigo-800 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[24px]">verified_user</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
                <strong className="text-slate-900 font-bold">
                  {isRtl ? "بيئة قراءة خاصة ونقية:" : "Private, Pure Reading Sanctuary:"}
                </strong>{" "}
                {isRtl
                  ? "لا توجد شبكات تواصل مفتوحة، لا إعلانات تجارية، ولا خوارزميات إدمانية. جميع الروايات مفحوصة ومختارة بعناية لأعمار الناشئة مع مراعاة كاملة لسلامة الفكر واللغة."
                  : "No open social networks, no ads, and no addictive algorithms. Every title is curated for young adults upholding intellectual dignity."}
              </p>
            </div>
            <Link
              href={`/${locale}/about#pledge`}
              className="shrink-0 text-indigo-700 hover:text-indigo-900 text-xs font-bold transition-colors"
            >
              {isRtl ? "ميثاق الأمان الأدبي ←" : "Literary Safety Pledge ←"}
            </Link>
          </div>
        </section>
      </div>
      <PublishedShelf realm="teens" locale={locale}/>
    </div>
  )
}
