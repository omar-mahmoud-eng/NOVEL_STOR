import {adminFetch} from "../../../lib/admin-fetch"
import React, { useState, useEffect } from "react"
import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Text, Badge, Button, Table, Input } from "@medusajs/ui"
import { Send, Plus, Mail, Smartphone, RefreshCw, CheckCircle2 } from "lucide-react"
import { SubNav } from "../../../components/sub-nav"

const marketingTabs = [
  { label: "لوحة التحكم (Dashboard)", href: "/app/marketing" },
  { label: "حملات النشر (Campaigns)", href: "/app/marketing/campaigns", active: true },
  { label: "أتمتة السلات المتروكة (Abandoned Carts)", href: "/app/marketing/abandoned-carts" },
  { label: "مسارات الأتمتة (Workflows)", href: "/app/marketing/automations" },
]

const CampaignsPage = () => {
  const [campaigns, setCampaigns] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState("")
  const [type, setType] = useState("email")
  const [audience, setAudience] = useState(()=>new URLSearchParams(window.location.search).get("audience")||"All Registered Customers (KSA & UAE)")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [msg, setMsg] = useState("")

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await adminFetch("/admin/marketing")
      if (res.ok) {
        const json = await res.json()
        setCampaigns(json.campaigns || [])
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

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    setIsSubmitting(true)
    try {
      const res = await adminFetch("/admin/marketing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, type, audience_group: audience }),
      })
      if (res.ok) {
        setName("")
        setMsg("حُفظت مسودة الحملة. لم يتم إرسال رسائل؛ الإرسال الخارجي غير مفعّل.")
        setTimeout(() => setMsg(""), 4000)
        fetchData()
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto" dir="rtl">
      <SubNav
        parentTitle="التسويق متعدد القنوات"
        currentTitle="استوديو حملات النشر والإعلانات | Campaigns Studio"
        description="إدارة تعريفات الحملات والجمهور المستهدف. الإرسال الخارجي غير مفعّل."
        icon={Send}
        tabs={marketingTabs}
        onRefresh={fetchData}
        isLoading={loading}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Campaign List (2 cols) */}
        <Container className="p-6 lg:col-span-2 space-y-4">
          <Heading level="h2" className="text-base font-bold text-ui-fg-base">
            سجل الحملات التسويقية النشطة والمكتملة
          </Heading>

          <div className="overflow-x-auto">
            <Table>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>اسم الحملة</Table.HeaderCell>
                  <Table.HeaderCell>القناة</Table.HeaderCell>
                  <Table.HeaderCell>الجمهور</Table.HeaderCell>
                  <Table.HeaderCell>الوصول</Table.HeaderCell>
                  <Table.HeaderCell>معدل الفتح</Table.HeaderCell>
                  <Table.HeaderCell>الإيرادات</Table.HeaderCell>
                  <Table.HeaderCell>الحالة</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {campaigns.map((c) => (
                  <Table.Row key={c.id}>
                    <Table.Cell className="font-semibold text-ui-fg-base text-sm">
                      {c.name}
                    </Table.Cell>
                    <Table.Cell>
                      <Badge color={c.type === "email" ? "blue" : c.type === "whatsapp" ? "green" : "purple"}>
                        {c.type === "email" ? "بريد إلكتروني" : c.type === "whatsapp" ? "واتساب" : c.type}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell className="text-xs text-ui-fg-subtle">{c.audience_group}</Table.Cell>
                    <Table.Cell className="font-mono text-xs font-bold text-ui-fg-base">{c.sent_count}</Table.Cell>
                    <Table.Cell className="text-xs font-bold text-blue-600">{c.open_rate}%</Table.Cell>
                    <Table.Cell className="text-xs font-bold text-emerald-700">
                      {Number(c.revenue_generated).toLocaleString()} ر.س
                    </Table.Cell>
                    <Table.Cell>
                      <Badge color={c.status === "active" ? "green" : "grey"}>
                        {c.status === "active" ? "نشطة" : c.status}
                      </Badge>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </div>
        </Container>

        {/* Quick Launch Form (1 col) */}
        <Container className="p-6">
          <Heading level="h2" className="text-base font-bold text-ui-fg-base mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5 text-purple-600" />
            إضافة مسودة حملة
          </Heading>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-ui-fg-subtle block mb-1">اسم الحملة</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="مثال: خصم 20% على باقات الروايات المسموعة"
                required
              />
            </div>
            <div>
              <label className="text-xs font-medium text-ui-fg-subtle block mb-1">قناة الإرسال</label>
              <select
                className="w-full text-sm bg-ui-bg-base border border-ui-border-base rounded-md p-2"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="email">بريد إلكتروني ذكي (Email)</option>
                <option value="whatsapp">واتساب أعمال مباشر (WhatsApp)</option>
                <option value="push">إشعارات ويب تفاعلية (Web Push)</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-ui-fg-subtle block mb-1">الشريحة المستهدفة</label>
              <select
                className="w-full text-sm bg-ui-bg-base border border-ui-border-base rounded-md p-2"
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
              >
                <option value="All Registered Customers (KSA & UAE)">جميع القراء المسجلين (السعودية والإمارات)</option>
                <option value="VIP Readers & Subscribers">كبار القراء وأصحاب الاشتراكات VIP</option>
                <option value="Audiobook Listeners">عشاق الروايات الصوتية والمسموعة</option>
                <option value="Dormant Customers (30+ days)">العملاء المنقطعون (أكثر من 30 يوماً)</option>
              </select>
            </div>
            <Button
              type="submit"
              variant="primary"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              disabled={isSubmitting || !name.trim()}
            >
              <Send className="w-4 h-4 ml-1.5" />
              {isSubmitting ? "جارٍ الحفظ…" : "حفظ مسودة الحملة"}
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
  label: "Campaigns",
})

export default CampaignsPage
