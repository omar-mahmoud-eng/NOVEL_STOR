import React, { useState, useEffect } from "react"
import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Text, Badge, Button, Table } from "@medusajs/ui"
import {
  Star,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ThumbsUp,
  MessageSquare,
  ShieldCheck,
  TrendingUp,
  ArrowUpRight,
} from "lucide-react"
import { SubNav } from "../../components/sub-nav"

const reviewTabs = [
  { label: "لوحة التحكم (Dashboard)", href: "/app/reviews", active: true },
  { label: "طابور التدقيق (Moderation Queue)", href: "/app/reviews/moderation" },
  { label: "معرض التقييمات وشارات التوثيق (UGC)", href: "/app/reviews/social-proof" },
]

const ReviewsDashboardPage = () => {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await fetch("/admin/reviews")
      if (res.ok) {
        const json = await res.json()
        setData(json)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const s = data?.summary
  const reviews = data?.reviews || []

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto" dir="rtl">
      <SubNav
        parentTitle="تقييمات وآراء العملاء"
        currentTitle="لوحة التحكم ومؤشرات رضا القراء | Reviews Dashboard"
        description="نظام إدارة آراء القراء والتقييمات الموثقة المدمج كبديل أصيل لـ (Yotpo & Judge.me)."
        icon={Star}
        tabs={reviewTabs}
        onRefresh={fetchData}
        isLoading={loading}
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Container className="p-5 border-l-4 border-l-amber-500 bg-ui-bg-base shadow-sm">
          <div className="flex items-center justify-between">
            <Text className="text-xs font-bold text-ui-fg-subtle">متوسط التقييم العام للمتجر</Text>
            <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-ui-fg-base">
              {s ? Number(s.average_rating).toFixed(1) : "4.9"}
            </span>
            <span className="text-xs text-ui-fg-subtle">/ 5.0 نجوم</span>
          </div>
          <Text className="text-xs text-green-600 mt-1.5 font-bold">★★★★★ 98% تقييمات إيجابية</Text>
        </Container>

        <Container className="p-5 border-l-4 border-l-blue-600 bg-ui-bg-base shadow-sm">
          <div className="flex items-center justify-between">
            <Text className="text-xs font-bold text-ui-fg-subtle">إجمالي التقييمات المستلمة</Text>
            <MessageSquare className="w-5 h-5 text-blue-600" />
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-ui-fg-base">{s?.total_reviews || 0}</span>
            <span className="text-xs text-ui-fg-subtle mr-2">مراجعة نقدية</span>
          </div>
          <Text className="text-xs text-ui-fg-subtle mt-1.5">منها {s?.verified_count || 0} من مشترين موثقين</Text>
        </Container>

        <Container className="p-5 border-l-4 border-l-yellow-500 bg-ui-bg-base shadow-sm">
          <div className="flex items-center justify-between">
            <Text className="text-xs font-bold text-ui-fg-subtle">بانتظار تدقيق المشرف</Text>
            <AlertCircle className="w-5 h-5 text-yellow-500" />
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-yellow-600">{s?.pending_count || 0}</span>
          </div>
          <Text className="text-xs text-ui-fg-subtle mt-1.5">في طابور المراجعة المباشرة</Text>
        </Container>

        <Container className="p-5 border-l-4 border-l-green-600 bg-ui-bg-base shadow-sm">
          <div className="flex items-center justify-between">
            <Text className="text-xs font-bold text-ui-fg-subtle">التقييمات المعتمدة والمنشورة</Text>
            <CheckCircle2 className="w-5 h-5 text-green-600" />
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-green-700">{s?.approved_count || 0}</span>
          </div>
          <Text className="text-xs text-ui-fg-subtle mt-1.5">ظاهرة في صفحات الروايات</Text>
        </Container>
      </div>

      {/* Star Distribution Histogram & Quick Access */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Container className="p-6 lg:col-span-2 space-y-4">
          <Heading level="h2" className="text-base font-bold text-ui-fg-base">
            مخطط توزيع النجوم وآراء القراء (Star Breakdown)
          </Heading>
          <div className="space-y-2.5 pt-2">
            <div className="flex items-center gap-3 text-xs">
              <span className="w-16 font-bold text-ui-fg-base">5 نجوم ★</span>
              <div className="flex-1 bg-ui-bg-subtle rounded-full h-2.5 overflow-hidden">
                <div className="bg-amber-400 h-full rounded-full" style={{ width: "88%" }} />
              </div>
              <span className="w-10 text-left font-mono font-bold text-ui-fg-subtle">88%</span>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="w-16 font-bold text-ui-fg-base">4 نجوم ★</span>
              <div className="flex-1 bg-ui-bg-subtle rounded-full h-2.5 overflow-hidden">
                <div className="bg-amber-400 h-full rounded-full" style={{ width: "9%" }} />
              </div>
              <span className="w-10 text-left font-mono font-bold text-ui-fg-subtle">9%</span>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="w-16 font-bold text-ui-fg-base">3 نجوم ★</span>
              <div className="flex-1 bg-ui-bg-subtle rounded-full h-2.5 overflow-hidden">
                <div className="bg-amber-400 h-full rounded-full" style={{ width: "2%" }} />
              </div>
              <span className="w-10 text-left font-mono font-bold text-ui-fg-subtle">2%</span>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="w-16 font-bold text-ui-fg-base">2 نجوم ★</span>
              <div className="flex-1 bg-ui-bg-subtle rounded-full h-2.5 overflow-hidden">
                <div className="bg-amber-400 h-full rounded-full" style={{ width: "1%" }} />
              </div>
              <span className="w-10 text-left font-mono font-bold text-ui-fg-subtle">1%</span>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="w-16 font-bold text-ui-fg-base">1 نجمة ★</span>
              <div className="flex-1 bg-ui-bg-subtle rounded-full h-2.5 overflow-hidden">
                <div className="bg-amber-400 h-full rounded-full" style={{ width: "0%" }} />
              </div>
              <span className="w-10 text-left font-mono font-bold text-ui-fg-subtle">0%</span>
            </div>
          </div>
        </Container>

        <Container className="p-6 space-y-4">
          <Heading level="h2" className="text-base font-bold text-ui-fg-base">
            إجراءات الإشراف السريعة
          </Heading>
          <div className="space-y-3 pt-1">
            <a
              href="/app/reviews/moderation"
              className="block p-3.5 rounded-lg border border-yellow-200 bg-yellow-50/60 hover:bg-yellow-100/80 transition-colors"
            >
              <div className="font-bold text-xs text-yellow-900">فتح طابور التدقيق الفوري ←</div>
              <div className="text-[11px] text-yellow-700 mt-0.5">اعتماد أو رفض التقييمات المعلقة بنقرة زر</div>
            </a>
            <a
              href="/app/reviews/social-proof"
              className="block p-3.5 rounded-lg border border-blue-200 bg-blue-50/60 hover:bg-blue-100/80 transition-colors"
            >
              <div className="font-bold text-xs text-blue-900">معرض شارات التوثيق (UGC) ←</div>
              <div className="text-[11px] text-blue-700 mt-0.5">عرض المراجعات الأكثر فائدة وتثبيتها بالمتجر</div>
            </a>
          </div>
        </Container>
      </div>
    </div>
  )
}

export const config = defineRouteConfig({
  label: "Reviews & Ratings",
  icon: Star,
})

export default ReviewsDashboardPage
