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
    <footer className="border-t border-amber-500/20 bg-background/95 mt-auto">
      {/* Trust Badges Bar with Google Stitch Gold Accents */}
      <div className="border-b border-amber-500/15 bg-amber-500/5">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-start">
            <div className="flex flex-col md:flex-row items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-amber-500/15 text-amber-600 flex items-center justify-center shrink-0 border border-amber-500/25 shadow-xs">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-foreground">
                  {isRtl ? "شحن ورقي خليجي سريع" : "Express Regional Delivery"}
                </h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {isRtl ? "توصيل آمن لباب البيت خلال 24-48 ساعة" : "24-48 hours directly to your door"}
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-amber-500/15 text-amber-600 flex items-center justify-center shrink-0 border border-amber-500/25 shadow-xs">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-foreground">
                  {isRtl ? "حماية بث صوتي وتشفير DRM" : "Anti-Piracy DRM Stream"}
                </h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {isRtl ? "استماع نقي بدون انقطاع وبأعلى دقة" : "High-fidelity lossless streaming"}
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-amber-500/15 text-amber-600 flex items-center justify-center shrink-0 border border-amber-500/25 shadow-xs">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-foreground">
                  {isRtl ? "ضمان الاستبدال للنسخ الورقية" : "Replacement Guarantee"}
                </h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {isRtl ? "استبدال فوري لأي نسخة متضررة مجاناً" : "Instant free swap for damaged copies"}
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-amber-500/15 text-amber-600 flex items-center justify-center shrink-0 border border-amber-500/25 shadow-xs">
                <Headphones className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-foreground">
                  {isRtl ? "صالون دعم القراء 24/7" : "24/7 Reader Concierge"}
                </h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {isRtl ? "خدمة مخصصة بالعربية والإنجليزية" : "Instant care in Arabic & English"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="container mx-auto px-4 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 text-slate-950 flex items-center justify-center font-black shadow-md shadow-amber-500/20">
                <Feather className="w-5 h-5" />
              </div>
              <div>
                <span className="font-black text-base text-foreground block">
                  {isRtl ? "دار الروايات العالمية" : "Sovereign Stories"}
                </span>
                <span className="text-[10px] text-amber-600 font-bold tracking-wider uppercase block">
                  Publishing & Audio Lab
                </span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {isRtl
                ? "المنصة السيادية المتكاملة لنشر الروايات الفاخرة المطبوعة، الروايات الصوتية الدرامية، والكتب الإلكترونية المشفرة لجميع الفئات العمرية."
                : "The premier all-in-one platform for deluxe printed novels, cinematic audiobooks, and encrypted e-books for all age groups."}
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-600 font-semibold pt-1">
              <Lock className="w-3.5 h-3.5" />
              <span>{isRtl ? "نظام سيادي محمي ومشفر 100%" : "Zero-Trust Hardened Architecture"}</span>
            </div>
          </div>

          {/* Catalog Columns */}
          <div>
            <h4 className="font-bold text-sm text-foreground mb-4 flex items-center gap-1.5">
              <Crown className="w-4 h-4 text-amber-500" />
              <span>{isRtl ? "أقسام الروايات" : "Literary Shelves"}</span>
            </h4>
            <ul className="space-y-2.5 text-xs text-muted-foreground font-medium">
              <li>
                <Link href={`/${locale}/books?age=kids_3_6`} className="hover:text-amber-500 transition-colors">
                  {isRtl ? "👶 واحة براعم الأطفال (3 - 6 سنوات)" : "Early Childhood (3-6 yrs)"}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/books?age=kids_7_12`} className="hover:text-amber-500 transition-colors">
                  {isRtl ? "🧒 كوكب الاستكشاف والناشئة (7 - 12 سنة)" : "Young Explorers (7-12 yrs)"}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/books?age=teens_13_17`} className="hover:text-amber-500 transition-colors">
                  {isRtl ? "🧑 صالون الغموض لليافعين (13 - 17 سنة)" : "Teens Mystery (13-17 yrs)"}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/books?age=adults_18_plus`} className="hover:text-amber-500 transition-colors">
                  {isRtl ? "🧑‍💼 ديوان الأدب والتاريخ (18+ سنة)" : "Classical Literature (18+)"}
                </Link>
              </li>
            </ul>
          </div>

          {/* Reader Club */}
          <div>
            <h4 className="font-bold text-sm text-foreground mb-4 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>{isRtl ? "نادي القراء وخدماتنا" : "VIP & Services"}</span>
            </h4>
            <ul className="space-y-2.5 text-xs text-muted-foreground font-medium">
              <li>
                <Link href={`/${locale}/subscriptions`} className="hover:text-amber-500 transition-colors">
                  {isRtl ? "باقات اشتراك VIP الشهرية والسنوية" : "VIP Membership Passes"}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/library`} className="hover:text-amber-500 transition-colors">
                  {isRtl ? "مشغل الروايات الصوتية والمكتبة" : "Audio Player & Library"}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/account`} className="hover:text-amber-500 transition-colors">
                  {isRtl ? "لوحة إدارة حساب القارئ" : "Customer Portal"}
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
