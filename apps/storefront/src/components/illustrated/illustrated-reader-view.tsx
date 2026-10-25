"use client"

import React, { useState } from "react"
import Link from "next/link"
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Contrast,
  Sliders,
  Layers,
  ArrowRight,
  ArrowLeft,
  Eye,
  Sparkles,
} from "lucide-react"

type IllustratedReaderViewProps = {
  locale: "ar" | "en"
}

type ViewMode = "spread" | "slide" | "vertical"

export function IllustratedReaderView({ locale }: IllustratedReaderViewProps) {
  const isRtl = locale === "ar"

  const [viewMode, setViewMode] = useState<ViewMode>("spread")
  const [zoomLevel, setZoomLevel] = useState<number>(100)
  const [contrastHigh, setContrastHigh] = useState<boolean>(false)
  const [currentPage, setCurrentPage] = useState<number>(0)

  // Illustrated Graphic Novel Panels for "شفرة قصر الحمراء المصورة"
  const panels = [
    {
      pageNumber: 1,
      title: "لوحة البهو الخالي",
      caption: "منتصف الليل في بهو السباع، الرياح تطفئ مصابيح الزوار وظل طارق يتسلل نحو العمود الأندلسي.",
      img: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=1200&q=85",
    },
    {
      pageNumber: 2,
      title: "نقوش التاج الرخامي",
      caption: "التقريب المجهري يكشف أرقاماً عربية دقيقة محفورة داخل بتلات الزهرة الرخامية.",
      img: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=1200&q=85",
    },
    {
      pageNumber: 3,
      title: "ضوء المصباح الزيتي",
      caption: "المفتاح البرونزي ينزلق في الشق المخفي أسفل قاعدة الحجر، وصوت صرير حديدي يدوي في الصمت.",
      img: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&q=85",
    },
    {
      pageNumber: 4,
      title: "سرداب المخطوطات",
      caption: "درجات تنحدر نحو قبو محكم الإغلاق تفوح منه رائحة شمع العسل والرقوق المحفوظة منذ خمسة قرون.",
      img: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=1200&q=85",
    },
  ]

  const handleZoomIn = () => setZoomLevel((z) => Math.min(150, z + 15))
  const handleZoomOut = () => setZoomLevel((z) => Math.max(80, z - 15))

  return (
    <div className={`min-h-screen ${contrastHigh ? "bg-black" : "bg-[#10131c]"} text-[#e0e2ef] pb-24`}>
      {/* Top Utility Bar (Stitch P19) */}
      <section className="sticky top-20 z-40 bg-[#181b25]/95 backdrop-blur-md border-b border-[#4e463a]/40 px-4 sm:px-6 py-3 shadow-md">
        <div className="max-w-[1440px] mx-auto flex flex-col xl:flex-row items-center justify-between gap-4">
          {/* Breadcrumb & Title */}
          <div className="flex items-center gap-3 w-full xl:w-auto">
            <Link
              href={`/${locale}/books/alhambra-code-andalusian-manuscript`}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#1c1f29] hover:bg-[#272a33] text-xs font-bold text-[#e0e2ef] border border-[#4e463a]/40 transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              <span>تفاصيل العمل</span>
            </Link>
            <div className="h-4 w-px bg-[#4e463a]/40" />
            <div className="flex items-center gap-2">
              <span className="font-serif text-sm font-black text-[#e6c184]">
                «شفرة قصر الحمراء: الرواية المصورة (P19)»
              </span>
              <span className="px-2 py-0.5 rounded bg-[#93000a]/20 text-[#ffb4ab] text-[10px] font-bold border border-[#ffb4ab]/30">
                +١٨ للكبار
              </span>
            </div>
          </div>

          {/* Controls: Modes & Zoom */}
          <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto justify-between xl:justify-end">
            {/* View Mode Segmented Controls */}
            <div className="flex items-center p-1 rounded-xl bg-[#0b0e17] border border-[#4e463a]/40">
              <button
                onClick={() => setViewMode("spread")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  viewMode === "spread"
                    ? "bg-[#272a33] text-[#e6c184] shadow-sm border border-[#e6c184]/40"
                    : "text-[#d1c5b5] hover:text-[#e0e2ef]"
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>عرض كتاب (مزدوج)</span>
              </button>

              <button
                onClick={() => setViewMode("slide")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  viewMode === "slide"
                    ? "bg-[#272a33] text-[#e6c184] shadow-sm border border-[#e6c184]/40"
                    : "text-[#d1c5b5] hover:text-[#e0e2ef]"
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">view_carousel</span>
                <span>شرائح</span>
              </button>

              <button
                onClick={() => setViewMode("vertical")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  viewMode === "vertical"
                    ? "bg-[#272a33] text-[#e6c184] shadow-sm border border-[#e6c184]/40"
                    : "text-[#d1c5b5] hover:text-[#e0e2ef]"
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">view_day</span>
                <span>رأسي (ويب تون)</span>
              </button>
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-[#0b0e17] border border-[#4e463a]/40">
              <button
                onClick={handleZoomIn}
                className="p-1.5 rounded-lg text-[#d1c5b5] hover:text-[#e6c184] transition-colors"
                title="تكبير"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <span className="px-2 font-mono text-xs font-bold text-[#e6c184]">
                {zoomLevel}٪
              </span>
              <button
                onClick={handleZoomOut}
                className="p-1.5 rounded-lg text-[#d1c5b5] hover:text-[#e6c184] transition-colors"
                title="تصغير"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <div className="h-4 w-px bg-[#4e463a]/40 mx-1" />
              <button
                onClick={() => setContrastHigh(!contrastHigh)}
                className={`p-1.5 rounded-lg transition-colors ${
                  contrastHigh ? "text-[#e6c184] bg-[#272a33]" : "text-[#d1c5b5] hover:text-[#e6c184]"
                }`}
                title="تباين حبري فائق"
              >
                <Contrast className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Canvas Area */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-8">
        {/* MODE 1: DUAL BOOK SPREAD (Default Stitch P19) */}
        {viewMode === "spread" && (
          <div
            className="transition-transform duration-300 mx-auto"
            style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: "top center" }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#0b0e17] p-6 sm:p-10 rounded-3xl border border-[#4e463a]/50 shadow-2xl">
              {/* Left Page (in RTL layout) */}
              <div className="space-y-4">
                <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-[#181b25] border border-[#4e463a]/40 shadow-xl group">
                  <img
                    src={panels[0].img}
                    alt={panels[0].title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-3 start-3 bg-[#10131c]/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold text-[#e6c184]">
                    صفحة ١
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-[#1c1f29] border border-[#4e463a]/30 text-start">
                  <h4 className="font-serif text-sm font-black text-[#e0e2ef]">{panels[0].title}</h4>
                  <p className="font-serif text-xs text-[#d1c5b5] mt-1 leading-relaxed">
                    {panels[0].caption}
                  </p>
                </div>
              </div>

              {/* Right Page */}
              <div className="space-y-4">
                <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-[#181b25] border border-[#4e463a]/40 shadow-xl group">
                  <img
                    src={panels[1].img}
                    alt={panels[1].title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-3 start-3 bg-[#10131c]/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold text-[#e6c184]">
                    صفحة ٢
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-[#1c1f29] border border-[#4e463a]/30 text-start">
                  <h4 className="font-serif text-sm font-black text-[#e0e2ef]">{panels[1].title}</h4>
                  <p className="font-serif text-xs text-[#d1c5b5] mt-1 leading-relaxed">
                    {panels[1].caption}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODE 2: SLIDE CAROUSEL */}
        {viewMode === "slide" && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="relative aspect-[4/3] w-full rounded-3xl overflow-hidden bg-[#0b0e17] border border-[#e6c184]/50 shadow-2xl">
              <img
                src={panels[currentPage].img}
                alt={panels[currentPage].title}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-[#10131c] via-[#10131c]/80 to-transparent text-start">
                <span className="text-xs font-bold text-[#e6c184] block mb-1">
                  لوحة {currentPage + 1} من {panels.length}
                </span>
                <h3 className="font-serif text-xl font-black text-[#e0e2ef]">
                  {panels[currentPage].title}
                </h3>
                <p className="font-serif text-xs text-[#d1c5b5] mt-1 leading-relaxed">
                  {panels[currentPage].caption}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <button
                onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                disabled={currentPage === 0}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 ${
                  currentPage === 0
                    ? "bg-[#181b25] text-[#606370] cursor-not-allowed"
                    : "bg-[#272a33] text-[#e0e2ef] hover:bg-[#32343e]"
                }`}
              >
                <ChevronRight className="w-4 h-4" />
                <span>اللوحة السابقة</span>
              </button>

              <span className="font-mono text-xs font-bold text-[#e6c184]">
                {currentPage + 1} / {panels.length}
              </span>

              <button
                onClick={() => setCurrentPage((p) => Math.min(panels.length - 1, p + 1))}
                disabled={currentPage === panels.length - 1}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 ${
                  currentPage === panels.length - 1
                    ? "bg-[#181b25] text-[#606370] cursor-not-allowed"
                    : "bg-[#e6c184] text-[#422c00] hover:bg-[#ffdeaa]"
                }`}
              >
                <span>اللوحة التالية</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* MODE 3: VERTICAL WEBTOON SCROLL */}
        {viewMode === "vertical" && (
          <div className="max-w-xl mx-auto space-y-6">
            {panels.map((panel, idx) => (
              <div
                key={idx}
                className="rounded-3xl overflow-hidden bg-[#0b0e17] border border-[#4e463a]/40 shadow-xl space-y-3"
              >
                <div className="relative aspect-[3/4] w-full">
                  <img src={panel.img} alt={panel.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-5 text-start">
                  <div className="flex items-center justify-between text-xs text-[#9a8f81] mb-1">
                    <span className="text-[#e6c184] font-bold">لوحة {panel.pageNumber}</span>
                    <span>شفرة قصر الحمراء المصورة</span>
                  </div>
                  <h4 className="font-serif text-base font-black text-[#e0e2ef]">{panel.title}</h4>
                  <p className="font-serif text-xs text-[#d1c5b5] mt-1 leading-relaxed">
                    {panel.caption}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
