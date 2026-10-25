"use client"

import React, { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useAudio } from "@/context/audio-context"
import { StoryBookData, PUBLISHING_BOOKS } from "@/lib/books-data"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  BookOpen,
  Headphones,
  Sparkles,
  ShieldCheck,
  Play,
  Pause,
  Sun,
  Moon,
  Type,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  Clock,
  CheckCircle2,
  Lock,
  RotateCcw,
  Volume2,
  Layers,
  Crown,
} from "lucide-react"

type CustomerLibraryViewProps = {
  locale: "ar" | "en"
}

export function CustomerLibraryView({ locale }: CustomerLibraryViewProps) {
  const { playTrack, currentTrack, isPlaying, togglePlayPause } = useAudio()

  const [activeTab, setActiveTab] = useState<"all" | "ebooks" | "audiobooks">("all")
  const [activeReadingBook, setActiveReadingBook] = useState<StoryBookData | null>(null)
  const [readerTheme, setReaderTheme] = useState<"day" | "sepia" | "night">("sepia")
  const [fontSize, setFontSize] = useState<"sm" | "base" | "lg" | "xl">("base")
  const [readerPage, setReaderPage] = useState(0)

  // Unlocked items for demo customer
  const unlockedBooks = PUBLISHING_BOOKS.slice(0, 4)

  const isRtl = locale === "ar"

  const themeClasses = {
    day: "bg-[#FAFAFA] text-zinc-900 border-zinc-200",
    sepia: "bg-[#FDF8EC] text-[#3B291A] border-[#E8DCB8]",
    night: "bg-[#0B0E14] text-zinc-100 border-zinc-800",
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-7xl space-y-8">
      {/* Header Banner & VIP Pass Status */}
      <div className="stitch-card rounded-3xl bg-gradient-to-r from-amber-500/15 via-amber-500/5 to-card border border-amber-500/30 p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-md relative overflow-hidden">
        {/* Subtle decorative gold illumination */}
        <div className="absolute top-0 end-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="stitch-gold-gradient text-white font-extrabold text-xs px-3 py-1 rounded-full flex items-center gap-1.5 shadow-xs">
              <Crown className="w-3.5 h-3.5" />
              <span>{locale === "ar" ? "اشتراك VIP نشط" : "Active VIP Pass"}</span>
            </span>
            <span className="text-xs text-muted-foreground font-mono">
              {locale === "ar" ? "تجديد تلقائي: 2026-11-25" : "Renews: 2026-11-25"}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
            {locale === "ar" ? "المكتبة الرقمية السيادية المؤمنة" : "My Sovereign Protected Library"}
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-2xl leading-relaxed">
            {locale === "ar"
              ? "اقرأ واستمع لكافة رواياتك وإصداراتك المرخصة عبر القارئ السحابي ومُشغّل الصوت السيادي مع تشفير ضد القرصنة وحفظ موضع القراءة تلقائياً."
              : "Read and listen to all your licensed books anytime with DRM anti-piracy protection and instant position sync."}
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-4 bg-card/90 backdrop-blur-md p-4 rounded-2xl border border-amber-500/20 shrink-0 shadow-xs">
          <div className="text-center">
            <span className="block text-2xl font-black text-amber-500">2</span>
            <span className="text-[11px] font-bold text-muted-foreground">
              {locale === "ar" ? "رصيد كتب VIP" : "Book Credits"}
            </span>
          </div>
          <div className="h-8 w-px bg-border" />
          <Button asChild size="sm" className="stitch-gold-gradient text-white border-0 rounded-xl font-bold">
            <Link href={`/${locale}/books`}>
              {locale === "ar" ? "استبدال رصيد" : "Use Credit"}
            </Link>
          </Button>
        </div>
      </div>

      {/* Tabs Filter */}
      <div className="flex items-center gap-2 border-b border-border/70 pb-4">
        <button
          onClick={() => setActiveTab("all")}
          className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
            activeTab === "all"
              ? "stitch-gold-gradient text-white shadow-xs"
              : "text-muted-foreground hover:text-foreground hover:bg-muted"
          }`}
        >
          {locale === "ar" ? "جميع المحتويات (4)" : "All Items (4)"}
        </button>
        <button
          onClick={() => setActiveTab("ebooks")}
          className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === "ebooks"
              ? "stitch-gold-gradient text-white shadow-xs"
              : "text-muted-foreground hover:text-foreground hover:bg-muted"
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>{locale === "ar" ? "الكتب الإلكترونية (EPUB)" : "E-Books"}</span>
        </button>
        <button
          onClick={() => setActiveTab("audiobooks")}
          className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === "audiobooks"
              ? "stitch-gold-gradient text-white shadow-xs"
              : "text-muted-foreground hover:text-foreground hover:bg-muted"
          }`}
        >
          <Headphones className="w-4 h-4" />
          <span>{locale === "ar" ? "الكتب الصوتية (DRM Stream)" : "Audiobooks"}</span>
        </button>
      </div>

      {/* In-Browser Web Reader Modal / Drawer when reading */}
      {activeReadingBook && (
        <div
          className={`fixed inset-0 z-50 flex flex-col ${themeClasses[readerTheme]} select-none`}
          onContextMenu={(e) => e.preventDefault()}
        >
          {/* Reader Top Bar */}
          <div className="flex items-center justify-between px-6 py-3 border-b border-inherit bg-inherit/95 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveReadingBook(null)}
                className="p-2 rounded-xl hover:bg-black/10 dark:hover:bg-white/10 text-xs font-bold flex items-center gap-1 transition-colors"
              >
                {isRtl ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                <span>{locale === "ar" ? "إغلاق القارئ" : "Close Reader"}</span>
              </button>
              <div className="h-6 w-px bg-inherit opacity-20" />
              <div>
                <h2 className="text-sm font-black truncate max-w-[200px] sm:max-w-md">
                  {activeReadingBook.title}
                </h2>
                <span className="text-[10px] opacity-70">
                  {activeReadingBook.author.name} • {locale === "ar" ? "مرخص ومحمي برمز مشفر" : "DRM Authenticated"}
                </span>
              </div>
            </div>

            {/* Formatting & Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  setFontSize((prev) =>
                    prev === "sm" ? "base" : prev === "base" ? "lg" : prev === "lg" ? "xl" : "sm"
                  )
                }
                className="p-2 rounded-xl hover:bg-black/10 dark:hover:bg-white/10 text-xs font-bold"
                title="تغيير حجم الخط"
              >
                <Type className="w-4 h-4" />
              </button>
              <button
                onClick={() =>
                  setReaderTheme((prev) =>
                    prev === "day" ? "sepia" : prev === "sepia" ? "night" : "day"
                  )
                }
                className="p-2 rounded-xl hover:bg-black/10 dark:hover:bg-white/10 text-xs font-bold"
                title="مظهر القراءة (نهاري / رقوق قديمة / ليلي)"
              >
                {readerTheme === "night" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Reader Core Content Page */}
          <div className="flex-1 overflow-y-auto px-6 sm:px-20 md:px-32 py-12 max-w-4xl mx-auto w-full leading-relaxed relative">
            {/* DRM Anti-Piracy Watermark Overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.035] flex items-center justify-center select-none rotate-[-25deg] text-3xl sm:text-5xl font-black font-mono">
              SOVEREIGN-DRM • TARIQ-ALMANSOOR • VIP-LICENSE-2026
            </div>

            <div
              className={`space-y-6 ${
                fontSize === "sm"
                  ? "text-sm"
                  : fontSize === "lg"
                  ? "text-xl"
                  : fontSize === "xl"
                  ? "text-2xl"
                  : "text-base"
              }`}
            >
              <div className="text-center pb-6 border-b border-inherit opacity-60 text-xs font-mono">
                {locale === "ar"
                  ? `--- الجزء الأول • صفحة ${readerPage + 1} من ${activeReadingBook.sampleText.length} ---`
                  : `--- Chapter 1 • Page ${readerPage + 1} of ${activeReadingBook.sampleText.length} ---`}
              </div>

              <p className="leading-loose whitespace-pre-line font-serif text-justify text-base sm:text-lg">
                {activeReadingBook.sampleText[readerPage] || "محتوى الرواية محمي ويتم جلبه من خوادم النشر السيادية..."}
              </p>
            </div>
          </div>

          {/* Reader Pagination Footer */}
          <div className="px-6 py-4 border-t border-inherit bg-inherit/95 backdrop-blur-md flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              disabled={readerPage === 0}
              onClick={() => setReaderPage((p) => Math.max(0, p - 1))}
              className="rounded-xl border-inherit gap-1 text-xs font-bold"
            >
              {isRtl ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
              <span>{locale === "ar" ? "الصفحة السابقة" : "Previous"}</span>
            </Button>

            <span className="text-xs font-mono font-bold opacity-75">
              {readerPage + 1} / {activeReadingBook.sampleText.length}
            </span>

            <Button
              variant="outline"
              size="sm"
              disabled={readerPage >= activeReadingBook.sampleText.length - 1}
              onClick={() =>
                setReaderPage((p) => Math.min(activeReadingBook.sampleText.length - 1, p + 1))
              }
              className="rounded-xl border-inherit gap-1 text-xs font-bold"
            >
              <span>{locale === "ar" ? "الصفحة التالية" : "Next"}</span>
              {isRtl ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      )}

      {/* Grid of Unlocked Books */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {unlockedBooks.map((book) => (
          <div
            key={book.id}
            className="stitch-card flex flex-col sm:flex-row gap-5 p-5 rounded-3xl bg-card border border-border/80 hover:border-amber-500/40 transition-all shadow-xs"
          >
            {/* Book Cover with 3D spine depth */}
            <div className="stitch-book-3d relative aspect-[2/3] w-full sm:w-36 rounded-2xl overflow-hidden shrink-0 bg-muted/40 shadow-md">
              <Image
                src={book.coverUrl}
                alt={book.title}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 150px"
              />
              <div className="absolute top-2 start-2 z-10">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-black/75 text-white backdrop-blur-sm">
                  {book.pageCount} ص
                </span>
              </div>
            </div>

            {/* Info and Actions */}
            <div className="flex flex-col justify-between flex-1 min-w-0">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <Badge variant="outline" className="text-[10px] border-emerald-500/40 text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/5">
                    <CheckCircle2 className="w-3 h-3 me-1" />
                    {locale === "ar" ? "مرخص في مكتبتك" : "Unlocked in Library"}
                  </Badge>
                </div>
                <h3 className="text-base font-black text-foreground truncate">
                  {book.title}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {book.author.name} {book.narrator && `• أداء: ${book.narrator.name}`}
                </p>
                <p className="text-xs text-muted-foreground line-clamp-2 mt-2 leading-relaxed">
                  {book.description}
                </p>
              </div>

              {/* Action Buttons: Read & Listen */}
              <div className="flex flex-wrap items-center gap-2.5 pt-4 mt-2 border-t border-border/70">
                {/* Read In-Browser Button */}
                <Button
                  onClick={() => {
                    setActiveReadingBook(book)
                    setReaderPage(0)
                  }}
                  size="sm"
                  variant="outline"
                  className="rounded-xl text-xs font-bold gap-1.5 border-amber-500/30 text-amber-700 dark:text-amber-300 hover:bg-amber-500/10 flex-1"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>{locale === "ar" ? "قراءة سحابية" : "Read E-Book"}</span>
                </Button>

                {/* Listen Audiobook Button */}
                <Button
                  onClick={() =>
                    playTrack({
                      id: book.id,
                      title: book.title,
                      author: book.author.name,
                      narrator: book.narrator?.name,
                      coverUrl: book.coverUrl,
                      audioUrl: book.sampleAudioUrl,
                    })
                  }
                  size="sm"
                  className="stitch-gold-gradient text-white border-0 rounded-xl text-xs font-bold gap-1.5 flex-1 shadow-xs"
                >
                  <Headphones className="w-3.5 h-3.5" />
                  <span>{locale === "ar" ? "استماع صوتي" : "Listen"}</span>
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
