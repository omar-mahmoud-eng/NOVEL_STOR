import {adminFetch} from "../../lib/admin-fetch"
import React, { useState, useEffect } from "react"
import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Text, Badge, Button, Table, Input } from "@medusajs/ui"
import { Award, Crown, Gift, Coins, Users, TrendingUp, RefreshCw, PlusCircle, CheckCircle } from "lucide-react"
import { SubNav } from "../../components/sub-nav"

const loyaltyTabs = [
  { label: "لوحة التحكم (Dashboard)", href: "/app/loyalty", active: true },
  { label: "هيكل فئات الـ VIP (Tier Ladder)", href: "/app/loyalty/tiers" },
  { label: "كتالوج قسائم المكافآت (Rewards)", href: "/app/loyalty/rewards" },
]

const LoyaltyDashboardPage = () => {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [adjustCustomerId, setAdjustCustomerId] = useState("")
  const [pointsDelta, setPointsDelta] = useState<number>(100)
  const [msg, setMsg] = useState("")

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await adminFetch("/admin/loyalty")
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

  const handleAdjust = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!adjustCustomerId) return
    try {
      const res = await adminFetch("/admin/loyalty", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_id: adjustCustomerId,
          points_delta: Number(pointsDelta),
        }),
      })
      if (res.ok) {
        setMsg("تم تحديث رصيد العميل بنجاح!")
        setTimeout(() => setMsg(""), 4000)
        setAdjustCustomerId("")
        fetchData()
      }
    } catch (err) {
      console.error(err)
    }
  }

  const s = data?.summary
  const members = data?.members || []

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto" dir="rtl">
      <SubNav
        parentTitle="برنامج الولاء والمكافآت"
        currentTitle="لوحة التحكم ونقاط كبار القراء | Loyalty Dashboard"
        description="بديل مدمج أصيل لـ (Smile.io & LoyaltyLion) لمتابعة رصيد النقاط المتداولة وفئات VIP الراقية."
        icon={Award}
        tabs={loyaltyTabs}
        onRefresh={fetchData}
        isLoading={loading}
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Container className="p-5 border-l-4 border-l-purple-600 bg-ui-bg-base shadow-sm">
          <div className="flex items-center justify-between">
            <Text className="text-xs font-bold text-ui-fg-subtle">إجمالي أعضاء النادي</Text>
            <Users className="w-5 h-5 text-purple-600" />
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-ui-fg-base">{s?.total_members || 0}</span>
            <span className="text-xs text-ui-fg-subtle mr-2">قارئ مسجل</span>
          </div>
          <Text className="text-xs text-green-600 mt-1 font-semibold">100% نشطون في جمع النقاط</Text>
        </Container>

        <Container className="p-5 border-l-4 border-l-amber-500 bg-ui-bg-base shadow-sm">
          <div className="flex items-center justify-between">
            <Text className="text-xs font-bold text-ui-fg-subtle">النقاط المتداولة حالياً</Text>
            <Coins className="w-5 h-5 text-amber-500" />
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-amber-600">
              {Number(s?.total_circulating_points || 0).toLocaleString()}
            </span>
            <span className="text-xs text-ui-fg-subtle mr-2">نقطة رصيد</span>
          </div>
          <Text className="text-xs text-ui-fg-subtle mt-1">جاهزة للاستبدال بقسائم خصم</Text>
        </Container>

        <Container className="p-5 border-l-4 border-l-blue-600 bg-ui-bg-base shadow-sm">
          <div className="flex items-center justify-between">
            <Text className="text-xs font-bold text-ui-fg-subtle">النقاط المكتسبة تاريخياً</Text>
            <TrendingUp className="w-5 h-5 text-blue-600" />
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-ui-fg-base">
              {Number(s?.total_earned_lifetime || 0).toLocaleString()}
            </span>
          </div>
          <Text className="text-xs text-ui-fg-subtle mt-1">مكافآت عمليات الشراء والتقييمات</Text>
        </Container>

        <Container className="p-5 border-l-4 border-l-pink-600 bg-ui-bg-base shadow-sm">
          <div className="flex items-center justify-between">
            <Text className="text-xs font-bold text-ui-fg-subtle">كبار القراء VIP</Text>
            <Crown className="w-5 h-5 text-pink-600" />
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-pink-600">{s?.vip_count || 0}</span>
            <span className="text-xs text-ui-fg-subtle mr-2">عميل ذهبي وبلاتيني</span>
          </div>
          <Text className="text-xs text-ui-fg-subtle mt-1">أعلى قيمة مشتريات سنوية</Text>
        </Container>
      </div>

      {/* Quick Adjustment & Ledger Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Container className="p-6 lg:col-span-2 space-y-4">
          <Heading level="h2" className="text-base font-bold text-ui-fg-base">
            سجل أرصدة كبار القراء والمستويات
          </Heading>
          <div className="overflow-x-auto">
            <Table>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>اسم القارئ</Table.HeaderCell>
                  <Table.HeaderCell>البريد</Table.HeaderCell>
                  <Table.HeaderCell>الفئة</Table.HeaderCell>
                  <Table.HeaderCell>الرصيد</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {members.map((m: any) => (
                  <Table.Row key={m.id}>
                    <Table.Cell className="font-semibold text-sm text-ui-fg-base">{m.customer_name}</Table.Cell>
                    <Table.Cell className="text-xs text-ui-fg-subtle font-mono">{m.customer_email}</Table.Cell>
                    <Table.Cell>
                      <Badge color={m.tier_level === "platinum" ? "purple" : m.tier_level === "gold" ? "orange" : "grey"}>
                        {m.tier_level}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell className="font-bold text-amber-600 text-sm">
                      {Number(m.points_balance).toLocaleString()} 🪙
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </div>
        </Container>

        {/* Quick Points Adjust */}
        <Container className="p-6">
          <Heading level="h2" className="text-base font-bold text-ui-fg-base mb-4 flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-purple-600" />
            تعديل نقاط عميل يدوياً
          </Heading>
          <form onSubmit={handleAdjust} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-ui-fg-subtle block mb-1">العميل</label>
              <select
                className="w-full text-sm bg-ui-bg-base border border-ui-border-base rounded-md p-2"
                value={adjustCustomerId}
                onChange={(e) => setAdjustCustomerId(e.target.value)}
                required
              >
                <option value="">-- اختر حساب القارئ --</option>
                {members.map((m: any) => (
                  <option key={m.customer_id} value={m.customer_id}>
                    {m.customer_name} ({m.customer_email})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-ui-fg-subtle block mb-1">مقدار النقاط (+ / -)</label>
              <Input
                type="number"
                value={pointsDelta}
                onChange={(e) => setPointsDelta(Number(e.target.value))}
                placeholder="200"
                required
              />
            </div>
            <Button type="submit" variant="primary" className="w-full bg-purple-600 hover:bg-purple-700 text-white">
              تنفيذ العملية
            </Button>
            {msg && (
              <div className="p-2.5 bg-green-50 border border-green-200 text-green-800 text-xs rounded-md flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                {msg}
              </div>
            )}
          </form>
        </Container>
      </div>
    </div>
  )
}

export const config = defineRouteConfig({
  label: "Loyalty & VIP Club",
  icon: Award,
})

export default LoyaltyDashboardPage
