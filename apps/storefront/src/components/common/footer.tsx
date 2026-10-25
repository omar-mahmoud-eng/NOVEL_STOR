import React from "react"
import Link from "next/link"
import { ShieldCheck, Truck, RotateCcw, Headphones, Lock, Feather, Crown, Sparkles } from "lucide-react"

export function Footer({
  locale,
  dict,
}: {
  locale: "ar" | "en"
  dict: any
}) {
  const isRtl = locale === "ar"

  return (
    <footer className="border-t border-[#4e463a]/30 bg-[#0b0e17] text-[#e0e2ef] mt-auto">
      {/* Trust Badges Bar with Google Stitch Nocturne Accents */}
      <div className="border-b border-[#4e463a]/25 bg-[#10131c]">
        <div className="max-w-[1280px] w-full mx-auto px-4 sm:px-6 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-start">
            <div className="flex flex-col md:flex-row items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-[#1c1f29] text-[#e6c184] flex items-center justify-center shrink-0 border border-[#4e463a]/40 shadow-xs">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#e0e2ef]">
                  {isRtl ? "شحن ورقي خليجي سريع" : "Express Regional Delivery"}
                </h4>
                <p className="text-xs text-[#d1c5b5] mt-0.5">
                  {isRtl ? "توصيل آمن لباب البيت خلال 24-48 ساعة" : "24-48 hours directly to your door"}
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-[#1c1f29] text-[#e6c184] flex items-center justify-center shrink-0 border border-[#4e463a]/40 shadow-xs">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#e0e2ef]">
                  {isRtl ? "حماية بث صوتي وتشفير DRM" : "Anti-Piracy DRM Stream"}
                </h4>
                <p className="text-xs text-[#d1c5b5] mt-0.5">
                  {isRtl ? "استماع نقي بدون انقطاع وبأعلى دقة" : "High-fidelity lossless streaming"}
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-[#1c1f29] text-[#e6c184] flex items-center justify-center shrink-0 border border-[#4e463a]/40 shadow-xs">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#e0e2ef]">
                  {isRtl ? "ضمان الاستبدال للنسخ الورقية" : "Replacement Guarantee"}
                </h4>
                <p className="text-xs text-[#d1c5b5] mt-0.5">
                  {isRtl ? "استبدال فوري لأي نسخة متضررة مجاناً" : "Instant free swap for damaged copies"}
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-[#1c1f29] text-[#e6c184] flex items-center justify-center shrink-0 border border-[#4e463a]/40 shadow-xs">
                <Headphones className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#e0e2ef]">
                  {isRtl ? "صالون دعم القراء 24/7" : "24/7 Reader Concierge"}
                </h4>
                <p className="text-xs text-[#d1c5b5] mt-0.5">
                  {isRtl ? "خدمة مخصصة بالعربية والإنجليزية" : "Instant care in Arabic & English"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-[1280px] w-full mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[#e6c184] text-[28px]">auto_stories</span>
              <div>
                <span className="font-serif font-black text-lg text-[#e6c184] block">
                  StoryVerse Originals
                </span>
                <span className="text-[10px] text-[#d1c5b5] font-bold tracking-wider uppercase block">
                  Sovereign Publishing & Audio Lab
                </span>
              </div>
            </div>
            <p className="text-xs text-[#d1c5b5] leading-relaxed">
              {isRtl
                ? "المنصة السيادية المتكاملة لنشر الروايات الفاخرة المطبوعة، الروايات الصوتية الدرامية، والكتب الإلكترونية المشفرة لجميع الفئات العمرية وفق تصميم Google Stitch."
                : "The premier all-in-one platform for deluxe printed novels, cinematic audiobooks, and encrypted e-books for all age groups."}
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold pt-1">
              <Lock className="w-3.5 h-3.5" />
              <span>{isRtl ? "نظام سيادي محمي ومشفر 100%" : "Zero-Trust Hardened Architecture"}</span>
            </div>
          </div>

          {/* Catalog Columns */}
          <div>
            <h4 className="font-bold text-sm text-[#e0e2ef] mb-4 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#e6c184] text-[18px]">travel_explore</span>
              <span>{isRtl ? "أروقة StoryVerse" : "StoryVerse Realms"}</span>
            </h4>
            <ul className="space-y-2.5 text-xs text-[#d1c5b5] font-medium">
              <li>
                <Link href={`/${locale}/realms/little`} className="hover:text-[#e6c184] transition-colors">
                  {isRtl ? "🧸 واحة براعم الأطفال (3 - 6 سنوات)" : "Little Realm (3-6 yrs)"}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/realms/kids`} className="hover:text-[#e6c184] transition-colors">
                  {isRtl ? "🧭 كوكب الاستكشاف والناشئة (7 - 12 سنة)" : "Kids Explorers (7-12 yrs)"}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/realms/teens`} className="hover:text-[#e6c184] transition-colors">
                  {isRtl ? "⚡ صالون مدار الغموض لليافعين (13 - 17 سنة)" : "Teens Mystery (13-17 yrs)"}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/books?age=adults_18_plus`} className="hover:text-[#e6c184] transition-colors">
                  {isRtl ? "🏛️ صالون الأدب والسينما (18+ سنة)" : "Originals Literature (18+)"}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/family-hub`} className="hover:text-[#e6c184] transition-colors">
                  {isRtl ? "👨‍👩‍👧‍👦 مركز الأسرة والرقابة الأبوية" : "Family Hub & Controls"}
                </Link>
              </li>
            </ul>
          </div>

          {/* Reader Club */}
          <div>
            <h4 className="font-bold text-sm text-[#e0e2ef] mb-4 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#e6c184] text-[18px]">auto_stories</span>
              <span>{isRtl ? "المكتبات والتصنيفات" : "Libraries & Genres"}</span>
            </h4>
            <ul className="space-y-2.5 text-xs text-[#d1c5b5] font-medium">
              <li>
                <Link href={`/${locale}/genres`} className="hover:text-[#e6c184] transition-colors">
                  {isRtl ? "أنواع الحكايات وروافد السرد" : "Story Genres & Themes"}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/audiobooks`} className="hover:text-[#e6c184] transition-colors">
                  {isRtl ? "المكتبة الصوتية والإنتاجات الدرامية" : "Audiobook Studio Library"}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/salons`} className="hover:text-[#e6c184] transition-colors">
                  {isRtl ? "الأندية الأدبية وصالونات الحوار الراشد" : "Literary Salons & Clubs"}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/interactive`} className="hover:text-[#e6c184] transition-colors">
                  {isRtl ? "الروايات التفاعلية متعددة المسارات" : "Interactive Branching Fiction"}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/subscriptions`} className="hover:text-[#e6c184] transition-colors">
                  {isRtl ? "باقات اشتراك VIP الشهرية والسنوية" : "VIP Membership Passes"}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/library`} className="hover:text-[#e6c184] transition-colors">
                  {isRtl ? "مكتبتي الرقمية وقارئ المخطوطات" : "My Shelf & Cloud Reader"}
                </Link>
              </li>
            </ul>
          </div>

          {/* Design Badge */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-foreground mb-4">
              {isRtl ? "معايير التصميم الفائق" : "Design Standard"}
            </h4>
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400">
                <Sparkles className="w-4 h-4 fill-current" />
                <span>Google Stitch Vibe Design</span>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                {isRtl
                  ? "تمت صياغة واجهات المتجر وفق فلسفة Google Stitch للتصميم الحركي الراقي والأدب التفاعلي."
                  : "Engineered in accordance with Google Stitch UI/UX design tokens and high-fidelity typography."}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="border-t border-amber-500/15 pt-8 mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} {isRtl ? "دار الروايات العالمية. جميع الحقوق الملكية والفكرية محفوظة." : "Sovereign Stories Inc. All rights reserved."}</p>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <span className="text-amber-600">All-In-One Enterprise Platform</span>
            <span>•</span>
            <span>Zero 3rd-Party Dependencies</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
