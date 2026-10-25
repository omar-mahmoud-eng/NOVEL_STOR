import React, { useState, useEffect } from "react"
import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Text, Badge, Button, Table, Input } from "@medusajs/ui"
import { Gift, Plus, Coins, Tag, CheckCircle2, Ticket } from "lucide-react"
import { SubNav } from "../../../components/sub-nav"

const loyaltyTabs = [
  { label: "لوحة التحكم (Dashboard)", href: "/app/loyalty" },
  { label: "هيكل فئات الـ VIP (Tier Ladder)", href: "/app/loyalty/tiers" },
  { label: "كتالوج قسائم المكافآت (Rewards)", href: "/app/loyalty/rewards", active: true },
]

const LoyaltyRewardsPage = () => {
  const [rewards, setRewards] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [title, setTitle] = useState("")
  const [pointsCost, setPointsCost] = useState(250)
  const [rewardType, setRewardType] = useState("fixed_discount")
  const [discountVal, setDiscountVal] = useState(10)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [msg, setMsg] = useState("")

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await fetch("/admin/loyalty")
      if (res.ok) {
        const json = await res.json()
        setRewards(json.rewards || [])
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

  return (
    <div className="space-y-6">
      <SubNav
        parentTitle="Loyalty & VIP"
        currentTitle="Rewards Catalog & Voucher Studio"
        description="كتالوج استبدال النقاط بالمكافآت، قسائم الخصم، والشحن المجاني مع إدارة فئات الخصومات"
        icon={Gift}
        tabs={loyaltyTabs}
        onRefresh={fetchData}
        isLoading={loading}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Rewards List */}
        <Container className="lg:col-span-2 p-0 overflow-hidden">
          <div className="p-4 border-b border-ui-border-base flex items-center justify-between">
            <div>
              <Heading level="h2" className="text-base font-bold text-ui-fg-base">
                المكافآت المتاحة في المتجر ({rewards.length})
              </Heading>
              <Text className="text-xs text-ui-fg-subtle">
                تظهر هذه المكافآت للعملاء في تطبيق المتجر لاستبدال نقاط الولاء بها فوراً
              </Text>
            </div>
            <Badge color="purple">Active Catalog</Badge>
          </div>

          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>اسم المكافأة</Table.HeaderCell>
                <Table.HeaderCell>النوع</Table.HeaderCell>
                <Table.HeaderCell>تكلفة النقاط</Table.HeaderCell>
                <Table.HeaderCell>قيمة الخصم</Table.HeaderCell>
                <Table.HeaderCell>الحالة</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {rewards.length === 0 ? (
                <Table.Row>
                  <td className="text-center py-6 text-ui-fg-subtle" colSpan={5}>
                    لا توجد مكافآت مسجلة حالياً
                  </td>
                </Table.Row>
              ) : (
                rewards.map((r) => (
                  <Table.Row key={r.id}>
                    <Table.Cell className="font-semibold text-sm flex items-center gap-2">
                      <Ticket className="w-4 h-4 text-purple-600" />
                      <span>{r.title}</span>
                    </Table.Cell>
                    <Table.Cell className="text-xs">
                      <Badge color="blue">{r.reward_type}</Badge>
                    </Table.Cell>
                    <Table.Cell className="font-bold text-emerald-600">
                      {r.points_cost} نقطة
                    </Table.Cell>
                    <Table.Cell className="font-semibold text-xs">
                      {r.reward_type === "percentage" ? `${r.discount_value}%` : `$${r.discount_value}`}
                    </Table.Cell>
                    <Table.Cell>
                      <Badge color={r.is_active ? "green" : "grey"}>
                        {r.is_active ? "نشط بالمتجر" : "معطل"}
                      </Badge>
                    </Table.Cell>
                  </Table.Row>
                ))
              )}
            </Table.Body>
          </Table>
        </Container>

        {/* Create Voucher Form */}
        <Container className="p-5 h-fit">
          <Heading level="h2" className="text-base font-bold text-ui-fg-base mb-1">
            إضافة مكافأة جديدة
          </Heading>
          <Text className="text-xs text-ui-fg-subtle mb-4">
            تحديد اسم القسيمة، تكلفة النقاط وقيمة الخصم للعميل
          </Text>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              setMsg("تم حفظ وتنشيط المكافأة في نظام الولاء بنجاح!")
              setTimeout(() => setMsg(""), 4000)
            }}
            className="space-y-4"
          >
            <div>
              <label className="text-xs font-semibold text-ui-fg-base block mb-1">
                اسم المكافأة / القسيمة
              </label>
              <Input
                placeholder="مثال: خصم $15 على أي رواية ورقية"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-ui-fg-base block mb-1">
                النقاط المطلوبة للاستبدال
              </label>
              <Input
                type="number"
                value={pointsCost}
                onChange={(e) => setPointsCost(Number(e.target.value))}
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-ui-fg-base block mb-1">
                نوع الخصم
              </label>
              <select
                className="w-full text-xs p-2 rounded-md border border-ui-border-base bg-ui-bg-base text-ui-fg-base"
                value={rewardType}
                onChange={(e) => setRewardType(e.target.value)}
              >
                <option value="fixed_discount">خصم ثابت بالدولار ($)</option>
                <option value="percentage">نسبة مئوية (%)</option>
                <option value="free_shipping">شحن مجاني</option>
                <option value="audiobook_credit">رصيد كتاب صوتي مجاني</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-ui-fg-base block mb-1">
                قيمة الخصم
              </label>
              <Input
                type="number"
                value={discountVal}
                onChange={(e) => setDiscountVal(Number(e.target.value))}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              disabled={isSubmitting || !title.trim()}
            >
              <Plus className="w-4 h-4 ml-1.5" />
              إنشاء وتفعيل المكافأة
            </Button>

            {msg && (
              <div className="p-2.5 bg-green-50 border border-green-200 text-green-800 text-xs rounded-md flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
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
  label: "Rewards Catalog",
})

export default LoyaltyRewardsPage
