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
  MessageSquare,
  Bookmark,
  GitBranch,
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
          1. HERO SECTION: Stitch Nocturne Literary Cinema (from p01_base_1440)
         ========================================================================= */}
      <section className="relative w-full overflow-hidden bg-[#0b0e17] border-b border-[#4e463a]/40">
        {/* Atmospheric Visual Backing */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-luminosity scale-105 transition-transform duration-1000 ease-out hover:scale-100"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=1600&q=80')",
          }}
        />

        {/* Scrim Gradients for Reading Clarity */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#10131c] via-[#10131c]/85 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-l from-[#10131c] via-[#10131c]/60 to-transparent" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#e6c184]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Content Sanctuary (Max Width 1280px) */}
        <div className="relative max-w-[1280px] w-full mx-auto px-4 sm:px-6 pt-20 pb-16 flex flex-col justify-end min-h-[580px] z-10">
          
          {/* Editorial Metadata Strip */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#93000a]/20 text-[#ffb4ab] text-[11px] font-bold border border-[#ffb4ab]/30">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ba1a1a] animate-ping" />
              +١٨ محتوى للكبار
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#272a33] text-[#e6c184] text-xs font-bold border border-[#4e463a]/30">
              <span className="material-symbols-outlined text-[15px]">verified</span>
              إصدار أصلي موثق
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#272a33] text-[#d1c5b5] text-xs font-medium border border-[#4e463a]/30">
              <span className="material-symbols-outlined text-[15px]">auto_stories</span>
              غموض وأرشيف تاريخي
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#1c1f29] text-[#cdc6b8] text-xs font-medium border border-[#4e463a]/30">
              <span className="material-symbols-outlined text-[15px]">timer</span>
              ٣ فصول • الفصل الأول ~٨ دقائق
            </span>
          </div>

          {/* Main Headline & Excerpt */}
          <div className="max-w-3xl mb-6">
            <p className="text-xs text-[#e6c184] tracking-widest mb-1.5 flex items-center gap-2 font-bold">
              <span>العمل المميز لهذا الأسبوع في StoryVerse</span>
              <span className="h-px w-12 bg-[#e6c184]/40 inline-block" />
              <span className="text-[#d1c5b5] text-xs font-normal">بقلم: د. غسان الكيلاني</span>
            </p>
            <h1 className="font-serif text-4xl sm:text-6xl font-black text-[#e0e2ef] tracking-tight mb-4">
              شفرة قصر الحمراء
            </h1>
            <p className="text-sm sm:text-base text-[#d1c5b5] leading-relaxed max-w-2xl font-serif">
              «في بهو الأسود بقصر الحمراء، حين انسحب آخر فوج سياحي وانطفأت الأضواء الكاشفة، بقي طارق معلقًا بنظره عند التاج الرخامي للعمود الثاني عشر. لم تكن النقوش الهندسية مجرد زينة فنية؛ بل كانت تشفيراً رياضياً دقيقاً لأكبر مكتبة علمية أندلسية فُقدت في القرن الخامس عشر.»
            </p>
          </div>

          {/* Interactive CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href={`/${locale}/books/alhambra-code-andalusian-manuscript`}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#e6c184] text-[#422c00] font-black text-xs sm:text-sm shadow-lg shadow-[#e6c184]/15 hover:bg-[#ffdeaa] transition-all transform hover:-translate-y-0.5"
            >
              <span className="material-symbols-outlined text-[20px]">menu_book</span>
              <span>ابدأ قراءة الفصل الأول</span>
            </Link>

            <button
              onClick={() => handlePlaySample(spotlightBook)}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#1c1f29] text-[#e0e2ef] hover:bg-[#272a33] border border-[#4e463a]/40 font-bold text-xs sm:text-sm transition-colors group"
            >
              <span className="material-symbols-outlined text-[20px] text-[#e6c184] group-hover:scale-110 transition-transform">
                headphones
              </span>
              <span>استمع إلى النسخة الصوتية المتقنة</span>
              <span className="text-[11px] px-2 py-0.5 rounded bg-[#32343e] text-[#e6c184] font-mono">
                {spotlightBook.sampleAudioDuration || "03:10"}
              </span>
            </button>

            <Link
              href={`/${locale}/books`}
              className="inline-flex items-center gap-1.5 px-4 py-3 rounded-xl text-[#d1c5b5] hover:text-[#e6c184] text-xs font-bold transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">bookmark_add</span>
              <span>تصفح كافة الأروقة</span>
            </Link>
          </div>
        </div>

        {/* Guest Experience Bar (Matching Stitch p01_base_1440) */}
        <div className="w-full bg-[#181b25] py-4 border-t border-[#4e463a]/30">
          <div className="max-w-[1280px] w-full mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#1c1f29] flex items-center justify-center text-[#e6c184] shrink-0 border border-[#4e463a]/40">
                <span className="material-symbols-outlined text-[20px]">lock_open</span>
              </div>
              <div>
                <p className="font-bold text-xs sm:text-sm text-[#e0e2ef]">
                  أنت تتصفح كزائر ضيف في المكتبة العامة المفتوحة
                </p>
                <p className="text-[11px] text-[#d1c5b5]">
                  جميع الأعمال الروائية متاحة للمعاينة الفورية والاستماع للعينات دون قيود تسجيل أو حجب فصول.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <Link
                href={`/${locale}/books`}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#1c1f29] text-[#e6c184] font-bold text-xs hover:bg-[#272a33] border border-[#4e463a]/40 transition-colors"
              >
                <span>اكتشف الكتالوج الكامل</span>
                <span className="material-symbols-outlined text-[16px]">arrow_left_alt</span>
              </Link>
              <Link
                href={`/${locale}/account`}
                className="px-4 py-2 rounded-lg text-[#d1c5b5] hover:text-[#e0e2ef] text-xs font-bold transition-colors"
              >
                تسجيل الدخول للأعضاء
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          1.5 STORYVERSE MULTI-REALM SELECTOR (Stitch Age Realms)
         ========================================================================= */}
      <section className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#e6c184] mb-2 tracking-widest uppercase">
              <span className="material-symbols-outlined text-[16px]">travel_explore</span>
              <span>{isRtl ? "عوالم STORYVERSE التفاعلية" : "StoryVerse Interactive Realms"}</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-black text-[#e0e2ef]">
              {isRtl ? "اختر الرواق الأدبي المناسب لفئتك" : "Choose Your Dedicated Literary Realm"}
            </h2>
          </div>
          <p className="text-xs text-[#a5a7b7] max-w-md">
            {isRtl
              ? "محتوى منسق خصيصاً لكل فئة عمرية، بتصنيفات دقيقة ومحركات قراءة ومؤثرات صوتية متوافقة مع الذوق الأدبي."
              : "Tailored curation for every age group, with strict suitability and dedicated audio experiences."}
          </p>
        </div>

        {/* 4 Age Group Cards in Stitch Nocturne Style */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-start">
          {/* Card 1: Little 3-6 */}
          <Link
            href={`/${locale}/realms/little`}
            className="group p-5 rounded-2xl bg-[#1c1f29] border border-[#4e463a]/30 hover:border-[#e6c184] transition-all hover:shadow-xl hover:-translate-y-1 relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold text-xl">
                🧸
              </span>
              <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 font-mono text-[10px] font-bold">
                {isRtl ? "٣ - ٦ سنوات" : "Ages 3-6"}
              </span>
            </div>
            <h3 className="font-serif text-base font-black text-[#e0e2ef] group-hover:text-[#e6c184] transition-colors">
              {isRtl ? "واحة براعم الأطفال (Little)" : "StoryVerse Little"}
            </h3>
            <p className="text-xs text-[#a5a7b7] mt-2 line-clamp-2 leading-relaxed">
              {isRtl
                ? "قصص ما قبل النوم، رسوم دافئة، وتشكيل كامل للحروف مع راوية صوتية هادئة."
                : "Gentle bedtime stories with soothing narrations and full vowel marks."}
            </p>
            <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-[#e6c184]">
              <span>{isRtl ? "استكشف الواحة" : "Enter Little"}</span>
              <span className="material-symbols-outlined text-[16px] group-hover:-translate-x-1 transition-transform">
                {isRtl ? "arrow_back" : "arrow_forward"}
              </span>
            </div>
          </Link>

          {/* Card 2: Kids 7-12 */}
          <Link
            href={`/${locale}/realms/kids`}
            className="group p-5 rounded-2xl bg-[#1c1f29] border border-[#4e463a]/30 hover:border-emerald-400/80 transition-all hover:shadow-xl hover:-translate-y-1 relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-xl">
                🧭
              </span>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold">
                {isRtl ? "٧ - ١٢ سنة" : "Ages 7-12"}
              </span>
            </div>
            <h3 className="font-serif text-base font-black text-[#e0e2ef] group-hover:text-emerald-400 transition-colors">
              {isRtl ? "كوكب الاستكشاف والناشئة" : "Young Explorers"}
            </h3>
            <p className="text-xs text-[#a5a7b7] mt-2 line-clamp-2 leading-relaxed">
              {isRtl
                ? "سفن الفضاء السحيق، كنوز البحار السبعة، وخيال علمي يوقظ شغف المعرفة."
                : "Space quests, mysteries of seven seas, and inspiring sci-fi adventures."}
            </p>
            <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-emerald-400">
              <span>{isRtl ? "بدء الرحلة" : "Start Quest"}</span>
              <span className="material-symbols-outlined text-[16px] group-hover:-translate-x-1 transition-transform">
                {isRtl ? "arrow_back" : "arrow_forward"}
              </span>
            </div>
          </Link>

          {/* Card 3: Teens 13-17 */}
          <Link
            href={`/${locale}/realms/teens`}
            className="group p-5 rounded-2xl bg-[#1c1f29] border border-[#4e463a]/30 hover:border-purple-400/80 transition-all hover:shadow-xl hover:-translate-y-1 relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold text-xl">
                ⚡
              </span>
              <span className="px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 font-mono text-[10px] font-bold">
                {isRtl ? "١٣ - ١٧ سنة" : "Ages 13-17"}
              </span>
            </div>
            <h3 className="font-serif text-base font-black text-[#e0e2ef] group-hover:text-purple-400 transition-colors">
              {isRtl ? "صالون الغموض واليافعين" : "Teens Mystery Realm"}
            </h3>
            <p className="text-xs text-[#a5a7b7] mt-2 line-clamp-2 leading-relaxed">
              {isRtl
                ? "شفرات أندلسية، تحقيقات بوليسية، ومخطوطات تاريخية غامضة تحبس الأنفاس."
                : "Cryptic Andalusian codes, forensic puzzles, and gripping historical thrillers."}
            </p>
            <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-purple-400">
              <span>{isRtl ? "فك الشفرة" : "Unlock Code"}</span>
              <span className="material-symbols-outlined text-[16px] group-hover:-translate-x-1 transition-transform">
                {isRtl ? "arrow_back" : "arrow_forward"}
              </span>
            </div>
          </Link>

          {/* Card 4: Adults 18+ */}
          <Link
            href={`/${locale}/salons`}
            className="group p-5 rounded-2xl bg-[#1c1f29] border border-[#4e463a]/30 hover:border-[#e6c184] transition-all hover:shadow-xl hover:-translate-y-1 relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="w-10 h-10 rounded-xl bg-[#e6c184]/10 text-[#e6c184] flex items-center justify-center font-bold text-xl">
                🏛️
              </span>
              <span className="px-2.5 py-1 rounded-full bg-[#e6c184]/20 text-[#e6c184] font-mono text-[10px] font-bold">
                {isRtl ? "١٨+ سنة" : "Adults 18+"}
              </span>
            </div>
            <h3 className="font-serif text-base font-black text-[#e0e2ef] group-hover:text-[#e6c184] transition-colors">
              {isRtl ? "ديوان الأدب (Originals & Salons)" : "StoryVerse Originals"}
            </h3>
            <p className="text-xs text-[#a5a7b7] mt-2 line-clamp-2 leading-relaxed">
              {isRtl
                ? "ملحمة أطياف بغداد، صالونات الحوار، وسينما روائية متكاملة لصفوة القراء."
                : "Literary epics, nocturnal cinema, archival manuscripts, and profound prose."}
            </p>
            <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-[#e6c184]">
              <span>{isRtl ? "دخول الصالونات" : "Enter Salons"}</span>
              <span className="material-symbols-outlined text-[16px] group-hover:-translate-x-1 transition-transform">
                {isRtl ? "arrow_back" : "arrow_forward"}
              </span>
            </div>
          </Link>
        </div>

        {/* Core Trust Pillars */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-xs font-bold text-[#d1c5b5]">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#181b25] border border-[#4e463a]/30">
            <span className="material-symbols-outlined text-[18px] text-emerald-400">verified_user</span>
            <span>{isRtl ? "حماية سحابية ضد القرصنة (DRM)" : "Cloud DRM Anti-Piracy"}</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#181b25] border border-[#4e463a]/30">
            <span className="material-symbols-outlined text-[18px] text-[#e6c184]">auto_stories</span>
            <span>{isRtl ? "٣ صيغ لكل رواية (ورقي، صوتي، رقمي)" : "3 Formats Per Title"}</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#181b25] border border-[#4e463a]/30">
            <span className="material-symbols-outlined text-[18px] text-blue-400">local_shipping</span>
            <span>{isRtl ? "شحن ورقي مجلد سريع لكافة المدن" : "Fast Doorstep Shipping"}</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#181b25] border border-[#4e463a]/30">
            <span className="material-symbols-outlined text-[18px] text-purple-400">workspace_premium</span>
            <span>{isRtl ? "عضوية VIP بأرصدة شهرية تراكمية" : "VIP Monthly Passes"}</span>
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. SPOTLIGHT SHOWCASE: Interactive Multi-Format Book Experience
         ========================================================================= */}
      <section className="container mx-auto px-4 max-w-6xl">
        <div className="relative rounded-3xl bg-gradient-to-br from-card via-card to-amber-950/20 border border-amber-500/25 p-6 sm:p-10 shadow-2xl overflow-hidden">
          <div className="flex flex-col lg:flex-row items-center gap-10">
            {/* Book Cover with 3D Depth & Live Audio Waveform */}
            <div className="relative w-60 sm:w-72 aspect-[2/3] shrink-0 rounded-2xl overflow-hidden stitch-book-3d border border-amber-500/30 group">
              <img
                src={spotlightBook.coverUrl}
                alt={spotlightBook.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {/* Dynamic Animated Waveform Overlay when Audio is Playing */}
              {currentTrack?.id === `sample_${spotlightBook.id}` && isPlaying && (
                <div className="absolute top-3 end-3 bg-slate-950/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-amber-500/50 flex items-center gap-1.5 shadow-xl">
                  <div className="w-1 bg-amber-400 rounded-full stitch-bar-1" />
                  <div className="w-1 bg-amber-400 rounded-full stitch-bar-2" />
                  <div className="w-1 bg-amber-400 rounded-full stitch-bar-3" />
                  <div className="w-1 bg-amber-400 rounded-full stitch-bar-4" />
                  <div className="w-1 bg-amber-400 rounded-full stitch-bar-5" />
                  <span className="text-[10px] text-amber-300 font-bold ms-1">جاري الاستماع</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex flex-col justify-end p-4">
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
                <Button asChild className="rounded-2xl h-12 px-6 text-xs font-black gap-2 stitch-gold-gradient text-slate-950 hover:opacity-95 shadow-md">
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
          2.5 STITCH NOCTURNE SHELVES (From p01_base_1440)
         ========================================================================= */}
      
      {/* Shelf 1: Editor's High Literature Choice */}
      <section className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-8 gap-3">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#e6c184]" />
            <div>
              <h2 className="font-serif text-2xl sm:text-3xl font-black text-[#e0e2ef] tracking-wide">
                {isRtl ? "اختيارات المحررين للأدب الرفيع" : "Editor's High Literature Picks"}
              </h2>
              <span className="text-xs text-[#a5a7b7]">
                {isRtl ? "نصوص روائية وسردية منتخبة بعناية من كبار الأدباء" : "Carefully selected narrative texts"}
              </span>
            </div>
          </div>
          <Link
            href={`/${locale}/books?age=adults_18_plus`}
            className="group inline-flex items-center gap-1 text-xs font-bold text-[#e6c184] hover:text-[#ffdeaa] transition-colors"
          >
            <span>{isRtl ? "عرض الكتالوج الشامل (٨)" : "View All"}</span>
            <span className="material-symbols-outlined text-[16px] group-hover:-translate-x-1 transition-transform">
              {isRtl ? "arrow_back" : "arrow_forward"}
            </span>
          </Link>
        </div>

        {/* 4-Column Grid from Stitch p01 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 text-start">
          {/* Card 1 */}
          <article className="group flex flex-col bg-[#1c1f29] rounded-2xl overflow-hidden hover:bg-[#272a33] border border-[#4e463a]/30 hover:border-[#e6c184]/50 transition-all duration-300 transform hover:-translate-y-1.5 shadow-lg">
            <div className="relative w-full aspect-[3/4] bg-[#272a33] overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&q=80"
                alt="مدينة بين صفحتين"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1c1f29] via-transparent to-transparent opacity-90" />
              <div className="absolute top-3 right-3 flex flex-col gap-1 items-start">
                <span className="px-2 py-0.5 rounded bg-[#93000a]/80 text-[#ffb4ab] text-[10px] font-bold shadow-sm">
                  +١٨
                </span>
                <span className="px-2 py-0.5 rounded bg-[#10131c]/80 text-[#e6c184] text-[10px] font-bold backdrop-blur-md">
                  نص + صوت
                </span>
              </div>
              <div className="absolute bottom-3 right-3 left-3 flex items-center justify-between text-xs text-[#cdc6b8]">
                <span>١٤ دقيقة قراءة</span>
                <span className="text-[#e6c184]">أدب مدن</span>
              </div>
            </div>
            <div className="p-4 flex flex-col flex-1 justify-between gap-3">
              <div>
                <span className="text-[11px] text-[#e6c184] font-bold block mb-1">بقلم: د. غسان الكيلاني</span>
                <h3 className="font-serif text-base font-black text-[#e0e2ef] group-hover:text-[#e6c184] transition-colors">
                  مدينة بين صفحتين
                </h3>
                <p className="text-xs text-[#a5a7b7] line-clamp-2 mt-1 leading-relaxed">
                  تتبع رحلة وثائق مفقودة في أزقة المدن القديمة وما تركته الحرب في طيات المخطوطات الأندلسية.
                </p>
              </div>
              <div className="pt-2 border-t border-[#4e463a]/30 flex items-center justify-between text-xs font-bold text-[#e6c184]">
                <Link href={`/${locale}/reader/alhambra-code-andalusian-manuscript`} className="inline-flex items-center gap-1 group-hover:underline">
                  <span>اقرأ القصة</span>
                  <span className="material-symbols-outlined text-[14px]">arrow_back</span>
                </Link>
                <Link href={`/${locale}/player/alhambra-code-andalusian-manuscript`} className="hover:text-[#ffdeaa]">
                  <Headphones className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </article>

          {/* Card 2 */}
          <article className="group flex flex-col bg-[#1c1f29] rounded-2xl overflow-hidden hover:bg-[#272a33] border border-[#4e463a]/30 hover:border-[#e6c184]/50 transition-all duration-300 transform hover:-translate-y-1.5 shadow-lg">
            <div className="relative w-full aspect-[3/4] bg-[#272a33] overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&q=80"
                alt="نافذة على المرفأ"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1c1f29] via-transparent to-transparent opacity-90" />
              <div className="absolute top-3 right-3 flex flex-col gap-1 items-start">
                <span className="px-2 py-0.5 rounded bg-[#272a33]/90 text-[#e6c184] text-[10px] font-bold">
                  مكتملة
                </span>
              </div>
              <div className="absolute bottom-3 right-3 left-3 flex items-center justify-between text-xs text-[#cdc6b8]">
                <span>٢٠ دقيقة قراءة</span>
                <span className="text-[#e6c184]">أدب ساحلي</span>
              </div>
            </div>
            <div className="p-4 flex flex-col flex-1 justify-between gap-3">
              <div>
                <span className="text-[11px] text-[#e6c184] font-bold block mb-1">رواية قصيرة</span>
                <h3 className="font-serif text-base font-black text-[#e0e2ef] group-hover:text-[#e6c184] transition-colors">
                  نافذة على المرفأ
                </h3>
                <p className="text-xs text-[#a5a7b7] line-clamp-2 mt-1 leading-relaxed">
                  حوارات ليلية بين حارس منارة متقاعد وباحث يبحث عن سفينة غارقة منذ عام ١٩٤٠ محملة بالسجلات.
                </p>
              </div>
              <div className="pt-2 border-t border-[#4e463a]/30 flex items-center justify-between text-xs font-bold text-[#e6c184]">
                <Link href={`/${locale}/interactive`} className="inline-flex items-center gap-1 group-hover:underline">
                  <span>سرد تفاعلي</span>
                  <span className="material-symbols-outlined text-[14px]">arrow_back</span>
                </Link>
                <Link href={`/${locale}/salons`} className="hover:text-[#ffdeaa]">
                  <MessageSquare className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </article>

          {/* Card 3 */}
          <article className="group flex flex-col bg-[#1c1f29] rounded-2xl overflow-hidden hover:bg-[#272a33] border border-[#4e463a]/30 hover:border-[#e6c184]/50 transition-all duration-300 transform hover:-translate-y-1.5 shadow-lg">
            <div className="relative w-full aspect-[3/4] bg-[#272a33] overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=600&q=80"
                alt="ساعات الرمل"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1c1f29] via-transparent to-transparent opacity-90" />
              <div className="absolute top-3 right-3 flex flex-col gap-1 items-start">
                <span className="px-2 py-0.5 rounded bg-[#272a33]/90 text-[#e6c184] text-[10px] font-bold">
                  مكتملة
                </span>
              </div>
              <div className="absolute bottom-3 right-3 left-3 flex items-center justify-between text-xs text-[#cdc6b8]">
                <span>١١ دقيقة قراءة</span>
                <span className="text-[#e6c184]">فلسفة وزمن</span>
              </div>
            </div>
            <div className="p-4 flex flex-col flex-1 justify-between gap-3">
              <div>
                <span className="text-[11px] text-[#e6c184] font-bold block mb-1">تأملات فلسفية</span>
                <h3 className="font-serif text-base font-black text-[#e0e2ef] group-hover:text-[#e6c184] transition-colors">
                  ساعات الرمل
                </h3>
                <p className="text-xs text-[#a5a7b7] line-clamp-2 mt-1 leading-relaxed">
                  تأمل عميق في فكرة الفقد والذاكرة التي تذوب مع مرور العقود في صحراء العزلة الممتدة.
                </p>
              </div>
              <div className="pt-2 border-t border-[#4e463a]/30 flex items-center justify-between text-xs font-bold text-[#e6c184]">
                <Link href={`/${locale}/books`} className="inline-flex items-center gap-1 group-hover:underline">
                  <span>اقرأ القصة</span>
                  <span className="material-symbols-outlined text-[14px]">arrow_back</span>
                </Link>
                <Bookmark className="w-4 h-4 text-[#9a8f81]" />
              </div>
            </div>
          </article>

          {/* Card 4 */}
          <article className="group flex flex-col bg-[#1c1f29] rounded-2xl overflow-hidden hover:bg-[#272a33] border border-[#4e463a]/30 hover:border-[#e6c184]/50 transition-all duration-300 transform hover:-translate-y-1.5 shadow-lg">
            <div className="relative w-full aspect-[3/4] bg-[#272a33] overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=600&q=80"
                alt="ورثة البحر"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1c1f29] via-transparent to-transparent opacity-90" />
              <div className="absolute top-3 right-3 flex flex-col gap-1 items-start">
                <span className="px-2 py-0.5 rounded bg-[#e6c184]/20 text-[#e6c184] text-[10px] font-bold">
                  متسلسلة
                </span>
              </div>
              <div className="absolute bottom-3 right-3 left-3 flex items-center justify-between text-xs text-[#cdc6b8]">
                <span>١٨ دقيقة قراءة</span>
                <span className="text-[#e6c184]">ملحمة أسرية</span>
              </div>
            </div>
            <div className="p-4 flex flex-col flex-1 justify-between gap-3">
              <div>
                <span className="text-[11px] text-[#e6c184] font-bold block mb-1">رواية ممتدة</span>
                <h3 className="font-serif text-base font-black text-[#e0e2ef] group-hover:text-[#e6c184] transition-colors">
                  ورثة البحر
                </h3>
                <p className="text-xs text-[#a5a7b7] line-clamp-2 mt-1 leading-relaxed">
                  صراع عائلي محتدم حول وصية تركت في قاع المحيط قبل قرن كامل تكشف أسرار النسب المحظورة.
                </p>
              </div>
              <div className="pt-2 border-t border-[#4e463a]/30 flex items-center justify-between text-xs font-bold text-[#e6c184]">
                <Link href={`/${locale}/books`} className="inline-flex items-center gap-1 group-hover:underline">
                  <span>اقرأ القصة</span>
                  <span className="material-symbols-outlined text-[14px]">arrow_back</span>
                </Link>
                <Bookmark className="w-4 h-4 text-[#9a8f81]" />
              </div>
            </div>
          </article>
        </div>
      </section>

      {/* Shelf 2: Five-Minute Dense Flash Fiction (from Stitch p01) */}
      <section className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-8 gap-3">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#cdc6b8]" />
            <div>
              <h2 className="font-serif text-2xl sm:text-3xl font-black text-[#e0e2ef] tracking-wide">
                {isRtl ? "قصص مكثفة في خمس دقائق" : "Five-Minute Flash Fiction"}
              </h2>
              <span className="text-xs text-[#a5a7b7]">
                {isRtl ? "نصوص رشيقة وعميقة لقراءات خاطفة في أوقات الانتظار" : "Dense and poetic flash stories"}
              </span>
            </div>
          </div>
          <Link
            href={`/${locale}/salons`}
            className="group inline-flex items-center gap-1 text-xs font-bold text-[#e6c184] hover:text-[#ffdeaa] transition-colors"
          >
            <span>{isRtl ? "عرض الكل (١٢)" : "View All"}</span>
            <span className="material-symbols-outlined text-[16px] group-hover:-translate-x-1 transition-transform">
              {isRtl ? "arrow_back" : "arrow_forward"}
            </span>
          </Link>
        </div>

        {/* 4 Horizontal Compact Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-start">
          {/* Flash 1 */}
          <article className="p-5 rounded-2xl bg-[#1c1f29] hover:bg-[#272a33] border border-[#4e463a]/30 hover:border-[#e6c184]/50 transition-colors flex flex-col justify-between gap-4 group shadow-md">
            <div>
              <div className="flex items-center justify-between text-xs text-[#a5a7b7] mb-2">
                <span className="text-[#e6c184] font-bold">واقعية سحرية</span>
                <span className="flex items-center gap-1 font-mono text-[11px]">
                  <span className="material-symbols-outlined text-[13px]">schedule</span> ٥ دقائق
                </span>
              </div>
              <h3 className="font-serif text-base font-black text-[#e0e2ef] group-hover:text-[#e6c184] transition-colors mb-1.5">
                شجرة الأسماء
              </h3>
              <p className="text-xs text-[#d1c5b5] line-clamp-3 leading-relaxed">
                كلما نسي أهل القرية اسم راحل، نبتت ورقة جديدة في الشجرة المجاورة للسبيل تحمل حكايته الأولى ووصيته الأخيرة.
              </p>
            </div>
            <div className="pt-3 border-t border-[#4e463a]/30 flex items-center justify-between text-xs font-bold text-[#9a8f81] group-hover:text-[#e6c184]">
              <span>اقرأ الآن</span>
              <span className="material-symbols-outlined text-[16px] group-hover:-translate-x-1 transition-transform">
                arrow_back
              </span>
            </div>
          </article>

          {/* Flash 2 */}
          <article className="p-5 rounded-2xl bg-[#1c1f29] hover:bg-[#272a33] border border-[#4e463a]/30 hover:border-[#e6c184]/50 transition-colors flex flex-col justify-between gap-4 group shadow-md">
            <div>
              <div className="flex items-center justify-between text-xs text-[#a5a7b7] mb-2">
                <span className="text-[#e6c184] font-bold">نصوص وجدانية</span>
                <span className="flex items-center gap-1 font-mono text-[11px]">
                  <span className="material-symbols-outlined text-[13px]">schedule</span> ٤ دقائق
                </span>
              </div>
              <h3 className="font-serif text-base font-black text-[#e0e2ef] group-hover:text-[#e6c184] transition-colors mb-1.5">
                مقهى عند الفجر
              </h3>
              <p className="text-xs text-[#d1c5b5] line-clamp-3 leading-relaxed">
                فنجان قهوة بارد بين يدين مرتجفتين وصوت مذياع قديم يبث ترانيم الصباح لشخص يودع محطته الأخيرة بصمت.
              </p>
            </div>
            <div className="pt-3 border-t border-[#4e463a]/30 flex items-center justify-between text-xs font-bold text-[#9a8f81] group-hover:text-[#e6c184]">
              <span>اقرأ الآن</span>
              <span className="material-symbols-outlined text-[16px] group-hover:-translate-x-1 transition-transform">
                arrow_back
              </span>
            </div>
          </article>

          {/* Flash 3 */}
          <article className="p-5 rounded-2xl bg-[#1c1f29] hover:bg-[#272a33] border border-[#4e463a]/30 hover:border-[#e6c184]/50 transition-colors flex flex-col justify-between gap-4 group shadow-md">
            <div>
              <div className="flex items-center justify-between text-xs text-[#a5a7b7] mb-2">
                <span className="text-[#e6c184] font-bold">ومضات قصصية</span>
                <span className="flex items-center gap-1 font-mono text-[11px]">
                  <span className="material-symbols-outlined text-[13px]">schedule</span> ٥ دقائق
                </span>
              </div>
              <h3 className="font-serif text-base font-black text-[#e0e2ef] group-hover:text-[#e6c184] transition-colors mb-1.5">
                الضوء الذي تأخر
              </h3>
              <p className="text-xs text-[#d1c5b5] line-clamp-3 leading-relaxed">
                ظل يبحث عن الكبريت طوال الليل في عتمة الغرفة، وحين أشرقت الشمس اكتشف أنه كان يقف في ساحة مفتوحة بلا جدران.
              </p>
            </div>
            <div className="pt-3 border-t border-[#4e463a]/30 flex items-center justify-between text-xs font-bold text-[#9a8f81] group-hover:text-[#e6c184]">
              <span>اقرأ الآن</span>
              <span className="material-symbols-outlined text-[16px] group-hover:-translate-x-1 transition-transform">
                arrow_back
              </span>
            </div>
          </article>

          {/* Flash 4 */}
          <article className="p-5 rounded-2xl bg-[#1c1f29] hover:bg-[#272a33] border border-[#4e463a]/30 hover:border-[#e6c184]/50 transition-colors flex flex-col justify-between gap-4 group shadow-md">
            <div>
              <div className="flex items-center justify-between text-xs text-[#a5a7b7] mb-2">
                <span className="text-[#e6c184] font-bold">أدب مراسلات</span>
                <span className="flex items-center gap-1 font-mono text-[11px]">
                  <span className="material-symbols-outlined text-[13px]">schedule</span> ٦ دقائق
                </span>
              </div>
              <h3 className="font-serif text-base font-black text-[#e0e2ef] group-hover:text-[#e6c184] transition-colors mb-1.5">
                مسافة بين رسالتين
              </h3>
              <p className="text-xs text-[#d1c5b5] line-clamp-3 leading-relaxed">
                ثمانية كيلومترات استغرقت ثلاثين سنة حتى قطعتها رسالة اعتذار كانت تنتظر في درج ساعي بريد متقاعد.
              </p>
            </div>
            <div className="pt-3 border-t border-[#4e463a]/30 flex items-center justify-between text-xs font-bold text-[#9a8f81] group-hover:text-[#e6c184]">
              <span>اقرأ الآن</span>
              <span className="material-symbols-outlined text-[16px] group-hover:-translate-x-1 transition-transform">
                arrow_back
              </span>
            </div>
          </article>
        </div>
      </section>

      {/* Interactive Branching Story & Family Hub Callout Bar */}
      <section className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Banner 1: Interactive Branching Fiction (P10) */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#1c1f29] via-[#272a33] to-[#10131c] border border-[#e6c184]/40 flex flex-col justify-between text-start shadow-xl">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded bg-[#e6c184]/20 text-[#e6c184] text-xs font-bold flex items-center gap-1">
                  <GitBranch className="w-3.5 h-3.5" />
                  <span>محرك السرد التفاعلي (P10)</span>
                </span>
                <span className="text-[10px] text-[#ffb4ab] bg-[#93000a]/20 px-2 py-0.5 rounded font-bold">+١٨ حصري</span>
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-black text-[#e0e2ef]">
                اصنع مسارك الروائي الخاص
              </h3>
              <p className="text-xs text-[#d1c5b5] leading-relaxed">
                أنت من يقرر مصير الأبطال في قصص متفرعة متعددة النهايات، مع إمكانية التراجع عن العقد وحفظ التقدم سحابياً.
              </p>
            </div>
            <div className="pt-6 mt-4 border-t border-[#4e463a]/30 flex items-center justify-between">
              <span className="text-xs text-[#a5a7b7]">٤ نهايات مختلفة بانتظارك</span>
              <Button asChild className="rounded-xl font-bold text-xs bg-[#e6c184] text-[#422c00] hover:bg-[#ffdeaa]">
                <Link href={`/${locale}/interactive`}>
                  <span>ابدأ التجربة التفاعلية</span>
                  <span className="material-symbols-outlined text-[16px] ms-1">arrow_back</span>
                </Link>
              </Button>
            </div>
          </div>

          {/* Banner 2: Family Hub & Parental Shield (F01) */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#181b25] via-[#202430] to-[#181b25] border border-emerald-500/30 flex flex-col justify-between text-start shadow-xl">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>مركز الأسرة والرقابة الأبوية (F01)</span>
                </span>
                <span className="text-[10px] text-emerald-300 font-mono">PIN مشفر</span>
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-black text-[#e0e2ef]">
                بيئة قراءة آمنة وخالية من المشتتات
              </h3>
              <p className="text-xs text-[#d1c5b5] leading-relaxed">
                أنشئ ملفات مخصصة لأطفالك مع حظر كامل لمحتوى البالغين (+18)، وتحديد أوقات القراءة الهادئة ومنع التتبع السلوكي.
              </p>
            </div>
            <div className="pt-6 mt-4 border-t border-[#4e463a]/30 flex items-center justify-between">
              <span className="text-xs text-[#a5a7b7]">عزل تام بين الحسابات</span>
              <Button asChild variant="outline" className="rounded-xl font-bold text-xs border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10">
                <Link href={`/${locale}/family-hub`}>
                  <span>إدارة حساب العائلة</span>
                  <span className="material-symbols-outlined text-[16px] ms-1">arrow_back</span>
                </Link>
              </Button>
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
