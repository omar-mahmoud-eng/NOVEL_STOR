"use client"

import React from "react"
import Link from "next/link"
import { PUBLISHING_BOOKS } from "@/lib/books-data"
import { useAudio } from "@/context/audio-context"

type LittleRealmViewProps = {
  locale: "ar" | "en"
}

export function LittleRealmView({ locale }: LittleRealmViewProps) {
  const isRtl = locale === "ar"
  const littleBooks = PUBLISHING_BOOKS.filter((b) => b.ageGroup === "kids_3_6")
  const { playTrack, currentTrack, isPlaying, togglePlayPause } = useAudio()

  const handlePlayBedtime = (book: any) => {
    if (currentTrack?.id === `little_${book.id}` && isPlaying) {
      togglePlayPause()
      return
    }

    playTrack({
      id: `little_${book.id}`,
      title: `${book.title} (حكاية هادئة)`,
      author: book.author.name,
      narrator: book.narrator?.name,
      coverUrl: book.coverUrl,
      audioUrl: book.sampleAudioUrl || "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    })
  }

  return (
    <div className="min-h-screen bg-[#141217] text-[#f5ebe1] py-10 relative overflow-hidden">
      {/* Warm Peach & Amber glow */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-96 left-[-100px] w-[500px] h-[500px] bg-rose-500/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-[1280px] w-full mx-auto px-4 sm:px-6 relative z-10 space-y-12">
        {/* Sub-Header Contextual Bar (Matching Stitch l01_base_1440) */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-3xl bg-[#201c24]/90 border border-amber-500/30 text-xs backdrop-blur-md">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🧸</span>
            <div>
              <span className="font-bold text-amber-300 text-sm block">
                {isRtl ? "واحَةُ بَرَاعِمِ الأَطْفَالِ (٣ - ٦ سَنَوَاتٍ)" : "StoryVerse Little (Ages 3-6)"}
              </span>
              <span className="text-xs text-[#d1c5b5]">
                {isRtl ? "تَشْكِيلٌ كَامِلٌ لِلْحُرُوفِ • حِكَايَاتُ مَا قَبْلَ النَّوْمِ الهَادِئَةِ" : "Full Vowel Marks • Gentle Bedtime Stories"}
              </span>
            </div>
          </div>

          <Link
            href={`/${locale}/books?age=kids_3_6`}
            className="px-4 py-2 rounded-2xl bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 font-bold flex items-center gap-1.5 transition-colors"
          >
            <span>{isRtl ? "كُلُّ قِصَصِ الصِّغَارِ" : "All Little Tales"}</span>
            <span className="material-symbols-outlined text-[16px]">arrow_left_alt</span>
          </Link>
        </div>

        {/* Hero Spotlight: «مِظَلَّةُ نُونُو وَالأَمْطَارُ اللَّامِعَةُ» (Stitch l01_base_1440) */}
        <div className="relative rounded-3xl bg-gradient-to-r from-amber-950/40 via-[#201c24] to-[#201c24] border border-amber-500/40 p-6 sm:p-10 shadow-2xl overflow-hidden">
          <div className="flex flex-col lg:flex-row items-center gap-10">
            <div className="relative w-56 sm:w-72 aspect-square shrink-0 rounded-3xl overflow-hidden shadow-2xl border border-amber-500/40 group">
              <img
                src={littleBooks[0]?.coverUrl || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&q=80"}
                alt="مظلة نونو"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 start-3">
                <span className="px-3 py-1.5 rounded-full bg-amber-500 text-slate-950 font-black text-xs shadow-md">
                  حِكَايَةُ اللَّيْلَةِ 🌙
                </span>
              </div>
            </div>

            <div className="flex-1 space-y-4 text-start">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-400 text-[24px]">bedtime</span>
                <span className="text-amber-400 font-bold text-xs">
                  {isRtl ? "مُخَصَّصَةٌ لِلاسْتِرْخَاءِ وَالنَّوْمِ الهَادِئِ" : "Designed for Peaceful Sleep"}
                </span>
              </div>

              <h1 className="font-serif text-3xl sm:text-5xl font-black text-[#f5ebe1] leading-snug">
                {isRtl ? "مِظَلَّةُ نُونُو وَالأَمْطَارُ اللَّامِعَةُ" : "Nunu's Shiny Umbrella"}
              </h1>

              <p className="text-sm sm:text-base text-[#d1c5b5] leading-relaxed max-w-2xl font-serif">
                {isRtl
                  ? "«كَانَ الأَرْنَبُ الصَّغِيرُ نُونُو يَجْلِسُ عِنْدَ نَافِذَتِهِ، حِينَ بَدَأَتِ السَّمَاءُ تُمْطِرُ قَطَرَاتٍ بَرَّاقَةً تُشْبِهُ النُّجُومَ الصَّغِيرَةَ. فَتَحَ مِظَلَّتَهُ الصَّفْرَاءَ الدَّافِئَةَ، وَسَمِعَ صَوْتَ المَطَرِ كَمُوسِيقَى هَادِئَةٍ تَهْمِسُ لَهُ: نَمْ بِسَلَامٍ...»"
                  : "A gentle bedtime tale following little bunny Nunu and his yellow umbrella on a cozy rainy night."}
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => handlePlayBedtime(littleBooks[0])}
                  className="inline-flex items-center gap-2 px-6 py-4 rounded-2xl bg-[#e6c184] text-[#422c00] font-black text-sm shadow-xl hover:bg-[#ffdeaa] transition-all transform hover:-translate-y-0.5"
                >
                  <span className="material-symbols-outlined text-[24px]">
                    {currentTrack?.id === `little_${littleBooks[0]?.id}` && isPlaying ? "pause" : "play_arrow"}
                  </span>
                  <span>{isRtl ? "اسْتَمِعْ لِحِكَايَةِ النَّوْمِ (صَوْتٌ مَهْدِئٌ)" : "Play Sleep Story"}</span>
                </button>

                <Link
                  href={`/${locale}/books/${littleBooks[0]?.handle || "samsem-the-bunny-adventure"}`}
                  className="inline-flex items-center gap-2 px-5 py-4 rounded-2xl bg-[#2c2633] text-[#f5ebe1] hover:bg-[#383141] border border-amber-500/30 font-bold text-sm transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px] text-amber-400">auto_stories</span>
                  <span>{isRtl ? "افْتَحِ القِصَّةَ المُصَوَّرَةَ" : "Open Picture Book"}</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Big Touch-Friendly Bedtime Stories Shelf (Stitch l01) */}
        <div className="space-y-6">
          <div className="flex items-baseline justify-between border-b border-amber-500/30 pb-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-400" />
              <h2 className="font-serif text-2xl font-black text-[#f5ebe1]">
                {isRtl ? "قِصَصُ مَا قَبْلَ النَّوْمِ لِلصِّغَارِ" : "Bedtime Audio Tales"}
              </h2>
            </div>
            <span className="text-xs text-[#d1c5b5]">{isRtl ? "تَشْكِيلٌ كَامِلٌ" : "Vocalized Text"}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {littleBooks.map((book) => (
              <div
                key={book.id}
                className="group p-6 rounded-3xl bg-[#201c24] border border-amber-500/20 hover:border-amber-400/80 transition-all hover:shadow-2xl hover:-translate-y-1 flex flex-col justify-between space-y-4"
              >
                <div className="flex gap-4 items-center">
                  <div className="relative w-24 aspect-square shrink-0 rounded-2xl overflow-hidden border border-amber-500/30 shadow-md">
                    <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="space-y-1 text-start">
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono text-[10px] font-bold">
                      ٣ - ٦ سَنَوَاتٍ
                    </span>
                    <h3 className="font-serif text-base font-black text-[#f5ebe1] group-hover:text-amber-300 transition-colors line-clamp-1">
                      {book.title}
                    </h3>
                    <p className="text-xs text-[#d1c5b5] line-clamp-2">{book.description}</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-amber-500/20 flex items-center justify-between">
                  <button
                    onClick={() => handlePlayBedtime(book)}
                    className="px-4 py-2 rounded-xl bg-amber-500/20 text-amber-300 hover:bg-amber-500 text-xs font-bold hover:text-slate-950 transition-colors flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[16px]">play_arrow</span>
                    <span>{isRtl ? "اسْتِمَاعٌ هَادِئٌ" : "Listen"}</span>
                  </button>

                  <Link
                    href={`/${locale}/books/${book.handle}`}
                    className="text-xs font-bold text-amber-400 hover:underline flex items-center gap-1"
                  >
                    <span>{isRtl ? "قِرَاءَةٌ" : "Read"}</span>
                    <span className="material-symbols-outlined text-[14px]">arrow_left_alt</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
