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
  ShoppingBag,
  Sparkles,
  ShieldCheck,
  Check,
  Loader2,
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
  const { playTrack } = useAudio()
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
    { id: "all", nameAr: "جميع الفئات العمرية", nameEn: "All Ages" },
    { id: "kids_3_6", nameAr: "👶 أطفال (3 - 6 سنوات)", nameEn: "Kids (3-6 yrs)" },
    { id: "kids_7_12", nameAr: "🧒 أطفال وناشئة (7 - 12 سنة)", nameEn: "Middle Grade (7-12)" },
    { id: "teens_13_17", nameAr: "🧑 يافعين (13 - 17 سنة)", nameEn: "Teens (13-17)" },
    { id: "adults_18_plus", nameAr: "🧑‍💼 روايات عامة (18+ سنة)", nameEn: "Adults (18+)" },
  ]

  const handlePlaySample = (book: StoryBook, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
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
    <div className="space-y-8">
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

      {/* Age Categories Filter Pills (Disabled if Kids Mode is forced) */}
      {!isKidsMode && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {ageCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedAge(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 border ${
                selectedAge === cat.id
                  ? "bg-primary text-primary-foreground border-primary shadow-xs"
                  : "bg-background text-muted-foreground border-border hover:bg-muted hover:text-foreground"
              }`}
            >
              {locale === "ar" ? cat.nameAr : cat.nameEn}
            </button>
          ))}
        </div>
      )}

      {/* Books Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filtered.map((book) => (
          <div
            key={book.id}
            className="group relative flex flex-col rounded-3xl border border-border bg-card overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300"
          >
            {/* Book Cover Image with Audio Sample Button */}
            <Link
              href={`/${locale}/books/${book.handle}`}
              className="relative aspect-[3/4] w-full overflow-hidden bg-muted"
            >
              <Image
                src={book.coverUrl}
                alt={book.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />

              {/* Age Category Badge */}
              <div className="absolute top-3 start-3">
                <Badge
                  color={
                    book.ageGroup === "kids_3_6"
                      ? "green"
                      : book.ageGroup === "kids_7_12"
                      ? "blue"
                      : book.ageGroup === "teens_13_17"
                      ? "purple"
                      : "grey"
                  }
                  className="text-[10px] font-bold shadow-sm"
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
                  className="absolute bottom-3 end-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/75 backdrop-blur-md text-white text-[11px] font-bold hover:bg-primary transition-colors shadow-lg active:scale-95"
                  title="استمع للعينة الصوتية المجانية"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>عينة صوتية</span>
                </button>
              )}
            </Link>

            {/* Book Meta Details */}
            <div className="flex flex-col flex-1 p-5 space-y-3">
              <div>
                <span className="text-[11px] font-medium text-muted-foreground block">
                  بقلم: {book.author}
                </span>
                <Link href={`/${locale}/books/${book.handle}`}>
                  <h3 className="font-extrabold text-base text-foreground group-hover:text-primary transition-colors line-clamp-1 mt-0.5">
                    {book.title}
                  </h3>
                </Link>
                {book.narrator && (
                  <span className="text-[10px] text-primary/80 font-semibold block mt-0.5">
                    🎙️ الراوي الصوتي: {book.narrator}
                  </span>
                )}
              </div>

              {/* Multi-Format Badges */}
              <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground">
                <span className="flex items-center gap-1 bg-muted px-2 py-0.5 rounded-md">
                  <BookOpen className="w-3 h-3" /> ورقي
                </span>
                <span className="flex items-center gap-1 bg-muted px-2 py-0.5 rounded-md">
                  <Smartphone className="w-3 h-3" /> إلكتروني
                </span>
                <span className="flex items-center gap-1 bg-muted px-2 py-0.5 rounded-md">
                  <Headphones className="w-3 h-3" /> صوتي
                </span>
              </div>

              {/* Starting Price */}
              <div className="pt-2 border-t border-border flex items-baseline justify-between mt-auto">
                <div>
                  <span className="text-xs text-muted-foreground block">يبدأ من</span>
                  <span className="text-lg font-black text-foreground">
                    {formatCurrency(book.ebookPrice, "SAR", locale)}
                  </span>
                </div>

                <Button
                  variant="default"
                  size="sm"
                  onClick={(e) => handleQuickAdd(book.defaultVariantId, book.id, e)}
                  disabled={addingId === book.id}
                  className="rounded-xl h-9 text-xs font-bold gap-1.5"
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
        ))}
      </div>
    </div>
  )
}
