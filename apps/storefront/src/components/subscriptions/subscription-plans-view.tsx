"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { formatCurrency } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Sparkles,
  Check,
  ShieldCheck,
  Zap,
  BookOpen,
  Headphones,
  Award,
  HelpCircle,
  Loader2,
} from "lucide-react"

type SubscriptionPlansViewProps = {
  locale: "ar" | "en"
}

export function SubscriptionPlansView({ locale }: SubscriptionPlansViewProps) {
  const router = useRouter()
  const [subscribingTier, setSubscribingTier] = useState<string | null>(null)

  const isRtl = locale === "ar"

  const tiers = [
    {
      id: "tier_kids",
      nameAr: "باقة براعم الأطفال (Kids Story Pass)",
      nameEn: "Kids Story Pass",
      tagAr: "للأطفال من 3 إلى 12 سنة",
      tagEn: "Ages 3 to 12",
      price: 2900, // 29.00 SAR / month
      periodAr: "شهرياً",
      periodEn: "per month",
      popular: false,
      featuresAr: [
        "وصول غير محدود لجميع قصص الأطفال المصورة",
        "تشغيل صوتي مهدئ لحكايات ما قبل النوم",
        "تفعيل تلقائي لوضع الأطفال الآمن (Safe Kids Mode)",
        "بدون أي إعلانات أو محتوى غير ملائم",
        "إمكانية الاستماع دون اتصال عبر مشغل الويب",
      ],
      featuresEn: [
        "Unlimited access to illustrated kids stories",
        "Bedtime audio player with soft narrations",
        "Automated Safe Kids Mode protection",
        "Zero ads or inappropriate content",
        "Offline playback support via web player",
      ],
      ctaAr: "ابدأ اشتراك الأطفال",
      ctaEn: "Start Kids Pass",
    },
    {
      id: "tier_monthly_vip",
      nameAr: "باقة القارئ والمستمع VIP (شهري)",
      nameEn: "Monthly VIP Reader & Listener",
      tagAr: "الأكثر شعبية للقراء",
      tagEn: "Most Popular",
      price: 4900, // 49.00 SAR / month
      periodAr: "شهرياً",
      periodEn: "per month",
      popular: true,
      featuresAr: [
        "2 رصيد شهري لاقتناء أي رواية أو كتاب صوتي والاحتفاظ به",
        "بث صوتي عالي النقاء بدون حدود لكافة الفصول",
        "خصم 30% إضافي على شراء نسخ الكتب الورقية المطبوعة",
        "وصول حصري لفصول الروايات الجديدة قبل النشر العام بأسبوع",
        "إلغاء الاشتراك أو إيقافه مؤقتاً في أي وقت بنقرة واحدة",
      ],
      featuresEn: [
        "2 monthly credits to keep any book or audiobook forever",
        "High-fidelity DRM audio streaming for all chapters",
        "30% discount on physical printed paperback orders",
        "Exclusive early access to newly released chapters",
        "Pause or cancel anytime with one click",
      ],
      ctaAr: "اشترك الآن بـ 49 ر.س/شهر",
      ctaEn: "Subscribe for 49 SAR/mo",
    },
    {
      id: "tier_annual_vip",
      nameAr: "الاشتراك السنوي الشامل All-Access",
      nameEn: "Annual All-Access VIP Pass",
      tagAr: "أفضل قيمة (توفير شهرين)",
      tagEn: "Best Value (Save 2 Months)",
      price: 49000, // 490.00 SAR / year
      periodAr: "سنوياً",
      periodEn: "per year",
      popular: false,
      featuresAr: [
        "24 رصيد كتاب سنوي فوري في حسابك",
        "شحن مجاني لكافة طلبات الكتب الورقية طوال العام",
        "نسخة ورقية موقعة ومخصصة باسمك من أحد المؤلفين سنوياً",
        "دعوات خاصة لنوادي القراءة الافتراضية مع الروائيين",
        "دعم فني خاص على مدار الساعة لقراء VIP",
      ],
      featuresEn: [
        "24 instant book credits in your digital library",
        "Free standard shipping on all physical book purchases",
        "One author-signed physical edition delivered yearly",
        "Exclusive virtual book club access with celebrated authors",
        "24/7 dedicated VIP reader concierge",
      ],
      ctaAr: "اشترك سنوياً ووفّر 17%",
      ctaEn: "Subscribe Annually & Save 17%",
    },
  ]

  const handleSubscribe = (tierId: string) => {
    setSubscribingTier(tierId)
    setTimeout(() => {
      router.push(`/${locale}/checkout?tier=${tierId}`)
    }, 600)
  }

  return (
    <div className="container mx-auto px-4 py-14 max-w-7xl">
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold mb-4">
          <Sparkles className="w-4 h-4" />
          <span>
            {locale === "ar"
              ? "عضوية VIP للنخبة من عشاق القراءة والاستماع"
              : "VIP Membership for Elite Readers & Listeners"}
          </span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-foreground tracking-tight leading-tight">
          {locale === "ar" ? (
            <>
              عالم لا نهائي من <span className="text-primary">الروايات والقصص</span> في جيبك
            </>
          ) : (
            <>
              Unlimited Stories & <span className="text-primary">Audiobooks</span> in One Pass
            </>
          )}
        </h1>
        <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
          {locale === "ar"
            ? "اختر الباقة المناسبة لك أو لعائلتك، واستمتع بأرصدة شهرية، وتخفيضات حصرية على الكتب الورقية، وتجربة استماع سينمائية مؤمنة بتقنية DRM."
            : "Choose the perfect subscription plan for you or your family. Get monthly book credits, discounts on physical books, and secure DRM streaming."}
        </p>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch mb-20">
        {tiers.map((tier) => {
          const isCurrentLoading = subscribingTier === tier.id
          return (
            <div
              key={tier.id}
              className={`rounded-3xl p-8 flex flex-col justify-between transition-all relative ${
                tier.popular
                  ? "bg-card border-2 border-primary shadow-2xl scale-[1.02] ring-4 ring-primary/10"
                  : "bg-card border border-border shadow-md hover:border-primary/50"
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-4 start-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-black px-4 py-1 rounded-full shadow-md">
                  {locale === "ar" ? tier.tagAr : tier.tagEn}
                </div>
              )}

              <div>
                <div className="mb-6">
                  {!tier.popular && (
                    <span className="text-xs font-bold text-muted-foreground block mb-1">
                      {locale === "ar" ? tier.tagAr : tier.tagEn}
                    </span>
                  )}
                  <h3 className="text-xl font-black text-foreground">
                    {locale === "ar" ? tier.nameAr : tier.nameEn}
                  </h3>
                </div>

                <div className="mb-8 flex items-baseline gap-1">
                  <span className="text-4xl font-black text-foreground">
                    {formatCurrency(tier.price)}
                  </span>
                  <span className="text-sm font-semibold text-muted-foreground">
                    / {locale === "ar" ? tier.periodAr : tier.periodEn}
                  </span>
                </div>

                <div className="space-y-3.5 mb-8">
                  {(locale === "ar" ? tier.featuresAr : tier.featuresEn).map(
                    (feature, idx) => (
                      <div key={idx} className="flex items-start gap-3 text-xs leading-relaxed">
                        <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                        <span className="text-muted-foreground">{feature}</span>
                      </div>
                    )
                  )}
                </div>
              </div>

              <div>
                <Button
                  onClick={() => handleSubscribe(tier.id)}
                  disabled={isCurrentLoading}
                  className={`w-full rounded-2xl h-13 font-bold text-sm shadow-md ${
                    tier.popular
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "bg-foreground text-background hover:bg-foreground/90"
                  }`}
                >
                  {isCurrentLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <span>{locale === "ar" ? tier.ctaAr : tier.ctaEn}</span>
                  )}
                </Button>
                <span className="block text-center text-[11px] text-muted-foreground mt-3">
                  {locale === "ar"
                    ? "إلغاء فوري في أي وقت • دفع آمن 100%"
                    : "Cancel anytime • 100% secure checkout"}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Trust & Guarantee Banner */}
      <div className="rounded-3xl bg-muted/40 border border-border p-8 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-3">
            <BookOpen className="w-6 h-6" />
          </div>
          <h4 className="font-bold text-sm text-foreground">
            {locale === "ar" ? "أرصدتك ملكك للأبد" : "Keep Your Books Forever"}
          </h4>
          <p className="text-xs text-muted-foreground mt-1 max-w-[220px]">
            {locale === "ar"
              ? "الكتب والروايات المقتناة بأرصدتك تظل في مكتبتك حتى لو قمت بإلغاء اشتراكك."
              : "Books redeemed with credits remain in your library permanently."}
          </p>
        </div>

        <div className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h4 className="font-bold text-sm text-foreground">
            {locale === "ar" ? "حماية وخصوصية تامة" : "DRM & Family Safety"}
          </h4>
          <p className="text-xs text-muted-foreground mt-1 max-w-[220px]">
            {locale === "ar"
              ? "بث آمن وسحابة مشفرة، مع بيئة آمنة تامة للأطفال خالية من أي محتوى غير مناسب."
              : "End-to-end encrypted streams and a child-safe ecosystem."}
          </p>
        </div>

        <div className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-3">
            <Headphones className="w-6 h-6" />
          </div>
          <h4 className="font-bold text-sm text-foreground">
            {locale === "ar" ? "استماع متعدد السرعات" : "Adaptive Audio Player"}
          </h4>
          <p className="text-xs text-muted-foreground mt-1 max-w-[220px]">
            {locale === "ar"
              ? "مشغل صوتي متطور بمؤقت نوم، وسرعات استماع متعددة، ومزامنة تلقائية للتقدم."
              : "Advanced audio player with sleep timer and variable speeds."}
          </p>
        </div>
      </div>
    </div>
  )
}
