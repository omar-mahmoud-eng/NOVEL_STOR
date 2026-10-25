"use client"

import React, { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useKidsMode } from "@/context/kids-mode-context"
import { useAudio } from "@/context/audio-context"
import { useCart } from "@/context/cart-context"
import { formatCurrency } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  BookOpen,
  Headphones,
  Smartphone,
  Play,
  Pause,
  ShoppingBag,
  Sparkles,
  ShieldCheck,
  Check,
  Loader2,
  Volume2,
} from "lucide-react"

export type StoryBook = {
  id: string
  title: string
  handle: string
  author: string
  narrator?: string
  ageGroup: "kids_3_6" | "kids_7_12" | "teens_13_17" | "adults_18_plus"
  coverUrl: string
  paperbackPrice: number
  ebookPrice: number
  audiobookPrice: number
  hasAudioSample?: boolean
  sampleAudioUrl?: string
  sampleAudioDuration?: string
  defaultVariantId: string
  description: string
}

export function PublishingCatalogView({
  initialBooks,
  locale,
}: {
  initialBooks: StoryBook[]
  locale: "ar" | "en"
}) {
  const { isKidsMode } = useKidsMode()
  const { playTrack, currentTrack, isPlaying, togglePlayPause } = useAudio()
  const { addItem } = useCart()

  const [selectedAge, setSelectedAge] = useState<string>("all")
  const [addingId, setAddingId] = useState<string | null>(null)
  const [justAddedId, setJustAddedId] = useState<string | null>(null)

  // Filter books: If Kids Mode is active, automatically restrict to kids categories
  let filtered = initialBooks.filter((book) => {
    if (isKidsMode) {
      return book.ageGroup === "kids_3_6" || book.ageGroup === "kids_7_12"
    }
    if (selectedAge !== "all") {
      return book.ageGroup === selectedAge
    }
    return true
  })

  const ageCategories = [
    { id: "all", nameAr: "جميع الأروقة والفئات", nameEn: "All Realms" },
    { id: "kids_3_6", nameAr: "👶 أطفال (3 - 6 سنوات)", nameEn: "Kids (3-6 yrs)" },
    { id: "kids_7_12", nameAr: "🧒 أطفال وناشئة (7 - 12 سنة)", nameEn: "Middle Grade (7-12)" },
    { id: "teens_13_17", nameAr: "🧑 يافعين (13 - 17 سنة)", nameEn: "Teens (13-17)" },
    { id: "adults_18_plus", nameAr: "🧑‍💼 روايات عامة (18+ سنة)", nameEn: "Adults (18+)" },
  ]

  const handlePlaySample = (book: StoryBook, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (currentTrack?.id === book.id) {
      togglePlayPause()
      return
    }
    playTrack({
      id: book.id,
      title: book.title,
      author: book.author,
      narrator: book.narrator,
      coverUrl: book.coverUrl,
      audioUrl:
        book.sampleAudioUrl ||
        "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    })
  }

  const handleQuickAdd = async (variantId: string, bookId: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setAddingId(bookId)
    try {
      await addItem(variantId, 1)
      setJustAddedId(bookId)
      setTimeout(() => setJustAddedId(null), 1500)
    } finally {
      setAddingId(null)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl space-y-8">
      {/* Stitch Header Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-border/80">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Google Stitch Vibe Design • الكتالوج السيادي الشامل</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
            {locale === "ar" ? "معرض الروايات والإصدارات الحصرية" : "Sovereign Literary Showcase"}
          </h1>
          <p className="text-sm text-muted-foreground mt-2 max-w-2xl">
            {locale === "ar"
              ? "استكشف أحدث الروايات والقصص المصورة والكتب الصوتية المرخصة من دار النشر السيادية، مع عينات استماع مجانية وضمان جودة الطباعة الفاخرة."
              : "Discover masterfully curated novels, picture books, and DRM audiobooks with instant previews."}
          </p>
        </div>
      </div>

      {/* Safe Kids Mode Notification Banner */}
      {isKidsMode && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-4 animate-in fade-in duration-300">
          <div className="flex items-center gap-3">
            <span className="text-2xl">👶</span>
            <div>
              <h4 className="text-sm font-bold text-amber-900 dark:text-amber-200">
                وضع تصفح الأطفال الآمن مفعل حالياً
              </h4>
              <p className="text-xs text-amber-800/80 dark:text-amber-300/80">
                يتم الآن عرض القصص المصورة والقصص الصوتية المعتمدة للأطفال والناشئة فقط.
              </p>
            </div>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 bg-amber-200 text-amber-900 rounded-full shrink-0">
            Safe Kids Filter
          </span>
        </div>
      )}

      {/* Age Categories Filter Pills */}
      {!isKidsMode && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {ageCategories.map((cat) => {
            const isActive = selectedAge === cat.id
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedAge(cat.id)}
                className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all shrink-0 border ${
                  isActive
                    ? "stitch-gold-gradient text-white border-transparent shadow-md"
                    : "bg-card text-muted-foreground border-border/80 hover:bg-muted hover:text-foreground"
                }`}
              >
                {locale === "ar" ? cat.nameAr : cat.nameEn}
              </button>
            )
          })}
        </div>
      )}

      {/* Books Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filtered.map((book) => {
          const isThisTrackPlaying = isPlaying && currentTrack?.id === book.id

          return (
            <div
              key={book.id}
              className="stitch-card group relative flex flex-col rounded-3xl border border-border/80 bg-card overflow-hidden shadow-xs hover:shadow-2xl transition-all duration-300"
            >
              {/* Book Cover Image with Audio Sample Button */}
              <Link
                href={`/${locale}/books/${book.handle}`}
                className="relative aspect-[3/4] w-full overflow-hidden bg-muted/40 p-4 flex items-center justify-center"
              >
                {/* 3D Book Container */}
                <div className="stitch-book-3d relative w-full h-full rounded-2xl overflow-hidden shadow-lg group-hover:scale-[1.03] transition-transform duration-500">
                  <Image
                    src={book.coverUrl}
                    alt={book.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    className="object-cover"
                  />

                  {/* Audio Waveform Overlay when playing */}
                  {isThisTrackPlaying && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center gap-2 text-white">
                      <div className="flex items-center gap-1">
                        <span className="w-1 h-6 bg-amber-400 rounded-full stitch-bar-1" />
                        <span className="w-1 h-8 bg-amber-400 rounded-full stitch-bar-2" />
                        <span className="w-1 h-10 bg-amber-400 rounded-full stitch-bar-3" />
                        <span className="w-1 h-7 bg-amber-400 rounded-full stitch-bar-4" />
                        <span className="w-1 h-5 bg-amber-400 rounded-full stitch-bar-5" />
                      </div>
                      <span className="text-[11px] font-bold text-amber-300">جارٍ الاستماع...</span>
                    </div>
                  )}
                </div>

                {/* Age Category Badge */}
                <div className="absolute top-4 start-4 z-10">
                  <Badge
                    variant="outline"
                    className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-background/90 backdrop-blur-md shadow-xs border-amber-500/30 text-amber-700 dark:text-amber-300"
                  >
                    {book.ageGroup === "kids_3_6"
                      ? "3 - 6 سنوات"
                      : book.ageGroup === "kids_7_12"
                      ? "7 - 12 سنة"
                      : book.ageGroup === "teens_13_17"
                      ? "13 - 17 سنة"
                      : "18+ كبار"}
                  </Badge>
                </div>

                {/* Free Audio Preview Trigger Button */}
                {book.hasAudioSample && (
                  <button
                    onClick={(e) => handlePlaySample(book, e)}
                    className={`absolute bottom-4 end-4 z-10 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[11px] font-bold shadow-lg transition-all active:scale-95 ${
                      isThisTrackPlaying
                        ? "stitch-gold-gradient text-white animate-pulse"
                        : "bg-black/80 hover:bg-black text-white backdrop-blur-md border border-white/20"
                    }`}
                    title="استمع للعينة الصوتية المجانية"
                  >
                    {isThisTrackPlaying ? (
                      <>
                        <Pause className="w-3.5 h-3.5 fill-current" />
                        <span>إيقاف</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>عينة صوتية</span>
                      </>
                    )}
                  </button>
                )}
              </Link>

              {/* Book Meta Details */}
              <div className="flex flex-col flex-1 p-5 space-y-3">
                <div>
                  <span className="text-[11px] font-bold text-amber-700/80 dark:text-amber-400/80 block">
                    بقلم: {book.author}
                  </span>
                  <Link href={`/${locale}/books/${book.handle}`}>
                    <h3 className="font-extrabold text-base text-foreground group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors line-clamp-1 mt-0.5">
                      {book.title}
                    </h3>
                  </Link>
                  {book.narrator && (
                    <span className="text-[10px] text-muted-foreground font-medium block mt-0.5">
                      🎙️ الراوي الصوتي: {book.narrator}
                    </span>
                  )}
                </div>

                {/* Multi-Format Badges */}
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground">
                  <span className="flex items-center gap-1 bg-muted/60 px-2 py-0.5 rounded-md border border-border/50">
                    <BookOpen className="w-3 h-3 text-amber-500" /> ورقي
                  </span>
                  <span className="flex items-center gap-1 bg-muted/60 px-2 py-0.5 rounded-md border border-border/50">
                    <Smartphone className="w-3 h-3 text-amber-500" /> إلكتروني
                  </span>
                  <span className="flex items-center gap-1 bg-muted/60 px-2 py-0.5 rounded-md border border-border/50">
                    <Headphones className="w-3 h-3 text-amber-500" /> صوتي
                  </span>
                </div>

                {/* Starting Price & CTA */}
                <div className="pt-3 border-t border-border/70 flex items-baseline justify-between mt-auto">
                  <div>
                    <span className="text-[10px] text-muted-foreground block">يبدأ من</span>
                    <span className="text-lg font-black text-foreground">
                      {formatCurrency(book.ebookPrice, "SAR", locale)}
                    </span>
                  </div>

                  <Button
                    variant="default"
                    size="sm"
                    onClick={(e) => handleQuickAdd(book.defaultVariantId, book.id, e)}
                    disabled={addingId === book.id}
                    className={`rounded-xl h-9 text-xs font-bold gap-1.5 transition-all ${
                      justAddedId === book.id
                        ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/30"
                        : "stitch-gold-gradient text-white border-0 shadow-xs"
                    }`}
                  >
                    {addingId === book.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : justAddedId === book.id ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span>تمت!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>طلب سريع</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
