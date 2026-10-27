import {adminFetch} from "../../../lib/admin-fetch"
import React, { useState, useEffect } from "react"
import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Text, Badge, Button, Table, Input } from "@medusajs/ui"
import { Users, Plus, Tag, CheckCircle2, Copy, Percent, ExternalLink } from "lucide-react"
import { SubNav } from "../../../components/sub-nav"

const affiliateTabs = [
  { label: "لوحة التحكم (Dashboard)", href: "/app/affiliates" },
  { label: "دليل المؤثرين والمسوقين (Creators)", href: "/app/affiliates/creators", active: true },
  { label: "مستحقات وتوزيع العمولات (Payouts)", href: "/app/affiliates/payouts" },
]

const CreatorsDirectoryPage = () => {
  const [affiliates, setAffiliates] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [channel, setChannel] = useState("")
  const [couponCode, setCouponCode] = useState("")
  const [commissionRate, setCommissionRate] = useState<number>(15)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [feedbackMsg, setFeedbackMsg] = useState("")
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await adminFetch("/admin/affiliates")
      if (res.ok) {
        const data = await res.json()
        setAffiliates(data.affiliates || [])
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
        setFeedbackMsg("تم تسجيل المؤثر والشريك التسويقي الجديد بنجاح!")
        setTimeout(() => setFeedbackMsg(""), 4000)
        setName("")
        setEmail("")
        setChannel("")
        setCouponCode("")
        fetchData()
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <SubNav
        parentTitle="Affiliates & Creators"
        currentTitle="Creators & Influencers Directory"
        description="سجل شركاء التسويق، الروابط المخصصة، أكواد الكوبونات ونسب العمولات المباشرة"
        icon={Users}
        tabs={affiliateTabs}
        onRefresh={fetchData}
        isLoading={loading}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Table of Creators */}
        <Container className="lg:col-span-2 p-0 overflow-hidden">
          <div className="p-4 border-b border-ui-border-base flex items-center justify-between">
            <div>
              <Heading level="h2" className="text-base font-bold text-ui-fg-base">
                دليل صناع المحتوى المعتمدين ({affiliates.length})
              </Heading>
              <Text className="text-xs text-ui-fg-subtle">
                إدارة تفاصيل الشركاء، نسبة العمولة، ومجموع المبيعات التي حققوها
              </Text>
            </div>
            <Badge color="purple">Active Affiliates</Badge>
          </div>

          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>المؤثر / القناة</Table.HeaderCell>
                <Table.HeaderCell>كود الخصم (Coupon)</Table.HeaderCell>
                <Table.HeaderCell>نسبة العمولة</Table.HeaderCell>
                <Table.HeaderCell>إجمالي المبيعات المحققة</Table.HeaderCell>
                <Table.HeaderCell>الأرباح المستحقة</Table.HeaderCell>
                <Table.HeaderCell>الحالة</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {affiliates.length === 0 ? (
                <Table.Row>
                  <td className="text-center py-6 text-ui-fg-subtle" colSpan={6}>
                    لا يوجد مسوقون بالعمولة مسجلون بعد
                  </td>
                </Table.Row>
              ) : (
                affiliates.map((aff) => (
                  <Table.Row key={aff.id}>
                    <Table.Cell>
                      <div className="font-semibold text-sm text-ui-fg-base">{aff.name}</div>
                      <div className="text-xs text-ui-fg-subtle">{aff.channel_name || aff.email}</div>
                    </Table.Cell>
                    <Table.Cell>
                      <span className="font-mono text-xs bg-indigo-50 border border-indigo-200 text-indigo-700 font-bold px-2 py-0.5 rounded">
                        {aff.coupon_code}
                      </span>
                    </Table.Cell>
                    <Table.Cell className="font-bold text-xs text-ui-fg-base">
                      {aff.commission_rate}%
                    </Table.Cell>
                    <Table.Cell className="font-bold text-xs text-ui-fg-base">
                      ${Number(aff.total_sales || 0).toLocaleString()}
                    </Table.Cell>
                    <Table.Cell className="font-bold text-xs text-emerald-600">
                      ${Number(aff.total_commission || 0).toLocaleString()}
                    </Table.Cell>
                    <Table.Cell>
                      <Badge color={aff.is_active ? "green" : "grey"}>
                        {aff.is_active ? "نشط" : "متوقف"}
                      </Badge>
                    </Table.Cell>
                  </Table.Row>
                ))
              )}
            </Table.Body>
          </Table>
        </Container>

        {/* Add Creator Form */}
        <Container className="p-5 h-fit">
          <Heading level="h2" className="text-base font-bold text-ui-fg-base mb-1">
            تسجيل شريك تسويقي جديد
          </Heading>
          <Text className="text-xs text-ui-fg-subtle mb-4">
            توليد كود خصم حصري مع تحديد نسبة العمولة للناشر
          </Text>

          <form onSubmit={handleAddAffiliate} className="space-y-3.5">
            <div>
              <label className="text-xs font-semibold text-ui-fg-base block mb-1">
                اسم المؤثر / المسوق
              </label>
              <Input
                placeholder="مثال: يوسف الرواجي"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-ui-fg-base block mb-1">
                البريد الإلكتروني
              </label>
              <Input
                type="email"
                placeholder="creator@channel.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-ui-fg-base block mb-1">
                القناة / المنصة
              </label>
              <Input
                placeholder="مثال: قناة بودكاست الرواية على يوتيوب"
                value={channel}
                onChange={(e) => setChannel(e.target.value)}
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-ui-fg-base block mb-1">
                كود الكوبون الحصري
              </label>
              <Input
                placeholder="مثال: YOUSSEF15"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-ui-fg-base block mb-1">
                نسبة العمولة (%)
              </label>
              <Input
                type="number"
                value={commissionRate}
                onChange={(e) => setCommissionRate(Number(e.target.value))}
                min={1}
                max={100}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
              disabled={isSubmitting || !name || !email || !couponCode}
            >
              <Plus className="w-4 h-4 ml-1.5" />
              {isSubmitting ? "جاري الحفظ..." : "تسجيل وتفعيل الشريك"}
            </Button>

            {feedbackMsg && (
              <div className="p-2.5 bg-green-50 border border-green-200 text-green-800 text-xs rounded-md flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                {feedbackMsg}
              </div>
            )}
          </form>
        </Container>
      </div>
    </div>
  )
}

export const config = defineRouteConfig({
  label: "Creators & Influencers",
})

export default CreatorsDirectoryPage
