"use client"

import React, { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useCart } from "@/context/cart-context"
import { useAudio } from "@/context/audio-context"
import { formatCurrency } from "@/lib/utils"
import { StoryBookData } from "@/lib/books-data"
import { SampleReaderModal } from "@/components/reader/sample-reader-modal"
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
  Clock,
  Layers,
  Calendar,
  Globe,
  Tag,
  Gift,
  ArrowRight,
  ArrowLeft,
  Volume2,
} from "lucide-react"

type BookDetailViewProps = {
  book: StoryBookData
  locale: "ar" | "en"
}

type BookFormat = "paperback" | "ebook" | "audiobook"

export function BookDetailView({ book, locale }: BookDetailViewProps) {
  const router = useRouter()
  const { addItem, isLoading: cartLoading } = useCart()
  const { playTrack } = useAudio()

  const [selectedFormat, setSelectedFormat] = useState<BookFormat>("paperback")
  const [isSampleReaderOpen, setIsSampleReaderOpen] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const [justAdded, setJustAdded] = useState(false)
  const [bundleAdded, setBundleAdded] = useState(false)

  const isRtl = locale === "ar"

  const ageLabels = {
    kids_3_6: {
      ar: "👶 أطفال (3 - 6 سنوات)",
      en: "Kids (3-6 yrs)",
      color: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20",
    },
    kids_7_12: {
      ar: "🧒 أطفال وناشئة (7 - 12 سنة)",
      en: "Middle Grade (7-12 yrs)",
      color: "bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-500/20",
    },
    teens_13_17: {
      ar: "🧑 يافعين (13 - 17 سنة)",
      en: "Young Adults (13-17 yrs)",
      color: "bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/20",
    },
    adults_18_plus: {
      ar: "🧑‍💼 روايات عامة (18+ سنة)",
      en: "Adults (18+ yrs)",
      color: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20",
    },
  }

  const formatOptions = [
    {
      id: "paperback" as BookFormat,
      nameAr: "نسخة ورقية فاخرة",
      nameEn: "Paperback Edition",
      icon: BookOpen,
      price: book.paperbackPrice,
      variantId: book.paperbackVariantId,
      subAr: "غلاف ورقي مطبوع - توصيل سريع",
      subEn: "Printed physical copy with fast shipping",
    },
    {
      id: "ebook" as BookFormat,
      nameAr: "كتاب إلكتروني (EPUB / PDF)",
      nameEn: "E-Book Edition",
      icon: Smartphone,
      price: book.ebookPrice,
      variantId: book.ebookVariantId,
      subAr: "قراءة فورية على الأجهزة - حماية DRM",
      subEn: "Instant download and browser reader",
    },
    {
      id: "audiobook" as BookFormat,
      nameAr: "كتاب صوتي كامل (أداء درامي)",
      nameEn: "Audiobook Edition",
      icon: Headphones,
      price: book.audiobookPrice,
      variantId: book.audiobookVariantId,
      subAr: `بصوت ${book.narrator?.name || "نخبة الرواة"} - مدة ${book.audioDuration}`,
      subEn: `Narrated by ${book.narrator?.name || "Professional Cast"}`,
    },
  ]

  const activeOption = formatOptions.find((f) => f.id === selectedFormat)!

  // Bundle calculations (e.g. E-book + Audiobook bundle with 50% discount on Audiobook)
  const bundleAudioDiscount = Math.round(book.audiobookPrice * 0.5)
  const bundleTotalPrice = book.ebookPrice + bundleAudioDiscount
  const bundleSavings = book.audiobookPrice - bundleAudioDiscount

  const handlePlaySample = () => {
    playTrack({
      id: book.id,
      title: book.title,
      author: book.author.name,
      narrator: book.narrator?.name,
      coverUrl: book.coverUrl,
      audioUrl: book.sampleAudioUrl,
    })
  }

  const handleAddToCart = async () => {
    setIsAdding(true)
    try {
      await addItem(activeOption.variantId, 1)
      setJustAdded(true)
      setTimeout(() => setJustAdded(false), 2000)
    } finally {
      setIsAdding(false)
    }
  }

  const handleBuyBundle = async () => {
    setIsAdding(true)
    try {
      // Add E-book and Audiobook variants together
      await addItem(book.ebookVariantId, 1)
      await addItem(book.audiobookVariantId, 1)
      setBundleAdded(true)
      setTimeout(() => setBundleAdded(false), 2000)
      router.push(`/${locale}/checkout`)
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
        <Link href={`/${locale}`} className="hover:text-primary transition-colors">
          {locale === "ar" ? "الرئيسية" : "Home"}
        </Link>
        <span>/</span>
        <Link href={`/${locale}/books`} className="hover:text-primary transition-colors">
          {locale === "ar" ? "المكتبة والروايات" : "Books & Novels"}
        </Link>
        <span>/</span>
        <span className="text-foreground font-semibold truncate max-w-[250px]">
          {book.title}
        </span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Book Cover & Preview CTAs (5 cols) */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="relative aspect-[2/3] w-full max-w-[380px] rounded-3xl overflow-hidden stitch-book-3d border border-amber-500/30 group bg-muted">
            <Image
              src={book.coverUrl}
              alt={book.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 400px"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute top-4 start-4">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-md shadow-xs ${
                  ageLabels[book.ageGroup].color
                }`}
              >
                {locale === "ar"
                  ? ageLabels[book.ageGroup].ar
                  : ageLabels[book.ageGroup].en}
              </span>
            </div>
          </div>

          {/* Interactive Free Previews Bar */}
          <div className="w-full max-w-[380px] mt-6 grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              onClick={() => setIsSampleReaderOpen(true)}
              className="rounded-2xl h-12 text-sm font-bold gap-2 border-primary/30 hover:bg-primary/5 hover:border-primary"
            >
              <BookOpen className="w-4 h-4 text-primary" />
              <span>{locale === "ar" ? "اقرأ الفصل الأول" : "Read Chapter 1"}</span>
            </Button>

            <Button
              variant="outline"
              onClick={handlePlaySample}
              className="rounded-2xl h-12 text-sm font-bold gap-2 border-emerald-500/30 hover:bg-emerald-500/5 hover:border-emerald-500 text-emerald-600 dark:text-emerald-400"
            >
              <Volume2 className="w-4 h-4" />
              <span>{locale === "ar" ? "استمع للعينة" : "Audio Sample"}</span>
            </Button>
          </div>

          {/* Stitch Production Badges Strip (from p06_base_1440) */}
          <div className="grid grid-cols-3 gap-2 p-1.5 bg-[#1c1f29] rounded-xl border border-[#4e463a]/40 w-full max-w-[380px] mt-4 shadow-sm">
            <div className="flex items-center justify-center gap-1.5 py-2 px-1 text-center bg-[#272a33] rounded-lg text-[#e0e2ef] text-xs font-bold">
              <span className="material-symbols-outlined text-[#e6c184] text-[18px]">menu_book</span>
              <span>نص روائي مُحقق</span>
            </div>
            <div className="flex items-center justify-center gap-1.5 py-2 px-1 text-center bg-[#272a33] rounded-lg text-[#e0e2ef] text-xs font-bold">
              <span className="material-symbols-outlined text-[#e6c184] text-[18px]">graphic_eq</span>
              <span>أداء استوديو كامل</span>
            </div>
            <div className="flex items-center justify-center gap-1.5 py-2 px-1 text-center bg-[#272a33] rounded-lg text-[#e0e2ef] text-xs font-bold">
              <span className="material-symbols-outlined text-[#e6c184] text-[18px]">explore</span>
              <span>وثائق أرشيفية</span>
            </div>
          </div>

          <div className="w-full max-w-[380px] mt-3 flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="w-4 h-4 text-[#e6c184] shrink-0" />
            <span>
              {locale === "ar"
                ? "محتوى رقمي محمي بترخيص DRM وروابط بث مؤمنة مشفرة"
                : "DRM-Protected digital stream & tamper-proof assets"}
            </span>
          </div>
        </div>

        {/* Right Column: Title, Metadata, Formats, and Purchase (7 cols) */}
        <div className="lg:col-span-7 flex flex-col space-y-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight leading-tight">
              {book.title}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-4 text-sm">
              <span className="font-bold text-muted-foreground">
                {locale === "ar" ? "تأليف:" : "Author:"}{" "}
                <span className="text-foreground">{book.author.name}</span>
              </span>
              {book.narrator && (
                <>
                  <span className="opacity-30">•</span>
                  <span className="font-bold text-muted-foreground">
                    {locale === "ar" ? "أداء صوتي:" : "Narrator:"}{" "}
                    <span className="text-foreground">{book.narrator.name}</span>
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Book Format Selector */}
          <div className="space-y-3">
            <label className="text-sm font-bold text-foreground">
              {locale === "ar" ? "اختر صيغة القراءة أو الاستماع:" : "Choose Your Format:"}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {formatOptions.map((fmt) => {
                const Icon = fmt.icon
                const isSelected = selectedFormat === fmt.id
                return (
                  <button
                    key={fmt.id}
                    onClick={() => setSelectedFormat(fmt.id)}
                    className={`flex flex-col p-4 rounded-2xl border text-start transition-all relative ${
                      isSelected
                        ? "border-primary bg-primary/5 ring-2 ring-primary/20 shadow-md"
                        : "border-border hover:border-primary/50 bg-card"
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-3 end-3 w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                    <Icon
                      className={`w-5 h-5 mb-2 ${
                        isSelected ? "text-primary" : "text-muted-foreground"
                      }`}
                    />
                    <span className="font-bold text-sm text-foreground">
                      {locale === "ar" ? fmt.nameAr : fmt.nameEn}
                    </span>
                    <span className="text-[11px] text-muted-foreground mt-1 line-clamp-1">
                      {locale === "ar" ? fmt.subAr : fmt.subEn}
                    </span>
                    <span className="font-black text-base text-primary mt-3">
                      {formatCurrency(fmt.price)}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Pricing & Add to Cart Action */}
          <div className="p-6 rounded-3xl bg-muted/40 border border-border space-y-4">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-xs text-muted-foreground block">
                  {locale === "ar" ? "السعر الإجمالي للصيغة المختارة:" : "Selected Format Price:"}
                </span>
                <span className="text-3xl font-black text-foreground">
                  {formatCurrency(activeOption.price)}
                </span>
              </div>
              <Badge variant="outline" className="border-primary/30 text-primary font-bold">
                {locale === "ar" ? "شامل ضريبة القيمة المضافة" : "VAT Included"}
              </Badge>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                onClick={handleAddToCart}
                disabled={isAdding}
                className="flex-1 rounded-2xl h-14 text-base font-black gap-2 stitch-gold-gradient text-slate-950 hover:opacity-95 shadow-xl transition-all"
              >
                {isAdding ? (
                  <Loader2 className="w-5 h-5 animate-spin text-slate-950" />
                ) : justAdded ? (
                  <>
                    <Check className="w-5 h-5 stroke-[3] text-slate-950" />
                    <span>{locale === "ar" ? "تمت الإضافة للسلة!" : "Added to Cart!"}</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5 text-slate-950" />
                    <span>
                      {locale === "ar"
                        ? `إضافة ${activeOption.nameAr} إلى السلة`
                        : `Add ${activeOption.nameEn} to Cart`}
                    </span>
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                onClick={async () => {
                  await handleAddToCart()
                  router.push(`/${locale}/checkout`)
                }}
                className="rounded-2xl h-14 px-6 text-base font-bold border-amber-500/40 text-amber-600 hover:bg-amber-500/10"
              >
                <span>{locale === "ar" ? "شراء فوري" : "Buy Now"}</span>
              </Button>
            </div>
          </div>

          {/* Bundle Offer Banner (Server-side Workflow Discount) */}
          <div className="p-5 rounded-3xl bg-gradient-to-r from-primary/10 via-amber-500/10 to-primary/5 border border-primary/20 space-y-3">
            <div className="flex items-center gap-2">
              <Gift className="w-5 h-5 text-primary" />
              <span className="font-black text-sm text-foreground">
                {locale === "ar"
                  ? "باقة القارئ والمستمع الشاملة (خصم 50% على النسخة الصوتية)"
                  : "Double Format Bundle (Save 50% on Audiobook)"}
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {locale === "ar"
                ? `اجمع بين القراءة والاستماع! احصل على الكتاب الإلكتروني مع الكتاب الصوتي معًا بسعر ${formatCurrency(
                    bundleTotalPrice
                  )} فقط بدلاً من ${formatCurrency(
                    book.ebookPrice + book.audiobookPrice
                  )}، ووفّر ${formatCurrency(bundleSavings)} فوراً!`
                : `Get the E-Book + Full Audiobook bundle for only ${formatCurrency(
                    bundleTotalPrice
                  )} instead of ${formatCurrency(
                    book.ebookPrice + book.audiobookPrice
                  )}.`}
            </p>
            <Button
              onClick={handleBuyBundle}
              disabled={isAdding}
              variant="default"
              size="sm"
              className="rounded-xl text-xs font-bold gap-2 bg-foreground text-background hover:bg-foreground/90"
            >
              {bundleAdded ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>{locale === "ar" ? "تمت إضافة الباقة!" : "Bundle Added!"}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>
                    {locale === "ar"
                      ? `احصل على الباقة المزدوجة بـ ${formatCurrency(bundleTotalPrice)}`
                      : `Get Bundle for ${formatCurrency(bundleTotalPrice)}`}
                  </span>
                </>
              )}
            </Button>
          </div>

          {/* Book Synopsis & Details */}
          <div className="space-y-4 pt-4 border-t border-border">
            <h2 className="text-lg font-bold text-foreground">
              {locale === "ar" ? "عن القصة والرواية:" : "Synopsis:"}
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
              {book.description}
            </p>
          </div>

          {/* Audiobook Chapter Preview (If Audiobook has chapters) */}
          {book.audioChapters.length > 0 && (
            <div className="space-y-3 pt-4 border-t border-border">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                  <Headphones className="w-4 h-4 text-primary" />
                  <span>
                    {locale === "ar" ? "فصول الكتاب الصوتي:" : "Audiobook Chapters:"}
                  </span>
                </h3>
                <span className="text-xs text-muted-foreground">
                  {book.audioChapters.length} {locale === "ar" ? "فصول" : "chapters"} • {book.audioDuration}
                </span>
              </div>
              <div className="space-y-2">
                {book.audioChapters.map((chapter, idx) => (
                  <div
                    key={chapter.id}
                    className="flex items-center justify-between p-3 rounded-2xl bg-muted/30 border border-border/60 text-xs hover:border-primary/40 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <span className="font-semibold text-foreground">{chapter.title}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-muted-foreground font-mono">{chapter.duration}</span>
                      <button
                        onClick={() =>
                          playTrack({
                            id: chapter.id,
                            title: `${book.title} - ${chapter.title}`,
                            author: book.author.name,
                            narrator: book.narrator?.name,
                            coverUrl: book.coverUrl,
                            audioUrl: chapter.audioUrl,
                          })
                        }
                        className="p-1.5 rounded-full hover:bg-primary hover:text-primary-foreground text-primary transition-colors"
                        title={locale === "ar" ? "استماع" : "Play"}
                      >
                        <Play className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Technical Specifications Grid */}
          <div className="space-y-3 pt-4 border-t border-border">
            <h3 className="text-base font-bold text-foreground">
              {locale === "ar" ? "بطاقة البيانات والتوثيق:" : "Publishing Specifications:"}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-2xl bg-muted/30 border border-border/50">
                <span className="text-muted-foreground block mb-1">
                  {locale === "ar" ? "الرقم الدولي المعياري (ISBN):" : "ISBN:"}
                </span>
                <span className="font-mono font-bold text-foreground">{book.isbn}</span>
              </div>
              <div className="p-3 rounded-2xl bg-muted/30 border border-border/50">
                <span className="text-muted-foreground block mb-1">
                  {locale === "ar" ? "عدد الصفحات:" : "Page Count:"}
                </span>
                <span className="font-bold text-foreground">{book.pageCount} صفحة</span>
              </div>
              <div className="p-3 rounded-2xl bg-muted/30 border border-border/50">
                <span className="text-muted-foreground block mb-1">
                  {locale === "ar" ? "مدة التسجيل الصوتي:" : "Audio Duration:"}
                </span>
                <span className="font-bold text-foreground">{book.audioDuration}</span>
              </div>
              <div className="p-3 rounded-2xl bg-muted/30 border border-border/50">
                <span className="text-muted-foreground block mb-1">
                  {locale === "ar" ? "لغة العمل:" : "Language:"}
                </span>
                <span className="font-bold text-foreground">{book.language}</span>
              </div>
              <div className="p-3 rounded-2xl bg-muted/30 border border-border/50">
                <span className="text-muted-foreground block mb-1">
                  {locale === "ar" ? "تاريخ النشر:" : "Publication Date:"}
                </span>
                <span className="font-bold text-foreground">{book.publicationDate}</span>
              </div>
              <div className="p-3 rounded-2xl bg-muted/30 border border-border/50">
                <span className="text-muted-foreground block mb-1">
                  {locale === "ar" ? "دار النشر:" : "Publisher:"}
                </span>
                <span className="font-bold text-foreground">{book.publisher}</span>
              </div>
            </div>
          </div>

          {/* Author & Narrator Profiles */}
          <div className="space-y-4 pt-4 border-t border-border">
            <h3 className="text-base font-bold text-foreground">
              {locale === "ar" ? "صنّاع العمل الإبداعي:" : "Creators:"}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-muted/20 border border-border">
                <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 border">
                  <Image
                    src={book.author.avatar}
                    alt={book.author.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-foreground">{book.author.name}</span>
                    <Badge variant="secondary" className="text-[10px] py-0 px-2">
                      {locale === "ar" ? "المؤلف" : "Author"}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {book.author.bio}
                  </p>
                </div>
              </div>

              {book.narrator && (
                <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-muted/20 border border-border">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 border">
                    <Image
                      src={book.narrator.avatar}
                      alt={book.narrator.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-foreground">
                        {book.narrator.name}
                      </span>
                      <Badge variant="secondary" className="text-[10px] py-0 px-2">
                        {locale === "ar" ? "الراوي الصوتي" : "Narrator"}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {book.narrator.bio}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Free Sample Chapter Modal */}
      <SampleReaderModal
        isOpen={isSampleReaderOpen}
        onClose={() => setIsSampleReaderOpen(false)}
        bookTitle={book.title}
        authorName={book.author.name}
        sampleText={book.sampleText}
        locale={locale}
      />
    </div>
  )
}
