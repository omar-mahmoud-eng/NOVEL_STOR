"use client"
import { useCatalogBooks } from "@/context/catalog-context"
import {PublishedShelf} from "@/components/realms/published-shelf"

import React, { useState } from "react"
import Link from "@/components/common/realm-link"
import { useRouter } from "next/navigation"
import { useReadingState } from "@/context/reading-state-context"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useNarration } from "@/hooks/use-narration"

type LittleRealmViewProps = {
  locale: "ar" | "en"
}

export function LittleRealmView({ locale }: LittleRealmViewProps) {
  const publishedBooks = useCatalogBooks()
  const isRtl = locale === "ar"
  const router = useRouter()
  const narration = useNarration()
  const [selectedMode, setSelectedMode] = useState<number>(2) // 2 = اقرأ معي
  const [audioPromptPlaying, setAudioPromptPlaying] = useState(false)
  const [showPinModal, setShowPinModal] = useState(false)
  const [pinInput, setPinInput] = useState("")
  const [pinError, setPinError] = useState(false)

  const handleAudioInstruction = () => narration.speak(isRtl ? "اختر حكاية. يمكنك قراءتها مع أسرتك، أو سماع النص بصوت الجهاز، أو اختيار طريق الحكاية." : "Choose a story to read together, listen to the text, or choose a story path.",1,locale)
  const handlePlayStory = (storyId:string,title:string,coverUrl:string) => router.push(`/${locale}/realms/little/player/${storyId==="story_nono_umbrella"?"book_little_01":"book_little_04"}`)
  const handleVerifyPin = (event:React.FormEvent) => {event.preventDefault(); const answer=pinInput.replace(/[٠-٩]/g,c=>String("٠١٢٣٤٥٦٧٨٩".indexOf(c))); if(answer==="25")router.push(`/${locale}/family-hub`);else setPinError(true)}

  if (!publishedBooks.some(book=>book.id==="book_little_01")) return <PublishedShelf realm="little" locale={locale}/>
  return (
    <div className="w-full min-h-screen bg-[#FFF8F4] text-[#2B231E] py-8 sm:py-12 relative overflow-hidden font-sans">
      {/* Subtle decorative ambient glow backdrops */}
      <div className="absolute -top-32 right-1/4 w-96 h-96 bg-[#FFDBCB]/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-48 left-10 w-80 h-80 bg-[#D8E6DF]/40 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">
        {/* Top Contextual Realm Navigation Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white/80 border border-[#F3E7DE] shadow-sm backdrop-blur-md">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-full bg-[#D8E6DF] text-[#1E3E32] flex items-center justify-center font-bold text-xl shrink-0">
              🧸
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#7B563E] text-base">
                  {isRtl ? "وَاحَةُ البَرَاعِمِ (٣ – ٦ سَنَوَات)" : "StoryVerse Little (Ages 3-6)"}
                </span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#EADDFF] text-[#21005D]">
                  {isRtl ? "تَشْكِيلٌ كَامِلٌ" : "Full Vowels"}
                </span>
              </div>
              <p className="text-xs text-[#5A4B42]">
                {isRtl
                  ? "مَسَاحَةٌ هَادِئَةٌ لِلْقِرَاءَةِ المُشْتَرَكَةِ • خَالِيَةٌ مِنَ الشَّاشَاتِ الضَّاغِطَةِ"
                  : "Calm co-reading sanctuary • Free from pressure or ads"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowPinModal(true)}
              className="px-4 py-2 rounded-full bg-white border border-[#D8E6DF] text-[#4A6458] hover:bg-[#D8E6DF] font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm"
            >
              <span className="material-symbols-outlined text-[16px]">shield_person</span>
              <span>{isRtl ? "بَوَّابَةُ الأَهْلِ" : "Parent Gate"}</span>
            </button>
            <Link
              href={`/${locale}/books?age=kids_3_6`}
              className="px-4 py-2 rounded-full bg-[#7B563E] text-white hover:bg-[#60432F] font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm"
            >
              <span>{isRtl ? "كُلُّ قِصَصِ البَرَاعِمِ" : "All Little Tales"}</span>
              <span className="material-symbols-outlined text-[16px] rtl:rotate-180">arrow_forward</span>
            </Link>
          </div>
        </div>

        {/* Co-Reading Welcome Banner (Authentic Stitch L01) */}
        <section className="relative bg-white rounded-3xl p-6 sm:p-10 shadow-[0_12px_36px_rgba(43,58,77,0.06)] border border-[#F3E7DE] overflow-hidden">
          <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-[#FFDBCB]/30 rounded-full pointer-events-none" />
          <div className="absolute top-6 left-12 opacity-10 hidden lg:block text-[#4A6458] pointer-events-none">
            <span className="material-symbols-outlined text-[140px]">auto_stories</span>
          </div>

          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10">
            <div className="flex flex-col items-start gap-3 text-right max-w-2xl">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D8E6DF] text-[#1E3E32]">
                <span className="material-symbols-outlined text-[18px]">family_star</span>
                <span className="text-xs font-bold">
                  {isRtl ? "جَلْسَةُ قِرَاءَةٍ مُشْتَرَكَةٍ وَمُرِيحَةٍ" : "Co-reading & Bonding Time"}
                </span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-extrabold text-[#2B231E] tracking-tight leading-tight">
                {isRtl ? "اخْتَارُوا حِكَايَتَكُمْ" : "Choose Your Story Together"}
              </h1>
              <p className="text-base sm:text-lg text-[#5A4B42] font-medium leading-relaxed">
                {isRtl
                  ? "حِكَايَةٌ دَافِئَةٌ نَتَشَارَكُهَا مَعًا بَيْنَ الصَّغِيرِ وَالأَهْلِ، بِأَصْوَاتٍ هَادِئَةٍ وَتَشْكِيلٍ كَامِلٍ لِلْحُرُوفِ."
                  : "A warm story shared between child and parent, with soothing narration and large vocalized text."}
              </p>
            </div>

            {/* Audio Instruction Button (>56px target) */}
            <div className="w-full lg:w-auto flex flex-col items-stretch lg:items-end gap-2">
              <button
                onClick={handleAudioInstruction}
                type="button"
                aria-label="استمع للتعليمات الصوتية بصوت هادئ"
                className={`min-h-[58px] px-8 py-3.5 rounded-full font-bold transition-all duration-300 shadow-[0_8px_20px_rgba(123,86,62,0.18)] flex items-center justify-center gap-3 active:scale-95 group ${
                  audioPromptPlaying
                    ? "bg-[#4A6458] text-white"
                    : "bg-[#7B563E] text-white hover:bg-[#60432F]"
                }`}
              >
                <span className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white">
                  <span className="material-symbols-outlined text-[24px]">
                    {narration.speaking ? "graphic_eq" : "volume_up"}
                  </span>
                </span>
                <span className="text-sm sm:text-base font-bold">
                  {audioPromptPlaying
                    ? isRtl
                      ? "جَارٍ تَشْغِيلُ الإِرْشَادَاتِ الهَادِئَةِ..."
                      : "Playing gentle guide..."
                    : isRtl
                    ? "اسْتَمِعْ لِلتَّعْلِيمَاتِ الصَّوْتِيَّةِ"
                    : "Listen to Audio Guide"}
                </span>
              </button>
              <span className="text-xs text-[#7B563E] text-center lg:text-left self-center lg:self-end">
                {isRtl ? "صوت لطيف موجه للأطفال والأمهات والآباء" : "Gentle voice crafted for toddlers and parents"}
              </span>
            </div>
          </div>
        </section>

        {/* 5 Simple Interactive Reading Modes (Horizontal Pill Bar - Stitch L01) */}
        <nav aria-label="أوضاع الاستكشاف والقراءة" className="mt-8">
          <div className="bg-white p-2 sm:p-2.5 rounded-2xl shadow-[0_8px_24px_rgba(43,58,77,0.04)] border border-[#F3E7DE] grid grid-cols-2 md:grid-cols-5 gap-2">
            {[
              { id: 1, icon: "🎧", titleAr: "اسمع فقط", titleEn: "Listen Only" },
              { id: 2, icon: "📖", titleAr: "اقرأ معي", titleEn: "Read With Me" },
              { id: 3, icon: "🌙", titleAr: "قبل النوم", titleEn: "Bedtime" },
              { id: 4, icon: "🎨", titleAr: "قصة بالصور", titleEn: "Picture Story" },
              { id: 5, icon: "🧭", titleAr: "اختر الطريق", titleEn: "Choose Path" },
            ].map((mode) => {
              const active = selectedMode === mode.id
              return (
                <button
                  key={mode.id}
                  onClick={() => setSelectedMode(mode.id)}
                  type="button"
                  className={`min-h-[60px] px-4 py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm active:scale-95 ${
                    mode.id === 5 ? "col-span-2 md:col-span-1" : ""
                  } ${
                    active
                      ? "bg-[#7B563E] text-white shadow-md font-bold scale-[1.02]"
                      : "bg-[#FFF9F5] text-[#2B231E] hover:bg-[#D8E6DF] font-semibold"
                  }`}
                >
                  <span className="text-2xl">{mode.icon}</span>
                  <span className="text-sm font-bold">{isRtl ? mode.titleAr : mode.titleEn}</span>
                </button>
              )
            })}
          </div>
        </nav>

        {/* Main Visual Story Exploration: 4 Picture-led Story Choices (Stitch L01) */}
        <section aria-label="مكتبة الحكايات المصورة" className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-3.5 h-8 rounded-full bg-[#7B563E]" />
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2B231E]">
                {isRtl ? "حِكَايَاتُ اليَوْمِ المَحْبُوبَةُ" : "Today's Cherished Stories"}
              </h2>
            </div>
            <span className="text-xs font-bold text-[#1E3E32] bg-[#D8E6DF] px-4 py-1.5 rounded-full">
              {isRtl ? "٤ حِكَايَاتٍ مُجَهَّزَةٍ بِالصَّوْتِ التَّفَاعُلِيِّ" : "4 Interactive Audio Tales"}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 items-stretch">
            {/* CARD 1: Featured Story «مِظَلَّةُ نُونُو الصَّفْرَاء» (7 columns) */}
            <article className="lg:col-span-7 bg-white rounded-3xl overflow-hidden shadow-[0_16px_40px_rgba(43,58,77,0.08)] border border-[#F3E7DE] flex flex-col transition-transform hover:-translate-y-1 duration-300">
              <div className="relative w-full aspect-[16/10] overflow-hidden bg-[#FFF8F4]">
                <img
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBxb208hW12gFg2tY5GSLbhYE7jeHSp7HDqQSr1e4SJK323JCyNHkcX4-a1z7HP8_6vFUK_rSpS7ZbAAqX1ooqYWzqo_aKCr6ke5F6uzsRoMMKjr-KJT-tjqx7Fa4sLj1o75aAlAwHHjb5C4uuUAIi-b1Larx0rdSJEEEB-OzYuvFpba44vMQsH9O6t1zNxdf_wj0WfdqBkRrccN1ZUYBvdgaDs5-5LS-mShyh5qo5H0iKXhsC30xHj"
                  alt="مظلة نونو الصفراء"
                />
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-3.5 py-1 rounded-full shadow-sm flex items-center gap-1.5 text-[#2B231E]">
                  <span className="material-symbols-outlined text-[18px] text-[#7B563E]">schedule</span>
                  <span className="text-xs font-bold">{isRtl ? "٤ دَقَائِق" : "4 mins"}</span>
                </div>
                <div className="absolute top-4 left-4 bg-[#FFDBCB] px-3.5 py-1 rounded-full text-[#7B563E] text-xs font-bold">
                  {isRtl ? "حِكَايَةُ الأُسْبُوعِ" : "Story of the Week"}
                </div>
              </div>

              <div className="p-6 sm:p-8 flex flex-col flex-1 justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-[#4A6458] mb-1.5">
                    <span>{isRtl ? "الصَّدَاقَةُ وَالاكْتِشَافُ" : "Friendship & Discovery"}</span>
                    <span>•</span>
                    <span>{isRtl ? "لِلْفِئَةِ ٣-٥ سَنَوَاتٍ" : "Ages 3-5"}</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-[#2B231E] leading-snug">
                    {isRtl ? "مِظَلَّةُ نُونُو الصَّفْرَاءُ" : "Nono's Yellow Umbrella"}
                  </h3>
                  <p className="text-sm sm:text-base text-[#5A4B42] mt-2 leading-relaxed">
                    {isRtl
                      ? "يَرْتَدِي نُونُو مِعْطَفَهُ الأَصْفَرَ الجَمِيلَ وَيَبْحَثُ عَنْ قَطَرَاتِ المَطَرِ لِيُسَلِّمَ عَلَى صَدِيقِهِ العُصْفُورِ الصَّغِيرِ."
                      : "Little Nono puts on his cheerful yellow coat, stepping playfully through gentle rain ripples to greet his little bluebird companion."}
                  </p>
                </div>

                <div className="pt-4 flex flex-wrap items-center gap-3">
                  <Link
                    href={`/${locale}/realms/little/${selectedMode===1?"player":selectedMode===3?"illustrated":selectedMode===4?"words":selectedMode===5?"interactive":"reader"}/book_little_01`}
                    className="min-h-[56px] flex-1 px-6 rounded-full bg-[#7B563E] text-white hover:bg-[#60432F] transition-all flex items-center justify-center gap-2 shadow-[0_8px_20px_rgba(123,86,62,0.22)] active:scale-95 font-bold text-sm sm:text-base"
                  >
                    <span className="material-symbols-outlined text-[22px]">menu_book</span>
                    <span>{isRtl ? "اقْرَأْ مَعِي" : "Read With Me"}</span>
                  </Link>
                  <button
                    onClick={() =>
                      handlePlayStory(
                        "story_nono_umbrella",
                        isRtl ? "مِظَلَّةُ نُونُو الصَّفْرَاء" : "Nono's Yellow Umbrella",
                        "https://lh3.googleusercontent.com/aida-public/AB6AXuBxb208hW12gFg2tY5GSLbhYE7jeHSp7HDqQSr1e4SJK323JCyNHkcX4-a1z7HP8_6vFUK_rSpS7ZbAAqX1ooqYWzqo_aKCr6ke5F6uzsRoMMKjr-KJT-tjqx7Fa4sLj1o75aAlAwHHjb5C4uuUAIi-b1Larx0rdSJEEEB-OzYuvFpba44vMQsH9O6t1zNxdf_wj0WfdqBkRrccN1ZUYBvdgaDs5-5LS-mShyh5qo5H0iKXhsC30xHj"
                      )
                    }
                    type="button"
                    className="min-h-[56px] flex-1 px-6 rounded-full bg-[#D8E6DF] text-[#1E3E32] hover:bg-[#b8d4c7] transition-all flex items-center justify-center gap-2 shadow-sm active:scale-95 font-bold text-sm sm:text-base"
                  >
                    <span className="material-symbols-outlined text-[22px]">
                      {false
                        ? "pause_circle"
                        : "play_circle"}
                    </span>
                    <span>{isRtl ? "اسْمَعْ الحِكَايَةَ" : "Listen to Story"}</span>
                  </button>
                </div>
              </div>
            </article>

            {/* CARD 2: «وِسَادَةُ الغَيْمَةِ» (5 columns) */}
            <article className="lg:col-span-5 bg-white rounded-3xl overflow-hidden shadow-[0_16px_40px_rgba(43,58,77,0.06)] border border-[#F3E7DE] flex flex-col justify-between transition-transform hover:-translate-y-1 duration-300">
              <div className="relative w-full aspect-[16/10] overflow-hidden bg-[#FFF8F4]">
                <img
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBXOFSO42Vr1MaTK5SgTCDBZue1vmE78JbrP4IIcbQ3-a1gqcCSCpvx9wg_Ao8kPYiqMKbjjNVPW7B3aloTUSLUflARDfZhHjYuYJh37iifHlJ6NVHrCfGJY3j6kS4_tPm0Ou74j1dufquzj5osiP9jTC_bvoqKzpueSmhuZxHFJBhl76a9M3HYyWE0mRHoA-2u7D0TU1l_6HEk004-Z_KrSKuqXDJdOi1gm1gk6bMtfCjKVzrCHtFv"
                  alt="وسادة الغيمة"
                />
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-3.5 py-1 rounded-full shadow-sm flex items-center gap-1.5 text-[#2B231E]">
                  <span className="material-symbols-outlined text-[18px] text-[#585981]">schedule</span>
                  <span className="text-xs font-bold">{isRtl ? "٥ دَقَائِق" : "5 mins"}</span>
                </div>
                <div className="absolute top-4 left-4 bg-[#DFE0FF] px-3.5 py-1 rounded-full text-[#21005D] text-xs font-bold">
                  {isRtl ? "تَهْيِئَةٌ لِلنَّوْمِ" : "Bedtime Calmer"}
                </div>
              </div>

              <div className="p-6 sm:p-8 flex flex-col flex-1 justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-[#4A6458] mb-1.5">
                    <span>{isRtl ? "قِصَصُ الاِسْتِرْخَاءِ" : "Relaxation Tales"}</span>
                  </div>
                  <h3 className="text-2xl font-extrabold text-[#2B231E] leading-tight">
                    {isRtl ? "وِسَادَةُ الغَيْمَةِ" : "The Cloud Pillow"}
                  </h3>
                  <p className="text-sm text-[#5A4B42] mt-2 leading-relaxed">
                    {isRtl
                      ? "غَيْمَةٌ بَيْضَاءُ نَاعِمَةٌ تَحْمِلُ الأَحْلَامَ السَّعِيدَةَ فَوْقَ سَمَاءِ المَسَاءِ الهَادِئَةِ لِتُرِيحَ عُيُونَ الصِّغَارِ."
                      : "A soft white cloud drifts over the peaceful twilight evening, bringing restful dreams to sleepy eyes."}
                  </p>
                </div>

                <div className="pt-2">
                  <Link
                    href={`/${locale}/reader/book_little_02`}
                    className="min-h-[52px] w-full px-6 rounded-full bg-[#F3E7DE] text-[#7B563E] hover:bg-[#7B563E] hover:text-white transition-all flex items-center justify-center gap-2 active:scale-95 font-bold text-sm shadow-sm"
                  >
                    <span className="material-symbols-outlined text-[20px]">play_arrow</span>
                    <span>{isRtl ? "اقْرَأْ الحِكَايَةَ" : "Read the Tale"}</span>
                  </Link>
                </div>
              </div>
            </article>

            {/* CARD 3: «القَمَرُ يَقُولُ: تُصْبِحُونَ عَلَى خَيْرٍ» (6 columns) */}
            <article className="lg:col-span-6 bg-white rounded-3xl overflow-hidden shadow-[0_16px_40px_rgba(43,58,77,0.06)] border border-[#F3E7DE] flex flex-col md:flex-row transition-transform hover:-translate-y-1 duration-300">
              <div className="relative w-full md:w-1/2 aspect-square md:aspect-auto overflow-hidden bg-[#FFF8F4]">
                <img
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAXpGSHbDrS576f_ODqTGXHCiGFMjl7mCrXt2BJlHXzxFr1r0xGCYT0BkmOBB-9ncr9xdn3yTcr-HK47VAtGsELUvMZDGt5j-JnoVGkgRb5SpNSyxsFJzorWPGW9YFZuCET_KpXwfUNqYsM9RvgpgnlpJC7WgPTkOovdLgpRRG9EurV9Df1lLYA8vwEvM4Mi5gP_IT6-5YnpNt7_pls1f9lrtXdZwmclcJDHZPm4YKG634jHOZzYVef"
                  alt="القمر يقول تصبحون على خير"
                />
                <div className="absolute top-3 right-3 bg-white/90 px-3 py-1 rounded-full text-[#2B231E] text-xs font-bold flex items-center gap-1 shadow-sm">
                  <span className="material-symbols-outlined text-[16px] text-[#585981]">bedtime</span>
                  <span>{isRtl ? "٤ دَقَائِق" : "4 mins"}</span>
                </div>
              </div>
              <div className="p-6 w-full md:w-1/2 flex flex-col justify-between gap-3">
                <div>
                  <span className="text-xs font-bold text-[#585981]">
                    {isRtl ? "أُهْزُوجَةُ المَسَاءِ" : "Evening Lullaby"}
                  </span>
                  <h3 className="text-xl font-extrabold text-[#2B231E] mt-1 leading-snug">
                    {isRtl ? "القَمَرُ يَقُولُ: تُصْبِحُونَ عَلَى خَيْرٍ" : "Goodnight from the Moon"}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5A4B42] mt-2 line-clamp-3 leading-relaxed">
                    {isRtl
                      ? "يَهْمِسُ الهِلَالُ اللَّطِيفُ لِكُلِّ بَيْتٍ وَشَجَرَةٍ وَعُصْفُورٍ أَنْ حَانَ وَقْتُ إِغْمَاضِ العَيْنَيْنِ فِي سَلَامٍ."
                      : "The smiling crescent whispers to every house, bird, and flower that it is time to close sweet eyes in peace."}
                  </p>
                </div>
                <div className="pt-2">
                  <button
                    onClick={() =>
                      handlePlayStory(
                        "story_moon_goodnight",
                        isRtl ? "القَمَرُ يَقُولُ: تُصْبِحُونَ عَلَى خَيْرٍ" : "Goodnight from the Moon",
                        "https://lh3.googleusercontent.com/aida-public/AB6AXuAXpGSHbDrS576f_ODqTGXHCiGFMjl7mCrXt2BJlHXzxFr1r0xGCYT0BkmOBB-9ncr9xdn3yTcr-HK47VAtGsELUvMZDGt5j-JnoVGkgRb5SpNSyxsFJzorWPGW9YFZuCET_KpXwfUNqYsM9RvgpgnlpJC7WgPTkOovdLgpRRG9EurV9Df1lLYA8vwEvM4Mi5gP_IT6-5YnpNt7_pls1f9lrtXdZwmclcJDHZPm4YKG634jHOZzYVef"
                      )
                    }
                    type="button"
                    className="min-h-[50px] w-full px-4 rounded-full bg-[#D8E6DF] text-[#1E3E32] hover:bg-[#4A6458] hover:text-white transition-all flex items-center justify-center gap-2 active:scale-95 font-bold text-sm shadow-sm"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {false
                        ? "pause_circle"
                        : "volume_up"}
                    </span>
                    <span>{isRtl ? "اسْتَمِعْ الآن" : "Listen Now"}</span>
                  </button>
                </div>
              </div>
            </article>

            {/* CARD 4: «أَرْنَبٌ يَتَقَاسَمُ الجَزَرَةَ» (6 columns) */}
            <article className="lg:col-span-6 bg-white rounded-3xl overflow-hidden shadow-[0_16px_40px_rgba(43,58,77,0.06)] border border-[#F3E7DE] flex flex-col md:flex-row transition-transform hover:-translate-y-1 duration-300">
              <div className="relative w-full md:w-1/2 aspect-square md:aspect-auto overflow-hidden bg-[#FFF8F4]">
                <img
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAKs3fEN5uUCOlLQTFbBaPWhrGM2B12YN8DT8c6OdHknHZfLIOjc3TItFCWXPfPPm6cnjO71ebqQ378YytBgPydBXKORPuPJV-bu6WmVEHJXfe7RWke191ZeqkoykFdh_0f-nXHyj2CYMfkqQJENYjJyUV9elAJfnG8g_uSgibK77uyZtUE_wB893u6LngaiZw9Ok05W3lyKCoRaZf4vxDEu8sMA54z790jxUENG852LBmelR5sesew"
                  alt="أرنب يتقاسم الجزرة"
                />
                <div className="absolute top-3 right-3 bg-white/90 px-3 py-1 rounded-full text-[#2B231E] text-xs font-bold flex items-center gap-1 shadow-sm">
                  <span className="material-symbols-outlined text-[16px] text-[#7B563E]">schedule</span>
                  <span>{isRtl ? "٣ دَقَائِق" : "3 mins"}</span>
                </div>
              </div>
              <div className="p-6 w-full md:w-1/2 flex flex-col justify-between gap-3">
                <div>
                  <span className="text-xs font-bold text-[#4A6458]">
                    {isRtl ? "قِيَمٌ وَمُشَارَكَةٌ" : "Values & Sharing"}
                  </span>
                  <h3 className="text-xl font-extrabold text-[#2B231E] mt-1 leading-snug">
                    {isRtl ? "أَرْنَبٌ يَتَقَاسَمُ الجَزَرَةَ" : "Bunny Shares the Carrot"}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5A4B42] mt-2 line-clamp-3 leading-relaxed">
                    {isRtl
                      ? "عِنْدَمَا وَجَدَ الأَرْنَبُ جَزَرَةً كَبِيرَةً، لَمْ يَأْكُلْهَا وَحْدَهُ بَلْ دَعَا أَصْدِقَاءَهُ لِيَتَشَارَكُوا الفَرَحَ مَعًا."
                      : "When the little bunny found a crunchy carrot, he gathered his forest friends to share the joy together."}
                  </p>
                </div>
                <div className="pt-2">
                  <Link
                    href={`/${locale}/reader/book_little_04`}
                    className="min-h-[50px] w-full px-4 rounded-full bg-[#FFDBCB] text-[#7B563E] hover:bg-[#7B563E] hover:text-white transition-all flex items-center justify-center gap-2 active:scale-95 font-bold text-sm shadow-sm"
                  >
                    <span className="material-symbols-outlined text-[20px]">auto_stories</span>
                    <span>{isRtl ? "اقْرَأْ الحِكَايَةَ" : "Read the Tale"}</span>
                  </Link>
                </div>
              </div>
            </article>
          </div>
        </section>

        {/* Protected Parent Gate Entry Section (Stitch L01 / Destination: F11) */}
        <section aria-label="منطقة الأهل والمربين المحمية" className="mt-12">
          <div className="bg-[#FDF2E9] rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-[0_8px_24px_rgba(43,58,77,0.04)] border border-[#F3E7DE]">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-[#D8E6DF] flex items-center justify-center text-[#1E3E32] shrink-0 shadow-inner">
                <span className="material-symbols-outlined text-[34px]">shield_person</span>
              </div>
              <div className="flex flex-col text-right">
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-[#2B231E]">
                    {isRtl ? "بَوَّابَةُ الأَهْلِ وَالمُرَبِّينَ" : "Guardian & Parents Gate"}
                  </span>
                  <span className="material-symbols-outlined text-[#7B563E] text-[20px]">lock</span>
                </div>
                <p className="text-xs sm:text-sm text-[#5A4B42] mt-1 max-w-xl leading-relaxed">
                  {isRtl
                    ? "إعدادات القراءة، ضبط وقت السكون، واختيار مستوى التشكيل الصوتي للكلمات. منطقة مخصصة للبالغين فقط وتتطلب تأكيداً للمرور."
                    : "Reading limits, quiet time timers, and diacritics controls. Restricted zone protected for parents only."}
                </p>
              </div>
            </div>

            <div className="shrink-0 w-full md:w-auto">
              <button
                onClick={() => setShowPinModal(true)}
                type="button"
                className="min-h-[56px] w-full md:w-auto px-8 py-3 rounded-full bg-[#4A6458] text-white hover:bg-[#395045] transition-all flex items-center justify-center gap-2 shadow-[0_6px_20px_rgba(74,100,88,0.2)] active:scale-95 font-bold text-sm sm:text-base"
              >
                <span className="material-symbols-outlined text-[22px]">lock_open</span>
                <span>{isRtl ? "دُخُولُ بَوَّابَةِ الأَهْلِ" : "Open Parents Gate"}</span>
              </button>
            </div>
          </div>
        </section>

        {/* Calm exit and quiet-time reassurance banner (Stitch L01) */}
        <aside
          role="note"
          className="py-4 px-6 bg-white rounded-2xl border border-[#F3E7DE] flex flex-col md:flex-row items-center justify-center gap-4 text-center shadow-sm"
        >
          <div className="flex items-center gap-2 text-[#7B563E]">
            <span className="material-symbols-outlined text-[22px]">spa</span>
            <span className="text-sm font-bold">
              {isRtl ? "وَقْتُ قِرَاءَةٍ مُمْتِعٌ وَهَادِئٌ" : "Gentle, Calming Reading Time"}
            </span>
          </div>
          <span className="hidden md:inline text-neutral-300">•</span>
          <div className="flex items-center gap-2 text-[#4A6458] font-medium text-xs sm:text-sm">
            <span className="material-symbols-outlined text-[20px]">verified_user</span>
            <span>
              {isRtl
                ? "لَا وُجُودَ لِإِعْلَانَاتٍ أَوْ مُؤَقِّتَاتٍ ضَاغِطَةٍ أَوْ جَمْعٍ لِبَيَانَاتِ الطِّفْلِ"
                : "No advertisements, no high-pressure countdowns, and zero tracking"}
            </span>
          </div>
        </aside>
      </div>

      <Dialog open={showPinModal} onOpenChange={setShowPinModal}><DialogContent className="bg-white text-[#2b231e]" dir={isRtl?"rtl":"ltr"}><DialogHeader><DialogTitle>{isRtl?"بوابة الأهل":"Parent gate"}</DialogTitle></DialogHeader><p>{isRtl?"ما ناتج 17 + 8؟ هذه خطوة محلية للمرافقة وليست إثبات هوية.":"What is 17 + 8? A local gate, not identity verification."}</p><form className="space-y-4" onSubmit={handleVerifyPin}><label className="block">{isRtl?"الإجابة":"Answer"}<input autoFocus required inputMode="numeric" className="w-full mt-2 p-3 rounded-xl border" value={pinInput} onChange={event=>{setPinInput(event.target.value);setPinError(false)}}/></label>{pinError&&<p role="alert" className="text-red-700">{isRtl?"الإجابة غير صحيحة. حاول مرة أخرى.":"Incorrect answer. Please retry."}</p>}<button type="submit" className="family-button">{isRtl?"متابعة":"Continue"}</button></form></DialogContent></Dialog>
      <PublishedShelf realm="little" locale={locale}/>
    </div>
  )
}
