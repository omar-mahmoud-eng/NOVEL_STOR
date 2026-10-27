import {adminFetch} from "../../lib/admin-fetch"
import React, { useState, useEffect } from "react"
import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Text, Badge, Button, Table, Input } from "@medusajs/ui"
import {
  Share2,
  Users,
  DollarSign,
  TrendingUp,
  CreditCard,
  PlusCircle,
  RefreshCw,
  CheckCircle,
  ExternalLink,
  Tag,
  Sparkles,
} from "lucide-react"
import { SubNav } from "../../components/sub-nav"

const affiliateTabs = [
  { label: "لوحة التحكم (Dashboard)", href: "/app/affiliates", active: true },
  { label: "دليل المؤثرين والمسوقين (Creators)", href: "/app/affiliates/creators" },
  { label: "مستحقات وتوزيع العمولات (Payouts)", href: "/app/affiliates/payouts" },
]

const AffiliatesPage = () => {
  const [affiliates, setAffiliates] = useState<any[]>([])
  const [referrals, setReferrals] = useState<any[]>([])
  const [summary, setSummary] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // Form State
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [channel, setChannel] = useState("")
  const [couponCode, setCouponCode] = useState("")
  const [commissionRate, setCommissionRate] = useState<number>(15)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [feedbackMsg, setFeedbackMsg] = useState("")

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await adminFetch("/admin/affiliates")
      if (res.ok) {
        const data = await res.json()
        setAffiliates(data.affiliates || [])
        setReferrals(data.referrals || [])
        setSummary(data.summary || null)
      }
    } catch (err) {
      console.error("Error fetching affiliates:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleAddAffiliate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email || !couponCode) return
    setIsSubmitting(true)
    try {
      const res = await adminFetch("/admin/affiliates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          channel_name: channel,
          coupon_code: couponCode.toUpperCase(),
          commission_rate: Number(commissionRate),
        }),
      })
      if (res.ok) {
        setFeedbackMsg("تم تسجيل شريك التسويق الجديد بنجاح!")
        setTimeout(() => setFeedbackMsg(""), 4000)
        setName("")
        setEmail("")
        setChannel("")
        setCouponCode("")
        fetchData()
      }
    } catch (err) {
      console.error("Error adding affiliate:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <SubNav
        parentTitle="Affiliates & Creators"
        currentTitle="Affiliate Dashboard & Overview"
        description="بديل مدمج أصيل لـ (Refersion & UpPromote) لتتبع إحالات المؤثرين وكوبونات التخفيض واحتساب العمولات آلياً"
        icon={Share2}
        tabs={affiliateTabs}
        onRefresh={fetchData}
        isLoading={loading}
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Container className="p-5 border-l-4 border-l-indigo-600">
          <div className="flex items-center justify-between">
            <Text className="text-sm font-medium text-ui-fg-subtle">إجمالي الشركاء والمؤثرين</Text>
            <Users className="w-5 h-5 text-indigo-600" />
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-ui-fg-base">
              {summary ? summary.total_partners : "0"}
            </span>
            <span className="text-sm text-ui-fg-subtle mr-2">صانع محتوى</span>
          </div>
          <Text className="text-xs text-ui-fg-subtle mt-2">نوادي قراءة ومؤثري BookTok</Text>
        </Container>

        <Container className="p-5 border-l-4 border-l-emerald-600">
          <div className="flex items-center justify-between">
            <Text className="text-sm font-medium text-ui-fg-subtle">مبيعات الإحالات المحققة</Text>
            <DollarSign className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-emerald-700">
              {summary ? Number(summary.total_affiliate_revenue).toLocaleString() : "0"}
            </span>
            <span className="text-sm text-ui-fg-subtle mr-2">ر.س</span>
          </div>
          <Text className="text-xs text-emerald-600 mt-2 font-medium">عبر كوبونات التتبع الحصرية</Text>
        </Container>

        <Container className="p-5 border-l-4 border-l-amber-500">
          <div className="flex items-center justify-between">
            <Text className="text-sm font-medium text-ui-fg-subtle">عمولات معلقة للاستحقاق</Text>
            <CreditCard className="w-5 h-5 text-amber-500" />
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-amber-600">
              {summary ? Number(summary.total_pending_payout).toLocaleString() : "0"}
            </span>
            <span className="text-sm text-ui-fg-subtle mr-2">ر.س</span>
          </div>
          <Text className="text-xs text-ui-fg-subtle mt-2">جاهزة للتحويل المصرفي بنهاية الشهر</Text>
        </Container>

        <Container className="p-5 border-l-4 border-l-blue-500">
          <div className="flex items-center justify-between">
            <Text className="text-sm font-medium text-ui-fg-subtle">إجمالي العمولات المصروفة</Text>
            <TrendingUp className="w-5 h-5 text-blue-500" />
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-blue-600">
              {summary ? Number(summary.total_paid_payout).toLocaleString() : "0"}
            </span>
            <span className="text-sm text-ui-fg-subtle mr-2">ر.س</span>
          </div>
          <Text className="text-xs text-ui-fg-subtle mt-2">تم تسويتها بالكامل</Text>
        </Container>
      </div>

      {/* Directory & Quick Add */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Affiliates List */}
        <Container className="p-6 lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <Heading level="h2" className="text-lg font-semibold text-ui-fg-base">
              دليل المسوقين وقنوات الترويج المعتمدة
            </Heading>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>اسم الشريك</Table.HeaderCell>
                  <Table.HeaderCell>القناة / المنصة</Table.HeaderCell>
                  <Table.HeaderCell>كود الخصم</Table.HeaderCell>
                  <Table.HeaderCell>نسبة العمولة</Table.HeaderCell>
                  <Table.HeaderCell>إجمالي المبيعات</Table.HeaderCell>
                  <Table.HeaderCell>العمولة المعلقة</Table.HeaderCell>
                  <Table.HeaderCell>الحالة</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {affiliates.length === 0 ? (
                  <Table.Row>
                    <Table.Cell className="text-center py-6 text-ui-fg-subtle">
                      لا يوجد مسوقين مسجلين بعد.
                    </Table.Cell>
                  </Table.Row>
                ) : (
                  affiliates.map((aff) => (
                    <Table.Row key={aff.id}>
                      <Table.Cell>
                        <div className="font-semibold text-sm text-ui-fg-base">{aff.name}</div>
                        <div className="text-xs text-ui-fg-subtle font-mono">{aff.email}</div>
                      </Table.Cell>
                      <Table.Cell className="text-xs font-medium text-ui-fg-base">
                        {aff.channel_name}
                      </Table.Cell>
                      <Table.Cell>
                        <code className="bg-indigo-50 border border-indigo-200 text-indigo-700 px-2 py-0.5 rounded text-xs font-mono font-bold">
                          {aff.coupon_code}
                        </code>
                      </Table.Cell>
                      <Table.Cell className="text-xs font-bold text-ui-fg-base">
                        {aff.commission_rate}%
                      </Table.Cell>
                      <Table.Cell className="text-xs font-semibold text-emerald-700">
                        {Number(aff.total_revenue).toLocaleString()} ر.س
                      </Table.Cell>
                      <Table.Cell className="text-xs font-bold text-amber-600">
                        {Number(aff.pending_payout).toLocaleString()} ر.س
                      </Table.Cell>
                      <Table.Cell>
                        <Badge color={aff.status === "active" ? "green" : "grey"}>
                          {aff.status === "active" ? "نشط" : "معلق"}
                        </Badge>
                      </Table.Cell>
                    </Table.Row>
                  ))
                )}
              </Table.Body>
            </Table>
          </div>
        </Container>

        {/* Quick Add Partner */}
        <Container className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <PlusCircle className="w-5 h-5 text-indigo-600" />
            <Heading level="h2" className="text-base font-semibold text-ui-fg-base">
              تسجيل شريك تسويقي جديد
            </Heading>
          </div>
          <form onSubmit={handleAddAffiliate} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-ui-fg-subtle block mb-1">
                اسم المسوق / المؤثر
              </label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="مثال: سارة الشمري"
                required
              />
            </div>
            <div>
              <label className="text-xs font-medium text-ui-fg-subtle block mb-1">
                البريد الإلكتروني
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="sara@booktok.sa"
                required
              />
            </div>
            <div>
              <label className="text-xs font-medium text-ui-fg-subtle block mb-1">
                القناة / الحساب الإعلاني
              </label>
              <Input
                value={channel}
                onChange={(e) => setChannel(e.target.value)}
                placeholder="TikTok @SaraReads (150K followers)"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-ui-fg-subtle block mb-1">
                كود الخصم المخصص (Coupon Code)
              </label>
              <Input
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="SARA15"
                required
              />
            </div>
            <div>
              <label className="text-xs font-medium text-ui-fg-subtle block mb-1">
                نسبة العمولة (%)
              </label>
              <Input
                type="number"
                value={commissionRate}
                onChange={(e) => setCommissionRate(Number(e.target.value))}
                placeholder="15"
                required
              />
            </div>
            <Button
              type="submit"
              variant="primary"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
              disabled={isSubmitting}
            >
              <Share2 className="w-4 h-4 ml-1.5" />
              {isSubmitting ? "جاري التسجيل..." : "تفعيل كود الشريك"}
            </Button>
            {feedbackMsg && (
              <div className="p-2.5 bg-green-50 border border-green-200 text-green-800 text-xs rounded-md flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                {feedbackMsg}
              </div>
            )}
          </form>
        </Container>
      </div>

      {/* Referrals Log */}
      <Container className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <Heading level="h2" className="text-lg font-semibold text-ui-fg-base">
              سجل إحالات وطلبات الشراء المرتبطة بالمسوقين
            </Heading>
            <Text className="text-xs text-ui-fg-subtle mt-1">
              يتم تتبع كل طلب يتم عبر كود خصم الشريك واحتساب العمولة أوتوماتيكياً
            </Text>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>معرف الإحالة</Table.HeaderCell>
                <Table.HeaderCell>رقم الطلب (Order ID)</Table.HeaderCell>
                <Table.HeaderCell>الشريك المنسوب له</Table.HeaderCell>
                <Table.HeaderCell>الكود المستخدم</Table.HeaderCell>
                <Table.HeaderCell>قيمة الطلب الإجمالية</Table.HeaderCell>
                <Table.HeaderCell>العمولة المستحقة</Table.HeaderCell>
                <Table.HeaderCell>حالة الدفع</Table.HeaderCell>
                <Table.HeaderCell>التاريخ والوقت</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {referrals.length === 0 ? (
                <Table.Row>
                  <Table.Cell className="text-center py-6 text-ui-fg-subtle">
                    لا توجد إحالات مسجلة حتى الآن.
                  </Table.Cell>
                </Table.Row>
              ) : (
                referrals.map((ref) => (
                  <Table.Row key={ref.id}>
                    <Table.Cell className="font-mono text-xs text-ui-fg-subtle">{ref.id}</Table.Cell>
                    <Table.Cell className="font-mono text-xs font-bold text-ui-fg-base">{ref.order_id}</Table.Cell>
                    <Table.Cell className="font-medium text-sm text-ui-fg-base">{ref.affiliate_name}</Table.Cell>
                    <Table.Cell>
                      <code className="bg-ui-bg-subtle px-2 py-0.5 rounded text-xs font-mono font-semibold text-indigo-700">
                        {ref.coupon_code}
                      </code>
                    </Table.Cell>
                    <Table.Cell className="font-bold text-ui-fg-base text-sm">
                      {Number(ref.order_total).toLocaleString()} ر.س
                    </Table.Cell>
                    <Table.Cell className="font-bold text-emerald-600 text-sm">
                      {Number(ref.commission_amount).toLocaleString()} ر.س
                    </Table.Cell>
                    <Table.Cell>
                      <Badge color={ref.payout_status === "paid" ? "green" : "orange"}>
                        {ref.payout_status === "paid" ? "تم التحويل" : "معلق"}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell className="text-xs text-ui-fg-subtle">
                      {new Date(ref.created_at).toLocaleString("ar-SA")}
                    </Table.Cell>
                  </Table.Row>
                ))
              )}
            </Table.Body>
          </Table>
        </div>
      </Container>
    </div>
  )
}

export const config = defineRouteConfig({
  label: "Affiliates & Creators",
  icon: Share2,
})

export default AffiliatesPage
