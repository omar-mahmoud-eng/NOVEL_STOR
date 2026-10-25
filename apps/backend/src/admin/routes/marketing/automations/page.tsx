import React from "react"
import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Text, Badge, Button } from "@medusajs/ui"
import { Zap, Clock, Mail, Smartphone, ArrowLeft, CheckCircle2 } from "lucide-react"
import { SubNav } from "../../../components/sub-nav"

const marketingTabs = [
  { label: "لوحة التحكم (Dashboard)", href: "/app/marketing" },
  { label: "حملات النشر (Campaigns)", href: "/app/marketing/campaigns" },
  { label: "أتمتة السلات المتروكة (Abandoned Carts)", href: "/app/marketing/abandoned-carts" },
  { label: "مسارات الأتمتة (Workflows)", href: "/app/marketing/automations", active: true },
]

const AutomationsWorkflowPage = () => {
  const workflows = [
    {
      id: "wf_1",
      name: "سلسلة الترحيب بالقراء الجدد (Welcome Series)",
      trigger: "عند تسجيل حساب جديد في المتجر",
      channel: "Email & Web Push",
      stepsCount: 3,
      conversionRate: "14.2%",
      status: "active",
      description: "إرسال دليل القراءة، تفعيل عينة صوتية مجانية، وتقديم كود خصم 10% على أول طلب.",
    },
    {
      id: "wf_2",
      name: "استرداد السلات المتروكة الذكي (Cart Recovery Cascade)",
      trigger: "مرور ساعة على مغادرة صفحة الدفع دون إتمام الطلب",
      channel: "WhatsApp & Email",
      stepsCount: 2,
      conversionRate: "28.6%",
      status: "active",
      description: "إرسال تذكير مباشر بالواتساب مع كود SAVE10 وتذكير بريدي بعد 24 ساعة.",
    },
    {
      id: "wf_3",
      name: "ترقية أعضاء نادي الـ VIP بعد الشراء الثاني",
      trigger: "إتمام العميل لطلبه الثاني بنجاح",
      channel: "Email & SMS",
      stepsCount: 2,
      conversionRate: "19.5%",
      status: "active",
      description: "إشعار العميل بالترقية إلى الفئة الفضية ومنحه 150 نقطة مكافأة فورية.",
    },
    {
      id: "wf_4",
      name: "إعادة تنشيط القراء المنقطعين (Winback Flow)",
      trigger: "عدم فتح المتجر أو الشراء لمدة 45 يوماً",
      channel: "Email",
      stepsCount: 2,
      conversionRate: "6.8%",
      status: "active",
      description: "عرض الروايات الجديدة الأكثر رواجاً مع هدية استبدال مجانية لفصل صوتي كامل.",
    },
  ]

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto" dir="rtl">
      <SubNav
        parentTitle="التسويق متعدد القنوات"
        currentTitle="مسارات وتدفقات الأتمتة الذكية | Automation Workflows"
        description="محرك التدفقات التلقائية المدمج لتفعيل رسائل الشراء وإعادة التنشيط وسلاسل الترحيب."
        icon={Zap}
        tabs={marketingTabs}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {workflows.map((wf) => (
          <Container key={wf.id} className="p-6 space-y-3 border border-ui-border-base rounded-xl shadow-sm">
            <div className="flex items-start justify-between gap-2">
              <div className="font-bold text-base text-ui-fg-base">{wf.name}</div>
              <Badge color={wf.status === "active" ? "green" : "grey"}>
                {wf.status === "active" ? "يعمل تلقائياً" : "معطل"}
              </Badge>
            </div>
            <p className="text-xs text-ui-fg-subtle leading-relaxed">{wf.description}</p>
            <div className="pt-3 border-t border-ui-border-base flex items-center justify-between text-xs">
              <span className="text-ui-fg-subtle">المحفز: <strong>{wf.trigger}</strong></span>
              <span className="text-emerald-700 font-bold font-mono">تحويل {wf.conversionRate}</span>
            </div>
          </Container>
        ))}
      </div>
    </div>
  )
}

export const config = defineRouteConfig({
  label: "Automations",
})

export default AutomationsWorkflowPage
