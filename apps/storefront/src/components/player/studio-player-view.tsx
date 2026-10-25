"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { StoryBookData } from "@/lib/books-data"
import { useAudio } from "@/context/audio-context"

type StudioPlayerViewProps = {
  book: StoryBookData
  locale: "ar" | "en"
}

export function StudioPlayerView({ book, locale }: StudioPlayerViewProps) {
  const isRtl = locale === "ar"
  const { playTrack, currentTrack, isPlaying, togglePlayPause } = useAudio()

  const [activeCueIndex, setActiveCueIndex] = useState(0)
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1)
  const [sleepTimer, setSleepTimer] = useState<string | null>(null)

  const cues = [
    { time: "00:00", text: "الفصل الأول: «الرسالة التي وصلت متأخرة بعد خمسة قرون من سقوط غرناطة»." },
    { time: "00:18", text: "في بهو الأسود بقصر الحمراء، حين انسحب آخر فوج سياحي وانطفأت الأضواء الكاشفة، بقي طارق معلقًا بنظره عند التاج الرخامي للعمود الثاني عشر." },
    { time: "00:45", text: "لم تكن النقوش الهندسية مجرد زينة معمارية؛ بل كانت تشفيراً رياضياً دقيقاً وضعه لسان الدين بن الخطيب قبيل فراره إلى فاس." },
    { time: "01:12", text: "كانت خريطة الرماد تشير إلى حوض السباع، حيث تسقط أشعة قمر منتصف الشهر القمري بزاوية ٤٥ درجة لتضيء بلاطة سرية في زاوية القاعة." },
    { time: "01:40", text: "وحين وضع طارق أطراف أصابعه على الرخام البارد، شعر باهتزاز خافت في التربة العميقة أسفل القصر، كأن آلاف المخطوطات المحفوظة كانت تتنفس." },
  ]

  useEffect(() => {
    // Start playback if not already playing this track
    if (currentTrack?.id !== `studio_${book.id}`) {
      playTrack({
        id: `studio_${book.id}`,
        title: book.title,
        author: book.author.name,
        narrator: book.narrator?.name,
        coverUrl: book.coverUrl,
        audioUrl: book.sampleAudioUrl || "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
      })
    }
  }, [book.id])

  // Advance cues periodically when playing
  useEffect(() => {
    if (!isPlaying) return
    const interval = setInterval(() => {
      setActiveCueIndex((prev) => (prev + 1) % cues.length)
    }, 6000)
    return () => clearInterval(interval)
  }, [isPlaying, cues.length])

  return (
    <div className="min-h-screen bg-[#10131c] text-[#e0e2ef] py-10 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute -top-32 right-1/4 w-[600px] h-[600px] bg-[#e6c184]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-96 left-10 w-[500px] h-[500px] bg-indigo-950/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-[1280px] w-full mx-auto px-4 sm:px-6 relative z-10 space-y-10">
        {/* Breadcrumb Bar */}
        <nav className="flex items-center justify-between gap-4 text-xs font-bold text-[#d1c5b5]">
          <div className="flex items-center gap-2 bg-[#181b25] px-4 py-2 rounded-xl border border-[#4e463a]/30">
            <Link href={`/${locale}/audiobooks`} className="hover:text-[#e6c184] transition-colors">
              {isRtl ? "المكتبة الصوتية" : "Audiobooks"}
            </Link>
            <span className="text-[#4e463a]">/</span>
            <span className="text-[#e6c184]">{book.title}</span>
            <span className="text-[#4e463a]">/</span>
            <span>{isRtl ? "مشغل الاستوديو مع النص المتزامن" : "Studio Synced Player"}</span>
          </div>

          <Link
            href={`/${locale}/books/${book.handle}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1c1f29] hover:bg-[#272a33] border border-[#4e463a]/40 text-[#e6c184] transition-colors"
          >
            <span>{isRtl ? "العودة للرواية" : "Book Details"}</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </Link>
        </nav>

        {/* Studio Player Split Layout (Matching Stitch p09_base_1440) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column (5 cols): Artwork, Technical Specs, Audio Controls */}
          <div className="lg:col-span-5 bg-[#1c1f29] border border-[#4e463a]/40 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden shadow-2xl border border-[#4e463a]/30 group">
              <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent flex items-end p-5">
                <div>
                  <span className="text-xs text-[#e6c184] font-bold block">{book.title}</span>
                  <span className="text-sm font-bold text-white block mt-0.5">
                    الراوي: {book.narrator?.name || "د. غسان الكيلاني"}
                  </span>
                </div>
              </div>
            </div>

            {/* Live Animated Audio Waveform */}
            <div className="flex items-center justify-center gap-1 h-12 bg-[#181b25] rounded-xl px-4 border border-[#4e463a]/30">
              {[40, 75, 20, 90, 60, 30, 85, 45, 100, 70, 50, 80, 35, 95, 65, 40, 80, 55, 90, 45].map((h, i) => (
                <div
                  key={i}
                  className={`w-1 bg-[#e6c184] rounded-full transition-all duration-300 ${isPlaying ? "animate-pulse" : "opacity-40"}`}
                  style={{ height: isPlaying ? `${Math.max(15, (h * (i % 3 + 1)) % 100)}%` : "20%" }}
                />
              ))}
            </div>

            {/* Technical Audio Specs Badges */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2.5 rounded-xl bg-[#272a33] border border-[#4e463a]/30">
                <span className="text-[10px] text-[#9a8f81] block">الجودة</span>
                <span className="font-bold text-[#e6c184] font-mono">24-bit / 48kHz</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#272a33] border border-[#4e463a]/30">
                <span className="text-[10px] text-[#9a8f81] block">الصيغة</span>
                <span className="font-bold text-[#e6c184] font-mono">Lossless DRM</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#272a33] border border-[#4e463a]/30">
                <span className="text-[10px] text-[#9a8f81] block">المؤثرات</span>
                <span className="font-bold text-[#e6c184] font-mono">3D Spatial</span>
              </div>
            </div>

            {/* Playback Controls & Speed Toggle */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={() => setActiveCueIndex((i) => Math.max(0, i - 1))}
                  className="w-10 h-10 rounded-xl bg-[#272a33] hover:bg-[#32343e] text-[#e0e2ef] flex items-center justify-center"
                  title="الجملة السابقة"
                >
                  <span className="material-symbols-outlined text-[20px]">replay_10</span>
                </button>

                <button
                  onClick={togglePlayPause}
                  className="w-16 h-16 rounded-full bg-[#e6c184] text-[#422c00] flex items-center justify-center shadow-xl shadow-[#e6c184]/20 hover:scale-105 active:scale-95 transition-all"
                  title={isPlaying ? "إيقاف مؤقت" : "تشغيل"}
                >
                  <span className="material-symbols-outlined text-[36px]">
                    {isPlaying ? "pause" : "play_arrow"}
                  </span>
                </button>

                <button
                  onClick={() => setActiveCueIndex((i) => Math.min(cues.length - 1, i + 1))}
                  className="w-10 h-10 rounded-xl bg-[#272a33] hover:bg-[#32343e] text-[#e0e2ef] flex items-center justify-center"
                  title="الجملة التالية"
                >
                  <span className="material-symbols-outlined text-[20px]">forward_10</span>
                </button>
              </div>

              {/* Speed & Sleep Timer Bar */}
              <div className="flex items-center justify-between text-xs font-bold pt-2 border-t border-[#4e463a]/30">
                <div className="flex items-center gap-1.5">
                  <span className="text-[#9a8f81]">السرعة:</span>
                  {[0.75, 1, 1.25, 1.5].map((spd) => (
                    <button
                      key={spd}
                      onClick={() => setPlaybackSpeed(spd)}
                      className={`px-2 py-0.5 rounded text-[11px] font-mono ${
                        playbackSpeed === spd ? "bg-[#e6c184] text-[#422c00]" : "bg-[#272a33] text-[#d1c5b5]"
                      }`}
                    >
                      {spd}x
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-[#e6c184]">bedtime</span>
                  <select
                    value={sleepTimer || ""}
                    onChange={(e) => setSleepTimer(e.target.value || null)}
                    className="bg-[#272a33] text-[#d1c5b5] text-[11px] rounded px-2 py-1 border border-[#4e463a]/40 focus:outline-none"
                  >
                    <option value="">مؤقت النوم</option>
                    <option value="15">١٥ دقيقة</option>
                    <option value="30">٣٠ دقيقة</option>
                    <option value="end">نهاية الفصل</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (7 cols): Synchronized Transcript & Cues */}
          <div className="lg:col-span-7 bg-[#1c1f29] border border-[#4e463a]/40 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-[#4e463a]/40">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#e6c184] text-[20px]">subtitles</span>
                <h2 className="font-serif text-lg font-black text-[#e0e2ef]">
                  {isRtl ? "النص السردي المتزامن حياً" : "Synchronized Live Transcript"}
                </h2>
              </div>
              <span className="text-xs text-[#9a8f81] font-mono">
                {activeCueIndex + 1} من {cues.length}
              </span>
            </div>

            <div className="space-y-4 max-h-[500px] overflow-y-auto pe-2">
              {cues.map((cue, idx) => {
                const isActive = idx === activeCueIndex
                return (
                  <div
                    key={idx}
                    onClick={() => setActiveCueIndex(idx)}
                    className={`p-4 rounded-2xl cursor-pointer transition-all duration-300 border ${
                      isActive
                        ? "bg-[#272a33] border-[#e6c184] shadow-lg transform scale-[1.01]"
                        : "bg-[#181b25] border-transparent hover:border-[#4e463a]/60 text-[#a5a7b7]"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={`text-[11px] font-mono font-bold ${isActive ? "text-[#e6c184]" : "text-[#9a8f81]"}`}>
                        {cue.time}
                      </span>
                      {isActive && (
                        <span className="px-2 py-0.5 rounded-full bg-[#e6c184]/20 text-[#e6c184] text-[10px] font-bold flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#e6c184] animate-pulse" />
                          <span>يُقرأ الآن</span>
                        </span>
                      )}
                    </div>
                    <p
                      className={`font-serif leading-relaxed text-sm sm:text-base ${
                        isActive ? "text-[#e0e2ef] font-semibold" : "text-[#a5a7b7]"
                      }`}
                    >
                      {cue.text}
                    </p>
                  </div>
                )
              })}
            </div>

            <div className="p-4 rounded-xl bg-[#181b25] border border-[#4e463a]/30 flex items-center justify-between text-xs text-[#d1c5b5]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#e6c184] text-[18px]">verified_user</span>
                <span>بث مشفر بدون تحميل مؤقت (Lossless DRM WebRTC Stream)</span>
              </div>
              <Link href={`/${locale}/reader/${book.handle}`} className="text-[#e6c184] font-bold hover:underline">
                فتح قارئ المخطوطات ←
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
