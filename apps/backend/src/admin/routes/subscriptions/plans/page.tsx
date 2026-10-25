import React, { useState } from "react"
import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Text, Badge, Button, Table, Input } from "@medusajs/ui"
import { Sparkles, Plus, CheckCircle2, Crown, Zap, ShieldCheck } from "lucide-react"
import { SubNav } from "../../../components/sub-nav"

const subscriptionsTabs = [
  { label: "لوحة التحكم (Dashboard)", href: "/app/subscriptions" },
  { label: "باقات وخطط الاشتراكات (Plans & Tiers)", href: "/app/subscriptions/plans", active: true },
]

const initialPlans = [
  {
    id: "plan_monthly_vip",
    title: "باقة القارئ الذهبي (Monthly VIP Pass)",
    price: "SAR 39.00",
    interval: "شهري",
    credits: 1,
    subscribers: 840,
    features: ["1 رصيد شهري مجاني لأي رواية أو كتاب صوتي", "خصم 20% دائم على جميع المشتريات", "شحن مجاني على كل الطلبات الورقية"],
  },
  {
    id: "plan_annual_vip",
    title: "العضوية السنوية الشاملة (Annual All-Access)",
    price: "SAR 390.00",
    interval: "سنوي (شهران مجاناً)",
    credits: 14,
    subscribers: 412,
    features: ["14 رصيد كتاب صوتي فوري", "أولوية الحجز في معارض الكتب وجلسات التوقيع", "هدية رواية طبعة خاصة وموقعة سنوياً", "وصول حصري للبث المباشر مع الروائيين"],
  },
  {
    id: "plan_family_audio",
    title: "باقة العائلة واليافعين (Family Pass)",
    price: "SAR 69.00",
    interval: "شهري",
    credits: 3,
    subscribers: 178,
    features: ["3 أرصدة شهرية مشتركة للعائلة", "تفعيل حسابات فرعية للأطفال بنمط رقابي آمن", "مكتبة قصص الأطفال واليافعين مجاناً بالكامل"],
  },
]

const SubscriptionPlansPage = () => {
  const [plans, setPlans] = useState(initialPlans)
  const [title, setTitle] = useState("")
  const [price, setPrice] = useState("49.00")
  const [interval, setInterval] = useState("شهري")
  const [credits, setCredits] = useState(1)
  const [feedback, setFeedback] = useState("")

  const handleCreatePlan = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title) return
    const newPlan = {
      id: `plan_${Date.now()}`,
      title,
      price: `SAR ${price}`,
      interval,
      credits,
      subscribers: 0,
      features: [`${credits} رصيد شهري مجاني`, "وصول غير محدود لقسم الروايات الرقمية", "دعم فني مخصص للعميل"],
    }
    setPlans([...plans, newPlan])
    setTitle("")
    setPrice("49.00")
    setFeedback("تم تدشين وتفعيل باقة الاشتراك الجديدة في المتجر بنجاح!")
    setTimeout(() => setFeedback(""), 3500)
  }

  return (
    <div className="space-y-6">
      <SubNav
        parentTitle="Subscriptions & Memberships"
        currentTitle="Membership Plans & Credit Rules"
        description="هيكل باقات العضوية، تسعير الفترات الدورية، وتعيين عدد أرصدة الروايات الممنوحة تلقائياً للمشترك"
        icon={Crown}
        tabs={subscriptionsTabs}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Plans Grid */}
        <div className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {plans.map((p) => (
              <Container key={p.id} className="p-5 flex flex-col justify-between border-t-4 border-t-purple-600">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Badge color="purple">{p.interval}</Badge>
                    <span className="text-xs font-bold text-emerald-600">{p.subscribers} مشترك نشط</span>
                  </div>
                  <h3 className="font-bold text-base text-ui-fg-base mb-1">{p.title}</h3>
                  <div className="text-2xl font-black text-ui-fg-base mb-2">{p.price}</div>
                  <div className="text-xs text-ui-fg-interactive font-semibold mb-4">
                    {p.credits} رصيد كتاب صوتي شهرياً
                  </div>

                  <div className="space-y-2 pt-3 border-t border-ui-border-base text-xs text-ui-fg-subtle">
                    {p.features.map((f, i) => (
                      <div key={i} className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 flex-shrink-0" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Container>
            ))}
          </div>
        </div>

        {/* Add Plan Form */}
        <Container className="p-5 h-fit">
          <Heading level="h2" className="text-base font-bold text-ui-fg-base mb-1">
            إضافة باقة عضوية جديدة
          </Heading>
          <Text className="text-xs text-ui-fg-subtle mb-4">
            تحديد السعر الدوري، دورة الفوترة، ورصيد الروايات الممنوح
          </Text>

          <form onSubmit={handleCreatePlan} className="space-y-3.5">
            <div>
              <label className="text-xs font-semibold text-ui-fg-base block mb-1">
                اسم الباقة
              </label>
              <Input
                placeholder="مثال: باقة رواد الأدب (Reader Pro)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-ui-fg-base block mb-1">
                السعر بالريال السعودي (SAR)
              </label>
              <Input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-ui-fg-base block mb-1">
                دورة الفوترة والتجديد
              </label>
              <select
                className="w-full text-xs p-2 rounded-md border border-ui-border-base bg-ui-bg-base text-ui-fg-base"
                value={interval}
                onChange={(e) => setInterval(e.target.value)}
              >
                <option value="شهري">تجديد شهري تلقائي</option>
                <option value="ربع سنوي">تجديد ربع سنوي (كل 3 أشهر)</option>
                <option value="سنوي">تجديد سنوي (كل 12 شهراً)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-ui-fg-base block mb-1">
                أرصدة الكتب الصوتية الممنوحة شهرياً
              </label>
              <Input
                type="number"
                value={credits}
                onChange={(e) => setCredits(Number(e.target.value))}
                min={0}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              disabled={!title}
            >
              <Plus className="w-4 h-4 ml-1.5" />
              تدشين باقة العضوية
            </Button>

            {feedback && (
              <div className="p-2.5 bg-green-50 border border-green-200 text-green-800 text-xs rounded-md flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                {feedback}
              </div>
            )}
          </form>
        </Container>
      </div>
    </div>
  )
}

export const config = defineRouteConfig({
  label: "Membership Plans",
})

export default SubscriptionPlansPage
