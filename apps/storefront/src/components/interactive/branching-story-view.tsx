"use client"

import React, { useState } from "react"
import Link from "@/components/common/realm-link"
import { useLocalSetting } from "@/hooks/use-local-setting"
import { useNarration } from "@/hooks/use-narration"
import { useCustomerAuth } from "@/context/customer-auth-context"
import {
  RotateCcw,
  BookmarkCheck,
  Undo2,
  BookOpen,
  Volume2,
  Play,
  Pause,
  MapPin,
  GitBranch,
  Layers,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  Sparkles,
  Compass,
} from "lucide-react"

type BranchingStoryViewProps = {
  locale: "ar" | "en"
}

interface StoryNode {
  id: string
  chapterTitle: string
  location: string
  era: string
  bannerImg: string
  dropCap: string
  prose: string[]
  quote: {
    text: string
    source: string
  }
  options: {
    id: string
    label: string
    title: string
    description: string
    badge: string
    targetNodeId: string
  }[]
  isEnding?: boolean
  endingType?: string
}

const STORY_NODES: Record<string, StoryNode> = {
  root: {
    id: "root",
    chapterTitle: "علامة على الخريطة",
    location: "أزقة المرفأ القديم — شتاء ١٩١٤",
    era: "شتاء ١٩١٤",
    bannerImg: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1600&q=80",
    dropCap: "و",
    prose: [
      "قفت سلمى عند المنعطف الحجري حيث ينتهي الشارع الأول المرسوم بالمداد الأزرق. كان المطر الخفيف يغسل أسماء الأزقة القديمة، وفي كفها الخريطة ترتجف تحت ضوء مصباح زيتي خافت. أمامها خياران لا ثالث لهما: إما أن تتبع الرائحة العالقة بالأوراق نحو أرصفة المرفأ المندثر، أو أن تعود أدراجها خطوة واحدة لتفحص سجلات الأرشيف المودعة في قبو المدينة القديم قبل أن يبتلع الضباب كل أثر.",
      "أطبقت أصابعها على الطرف الممزق من الخريطة؛ كان الورق خشناً تفوح منه رائحة ملح البحر الممزوجة برصاص الطباعة المحرمة. ارتطم باب خشبي في آخر الزقاق بصفقة حادة قطعت صفير الرياح. في تلك اللحظة بالذات، تراءى لها أن أضواء الفوانيس المعلقة على رافعات السفن المهجورة بدأت تخبو واحداً تلو الآخر، بينما تنبعث من مدخل قبو دار المحفوظات رنة حديد مكتومة—كأن أحدهم قد بدأ للتو بفك قيود البوابة السرية.",
    ],
    quote: {
      text: "«حين يختلط الحبر بمطر الميناء، تسقط التواريخ المكتوبة ولا يتبقى سوى صوت الخشب المبتل تحت خطوات العابرين.»",
      source: "— من هوامش دفتر المسافر (شتاء ١٩١٤)",
    },
    options: [
      {
        id: "opt-harbor",
        label: "أ",
        title: "أتبع أثر المرفأ المندثر",
        description: "السير نحو أرصفة الميناء المهجورة وتتبع رائحة الملح القديمة والبحث عن الإشارة البحرية المنقوشة.",
        badge: "مسار المخاطرة الميدانية",
        targetNodeId: "node_harbor",
      },
      {
        id: "opt-archive",
        label: "ب",
        title: "أقصد قبو دار المحفوظات",
        description: "النزول السري إلى قبو المحفوظات القديم لفحص سجلات الشحن ومقابلة الحارس العجوز قبل هروبه.",
        badge: "مسار الأرشيف والوثائق السرية",
        targetNodeId: "node_archive",
      },
    ],
  },
  node_harbor: {
    id: "node_harbor",
    chapterTitle: "مستودع الشمع الأسود",
    location: "الرصيف الغربي — حوض السفن",
    era: "شتاء ١٩١٤",
    bannerImg: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=1600&q=80",
    dropCap: "ت",
    prose: [
      "سللت سلمى بمحاذاة القوارب المتآكلة. كان صرير الحبال تحت ثقل الرياح يملأ الفضاء المظلم، وحين اقتربت من المستودع الثامن، رأت خيطاً من الدخان الأبيض يتصاعد من فتحة التهوية السقفية.",
      "لم يكن المستودع مهجوراً كما زعمت تقارير الشرطة! في الداخل، كان ثلاثة رجال يرتدون معاطف ثقيلة يختمون صناديق خشبية بالشمع الأسود. على أحد الصناديق نقش بارز لشعار الأرشيف الملكي الأندلسي ذاته الذي رأته في بهو قصر الحمراء.",
    ],
    quote: {
      text: "«الصناديق التي تُختم في الظلام، إما أنها تحمل أسرار دولة أو جرائم لا يغفرها التاريخ.»",
      source: "— أوراق التحقيق السري",
    },
    options: [
      {
        id: "opt-confront",
        label: "أ",
        title: "مباغتة الحراس والتقاط صورة للختم",
        description: "استخدام كاميرا الكوداك المخبأة لتوثيق الختم الأسود قبل إبحار الفرقاطة.",
        badge: "نهاية التحقيق المصور",
        targetNodeId: "node_ending_evidence",
      },
      {
        id: "opt-stealth",
        label: "ب",
        title: "التسلل خلسة إلى جوف السفينة",
        description: "الاختباء بين براميل المؤن لتتبع وجهة الصناديق إلى العاصمة الغامضة.",
        badge: "مسار الإبحار السري",
        targetNodeId: "node_ending_voyage",
      },
    ],
  },
  node_archive: {
    id: "node_archive",
    chapterTitle: "سرداب الوثائق المحترقة",
    location: "قبو دار المحفوظات المركزية",
    era: "شتاء ١٩١٤",
    bannerImg: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=1600&q=80",
    dropCap: "ه",
    prose: [
      "بطت الدرجات الحجرية الرطبة خطوة تلو الأخرى. كانت رائحة الورق المحترق تزداد كثافة، وأصداء خطوات ثقيلة تبتعد نحو المخرج الخلفي المطل على النهر.",
      "على الطاولة الرخامية في وسط القبو، وجد دفتر المسافر ملقى مفتوحاً، وتحته مفتاح برونزي ضخم يحمل رمز النسر ذي الرأسين. كانت الصفحة الأخيرة لا تزال مبللة بحبر طازج كُتب فيه: 'إن أخذوا الصناديق، فإن الشيفرة بقيت هنا.'",
    ],
    quote: {
      text: "«من يملك المفتاح يملك الرواية، ومن يملك الرواية يعيد كتابة التاريخ.»",
      source: "— مذكرات أمين الأرشيف",
    },
    options: [
      {
        id: "opt-key",
        label: "أ",
        title: "أخذ المفتاح وحرق السجل الأصلي",
        description: "حرمان الملاحقين من أي وسيلة لفك الشيفرة وحماية الأسرار المتبقية.",
        badge: "نهاية الحارس الأبدي",
        targetNodeId: "node_ending_guardian",
      },
      {
        id: "opt-chase",
        label: "ب",
        title: "اللحاق بأمين الأرشيف نحو النهر",
        description: "الركض خلف الخطوات العابرة لسماع الشهادة الكاملة وجهاً لوجه.",
        badge: "نهاية المواجهة المباشرة",
        targetNodeId: "node_ending_meeting",
      },
    ],
  },
  node_ending_evidence: {
    id: "node_ending_evidence",
    chapterTitle: "نهاية المسار: حقيقة المرفأ",
    location: "جريدة الصباح — الطبعة الأولى",
    era: "ربيع ١٩١٥",
    bannerImg: "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=1600&q=80",
    dropCap: "ن",
    prose: [
      "نشرت الصور على الصفحة الأولى بعد ثلاثة أشهر. انكشفت شبكة التهريب بالكامل، ونجت مخطوطات الحمراء من الإتلاف. أصبحت سلمى أصغر رئيسة تحرير استقصائية في تاريخ المدينة.",
    ],
    quote: {
      text: "«الحقيقة ليست ما يكتبه المنتصر، بل ما ينقذه الشاهد في اللحظة الأخيرة.»",
      source: "— مقال العدد التذكاري",
    },
    options: [],
    isEnding: true,
    endingType: "النهاية الذهبية الأولى: كشف الحقائق وتوثيق التاريخ",
  },
  node_ending_voyage: {
    id: "node_ending_voyage",
    chapterTitle: "نهاية المسار: رحلة المجهول",
    location: "المحيط الأطلسي — على متن الفرقاطة",
    era: "شتاء ١٩١٤",
    bannerImg: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=1600&q=80",
    dropCap: "أ",
    prose: [
      "أبحرت السفينة في جنح الظلام. وقفت سلمى على سطح السفينة تراقب أضواء مدينتها تتلاشى في الأفق، حاملة في صدرها لغزاً جديداً سيقودها إلى موانئ الأندلس البعيدة.",
    ],
    quote: {
      text: "«كل رحلة بحث عن المخطوطات هي في حقيقتها رحلة للبحث عن الذات.»",
      source: "— دفتر الرحلة البحرية",
    },
    options: [],
    isEnding: true,
    endingType: "النهاية الملحمية الثانية: الإبحار نحو المجهول",
  },
  node_ending_guardian: {
    id: "node_ending_guardian",
    chapterTitle: "نهاية المسار: أمينة السر",
    location: "صومعة الأرشيف السري",
    era: "خريف ١٩٢٠",
    bannerImg: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=1600&q=80",
    dropCap: "ص",
    prose: [
      "احتفظت سلمى بالمفتاح البرونزي لخمسة وعشرين عاماً. لم يعثر أحد على السجلات المفقودة، وظلت حارسة السر الأندلسي الوحيدة التي تعرف موقع المكتبة المخفية في جبال الأندلس.",
    ],
    quote: {
      text: "«بعض الأسرار أثمن من أن تُنشر، وحفظها يحتاج صبراً يوازي صبر الحجارة.»",
      source: "— وصية الحارسة",
    },
    options: [],
    isEnding: true,
    endingType: "النهاية الغامضة الثالثة: حارسة السر الأبدي",
  },
  node_ending_meeting: {
    id: "node_ending_meeting",
    chapterTitle: "نهاية المسار: اعتراف عند ضفة النهر",
    location: "ضفة النهر القديم",
    era: "شتاء ١٩١٤",
    bannerImg: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1600&q=80",
    dropCap: "ت",
    prose: [
      "لحقت بالرجل عند زورق الصيد. التفت إليها وهو يرفع قبعته المبتلة، لتكتشف أنه كان والدها الذي اختفى منذ عشرين عاماً يبتسم لها ويقول: 'كنت أعلم أنكِ ستتبعين الخريطة.'",
    ],
    quote: {
      text: "«الخريطة لم تكن دليلاً للكنز، بل كانت طريقاً للعودة إلى البيت.»",
      source: "— الكلمات الأخيرة",
    },
    options: [],
    isEnding: true,
    endingType: "النهاية الوجدانية الرابعة: لم الشمل واستعادة الذاكرة",
  },
}

export function BranchingStoryView({ locale }: BranchingStoryViewProps) {
  const isRtl = locale === "ar"
  const narration = useNarration()
  const {customer}=useCustomerAuth()

  const [path,setPath]=useLocalSetting<string[]>(`storyverse.branch.${customer?.id||"guest"}`, ["root"])
  const currentNodeId=path[path.length-1] || "root"
  const history=path.slice(0,-1)
  const [savedTime, setSavedTime] = useState<string>("على هذا الجهاز")
  const [fontSize, setFontSize] = useState<"sm" | "md" | "lg">("md")

  const currentNode = STORY_NODES[currentNodeId] || STORY_NODES["root"]

  const handleChoose = (targetId:string) => { narration.stop();setPath([...path,targetId]);setSavedTime("حُفظ على الجهاز") }
  const handleUndo = () => { if(path.length>1){narration.stop();setPath(path.slice(0,-1));setSavedTime("تم التراجع")}}
  const handleRestart = () => {narration.stop();setPath(["root"]);setSavedTime("بداية جديدة")}
  const handlePlayVoiceover = () => narration.toggle(currentNode.prose.join(" "),1,locale)
  const fontSizeClasses = { sm: "text-base leading-loose", md: "text-xl leading-loose", lg: "text-2xl leading-loose" }


  return (
    <div className="min-h-screen bg-[#10131c] text-[#e0e2ef] pb-24">
      {narration.message && <p role="status" className="p-4 text-center">{narration.message}</p>}
      {/* Top Breadcrumb & Control Strip (from Stitch p10_base_1440) */}
      <div className="border-b border-[#4e463a]/40 bg-[#0b0e17] py-4">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Breadcrumb Path */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-[#cdc6b8]">
            <Link href={`/${locale}`} className="hover:text-[#e6c184] transition-colors">
              {isRtl ? "المكتبة العامة" : "Library"}
            </Link>
            <span className="material-symbols-outlined text-[14px]">chevron_left</span>
            <span className="text-[#cdc6b8]">{isRtl ? "الروايات التفاعلية" : "Interactive Fiction"}</span>
            <span className="material-symbols-outlined text-[14px]">chevron_left</span>
            <span className="text-[#e6c184] font-bold">{currentNode.chapterTitle}</span>
            <span className="px-2.5 py-0.5 rounded-full bg-[#272a33] text-[#e6c184] text-[10px] font-bold border border-[#e6c184]/30 ms-2">
              سرد تفاعلي • {currentNode.isEnding ? "عقدة النهاية" : "فرع رئيسي"}
            </span>
          </div>

          {/* Action Tools */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {/* Savepoint */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#1c1f29] border border-[#4e463a]/40 text-xs">
              <span className="w-2 h-2 rounded-full bg-[#e6c184] animate-ping" />
              <span className="text-[#cdc6b8]">نقطة استعادة:</span>
              <span className="font-bold text-[#e0e2ef]">{savedTime}</span>
            </div>

            {/* Undo Node */}
            <button
              onClick={handleUndo}
              disabled={history.length === 0}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-colors ${
                history.length > 0
                  ? "bg-[#1c1f29] border-[#4e463a]/40 text-[#e0e2ef] hover:bg-[#272a33] hover:text-[#e6c184]"
                  : "bg-[#181b25] border-[#4e463a]/20 text-[#606370] cursor-not-allowed"
              }`}
            >
              <Undo2 className="w-3.5 h-3.5" />
              <span>{isRtl ? "تراجع عقدة" : "Undo Node"}</span>
              <span className="px-1.5 py-0.2 rounded bg-[#272a33] font-mono text-[10px]">
                {history.length}/4
              </span>
            </button>

            {/* Restart */}
            <button
              onClick={handleRestart}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#93000a]/20 text-[#ffb4ab] border border-[#ffb4ab]/30 hover:bg-[#93000a]/40 text-xs font-bold transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{isRtl ? "إعادة الرواية" : "Restart"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main 2-Column Grid (Main Story 8 Cols & Interactive Tree 4 Cols) */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Story Prose Column (8 Cols) */}
          <article className="lg:col-span-8 space-y-6">
            {/* Visual Framing Banner */}
            <div className="relative rounded-3xl overflow-hidden bg-[#181b25] border border-[#4e463a]/40 shadow-2xl">
              <div className="relative h-64 sm:h-80 w-full overflow-hidden">
                <img
                  src={currentNode.bannerImg}
                  alt={currentNode.chapterTitle}
                  className="w-full h-full object-cover filter brightness-75 contrast-110 hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#10131c] via-[#10131c]/60 to-transparent" />

                {/* Floating Tags */}
                <div className="absolute top-4 right-4 flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-[#93000a]/80 backdrop-blur-md text-[#ffb4ab] text-xs font-bold shadow-md">
                    +١٨ حبكة متفرعة تفاعلية
                  </span>
                  <span className="px-3 py-1 rounded-full bg-[#181b25]/80 backdrop-blur-md text-[#e6c184] text-xs font-bold">
                    {currentNode.era}
                  </span>
                </div>

                {/* Bottom Frame Details */}
                <div className="absolute bottom-4 right-6 left-6 text-start">
                  <div className="flex items-center gap-1.5 text-xs text-[#e6c184] font-bold mb-1">
                    <MapPin className="w-4 h-4" />
                    <span>{currentNode.location}</span>
                  </div>
                  <h1 className="font-serif text-2xl sm:text-4xl font-black text-[#e0e2ef] tracking-tight">
                    {currentNode.chapterTitle}
                  </h1>
                </div>
              </div>

              {/* Narration & Reading Bar */}
              <div className="flex flex-wrap items-center justify-between px-6 py-3 bg-[#1c1f29] border-t border-[#4e463a]/30 text-xs text-[#cdc6b8]">
                <div className="flex items-center gap-3">
                  <button
                    onClick={handlePlayVoiceover}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#272a33] text-[#e6c184] hover:bg-[#32343e] font-bold transition-colors"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>{isRtl ? "قراءة النص بصوت الجهاز" : "Play Voice Narration"}</span>
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[#9a8f81]">حجم الخط:</span>
                  <button
                    onClick={() => setFontSize("sm")}
                    className={`px-2 py-0.5 rounded ${fontSize === "sm" ? "bg-[#e6c184] text-[#422c00] font-bold" : "text-[#cdc6b8]"}`}
                  >
                    صغير
                  </button>
                  <button
                    onClick={() => setFontSize("md")}
                    className={`px-2 py-0.5 rounded ${fontSize === "md" ? "bg-[#e6c184] text-[#422c00] font-bold" : "text-[#cdc6b8]"}`}
                  >
                    متوسط
                  </button>
                  <button
                    onClick={() => setFontSize("lg")}
                    className={`px-2 py-0.5 rounded ${fontSize === "lg" ? "bg-[#e6c184] text-[#422c00] font-bold" : "text-[#cdc6b8]"}`}
                  >
                    كبير
                  </button>
                </div>
              </div>
            </div>

            {/* Editorial Prose Body */}
            <div className="p-6 sm:p-10 rounded-3xl bg-[#181b25] border border-[#4e463a]/40 shadow-xl text-start">
              <div className="max-w-[720px] mx-auto space-y-6">
                {/* First paragraph with drop-cap */}
                <p className={`font-serif text-[#e0e2ef] text-justify ${fontSizeClasses[fontSize]}`}>
                  <span className="float-right text-5xl sm:text-6xl font-black text-[#e6c184] leading-none pl-4 pr-1 pt-1 font-serif">
                    {currentNode.dropCap}
                  </span>
                  {currentNode.prose[0]}
                </p>

                {/* Other paragraphs */}
                {currentNode.prose.slice(1).map((p, idx) => (
                  <p
                    key={idx}
                    className={`font-serif text-[#e0e2ef]/90 text-justify ${fontSizeClasses[fontSize]}`}
                  >
                    {p}
                  </p>
                ))}

                {/* Highlight Quote Box */}
                <div className="my-8 p-5 rounded-2xl bg-[#1c1f29] border-r-4 border-[#e6c184] shadow-md">
                  <blockquote className="font-serif text-base sm:text-lg text-[#e6c184] italic leading-relaxed">
                    {currentNode.quote.text}
                  </blockquote>
                  <span className="block mt-2 text-xs text-[#cdc6b8] font-sans">
                    {currentNode.quote.source}
                  </span>
                </div>
              </div>
            </div>

            {/* Branching Decisions Portal (If not ending) */}
            {!currentNode.isEnding ? (
              <div className="p-6 sm:p-8 rounded-3xl bg-[#181b25] border border-[#e6c184]/40 shadow-2xl text-start space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#e6c184]/10 text-[#e6c184] flex items-center justify-center">
                      <GitBranch className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="font-serif text-xl sm:text-2xl font-black text-[#e0e2ef]">
                        {isRtl ? "اختر مسارك السردي التالي" : "Choose Your Next Branch"}
                      </h2>
                      <p className="text-xs text-[#d1c5b5]">
                        {isRtl
                          ? "قرارك سيشكل مصير سلمى ويكشف فصلاً لا يمكن التراجع عنه إلا بنقاط الاستعادة."
                          : "Your choice determines the outcome and unlocks unique manuscript archives."}
                      </p>
                    </div>
                  </div>
                  <span className="hidden sm:inline-flex px-3 py-1 rounded-full bg-[#272a33] text-xs font-bold text-[#e6c184]">
                    تفرع ثنائي حاسم
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentNode.options.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => handleChoose(opt.targetNodeId)}
                      className="group p-6 rounded-2xl bg-[#1c1f29] border border-[#4e463a]/40 hover:border-[#e6c184] hover:bg-[#272a33] transition-all flex flex-col justify-between text-start shadow-md hover:-translate-y-1"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="w-8 h-8 rounded-full bg-[#e6c184] text-[#422c00] font-black flex items-center justify-center text-sm">
                            {opt.label}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-[#e6c184]/20 text-[#e6c184] font-bold">
                            {opt.badge}
                          </span>
                        </div>
                        <h3 className="font-serif text-base sm:text-lg font-black text-[#e0e2ef] group-hover:text-[#e6c184] transition-colors mb-2">
                          {opt.title}
                        </h3>
                        <p className="text-xs text-[#d1c5b5] leading-relaxed">
                          {opt.description}
                        </p>
                      </div>

                      <div className="mt-6 pt-3 border-t border-[#4e463a]/30 flex items-center justify-between text-xs font-bold text-[#e6c184]">
                        <span>{isRtl ? "المضي في هذا الخيار" : "Select Path"}</span>
                        <span className="material-symbols-outlined text-[18px] group-hover:-translate-x-1 transition-transform">
                          {isRtl ? "arrow_back" : "arrow_forward"}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              /* Ending Card */
              <div className="p-8 rounded-3xl bg-gradient-to-br from-[#181b25] via-[#272a33] to-[#181b25] border-2 border-[#e6c184] shadow-2xl text-center space-y-6">
                <div className="w-16 h-16 rounded-full bg-[#e6c184]/20 text-[#e6c184] flex items-center justify-center mx-auto text-3xl">
                  🏆
                </div>
                <div>
                  <span className="text-xs font-bold text-[#e6c184] uppercase tracking-widest block mb-2">
                    {currentNode.endingType}
                  </span>
                  <h2 className="font-serif text-2xl sm:text-3xl font-black text-[#e0e2ef]">
                    اكتمل هذا الفرع السردي بنجاح
                  </h2>
                  <p className="text-xs sm:text-sm text-[#d1c5b5] max-w-md mx-auto mt-2">
                    لقد صنعت خاتمة فريدة بناءً على خياراتك الواعية. يمكنك التراجع لتجربة نهايات ومسارات مجهولة أخرى.
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
                  <button
                    onClick={handleRestart}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#e6c184] text-[#422c00] font-black text-xs hover:bg-[#ffdeaa] transition-colors shadow-lg"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>{isRtl ? "إعادة التجربة من البداية" : "Restart from Beginning"}</span>
                  </button>
                  <Link
                    href={`/${locale}/salons`}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1c1f29] text-[#e0e2ef] hover:bg-[#272a33] border border-[#4e463a]/40 text-xs font-bold transition-colors"
                  >
                    <BookOpen className="w-4 h-4 text-[#e6c184]" />
                    <span>{isRtl ? "ناقش نهايتك في الصالون الأدبي" : "Discuss in Salon"}</span>
                  </Link>
                </div>
              </div>
            )}
          </article>

          {/* Interactive Node Tree Sidebar (4 Cols) */}
          <aside className="lg:col-span-4 space-y-6 text-start">
            <div className="p-6 rounded-3xl bg-[#181b25] border border-[#4e463a]/40 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#4e463a]/30">
                <div className="flex items-center gap-2">
                  <GitBranch className="w-4 h-4 text-[#e6c184]" />
                  <h3 className="font-serif text-sm font-bold text-[#e0e2ef]">
                    {isRtl ? "خريطة المسارات التفاعلية" : "Branching Tree Map"}
                  </h3>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#272a33] text-[#e6c184] font-mono">
                  {history.length + 1} عقد
                </span>
              </div>

              {/* Tree Steps */}
              <div className="space-y-3">
                {/* Node 1: Root */}
                <div
                  className={`p-3 rounded-xl border transition-all ${
                    currentNodeId === "root"
                      ? "bg-[#272a33] border-[#e6c184] text-[#e0e2ef]"
                      : history.includes("root")
                      ? "bg-[#1c1f29] border-emerald-500/40 text-emerald-400"
                      : "bg-[#181b25] border-[#4e463a]/30 text-[#9a8f81]"
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span>١. علامة على الخريطة</span>
                    {history.includes("root") && <span className="text-emerald-400 text-xs">✓ مجتاز</span>}
                  </div>
                </div>

                {/* Sub-branches */}
                <div className="pr-4 space-y-2 border-r-2 border-[#4e463a]/30">
                  <div
                    className={`p-3 rounded-xl border text-xs transition-all ${
                      currentNodeId === "node_harbor"
                        ? "bg-[#272a33] border-[#e6c184] text-[#e0e2ef] font-bold"
                        : history.includes("node_harbor")
                        ? "bg-[#1c1f29] border-emerald-500/40 text-emerald-400"
                        : "bg-[#181b25] border-[#4e463a]/20 text-[#606370]"
                    }`}
                  >
                    <span>أ. مستودع الشمع الأسود</span>
                  </div>

                  <div
                    className={`p-3 rounded-xl border text-xs transition-all ${
                      currentNodeId === "node_archive"
                        ? "bg-[#272a33] border-[#e6c184] text-[#e0e2ef] font-bold"
                        : history.includes("node_archive")
                        ? "bg-[#1c1f29] border-emerald-500/40 text-emerald-400"
                        : "bg-[#181b25] border-[#4e463a]/20 text-[#606370]"
                    }`}
                  >
                    <span>ب. سرداب الوثائق المحترقة</span>
                  </div>
                </div>

                {/* Endings indicators */}
                <div className="pt-2">
                  <span className="text-[11px] text-[#9a8f81] block mb-2">النهايات المتاحة (٤ نهايات):</span>
                  <div className="grid grid-cols-2 gap-2 text-[10px]">
                    <span className="p-2 rounded-lg bg-[#1c1f29] border border-[#4e463a]/30 text-[#cdc6b8]">
                      📸 نهاية الدليل
                    </span>
                    <span className="p-2 rounded-lg bg-[#1c1f29] border border-[#4e463a]/30 text-[#cdc6b8]">
                      ⛵ رحلة المجهول
                    </span>
                    <span className="p-2 rounded-lg bg-[#1c1f29] border border-[#4e463a]/30 text-[#cdc6b8]">
                      🗝️ أمينة السر
                    </span>
                    <span className="p-2 rounded-lg bg-[#1c1f29] border border-[#4e463a]/30 text-[#cdc6b8]">
                      🤝 لم الشمل
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* DRM Anti-Scraping Protection Badge */}
            <div className="p-5 rounded-2xl bg-[#1c1f29] border border-[#4e463a]/30 text-xs text-[#cdc6b8] space-y-2">
              <div className="flex items-center gap-2 text-[#e6c184] font-bold">
                <span className="material-symbols-outlined text-[18px]">verified_user</span>
                <span>مسارات محفوظة على هذا الجهاز</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                يُحفظ مسارك محليًا في المتصفح لهذا الحساب أو الزائر، ويمكنك الرجوع إلى خطوة سابقة أو البدء من جديد.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
