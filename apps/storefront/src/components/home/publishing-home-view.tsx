"use client"
import { useCatalogBooks } from "@/context/catalog-context"
import {NativeProductShelf} from "@/components/products/native-product-shelf"
import {PublishedShelf} from "@/components/realms/published-shelf"

import React, { useState } from "react"
import Link from "@/components/common/realm-link"
import { useRouter } from "next/navigation"
import { useReadingState } from "@/context/reading-state-context"


type PublishingHomeViewProps = {
  locale: "ar" | "en"
}

export function PublishingHomeView({ locale }: PublishingHomeViewProps) {
  const publishedBooks = useCatalogBooks()
  const isRtl = locale === "ar"
  const router = useRouter()
  const { state, updateEntry } = useReadingState()
  const aliases: Record<string,string> = { ash_maps_hero: "kharaet-al-ramad", city_between_pages: "city-between-pages", window_harbor: "window-on-the-harbour", hours_sand: "sand-hours-philosophical-solitude", heirs_sea: "heirs-of-the-sea" }
  const bookmarkedList = Object.fromEntries(Object.entries(aliases).map(([alias,id])=>[alias,!!state.originals.entries[id]?.saved]))
  const toggleBookmark = (alias:string,e:React.MouseEvent) => { e.preventDefault(); const id=aliases[alias] || alias.replaceAll("_","-"); updateEntry("originals",id,{saved:!state.originals.entries[id]?.saved}) }
  const handleHeroAudioPlay = (e:React.MouseEvent) => { e.preventDefault(); router.push(`/${locale}/player/kharaet-al-ramad`) }

  if (!publishedBooks.some(book=>book.id==="kharaet-al-ramad")) return <PublishedShelf realm="originals" locale={locale}/>
  return (
    <div className="w-full bg-[#10131c] text-[#e0e2ef] selection:bg-[#c8a56b] selection:text-[#533a0a]">
      {/* =========================================================================
          1. IMMERSIVE CINEMATIC HERO (Stitch P01: خرائط الرماد)
         ========================================================================= */}
      <section className="relative w-full -mt-20 overflow-hidden bg-[#0b0e17] border-b border-[#4e463a]/40">
        {/* Atmospheric Visual Backing */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-luminosity scale-105 transition-transform duration-1000 ease-out hover:scale-100"
          style={{
            backgroundImage:
              "url('https://lh3.googleusercontent.com/aida-public/AB6AXuB06F4O57ag02xQBM9cGtDYKXo0lQMYywpThdkD9VESWaMVglMPApb1mQSmU6dm4WP6_HAzS4mxKCDqBLePPLeEY3ysugMTcPqUDxKnoby4Cj_-JKyh-I9OH3qHVpOUXNrnUyQR7PlJKgOjfiCl3VipLcy5dkIGH05wK1HSMZu4yJ9RTUA3_d8NbFCFuDVmPhpsyExZtlsZfRO6o3ElY7tatNgkBep8fShB3h_pulgP2rFKbwgUriqO')",
          }}
        />

        {/* Scrim Gradients for Absolute Reading Clarity (RTL & Vertical) */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#10131c] via-[#10131c]/85 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-l from-[#10131c] via-[#10131c]/60 to-transparent" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#e6c184]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Content Sanctuary: Max Width 1280px */}
        <div className="relative max-w-[1280px] w-full mx-auto px-4 sm:px-6 lg:px-8 pt-36 pb-12 flex flex-col justify-end min-h-[640px]">
          {/* Editorial Metadata Strip */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#93000a]/20 text-[#ffb4ab] text-[11px] font-bold tracking-wider border border-[#ffb4ab]/30">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ffb4ab] animate-ping" />
              {isRtl ? "+١٨ محتوى للكبار" : "18+ Adult Content"}
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#272a33] text-[#e6c184] text-xs font-semibold">
              <span className="material-symbols-outlined text-[15px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                verified
              </span>
              {isRtl ? "معاينة للقراءة" : "Reading preview"}
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#272a33] text-[#d1c5b5] text-xs font-semibold">
              <span className="material-symbols-outlined text-[15px]">auto_stories</span>
              {isRtl ? "غموض وأرشيف تاريخي" : "Mystery & Archive"}
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#1c1f29] text-[#cdc6b8] text-xs font-semibold">
              <span className="material-symbols-outlined text-[15px]">timer</span>
              {isRtl ? "٣ مقاطع متاحة للقراءة" : "3 available reading sections"}
            </span>
          </div>

          {/* Main Headline & Subheading */}
          <div className="max-w-3xl mb-6">
            <p className="text-sm font-bold text-[#e6c184] tracking-widest mb-1.5 flex items-center gap-2">
              <span>{isRtl ? "العمل المميز لهذا الأسبوع" : "Featured Work of the Week"}</span>
              <span className="h-px w-12 bg-[#e6c184]/40 inline-block" />
              <span className="text-[#d1c5b5] text-xs font-medium">
                {isRtl ? "بقلم: كاتب تجريبي" : "By: Editorial Author"}
              </span>
            </p>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-black text-[#e0e2ef] tracking-tight mb-4">
              {isRtl ? "خرائط الرماد" : "Maps of Ash"}
            </h1>
            <p className="font-serif text-lg sm:text-xl text-[#d1c5b5] leading-relaxed max-w-2xl font-normal">
              {isRtl
                ? "«وقفت سلمى عند نافذة الأرشيف، تقلب ظرفاً وصل بعد غياب صاحبه بعشرين عاماً. لم يحمل الطابع تاريخاً واضحاً، لكن رائحة الملح بقيت عالقة بالورق. على ظهره خريطة لثلاثة شوارع وعبارة واحدة: ابدئي من المكان الذي لا يظهر في الصور.»"
                : "“Salma stood by the archive window, turning an envelope that arrived twenty years after its sender disappeared. The postmark bore no clear date, but the scent of sea salt clung to the paper.”"}
            </p>
          </div>

          {/* Interactive Call-to-Actions */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              href={`/${locale}/reader/kharaet-al-ramad`}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-[#e6c184] text-[#422c00] font-bold text-sm shadow-lg shadow-[#e6c184]/15 hover:bg-[#ffdeaa] transition-all transform hover:-translate-y-0.5"
            >
              <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                menu_book
              </span>
              <span>{isRtl ? "ابدأ قراءة الفصل الأول" : "Read Chapter One"}</span>
            </Link>

            <button
              onClick={handleHeroAudioPlay}
              type="button"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-[#1c1f29] text-[#e0e2ef] hover:bg-[#272a33] transition-colors font-bold text-sm border border-[#4e463a]/40 group"
            >
              <span className="material-symbols-outlined text-[20px] text-[#e6c184] group-hover:scale-110 transition-transform">
                headphones
              </span>
              <span>{isRtl ? "استمع للنص بصوت الجهاز" : "Listen to Studio Audio"}</span>
              <span className="text-[11px] px-2 py-0.5 rounded bg-[#32343e] text-[#e6c184] font-bold">
                {isRtl ? "النص المتاح" : "24 mins"}
              </span>
            </button>

            <button
              onClick={(e) => toggleBookmark("ash_maps_hero", e)}
              type="button"
              className={`inline-flex items-center gap-1.5 px-4 py-3 rounded-lg transition-colors text-xs font-bold ${
                bookmarkedList["ash_maps_hero"]
                  ? "text-[#e6c184] bg-[#e6c184]/10 border border-[#e6c184]/30"
                  : "text-[#d1c5b5] hover:text-[#e6c184]"
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">
                {bookmarkedList["ash_maps_hero"] ? "bookmark_added" : "bookmark_add"}
              </span>
              <span>
                {bookmarkedList["ash_maps_hero"]
                  ? isRtl
                    ? "تمت الإضافة للمكتبة"
                    : "Added to Library"
                  : isRtl
                  ? "إضافة إلى قائمة القراءة لاحقاً"
                  : "Add to Reading List"}
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. GUEST EXPERIENCE BAR (Stitch P01: No Forced Membership)
         ========================================================================= */}
      <section className="w-full bg-[#181b25] py-4 border-b border-[#4e463a]/30">
        <div className="max-w-[1280px] w-full mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#1c1f29] flex items-center justify-center text-[#e6c184] shrink-0 border border-[#4e463a]/40">
              <span className="material-symbols-outlined text-[20px]">lock_open</span>
            </div>
            <div>
              <p className="font-bold text-sm text-[#e0e2ef]">
                {isRtl
                  ? "أنت تتصفح كزائر ضيف في المكتبة العامة المفتوحة"
                  : "Browsing as an honored guest in the Open Public Folio"}
              </p>
              <p className="text-xs text-[#d1c5b5] mt-0.5">
                {isRtl
                  ? "الفصول التعريفية متاحة للمعاينة. الإصدارات الكاملة تتطلب شراءً أو اشتراكًا يغطي المحتوى."
                  : "All literary masterpieces are openly accessible without forced registration walls."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link
              href={`/${locale}/books`}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#1c1f29] text-[#e6c184] text-xs font-bold hover:bg-[#272a33] transition-colors border border-[#4e463a]/40"
            >
              <span>{isRtl ? "اكتشف الكتالوج الكامل" : "Explore Full Catalog"}</span>
              <span className="material-symbols-outlined text-[16px]">
                {isRtl ? "west" : "east"}
              </span>
            </Link>
            <Link
              href={`/${locale}/account`}
              className="px-4 py-2 rounded-lg text-[#d1c5b5] hover:text-[#e0e2ef] text-xs font-bold transition-colors"
            >
              {isRtl ? "تسجيل الدخول للأعضاء" : "Member Login"}
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. MAIN LITERARY SHELVES CONTAINER
         ========================================================================= */}
      <div className="max-w-[1280px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col gap-16">
        {/* -----------------------------------------------------------------------
            SHELF 1: Editor's High Literature Choice (اختيارات المحررين للأدب الرفيع)
           ----------------------------------------------------------------------- */}
        <section className="flex flex-col gap-6">
          <div className="flex items-baseline justify-between border-b border-[#4e463a]/30 pb-4">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-xs bg-[#e6c184]" />
              <h2 className="font-serif text-2xl font-bold text-[#e0e2ef] tracking-wide">
                {isRtl ? "اختيارات المحررين للأدب الرفيع" : "Editor's High Literature Choices"}
              </h2>
              <span className="text-[#d1c5b5] text-xs hidden sm:inline mr-2">
                {isRtl ? "نصوص روائية وسردية منتخبة بعناية" : "Carefully curated narrative folios"}
              </span>
            </div>
            <Link
              href={`/${locale}/books`}
              className="group inline-flex items-center gap-1 text-[#e6c184] hover:text-[#ffdeaa] text-xs font-bold transition-colors"
            >
              <span>{isRtl ? "عرض الكل (٨)" : "View All (8)"}</span>
              <span className="material-symbols-outlined text-[18px] group-hover:-translate-x-1 transition-transform">
                {isRtl ? "arrow_left_alt" : "arrow_right_alt"}
              </span>
            </Link>
          </div>

          {/* 4-Column Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Book Card 1: مدينة بين صفحتين */}
            <article className="group flex flex-col bg-[#1c1f29] rounded-xl overflow-hidden hover:bg-[#272a33] transition-all duration-300 transform hover:-translate-y-1.5 border border-[#4e463a]/30">
              <div className="relative w-full aspect-[3/4] bg-[#32343e] overflow-hidden">
                <div
                  className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                  style={{
                    backgroundImage:
                      "url('https://lh3.googleusercontent.com/aida-public/AB6AXuD50OVqqeGGPnfRyCEn3m5s-OsNrQeKwcaozNHiqqYK2DKxiH84GMZTIZWyJcALgyTu-Ip2TZ2CQRSGroRmrZ_P4hGR26ML7eqePzqZLhiiI6JgS15MB91zF5e9jcVwgbn0RiBn0m2pHEFnOj9NjJ-JJHkfnyAbgmQQjqlbKEtaa-QR-0ubDICxxkEXf_YjqNMeTS-y0D90CFYK8BVPP2BSNahi3aCQVAMiEUmnI9Ye94t0ZZ49A538')",
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1c1f29] via-transparent to-transparent opacity-90" />
                <div className="absolute top-3 right-3 flex flex-col gap-1 items-start">
                  <span className="px-2 py-0.5 rounded bg-[#93000a]/80 text-[#ffb4ab] text-[10px] font-bold shadow-xs">
                    +١٨
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#10131c]/80 text-[#e6c184] text-[10px] font-bold backdrop-blur-md">
                    نص + صوت
                  </span>
                </div>
                <div className="absolute bottom-3 right-3 left-3 flex items-center justify-between text-[#d1c5b5] text-[11px] font-bold">
                  <span>١٤ دقيقة قراءة</span>
                  <span className="text-[#cdc6b8]">أدب مدن</span>
                </div>
              </div>
              <div className="p-4 flex flex-col flex-1 justify-between gap-3">
                <div>
                  <span className="text-xs font-semibold text-[#e6c184] mb-1 block">بقلم: كاتب تجريبي</span>
                  <h3 className="font-serif text-lg font-bold text-[#e0e2ef] group-hover:text-[#e6c184] transition-colors">
                    مدينة بين صفحتين
                  </h3>
                  <p className="text-xs text-[#d1c5b5] line-clamp-2 mt-1">
                    تتبع رحلة وثائق مفقودة في أزقة المدن القديمة وما تركته الحرب في طيات المخطوطات القديمة.
                  </p>
                </div>
                <div className="pt-2 flex items-center justify-between text-xs font-bold text-[#e6c184]">
                  <Link href={`/${locale}/reader/city-between-pages`} className="inline-flex items-center gap-1 group-hover:underline">
                    <span>اقرأ القصة</span>
                    <span className="material-symbols-outlined text-[16px]">{isRtl ? "west" : "east"}</span>
                  </Link>
                  <button
                    onClick={(e) => toggleBookmark("city_between_pages", e)}
                    className="p-1 text-[#9a8f81] hover:text-[#e6c184]"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {bookmarkedList["city_between_pages"] ? "bookmark_added" : "bookmark_add"}
                    </span>
                  </button>
                </div>
              </div>
            </article>

            {/* Book Card 2: نافذة على المرفأ */}
            <article className="group flex flex-col bg-[#1c1f29] rounded-xl overflow-hidden hover:bg-[#272a33] transition-all duration-300 transform hover:-translate-y-1.5 border border-[#4e463a]/30">
              <div className="relative w-full aspect-[3/4] bg-[#32343e] overflow-hidden">
                <div
                  className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                  style={{
                    backgroundImage:
                      "url('https://lh3.googleusercontent.com/aida-public/AB6AXuB_bjx8q8FG1J8etA1DiXKSbsyPQMCrn-5wcj4a1DxPUEzMKUyN6Hni0rLZOD3VWY-12bJ4bTAo_nvZg_ZY9PvBevgyfsCfauTaEhLG61Mx7l6rKH5XSoprDY1gw7-XlBAVZe-V9CM_yrlLkhZlFazdhCPZuTxVJRShypUmYmbAiB_sDS2iuzlMwPyPWvrPnMRYtHcjV2XT91d_x7cd8EpQYRRxGxWDfXr2PeXGvAT5z7vHZkM0wZzk')",
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1c1f29] via-transparent to-transparent opacity-90" />
                <div className="absolute top-3 right-3 flex flex-col gap-1 items-start">
                  <span className="px-2 py-0.5 rounded bg-[#32343e]/90 text-[#e0e2ef] text-[10px] font-bold">
                    مكتملة
                  </span>
                </div>
                <div className="absolute bottom-3 right-3 left-3 flex items-center justify-between text-[#d1c5b5] text-[11px] font-bold">
                  <span>٢٠ دقيقة قراءة</span>
                  <span className="text-[#cdc6b8]">أدب ساحلي</span>
                </div>
              </div>
              <div className="p-4 flex flex-col flex-1 justify-between gap-3">
                <div>
                  <span className="text-xs font-semibold text-[#e6c184] mb-1 block">رواية قصيرة</span>
                  <h3 className="font-serif text-lg font-bold text-[#e0e2ef] group-hover:text-[#e6c184] transition-colors">
                    نافذة على المرفأ
                  </h3>
                  <p className="text-xs text-[#d1c5b5] line-clamp-2 mt-1">
                    حوارات ليلية بين حارس منارة متقاعد وباحث يبحث عن سفينة غارقة منذ عام ١٩٤٠.
                  </p>
                </div>
                <div className="pt-2 flex items-center justify-between text-xs font-bold text-[#e6c184]">
                  <Link href={`/${locale}/reader/window-on-the-harbour`} className="inline-flex items-center gap-1 group-hover:underline">
                    <span>اقرأ القصة</span>
                    <span className="material-symbols-outlined text-[16px]">{isRtl ? "west" : "east"}</span>
                  </Link>
                  <button
                    onClick={(e) => toggleBookmark("window_harbor", e)}
                    className="p-1 text-[#9a8f81] hover:text-[#e6c184]"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {bookmarkedList["window_harbor"] ? "bookmark_added" : "bookmark_add"}
                    </span>
                  </button>
                </div>
              </div>
            </article>

            {/* Book Card 3: ساعات الرمل */}
            <article className="group flex flex-col bg-[#1c1f29] rounded-xl overflow-hidden hover:bg-[#272a33] transition-all duration-300 transform hover:-translate-y-1.5 border border-[#4e463a]/30">
              <div className="relative w-full aspect-[3/4] bg-[#32343e] overflow-hidden">
                <div
                  className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                  style={{
                    backgroundImage:
                      "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBNu-pSQUDjRuk8iyMwv1jsfnJPWjsP59qwYuGdPpi3ANdEwsfVAjhXS7gXYGwf2lJWjfo0gJxzVfmCEpOh3v8E0iySyrq3W18mZLD_ek6OAYoc8yu1RvzrEX9Ftwae4PHDcQw_2-NXq10tlnHFrAOhrdSTu04HBtFH6dxjeqT2_4G6DV8kdC_A_UtS9UP8HOJOxgekYG4jyoibUxP8Stemroa_SbmbkOqxqeSxXT8qevwZLZVZ6o2g')",
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1c1f29] via-transparent to-transparent opacity-90" />
                <div className="absolute top-3 right-3 flex flex-col gap-1 items-start">
                  <span className="px-2 py-0.5 rounded bg-[#32343e]/90 text-[#e0e2ef] text-[10px] font-bold">
                    مكتملة
                  </span>
                </div>
                <div className="absolute bottom-3 right-3 left-3 flex items-center justify-between text-[#d1c5b5] text-[11px] font-bold">
                  <span>١١ دقيقة قراءة</span>
                  <span className="text-[#cdc6b8]">فلسفة وزمن</span>
                </div>
              </div>
              <div className="p-4 flex flex-col flex-1 justify-between gap-3">
                <div>
                  <span className="text-xs font-semibold text-[#e6c184] mb-1 block">تأملات فلسفية</span>
                  <h3 className="font-serif text-lg font-bold text-[#e0e2ef] group-hover:text-[#e6c184] transition-colors">
                    ساعات الرمل
                  </h3>
                  <p className="text-xs text-[#d1c5b5] line-clamp-2 mt-1">
                    تأمل عميق في فكرة الفقد والذاكرة التي تذوب مع مرور العقود في صحراء العزلة.
                  </p>
                </div>
                <div className="pt-2 flex items-center justify-between text-xs font-bold text-[#e6c184]">
                  <Link href={`/${locale}/reader/sand-hours-philosophical-solitude`} className="inline-flex items-center gap-1 group-hover:underline">
                    <span>اقرأ القصة</span>
                    <span className="material-symbols-outlined text-[16px]">{isRtl ? "west" : "east"}</span>
                  </Link>
                  <button
                    onClick={(e) => toggleBookmark("hours_sand", e)}
                    className="p-1 text-[#9a8f81] hover:text-[#e6c184]"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {bookmarkedList["hours_sand"] ? "bookmark_added" : "bookmark_add"}
                    </span>
                  </button>
                </div>
              </div>
            </article>

            {/* Book Card 4: ورثة البحر */}
            <article className="group flex flex-col bg-[#1c1f29] rounded-xl overflow-hidden hover:bg-[#272a33] transition-all duration-300 transform hover:-translate-y-1.5 border border-[#4e463a]/30">
              <div className="relative w-full aspect-[3/4] bg-[#32343e] overflow-hidden">
                <div
                  className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                  style={{
                    backgroundImage:
                      "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDsTT22ro5e-3UL245geedZ5pPnel-pU4sDXBcMKbPnjgSpdnEm08YR4fGq5jilVcBewBhvX6Lv4eja00lI6BmOBenrN-uEyu4y_8lnrWTXxwcVMKP34e-dSrqUVdXR2ZPb1XPyZX4mckLgkKsrQBwbJqokISFzqzGcLNof3qpAK9JEJijwrRT3b8Q_LgltfigtrEdd1pmxEgiZLyahcqR8wzHMO2lh2UCMaNnH34SZLrouje1abFDD')",
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1c1f29] via-transparent to-transparent opacity-90" />
                <div className="absolute top-3 right-3 flex flex-col gap-1 items-start">
                  <span className="px-2 py-0.5 rounded bg-[#e6c184]/20 text-[#e6c184] text-[10px] font-bold">
                    متسلسلة
                  </span>
                </div>
                <div className="absolute bottom-3 right-3 left-3 flex items-center justify-between text-[#d1c5b5] text-[11px] font-bold">
                  <span>١٨ دقيقة قراءة</span>
                  <span className="text-[#cdc6b8]">ملحمة أسرية</span>
                </div>
              </div>
              <div className="p-4 flex flex-col flex-1 justify-between gap-3">
                <div>
                  <span className="text-xs font-semibold text-[#e6c184] mb-1 block">رواية ممتدة</span>
                  <h3 className="font-serif text-lg font-bold text-[#e0e2ef] group-hover:text-[#e6c184] transition-colors">
                    ورثة البحر
                  </h3>
                  <p className="text-xs text-[#d1c5b5] line-clamp-2 mt-1">
                    صراع عائلي محتدم حول وصية تركت في قاع المحيط قبل قرن كامل تكشف أسرار النسب.
                  </p>
                </div>
                <div className="pt-2 flex items-center justify-between text-xs font-bold text-[#e6c184]">
                  <Link href={`/${locale}/books/heirs-of-the-sea`} className="inline-flex items-center gap-1 group-hover:underline">
                    <span>اقرأ القصة</span>
                    <span className="material-symbols-outlined text-[16px]">{isRtl ? "west" : "east"}</span>
                  </Link>
                  <button
                    onClick={(e) => toggleBookmark("heirs_sea", e)}
                    className="p-1 text-[#9a8f81] hover:text-[#e6c184]"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {bookmarkedList["heirs_sea"] ? "bookmark_added" : "bookmark_add"}
                    </span>
                  </button>
                </div>
              </div>
            </article>
          </div>
        </section>

        {/* -----------------------------------------------------------------------
            SHELF 2: Five-Minute Dense Flash Fiction (قصص مكثفة في خمس دقائق)
           ----------------------------------------------------------------------- */}
        <section className="flex flex-col gap-6">
          <div className="flex items-baseline justify-between border-b border-[#4e463a]/30 pb-4">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-xs bg-[#cdc6b8]" />
              <h2 className="font-serif text-2xl font-bold text-[#e0e2ef] tracking-wide">
                {isRtl ? "قصص مكثفة في خمس دقائق" : "Five-Minute Dense Flash Fiction"}
              </h2>
              <span className="text-[#d1c5b5] text-xs hidden sm:inline mr-2">
                {isRtl ? "نصوص رشيقة وعميقة لقراءات خاطفة" : "Concise, deep stories for quick contemplation"}
              </span>
            </div>
            <Link
              href={`/${locale}/mood-selector`}
              className="group inline-flex items-center gap-1 text-[#e6c184] hover:text-[#ffdeaa] text-xs font-bold transition-colors"
            >
              <span>{isRtl ? "عرض الكل (١٢)" : "View All (12)"}</span>
              <span className="material-symbols-outlined text-[18px] group-hover:-translate-x-1 transition-transform">
                {isRtl ? "arrow_left_alt" : "arrow_right_alt"}
              </span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Flash 1: شجرة الأسماء */}
            <article className="p-4 rounded-xl bg-[#1c1f29] hover:bg-[#272a33] transition-colors flex flex-col justify-between gap-4 border border-[#4e463a]/30 group">
              <div>
                <div className="flex items-center justify-between text-[#d1c5b5] text-[11px] font-bold mb-2">
                  <span className="text-[#e6c184] text-xs font-bold">واقعية سحرية</span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">schedule</span> ٥ دقائق
                  </span>
                </div>
                <h3 className="font-serif text-lg font-bold text-[#e0e2ef] group-hover:text-[#e6c184] transition-colors mb-1.5">
                  شجرة الأسماء
                </h3>
                <p className="text-xs text-[#d1c5b5] line-clamp-3">
                  كلما نسي أهل القرية اسم راحل، نبتت ورقة جديدة في الشجرة المجاورة للسبيل تحمل حكايته الأولى.
                </p>
              </div>
              <Link
                href={`/${locale}/reader/tree-of-names`}
                className="pt-2 flex items-center justify-between text-xs font-bold text-[#9a8f81] group-hover:text-[#e0e2ef]"
              >
                <span>اقرأ الآن</span>
                <span className="material-symbols-outlined text-[16px] group-hover:text-[#e6c184]">
                  {isRtl ? "arrow_back" : "arrow_forward"}
                </span>
              </Link>
            </article>

            {/* Flash 2: مقهى عند الفجر */}
            <article className="p-4 rounded-xl bg-[#1c1f29] hover:bg-[#272a33] transition-colors flex flex-col justify-between gap-4 border border-[#4e463a]/30 group">
              <div>
                <div className="flex items-center justify-between text-[#d1c5b5] text-[11px] font-bold mb-2">
                  <span className="text-[#e6c184] text-xs font-bold">نصوص وجدانية</span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">schedule</span> ٤ دقائق
                  </span>
                </div>
                <h3 className="font-serif text-lg font-bold text-[#e0e2ef] group-hover:text-[#e6c184] transition-colors mb-1.5">
                  مقهى عند الفجر
                </h3>
                <p className="text-xs text-[#d1c5b5] line-clamp-3">
                  فنجان قهوة بارد بين يدين مرتجفتين وصوت مذياع قديم يبث ترانيم الصباح لشخص يودع محطته الأخيرة.
                </p>
              </div>
              <Link
                href={`/${locale}/reader/dawn-cafe`}
                className="pt-2 flex items-center justify-between text-xs font-bold text-[#9a8f81] group-hover:text-[#e0e2ef]"
              >
                <span>اقرأ الآن</span>
                <span className="material-symbols-outlined text-[16px] group-hover:text-[#e6c184]">
                  {isRtl ? "arrow_back" : "arrow_forward"}
                </span>
              </Link>
            </article>

            {/* Flash 3: الضوء الذي تأخر */}
            <article className="p-4 rounded-xl bg-[#1c1f29] hover:bg-[#272a33] transition-colors flex flex-col justify-between gap-4 border border-[#4e463a]/30 group">
              <div>
                <div className="flex items-center justify-between text-[#d1c5b5] text-[11px] font-bold mb-2">
                  <span className="text-[#e6c184] text-xs font-bold">ومضات قصصية</span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">schedule</span> ٥ دقائق
                  </span>
                </div>
                <h3 className="font-serif text-lg font-bold text-[#e0e2ef] group-hover:text-[#e6c184] transition-colors mb-1.5">
                  الضوء الذي تأخر
                </h3>
                <p className="text-xs text-[#d1c5b5] line-clamp-3">
                  ظل يبحث عن الكبريت طوال الليل، وحين أشرقت الشمس اكتشف أنه كان يقف في ساحة مفتوحة بلا جدران.
                </p>
              </div>
              <Link
                href={`/${locale}/reader/late-light`}
                className="pt-2 flex items-center justify-between text-xs font-bold text-[#9a8f81] group-hover:text-[#e0e2ef]"
              >
                <span>اقرأ الآن</span>
                <span className="material-symbols-outlined text-[16px] group-hover:text-[#e6c184]">
                  {isRtl ? "arrow_back" : "arrow_forward"}
                </span>
              </Link>
            </article>

            {/* Flash 4: مسافة بين رسالتين */}
            <article className="p-4 rounded-xl bg-[#1c1f29] hover:bg-[#272a33] transition-colors flex flex-col justify-between gap-4 border border-[#4e463a]/30 group">
              <div>
                <div className="flex items-center justify-between text-[#d1c5b5] text-[11px] font-bold mb-2">
                  <span className="text-[#e6c184] text-xs font-bold">أدب مراسلات</span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">schedule</span> ٦ دقائق
                  </span>
                </div>
                <h3 className="font-serif text-lg font-bold text-[#e0e2ef] group-hover:text-[#e6c184] transition-colors mb-1.5">
                  مسافة بين رسالتين
                </h3>
                <p className="text-xs text-[#d1c5b5] line-clamp-3">
                  ثمانية كيلومترات استغرقت ثلاثين سنة حتى قطعتها رسالة اعتذار كانت تنتظر في درج ساعي بريد متقاعد.
                </p>
              </div>
              <Link
                href={`/${locale}/reader/between-two-letters`}
                className="pt-2 flex items-center justify-between text-xs font-bold text-[#9a8f81] group-hover:text-[#e0e2ef]"
              >
                <span>اقرأ الآن</span>
                <span className="material-symbols-outlined text-[16px] group-hover:text-[#e6c184]">
                  {isRtl ? "arrow_back" : "arrow_forward"}
                </span>
              </Link>
            </article>
          </div>
        </section>

        {/* -----------------------------------------------------------------------
            SHELF 3: Most Read This Month (الأكثر قراءة هذا الشهر)
           ----------------------------------------------------------------------- */}
        <section className="flex flex-col gap-6">
          <div className="flex items-baseline justify-between border-b border-[#4e463a]/30 pb-4">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-xs bg-[#b8c8df]" />
              <h2 className="font-serif text-2xl font-bold text-[#e0e2ef] tracking-wide">
                {isRtl ? "الأكثر قراءة هذا الشهر" : "Most Read This Month"}
              </h2>
              <span className="text-[#d1c5b5] text-xs hidden sm:inline mr-2">
                {isRtl ? "أعلى الروايات تفاعلاً وإتماماً للقراءة" : "Highest engagement and completion rate"}
              </span>
            </div>
            <Link
              href={`/${locale}/books`}
              className="group inline-flex items-center gap-1 text-[#e6c184] hover:text-[#ffdeaa] text-xs font-bold transition-colors"
            >
              <span>{isRtl ? "عرض الكتالوج (٢٤)" : "Browse Catalog (24)"}</span>
              <span className="material-symbols-outlined text-[18px] group-hover:-translate-x-1 transition-transform">
                {isRtl ? "arrow_left_alt" : "arrow_right_alt"}
              </span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Story 1: بيت في آخر الطريق */}
            <article className="flex flex-col bg-[#1c1f29] rounded-xl overflow-hidden group hover:bg-[#272a33] transition-colors border border-[#4e463a]/30">
              <div className="relative w-full aspect-video bg-[#32343e] overflow-hidden">
                <div
                  className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                  style={{
                    backgroundImage:
                      "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCfmpW-SveSlx2GHj1o5oB5xtPCnFZ663-8G8InLYDu0osJ7fEX31Qnnpu9t4dmpW7424UxSqPNaPqIUya36ijqZgkSKfWHWAsrKRZSwMQk484xLK-UWFQMwWblu_kZLOTUN7MFzvpBTR4DBs539HCq_KDLgdKIHwDgMlSBgKNskXhY5WI8feWUi3SHQ2J5gsX69_UjQI6CVtf1QGb3vpEEYJLlktyw5DH4YStLtnZ0CaytuX1wNawo')",
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1c1f29] to-transparent" />
                <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-[#0b0e17]/80 text-[#e0e2ef] text-[10px] font-bold">
                  غموض نفسي
                </span>
                <span className="absolute bottom-2 left-2 text-[#d1c5b5] text-[10px] font-bold">١٦ دقيقة</span>
              </div>
              <div className="p-4 flex flex-col justify-between flex-1">
                <h3 className="font-serif text-lg font-bold text-[#e0e2ef] group-hover:text-[#e6c184] transition-colors">
                  بيت في آخر الطريق
                </h3>
                <p className="text-xs text-[#d1c5b5] line-clamp-2 mt-1">
                  أسرار عائلة غادرت فجأة وتركت مكتبة تحتوي على سجلات بأسماء جميع سكان القرية.
                </p>
                <div className="mt-4 flex items-center justify-between text-xs font-bold">
                  <Link href={`/${locale}/reader/house-at-the-end`} className="text-[#e6c184] flex items-center gap-1 group-hover:underline">
                    <span>ابدأ</span>
                    <span className="material-symbols-outlined text-[16px]">{isRtl ? "west" : "east"}</span>
                  </Link>
                  <span className="flex items-center gap-1 text-[#9a8f81] text-[11px]">
                    <span className="material-symbols-outlined text-[14px]">visibility</span> نص متاح
                  </span>
                </div>
              </div>
            </article>

            {/* Story 2: دفتر العابرين */}
            <article className="flex flex-col bg-[#1c1f29] rounded-xl overflow-hidden group hover:bg-[#272a33] transition-colors border border-[#4e463a]/30">
              <div className="relative w-full aspect-video bg-[#32343e] overflow-hidden">
                <div
                  className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                  style={{
                    backgroundImage:
                      "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCtMM6YbQY0DYJpG7oJsPvn5wAYErkhU5ipJq_pmNZULnRzMUTB6WJ05UfA_xoXTDll1tB3R1piuWd1SY9FUxUkD0eMjMMiwZ30lMAjRtbUTeQyee6dtVR9NJgCdiJXMtKqhvnLiktHFx9dvMFWlM3Y-aVkn_vHbkosiZrbruuuoSOA0__rsC7Ixni72rCpsIiC4VPPFPseILhAzluU5RPwqFozKwIRUrIUesVpf4dUovXeez0-YJdd')",
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1c1f29] to-transparent" />
                <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-[#0b0e17]/80 text-[#e0e2ef] text-[10px] font-bold">
                  سير ومذكرات
                </span>
                <span className="absolute bottom-2 left-2 text-[#d1c5b5] text-[10px] font-bold">٢٢ دقيقة</span>
              </div>
              <div className="p-4 flex flex-col justify-between flex-1">
                <h3 className="font-serif text-lg font-bold text-[#e0e2ef] group-hover:text-[#e6c184] transition-colors">
                  دفتر العابرين
                </h3>
                <p className="text-xs text-[#d1c5b5] line-clamp-2 mt-1">
                  يوميات حقيقية لكاتب متجول جمع أحاديث عابرة مع غرباء في محطات القطار المهجورة.
                </p>
                <div className="mt-4 flex items-center justify-between text-xs font-bold">
                  <Link href={`/${locale}/reader/passersby-notebook-daily-notes`} className="text-[#e6c184] flex items-center gap-1 group-hover:underline">
                    <span>ابدأ</span>
                    <span className="material-symbols-outlined text-[16px]">{isRtl ? "west" : "east"}</span>
                  </Link>
                  <span className="flex items-center gap-1 text-[#9a8f81] text-[11px]">
                    <span className="material-symbols-outlined text-[14px]">visibility</span> نص متاح
                  </span>
                </div>
              </div>
            </article>

            {/* Story 3: مواسم النحاس */}
            <article className="flex flex-col bg-[#1c1f29] rounded-xl overflow-hidden group hover:bg-[#272a33] transition-colors border border-[#4e463a]/30">
              <div className="relative w-full aspect-video bg-[#32343e] overflow-hidden">
                <div
                  className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                  style={{
                    backgroundImage:
                      "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCwoAMYf1YlxL5p6qzNoR2UBFMQZiByier95WZzb-iBCtz0mubahkfn89s5SSppW_dsVY-D9JK1qLF_Cz4eFgfLCdyu2EGXgFpSsy5Ub0jhoYgFMTrGhW8N_CNpzFx1M0T02-eC_JPABc9W3eIW_Tsa4EiPKTnbsx6yBSlVx6qRDES8bkBQoaWNFuyYFgqEesdogGwhgAO50hTaSezaX7iDuMW5GM3ZuBlsIVsxLOH0P3s1JKfJcu89')",
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1c1f29] to-transparent" />
                <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-[#0b0e17]/80 text-[#e0e2ef] text-[10px] font-bold">
                  تاريخي
                </span>
                <span className="absolute bottom-2 left-2 text-[#d1c5b5] text-[10px] font-bold">٢٥ دقيقة</span>
              </div>
              <div className="p-4 flex flex-col justify-between flex-1">
                <h3 className="font-serif text-lg font-bold text-[#e0e2ef] group-hover:text-[#e6c184] transition-colors">
                  مواسم النحاس
                </h3>
                <p className="text-xs text-[#d1c5b5] line-clamp-2 mt-1">
                  ملحمة تدور في القرن الثامن عشر بين حرفيي النحاس وصراعهم مع قوافل التجارة القادمة.
                </p>
                <div className="mt-4 flex items-center justify-between text-xs font-bold">
                  <Link href={`/${locale}/reader/seasons-of-copper`} className="text-[#e6c184] flex items-center gap-1 group-hover:underline">
                    <span>ابدأ</span>
                    <span className="material-symbols-outlined text-[16px]">{isRtl ? "west" : "east"}</span>
                  </Link>
                  <span className="flex items-center gap-1 text-[#9a8f81] text-[11px]">
                    <span className="material-symbols-outlined text-[14px]">visibility</span> نص متاح
                  </span>
                </div>
              </div>
            </article>

            {/* Story 4: حين عاد المسافر */}
            <article className="flex flex-col bg-[#1c1f29] rounded-xl overflow-hidden group hover:bg-[#272a33] transition-colors border border-[#4e463a]/30">
              <div className="relative w-full aspect-video bg-[#32343e] overflow-hidden">
                <div
                  className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                  style={{
                    backgroundImage:
                      "url('https://lh3.googleusercontent.com/aida-public/AB6AXuA4Hi2HNjwhDKus9Bsuj0Sq3sbVY5GmJpbmZwWPxTEiVXVUrcmFJL6mn5eWqGTsblZVTnCOKyOxuVWJH8EQuEwamZjKDXvv2SdiQPa4ultkSemlmSFIl1fbEysxXJ6kmiWuT3NQWD9C_eZxITjuxCmjByxbiaIiAaSjiJB0BoJNAOC-gsDjeKqEwh302aLzzLIFSNmYeCEckKF2KhPhGeCWMfg6zXrBo2U4EI5PjWMQmdVPlt1smqYm')",
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1c1f29] to-transparent" />
                <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-[#0b0e17]/80 text-[#e0e2ef] text-[10px] font-bold">
                  دراما
                </span>
                <span className="absolute bottom-2 left-2 text-[#d1c5b5] text-[10px] font-bold">١٥ دقيقة</span>
              </div>
              <div className="p-4 flex flex-col justify-between flex-1">
                <h3 className="font-serif text-lg font-bold text-[#e0e2ef] group-hover:text-[#e6c184] transition-colors">
                  حين عاد المسافر
                </h3>
                <p className="text-xs text-[#d1c5b5] line-clamp-2 mt-1">
                  عودة غير متوقعة بعد أربعين عاماً تكشف حقيقة الرسائل المتبادلة بين أخوين في قارتين.
                </p>
                <div className="mt-4 flex items-center justify-between text-xs font-bold">
                  <Link href={`/${locale}/reader/returning-traveler`} className="text-[#e6c184] flex items-center gap-1 group-hover:underline">
                    <span>ابدأ</span>
                    <span className="material-symbols-outlined text-[16px]">{isRtl ? "west" : "east"}</span>
                  </Link>
                  <span className="flex items-center gap-1 text-[#9a8f81] text-[11px]">
                    <span className="material-symbols-outlined text-[14px]">visibility</span> نص متاح
                  </span>
                </div>
              </div>
            </article>
          </div>
        </section>

        {/* -----------------------------------------------------------------------
            SHELF 4: Story Realms Matrix (بوابات العوالم السردية في StoryVerse)
           ----------------------------------------------------------------------- */}
        <section className="p-8 sm:p-10 rounded-2xl bg-[#181b25] border border-[#4e463a]/40 flex flex-col gap-8 relative overflow-hidden">
          <div className="absolute -top-12 -left-12 w-64 h-64 bg-[#e6c184]/5 rounded-full blur-3xl pointer-events-none" />
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="material-symbols-outlined text-[#e6c184] text-[20px]">hub</span>
                <span className="text-[#e6c184] text-xs font-bold tracking-wider">
                  منظومة StoryVerse متعددة الأجيال
                </span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#e0e2ef]">
                بوابات العوالم السردية في StoryVerse
              </h2>
              <p className="text-xs sm:text-sm text-[#d1c5b5] mt-1 max-w-2xl">
                عوالم قراءة بمحتوى وتنقل ورفوف مستقلة لكل فئة عمرية، وأدوات محلية لمرافقة الأسرة.
              </p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#1c1f29] text-[#d1c5b5] text-xs font-bold border border-[#4e463a]/30">
              <span className="w-2 h-2 rounded-full bg-[#e6c184]" />
              <span>أنت الآن في عالم المكتبة العامة (+١٨)</span>
            </div>
          </div>

          {/* Real Story Realms 5-Card Matrix */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Active Realm: Originals (+18) */}
            <div className="p-4 rounded-xl bg-[#272a33] flex flex-col justify-between min-h-[170px] border border-[#e6c184]/40 relative">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="material-symbols-outlined text-[#e6c184] text-[24px]">theater_comedy</span>
                  <span className="px-2 py-0.5 rounded bg-[#e6c184]/20 text-[#e6c184] text-[10px] font-bold">
                    نشط حالياً
                  </span>
                </div>
                <h3 className="font-serif text-lg font-bold text-[#e6c184] mb-0.5">Originals</h3>
                <p className="text-[11px] font-bold text-[#e0e2ef]">المكتبة العامة (+١٨)</p>
                <p className="text-[12px] text-[#d1c5b5] leading-snug mt-1.5">
                  أدب روائي عميق، دراما إنسانية، غموض وتجارب فكرية ناضجة.
                </p>
              </div>
              <div className="pt-2 text-[#e6c184] text-xs font-bold flex items-center gap-1">
                <span>العالم الحالي</span>
                <span className="material-symbols-outlined text-[16px]">check_circle</span>
              </div>
            </div>

            {/* Realm: Teens (13-17) */}
            <Link
              href={`/${locale}/realms/teens`}
              className="p-4 rounded-xl bg-[#1c1f29] hover:bg-[#272a33] transition-all flex flex-col justify-between min-h-[170px] group border border-[#4e463a]/30"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="material-symbols-outlined text-[#b8c8df] text-[24px]">explore</span>
                  <span className="px-2 py-0.5 rounded bg-[#32343e] text-[#b8c8df] text-[10px] font-bold">
                    ١٣-١٧ عاماً
                  </span>
                </div>
                <h3 className="font-serif text-lg font-bold text-[#e0e2ef] group-hover:text-[#b8c8df] transition-colors mb-0.5">
                  Teens
                </h3>
                <p className="text-[11px] font-bold text-[#d1c5b5]">عالم الناشئة</p>
                <p className="text-[12px] text-[#d1c5b5] leading-snug mt-1.5">
                  مغامرات خيال علمي، بطولات أسطورية وسرديات ملحمية مشوقة.
                </p>
              </div>
              <div className="pt-2 text-[#9a8f81] group-hover:text-[#b8c8df] text-xs font-bold flex items-center justify-between">
                <span>الانتقال للعالم</span>
                <span className="material-symbols-outlined text-[16px]">{isRtl ? "west" : "east"}</span>
              </div>
            </Link>

            {/* Realm: Kids (7-12) */}
            <Link
              href={`/${locale}/realms/kids`}
              className="p-4 rounded-xl bg-[#1c1f29] hover:bg-[#272a33] transition-all flex flex-col justify-between min-h-[170px] group border border-[#4e463a]/30"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="material-symbols-outlined text-[#cdc6b8] text-[24px]">palette</span>
                  <span className="px-2 py-0.5 rounded bg-[#32343e] text-[#cdc6b8] text-[10px] font-bold">
                    ٧-١٢ عاماً
                  </span>
                </div>
                <h3 className="font-serif text-lg font-bold text-[#e0e2ef] group-hover:text-[#cdc6b8] transition-colors mb-0.5">
                  Kids
                </h3>
                <p className="text-[11px] font-bold text-[#d1c5b5]">عالم الأطفال</p>
                <p className="text-[12px] text-[#d1c5b5] leading-snug mt-1.5">
                  قصص مصورة، ألغاز ذكية، واكتشاف عجائب الطبيعة والكون.
                </p>
              </div>
              <div className="pt-2 text-[#9a8f81] group-hover:text-[#cdc6b8] text-xs font-bold flex items-center justify-between">
                <span>الانتقال للعالم</span>
                <span className="material-symbols-outlined text-[16px]">{isRtl ? "west" : "east"}</span>
              </div>
            </Link>

            {/* Realm: Little (3-6) */}
            <Link
              href={`/${locale}/realms/little`}
              className="p-4 rounded-xl bg-[#1c1f29] hover:bg-[#272a33] transition-all flex flex-col justify-between min-h-[170px] group border border-[#4e463a]/30"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="material-symbols-outlined text-[#ffdeaa] text-[24px]">wb_sunny</span>
                  <span className="px-2 py-0.5 rounded bg-[#32343e] text-[#ffdeaa] text-[10px] font-bold">
                    ٣-٦ أعوام
                  </span>
                </div>
                <h3 className="font-serif text-lg font-bold text-[#e0e2ef] group-hover:text-[#ffdeaa] transition-colors mb-0.5">
                  Little
                </h3>
                <p className="text-[11px] font-bold text-[#d1c5b5]">عالم الصغار</p>
                <p className="text-[12px] text-[#d1c5b5] leading-snug mt-1.5">
                  حكايات النوم التفاعلية، أصوات الحيوانات وألوان الخيال الأولى.
                </p>
              </div>
              <div className="pt-2 text-[#9a8f81] group-hover:text-[#ffdeaa] text-xs font-bold flex items-center justify-between">
                <span>الانتقال للعالم</span>
                <span className="material-symbols-outlined text-[16px]">{isRtl ? "west" : "east"}</span>
              </div>
            </Link>

            {/* Family Hub (Guardians Gate) */}
            <Link
              href={`/${locale}/family-hub`}
              className="p-4 rounded-xl bg-[#1c1f29] hover:bg-[#272a33] transition-all flex flex-col justify-between min-h-[170px] group border border-[#4e463a]/30"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="material-symbols-outlined text-[#ffb4ab] text-[24px]">shield</span>
                  <span className="px-2 py-0.5 rounded bg-[#32343e] text-[#e0e2ef] text-[10px] font-bold">
                    إدارة الأوصياء
                  </span>
                </div>
                <h3 className="font-serif text-lg font-bold text-[#e0e2ef] group-hover:text-[#e6c184] transition-colors mb-0.5">
                  Family Hub
                </h3>
                <p className="text-[11px] font-bold text-[#d1c5b5]">مركز الأسرة</p>
                <p className="text-[12px] text-[#d1c5b5] leading-snug mt-1.5">
                  تحديد أوقات القراءة، ضبط الفئات العمرية وحجب المحتوى الناضج.
                </p>
              </div>
              <div className="pt-2 text-[#9a8f81] group-hover:text-[#e6c184] text-xs font-bold flex items-center justify-between">
                <span>إعدادات الأسرة</span>
                <span className="material-symbols-outlined text-[16px]">lock</span>
              </div>
            </Link>
          </div>

          {/* Safety Notice */}
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[#1c1f29] text-[#d1c5b5] text-xs border border-[#4e463a]/30">
            <span className="material-symbols-outlined text-[#e6c184] text-[18px]">info</span>
            <span>
              {isRtl
                ? "تعرض منصات الناشئة والأطفال والبراعم فهارسها وأدواتها الخاصة. تغيير المنصة من مساحة الصغار يمر ببوابة أهل محلية، وليست نظام تحقق من الهوية."
                : "Safe separation system: Transitions ensure complete protection for minor tiers."}
            </span>
          </div>
        </section>

        {/* -----------------------------------------------------------------------
            SHELF 5: Deluxe Physical Editions & Manuscripts (المقتنيات الملكية المطبوعة)
           ----------------------------------------------------------------------- */}
        <NativeProductShelf locale={locale}/>
      </div>
      <PublishedShelf realm="originals" locale={locale}/>
    </div>
  )
}
