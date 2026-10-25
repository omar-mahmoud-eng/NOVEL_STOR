"use client"

import React, { useState } from "react"
import Link from "next/link"
import { PUBLISHING_BOOKS } from "@/lib/books-data"
import {
  MessageSquare,
  Lock,
  Eye,
  Calendar,
  Quote,
  Shield,
  Award,
  ChevronLeft,
  ChevronRight,
  Bookmark,
  Share2,
  Flag,
  Sparkles,
  BookOpen,
  Users,
  Compass,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react"

type SalonsViewProps = {
  locale: "ar" | "en"
}

type TabType = "clubs" | "quotes" | "calendar"

export function SalonsView({ locale }: SalonsViewProps) {
  const isRtl = locale === "ar"
  const [activeTab, setActiveTab] = useState<TabType>("clubs")
  const [filterMode, setFilterMode] = useState<"all" | "active" | "critique">("all")
  const [unlockedSpoilers, setUnlockedSpoilers] = useState<Record<string, boolean>>({})

  const toggleSpoiler = (id: string) => {
    setUnlockedSpoilers((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  // Sample data inspired by Stitch p21_base_1440
  const clubs = [
    {
      id: "club-1",
      title: "صالون أدب الموانئ والغموض التاريخي",
      bookTitle: "شفرة قصر الحمراء",
      bookHandle: "alhambra-code-andalusian-manuscript",
      moderator: "د. طارق السعيد (محرر دراسات سردية)",
      membersCount: 342,
      activeDebate: "دلالة المرفأ المهجوم ومفتاح المستودع الثامن",
      genre: "أدب وثائقي وتاريخي",
      meetingTime: "كل أربعاء ٢١:٠٠ بتوقيت مكة",
    },
    {
      id: "club-2",
      title: "ملتقى الرواية الفلسفية ونصوص العزلة",
      bookTitle: "ساعات الرمل والذاكرة",
      bookHandle: "sand-hours-philosophical-solitude",
      moderator: "ليلى المنصور (روائية)",
      membersCount: 245,
      activeDebate: "الزمن الدائري وانعكاسات الكثبان على لغة البطل",
      genre: "فلسفة ووجودية",
      meetingTime: "كل خميس ٢٠:٠٠ بتوقيت مكة",
    },
    {
      id: "club-3",
      title: "حلقة السرد المكثف وقصص الخمس دقائق",
      bookTitle: "دفتر العابرين",
      bookHandle: "passersby-notebook-daily-notes",
      moderator: "عمر اليافعي (ناقد أدبي)",
      membersCount: 412,
      activeDebate: "تحدي التدوين التحليلي: بلاغة الإيجاز",
      genre: "ومضات وسير",
      meetingTime: "تفاعل مفتوح يومياً",
    },
  ]

  const quotes = [
    {
      id: "q1",
      quote: "«في بهو الأسود بقصر الحمراء، النقوش الهندسية لم تكن مجرد زخرفة، بل كانت شفرات رياضية لحفظ مكتبة كاملة من الضياع.»",
      book: "شفرة قصر الحمراء",
      author: "د. غسان الكيلاني",
      likes: 184,
      saved: true,
    },
    {
      id: "q2",
      quote: "«حين يختلط الحبر بمطر الميناء، تسقط التواريخ المكتوبة ولا يتبقى سوى صوت الخشب المبتل تحت خطوات العابرين.»",
      book: "خرائط الرماد",
      author: "مروان الكاتب",
      likes: 247,
      saved: false,
    },
    {
      id: "q3",
      quote: "«العزلة في الصحراء ليست فراغاً، بل مرآة صقيلة تعيد إليك كل الأصوات التي حاولت الهروب منها في صخب المدن.»",
      book: "ساعات الرمل",
      author: "ليلى المنصور",
      likes: 312,
      saved: true,
    },
  ]

  const releases = [
    {
      date: "٢٨ أكتوبر ٢٠٢٦",
      day: "الأربعاء",
      title: "إطلاق التسجيل الصوتي المكاني ثلاثي الأبعاد: الفصل الرابع",
      book: "شفرة قصر الحمراء",
      type: "صوتي Spatial",
      badge: "حصري VIP",
    },
    {
      date: "١ نوفمبر ٢٠٢٦",
      day: "الأحد",
      title: "أمسية الحوار المفتوح مع المؤلف د. غسان الكيلاني",
      book: "صالون الأدب الأندلسي",
      type: "صالون حي",
      badge: "بث صوتي مباشر",
    },
    {
      date: "٥ نوفمبر ٢٠٢٦",
      day: "الخميس",
      title: "صدور الطبعة الورقية المجلدة الموقعة برقم تسلسلي خاص",
      book: "أطياف بغداد القديمة",
      type: "ورقي فاخر",
      badge: "نسخ محدودة",
    },
  ]

  return (
    <div className="min-h-screen bg-[#10131c] text-[#e0e2ef] pb-24">
      {/* Top Banner / Hero */}
      <section className="relative overflow-hidden bg-[#0b0e17] border-b border-[#4e463a]/40 pt-12 pb-16">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#e6c184]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-[#9a8f81] mb-6">
            <Link href={`/${locale}`} className="hover:text-[#e6c184] transition-colors">
              {isRtl ? "الرئيسية" : "Home"}
            </Link>
            <span className="material-symbols-outlined text-[14px]">chevron_left</span>
            <span className="text-[#e6c184] font-bold">
              {isRtl ? "الأندية الأدبية وصالونات الحوار الراشد (P21)" : "Literary Salons & Clubs"}
            </span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-3xl">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2.5 py-1 rounded bg-[#93000a]/20 text-[#ffb4ab] text-[11px] font-bold border border-[#ffb4ab]/30">
                  +١٨ صالونات حوارية راشدة
                </span>
                <span className="px-2.5 py-1 rounded bg-[#272a33] text-[#e6c184] text-xs font-bold border border-[#4e463a]/30 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">verified</span>
                  إشراف تحريري مباشر • حظر تام للرسائل الخاصة (No DMs)
                </span>
              </div>
              <h1 className="font-serif text-3xl sm:text-5xl font-black text-[#e0e2ef] tracking-tight">
                {isRtl ? "الأندية الأدبية وصالونات الحوار الراشد" : "Literary Salons & Mature Book Clubs"}
              </h1>
              <p className="font-serif text-sm sm:text-base text-[#d1c5b5] mt-3 leading-relaxed">
                {isRtl
                  ? "مساحات حوارية منتقاة بروح سينمائية، تخضع لإشراف تحريري لحماية متعة الاكتشاف وخالية من الرسائل الخاصة والتتبع السلوكي."
                  : "Cinematic literary discussion circles curated by editors, strictly free of private messaging and behavioral tracking."}
              </p>
            </div>

            {/* View Sub-tabs */}
            <div className="flex items-center p-1 rounded-2xl bg-[#181b25] border border-[#4e463a]/40 shrink-0">
              <button
                onClick={() => setActiveTab("clubs")}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === "clubs"
                    ? "bg-[#272a33] text-[#e6c184] shadow-md border border-[#e6c184]/30"
                    : "text-[#d1c5b5] hover:text-[#e0e2ef]"
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">forum</span>
                <span>{isRtl ? "الأندية الأدبية" : "Book Clubs"}</span>
              </button>

              <button
                onClick={() => setActiveTab("quotes")}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === "quotes"
                    ? "bg-[#272a33] text-[#e6c184] shadow-md border border-[#e6c184]/30"
                    : "text-[#d1c5b5] hover:text-[#e0e2ef]"
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">format_quote</span>
                <span>{isRtl ? "اقتباسات القراء (Quotes)" : "Quotes Journal"}</span>
              </button>

              <button
                onClick={() => setActiveTab("calendar")}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === "calendar"
                    ? "bg-[#272a33] text-[#e6c184] shadow-md border border-[#e6c184]/30"
                    : "text-[#d1c5b5] hover:text-[#e0e2ef]"
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">event_upcoming</span>
                <span>{isRtl ? "تقويم الإصدارات (Calendar)" : "Calendar"}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-12">
        {/* TAB 1: CLUBS */}
        {activeTab === "clubs" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Main Feed Column (8 Cols) */}
            <div className="lg:col-span-8 space-y-8">
              {/* Featured Curated Club Spotlight */}
              <div className="relative overflow-hidden rounded-3xl bg-[#1c1f29] border border-[#e6c184]/40 p-6 sm:p-8 shadow-2xl group">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#e6c184] animate-ping" />
                    <span className="text-xs font-bold text-[#e6c184] tracking-wider uppercase">
                      {isRtl ? "الصالون المميز لهذا الأسبوع" : "Featured Salon of the Week"}
                    </span>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded bg-[#272a33] text-[#cdc6b8] border border-[#4e463a]/30">
                    حلقة نقاش حصرية مغلقة
                  </span>
                </div>

                <div className="flex flex-col md:flex-row gap-6">
                  <div className="w-full md:w-48 shrink-0 aspect-[3/4] rounded-2xl overflow-hidden bg-[#272a33] relative">
                    <img
                      src="https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=600&q=80"
                      alt="صالون الأدب الأندلسي"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#10131c] via-transparent to-transparent opacity-90" />
                    <div className="absolute bottom-3 right-3 left-3 text-start">
                      <span className="text-[10px] font-bold text-[#e6c184] block">رواية الموسم</span>
                      <span className="font-serif text-sm font-black text-[#e0e2ef]">شفرة قصر الحمراء</span>
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col justify-between text-start space-y-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-[#cdc6b8] mb-2">
                        <span className="px-2 py-0.5 rounded bg-[#272a33] text-[#e6c184] font-bold">
                          أدب الموانئ والغموض التاريخي
                        </span>
                        <span>•</span>
                        <span>٣٤٢ قارئاً موثقاً</span>
                        <span>•</span>
                        <span>جلسة الأربعاء ٢١:٠٠</span>
                      </div>
                      <h2 className="font-serif text-2xl font-black text-[#e0e2ef] group-hover:text-[#e6c184] transition-colors">
                        تفكيك الرمزية الرياضية في رواية «شفرة قصر الحمراء»
                      </h2>
                      <p className="font-serif text-xs sm:text-sm text-[#d1c5b5] mt-2 leading-relaxed">
                        مناقشات متعمقة في البنية التحريرية والرمزية التاريخية للمخطوطات الأندلسية، بعيداً عن الاستعجال الاستهلاكي. نفكك رمزية عمود السباع والنسب الذهبية في تخطيط المتاحف.
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-[#4e463a]/30">
                      <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#e6c184] text-[#422c00] font-black text-xs hover:bg-[#ffdeaa] transition-colors">
                        <span className="material-symbols-outlined text-[18px]">group_add</span>
                        <span>{isRtl ? "انضم لحلقة النقاش" : "Join Circle"}</span>
                      </button>
                      <Link
                        href={`/${locale}/books/alhambra-code-andalusian-manuscript`}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#272a33] text-[#e0e2ef] hover:bg-[#32343e] font-bold text-xs border border-[#4e463a]/40 transition-colors"
                      >
                        <span className="material-symbols-outlined text-[18px]">menu_book</span>
                        <span>{isRtl ? "تصفح الرواية" : "Inspect Novel"}</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Discussions Stream */}
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-[#4e463a]/30">
                  <h3 className="font-serif text-lg font-black text-[#e0e2ef]">
                    {isRtl ? "المداخلات والتحليلات الأدبية الجارية" : "Live Literary Discourse"}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-[#cdc6b8]">
                    <span className="material-symbols-outlined text-[16px] text-emerald-400">verified</span>
                    <span>{isRtl ? "مداخلات مراقبة تحريرياً" : "Editorial Monitored"}</span>
                  </div>
                </div>

                {/* Thread 1: Open Literary Analysis */}
                <article className="p-6 rounded-2xl bg-[#1c1f29] border border-[#4e463a]/40 hover:border-[#e6c184]/50 transition-all text-start space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#272a33] flex items-center justify-center font-serif text-lg font-bold text-[#e6c184] border border-[#4e463a]/40">
                        ك
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-[#e0e2ef]">كمال الزياني</span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-[#272a33] text-[#e6c184]">
                            قارئ متقدم
                          </span>
                        </div>
                        <span className="text-xs text-[#9a8f81]">منذ ٣ ساعات • صالون الغموض التاريخي</span>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded bg-[#272a33] text-xs text-[#d1c5b5]">
                      نقاش مفتوح للفصل الأول
                    </span>
                  </div>

                  <h4 className="font-serif text-base sm:text-lg font-black text-[#e0e2ef] hover:text-[#e6c184] transition-colors cursor-pointer">
                    دلالة الحجر الثاني عشر وساعة الرمل الأندلسية
                  </h4>
                  <p className="font-serif text-xs sm:text-sm text-[#d1c5b5] leading-relaxed">
                    «توقف السارد ملياً عند رائحة القطران المحترق قبل ولوج الباب الحديدي، وهي مفارقة بصرية تستدعي ما ورد في الأرشيف البحري القديم. هل تعتقدون أن المستودع يمثل الحاجز النفسي للبطل قبل ارتكاب خطيئته الأولى؟»
                  </p>

                  <div className="flex items-center justify-between pt-3 border-t border-[#4e463a]/30 text-xs text-[#cdc6b8]">
                    <div className="flex items-center gap-4">
                      <button className="flex items-center gap-1 hover:text-[#e6c184] transition-colors">
                        <span className="material-symbols-outlined text-[16px]">chat_bubble_outline</span>
                        <span>ردود معتمدة (١٨)</span>
                      </button>
                      <button className="flex items-center gap-1 hover:text-[#e6c184] transition-colors">
                        <span className="material-symbols-outlined text-[16px]">bookmark_border</span>
                        <span>حفظ المداخلة</span>
                      </button>
                    </div>
                    <button className="flex items-center gap-1 text-[#9a8f81] hover:text-red-400 transition-colors">
                      <span className="material-symbols-outlined text-[16px]">flag</span>
                      <span>إبلاغ تحريري</span>
                    </button>
                  </div>
                </article>

                {/* Thread 2: SPOILER CONTROLLED (P21 Signature) */}
                <article className="p-6 rounded-2xl bg-[#1c1f29] border border-[#ffb4ab]/30 hover:border-[#ffb4ab]/60 transition-all text-start space-y-3 relative overflow-hidden">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#93000a]/20 flex items-center justify-center font-serif text-lg font-bold text-[#ffb4ab] border border-[#ffb4ab]/30">
                        م
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-[#e0e2ef]">مريم البستاني</span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-[#93000a]/30 text-[#ffb4ab] font-bold">
                            ناقدة ضيفة
                          </span>
                        </div>
                        <span className="text-xs text-[#9a8f81]">منذ ٦ ساعات • مناقشة المخطوطة الكاملة</span>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#93000a]/20 text-[#ffb4ab] text-xs font-bold border border-[#ffb4ab]/40">
                      <span className="material-symbols-outlined text-[14px]">warning</span>
                      تحذير حرق سردي (+٥٠٪ من الرواية)
                    </span>
                  </div>

                  <h4 className="font-serif text-base sm:text-lg font-black text-[#e0e2ef]">
                    توقعات ما وراء الحبر الأزرق: من أرسل الخريطة في ختام الفصل التاسع؟
                  </h4>

                  {/* Blur Shield */}
                  <div className="relative rounded-xl overflow-hidden p-4 bg-[#10131c] border border-[#4e463a]/40 min-h-[120px] flex items-center justify-center">
                    {!unlockedSpoilers["spoiler-1"] ? (
                      <div className="text-center space-y-2 p-2">
                        <div className="w-9 h-9 rounded-full bg-[#272a33] text-[#e6c184] flex items-center justify-center mx-auto">
                          <span className="material-symbols-outlined text-[20px]">lock</span>
                        </div>
                        <p className="text-xs text-[#d1c5b5] max-w-sm">
                          هذا الطرح يحتوي على كشف لعقدة مصيرية في رواية «شفرة قصر الحمراء». اضغط أدناه إذا كنت قد أتممت قراءة الفصل السابع.
                        </p>
                        <button
                          onClick={() => toggleSpoiler("spoiler-1")}
                          className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#272a33] border border-[#e6c184]/50 text-[#e6c184] text-xs font-bold hover:bg-[#e6c184] hover:text-[#422c00] transition-all"
                        >
                          <span className="material-symbols-outlined text-[16px]">visibility</span>
                          <span>كشف التحليل الأدبي (+18)</span>
                        </button>
                      </div>
                    ) : (
                      <div className="text-start space-y-2">
                        <p className="font-serif text-xs sm:text-sm text-[#e0e2ef] leading-relaxed">
                          «الوثيقة الدامغة تثبت أن المحقق نفسه كان على متن الفرقاطة قبل اشتعال النيران، والرسائل المتبادلة بين الكولونيل وقبطان الميناء تؤكد تورط النبلاء في تهريب الصناديق الثلاثة المختومة بالشمع الأسود دون علم الحاكم العسكري. دلالة اختيار الحبر النيلي تشير مباشرة إلى مستعمرات الشرق.»
                        </p>
                        <button
                          onClick={() => toggleSpoiler("spoiler-1")}
                          className="text-[11px] text-[#e6c184] hover:underline block pt-1"
                        >
                          إعادة حجب النص
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-[#4e463a]/30 text-xs text-[#cdc6b8]">
                    <span className="hover:text-[#e6c184] cursor-pointer">ردود المحللين (٩)</span>
                    <button className="text-[#9a8f81] hover:text-red-400 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">flag</span>
                      <span>إبلاغ تحريري</span>
                    </button>
                  </div>
                </article>
              </div>
            </div>

            {/* Sidebar Column (4 Cols) */}
            <aside className="lg:col-span-4 space-y-6 text-start">
              {/* Back to Novel Quick Link */}
              <Link
                href={`/${locale}/books/alhambra-code-andalusian-manuscript`}
                className="p-4 rounded-2xl bg-[#1c1f29] border border-[#e6c184]/30 hover:border-[#e6c184] transition-all flex items-center justify-between group shadow-lg"
              >
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#e6c184] text-[24px]">auto_stories</span>
                  <div>
                    <span className="text-[10px] text-[#9a8f81] block">الرواية المصدرية المتصلة</span>
                    <span className="font-serif text-xs sm:text-sm font-bold text-[#e0e2ef] group-hover:text-[#e6c184] transition-colors">
                      شفرة قصر الحمراء (P02)
                    </span>
                  </div>
                </div>
                <span className="material-symbols-outlined text-[#e6c184] group-hover:-translate-x-1 transition-transform">
                  arrow_back
                </span>
              </Link>

              {/* Community Charter & Policy Card (P21 Signature) */}
              <div className="p-6 rounded-2xl bg-[#181b25] border border-[#4e463a]/40 relative overflow-hidden shadow-xl">
                <div className="absolute top-0 right-0 w-1.5 h-full bg-[#e6c184]" />
                <div className="flex items-center gap-2 pb-3 border-b border-[#4e463a]/30 mb-4">
                  <span className="material-symbols-outlined text-[#e6c184] text-[22px]">policy</span>
                  <h3 className="font-serif text-base font-black text-[#e0e2ef]">
                    ميثاق الصالونات الأدبية للبالغين
                  </h3>
                </div>
                <p className="text-xs text-[#cdc6b8] leading-relaxed mb-4">
                  للحفاظ على هيبة الحوار الأدبي وعمقه الرصين، تخضع جميع الصالونات للشروط الصارمة التالية:
                </p>
                <ol className="space-y-3 text-xs text-[#e0e2ef]">
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#272a33] text-[#e6c184] flex items-center justify-center shrink-0 font-bold text-[11px] mt-0.5">
                      ١
                    </span>
                    <span>
                      <strong className="text-[#e6c184]">إشراف تحريري مسبق</strong> على كافة المداخلات لمنع التراشق السطحي.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#272a33] text-[#e6c184] flex items-center justify-center shrink-0 font-bold text-[11px] mt-0.5">
                      ٢
                    </span>
                    <span>
                      <strong className="text-[#e6c184]">حظر تام للرسائل الخاصة (No DMs)</strong> لضمان بيئة آمنة ونزيهة خالية من المضايقات.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#272a33] text-[#e6c184] flex items-center justify-center shrink-0 font-bold text-[11px] mt-0.5">
                      ٣
                    </span>
                    <span>
                      <strong className="text-[#e6c184]">التزام إلزامي بوسوم الحرق</strong> لحماية متعة القراء الجدد.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#272a33] text-[#e6c184] flex items-center justify-center shrink-0 font-bold text-[11px] mt-0.5">
                      ٤
                    </span>
                    <span>
                      <strong className="text-[#e6c184]">عزل تام عن عوالم الأطفال</strong> لمنع تسرب أي أفكار غير ملائمة للناشئة.
                    </span>
                  </li>
                </ol>
              </div>

              {/* Parallel Salons */}
              <div className="space-y-3">
                <h4 className="font-serif text-sm font-bold text-[#e0e2ef]">صالونات أدبية موازية</h4>
                {clubs.slice(1).map((c) => (
                  <div
                    key={c.id}
                    className="p-4 rounded-xl bg-[#1c1f29] border border-[#4e463a]/30 hover:border-[#e6c184]/40 transition-colors group"
                  >
                    <div className="flex items-center justify-between text-[11px] text-[#9a8f81] mb-1">
                      <span className="text-[#e6c184] font-bold">{c.genre}</span>
                      <span>{c.membersCount} عضواً</span>
                    </div>
                    <h5 className="font-serif text-xs sm:text-sm font-bold text-[#e0e2ef] group-hover:text-[#e6c184] transition-colors">
                      {c.title}
                    </h5>
                    <p className="text-[11px] text-[#d1c5b5] mt-1">{c.activeDebate}</p>
                    <div className="mt-3 flex items-center justify-between text-[11px] text-[#9a8f81]">
                      <span>{c.meetingTime}</span>
                      <span className="material-symbols-outlined text-[16px] text-[#e6c184] group-hover:-translate-x-1 transition-transform">
                        arrow_back
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        )}

        {/* TAB 2: QUOTES JOURNAL */}
        {activeTab === "quotes" && (
          <div className="space-y-8">
            <div className="max-w-2xl text-start">
              <h2 className="font-serif text-2xl font-black text-[#e0e2ef]">
                {isRtl ? "دفتر اقتباسات القراء (Quotes Journal)" : "Readers Quotes Journal"}
              </h2>
              <p className="text-xs sm:text-sm text-[#d1c5b5] mt-1">
                {isRtl
                  ? "عبارات وجدانية استوقفت القراء في أروقة الروايات، موثقة بالصفحة والفصل والكاتب."
                  : "Profound quotes highlighted by verified readers in the digital and parchment reading rooms."}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {quotes.map((q) => (
                <div
                  key={q.id}
                  className="p-6 rounded-3xl bg-[#1c1f29] border border-[#4e463a]/40 hover:border-[#e6c184] transition-all flex flex-col justify-between shadow-xl text-start group"
                >
                  <div className="space-y-4">
                    <span className="material-symbols-outlined text-[#e6c184] text-[32px] opacity-60">
                      format_quote
                    </span>
                    <blockquote className="font-serif text-sm sm:text-base text-[#e0e2ef] leading-relaxed italic">
                      {q.quote}
                    </blockquote>
                  </div>

                  <div className="pt-6 border-t border-[#4e463a]/30 mt-6 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-[#e6c184] block">{q.book}</span>
                      <span className="text-[11px] text-[#9a8f81]">{q.author}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[#cdc6b8]">
                      <button className="flex items-center gap-1 hover:text-[#e6c184] transition-colors">
                        <span className="material-symbols-outlined text-[16px]">favorite</span>
                        <span>{q.likes}</span>
                      </button>
                      <button className="hover:text-[#e6c184] transition-colors">
                        <span className="material-symbols-outlined text-[16px]">share</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: CALENDAR */}
        {activeTab === "calendar" && (
          <div className="space-y-8">
            <div className="max-w-2xl text-start">
              <h2 className="font-serif text-2xl font-black text-[#e0e2ef]">
                {isRtl ? "تقويم الإصدارات والأمسيات التحريرية (P21-CALENDAR)" : "Release & Editorial Calendar"}
              </h2>
              <p className="text-xs sm:text-sm text-[#d1c5b5] mt-1">
                {isRtl
                  ? "مواعيد صدور الفصول الصوتية الجديدة، اللقاءات المباشرة مع الكتاب، وتواريخ الشحن المجلد."
                  : "Schedule of upcoming audio chapter drops, live author circles, and limited print editions."}
              </p>
            </div>

            <div className="space-y-4">
              {releases.map((rel, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-[#1c1f29] border border-[#4e463a]/40 hover:border-[#e6c184]/50 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 text-start"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-[#272a33] border border-[#4e463a]/40 flex flex-col items-center justify-center shrink-0 text-center">
                      <span className="text-[10px] text-[#e6c184] font-bold">{rel.day}</span>
                      <span className="font-serif text-sm font-black text-[#e0e2ef]">{rel.date.split(" ")[0]}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 rounded bg-[#e6c184]/20 text-[#e6c184] text-[10px] font-bold">
                          {rel.badge}
                        </span>
                        <span className="text-xs text-[#9a8f81]">{rel.type}</span>
                      </div>
                      <h4 className="font-serif text-base font-black text-[#e0e2ef]">{rel.title}</h4>
                      <span className="text-xs text-[#d1c5b5]">{rel.book}</span>
                    </div>
                  </div>

                  <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#272a33] text-[#e6c184] text-xs font-bold hover:bg-[#32343e] border border-[#4e463a]/40 transition-colors self-start md:self-auto">
                    <span className="material-symbols-outlined text-[16px]">notifications_active</span>
                    <span>{isRtl ? "تذكير بالموعد" : "Set Reminder"}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
