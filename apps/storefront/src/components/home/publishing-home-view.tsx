"use client"

import React, { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { PUBLISHING_BOOKS, StoryBookData } from "@/lib/books-data"
import { useAudio } from "@/context/audio-context"
import { AGE_GROUP_CONFIGS, AgeGroupType } from "@/context/customer-auth-context"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Sparkles,
  BookOpen,
  Headphones,
  BookMarked,
  ShieldCheck,
  Play,
  Pause,
  ArrowRight,
  ArrowLeft,
  Star,
  Compass,
  Award,
  Truck,
  Check,
  Gift,
  Feather,
  Mic,
  FileText,
  Volume2,
  X,
  Layers,
  ChevronRight,
  ChevronLeft,
} from "lucide-react"

type PublishingHomeViewProps = {
  locale: "ar" | "en"
}

export function PublishingHomeView({ locale }: PublishingHomeViewProps) {
  const isRtl = locale === "ar"
  const { playTrack, togglePlayPause, currentTrack, isPlaying } = useAudio()

  // Format selection state for spotlight novel
  const [spotlightFormat, setSpotlightFormat] = useState<"paperback" | "ebook" | "audiobook" | "bundle">("bundle")

  // Preview sample chapter modal state
  const [previewModalBook, setPreviewModalBook] = useState<StoryBookData | null>(null)

  // Spotlight novel: "شفرة قصر الحمراء"
  const spotlightBook = PUBLISHING_BOOKS.find((b) => b.id === "book_alhambra_05") || PUBLISHING_BOOKS[0]

  // Filter books by age groups
  const kids3to6Books = PUBLISHING_BOOKS.filter((b) => b.ageGroup === "kids_3_6")
  const kids7to12Books = PUBLISHING_BOOKS.filter((b) => b.ageGroup === "kids_7_12")
  const teensBooks = PUBLISHING_BOOKS.filter((b) => b.ageGroup === "teens_13_17")
  const adultsBooks = PUBLISHING_BOOKS.filter((b) => b.ageGroup === "adults_18_plus")

  const handlePlaySample = (book: StoryBookData) => {
    if (!book.hasAudioSample || !book.sampleAudioUrl) return

    if (currentTrack?.id === `sample_${book.id}` && isPlaying) {
      togglePlayPause()
      return
    }

    playTrack({
      id: `sample_${book.id}`,
      title: `${book.title} (عينة استماع)`,
      author: book.author.name,
      narrator: book.narrator?.name,
      coverUrl: book.coverUrl,
      audioUrl: book.sampleAudioUrl,
    })
  }

  return (
    <div className="flex flex-col gap-20 pb-24 overflow-x-hidden">
      {/* =========================================================================
          1. HERO SECTION: Grand Literary Entrance with 4 Age Group Portals
         ========================================================================= */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 via-background to-background pt-12 pb-20 md:pt-20 md:pb-28 border-b border-border">
        {/* Ambient Decorative Glows */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 max-w-6xl relative z-10 flex flex-col items-center text-center">
          {/* Trust Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-4 py-1.5 text-xs font-bold text-primary mb-6 shadow-2xs backdrop-blur-xs">
            <Sparkles className="w-4 h-4" />
            <span>
              {isRtl
                ? "دار النشر المعيارية المتكاملة • روايات وقصص لجميع الأعمار"
                : "Next-Gen Multi-Format Publishing Platform for All Ages"}
            </span>
          </div>

          {/* Main Literary Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-foreground leading-[1.2] max-w-4xl">
            {isRtl ? (
              <>
                عالم الروايات والقصص الساحرة...{" "}
                <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-amber-600 bg-clip-text text-transparent">
                  اقرأ، استمع، واقتنِ
                </span>{" "}
                أروع ما كُتب
              </>
            ) : (
              <>
                Where Timeless Stories Live.{" "}
                <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-amber-600 bg-clip-text text-transparent">
                  Read, Listen & Own
                </span>{" "}
                in Every Format.
              </>
            )}
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl leading-relaxed">
            {isRtl
              ? "من قصص ما قبل النوم للأطفال، إلى مغامرات الفضاء للناشئة، وألغاز التاريخ لليافعين، وروائع الأدب الكلاسيكي للكبار. متوفرة بنسخ ورقية فاخرة، إلكترونية مشفرة، وتسجيلات صوتية درامية تحبس الأنفاس."
              : "From gentle bedtime tales for kids, to deep-space adventures for young explorers, and classic historical epics for book lovers. Enjoy paperback, encrypted e-books, and cinematic audiobooks."}
          </p>

          {/* Core Trust Pillars */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs font-bold text-foreground">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-card border border-border shadow-2xs">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>{isRtl ? "حماية سحابية ضد القرصنة (DRM)" : "Anti-Piracy DRM"}</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-card border border-border shadow-2xs">
              <Layers className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span>{isRtl ? "3 صيغ لكل رواية (ورقي، صوتي، رقمي)" : "3 Formats Per Title"}</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-card border border-border shadow-2xs">
              <Truck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>{isRtl ? "شحن ورقي سريع ومبرد لكافة المدن" : "Fast Doorstep Shipping"}</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-card border border-border shadow-2xs">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>{isRtl ? "اشتراكات VIP بأرصدة تراكمية" : "VIP Monthly Passes"}</span>
            </div>
          </div>

          {/* 4 Age Group Interactive Portal Cards */}
          <div className="mt-14 w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-start">
            {/* Card 1: Kids 3-6 */}
            <Link
              href={`/${locale}/books?age=kids_3_6`}
              className="group p-5 rounded-3xl bg-gradient-to-b from-amber-500/10 via-amber-500/5 to-card border border-amber-400/30 hover:border-amber-400/60 transition-all hover:shadow-lg hover:-translate-y-1 relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-3xl">👶</span>
                <Badge className="bg-amber-500/20 text-amber-500 dark:text-amber-300 border-none text-[10px] font-black">
                  {isRtl ? "3 - 6 سنوات" : "Ages 3-6"}
                </Badge>
              </div>
              <h3 className="text-base font-black text-foreground group-hover:text-amber-500 transition-colors">
                {isRtl ? "واحة براعم الأطفال" : "Early Childhood Realm"}
              </h3>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                {isRtl
                  ? "قصص ما قبل النوم، رسوم دافئة، وتشكيل كامل للحروف مع راوية صوتية هادئة."
                  : "Gentle bedtime stories with soothing narrations and full vowel marks."}
              </p>
              <div className="mt-4 flex items-center gap-1 text-[11px] font-bold text-amber-500">
                <span>{isRtl ? "دخول الواحة" : "Enter Oasis"}</span>
                {isRtl ? <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" /> : <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />}
              </div>
            </Link>

            {/* Card 2: Kids 7-12 */}
            <Link
              href={`/${locale}/books?age=kids_7_12`}
              className="group p-5 rounded-3xl bg-gradient-to-b from-emerald-500/10 via-emerald-500/5 to-card border border-emerald-400/30 hover:border-emerald-400/60 transition-all hover:shadow-lg hover:-translate-y-1 relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-3xl">🧒</span>
                <Badge className="bg-emerald-500/20 text-emerald-500 dark:text-emerald-300 border-none text-[10px] font-black">
                  {isRtl ? "7 - 12 سنة" : "Ages 7-12"}
                </Badge>
              </div>
              <h3 className="text-base font-black text-foreground group-hover:text-emerald-600 transition-colors">
                {isRtl ? "كوكب الاستكشاف والناشئة" : "Young Explorers"}
              </h3>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                {isRtl
                  ? "سفن الفضاء السحيق، كنوز البحار السبعة، وخيال علمي يوقظ شغف المعرفة."
                  : "Space quests, mysteries of seven seas, and inspiring sci-fi adventures."}
              </p>
              <div className="mt-4 flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                <span>{isRtl ? "بدء الرحلة" : "Start Quest"}</span>
                {isRtl ? <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" /> : <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />}
              </div>
            </Link>

            {/* Card 3: Teens 13-17 */}
            <Link
              href={`/${locale}/books?age=teens_13_17`}
              className="group p-5 rounded-3xl bg-gradient-to-b from-purple-500/10 via-purple-500/5 to-card border border-purple-400/30 hover:border-purple-400/60 transition-all hover:shadow-lg hover:-translate-y-1 relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-3xl">🧑</span>
                <Badge className="bg-purple-500/20 text-purple-400 dark:text-purple-300 border-none text-[10px] font-black">
                  {isRtl ? "13 - 17 سنة" : "Ages 13-17"}
                </Badge>
              </div>
              <h3 className="text-base font-black text-foreground group-hover:text-purple-600 transition-colors">
                {isRtl ? "صالون الغموض واليافعين" : "Teens Mystery Salon"}
              </h3>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                {isRtl
                  ? "شفرات أندلسية، تحقيقات بوليسية، ومخطوطات تاريخية غامضة تحبس الأنفاس."
                  : "Cryptic Andalusian codes, forensic puzzles, and gripping historical thrillers."}
              </p>
              <div className="mt-4 flex items-center gap-1 text-[11px] font-bold text-purple-500">
                <span>{isRtl ? "فك الشفرة" : "Unlock Code"}</span>
                {isRtl ? <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" /> : <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />}
              </div>
            </Link>

            {/* Card 4: Adults 18+ */}
            <Link
              href={`/${locale}/books?age=adults_18_plus`}
              className="group p-5 rounded-3xl bg-gradient-to-b from-amber-700/10 via-amber-700/5 to-card border border-amber-600/30 hover:border-amber-600/60 transition-all hover:shadow-lg hover:-translate-y-1 relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-3xl">🧑‍💼</span>
                <Badge className="bg-amber-600/20 text-amber-600 dark:text-amber-300 border-none text-[10px] font-black">
                  {isRtl ? "18+ سنة" : "Adults 18+"}
                </Badge>
              </div>
              <h3 className="text-base font-black text-foreground group-hover:text-amber-700 transition-colors">
                {isRtl ? "ديوان الأدب الكلاسيكي" : "Classical Literature"}
              </h3>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                {isRtl
                  ? "ملحمة أطياف بغداد، أسرار بيت الحكمة، ولغة فصحى راقية لصفوة القراء."
                  : "House of Wisdom epics, ancient Baghdadi scribes, and profound prose."}
              </p>
              <div className="mt-4 flex items-center gap-1 text-[11px] font-bold text-amber-600">
                <span>{isRtl ? "دخول الديوان" : "Enter Salon"}</span>
                {isRtl ? <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" /> : <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />}
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. SPOTLIGHT SHOWCASE: Interactive Multi-Format Book Experience
         ========================================================================= */}
      <section className="container mx-auto px-4 max-w-6xl">
        <div className="relative rounded-3xl bg-gradient-to-br from-card via-card to-purple-950/20 border border-purple-500/20 p-6 sm:p-10 shadow-xl overflow-hidden">
          <div className="flex flex-col lg:flex-row items-center gap-10">
            {/* Book Cover with Live Audio Sample Ribbon */}
            <div className="relative w-60 sm:w-72 aspect-[2/3] shrink-0 rounded-2xl overflow-hidden shadow-2xl border border-border group">
              <img
                src={spotlightBook.coverUrl}
                alt={spotlightBook.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-4">
                <span className="text-[11px] font-bold text-amber-300">
                  {isRtl ? "الرواية الأكثر قراءة واستماعاً هذا الشهر" : "Trending Bestseller"}
                </span>
                <span className="text-xs font-mono text-zinc-300">
                  {spotlightBook.pageCount} {isRtl ? "صفحة" : "pages"} • {spotlightBook.audioDuration}
                </span>
              </div>
            </div>

            {/* Book Details & Format Selector */}
            <div className="flex-1 space-y-5 text-start">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="bg-purple-600 text-white font-bold text-xs">
                  {isRtl ? "تحفة الشهر الأدبية" : "Featured Masterpiece"}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {spotlightBook.author.name}
                </Badge>
                <Badge variant="outline" className="text-xs text-muted-foreground">
                  {isRtl ? `صوت الراوي: ${spotlightBook.narrator?.name}` : `Narrated by ${spotlightBook.narrator?.name}`}
                </Badge>
              </div>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-foreground leading-tight">
                {spotlightBook.title}
              </h2>

              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {spotlightBook.description}
              </p>

              {/* Format Switcher Pills */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-foreground block">
                  {isRtl ? "اختر الصيغة المفضلة لاقتناء الرواية:" : "Choose Your Preferred Format:"}
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {/* Option 1: Paperback */}
                  <button
                    onClick={() => setSpotlightFormat("paperback")}
                    className={`p-3 rounded-2xl border text-start transition-all ${
                      spotlightFormat === "paperback"
                        ? "bg-primary/10 border-primary ring-2 ring-primary/30"
                        : "bg-muted/30 border-border hover:bg-muted/60"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-1 text-xs font-bold text-foreground">
                      <BookOpen className="w-3.5 h-3.5 text-primary" />
                      <span>{isRtl ? "ورقي فاخر" : "Paperback"}</span>
                    </div>
                    <span className="text-sm font-black text-foreground">
                      {(spotlightBook.paperbackPrice / 100).toFixed(0)} {isRtl ? "ر.س" : "SAR"}
                    </span>
                  </button>

                  {/* Option 2: E-Book */}
                  <button
                    onClick={() => setSpotlightFormat("ebook")}
                    className={`p-3 rounded-2xl border text-start transition-all ${
                      spotlightFormat === "ebook"
                        ? "bg-primary/10 border-primary ring-2 ring-primary/30"
                        : "bg-muted/30 border-border hover:bg-muted/60"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-1 text-xs font-bold text-foreground">
                      <FileText className="w-3.5 h-3.5 text-primary" />
                      <span>{isRtl ? "إلكتروني (EPUB)" : "E-Book"}</span>
                    </div>
                    <span className="text-sm font-black text-foreground">
                      {(spotlightBook.ebookPrice / 100).toFixed(0)} {isRtl ? "ر.س" : "SAR"}
                    </span>
                  </button>

                  {/* Option 3: Audiobook */}
                  <button
                    onClick={() => setSpotlightFormat("audiobook")}
                    className={`p-3 rounded-2xl border text-start transition-all ${
                      spotlightFormat === "audiobook"
                        ? "bg-primary/10 border-primary ring-2 ring-primary/30"
                        : "bg-muted/30 border-border hover:bg-muted/60"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-1 text-xs font-bold text-foreground">
                      <Headphones className="w-3.5 h-3.5 text-primary" />
                      <span>{isRtl ? "صوتي درامي" : "Audiobook"}</span>
                    </div>
                    <span className="text-sm font-black text-foreground">
                      {(spotlightBook.audiobookPrice / 100).toFixed(0)} {isRtl ? "ر.س" : "SAR"}
                    </span>
                  </button>

                  {/* Option 4: Full Hybrid Bundle */}
                  <button
                    onClick={() => setSpotlightFormat("bundle")}
                    className={`p-3 rounded-2xl border text-start transition-all relative overflow-hidden ${
                      spotlightFormat === "bundle"
                        ? "bg-purple-600/15 border-purple-500 ring-2 ring-purple-500/30"
                        : "bg-muted/30 border-border hover:bg-muted/60"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-1 text-xs font-bold text-purple-600 dark:text-purple-400">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{isRtl ? "حزمة القارئ (خصم 50%)" : "Full Bundle"}</span>
                    </div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-sm font-black text-foreground">
                        {((spotlightBook.paperbackPrice + spotlightBook.audiobookPrice * 0.5) / 100).toFixed(0)}{" "}
                        {isRtl ? "ر.س" : "SAR"}
                      </span>
                      <span className="text-[10px] line-through text-muted-foreground">
                        {((spotlightBook.paperbackPrice + spotlightBook.audiobookPrice) / 100).toFixed(0)}
                      </span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Action Buttons: Play Sample + Read Preview + Add to Cart */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                {/* Audio Sample Player Button */}
                <Button
                  onClick={() => handlePlaySample(spotlightBook)}
                  variant="outline"
                  className="rounded-2xl h-12 px-5 text-xs font-bold gap-2 border-primary/40 hover:bg-primary/10"
                >
                  {currentTrack?.id === `sample_${spotlightBook.id}` && isPlaying ? (
                    <>
                      <Pause className="w-4 h-4 text-primary animate-pulse" />
                      <span>{isRtl ? "إيقاف العينة الصوتية مؤقتاً" : "Pause Audio Sample"}</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 text-primary fill-primary" />
                      <span>
                        {isRtl
                          ? `استمع للعينة الصوتية (${spotlightBook.sampleAudioDuration})`
                          : `Play Audio Sample (${spotlightBook.sampleAudioDuration})`}
                      </span>
                    </>
                  )}
                </Button>

                {/* Read Chapter 1 Modal Trigger */}
                <Button
                  onClick={() => setPreviewModalBook(spotlightBook)}
                  variant="secondary"
                  className="rounded-2xl h-12 px-5 text-xs font-bold gap-2"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>{isRtl ? "اقرأ الفصل الأول مجاناً" : "Read Chapter 1 Sample"}</span>
                </Button>

                {/* Direct Purchase Link */}
                <Button asChild className="rounded-2xl h-12 px-6 text-xs font-bold gap-2 bg-purple-600 hover:bg-purple-700 text-white">
                  <Link href={`/${locale}/books/${spotlightBook.handle}`}>
                    <span>{isRtl ? "اقتنِ الرواية الآن" : "Purchase Title"}</span>
                    {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. DEPARTMENT 1: 👶 واحة براعم الأطفال (3 - 6 سنوات)
         ========================================================================= */}
      <section className="container mx-auto px-4 max-w-6xl">
        <div className="rounded-3xl bg-amber-500/5 border border-amber-400/25 p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-2xl">👶</span>
                <h2 className="text-2xl font-black text-foreground">
                  {isRtl ? "واحة الأطفال الصغار (3 - 6 سنوات)" : "Early Childhood (3 - 6 Years)"}
                </h2>
                <Badge className="bg-amber-500/20 text-amber-500 dark:text-amber-300 font-bold text-[10px]">
                  {isRtl ? "وضع الأطفال الآمن" : "Safe Kids"}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                {isRtl
                  ? "قصص ما قبل النوم، رسوم دافئة، تشكيل كامل للحروف العربية، وأصوات مهدئة تساعد على النوم الهادئ."
                  : "Soothing bedtime stories, full vowel markers, and gentle narrations."}
              </p>
            </div>

            <Button asChild variant="outline" size="sm" className="rounded-xl text-xs font-bold border-amber-400/40 text-amber-500 hover:bg-amber-500/10">
              <Link href={`/${locale}/books?age=kids_3_6`}>
                <span>{isRtl ? "عرض كل قصص الأطفال" : "View All Kids Tales"}</span>
                {isRtl ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {kids3to6Books.map((book) => (
              <div
                key={book.id}
                className="bg-card rounded-2xl border border-amber-400/20 p-5 shadow-xs hover:shadow-md transition-all flex flex-col sm:flex-row gap-4 items-center"
              >
                <div className="relative w-32 aspect-[2/3] shrink-0 rounded-xl overflow-hidden shadow-md">
                  <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover" />
                </div>

                <div className="flex-1 space-y-2 text-start w-full">
                  <Badge variant="outline" className="border-amber-400/30 text-amber-500 font-bold text-[10px]">
                    {book.language}
                  </Badge>
                  <h3 className="font-bold text-sm text-foreground line-clamp-1">{book.title}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {book.description}
                  </p>
                  <div className="text-xs font-mono text-muted-foreground">
                    {book.pageCount} {isRtl ? "صفحة مصورة" : "pages"} • {book.audioDuration}
                  </div>

                  <div className="pt-2 flex flex-wrap items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handlePlaySample(book)}
                      className="rounded-xl text-[11px] h-9 gap-1.5 border-amber-400/40"
                    >
                      <Volume2 className="w-3.5 h-3.5 text-amber-500" />
                      <span>{isRtl ? "استمع للعينة" : "Sample"}</span>
                    </Button>
                    <Button asChild size="sm" className="rounded-xl text-[11px] h-9 gap-1 bg-amber-500 hover:bg-amber-600 text-white">
                      <Link href={`/${locale}/books/${book.handle}`}>
                        <span>{(book.paperbackPrice / 100).toFixed(0)} {isRtl ? "ر.س" : "SAR"}</span>
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. DEPARTMENT 2: 🧒 كوكب الاستكشاف والناشئة (7 - 12 سنة)
         ========================================================================= */}
      <section className="container mx-auto px-4 max-w-6xl">
        <div className="rounded-3xl bg-emerald-500/5 border border-emerald-400/25 p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🧒</span>
                <h2 className="text-2xl font-black text-foreground">
                  {isRtl ? "كوكب الاستكشاف والناشئة (7 - 12 سنة)" : "Young Explorers (7 - 12 Years)"}
                </h2>
                <Badge className="bg-emerald-500/20 text-emerald-500 dark:text-emerald-300 font-bold text-[10px]">
                  {isRtl ? "خيال علمي ومغامرة" : "Sci-Fi & Adventure"}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                {isRtl
                  ? "سفن فضاء مجهولة، أسرار كواكب الزمرد، وبوصلة البحار المفقودة لتنمية شغف الاستكشاف العلمي."
                  : "Space vessels, emerald planets, and ancient maritime compasses."}
              </p>
            </div>

            <Button asChild variant="outline" size="sm" className="rounded-xl text-xs font-bold border-emerald-400/40 text-emerald-600 hover:bg-emerald-500/10">
              <Link href={`/${locale}/books?age=kids_7_12`}>
                <span>{isRtl ? "عرض مغامرات الناشئة" : "View All Explorer Titles"}</span>
                {isRtl ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {kids7to12Books.map((book) => (
              <div
                key={book.id}
                className="bg-card rounded-2xl border border-emerald-400/20 p-5 shadow-xs hover:shadow-md transition-all flex flex-col sm:flex-row gap-4 items-center"
              >
                <div className="relative w-32 aspect-[2/3] shrink-0 rounded-xl overflow-hidden shadow-md">
                  <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover" />
                </div>

                <div className="flex-1 space-y-2 text-start w-full">
                  <Badge variant="outline" className="border-emerald-400/30 text-emerald-600 font-bold text-[10px]">
                    {book.author.name}
                  </Badge>
                  <h3 className="font-bold text-sm text-foreground line-clamp-1">{book.title}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {book.description}
                  </p>
                  <div className="text-xs font-mono text-muted-foreground">
                    {book.pageCount} {isRtl ? "صفحة" : "pages"} • {book.audioDuration}
                  </div>

                  <div className="pt-2 flex flex-wrap items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handlePlaySample(book)}
                      className="rounded-xl text-[11px] h-9 gap-1.5 border-emerald-400/40"
                    >
                      <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{isRtl ? "استمع للعينة" : "Sample"}</span>
                    </Button>
                    <Button asChild size="sm" className="rounded-xl text-[11px] h-9 gap-1 bg-emerald-600 hover:bg-emerald-700 text-white">
                      <Link href={`/${locale}/books/${book.handle}`}>
                        <span>{(book.paperbackPrice / 100).toFixed(0)} {isRtl ? "ر.س" : "SAR"}</span>
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          5. DEPARTMENTS 3 & 4: 🧑 اليافعون (13-17) & 🧑‍💼 الكبار (18+)
         ========================================================================= */}
      <section className="container mx-auto px-4 max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Teens 13-17 */}
        <div className="rounded-3xl bg-purple-500/5 border border-purple-400/25 p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🧑</span>
                <h3 className="text-xl font-black text-foreground">
                  {isRtl ? "روايات الغموض لليافعين (13 - 17 سنة)" : "Teens Mysteries (13 - 17)"}
                </h3>
              </div>
              <Badge className="bg-purple-500/20 text-purple-400 font-bold text-[10px]">
                {isRtl ? "ألغاز وشفرات" : "Ciphers"}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mb-6 leading-relaxed">
              {isRtl
                ? "مخطوطات أندلسية ضائعة، شفرات رياضية، ومغامرات بوليسية مشوقة في أعرق المدن التاريخية."
                : "Lost Andalusian manuscripts and historical suspense."}
            </p>

            {teensBooks.map((book) => (
              <div key={book.id} className="p-4 rounded-2xl bg-card border border-purple-400/20 flex gap-4 items-center">
                <img src={book.coverUrl} className="w-20 aspect-[2/3] object-cover rounded-xl shadow-xs shrink-0" />
                <div className="space-y-1 text-start">
                  <h4 className="font-bold text-xs text-foreground line-clamp-1">{book.title}</h4>
                  <span className="text-[11px] text-muted-foreground block font-mono">{book.audioDuration}</span>
                  <div className="flex gap-2 pt-2">
                    <Button size="sm" variant="outline" onClick={() => handlePlaySample(book)} className="h-8 text-[11px] rounded-lg">
                      <Volume2 className="w-3 h-3 text-purple-500" />
                      <span>{isRtl ? "عينة" : "Sample"}</span>
                    </Button>
                    <Button asChild size="sm" className="h-8 text-[11px] rounded-lg bg-purple-600 hover:bg-purple-700 text-white">
                      <Link href={`/${locale}/books/${book.handle}`}>
                        {isRtl ? "تصفح الرواية" : "View"}
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-6 mt-4 border-t border-purple-500/10">
            <Button asChild variant="ghost" size="sm" className="w-full text-xs font-bold text-purple-500">
              <Link href={`/${locale}/books?age=teens_13_17`}>
                <span>{isRtl ? "استكشف كل روايات اليافعين" : "Explore All Teen Titles"}</span>
                {isRtl ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </Link>
            </Button>
          </div>
        </div>

        {/* Adults 18+ */}
        <div className="rounded-3xl bg-amber-700/5 border border-amber-600/25 p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🧑‍💼</span>
                <h3 className="text-xl font-black text-foreground">
                  {isRtl ? "صالون الأدب والتاريخ (18+ سنة)" : "Classical Literature (18+)"}
                </h3>
              </div>
              <Badge className="bg-amber-600/20 text-amber-600 dark:text-amber-300 font-bold text-[10px]">
                {isRtl ? "بيت الحكمة" : "Classics"}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mb-6 leading-relaxed">
              {isRtl
                ? "ملحمة أطياف بغداد القديمة، صراع الوراقين لحفظ المعرفة الإنسانية، ولغة فصحى أدبية راقية."
                : "The House of Wisdom epic, ancient Baghdadi scribes, and philosophy."}
            </p>

            {adultsBooks.map((book) => (
              <div key={book.id} className="p-4 rounded-2xl bg-card border border-amber-600/20 flex gap-4 items-center">
                <img src={book.coverUrl} className="w-20 aspect-[2/3] object-cover rounded-xl shadow-xs shrink-0" />
                <div className="space-y-1 text-start">
                  <h4 className="font-bold text-xs text-foreground line-clamp-1">{book.title}</h4>
                  <span className="text-[11px] text-muted-foreground block font-mono">11 ساعة و 40 دقيقة سرد درامي</span>
                  <div className="flex gap-2 pt-2">
                    <Button size="sm" variant="outline" onClick={() => handlePlaySample(book)} className="h-8 text-[11px] rounded-lg">
                      <Volume2 className="w-3 h-3 text-amber-600" />
                      <span>{isRtl ? "عينة" : "Sample"}</span>
                    </Button>
                    <Button asChild size="sm" className="h-8 text-[11px] rounded-lg bg-amber-700 hover:bg-amber-800 text-white">
                      <Link href={`/${locale}/books/${book.handle}`}>
                        {isRtl ? "تصفح الرواية" : "View"}
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-6 mt-4 border-t border-amber-600/10">
            <Button asChild variant="ghost" size="sm" className="w-full text-xs font-bold text-amber-600">
              <Link href={`/${locale}/books?age=adults_18_plus`}>
                <span>{isRtl ? "استكشف ديوان الأدب الكلاسيكي" : "Explore Classical Salon"}</span>
                {isRtl ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* =========================================================================
          6. VIP SUBSCRIPTIONS & READER PASSES SECTION
         ========================================================================= */}
      <section className="container mx-auto px-4 max-w-6xl">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <Badge className="bg-purple-500/15 text-purple-600 dark:text-purple-300 font-bold mb-3">
            💎 {isRtl ? "عضويات واشتراكات القراء والمستمعين" : "Reader Memberships & VIP Passes"}
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-black text-foreground">
            {isRtl ? "اشتراك واحد يفتح لك أبواب المعرفة" : "One Pass. Unlimited Inspiration."}
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-2">
            {isRtl
              ? "استمع بدون حدود، واقتنِ رواياتك المفضلة مجاناً بأرصدة الكتب الشهرية التراكمية."
              : "Unlimited audiobook streaming, monthly book credits, and zero ads."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Tier 1: Kids Story Pass */}
          <div className="p-6 rounded-3xl bg-card border border-border flex flex-col justify-between shadow-xs hover:border-amber-400/50 transition-all">
            <div className="space-y-4 text-start">
              <div className="flex items-center justify-between">
                <span className="text-2xl">👶</span>
                <span className="text-[11px] font-bold text-amber-500 bg-amber-500/10 px-2.5 py-0.5 rounded-full">
                  {isRtl ? "للأطفال والناشئة" : "Kids & Explorers"}
                </span>
              </div>
              <h3 className="text-lg font-black text-foreground">
                {isRtl ? "باقة براعم الأطفال" : "Kids Story Pass"}
              </h3>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-foreground">29</span>
                <span className="text-xs font-bold text-muted-foreground">{isRtl ? "ر.س / شهرياً" : "SAR / mo"}</span>
              </div>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>{isRtl ? "استماع غير محدود لقصص الأطفال وما قبل النوم" : "Unlimited kids bedtime audio"}</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>{isRtl ? "وضع آمن 100% بدون إعلانات أو محتوى غير ملائم" : "Safe Kids Mode with zero ads"}</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>{isRtl ? "تشكيل كامل للحروف لتنمية مهارة القراءة" : "Full vowel Arabic texts"}</span>
                </li>
              </ul>
            </div>
            <Button asChild className="w-full rounded-2xl h-11 text-xs font-bold mt-6 bg-amber-500 hover:bg-amber-600 text-white">
              <Link href={`/${locale}/subscriptions`}>
                {isRtl ? "اشترك لبراعمك" : "Subscribe Kids"}
              </Link>
            </Button>
          </div>

          {/* Tier 2: VIP Monthly Pass (Most Popular) */}
          <div className="p-6 rounded-3xl bg-gradient-to-b from-purple-500/15 via-card to-card border-2 border-purple-500 flex flex-col justify-between shadow-xl relative overflow-hidden">
            <div className="absolute top-3 left-3 bg-purple-600 text-white text-[10px] font-black px-3 py-0.5 rounded-full shadow-xs">
              {isRtl ? "الأكثر طلباً ⭐" : "Most Popular"}
            </div>
            <div className="space-y-4 text-start">
              <div className="flex items-center justify-between">
                <span className="text-2xl">💎</span>
              </div>
              <h3 className="text-lg font-black text-foreground">
                {isRtl ? "باقة VIP القارئ والمستمع" : "VIP Reader & Listener Pass"}
              </h3>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-foreground">49</span>
                <span className="text-xs font-bold text-muted-foreground">{isRtl ? "ر.س / شهرياً" : "SAR / mo"}</span>
              </div>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-purple-600 shrink-0" />
                  <span className="font-bold text-foreground">
                    {isRtl ? "1 رصيد كتاب مجاني شهرياً (اقتناء دائم)" : "1 Free Book Credit / Month"}
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>{isRtl ? "استماع غير محدود لكامل مكتبة الكتب الصوتية" : "Unlimited audiobook streaming"}</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>{isRtl ? "خصم 50% دائم على جميع النسخ الورقية" : "50% off all paperback editions"}</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>{isRtl ? "أولوية الحجز في النسخ الموقعة من المؤلفين" : "Priority author signed copies"}</span>
                </li>
              </ul>
            </div>
            <Button asChild className="w-full rounded-2xl h-11 text-xs font-bold mt-6 bg-purple-600 hover:bg-purple-700 text-white shadow-md">
              <Link href={`/${locale}/subscriptions`}>
                {isRtl ? "ابدأ اشتراك VIP الآن" : "Start VIP Pass"}
              </Link>
            </Button>
          </div>

          {/* Tier 3: Annual All-Access */}
          <div className="p-6 rounded-3xl bg-card border border-border flex flex-col justify-between shadow-xs hover:border-emerald-400/50 transition-all">
            <div className="space-y-4 text-start">
              <div className="flex items-center justify-between">
                <span className="text-2xl">👑</span>
                <span className="text-[11px] font-bold text-emerald-600 bg-emerald-500/10 px-2.5 py-0.5 rounded-full">
                  {isRtl ? "وفر شهرين مجاناً" : "Save 2 Months"}
                </span>
              </div>
              <h3 className="text-lg font-black text-foreground">
                {isRtl ? "الاشتراك السنوي الشامل" : "Annual VIP All-Access"}
              </h3>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-foreground">490</span>
                <span className="text-xs font-bold text-muted-foreground">{isRtl ? "ر.س / سنوياً" : "SAR / yr"}</span>
              </div>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span className="font-bold text-foreground">
                    {isRtl ? "12 رصيد كتاب فوري لاقتناء الروايات" : "12 Instant Book Credits"}
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>{isRtl ? "شحن ورقي مجاني لكافة طلباتك طوال العام" : "Free shipping on paperbacks"}</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>{isRtl ? "دعوات حصرية لصالونات القراءة الافتراضية" : "Exclusive literary salon invites"}</span>
                </li>
              </ul>
            </div>
            <Button asChild variant="outline" className="w-full rounded-2xl h-11 text-xs font-bold mt-6 border-emerald-500/30 text-emerald-600 hover:bg-emerald-500/10">
              <Link href={`/${locale}/subscriptions`}>
                {isRtl ? "اقتنِ العضوية السنوية" : "Join Annual Pass"}
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* =========================================================================
          7. AUTHORS & NARRATORS CREATIVE GUILD
         ========================================================================= */}
      <section className="container mx-auto px-4 max-w-6xl">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <Badge variant="outline" className="text-xs font-bold mb-2">
            ✍️ {isRtl ? "صانعو الإبداع والمحتوى" : "Authors & Voice Narrators"}
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-black text-foreground">
            {isRtl ? "نخبة من كبار الروائيين وفناني الأداء الصوتي" : "Master Storytellers & Vocal Artists"}
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {/* Author 1 */}
          <div className="p-4 rounded-3xl bg-card border border-border text-center space-y-2 shadow-2xs">
            <img
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80"
              alt="د. غسان الكيلاني"
              className="w-16 h-16 rounded-2xl object-cover mx-auto border"
            />
            <h4 className="font-bold text-xs text-foreground">د. غسان الكيلاني</h4>
            <span className="text-[10px] text-muted-foreground block">مؤرخ وروائي تراثي</span>
            <span className="text-[10px] font-bold text-purple-600 block">روايتان حصريتان</span>
          </div>

          {/* Author 2 */}
          <div className="p-4 rounded-3xl bg-card border border-border text-center space-y-2 shadow-2xs">
            <img
              src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80"
              alt="منى السعيد"
              className="w-16 h-16 rounded-2xl object-cover mx-auto border"
            />
            <h4 className="font-bold text-xs text-foreground">منى السعيد</h4>
            <span className="text-[10px] text-muted-foreground block">أدب أطفال وقصص مصورة</span>
            <span className="text-[10px] font-bold text-amber-500 block">قصتان مصورتان</span>
          </div>

          {/* Author 3 */}
          <div className="p-4 rounded-3xl bg-card border border-border text-center space-y-2 shadow-2xs">
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80"
              alt="عمر اليافعي"
              className="w-16 h-16 rounded-2xl object-cover mx-auto border"
            />
            <h4 className="font-bold text-xs text-foreground">عمر اليافعي</h4>
            <span className="text-[10px] text-muted-foreground block">خيال علمي واستكشاف</span>
            <span className="text-[10px] font-bold text-emerald-600 block">روايتان للناشئة</span>
          </div>

          {/* Narrator 1 */}
          <div className="p-4 rounded-3xl bg-card border border-border text-center space-y-2 shadow-2xs">
            <img
              src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80"
              alt="سامي المهدي"
              className="w-16 h-16 rounded-2xl object-cover mx-auto border"
            />
            <h4 className="font-bold text-xs text-foreground">سامي المهدي</h4>
            <span className="text-[10px] text-muted-foreground block">معلق صوتي إذاعي محترف</span>
            <span className="text-[10px] font-bold text-purple-600 block">25+ ساعة تسجيل</span>
          </div>

          {/* Narrator 2 */}
          <div className="p-4 rounded-3xl bg-card border border-border text-center space-y-2 shadow-2xs">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80"
              alt="ريم الجودر"
              className="w-16 h-16 rounded-2xl object-cover mx-auto border"
            />
            <h4 className="font-bold text-xs text-foreground">ريم الجودر</h4>
            <span className="text-[10px] text-muted-foreground block">فنانة صوتية مسرحية</span>
            <span className="text-[10px] font-bold text-amber-500 block">حكايات أطفال مهدئة</span>
          </div>
        </div>
      </section>

      {/* =========================================================================
          READ CHAPTER 1 PREVIEW MODAL
         ========================================================================= */}
      {previewModalBook && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card w-full max-w-2xl rounded-3xl border border-border p-6 sm:p-8 max-h-[85vh] overflow-y-auto space-y-5 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div>
                <span className="text-[11px] font-bold text-primary block">
                  {isRtl ? "مقتطف مجاني • الفصل الأول" : "Free Chapter 1 Preview"}
                </span>
                <h3 className="text-lg font-black text-foreground">{previewModalBook.title}</h3>
              </div>
              <button
                onClick={() => setPreviewModalBook(null)}
                className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-foreground/90 leading-relaxed font-serif">
              {previewModalBook.sampleText.map((paragraph, idx) => (
                <p key={idx} className="whitespace-pre-line p-3 rounded-xl bg-muted/20">
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="pt-4 border-t border-border flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                {isRtl ? "أعجبتك القراءة؟ اقتنِ النسخة الكاملة الآن." : "Enjoying this preview? Unlock the full book."}
              </span>
              <Button asChild size="sm" className="rounded-xl font-bold">
                <Link href={`/${locale}/books/${previewModalBook.handle}`}>
                  {isRtl ? "شراء الرواية كاملة" : "Unlock Full Title"}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
