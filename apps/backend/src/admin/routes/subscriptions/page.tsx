import React, { useState, useEffect } from "react"
import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Text, Badge, Button, Input } from "@medusajs/ui"
import {
  Sparkles,
  TrendingUp,
  Users,
  CreditCard,
  Plus,
  Clock,
  Gift,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  RefreshCw,
} from "lucide-react"
import { SubNav } from "../../components/sub-nav"

const subscriptionsTabs = [
  { label: "لوحة التحكم (Dashboard)", href: "/app/subscriptions", active: true },
  { label: "باقات وخطط الاشتراكات (Plans & Tiers)", href: "/app/subscriptions/plans" },
]

type SubscriptionTier = {
  id: string
  title: string
  interval: "month" | "year"
  price: string
  credits: number
  activeSubscribers: number
  badgeColor: "purple" | "blue" | "green"
}

type Subscriber = {
  id: string
  name: string
  email: string
  plan: string
  status: "active" | "past_due" | "paused"
  remainingCredits: number
  renewalDate: string
}

const initialTiers: SubscriptionTier[] = [
  {
    id: "tier_monthly_vip",
    title: "باقة الصالون الأدبي VIP الشهرية",
    interval: "month",
    price: "39.00 ر.س / شهرياً",
    credits: 1,
    activeSubscribers: 840,
    badgeColor: "purple",
  },
  {
    id: "tier_annual_vip",
    title: "اشتراك النخبة الشامل All-Access (سنوي)",
    interval: "year",
    price: "390.00 ر.س / سنوياً",
    credits: 14,
    activeSubscribers: 310,
    badgeColor: "blue",
  },
  {
    id: "tier_kids_pass",
    title: "باقة براعم العائلة وقصص قبل النوم",
    interval: "month",
    price: "29.00 ر.س / شهرياً",
    credits: 2,
    activeSubscribers: 190,
    badgeColor: "green",
  },
]

const initialSubscribers: Subscriber[] = [
  {
    id: "cust_tariq_01",
    name: "طارق بن منصور المنصور",
    email: "tariq.mansoor@example.com",
    plan: "باقة الصالون الأدبي VIP الشهرية",
    status: "active",
    remainingCredits: 2,
    renewalDate: "2026-11-24",
  },
  {
    id: "cust_sarah_02",
    name: "د. سارة بنت عبد الله العتيبي",
    email: "dr.sarah.otb@example.com",
    plan: "اشتراك النخبة الشامل All-Access (سنوي)",
    status: "active",
    remainingCredits: 18,
    renewalDate: "2027-04-15",
  },
  {
    id: "cust_khalid_05",
    name: "خالد بن سلطان",
    email: "khalid.sultan@example.com",
    plan: "باقة براعم العائلة وقصص قبل النوم",
    status: "past_due",
    remainingCredits: 0,
    renewalDate: "2026-10-25",
  },
]

const SubscriptionsPage = () => {
  const [tiers, setTiers] = useState<SubscriptionTier[]>(initialTiers)
  const [subscribers, setSubscribers] = useState<Subscriber[]>(initialSubscribers)
  const [loading, setLoading] = useState(false)
  const [showAddTier, setShowAddTier] = useState(false)
  const [newTierTitle, setNewTierTitle] = useState("")
  const [newTierPrice, setNewTierPrice] = useState("49")
  const [newTierCredits, setNewTierCredits] = useState(1)
  const [feedbackMsg, setFeedbackMsg] = useState("")

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await fetch("/admin/subscription-tiers")
      if (res.ok) {
        const data = await res.json()
        if (data.tiers && data.tiers.length > 0) {
          const mappedTiers: SubscriptionTier[] = data.tiers.map((t: any) => ({
            id: t.id,
            title: t.title,
            interval: t.interval || "month",
            price: `${(t.price_amount / 100).toFixed(2)} ر.س / ${t.interval === "year" ? "سنوياً" : "شهرياً"}`,
            credits: t.book_credits_per_period || 1,
            activeSubscribers: 120,
            badgeColor: t.interval === "year" ? "blue" : "purple",
          }))
          setTiers(mappedTiers)
        }
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

  const handleAddTier = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTierTitle.trim()) return

    const priceNum = Math.round(parseFloat(newTierPrice) * 100)
    const handle = newTierTitle.toLowerCase().replace(/\s+/g, "-")

    try {
      const res = await fetch("/admin/subscription-tiers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTierTitle.trim(),
          handle,
          interval: "month",
          price_amount: priceNum,
          book_credits_per_period: newTierCredits,
        }),
      })

      if (res.ok) {
        setFeedbackMsg("تم إنشاء وحفظ باقة الاشتراك في قاعدة البيانات بنجاح!")
        setTimeout(() => setFeedbackMsg(""), 3500)
        setNewTierTitle("")
        setShowAddTier(false)
        await fetchData()
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleGiftCredit = async (subId: string) => {
    try {
      await fetch("/admin/crm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "grant_credit",
          customer_id: subId,
          credits_delta: 1,
        }),
      })
      setSubscribers((prev) =>
        prev.map((sub) =>
          sub.id === subId ? { ...sub, remainingCredits: sub.remainingCredits + 1 } : sub
        )
      )
      setFeedbackMsg("تم إهداء (+1) رصيد كتاب مجاني للمشترك وتوثيقه في قاعدة البيانات!")
      setTimeout(() => setFeedbackMsg(""), 3500)
    } catch (err) {
      console.error(err)
    }
  }

  const handleTogglePause = (subId: string) => {
    setSubscribers((prev) =>
      prev.map((sub) =>
        sub.id === subId
          ? { ...sub, status: sub.status === "paused" ? "active" : "paused" }
          : sub
      )
    )
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6" dir="rtl">
      <SubNav
        parentTitle="الاشتراكات والخدمات الرقمية"
        currentTitle="باقات العضوية المتكررة وأرصدة الكتب | Subscriptions & Churn Analytics"
        description="إدارة باقات العضوية الشهرية والسنوية، تتبع تجديدات الدفعات وتوزيع أرصدة الكتب الصوتية"
        icon={Sparkles}
        tabs={subscriptionsTabs}
        onRefresh={fetchData}
        isLoading={loading}
      />

      {feedbackMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span className="font-medium">{feedbackMsg}</span>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Container className="p-5 bg-white dark:bg-ui-bg-base border border-ui-border-base rounded-xl shadow-xs">
          <div className="flex items-center justify-between">
            <Text className="text-xs font-bold text-ui-fg-subtle">
              الإيراد الشهري المتكرر (MRR)
            </Text>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-ui-fg-base">48,250 ر.س</span>
          </div>
          <Text className="text-xs text-emerald-600 font-bold mt-1">+14.2% مقارنة بالشهر السابق</Text>
        </Container>

        <Container className="p-5 bg-white dark:bg-ui-bg-base border border-ui-border-base rounded-xl shadow-xs">
          <div className="flex items-center justify-between">
            <Text className="text-xs font-bold text-ui-fg-subtle">
              مشتركو باقات VIP النشطون
            </Text>
            <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-ui-fg-base">1,340 قارئ</span>
          </div>
          <Text className="text-xs text-ui-fg-muted mt-1">98.4% معدل نجاح التجديد التلقائي</Text>
        </Container>

        <Container className="p-5 bg-white dark:bg-ui-bg-base border border-ui-border-base rounded-xl shadow-xs">
          <div className="flex items-center justify-between">
            <Text className="text-xs font-bold text-ui-fg-subtle">
              أرصدة الكتب الممنوحة (MTD)
            </Text>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <Gift className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-ui-fg-base">1,890 رصيد</span>
          </div>
          <Text className="text-xs text-ui-fg-muted mt-1">تم تفعيلها في كتب صوتية وإلكترونية</Text>
        </Container>

        <Container className="p-5 bg-white dark:bg-ui-bg-base border border-ui-border-base rounded-xl shadow-xs">
          <div className="flex items-center justify-between">
            <Text className="text-xs font-bold text-ui-fg-subtle">
              جدولة التجديدات التلقائية
            </Text>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-ui-fg-base">BullMQ نشط</span>
          </div>
          <Text className="text-xs text-emerald-600 font-bold mt-1">تجديدات دورية كل 24 ساعة</Text>
        </Container>
      </div>

      {/* Add Tier Form */}
      {showAddTier && (
        <Container className="p-6 bg-ui-bg-subtle/50 border border-ui-border-base rounded-xl">
          <form onSubmit={handleAddTier} className="space-y-4">
            <Heading level="h3" className="text-sm font-bold text-ui-fg-base">
              إنشاء باقة عضوية جديدة
            </Heading>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                placeholder="عنوان الباقة (مثال: باقة رواد الخيال العلمي)"
                value={newTierTitle}
                onChange={(e) => setNewTierTitle(e.target.value)}
                required
              />
              <Input
                type="number"
                placeholder="السعر (ر.س)"
                value={newTierPrice}
                onChange={(e) => setNewTierPrice(e.target.value)}
                required
              />
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  placeholder="أرصدة الكتب شهرياً"
                  value={newTierCredits}
                  onChange={(e) => setNewTierCredits(Number(e.target.value))}
                  min={1}
                />
                <Button type="submit" variant="primary" size="small" className="mr-auto">
                  حفظ في قاعدة البيانات
                </Button>
              </div>
            </div>
          </form>
        </Container>
      )}

      {/* Available Tiers Overview */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Heading level="h2" className="text-base font-bold text-ui-fg-base">
            باقات وخطط الاشتراكات النشطة
          </Heading>
          <Button
            size="small"
            variant="secondary"
            onClick={() => setShowAddTier(!showAddTier)}
            className="text-xs gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>إضافة باقة جديدة</span>
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {tiers.map((tier) => (
            <Container
              key={tier.id}
              className="p-5 bg-white dark:bg-ui-bg-base border border-ui-border-base rounded-xl shadow-xs space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <Heading level="h3" className="text-sm font-bold text-ui-fg-base">
                    {tier.title}
                  </Heading>
                  <span className="text-xs text-ui-fg-subtle">{tier.interval === "year" ? "اشتراك سنوي" : "اشتراك شهري"}</span>
                </div>
                <Badge color={tier.badgeColor}>{tier.credits} رصيد شهري</Badge>
              </div>

              <div className="text-xl font-black text-ui-fg-base">{tier.price}</div>

              <div className="pt-2 border-t border-ui-border-base flex justify-between text-xs text-ui-fg-muted">
                <span>المشتركون النشطون</span>
                <span className="font-bold text-ui-fg-base">{tier.activeSubscribers} قارئ</span>
              </div>
            </Container>
          ))}
        </div>
      </div>

      {/* Subscribers Renewal Queue Table */}
      <Container className="p-0 overflow-hidden bg-white dark:bg-ui-bg-base border border-ui-border-base rounded-xl shadow-xs">
        <div className="p-4 border-b border-ui-border-base flex items-center justify-between bg-ui-bg-subtle/50">
          <Heading level="h2" className="text-sm font-bold text-ui-fg-base">
            جدول تجديدات المشتركين وأرصدة الكتب النشطة
          </Heading>
          <span className="text-xs text-ui-fg-subtle">{subscribers.length} حسابات مشتركة</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-ui-bg-subtle text-ui-fg-subtle font-bold border-b border-ui-border-base">
              <tr>
                <th className="py-2.5 px-4 text-right">القارئ المشترك</th>
                <th className="py-2.5 px-4 text-right">الباقة المشترك بها</th>
                <th className="py-2.5 px-4 text-right">الحالة</th>
                <th className="py-2.5 px-4 text-right">رصيد الكتب</th>
                <th className="py-2.5 px-4 text-right">تاريخ التجديد القادم</th>
                <th className="py-2.5 px-4 text-left">إجراءات سريعة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ui-border-base">
              {subscribers.map((sub) => (
                <tr key={sub.id} className="hover:bg-ui-bg-subtle/40">
                  <td className="py-3 px-4 font-medium text-ui-fg-base">
                    <div className="font-bold">{sub.name}</div>
                    <div className="text-[11px] text-ui-fg-muted">{sub.email}</div>
                  </td>
                  <td className="py-3 px-4 text-ui-fg-subtle font-semibold">{sub.plan}</td>
                  <td className="py-3 px-4">
                    {sub.status === "active" ? (
                      <Badge color="green">نشط</Badge>
                    ) : sub.status === "past_due" ? (
                      <Badge color="red">تأخر السداد</Badge>
                    ) : (
                      <Badge color="orange">موقوف مؤقتاً</Badge>
                    )}
                  </td>
                  <td className="py-3 px-4 font-black text-xs text-purple-700">
                    {sub.remainingCredits} رصيد
                  </td>
                  <td className="py-3 px-4 font-mono text-ui-fg-subtle">
                    {sub.renewalDate}
                  </td>
                  <td className="py-3 px-4 text-left space-x-2 space-x-reverse">
                    <Button
                      variant="secondary"
                      size="small"
                      onClick={() => handleGiftCredit(sub.id)}
                      className="h-7 text-xs"
                      title="إهداء رصيد كتاب مجاني"
                    >
                      +1 رصيد
                    </Button>
                    <Button
                      variant="secondary"
                      size="small"
                      onClick={() => handleTogglePause(sub.id)}
                      className="h-7 text-xs"
                    >
                      {sub.status === "paused" ? "استئناف" : "إيقاف مؤقت"}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Container>
    </div>
  )
}

export const config = defineRouteConfig({
  label: "Subscriptions & Plans",
  icon: Sparkles,
})

export default SubscriptionsPage
