"use client"
import {PublishedShelf} from "@/components/realms/published-shelf"
import { useCatalogBooks } from "@/context/catalog-context"

import React, { useState } from "react"
import Link from "@/components/common/realm-link"
import { PUBLISHING_BOOKS } from "@/lib/books-data"
import { useRouter } from "next/navigation"
import { useReadingState } from "@/context/reading-state-context"


type KidsRealmViewProps = {
  locale: "ar" | "en"
}

export function KidsRealmView({ locale }: KidsRealmViewProps) {
  const PUBLISHING_BOOKS = useCatalogBooks()
  const publishedBooks = useCatalogBooks()
  const isRtl = locale === "ar"
  const { state, updateEntry, updateSettings } = useReadingState()
  const activeLevel = state.kids.level
  const featured=PUBLISHING_BOOKS.find(book=>book.id==="book_kids_01")!
  const progress=state.kids.entries.book_kids_01?Math.round(((state.kids.entries.book_kids_01.furthest||0)+1)/(featured?.sampleText.length || 1)*100):0
  const setActiveLevel = (level:number) => updateSettings("kids",{level,fontSize:level===1?26:level===2?22:20})
  const aliases:Record<string,string> = {lighthouse:"book_kids_01",k_lighthouse:"book_kids_01",k_palm_valley:"book_kids_02",k_blue_garden:"book_kids_03",k_friends_compass:"book_kids_04",k_observatory_train:"book_kids_05",k_house_of_wisdom:"book_kids_06",k_quiet_library:"book_kids_07",k_sand_ship:"book_kids_08"}
  const savedBooks = Object.fromEntries(Object.entries(aliases).map(([alias,id])=>[alias,!!state.kids.entries[id]?.saved]))
  const [vocabModalOpen, setVocabModalOpen] = useState(false)
  const [selectedWord, setSelectedWord] = useState<{
    word: string
    meaning: string
    example: string
  } | null>(null)

  const toggleSave = (alias:string) => {const id=aliases[alias] || alias; updateEntry("kids",id,{saved:!state.kids.entries[id]?.saved})}

  const sampleWords = [
    {
      word: "المَنَارَة",
      meaning: "بُرجٌ مرتفعٌ على الساحل يرسل ضوءاً قوياً لإرشاد السفن في البحر ليلاً.",
      example: "رأى الصيادُ نورَ المنارةِ فعرف طريق العودة إلى الميناء.",
    },
    {
      word: "دَفِين",
      meaning: "الشيء المخبوء بعناية تحت التراب أو في أعماق البحار.",
      example: "بحث زيدٌ عن كنزٍ دفين بين صخور الشاطئ.",
    },
    {
      word: "الإِسْطِرْلاب",
      meaning: "آلة فلكية قديمة ورائعة كان العلماء يستخدمونها لمعرفة مواقيت النجوم والجهات.",
      example: "استعان علماء بيت الحكمة بالإسطرلاب لرسم خريطة السماء.",
    },
  ]

  const openVocab = (wordObj: (typeof sampleWords)[0]) => {
    setSelectedWord(wordObj)
    setVocabModalOpen(true)
  }

  if (!publishedBooks.some(book=>book.id==="book_kids_01")) return <PublishedShelf realm="kids" locale={locale}/>
  return (
    <div className="w-full min-h-screen bg-[#F8FAF9] text-[#111C1A] py-8 sm:py-12 relative overflow-hidden font-sans">
      {/* Subtle ambient coastal glows */}
      <div className="absolute -top-32 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-72 left-10 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1280px] w-full mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col gap-10">
        {/* Top Contextual Realm Navigation Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm backdrop-blur-md">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xl shrink-0">
              🧭
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-emerald-800 text-base">
                  {isRtl ? "كَوْكَبُ الاِسْتِكْشَافِ وَالأَطْفَالِ (٧ – ١٢ سَنَة)" : "Kids Explorers Realm (Ages 7-12)"}
                </span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">
                  {isRtl ? "حَارِسُ المَنَارَةِ" : "Lighthouse Quest"}
                </span>
              </div>
              <p className="text-xs text-slate-600">
                {isRtl
                  ? "مُغَامَرَاتٌ مُشَوِّقَةٌ وَأَلْغَازٌ ذَكِيَّةٌ • مُحْتَوًى آمِنٌ مَعَ تَشْكِيلِ الكَلِمَاتِ"
                  : "Thrilling adventures & clever mysteries • 100% safe & diacritized"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/${locale}/books?age=kids_7_12`}
              className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm"
            >
              <span>{isRtl ? "كُلُّ مُغَامَرَاتِ الأَطْفَالِ" : "All Kids Adventures"}</span>
              <span className="material-symbols-outlined text-[16px] rtl:rotate-180">arrow_forward</span>
            </Link>
          </div>
        </div>

        {/* Hero & Spotlight Grid (12-column layout - Authentic Stitch K01) */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Right Side (Columns 1-7): Warm Welcome & Continue Reading Spotlight */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            {/* Friendly Persona Greeting */}
            <div className="flex items-center justify-between bg-white px-5 py-3.5 rounded-2xl border border-[#E2E8F0] shadow-sm">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[24px]">waving_hand</span>
                </span>
                <div className="flex flex-col">
                  <span className="text-base font-bold text-slate-900">
                    {isRtl ? "مرحبًا بك في عالم المغامرات 🌟" : "Welcome to the World of Adventures 🌟"}
                  </span>
                  <span className="text-xs text-slate-500">
                    {isRtl
                      ? "يوم جديد، وصفحة جديدة تنتظر خيالك الجميل"
                      : "A fresh day and a new chapter waiting for your imagination"}
                  </span>
                </div>
              </div>
              <span className="hidden sm:inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-bold">
                <span className="material-symbols-outlined text-[15px]">schedule</span>
                <span>{isRtl ? "وقتك الهادئ" : "Quiet Time"}</span>
              </span>
            </div>

            {/* Spotlight Card: حارس المنارة */}
            <div className="bg-white rounded-3xl shadow-sm border border-[#E2E8F0] p-6 sm:p-8 flex flex-col justify-between flex-1 relative overflow-hidden group">
              <div className="absolute -top-12 -left-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex flex-col gap-4 relative z-10">
                {/* Header of card */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                        {isRtl ? "أنت تقرأ الآن" : "Currently Reading"}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">
                        {isRtl ? "الفصل الأول: «أنوار الساحل»" : "Chapter 1: Coastal Lights"}
                      </span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                      {isRtl ? "حارس المنارة" : "The Lighthouse Keeper"}
                    </h1>
                  </div>
                  <button
                    onClick={() => toggleSave("lighthouse")}
                    aria-label="حفظ القصة"
                    className="w-11 h-11 rounded-xl bg-slate-100 hover:bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 transition-colors"
                  >
                    <span
                      className="material-symbols-outlined text-[26px]"
                      style={{ fontVariationSettings: savedBooks.lighthouse ? "'FILL' 1" : "'FILL' 0" }}
                    >
                      bookmark
                    </span>
                  </button>
                </div>

                {/* Two-column content inside spotlight: Illustration + Excerpt */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
                  <div className="sm:col-span-5 relative rounded-2xl overflow-hidden h-44 shadow-sm bg-slate-100">
                    <img
                      className="w-full h-full object-cover"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuByMNxOSpGd2Sv6f-Of1Pile5ZM4eMNDBaaCw0maNXDRt-UOSApSxdgn7-GnyBTjelpql_QJE78N8l-neGiPenwR7uy1OJBsh_fjOlHVSSkQ5RYSfmBjZPNJUO2VKwyeDS_heA8rty44-1z-H6Iz7CL0yLJ4ytbunazhjc-FrzhU4kaG7riGDJjVk3x16uo6J4KMjADCfFQhQehAtWNQxu1xbQNJVC-RdxKStHvskeiBM8c36cLKw6N"
                      alt="حارس المنارة"
                    />
                    <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-md text-white px-2.5 py-0.5 rounded-lg text-xs font-bold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">timer</span>
                      <span>{isRtl ? "٦ دقائق" : "6 mins"}</span>
                    </div>
                  </div>

                  <div className="sm:col-span-7 flex flex-col gap-3">
                    {/* Excerpt with Diacritics */}
                    <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                      {isRtl ? (
                        <>
                          «كَانَ زَيْدٌ يَقِفُ عِنْدَ حَافَّةِ السَّاحِلِ، يَرْقُبُ نُورَ{" "}
                          <button
                            onClick={() => openVocab(sampleWords[0])}
                            className="text-emerald-700 font-bold underline decoration-emerald-400 decoration-2 underline-offset-4 hover:bg-emerald-50 px-1 rounded"
                          >
                            المَنَارَةِ
                          </button>{" "}
                          وَهُوَ يَدُورُ فَوْقَ المَوْجِ كَأَنَّهُ يَبْحَثُ عَنْ سِرٍّ{" "}
                          <button
                            onClick={() => openVocab(sampleWords[1])}
                            className="text-emerald-700 font-bold underline decoration-emerald-400 decoration-2 underline-offset-4 hover:bg-emerald-50 px-1 rounded"
                          >
                            دَفِينٍ
                          </button>{" "}
                          بَيْنَ الرِّمَالِ...»
                        </>
                      ) : (
                        "Zayd stood at the edge of the coastline, watching the beam of the lighthouse sweep across the waves as if searching for a forgotten secret buried in the sands..."
                      )}
                    </p>

                    {/* Reading Progress Bar */}
                    <div className="flex flex-col gap-1.5 mt-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-slate-600">
                          {isRtl ? "التقدم في هذا الفصل" : "Chapter Progress"}
                        </span>
                        <span className="text-emerald-700 font-mono">{progress}%</span>
                      </div>
                      <div className="w-full h-2.5 rounded-full bg-slate-200 overflow-hidden">
                        <div className="h-full bg-emerald-600 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions: Primary & Secondary */}
              <div className="flex flex-wrap items-center gap-3 pt-6 mt-4 border-t border-slate-100">
                <Link
                  href={`/${locale}/reader/book_kids_01`}
                  className="min-h-[48px] px-6 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-sm"
                >
                  <span>{isRtl ? "متابعة القراءة الآن (الفصل ١)" : "Continue Reading Now (Ch. 1)"}</span>
                  <span className="material-symbols-outlined text-[20px] rtl:rotate-180">arrow_forward</span>
                </Link>
                <Link
                  href={`/${locale}/books/book_kids_01`}
                  className="min-h-[48px] px-5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm flex items-center justify-center gap-2 transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px] text-emerald-700">menu_book</span>
                  <span>{isRtl ? "تفاصيل القصة والفصول" : "Story Details & Chapters"}</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Left Side (Columns 8-12): Interactive Quest Map Preview Banner */}
          <div className="lg:col-span-5 flex flex-col justify-between bg-white rounded-3xl shadow-sm border border-[#E2E8F0] p-6 sm:p-8 relative overflow-hidden">
            {/* Background Map Artwork */}
            <div
              className="absolute inset-0 opacity-10 pointer-events-none bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCwM686nt0di9KTq0SolF1aY-_L7QHFV6qn1Qr9XegYbFCa9drZxSFJtJfy2xCb1j8VghmDx8BX7Tu5lupz7VNAi8Wt5sdL-hql3azNZgaF99z86kWcaDlUCUjbUAiX6xy1OMlZ0pzwu9etuy0VZzSyWuhWOT7QUXbs50lHCyeB4pt02wpQWelZAIXIWqzYAR1e3fqW9PNr0bqwSuswpp7-R8h93boVRmOcxRijdetC8iIcIXNjuCBY')",
              }}
            />

            <div className="relative z-10 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-9 h-9 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[22px]">explore</span>
                  </span>
                  <span className="text-xl font-extrabold text-slate-900">
                    {isRtl ? "خريطة المستكشف الصغير" : "Little Explorer Map"}
                  </span>
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800">
                  {isRtl ? "٣ محطات منجزة" : "3 Stations Done"}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {isRtl
                  ? "كل قصة تقرأها تضيء لك محطة جديدة على الجزيرة دون عجلة أو أوقات محددة!"
                  : "Every story you read unlocks a vibrant landmark on the adventure island at your own relaxing pace!"}
              </p>

              {/* Interactive Quest Island Graphic / Stepper */}
              <div className="bg-[#F8FAF9] rounded-2xl p-4 sm:p-5 flex flex-col gap-4 border border-slate-200">
                {/* Quest Nodes Diagram */}
                <div className="relative flex items-center justify-between px-2 pt-2 pb-1">
                  {/* Connecting Track */}
                  <div className="absolute top-1/2 left-4 right-4 h-1.5 -translate-y-1/2 bg-slate-200 rounded-full" />
                  <div
                    className="absolute top-1/2 right-4 h-1.5 -translate-y-1/2 bg-amber-500 rounded-full"
                    style={{ width: `${progress}%` }}
                  />

                  {/* Node 1: Completed */}
                  <div className="relative flex flex-col items-center gap-1 z-10">
                    <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-sm">
                      <span className="material-symbols-outlined text-[20px]">{progress>0?"check":"flag"}</span>
                    </div>
                    <span className="text-[11px] text-slate-800 font-bold">
                      {isRtl ? "شاطئ الصدف" : "Seashell Beach"}
                    </span>
                  </div>

                  {/* Node 2: Completed */}
                  <div className="relative flex flex-col items-center gap-1 z-10">
                    <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-sm">
                      <span className="material-symbols-outlined text-[20px]">check</span>
                    </div>
                    <span className="text-[11px] text-slate-800 font-bold">
                      {isRtl ? "وادي النخيل" : "Palm Valley"}
                    </span>
                  </div>

                  {/* Node 3: Current */}
                  <div className="relative flex flex-col items-center gap-1 z-10">
                    <div className="w-10 h-10 rounded-full bg-amber-500 text-white flex items-center justify-center ring-4 ring-amber-200 shadow-sm animate-pulse">
                      <span className="material-symbols-outlined text-[20px]">flag</span>
                    </div>
                    <span className="text-[11px] text-slate-900 font-extrabold">
                      {isRtl ? "برج المراقبة" : "Watchtower"}
                    </span>
                  </div>

                  {/* Node 4: Mystery / Locked */}
                  <div className="relative flex flex-col items-center gap-1 z-10">
                    <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-400 flex items-center justify-center">
                      <span className="material-symbols-outlined text-[18px]">lock</span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-medium">
                      {isRtl ? "واحة الأسرار" : "Secret Oasis"}
                    </span>
                  </div>
                </div>

                {/* Encouragement */}
                <div className="flex items-center gap-2 text-amber-800 bg-amber-50 px-3.5 py-2 rounded-xl text-xs font-semibold border border-amber-200">
                  <span className="material-symbols-outlined text-[18px]">nature_people</span>
                  <span>
                    {isRtl
                      ? "محطتك القادمة تنتظرك عند إكمال قراءة حارس المنارة."
                      : "Your next station lights up upon completing The Lighthouse Keeper."}
                  </span>
                </div>
              </div>
            </div>

            {/* Button to Full Quest Map */}
            <div className="pt-4 relative z-10">
              <Link
                href={`/${locale}/quest-map`}
                className="w-full min-h-[48px] px-5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm flex items-center justify-center gap-2 transition-colors"
              >
                <span>{isRtl ? "فتح خريطة المهام الشاملة" : "Open Full Quest Map"}</span>
                <span className="material-symbols-outlined text-[20px] rtl:rotate-180">arrow_forward</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Reading Level Control Bar (Word Comfort Selector - Stitch K01) */}
        <section className="bg-white rounded-3xl shadow-sm border border-[#E2E8F0] p-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[26px]">tune</span>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-extrabold text-slate-900">
                {isRtl ? "اختر مستوى راحة الكلمات:" : "Choose Word Comfort Level:"}
              </span>
              <span className="text-xs text-slate-500">
                {isRtl
                  ? "تصنيف مرن يساعدك على اختيار الحكايات الأنسب لمفرداتك دون درجات أو تقييمات مدرسية 🌱"
                  : "A flexible filter to find stories matching your vocabulary without grades or exams 🌱"}
              </span>
            </div>
          </div>

          {/* Level Options (Pill Buttons) */}
          <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-100 shrink-0 flex-wrap">
            {[
              { id: 1, labelAr: "🌱 مستوى الانطلاق (مبتدئ)", labelEn: "🌱 Explorer Start (Beginner)" },
              { id: 2, labelAr: "🌿 مستوى المغامرة (متوسط)", labelEn: "🌿 Adventure Level (Mid)" },
              { id: 3, labelAr: "🌳 مستوى التحدي الشيق (متقدم)", labelEn: "🌳 Challenge Level (Advanced)" },
            ].map((lvl) => {
              const active = activeLevel === lvl.id
              return (
                <button
                  key={lvl.id}
                  onClick={() => setActiveLevel(lvl.id)}
                  type="button"
                  className={`min-h-[44px] px-4 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                    active
                      ? "bg-emerald-700 text-white shadow-md scale-[1.02]"
                      : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
                  }`}
                >
                  {isRtl ? lvl.labelAr : lvl.labelEn}
                </button>
              )
            })}
          </div>
        </section>

        {/* Shelf 1: مغامرات الساحل والطبيعة الممتعة (Stitch K01) */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-3.5 h-8 rounded-full bg-emerald-600" />
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                {isRtl ? "مغامرات الساحل والطبيعة الممتعة" : "Coastal & Nature Adventures"}
              </h2>
            </div>
            <Link
              href={`/${locale}/books?category=adventure`}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
            >
              <span>{isRtl ? "عرض الكل" : "View All"}</span>
              <span className="material-symbols-outlined text-[16px] rtl:rotate-180">arrow_forward</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                id: "k_lighthouse",
                titleAr: "حارس المنارة",
                titleEn: "The Lighthouse Keeper",
                tagAr: "نص ورسوم",
                timeAr: "٦ دقائق",
                levelAr: "متوسط",
                levelColor: "text-amber-700",
                descAr: "رحلة استكشافية لاكتشاف سر الضوء القديم الذي يسترشد به الصيادون ليلاً.",
                img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDi24ubkX_o71GZkov_Uaoq4gHSjlbF-udsMk__N5PcqSWXFPoSuLjzxivsweKeR8iJuWbMRx-xUt7JXBFMPewxWjCfHlg-PC3noAuqfYqlc9282sCpDenTh8-XkeLwgBtWUwpiNarHyslfX5pxD19BGaz9tAwaaUyUHT3jOwNbYhDfFTxQOONJ6VZ2giwnVOAD7LjeI2webYM_4l7QRyCm7oBHaUUeAUFjKpr0F-7A3dGRmpga5pN9",
                path: "book_kids_01",
              },
              {
                id: "k_palm_valley",
                titleAr: "خريطة وادي النخيل",
                titleEn: "Map of Palm Valley",
                tagAr: "استكشاف",
                timeAr: "٨ دقائق",
                levelAr: "متوسط",
                levelColor: "text-amber-700",
                descAr: "تتبع مسارات المياه العذبة ومغامرة العثور على أقدم نخلة في الواحة.",
                img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAZLmdNotLC7LYF4IYuUm_1rGyHY8RTbT0N8rc_JhjPXnYV0cu15nhKTuoR316zfL9dUEAIKixfNpUBtVATbH6yuz4Iv8egjUVQRwOYNvcK-vXGcKPGURLqIw4A0tTPPqcNaemipsoPEZWA-N83c1Y4clKsgE-K1rIZ8fDjUOj3jad2TzwGLE7JlcKytxN29mL_Gcw9UPgQmWiY1aWL0gK--U66l-2Kc0wQc_YZWfuBv_oOSxlsO2k9",
                path: "book_kids_02",
              },
              {
                id: "k_blue_garden",
                titleAr: "سر الحديقة الزرقاء",
                titleEn: "Secret of the Blue Garden",
                tagAr: "طبيعة وألغاز",
                timeAr: "٦ دقائق",
                levelAr: "مبتدئ",
                levelColor: "text-emerald-700",
                descAr: "أزهار نادرة تزهر فقط عند ظهور الهلال، فما السر الذي تخفيه جذورها؟",
                img: "https://lh3.googleusercontent.com/aida-public/AB6AXuC2ziFcY_qS6xxDP5TMK063RoFVcj83CfXL_vFYOyzf5AE516_BHON2kNv1fxte0DtUZ7cA4LwhAcENSkJxzCdJQfXa7x8mgnaNKfSMKz3b6h9HXY31jdAxzb7b02P7qdq8WtGFFWey3gNDlX9FhFU_s5hcmVIR1CKje-VaHG6qaa9hYixVFYSMEPcsP7fYQaLO8GaK0NpBu07b26_E3cK21CixVi9BmO96eg88M_dXR8bTNWHKmIKD",
                path: "book_kids_03",
              },
              {
                id: "k_friends_compass",
                titleAr: "بوصلة الأصدقاء",
                titleEn: "The Friends' Compass",
                tagAr: "تعاون ومغامرة",
                timeAr: "١٠ دقائق",
                levelAr: "متقدم",
                levelColor: "text-purple-700",
                descAr: "حين تتعطل الأجهزة الحديثة، يتعلم الرفاق قراءة مواقع النجوم ومسارات الرياح.",
                img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCeE2WiTIIFeLUKJxa45nW2LRO2TC_B9-bZk8xZC76QeokT5WC6CnsT9dt0MHtn0LS5Ig57OtpdUjWHTUZTtn1IdJRh3nMbS9Af1plxs3NSzTFLryWrQHC4N6sa7cFwTM_pRaXKdjK6j6CYmWWzNzrk_Xc-LD5ePc5PWk4ZH9TEd6L1ot4LlVALVO3TSzC2mpBEYBDLctLnerdwXuUEAxfCsX0r49P43CGyAKeETE6yVZ-da7z303GQ",
                path: "book_kids_04",
              },
            ].map((book) => (
              <article
                key={book.id}
                className="bg-white rounded-3xl shadow-sm hover:shadow-md border border-[#E2E8F0] transition-all flex flex-col overflow-hidden group"
              >
                <div className="relative h-48 overflow-hidden bg-slate-100">
                  <img
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    src={book.img}
                    alt={book.titleAr}
                  />
                  <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-md text-slate-800 px-3 py-0.5 rounded-full text-xs font-bold shadow-sm">
                    {book.tagAr}
                  </span>
                  <button
                    onClick={() => toggleSave(book.id)}
                    aria-label="حفظ القصة"
                    className="absolute top-3 left-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur text-emerald-700 flex items-center justify-center hover:bg-white shadow-sm transition-colors"
                  >
                    <span
                      className="material-symbols-outlined text-[18px]"
                      style={{ fontVariationSettings: savedBooks[book.id] ? "'FILL' 1" : "'FILL' 0" }}
                    >
                      bookmark
                    </span>
                  </button>
                </div>
                <div className="p-5 flex flex-col justify-between flex-1 gap-3">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                      <span>{book.timeAr}</span>
                      <span>•</span>
                      <span className={`font-bold ${book.levelColor}`}>{book.levelAr}</span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                      {isRtl ? book.titleAr : book.titleEn}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {book.descAr}
                    </p>
                  </div>
                  <Link
                    href={`/${locale}/reader/${book.path}`}
                    className="min-h-[42px] w-full rounded-xl bg-slate-50 hover:bg-emerald-700 hover:text-white text-emerald-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors border border-slate-200"
                  >
                    <span>{isRtl ? "اقرأ القصة" : "Read Story"}</span>
                    <span className="material-symbols-outlined text-[16px] rtl:rotate-180">arrow_forward</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Shelf 2: رحلات الاستكشاف والمعرفة (Stitch K01) */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-3.5 h-8 rounded-full bg-amber-500" />
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                {isRtl ? "رحلات الاستكشاف والمعرفة" : "Journeys of Knowledge & Discovery"}
              </h2>
            </div>
            <Link
              href={`/${locale}/books?category=knowledge`}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
            >
              <span>{isRtl ? "عرض المزيد" : "Explore More"}</span>
              <span className="material-symbols-outlined text-[16px] rtl:rotate-180">arrow_forward</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                id: "k_observatory_train",
                titleAr: "قطار إلى مرصد النجوم",
                titleEn: "Train to the Star Observatory",
                tagAr: "فضاء وفلك",
                timeAr: "٧ دقائق",
                levelAr: "متوسط",
                levelColor: "text-amber-700",
                descAr: "رحلة ليلية ممتعة عبر الجبال لمراقبة المذنبات وحكايات مجرة درب التبانة.",
                img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAQYWDUe1Dqi-yRXP90CjWwLC3ulrUYnxSh6Ze-OkqEusBC8YgL801L1nStzu38_Z3rfBAozNsMbcyL408j2DPB10_qaay8RL1F9HFjECQvvIK2e_N2DJYXhfhxW5Q571emXyGbGKkPvfkK8w_XTSkXCyiEiZfXR1ZS_l_-I_e_QBsLUBDt-nzOCfJKc2aazverfiAfoKZOctzTOkTv5laovQP6jsy5N1HnaL4pGY2_oKa-4a8j6jco",
                path: "book_kids_05",
              },
              {
                id: "k_house_of_wisdom",
                titleAr: "رحلة في بيت الحكمة",
                titleEn: "Journey inside House of Wisdom",
                tagAr: "تاريخ واختراع",
                timeAr: "٩ دقائق",
                levelAr: "متقدم",
                levelColor: "text-purple-700",
                descAr: "كيف صنع العلماء القدامى الساعات المائية ورسموا خرائط الأرض المدهشة؟",
                img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAuovrBa5JU6_Homlj4aYqx8FhBnHPfWZ9jL7jHp4mM9amXrIiKrV1j6qDeVfKn0EVBrLsiaEGUHjBga1ZK2U-8nqRWjq2YNZZ7xGWUbHzCOrk_Mp_x64VrTKltUY74ZhywZe5oaIHnRhOtWXgdi09tX1dJQ3GurUvJ9-zUx8zSw0G9nh7zI6y5Gd6pg1IlOB07_P7gQ4z_sg4Q5ehgjSvBApuX20Cqdg73f3PckTRc4sq6SNdMLiCt",
                path: "book_kids_06",
              },
              {
                id: "k_quiet_library",
                titleAr: "لغز المكتبة الهادئة",
                titleEn: "Riddle of the Quiet Library",
                tagAr: "بحث وفضول",
                timeAr: "٦ دقائق",
                levelAr: "مبتدئ",
                levelColor: "text-emerald-700",
                descAr: "بطاقة قديمة منسية بين صفحات كتاب تعيد جمع أصدقاء المدرسة بعد سنوات.",
                img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAagnsZnfE5R-xqmkBN9o-5Ro5RRiLhiDGae0EXbFRj24UfcV22PIcLCSQ9KhnpSEVL1C_NpLAQe8-JstH-0ibkuPI5o8YmotQ3EABfSbiz7Q3MIolUmAKEtzWt-Y9jFCVJpII74iLQSaSvXs9zLit1vex7hxRwMT-LiC2pSAfGH3w_6_nYjDhREs4ciuE-Wd0k-ZQ8iIc2_twRMDHWNSKiUXSwnDXZPCbuynRE6SJ10nBFxyLXd_fR",
                path: "book_kids_07",
              },
              {
                id: "k_sand_ship",
                titleAr: "سفينة على الرمل",
                titleEn: "Ship on the Sands",
                tagAr: "مغامرة صحراوية",
                timeAr: "٨ دقائق",
                levelAr: "متوسط",
                levelColor: "text-amber-700",
                descAr: "صناعة قارب خشبي شراعي يتحرك بدفع الرياح الخفيفة فوق تلال الصحراء الذهبية.",
                img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDy9W40mVYctC7JT5Uhp-eeff1L610g1QUTj0KUENnDn-L3Te3Qtne53xQtARcE_x5SfaaTIkHCJiIt3Nm9RiW60nQUj0Y5BYCXQ9T5eD_VDwUMX8FnjfkfztgKL-1CYM0gG7sWgMIj2f7nHKSMHXbwgCYkcFZSKf8ldFnzDEvQMkT8SpmH77YUtQgYfD6-qaXZvcxXRpV2RRo014WxhRrPlZ-SnlxCdoOPG7mSae_pqIOuETbNKuH3",
                path: "book_kids_08",
              },
            ].map((book) => (
              <article
                key={book.id}
                className="bg-white rounded-3xl shadow-sm hover:shadow-md border border-[#E2E8F0] transition-all flex flex-col overflow-hidden group"
              >
                <div className="relative h-48 overflow-hidden bg-slate-100">
                  <img
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    src={book.img}
                    alt={book.titleAr}
                  />
                  <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-md text-slate-800 px-3 py-0.5 rounded-full text-xs font-bold shadow-sm">
                    {book.tagAr}
                  </span>
                  <button
                    onClick={() => toggleSave(book.id)}
                    aria-label="حفظ القصة"
                    className="absolute top-3 left-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur text-emerald-700 flex items-center justify-center hover:bg-white shadow-sm transition-colors"
                  >
                    <span
                      className="material-symbols-outlined text-[18px]"
                      style={{ fontVariationSettings: savedBooks[book.id] ? "'FILL' 1" : "'FILL' 0" }}
                    >
                      bookmark
                    </span>
                  </button>
                </div>
                <div className="p-5 flex flex-col justify-between flex-1 gap-3">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                      <span>{book.timeAr}</span>
                      <span>•</span>
                      <span className={`font-bold ${book.levelColor}`}>{book.levelAr}</span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                      {isRtl ? book.titleAr : book.titleEn}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {book.descAr}
                    </p>
                  </div>
                  <Link
                    href={`/${locale}/reader/${book.path}`}
                    className="min-h-[42px] w-full rounded-xl bg-slate-50 hover:bg-emerald-700 hover:text-white text-emerald-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors border border-slate-200"
                  >
                    <span>{isRtl ? "اقرأ القصة" : "Read Story"}</span>
                    <span className="material-symbols-outlined text-[16px] rtl:rotate-180">arrow_forward</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Reading Features & Tools Banner (Child Empowerment Without Evaluation - Stitch K01) */}
        <section className="bg-emerald-50 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-stretch justify-between gap-6 border border-emerald-100">
          {/* Feature 1: مستكشف الكلمات */}
          <div
            onClick={() => openVocab(sampleWords[0])}
            className="flex-1 bg-white rounded-2xl p-6 shadow-sm border border-emerald-100 flex items-start gap-4 cursor-pointer hover:shadow-md transition-shadow group"
           role="button" tabIndex={0} onKeyDown={event=>{if(event.key==="Enter"||event.key===" "){event.preventDefault();event.currentTarget.click()}}}>
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 group-hover:bg-emerald-700 group-hover:text-white transition-colors">
              <span className="material-symbols-outlined text-[26px]">spellcheck</span>
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                {isRtl ? "مستكشف الكلمات" : "Vocabulary Explorer"}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {isRtl
                  ? "اضغط الكلمات المميزة أثناء القراءة لتكتشف معناها ومثالًا عليها دون مغادرة الحكاية."
                  : "Tap highlighted words while reading to explore their meanings and examples."}
              </p>
              <span className="text-xs text-emerald-700 font-bold mt-1">
                {isRtl ? "تسهيل المفردات الصعبة 💡 (جرب الضغط هنا)" : "Simplify Challenging Words 💡 (Try it)"}
              </span>
            </div>
          </div>

          {/* Feature 2: محقق القصة الذكي */}
          <div className="flex-1 bg-white rounded-2xl p-6 shadow-sm border border-emerald-100 flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[26px]">psychology_alt</span>
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="text-lg font-bold text-slate-900">
                {isRtl ? "محقق القصة الذكي" : "Story Detective"}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {isRtl
                  ? "أسئلة تأمل ممتعة في نهاية كل فصل تشجع خيالك: «لو كنت مكان البطل، ما القرار الذي ستختاره؟» بلا درجات."
                  : "Reflective imaginative questions at the end of every chapter encouraging creative thinking without scores."}
              </p>
              <Link href={`/${locale}/realms/kids/detective/book_kids_01`} className="text-xs text-amber-800 font-bold mt-1 underline">
                {isRtl ? "تأمل حر بدون امتحانات ✨" : "Free Reflection Without Tests ✨"}
              </Link>
            </div>
          </div>
        </section>

        {/* Calming Reassurance Note for Healthy Screen Habits (Stitch K01) */}
        <div className="flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-white shadow-sm border border-[#E2E8F0] text-center">
          <span className="material-symbols-outlined text-[20px] text-emerald-600">spa</span>
          <span className="text-xs sm:text-sm text-slate-600 font-medium">
            {isRtl
              ? "القراءة رحلة استكشاف ممتعة، يمكنك التوقف والاستراحة في أي وقت 🌱"
              : "Reading is a delightful voyage of discovery; you can pause and rest at any time 🌱"}
          </span>
        </div>
      </div>

      {/* Vocabulary Explorer Modal */}
      {vocabModalOpen && selectedWord && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-emerald-200 text-right space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <span className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-2xl">
                💡
              </span>
              <button
                onClick={() => setVocabModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600"
              >
                ✕
              </button>
            </div>

            <div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                {isRtl ? "مستكشف الكلمات الذكي" : "Smart Word Explorer"}
              </span>
              <h3 className="text-2xl font-black text-slate-900 mt-2">{selectedWord.word}</h3>
              <p className="text-sm text-slate-700 mt-2 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed">
                {selectedWord.meaning}
              </p>
            </div>

            <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-xs text-amber-900">
              <strong className="block font-bold mb-1">{isRtl ? "مثال في جملة:" : "Example:"}</strong>
              <span>{selectedWord.example}</span>
            </div>

            <button
              onClick={() => setVocabModalOpen(false)}
              className="w-full py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm transition-all shadow-md"
            >
              {isRtl ? "فهمت المعنى، تابع القراءة 🌟" : "Got it! Continue Reading 🌟"}
            </button>
          </div>
        </div>
      )}
      <PublishedShelf realm="kids" locale={locale}/>
    </div>
  )
}
