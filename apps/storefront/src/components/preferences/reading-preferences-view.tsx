"use client"

import React, { useState, useEffect } from "react"
import { useReadingState } from "@/context/reading-state-context"
import Link from "@/components/common/realm-link"
import {
  Sliders,
  Type,
  Moon,
  Sun,
  ShieldCheck,
  BellOff,
  Eye,
  Check,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Lock,
} from "lucide-react"

type ReadingPreferencesViewProps = {
  locale: "ar" | "en"
}

export function ReadingPreferencesView({ locale }: ReadingPreferencesViewProps) {
  const isRtl = locale === "ar"
  const { state, ready, updateSettings } = useReadingState()

  const [themeMode, setThemeMode] = useState<"dark-ink" | "parchment" | "contrast">("dark-ink")
  const [fontFamily, setFontFamily] = useState<"serif" | "sans" | "ruqah">("serif")
  const [fontSize, setFontSize] = useState<"sm" | "md" | "lg">("md")
  const [noDMsEnabled, setNoDMsEnabled] = useState<boolean>(true)
  const [savedNotification, setSavedNotification] = useState<boolean>(false)
  useEffect(() => {
    if (!ready) return
    const settings = state.originals
    setThemeMode(settings.theme === "night" ? "dark-ink" : settings.theme === "contrast" ? "contrast" : "parchment")
    setFontFamily(settings.fontFamily === "sans" ? "sans" : settings.fontFamily === "ruqah" ? "ruqah" : "serif")
    setFontSize(settings.fontSize <= 18 ? "sm" : settings.fontSize >= 26 ? "lg" : "md")
    setNoDMsEnabled(settings.quiet)
  }, [ready])

  const handleSave = () => {
    updateSettings("originals", { theme: themeMode === "dark-ink" ? "night" : themeMode === "contrast" ? "contrast" : "paper", fontFamily, fontSize: fontSize === "sm" ? 18 : fontSize === "lg" ? 28 : 22, quiet: noDMsEnabled })
    setSavedNotification(true)
    setTimeout(() => setSavedNotification(false), 3000)
  }

  return (
    <div className="min-h-screen bg-[#10131c] text-[#e0e2ef] pb-24">
      {/* Top Banner (Stitch P16) */}
      <section className="relative overflow-hidden bg-[#0b0e17] border-b border-[#4e463a]/40 pt-12 pb-16">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#e6c184]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-[#9a8f81] mb-6">
            <Link href={`/${locale}`} className="hover:text-[#e6c184] transition-colors">
              {isRtl ? "الرئيسية" : "Home"}
            </Link>
            <span className="material-symbols-outlined text-[14px]">chevron_left</span>
            <Link href={`/${locale}/account`} className="hover:text-[#e6c184] transition-colors">
              {isRtl ? "الملف الشخصي" : "Profile"}
            </Link>
            <span className="material-symbols-outlined text-[14px]">chevron_left</span>
            <span className="text-[#e6c184] font-bold">
              {isRtl ? "تفضيلات القراءة والأمان (P16)" : "Reading Preferences"}
            </span>
          </nav>

          <div className="max-w-3xl text-start">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-[#e6c184] ring-4 ring-[#e6c184]/20" />
              <span className="text-xs font-bold text-[#e6c184] uppercase tracking-widest">
                تخصيص بيئة المطالعة والأمان
              </span>
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl font-black text-[#e0e2ef] tracking-tight">
              {isRtl ? "تفضيلات القراءة وضوابط الهدوء" : "Reading Preferences & Sanctuary Controls"}
            </h1>
            <p className="font-serif text-sm sm:text-base text-[#d1c5b5] mt-3 leading-relaxed">
              {isRtl
                ? "تخصيص تجربة المطالعة والاستماع وضبط التنبيهات بكل حرية ودون إعدادات افتراضية موجهة. كافة التنبيهات الإضافية مغلقة افتراضياً احتراماً لتركيزك وهدوء مجلسك الأدبي."
                : "Full customization of your reading and listening environment with zero advertising noise."}
            </p>
          </div>
        </div>
      </section>

      {/* Main Settings Folio */}
      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 py-12 space-y-8 text-start">
        {/* Section 1: Reading Display Themes */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#1c1f29] border border-[#4e463a]/40 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#4e463a]/30">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[#e6c184] text-[24px]">palette</span>
              <div>
                <h3 className="font-serif text-lg font-black text-[#e0e2ef]">سمة صفحة القراءة</h3>
                <span className="text-xs text-[#9a8f81]">اختر النبرة البصرية الملائمة لعينيك</span>
              </div>
            </div>
            <span className="text-[11px] px-2.5 py-0.5 rounded bg-[#272a33] text-[#e6c184] font-bold">
              مخصص للأدب الراشد
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Theme 1: Dark Ink */}
            <button
              onClick={() => setThemeMode("dark-ink")}
              className={`p-4 rounded-2xl border text-start transition-all relative overflow-hidden ${
                themeMode === "dark-ink"
                  ? "bg-[#272a33] border-[#e6c184] shadow-md ring-2 ring-[#e6c184]/30"
                  : "bg-[#181b25] border-[#4e463a]/30 hover:bg-[#272a33]"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-sm text-[#e6c184]">حبري داكن (Nocturne)</span>
                {themeMode === "dark-ink" && <span className="text-[#e6c184]">✓</span>}
              </div>
              <p className="text-[11px] text-[#cdc6b8] leading-relaxed mb-3">
                أرضية حبرية داكنة تحاكي طبعات المخطوطات الليلية وتمنع إجهاد العين.
              </p>
              <div className="h-6 w-full rounded-lg bg-[#10131c] border border-[#4e463a]/40" />
            </button>

            {/* Theme 2: Parchment Paper */}
            <button
              onClick={() => setThemeMode("parchment")}
              className={`p-4 rounded-2xl border text-start transition-all relative overflow-hidden ${
                themeMode === "parchment"
                  ? "bg-[#272a33] border-[#e6c184] shadow-md ring-2 ring-[#e6c184]/30"
                  : "bg-[#181b25] border-[#4e463a]/30 hover:bg-[#272a33]"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-sm text-[#e6c184]">ورق عتيق (Parchment)</span>
                {themeMode === "parchment" && <span className="text-[#e6c184]">✓</span>}
              </div>
              <p className="text-[11px] text-[#cdc6b8] leading-relaxed mb-3">
                أرضية ورق قطني بدرجات البيج الدافئ مستوحاة من مخطوطات قصر الحمراء.
              </p>
              <div className="h-6 w-full rounded-lg bg-[#EDE3D0] border border-[#4e463a]/40" />
            </button>

            {/* Theme 3: Pure Contrast */}
            <button
              onClick={() => setThemeMode("contrast")}
              className={`p-4 rounded-2xl border text-start transition-all relative overflow-hidden ${
                themeMode === "contrast"
                  ? "bg-[#272a33] border-[#e6c184] shadow-md ring-2 ring-[#e6c184]/30"
                  : "bg-[#181b25] border-[#4e463a]/30 hover:bg-[#272a33]"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-sm text-[#e6c184]">تباين ناصع (Pure Ink)</span>
                {themeMode === "contrast" && <span className="text-[#e6c184]">✓</span>}
              </div>
              <p className="text-[11px] text-[#cdc6b8] leading-relaxed mb-3">
                سواد كلي مع خطوط مذهبة ناصعة وضوح فائق تحت ضوء الشمس المباشر.
              </p>
              <div className="h-6 w-full rounded-lg bg-black border border-[#e6c184]/60" />
            </button>
          </div>
        </div>

        {/* Section 2: Typography Scale & Family */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#1c1f29] border border-[#4e463a]/40 shadow-xl space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-[#4e463a]/30">
            <Type className="w-5 h-5 text-[#e6c184]" />
            <div>
              <h3 className="font-serif text-lg font-black text-[#e0e2ef]">الخط العربي المطبعي</h3>
              <span className="text-xs text-[#9a8f81]">اختر نوع الخط المريح لمطالعتك</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={() => setFontFamily("serif")}
              className={`p-4 rounded-2xl border text-start transition-all ${
                fontFamily === "serif"
                  ? "bg-[#272a33] border-[#e6c184] text-[#e6c184]"
                  : "bg-[#181b25] border-[#4e463a]/30 text-[#cdc6b8]"
              }`}
            >
              <span className="font-serif font-black text-base block mb-1">Noto Naskh Arabic</span>
              <span className="text-[11px] text-[#9a8f81]">للأدب الرفيع والروايات التراثية</span>
            </button>

            <button
              onClick={() => setFontFamily("sans")}
              className={`p-4 rounded-2xl border text-start transition-all ${
                fontFamily === "sans"
                  ? "bg-[#272a33] border-[#e6c184] text-[#e6c184]"
                  : "bg-[#181b25] border-[#4e463a]/30 text-[#cdc6b8]"
              }`}
            >
              <span className="font-sans font-bold text-base block mb-1">IBM Plex Sans Arabic</span>
              <span className="text-[11px] text-[#9a8f81]">لقراءة عصرية واضحة وسريعة</span>
            </button>

            <button
              onClick={() => setFontFamily("ruqah")}
              className={`p-4 rounded-2xl border text-start transition-all ${
                fontFamily === "ruqah"
                  ? "bg-[#272a33] border-[#e6c184] text-[#e6c184]"
                  : "bg-[#181b25] border-[#4e463a]/30 text-[#cdc6b8]"
              }`}
            >
              <span className="font-serif font-bold text-base block mb-1">خط عارف رقعة</span>
              <span className="text-[11px] text-[#9a8f81]">للنصوص الشعرية والومضات</span>
            </button>
          </div>
        </div>

        {/* Section 3: Zero-Noise Policy & Privacy Controls */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#181b25] border border-emerald-500/30 shadow-xl space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-[#4e463a]/30">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="font-serif text-lg font-black text-[#e0e2ef]">
                ميثاق الهدوء القرائي والخصوصية السيادية
              </h3>
              <span className="text-xs text-[#9a8f81]">بيئة قرائية نقية وخالية من الإزعاج</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-[#1c1f29] border border-[#4e463a]/30">
              <div>
                <span className="font-bold text-sm text-[#e0e2ef] block">
                  حظر تام للرسائل الترويجية المباشرة (No Marketing DMs)
                </span>
                <span className="text-xs text-[#9a8f81]">
                  لن تتلقى أي رسائل ترويجية أو إشعارات غير متعلقة باشتراكك وكتبك
                </span>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs">
                مفعل إجبارياً
              </span>
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-[#1c1f29] border border-[#4e463a]/30">
              <div>
                <span className="font-bold text-sm text-[#e0e2ef] block">
                  حفظ تفضيلات المطالعة على هذا الجهاز
                </span>
                <span className="text-xs text-[#9a8f81]">
                  سرعة قراءتك والصفحات التي تتوقف عندها لا تُشارك مع أي طرف خارجي
                </span>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs">
                حفظ محلي
              </span>
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <section className="p-6 rounded-3xl bg-[#1c1f29] border border-[#4e463a]/40 space-y-5"><h2 className="font-bold text-lg">{isRtl ? "حجم النص والمعاينة" : "Text size and preview"}</h2><div className="flex gap-3">{(["sm", "md", "lg"] as const).map((size) => <button key={size} className="original-button" aria-pressed={fontSize === size} onClick={() => setFontSize(size)}>{size === "sm" ? "صغير" : size === "md" ? "متوسط" : "كبير"}</button>)}</div><p style={{ fontSize: fontSize === "sm" ? 18 : fontSize === "lg" ? 28 : 22,fontFamily:fontFamily==="ruqah"?"var(--font-ruqaa)":fontFamily==="sans"?"var(--font-arabic)":"var(--font-serif)" }} className="leading-loose">وقفت سلمى عند نافذة الأرشيف، تتأمل الخريطة التي عادت بعد غياب طويل.</p><label className="flex items-center gap-3"><input type="checkbox" checked={noDMsEnabled} onChange={(event) => setNoDMsEnabled(event.target.checked)} />{isRtl ? "تفعيل وقت الهدوء" : "Enable quiet time"}</label></section>
        <div className="flex items-center justify-between pt-4">
          <Link href={`/${locale}`} className="text-xs font-bold text-[#9a8f81] hover:text-[#e0e2ef]">
            العودة للمكتبة
          </Link>

          <div className="flex items-center gap-3">
            {savedNotification && (
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                <Check className="w-4 h-4" />
                <span>تم حفظ تفضيلاتك بنجاح</span>
              </span>
            )}
            <button
              onClick={handleSave}
              className="px-6 py-3 rounded-xl bg-[#e6c184] text-[#422c00] font-black text-xs hover:bg-[#ffdeaa] transition-colors shadow-lg"
            >
              حفظ التفضيلات
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
