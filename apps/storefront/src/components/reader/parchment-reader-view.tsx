"use client"

import React, { useState } from "react"
import Link from "next/link"
import { StoryBookData } from "@/lib/books-data"

type ParchmentReaderViewProps = {
  book: StoryBookData
  locale: "ar" | "en"
}

export function ParchmentReaderView({ book, locale }: ParchmentReaderViewProps) {
  const isRtl = locale === "ar"

  const [readerTheme, setReaderTheme] = useState<"paper" | "night" | "ivory">("paper")
  const [fontSize, setFontSize] = useState<number>(20) // px
  const [lineHeight, setLineHeight] = useState<number>(1.9)
  const [currentChapter, setCurrentChapter] = useState<number>(1)
  const [isChapterDrawerOpen, setIsChapterDrawerOpen] = useState(false)

  const themeStyles = {
    paper: {
      bg: "bg-[#EDE3D0]",
      text: "text-[#3B291A]",
      subtext: "text-[#6B5542]",
      barBg: "bg-[#E2D4BF]/95",
      border: "border-[#D8C7B0]",
      accent: "text-[#8B5A2B]",
      buttonBg: "bg-[#E2D4BF] hover:bg-[#D8C7B0]",
    },
    night: {
      bg: "bg-[#10131c]",
      text: "text-[#e0e2ef]",
      subtext: "text-[#a5a7b7]",
      barBg: "bg-[#181b25]/95",
      border: "border-[#4e463a]/40",
      accent: "text-[#e6c184]",
      buttonBg: "bg-[#1c1f29] hover:bg-[#272a33]",
    },
    ivory: {
      bg: "bg-[#FBF8F1]",
      text: "text-[#222222]",
      subtext: "text-[#666666]",
      barBg: "bg-[#F3EDE2]/95",
      border: "border-[#E5DCB]",
      accent: "text-[#996515]",
      buttonBg: "bg-[#EDE5D8] hover:bg-[#E5DCB]",
    },
  }

  const currentTheme = themeStyles[readerTheme]

  const chapters = [
    { num: 1, title: "الرسالة التي وصلت متأخرة", time: "٨ دقائق" },
    { num: 2, title: "شواهد في بهو الأسود", time: "١٢ دقيقة" },
    { num: 3, title: "شفرة ابن الخطيب المفقودة", time: "١٥ دقيقة" },
    { num: 4, title: "دهاليز القصبة القديمة", time: "١٠ دقائق" },
    { num: 5, title: "خاتمة الأرشيف الغائب", time: "١٨ دقيقة" },
  ]

  return (
    <div
      className={`min-h-screen ${currentTheme.bg} ${currentTheme.text} transition-colors duration-300 relative select-none`}
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* 1. Top Reading Ribbon (Matching Stitch p07_paper_1440) */}
      <header className={`sticky top-0 z-40 w-full ${currentTheme.barBg} backdrop-blur-md border-b ${currentTheme.border} transition-colors`}>
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          
          {/* Right: Breadcrumb & Back Link */}
          <div className="flex items-center gap-3 min-w-0">
            <Link
              href={`/${locale}/books/${book.handle}`}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg ${currentTheme.buttonBg} text-xs font-bold transition-colors shrink-0`}
            >
              <span className="material-symbols-outlined text-[16px]">
                {isRtl ? "arrow_forward" : "arrow_back"}
              </span>
              <span className="hidden sm:inline">{isRtl ? "تفاصيل الرواية" : "Book Details"}</span>
            </Link>

            <div className="hidden md:flex items-center gap-1.5 text-xs truncate">
              <span className={currentTheme.subtext}>{book.title}</span>
              <span className={currentTheme.subtext}>/</span>
              <span className="font-bold truncate">{chapters[currentChapter - 1]?.title}</span>
            </div>
          </div>

          {/* Center: Reading Progress Indicator */}
          <div className="hidden sm:flex items-center gap-3">
            <span className="text-xs font-mono font-bold">
              {Math.round((currentChapter / chapters.length) * 100)}%
            </span>
            <div className={`w-32 h-1.5 rounded-full ${readerTheme === 'night' ? 'bg-[#272a33]' : 'bg-[#D8C7B0]'} overflow-hidden`}>
              <div
                className="h-full bg-[#e6c184] rounded-full transition-all duration-300"
                style={{ width: `${(currentChapter / chapters.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Left: Typography & Theme Controls */}
          <div className="flex items-center gap-2">
            {/* Chapters Drawer Trigger */}
            <button
              onClick={() => setIsChapterDrawerOpen(!isChapterDrawerOpen)}
              className={`p-2 rounded-lg ${currentTheme.buttonBg} text-xs font-bold flex items-center gap-1`}
              title="فهرس الفصول"
            >
              <span className="material-symbols-outlined text-[18px]">format_list_bulleted</span>
              <span className="hidden sm:inline">الفصول</span>
            </button>

            {/* Font Size Adjusters */}
            <div className="flex items-center rounded-lg overflow-hidden border border-inherit">
              <button
                onClick={() => setFontSize((s) => Math.max(16, s - 2))}
                className={`px-2.5 py-1.5 ${currentTheme.buttonBg} text-xs font-bold`}
                title="تصغير الخط"
              >
                A-
              </button>
              <button
                onClick={() => setFontSize((s) => Math.min(28, s + 2))}
                className={`px-2.5 py-1.5 ${currentTheme.buttonBg} text-xs font-bold border-s border-inherit`}
                title="تكبير الخط"
              >
                A+
              </button>
            </div>

            {/* Theme Switcher (Paper, Night, Ivory) */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setReaderTheme("paper")}
                className={`w-7 h-7 rounded-full bg-[#EDE3D0] border-2 ${readerTheme === "paper" ? "border-[#8B5A2B] scale-110" : "border-transparent"}`}
                title="نمط ورق المخطوطات (Paper)"
              />
              <button
                onClick={() => setReaderTheme("night")}
                className={`w-7 h-7 rounded-full bg-[#10131c] border-2 ${readerTheme === "night" ? "border-[#e6c184] scale-110" : "border-[#4e463a]"}`}
                title="نمط القراءة الليلي (Night)"
              />
              <button
                onClick={() => setReaderTheme("ivory")}
                className={`w-7 h-7 rounded-full bg-[#FBF8F1] border-2 ${readerTheme === "ivory" ? "border-[#996515] scale-110" : "border-gray-300"}`}
                title="نمط العاج الصباحي (Ivory)"
              />
            </div>
          </div>
        </div>
      </header>

      {/* 2. Chapter Drawer Slide-over */}
      {isChapterDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs">
          <div className={`w-full max-w-sm h-full ${currentTheme.bg} border-s ${currentTheme.border} p-6 overflow-y-auto space-y-4`}>
            <div className="flex items-center justify-between pb-4 border-b border-inherit">
              <h3 className="font-serif text-lg font-black">{isRtl ? "فهرس فصول الرواية" : "Table of Contents"}</h3>
              <button onClick={() => setIsChapterDrawerOpen(false)} className="text-xl font-bold">✕</button>
            </div>
            <div className="space-y-2">
              {chapters.map((ch) => (
                <button
                  key={ch.num}
                  onClick={() => {
                    setCurrentChapter(ch.num)
                    setIsChapterDrawerOpen(false)
                  }}
                  className={`w-full p-3 rounded-xl text-start flex items-center justify-between transition-colors ${
                    currentChapter === ch.num ? "bg-[#e6c184] text-[#422c00] font-bold" : `${currentTheme.buttonBg}`
                  }`}
                >
                  <div>
                    <span className="text-xs block opacity-75">الفصل {ch.num}</span>
                    <span className="text-sm font-bold">{ch.title}</span>
                  </div>
                  <span className="text-xs opacity-75 font-mono">{ch.time}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. Prose Reading Sheet Body (Matching Stitch p07_paper_1440) */}
      <main className="max-w-3xl mx-auto px-6 sm:px-12 py-16 space-y-10">
        
        {/* Chapter Header Badge & Title */}
        <div className="text-center space-y-3 pb-8 border-b border-inherit opacity-90">
          <span className="text-xs tracking-widest font-bold uppercase block opacity-75">
            {book.title} • رواية كاملة
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-black">
            الفصل {currentChapter}: {chapters[currentChapter - 1]?.title}
          </h1>
          <span className="text-xs font-mono opacity-60 block">
            زمن القراءة التقديري: {chapters[currentChapter - 1]?.time} • وثيقة رقمية مؤمنة (DRM)
          </span>
        </div>

        {/* Prose Paragraphs with Editorial Drop-Cap */}
        <article
          className="font-serif text-justify space-y-8"
          style={{ fontSize: `${fontSize}px`, lineHeight: lineHeight }}
        >
          {book.sampleText.map((paragraph, idx) => (
            <p key={idx} className="leading-relaxed">
              {idx === 0 ? (
                <>
                  <span className="float-right text-5xl font-black ps-3 pe-1 leading-none font-serif text-[#e6c184]">
                    {paragraph.charAt(0)}
                  </span>
                  {paragraph.slice(1)}
                </>
              ) : (
                paragraph
              )}
            </p>
          ))}

          <p className="leading-relaxed">
            «كان الحبر الأندلسي المصنوع من قشور الجوز والزعفران وماء الورد لا يزال يحتفظ بلمعانه الخافت على أطراف الرق الغزال. وحين لامست أصابع طارق الزوايا المذهبة، تبين له أن الشفرة لا تتعلق بموقع الكنز الحسي؛ بل بقوائم الكتب والمخطوطات التي نجت من محارق الكنيسة في ساحة باب الرملة بغرناطة سنة ١٤٩٩م.»
          </p>

          <p className="leading-relaxed">
            «إن سر قصر الحمراء ليس في جدرانه الحمراء المنيعة، بل في ذلك التوافق الخفي بين زوايا الشمس عند الاعتدال الخريفي، وبين انعكاس الضوء على بئر السباع، حيث تتطابق الظلال لتشير إلى مدخل السرداب الشمالي تحت برج قمارش.»
          </p>
        </article>

        {/* Ornamental Divider */}
        <div className="flex items-center justify-center gap-3 py-6 opacity-40">
          <span className="h-px w-16 bg-current" />
          <span className="text-lg">❦</span>
          <span className="h-px w-16 bg-current" />
        </div>

        {/* Bottom Chapter Navigation Bar */}
        <div className="flex items-center justify-between pt-6 border-t border-inherit">
          <button
            onClick={() => setCurrentChapter((c) => Math.max(1, c - 1))}
            disabled={currentChapter === 1}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold ${currentTheme.buttonBg} disabled:opacity-40`}
          >
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            <span>الفصل السابق</span>
          </button>

          <span className="text-xs font-mono opacity-60">
            {currentChapter} من {chapters.length}
          </span>

          <button
            onClick={() => setCurrentChapter((c) => Math.min(chapters.length, c + 1))}
            disabled={currentChapter === chapters.length}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold ${currentTheme.buttonBg} disabled:opacity-40`}
          >
            <span>الفصل التالي</span>
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          </button>
        </div>
      </main>
    </div>
  )
}
