"use client"
import { useCatalogBooks } from "@/context/catalog-context"

import React from "react"
import Link from "@/components/common/realm-link"
import { PUBLISHING_BOOKS, StoryBookData } from "@/lib/books-data"
import { useRouter } from "next/navigation"
import { useReadingState } from "@/context/reading-state-context"


type AudiobooksViewProps = {
  locale: "ar" | "en"
}

export function AudiobooksView({ locale }: AudiobooksViewProps) {
  const PUBLISHING_BOOKS = useCatalogBooks()
  const isRtl = locale === "ar"
  const router = useRouter()
  const currentTrack: {id:string} | null = null as any
  const isPlaying = false

  const audiobooks = PUBLISHING_BOOKS.filter((b) => b.ageGroup === "adults_18_plus")
  const featured = audiobooks[0] || PUBLISHING_BOOKS[0]

  const handlePlay = (book:StoryBookData) => router.push(`/${locale}/player/${book.handle}`)

  return (
    <div className="w-full bg-[#10131c] text-[#e0e2ef] min-h-screen py-10 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute -top-32 right-1/4 w-[600px] h-[600px] bg-[#e6c184]/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-96 left-[-100px] w-[500px] h-[500px] bg-purple-950/20 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-[1280px] w-full mx-auto px-4 sm:px-6 relative z-10 space-y-12">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs font-bold text-[#d1c5b5]">
          <Link href={`/${locale}`} className="hover:text-[#e6c184] transition-colors">
            {isRtl ? "المكتبة العامة" : "Home"}
          </Link>
          <span className="text-[#4e463a]">/</span>
          <span className="text-[#e6c184]">{isRtl ? "المكتبة الصوتية والإنتاجات السردية" : "Audiobook Studio"}</span>
        </nav>

        {/* 1. Featured Audiobook Hero (Matching Stitch p08_base_1440) */}
        <div className="relative rounded-3xl bg-[#1c1f29] border border-[#4e463a]/50 p-6 sm:p-10 shadow-2xl overflow-hidden">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <div className="relative w-48 sm:w-64 aspect-[2/3] shrink-0 rounded-2xl overflow-hidden shadow-2xl border border-[#4e463a]/40 group">
              <img src={featured.coverUrl} alt={featured.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
                <span className="text-xs font-bold text-[#e6c184] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">headphones</span>
                  <span>{featured.audioDuration}</span>
                </span>
              </div>
            </div>

            <div className="flex-1 space-y-4 text-start">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-[#e6c184]/15 text-[#e6c184] text-xs font-bold border border-[#e6c184]/30">
                  {isRtl ? "قراءة النص بصوت الجهاز" : "Device text narration"}
                </span>
                <span className="px-3 py-1 rounded-full bg-[#272a33] text-[#d1c5b5] text-xs font-mono font-bold">
                  {isRtl ? "صوت الجهاز المتاح" : "Available device voice"}
                </span>
              </div>

              <h1 className="font-serif text-3xl sm:text-5xl font-black text-[#e0e2ef] leading-tight">
                {featured.title} (القراءة المسموعة)
              </h1>

              <p className="text-xs sm:text-sm text-[#d1c5b5] leading-relaxed max-w-2xl">
                {featured.description}
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => handlePlay(featured)}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#e6c184] text-[#422c00] font-black text-xs sm:text-sm shadow-lg shadow-[#e6c184]/15 hover:bg-[#ffdeaa] transition-all transform hover:-translate-y-0.5"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {currentTrack?.id === `audio_${featured.id}` && isPlaying ? "pause" : "play_arrow"}
                  </span>
                  <span>
                    {currentTrack?.id === `audio_${featured.id}` && isPlaying
                      ? isRtl ? "إيقاف مؤقت" : "Pause"
                      : isRtl ? "استمع الآن للإنتاج الصوتي" : "Play Audiobook"}
                  </span>
                </button>

                <Link
                  href={`/${locale}/player/${featured.handle}`}
                  className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-[#272a33] text-[#e0e2ef] hover:bg-[#32343e] border border-[#4e463a]/40 font-bold text-xs sm:text-sm transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px] text-[#e6c184]">graphic_eq</span>
                  <span>{isRtl ? "فتح مشغل الاستوديو مع النص المتزامن" : "Open Studio Player"}</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Binaural 3D Audio Experience Box (Stitch p08 Section 4) */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-950/40 via-[#1c1f29] to-[#1c1f29] border border-purple-500/30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-purple-500/20 text-purple-300 flex items-center justify-center shrink-0 border border-purple-500/40">
              <span className="material-symbols-outlined text-[32px]">spatial_audio_off</span>
            </div>
            <div>
              <h3 className="font-serif text-lg font-black text-[#e0e2ef]">
                {isRtl ? "تجربة الاستماع ثلاثي الأبعاد الموجه (Binaural 3D)" : "Binaural 3D Audio Experience"}
              </h3>
              <p className="text-xs text-[#d1c5b5] mt-1">
                {isRtl
                  ? "تسجيل صوتي مكاني يحاكي بهو القصور ومرافئ السفن لتشعر وكأنك في قلب الحدث. يوصى باستخدام سماعات الرأس."
                  : "Spatial audio rendering mimicking historical chambers and harbors. Headphone listening recommended."}
              </p>
            </div>
          </div>
          <span className="px-4 py-2 rounded-xl bg-purple-500/20 text-purple-300 text-xs font-bold border border-purple-500/30 shrink-0">
            {isRtl ? "تقنية نشطة 3D" : "3D Spatial Audio"}
          </span>
        </div>

        {/* 3. Audio Curations Grid (Stitch p08 Section 3) */}
        <div className="space-y-6">
          <div className="flex items-baseline justify-between border-b border-[#4e463a]/30 pb-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#e6c184]" />
              <h2 className="font-serif text-2xl font-black text-[#e0e2ef]">
                {isRtl ? "مختارات السرد المسموع والأداء الدرامي" : "Curated Studio Audio Editions"}
              </h2>
            </div>
            <span className="text-xs text-[#d1c5b5] font-mono">{audiobooks.length} {isRtl ? "رواية صوتية" : "audio titles"}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {audiobooks.map((book) => {
              const isThisPlaying = currentTrack?.id === `audio_${book.id}` && isPlaying
              return (
                <div
                  key={book.id}
                  className="group flex flex-col bg-[#1c1f29] rounded-2xl border border-[#4e463a]/40 overflow-hidden hover:border-[#e6c184] transition-all hover:shadow-2xl hover:-translate-y-1"
                >
                  <div className="relative aspect-[3/4] w-full bg-[#272a33] overflow-hidden">
                    <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <button
                      onClick={() => handlePlay(book)}
                      className="absolute bottom-3 end-3 w-10 h-10 rounded-full bg-[#e6c184] text-[#422c00] flex items-center justify-center shadow-lg transition-transform transform active:scale-90 hover:scale-110"
                    >
                      <span className="material-symbols-outlined text-[22px]">
                        {isThisPlaying ? "pause" : "play_arrow"}
                      </span>
                    </button>
                    <div className="absolute top-3 start-3">
                      <span className="px-2.5 py-0.5 rounded-full bg-black/75 backdrop-blur-md text-[10px] font-mono font-bold text-[#e6c184]">
                        {book.sampleAudioDuration || "03:10"}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 flex flex-col flex-1 justify-between space-y-3">
                    <div>
                      <span className="text-[10px] font-bold text-[#e6c184] block">
                        بصوت: {book.narrator?.name || "نخبة الرواة"}
                      </span>
                      <Link href={`/${locale}/books/${book.handle}`}>
                        <h3 className="font-serif text-sm font-black text-[#e0e2ef] group-hover:text-[#e6c184] transition-colors line-clamp-1 mt-1">
                          {book.title}
                        </h3>
                      </Link>
                      <span className="text-xs text-[#a5a7b7] block mt-0.5">بقلم: {book.author.name}</span>
                    </div>

                    <div className="pt-2 border-t border-[#4e463a]/30 flex items-center justify-between">
                      <span className="text-xs font-bold text-[#e0e2ef]">
                        {(book.audiobookPrice / 100).toFixed(0)} {isRtl ? "ر.س" : "SAR"}
                      </span>
                      <Link
                        href={`/${locale}/player/${book.handle}`}
                        className="text-[11px] font-bold text-[#e6c184] hover:underline flex items-center gap-1"
                      >
                        <span>مشغل الاستوديو</span>
                        <span className="material-symbols-outlined text-[14px]">arrow_left_alt</span>
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
