"use client"
import { useCatalogBooks } from "@/context/catalog-context"

import React, { useState } from "react"
import Link from "@/components/common/realm-link"
import { PUBLISHING_BOOKS, StoryBookData } from "@/lib/books-data"
import {
  Clock,
  Sparkles,
  Compass,
  BookOpen,
  Headphones,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Sliders,
  Award,
} from "lucide-react"

type MoodSelectorViewProps = {
  locale: "ar" | "en"
}

type TimeOption = "5" | "15" | "30" | "60"
type MoodOption = "mystery" | "solitude" | "epic" | "gentle"
type FormatOption = "all" | "text" | "audio"

export function MoodSelectorView({ locale }: MoodSelectorViewProps) {
  const PUBLISHING_BOOKS = useCatalogBooks()
  const isRtl = locale === "ar"

  const [selectedTime, setSelectedTime] = useState<TimeOption>("15")
  const [selectedMood, setSelectedMood] = useState<MoodOption>("mystery")
  const [selectedFormat, setSelectedFormat] = useState<FormatOption>("all")

  const displayResults = PUBLISHING_BOOKS.filter(book => {
    if(book.ageGroup!=="adults_18_plus")return false
    const minutes=book.minutes || Math.max(5,Math.ceil(book.sampleText.join(" ").split(/\s+/).length/160))
    const genre=book.genre || (book.handle==="kharaet-al-ramad"?"mystery":"historical")
    const genres = selectedMood==="mystery"?["mystery"]:selectedMood==="solitude"?["drama","classics"]:selectedMood==="gentle"?["classics"]:["historical","adventure","scifi"]
    return minutes<=Number(selectedTime) && genres.includes(genre)
  })

  return (
    <div className="min-h-screen bg-[#10131c] text-[#e0e2ef] pb-24">
      {/* Top Banner (Stitch P17) */}
      <section className="relative overflow-hidden bg-[#0b0e17] border-b border-[#4e463a]/40 pt-12 pb-16">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#e6c184]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-[#9a8f81] mb-6">
            <Link href={`/${locale}`} className="hover:text-[#e6c184] transition-colors">
              {isRtl ? "الرئيسية" : "Home"}
            </Link>
            <span className="material-symbols-outlined text-[14px]">chevron_left</span>
            <span className="text-[#e6c184] font-bold">
              {isRtl ? "محدد المزاج القرائي ومساعد التفضيل (P17)" : "Reading Mood Selector"}
            </span>
          </nav>

          <div className="max-w-3xl text-start">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-[#e6c184] animate-pulse" />
              <span className="text-xs font-bold text-[#e6c184] uppercase tracking-widest">
                تخصيص حر ومجهول تماماً • بدون تتبع سلوكي
              </span>
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl font-black text-[#e0e2ef] tracking-tight">
              {isRtl ? "ما الحكاية التي تناسب وقتك اليوم؟" : "What Story Fits Your Time Today?"}
            </h1>
            <p className="font-serif text-sm sm:text-base text-[#d1c5b5] mt-3 leading-relaxed">
              {isRtl
                ? "مساعد التفضيل التحريري لاقتراح قراءات تناسب وتيرة يومك دون أي تصنيفات خفية. خياراتك تُعالج محلياً في لحظتك الراهنة فقط."
                : "Editorial recommendation engine suggesting curated stories aligned with your daily rhythm and time constraints."}
            </p>
          </div>
        </div>
      </section>

      {/* Main 2-Column Grid */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls Column (5 Cols) */}
          <aside className="lg:col-span-5 space-y-6 text-start"><label className="original-panel flex items-center justify-between gap-3">الصيغة<select className="original-select" value={selectedFormat} onChange={event=>setSelectedFormat(event.target.value as FormatOption)}><option value="all">نص وصوت</option><option value="text">قراءة</option><option value="audio">استماع للنص</option></select></label>
            <div className="p-6 rounded-3xl bg-[#1c1f29] border border-[#4e463a]/40 shadow-xl space-y-6">
              {/* Filter 1: Time Available */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-[#e6c184] uppercase tracking-wider block flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  <span>الوقت المتاح لديك للقراءة أو الاستماع:</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setSelectedTime("5")}
                    className={`p-3 rounded-2xl border text-xs font-bold text-start transition-all ${
                      selectedTime === "5"
                        ? "bg-[#272a33] border-[#e6c184] text-[#e6c184] shadow-md"
                        : "bg-[#181b25] border-[#4e463a]/30 text-[#cdc6b8] hover:bg-[#272a33]"
                    }`}
                  >
                    <span className="block font-mono text-base font-black">٥ دقائق</span>
                    <span className="text-[11px] text-[#9a8f81]">نص مكثف وخاطف</span>
                  </button>

                  <button
                    onClick={() => setSelectedTime("15")}
                    className={`p-3 rounded-2xl border text-xs font-bold text-start transition-all ${
                      selectedTime === "15"
                        ? "bg-[#272a33] border-[#e6c184] text-[#e6c184] shadow-md"
                        : "bg-[#181b25] border-[#4e463a]/30 text-[#cdc6b8] hover:bg-[#272a33]"
                    }`}
                  >
                    <span className="block font-mono text-base font-black">١٥ دقيقة</span>
                    <span className="text-[11px] text-[#9a8f81]">فصل روائي كامل</span>
                  </button>

                  <button
                    onClick={() => setSelectedTime("30")}
                    className={`p-3 rounded-2xl border text-xs font-bold text-start transition-all ${
                      selectedTime === "30"
                        ? "bg-[#272a33] border-[#e6c184] text-[#e6c184] shadow-md"
                        : "bg-[#181b25] border-[#4e463a]/30 text-[#cdc6b8] hover:bg-[#272a33]"
                    }`}
                  >
                    <span className="block font-mono text-base font-black">٣٠ دقيقة</span>
                    <span className="text-[11px] text-[#9a8f81]">جلسة غوص متأنية</span>
                  </button>

                  <button
                    onClick={() => setSelectedTime("60")}
                    className={`p-3 rounded-2xl border text-xs font-bold text-start transition-all ${
                      selectedTime === "60"
                        ? "bg-[#272a33] border-[#e6c184] text-[#e6c184] shadow-md"
                        : "bg-[#181b25] border-[#4e463a]/30 text-[#cdc6b8] hover:bg-[#272a33]"
                    }`}
                  >
                    <span className="block font-mono text-base font-black">ساعة فأكثر</span>
                    <span className="text-[11px] text-[#9a8f81]">ملحمة استماع كاملة</span>
                  </button>
                </div>
              </div>

              {/* Filter 2: Literary Mood */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-[#e6c184] uppercase tracking-wider block flex items-center gap-1.5">
                  <Compass className="w-4 h-4" />
                  <span>المزاج الأدبي المطلوب:</span>
                </label>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedMood("mystery")}
                    className={`w-full p-3.5 rounded-2xl border text-start transition-all flex items-center justify-between ${
                      selectedMood === "mystery"
                        ? "bg-[#272a33] border-[#e6c184] text-[#e0e2ef] shadow-md"
                        : "bg-[#181b25] border-[#4e463a]/30 text-[#cdc6b8] hover:bg-[#272a33]"
                    }`}
                  >
                    <div>
                      <span className="font-serif text-sm font-bold block">غموض، شفرات وتحقيق أرشيفي</span>
                      <span className="text-[11px] text-[#9a8f81]">مخطوطات الأندلس، أسرار الموانئ والرماد</span>
                    </div>
                    {selectedMood === "mystery" && <span className="text-[#e6c184] font-bold">✓</span>}
                  </button>

                  <button
                    onClick={() => setSelectedMood("solitude")}
                    className={`w-full p-3.5 rounded-2xl border text-start transition-all flex items-center justify-between ${
                      selectedMood === "solitude"
                        ? "bg-[#272a33] border-[#e6c184] text-[#e0e2ef] shadow-md"
                        : "bg-[#181b25] border-[#4e463a]/30 text-[#cdc6b8] hover:bg-[#272a33]"
                    }`}
                  >
                    <div>
                      <span className="font-serif text-sm font-bold block">تأمل، عزلة وفلسفة وجودية</span>
                      <span className="text-[11px] text-[#9a8f81]">ساعات الرمل، الذاكرة، ودفتر العابرين</span>
                    </div>
                    {selectedMood === "solitude" && <span className="text-[#e6c184] font-bold">✓</span>}
                  </button>

                  <button
                    onClick={() => setSelectedMood("gentle")}
                    className={`w-full p-3.5 rounded-2xl border text-start transition-all flex items-center justify-between ${
                      selectedMood === "gentle"
                        ? "bg-[#272a33] border-[#e6c184] text-[#e0e2ef] shadow-md"
                        : "bg-[#181b25] border-[#4e463a]/30 text-[#cdc6b8] hover:bg-[#272a33]"
                    }`}
                  >
                    <div>
                      <span className="font-serif text-sm font-bold block">سكينة وهدوء ما قبل النوم</span>
                      <span className="text-[11px] text-[#9a8f81]">حكايات دافئة للأسرة وبراعم الصغار</span>
                    </div>
                    {selectedMood === "gentle" && <span className="text-[#e6c184] font-bold">✓</span>}
                  </button>
                </div>
              </div>
            </div>
          </aside>

          {/* Results Column (7 Cols) */}
          <section className="lg:col-span-7 space-y-6 text-start">
            <div className="flex items-center justify-between pb-2 border-b border-[#4e463a]/30">
              <h2 className="font-serif text-xl font-black text-[#e0e2ef]">
                {isRtl ? "الترشيحات التحريرية المطابقة لوتيرتك" : "Curated Matches"}
              </h2>
              <span className="text-xs text-[#e6c184] font-bold">
                {displayResults.length} أعمال ملائمة
              </span>
            </div>

            <div className="space-y-4">
              {displayResults.length===0 && <div className="original-panel space-y-3"><p>لا توجد أعمال تطابق هذه الخيارات حاليًا.</p><button className="original-button" onClick={()=>{setSelectedTime("60");setSelectedMood("mystery");setSelectedFormat("all")}}>إعادة ضبط الخيارات</button></div>}
              {displayResults.map((book) => (
                <article
                  key={book.id}
                  className="p-5 rounded-3xl bg-[#1c1f29] border border-[#4e463a]/40 hover:border-[#e6c184] transition-all flex flex-col sm:flex-row gap-5 items-center shadow-xl group"
                >
                  <div className="relative w-28 aspect-[2/3] shrink-0 rounded-2xl overflow-hidden shadow-md bg-[#272a33]">
                    <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>

                  <div className="flex-1 space-y-2 text-start w-full">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded bg-[#e6c184]/20 text-[#e6c184] text-[10px] font-bold">
                        {book.author.name}
                      </span>
                      <span className="text-xs text-[#9a8f81]">•</span>
                      <span className="text-xs text-[#cdc6b8] font-mono">
                        {book.pageCount} صفحة • {book.audioDuration}
                      </span>
                    </div>

                    <h3 className="font-serif text-lg font-black text-[#e0e2ef] group-hover:text-[#e6c184] transition-colors">
                      {book.title}
                    </h3>

                    <p className="font-serif text-xs text-[#d1c5b5] line-clamp-2 leading-relaxed">
                      {book.description}
                    </p>

                    <div className="pt-3 border-t border-[#4e463a]/30 flex flex-wrap items-center gap-2">
                      <Link
                        href={`/${locale}/${selectedFormat==="audio"?"player":"reader"}/${book.handle}`}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#e6c184] text-[#422c00] font-bold text-xs hover:bg-[#ffdeaa] transition-colors"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>ابدأ القراءة الفورية</span>
                      </Link>

                      <Link
                        href={`/${locale}/player/${book.handle}`}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#272a33] text-[#e0e2ef] hover:bg-[#32343e] font-bold text-xs border border-[#4e463a]/40 transition-colors"
                      >
                        <Headphones className="w-3.5 h-3.5 text-[#e6c184]" />
                        <span>استمع درامياً</span>
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
