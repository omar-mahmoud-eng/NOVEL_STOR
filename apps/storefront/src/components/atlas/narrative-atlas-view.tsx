"use client"

import React, { useState } from "react"
import Link from "next/link"
import {
  MapPin,
  Users,
  Compass,
  Sliders,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  Eye,
  Lock,
  Sparkles,
  Layers,
  Network,
  Share2,
  BookOpen,
} from "lucide-react"

type NarrativeAtlasViewProps = {
  locale: "ar" | "en"
}

export function NarrativeAtlasView({ locale }: NarrativeAtlasViewProps) {
  const isRtl = locale === "ar"

  // Reading progress spoiler threshold slider (0% to 100%)
  const [spoilerThreshold, setSpoilerThreshold] = useState<number>(35)
  const [activeTab, setActiveTab] = useState<"characters" | "locations" | "timeline">("characters")
  const [selectedCharacterId, setSelectedCharacterId] = useState<string>("char-1")

  const characters = [
    {
      id: "char-1",
      name: "سلمى المنصور",
      role: "باحثة الوثائق والمخطوطات الأندلسية",
      status: "نشطة ميدانياً",
      minThreshold: 0,
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80",
      description: "عثرت على ظرف بريدي مغلق يحمل خريطة بثلاثة شوارع ومفتاحاً مجهولاً. تبحث عن سر اختفاء والدها منذ عشرين عاماً.",
      clues: ["الخريطة ذات الحبر النيلي", "الرسالة المؤرخة في شتاء ١٩١٤"],
      connections: ["والدها (أمين الأرشيف)", "كمال الزياني (حليف مؤقت)"],
    },
    {
      id: "char-2",
      name: "كمال الزياني",
      role: "محقق جنائي سابق في شرطة الميناء",
      status: "حليف غامض",
      minThreshold: 20,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
      description: "تقاعد مبكراً بعد حادثة احتراق مستودع الشمع الأسود. يملك سجلات سرية حول البضائع التي غادرت المرفأ قبل الحريق.",
      clues: ["دفتر مذكرات الميناء ١٨٩٢", "صورة فوتوغرافية للفرقاطة"],
      connections: ["سلمى المنصور (يقدم إرشادات)", "قبطان الفرقاطة (خصم قديم)"],
    },
    {
      id: "char-3",
      name: "أمين الأرشيف الراحل",
      role: "حارس مخطوطات قصر الحمراء",
      status: "مفقود • مصيره مجهول",
      minThreshold: 45,
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80",
      description: "أخفى الألواح النحاسية المشفرة قبل سقوط دار المحفوظات. لا تظهر حقيقته إلا بعد تجاوز الفصل الخامس من الرواية.",
      clues: ["المفتاح البرونزي ذو الرأسين", "الشمع الأسود الملكي"],
      connections: ["سلمى المنصور (والدها الحقيقي)"],
    },
    {
      id: "char-4",
      name: "قبطان الفرقاطة الأندلسية",
      role: "مهرب المخطوطات والآثار البحرية",
      status: "خصم رئيسي (+18)",
      minThreshold: 60,
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80",
      description: "تولى تهريب الصناديق الثلاثة لحساب شبكة النبلاء. يظهر في الفصول المتقدمة عند مواجهة المرفأ الغربي.",
      clues: ["عقد الشحن السري", "خاتم النسر الأندلسي"],
      connections: ["كمال الزياني (مطاردة قديمة)"],
    },
  ]

  const locations = [
    {
      id: "loc-1",
      name: "أزقة الميناء القديم",
      era: "شتاء ١٩١٤",
      type: "مسرح الأحداث الافتتاحي",
      minThreshold: 0,
      img: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&q=80",
      desc: "شوارع ضيقة مرصوفة بالحجارة ومحاطة بمستودعات الملح والقطران، حيث تبدأ رحلة البحث عن الخريطة.",
    },
    {
      id: "loc-2",
      name: "قبو دار المحفوظات المركزية",
      era: "الأرشيف السري",
      type: "مخبأ الوثائق المحترقة",
      minThreshold: 25,
      img: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=600&q=80",
      desc: "سرداب رطب تحت المدينة القديمة يحتوي على سجلات الملاحة وبقايا الأوراق الناجية من الحريق.",
    },
    {
      id: "loc-3",
      name: "المستودع الثامن — حوض السفن",
      era: "منطقة عسكرية محظورة",
      type: "مسرح المؤامرة الكبرى",
      minThreshold: 50,
      img: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=600&q=80",
      desc: "موقع ختم الصناديق بالشمع الأسود ونقل المخطوطات إلى الفرقاطة قبل إبحارها الليلي.",
    },
  ]

  const selectedChar = characters.find((c) => c.id === selectedCharacterId) || characters[0]

  return (
    <div className="min-h-screen bg-[#10131c] text-[#e0e2ef] pb-24">
      {/* Top Banner & Identification (Stitch P20) */}
      <section className="relative overflow-hidden bg-[#0b0e17] border-b border-[#4e463a]/40 pt-12 pb-16">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#e6c184]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-[#9a8f81] mb-6">
            <Link href={`/${locale}`} className="hover:text-[#e6c184] transition-colors">
              {isRtl ? "الرئيسية" : "Home"}
            </Link>
            <span className="material-symbols-outlined text-[14px]">chevron_left</span>
            <Link href={`/${locale}/books`} className="hover:text-[#e6c184] transition-colors">
              {isRtl ? "عوالم السرد" : "Story Realms"}
            </Link>
            <span className="material-symbols-outlined text-[14px]">chevron_left</span>
            <span className="text-[#e6c184] font-bold">
              {isRtl ? "أطلس السرد الحي والتسلسل البياني (P20)" : "Narrative Atlas & Network"}
            </span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-3xl">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2.5 py-1 rounded bg-[#272a33] text-[#e6c184] text-xs font-bold border border-[#4e463a]/30 flex items-center gap-1">
                  <Network className="w-3.5 h-3.5" />
                  <span>أطلس السرد الحي وشبكة العلاقات</span>
                </span>
                <span className="px-2.5 py-1 rounded bg-[#93000a]/20 text-[#ffb4ab] text-[11px] font-bold border border-[#ffb4ab]/30">
                  +١٨ مشفر تفاعلياً
                </span>
              </div>
              <h1 className="font-serif text-3xl sm:text-5xl font-black text-[#e0e2ef] tracking-tight">
                {isRtl ? "أطلس حكاية «شفرة قصر الحمراء» والشخصيات" : "Alhambra Narrative Atlas & Characters"}
              </h1>
              <p className="font-serif text-sm sm:text-base text-[#d1c5b5] mt-3 leading-relaxed">
                {isRtl
                  ? "مخطوطة تفاعلية لرصد العلاقات الغامضة، الشخوص المسافرة في الساحل المنسي، والمدونات المكتشفة تباعاً بما يتزامن حصراً مع وتيرة مطالعتك الحالية."
                  : "Interactive visual manuscript tracking character networks, locations, and discovered clues in strict sync with your reading progress."}
              </p>
            </div>

            {/* Quick Action */}
            <div className="flex items-center gap-3 shrink-0">
              <Link
                href={`/${locale}/reader/alhambra-code-andalusian-manuscript`}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#e6c184] text-[#422c00] font-black text-xs hover:bg-[#ffdeaa] transition-colors shadow-lg"
              >
                <BookOpen className="w-4 h-4" />
                <span>استئناف القراءة (الفصل الأول)</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-10 space-y-8">
        {/* Interactive Spoiler Threshold System Bar (P20 Signature) */}
        <div className="p-6 rounded-3xl bg-[#1c1f29] border border-[#e6c184]/40 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1 text-start">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#e6c184] text-[20px]">tune</span>
              <h3 className="font-serif text-base font-black text-[#e0e2ef]">
                عتبة الحرق السردي الذكية (Smart Spoiler Shield)
              </h3>
            </div>
            <p className="text-xs text-[#cdc6b8]">
              حدد نسبة تقدمك الحالية في الرواية ليتم إخفاء أي شخوص أو علاقات لم تبلغها بعد تلقائياً.
            </p>
          </div>

          <div className="flex items-center gap-4 w-full md:w-96">
            <span className="font-mono text-xs font-bold text-[#9a8f81]">٠٪</span>
            <input
              type="range"
              min="0"
              max="100"
              value={spoilerThreshold}
              onChange={(e) => setSpoilerThreshold(Number(e.target.value))}
              className="w-full accent-[#e6c184] cursor-pointer"
            />
            <span className="font-mono text-xs font-black text-[#e6c184] px-2.5 py-1 rounded bg-[#272a33] border border-[#e6c184]/40 shrink-0">
              {spoilerThreshold}٪
            </span>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-2 border-b border-[#4e463a]/30 pb-4">
          <button
            onClick={() => setActiveTab("characters")}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeTab === "characters"
                ? "bg-[#272a33] text-[#e6c184] border border-[#e6c184]/40 shadow-md"
                : "text-[#d1c5b5] hover:text-[#e0e2ef]"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>شبكة الشخصيات ({characters.filter((c) => c.minThreshold <= spoilerThreshold).length})</span>
          </button>

          <button
            onClick={() => setActiveTab("locations")}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeTab === "locations"
                ? "bg-[#272a33] text-[#e6c184] border border-[#e6c184]/40 shadow-md"
                : "text-[#d1c5b5] hover:text-[#e0e2ef]"
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>خريطة المواقع والأرشيف</span>
          </button>
        </div>

        {/* TAB 1: CHARACTERS */}
        {activeTab === "characters" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Characters List (5 Cols) */}
            <div className="lg:col-span-5 space-y-4">
              {characters.map((char) => {
                const isUnlocked = char.minThreshold <= spoilerThreshold
                const isSelected = selectedCharacterId === char.id

                return (
                  <div
                    key={char.id}
                    onClick={() => isUnlocked && setSelectedCharacterId(char.id)}
                    className={`p-4 rounded-2xl border transition-all text-start relative overflow-hidden ${
                      !isUnlocked
                        ? "bg-[#181b25] border-[#4e463a]/20 opacity-60 cursor-not-allowed"
                        : isSelected
                        ? "bg-[#272a33] border-[#e6c184] shadow-lg cursor-pointer"
                        : "bg-[#1c1f29] border-[#4e463a]/40 hover:border-[#e6c184]/50 cursor-pointer"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-[#272a33] shrink-0 border border-[#4e463a]/40">
                        {isUnlocked ? (
                          <img src={char.avatar} alt={char.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-[#10131c] text-[#9a8f81]">
                            <Lock className="w-5 h-5 text-[#9a8f81]" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-serif text-base font-black text-[#e0e2ef]">
                            {isUnlocked ? char.name : "شخصية محجوبة (حرق سردي)"}
                          </h4>
                          {isUnlocked ? (
                            <span className="text-[10px] px-2 py-0.5 rounded bg-[#e6c184]/20 text-[#e6c184] font-bold">
                              {char.status}
                            </span>
                          ) : (
                            <span className="text-[10px] px-2 py-0.5 rounded bg-[#93000a]/20 text-[#ffb4ab] font-bold">
                              يفتح عند {char.minThreshold}٪
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#cdc6b8] line-clamp-1">
                          {isUnlocked ? char.role : "استمر في القراءة لتكشف هوية هذه الشخصية."}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Selected Character Deep Profile (7 Cols) */}
            <div className="lg:col-span-7">
              {selectedChar && selectedChar.minThreshold <= spoilerThreshold ? (
                <div className="p-6 sm:p-8 rounded-3xl bg-[#1c1f29] border border-[#e6c184]/40 shadow-2xl space-y-6 text-start">
                  <div className="flex flex-col sm:flex-row gap-6 items-start">
                    <img
                      src={selectedChar.avatar}
                      alt={selectedChar.name}
                      className="w-24 h-24 rounded-3xl object-cover border-2 border-[#e6c184] shadow-md"
                    />
                    <div>
                      <span className="text-xs font-bold text-[#e6c184] block mb-1">
                        {selectedChar.role}
                      </span>
                      <h3 className="font-serif text-2xl sm:text-3xl font-black text-[#e0e2ef]">
                        {selectedChar.name}
                      </h3>
                      <p className="font-serif text-xs sm:text-sm text-[#d1c5b5] mt-2 leading-relaxed">
                        {selectedChar.description}
                      </p>
                    </div>
                  </div>

                  {/* Clues Box */}
                  <div className="p-4 rounded-2xl bg-[#181b25] border border-[#4e463a]/30 space-y-2">
                    <span className="text-xs font-bold text-[#e6c184] block flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px]">fingerprint</span>
                      <span>الأدلة والقرائن المرتبطة بالشخصية:</span>
                    </span>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {selectedChar.clues.map((clue, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 rounded-xl bg-[#272a33] text-xs font-medium text-[#e0e2ef] border border-[#4e463a]/40"
                        >
                          🔍 {clue}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Relational Connections */}
                  <div className="p-4 rounded-2xl bg-[#181b25] border border-[#4e463a]/30 space-y-2">
                    <span className="text-xs font-bold text-[#e6c184] block flex items-center gap-1.5">
                      <Network className="w-4 h-4" />
                      <span>شبكة الروابط السردية:</span>
                    </span>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {selectedChar.connections.map((conn, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 rounded-xl bg-[#272a33] text-xs font-medium text-[#cdc6b8] border border-[#4e463a]/40"
                        >
                          🔗 {conn}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-12 rounded-3xl bg-[#181b25] border border-[#4e463a]/30 text-center space-y-3">
                  <Lock className="w-8 h-8 text-[#9a8f81] mx-auto" />
                  <p className="text-sm font-bold text-[#e0e2ef]">هذه الشخصية محجوبة بعتبة الحرق السردي</p>
                  <p className="text-xs text-[#9a8f81]">
                    حرك شريط النسبة بالأعلى أو تابع القراءة لفتح ملف الشخصية الكامل.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: LOCATIONS */}
        {activeTab === "locations" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-start">
            {locations.map((loc) => {
              const isUnlocked = loc.minThreshold <= spoilerThreshold

              return (
                <div
                  key={loc.id}
                  className={`rounded-3xl border overflow-hidden transition-all shadow-xl ${
                    !isUnlocked
                      ? "bg-[#181b25] border-[#4e463a]/20 opacity-60"
                      : "bg-[#1c1f29] border-[#4e463a]/40 hover:border-[#e6c184]"
                  }`}
                >
                  <div className="relative aspect-video w-full overflow-hidden bg-[#272a33]">
                    {isUnlocked ? (
                      <img src={loc.img} alt={loc.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-[#10131c]">
                        <Lock className="w-6 h-6 text-[#9a8f81]" />
                      </div>
                    )}
                    <div className="absolute top-3 right-3">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#10131c]/80 backdrop-blur-md text-[#e6c184] text-[10px] font-bold">
                        {loc.era}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 space-y-2">
                    <span className="text-[10px] text-[#9a8f81] block">{loc.type}</span>
                    <h4 className="font-serif text-base font-black text-[#e0e2ef]">
                      {isUnlocked ? loc.name : "موقع محجوب"}
                    </h4>
                    <p className="font-serif text-xs text-[#d1c5b5] line-clamp-3 leading-relaxed">
                      {isUnlocked ? loc.desc : "استمر في القراءة للكشف عن أسرار هذا الموقع."}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
