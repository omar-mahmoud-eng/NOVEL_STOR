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
} from "lucide-react"

type CustomerLibraryViewProps = {
  locale: "ar" | "en"
}

export function CustomerLibraryView({ locale }: CustomerLibraryViewProps) {
  const { playTrack, currentTrack, isPlaying, togglePlayPause } = useAudio()

  const [activeTab, setActiveTab] = useState<"all" | "ebooks" | "audiobooks">("all")
  const [activeReadingBook, setActiveReadingBook] = useState<StoryBookData | null>(null)
  const [readerTheme, setReaderTheme] = useState<"day" | "sepia" | "night">("day")
  const [fontSize, setFontSize] = useState<"sm" | "base" | "lg" | "xl">("base")
  const [readerPage, setReaderPage] = useState(0)

  // Unlocked items for demo customer
  const unlockedBooks = PUBLISHING_BOOKS.slice(0, 4)

  const isRtl = locale === "ar"

  const themeClasses = {
    day: "bg-white text-zinc-900 border-zinc-200",
    sepia: "bg-[#fcf5e5] text-[#4d3824] border-[#e8d7be]",
    night: "bg-[#141416] text-zinc-100 border-zinc-800",
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-7xl">
      {/* Header Banner & VIP Pass Status */}
      <div className="rounded-3xl bg-gradient-to-r from-primary/15 via-primary/5 to-background border border-primary/20 p-6 sm:p-8 mb-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge className="bg-primary text-primary-foreground font-bold px-3 py-1 gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{locale === "ar" ? "اشتراك VIP نشط" : "Active VIP Pass"}</span>
            </Badge>
            <span className="text-xs text-muted-foreground">
              {locale === "ar" ? "تجديد تلقائي: 2026-11-25" : "Renews: 2026-11-25"}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground">
            {locale === "ar" ? "مكتبتي الرقمية المؤمنة" : "My Protected Digital Library"}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {locale === "ar"
              ? "استمتع بقراءة رواياتك والاستماع للكتب الصوتية عبر مشغلات الويب المؤمنة بدون إمكانية النسخ أو التسريب."
              : "Read and listen to your licensed books anytime with DRM anti-piracy protection."}
          </p>
        </div>

        <div className="flex items-center gap-4 bg-background/80 backdrop-blur-md p-4 rounded-2xl border border-border shrink-0">
          <div className="text-center">
            <span className="block text-2xl font-black text-primary">2</span>
            <span className="text-[11px] text-muted-foreground">
              {locale === "ar" ? "رصيد كتب متبقي" : "Book Credits"}
            </span>
          </div>
          <div className="h-8 w-px bg-border" />
          <Button asChild size="sm" className="rounded-xl font-bold">
            <Link href={`/${locale}/books`}>
              {locale === "ar" ? "استبدال رصيد" : "Use Credit"}
            </Link>
          </Button>
        </div>
      </div>

      {/* Tabs Filter */}
      <div className="flex items-center gap-2 border-b border-border pb-4 mb-8">
        <button
          onClick={() => setActiveTab("all")}
          className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
            activeTab === "all"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {locale === "ar" ? "جميع المحتويات (4)" : "All Items (4)"}
        </button>
        <button
          onClick={() => setActiveTab("ebooks")}
          className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-1.5 ${
            activeTab === "ebooks"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>{locale === "ar" ? "الكتب الإلكترونية (EPUB)" : "E-Books"}</span>
        </button>
        <button
          onClick={() => setActiveTab("audiobooks")}
          className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-1.5 ${
            activeTab === "audiobooks"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Headphones className="w-4 h-4" />
          <span>{locale === "ar" ? "الكتب الصوتية" : "Audiobooks"}</span>
        </button>
      </div>

      {/* In-Browser Web Reader Modal / Drawer when reading */}
      {activeReadingBook && (
        <div
          className={`fixed inset-0 z-50 flex flex-col ${themeClasses[readerTheme]} select-none`}
          onContextMenu={(e) => e.preventDefault()}
        >
          {/* Reader Top Bar */}
          <div className="flex items-center justify-between px-6 py-3 border-b border-inherit bg-inherit/90 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveReadingBook(null)}
                className="p-2 rounded-xl hover:bg-black/10 dark:hover:bg-white/10 text-sm font-bold flex items-center gap-1"
              >
                {isRtl ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
                <span>{locale === "ar" ? "إغلاق القارئ" : "Close Reader"}</span>
              </button>
              <div className="h-6 w-px bg-inherit opacity-20" />
              <div>
                <h2 className="text-sm font-bold truncate max-w-[200px] sm:max-w-md">
                  {activeReadingBook.title}
                </h2>
                <span className="text-[11px] opacity-60">
                  {activeReadingBook.author.name} • {locale === "ar" ? "مرخص للاستخدام الشخصي" : "Personal License"}
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
                className="p-2 rounded-xl hover:bg-black/10 dark:hover:bg-white/10"
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
                className="p-2 rounded-xl hover:bg-black/10 dark:hover:bg-white/10"
                title="مظهر القراءة"
              >
                {readerTheme === "night" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Reader Core Content Page */}
          <div className="flex-1 overflow-y-auto px-6 sm:px-20 md:px-32 py-10 max-w-4xl mx-auto w-full leading-relaxed relative">
            {/* DRM Anti-Piracy Watermark Overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] flex items-center justify-center select-none rotate-[-25deg] text-4xl sm:text-6xl font-black">
              USER-DEMO-VIP • DRM PROTECTED • 2026
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

              <p className="leading-loose whitespace-pre-line font-serif text-justify">
                {activeReadingBook.sampleText[readerPage] || "محتوى الكتاب محمي ويتم تحميله بأمان..."}
              </p>
            </div>
          </div>

          {/* Reader Pagination Footer */}
          <div className="px-6 py-4 border-t border-inherit bg-inherit/90 backdrop-blur-md flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              disabled={readerPage === 0}
              onClick={() => setReaderPage((p) => Math.max(0, p - 1))}
              className="rounded-xl border-inherit gap-1"
            >
              {isRtl ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
              <span>{locale === "ar" ? "الصفحة السابقة" : "Previous Page"}</span>
            </Button>

            <span className="text-xs font-mono opacity-70">
              {readerPage + 1} / {activeReadingBook.sampleText.length}
            </span>

            <Button
              variant="outline"
              size="sm"
              disabled={readerPage >= activeReadingBook.sampleText.length - 1}
              onClick={() =>
                setReaderPage((p) => Math.min(activeReadingBook.sampleText.length - 1, p + 1))
              }
              className="rounded-xl border-inherit gap-1"
            >
              <span>{locale === "ar" ? "الصفحة التالية" : "Next Page"}</span>
              {isRtl ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      )}

      {/* Grid of Unlocked Books */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {unlockedBooks.map((book) => (
          <div
            key={book.id}
            className="flex flex-col sm:flex-row gap-5 p-5 rounded-3xl bg-card border border-border hover:border-primary/40 transition-all shadow-xs"
          >
            {/* Book Cover */}
            <div className="relative aspect-[2/3] w-full sm:w-36 rounded-2xl overflow-hidden shrink-0 bg-muted">
              <Image
                src={book.coverUrl}
                alt={book.title}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 150px"
              />
              <div className="absolute top-2 start-2">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-black/60 text-white backdrop-blur-sm">
                  {book.pageCount} ص
                </span>
              </div>
            </div>

            {/* Info and Actions */}
            <div className="flex flex-col justify-between flex-1 min-w-0">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <Badge variant="outline" className="text-[10px] border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-bold">
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
              <div className="flex flex-wrap items-center gap-2.5 pt-4 mt-2 border-t border-border">
                {/* Read In-Browser Button */}
                <Button
                  onClick={() => {
                    setActiveReadingBook(book)
                    setReaderPage(0)
                  }}
                  size="sm"
                  variant="outline"
                  className="rounded-xl text-xs font-bold gap-1.5 border-primary/30 text-primary hover:bg-primary/5 flex-1"
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
                  className="rounded-xl text-xs font-bold gap-1.5 flex-1 bg-foreground text-background hover:bg-foreground/90"
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
