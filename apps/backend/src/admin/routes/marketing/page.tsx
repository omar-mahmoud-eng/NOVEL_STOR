import {adminFetch} from "../../lib/admin-fetch"
import React, { useState, useEffect } from "react"
import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Text, Badge, Button, Table } from "@medusajs/ui"
import {
  Send,
  Mail,
  Smartphone,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Users,
  Sparkles,
  ArrowUpRight,
  PieChart,
  CheckCircle2,
  Clock,
} from "lucide-react"
import { SubNav } from "../../components/sub-nav"

const marketingTabs = [
  { label: "لوحة التحكم (Dashboard)", href: "/app/marketing", active: true },
  { label: "حملات النشر (Campaigns)", href: "/app/marketing/campaigns" },
  { label: "أتمتة السلات المتروكة (Abandoned Carts)", href: "/app/marketing/abandoned-carts" },
  { label: "مسارات الأتمتة (Workflows)", href: "/app/marketing/automations" },
]

const MarketingDashboardPage = () => {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await adminFetch("/admin/marketing")
      if (res.ok) {
        const json = await res.json()
        setData(json)
      }
    } catch (err) {
      console.error("Error fetching marketing data:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const s = data?.summary
  const campaigns = data?.campaigns || []
  const carts = data?.abandoned_carts || []

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto" dir="rtl">
      <SubNav
        parentTitle="التسويق متعدد القنوات"
        currentTitle="لوحة التحكم ومؤشرات التحويل | Marketing Dashboard"
        description="نظام أتمتة مدمج بديل لـ (Klaviyo & Omnisend) لمتابعة قمع المبيعات ومعدلات الفتح واسترداد السلات."
        icon={Send}
        tabs={marketingTabs}
        onRefresh={fetchData}
        isLoading={loading}
      />

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Container className="p-5 border-l-4 border-l-purple-600 bg-ui-bg-base shadow-sm">
          <div className="flex items-center justify-between">
            <Text className="text-xs font-bold text-ui-fg-subtle">مبيعات الحملات التسويقية</Text>
            <DollarSign className="w-5 h-5 text-purple-600" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-ui-fg-base">
              {s ? Number(s.total_revenue_generated).toLocaleString() : "35,600"} ر.س
            </span>
            <span className="text-xs font-bold text-green-600 flex items-center">
              +24.8% <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
          <Text className="text-xs text-ui-fg-subtle mt-1">عائد مباشر على الإنفاق الإعلاني (ROAS 8.4x)</Text>
        </Container>

        <Container className="p-5 border-l-4 border-l-emerald-600 bg-ui-bg-base shadow-sm">
          <div className="flex items-center justify-between">
            <Text className="text-xs font-bold text-ui-fg-subtle">استرداد السلات المتروكة</Text>
            <ShoppingCart className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-700">
              {s?.recovered_carts_count || 1} سلة
            </span>
            <span className="text-xs text-ui-fg-subtle">
              من أصل {carts.length} سلة متروكة
            </span>
          </div>
          <Text className="text-xs text-emerald-600 mt-1 font-semibold">
            قيمة مستردة: {s ? Number(s.recovered_revenue).toLocaleString() : "145"} ر.س
          </Text>
        </Container>

        <Container className="p-5 border-l-4 border-l-blue-600 bg-ui-bg-base shadow-sm">
          <div className="flex items-center justify-between">
            <Text className="text-xs font-bold text-ui-fg-subtle">متوسط معدل فتح الرسائل</Text>
            <Mail className="w-5 h-5 text-blue-600" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-blue-700">
              {s ? Number(s.average_open_rate).toFixed(1) : "41.6"}%
            </span>
            <span className="text-xs font-bold text-blue-600">عالي التفاعل</span>
          </div>
          <Text className="text-xs text-ui-fg-subtle mt-1">معدل نقر (Click Rate): 18.2%</Text>
        </Container>

        <Container className="p-5 border-l-4 border-l-amber-500 bg-ui-bg-base shadow-sm">
          <div className="flex items-center justify-between">
            <Text className="text-xs font-bold text-ui-fg-subtle">إجمالي وصول الحملات</Text>
            <Users className="w-5 h-5 text-amber-500" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-amber-700">
              {s ? Number(s.total_recipients_reached).toLocaleString() : "5,450"}
            </span>
            <span className="text-xs text-ui-fg-subtle">قارئ مستهدف</span>
          </div>
          <Text className="text-xs text-ui-fg-subtle mt-1">عبر البريد، الرسائل، وWhatsApp</Text>
        </Container>
      </div>

      {/* Marketing Funnel & Channel Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Container className="p-6 lg:col-span-2 space-y-4">
          <Heading level="h2" className="text-base font-bold text-ui-fg-base">
            قمع التحويل التسويقي (Omnichannel Conversion Funnel)
          </Heading>
          <div className="space-y-3 pt-2">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-ui-fg-base">1. الرسائل المرسلة والمستلمة (Delivery Rate 99.4%)</span>
                <span className="font-mono text-ui-fg-subtle">5,450 رسالة</span>
              </div>
              <div className="w-full bg-ui-bg-subtle rounded-full h-2.5 overflow-hidden">
                <div className="bg-purple-600 h-full rounded-full" style={{ width: "99.4%" }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-ui-fg-base">2. فتح الرسائل واستعراض العرض (Open Rate 41.6%)</span>
                <span className="font-mono text-ui-fg-subtle">2,267 فتح</span>
              </div>
              <div className="w-full bg-ui-bg-subtle rounded-full h-2.5 overflow-hidden">
                <div className="bg-blue-600 h-full rounded-full" style={{ width: "41.6%" }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-ui-fg-base">3. النقر على الرابط والدخول للمتجر (Click Rate 18.2%)</span>
                <span className="font-mono text-ui-fg-subtle">992 زيارة</span>
              </div>
              <div className="w-full bg-ui-bg-subtle rounded-full h-2.5 overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: "18.2%" }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-ui-fg-base">4. إتمام طلبات الشراء (Purchase Conversion Rate 8.7%)</span>
                <span className="font-mono text-emerald-700 font-bold">474 طلباً مكتمل</span>
              </div>
              <div className="w-full bg-ui-bg-subtle rounded-full h-2.5 overflow-hidden">
                <div className="bg-emerald-600 h-full rounded-full" style={{ width: "8.7%" }} />
              </div>
            </div>
          </div>
        </Container>

        <Container className="p-6 space-y-4">
          <Heading level="h2" className="text-base font-bold text-ui-fg-base">
            توزيع القنوات التسويقية
          </Heading>
          <div className="space-y-3 pt-2">
            <div className="p-3 rounded-lg bg-green-50 border border-green-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-green-700" />
                <span className="text-xs font-bold text-green-900">WhatsApp Business</span>
              </div>
              <span className="text-xs font-bold text-green-800">58% من المبيعات</span>
            </div>

            <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-700" />
                <span className="text-xs font-bold text-blue-900">البريد الإلكتروني الذكي</span>
              </div>
              <span className="text-xs font-bold text-blue-800">32% من المبيعات</span>
            </div>

            <div className="p-3 rounded-lg bg-purple-50 border border-purple-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Send className="w-4 h-4 text-purple-700" />
                <span className="text-xs font-bold text-purple-900">إشعارات الويب المباشرة</span>
              </div>
              <span className="text-xs font-bold text-purple-800">10% من المبيعات</span>
            </div>
          </div>
        </Container>
      </div>

      {/* Quick Links to Sub-Sections */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
        <a href="/app/marketing/campaigns" className="block p-4 rounded-xl border border-ui-border-base bg-ui-bg-subtle/50 hover:bg-ui-bg-base hover:border-purple-500 transition-all">
          <div className="font-bold text-sm text-ui-fg-base">استوديو حملات النشر ←</div>
          <div className="text-xs text-ui-fg-subtle mt-1">إنشاء وإطلاق حملات بريدية وحملات واتساب جديدة</div>
        </a>
        <a href="/app/marketing/abandoned-carts" className="block p-4 rounded-xl border border-ui-border-base bg-ui-bg-subtle/50 hover:bg-ui-bg-base hover:border-emerald-500 transition-all">
          <div className="font-bold text-sm text-ui-fg-base">أتمتة السلات المتروكة ←</div>
          <div className="text-xs text-ui-fg-subtle mt-1">سجل السلات المتروكة والخصومات التلقائية</div>
        </a>
        <a href="/app/marketing/automations" className="block p-4 rounded-xl border border-ui-border-base bg-ui-bg-subtle/50 hover:bg-ui-bg-base hover:border-blue-500 transition-all">
          <div className="font-bold text-sm text-ui-fg-base">مسارات العمل والتدفقات ←</div>
          <div className="text-xs text-ui-fg-subtle mt-1">تدفقات الترحيب بالعملاء وبرامج ولاء ما بعد الشراء</div>
        </a>
      </div>
    </div>
  )
}

export const config = defineRouteConfig({
  label: "Marketing & Campaigns",
  icon: Send,
})

export default MarketingDashboardPage
