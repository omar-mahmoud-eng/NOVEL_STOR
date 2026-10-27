import {adminFetch} from "../../../lib/admin-fetch"
import React, { useState, useEffect } from "react"
import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Text, Badge, Button, Table, Input } from "@medusajs/ui"
import {
  Users,
  Plus,
  CheckCircle2,
  Filter,
  Sparkles,
  Send,
  ArrowRight,
  TrendingUp,
  Layers,
  Zap,
} from "lucide-react"
import { SubNav } from "../../../components/sub-nav"

const crmTabs = [
  { label: "لوحة التحكم (Dashboard)", href: "/app/crm" },
  { label: "سجلات العملاء 360 (Customer 360)", href: "/app/crm/customers" },
  { label: "شرائح وتصنيف الجمهور (Audience Segments)", href: "/app/crm/segments", active: true },
]

const AudienceSegmentsPage = () => {
  const [segments, setSegments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState("")
  const [criteria, setCriteria] = useState("")
  const [description, setDescription] = useState("")
  const [destination, setDestination] = useState("غير مربوط")
  const [feedback, setFeedback] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const fetchSegments = async () => {
    setLoading(true)
    try {
      const res = await adminFetch("/admin/crm")
      if (res.ok) {
        const json = await res.json()
        setSegments(json.segments || [])
      }
    } catch (err) {
      console.error("[Fetch segments error]", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSegments()
  }, [])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !criteria) return

    setIsSubmitting(true)
    try {
      const res = await adminFetch("/admin/crm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create_segment",
          name,
          description,
          rule_criteria: criteria,
          sync_destination: destination,
        }),
      })

      if (res.ok) {
        setName("")
        setCriteria("")
        setDescription("")
        setFeedback("تم إنشاء شريحة الجمهور وحفظها في قاعدة البيانات بنجاح!")
        setTimeout(() => setFeedback(""), 4000)
        await fetchSegments()
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleTriggerCampaign = (segName: string) => {
    window.location.assign("/app/marketing/campaigns?audience="+encodeURIComponent(segName))
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6" dir="rtl">
      <SubNav
        parentTitle="Reader CRM 360°"
        currentTitle="شرائح وتصنيف الجمهور السلوكية الديناميكية | Dynamic Audience Segments"
        description="تعريف شرائح الجمهور وحفظ وصفها؛ ربط التنفيذ بمزود تسويق لم يُفعّل."
        icon={Filter}
        tabs={crmTabs}
        onRefresh={fetchSegments}
        isLoading={loading}
      />

      {/* Alert */}
      {feedback && (
        <div className="p-3.5 rounded-xl bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span className="font-medium">{feedback}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Segments List */}
        <Container className="lg:col-span-2 p-0 overflow-hidden bg-ui-bg-base border border-ui-border-base shadow-xs">
          <div className="p-4 border-b border-ui-border-base flex items-center justify-between bg-ui-bg-subtle/50">
            <div>
              <Heading level="h2" className="text-sm font-bold text-ui-fg-base">
                الشرائح السلوكية النشطة ({segments.length})
              </Heading>
              <Text className="text-xs text-ui-fg-subtle">
                تُحدث هذه الشرائح تلقائياً في قاعدة بيانات PostgreSQL بناءً على سلوك القارئ
              </Text>
            </div>
            <Badge color="purple" className="text-xs">
              Dynamic Audiences
            </Badge>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs border-collapse">
              <thead className="bg-ui-bg-subtle border-b border-ui-border-base text-ui-fg-muted font-bold">
                <tr>
                  <th className="py-3 px-4 text-right">اسم الشريحة</th>
                  <th className="py-3 px-4 text-right">عدد الأعضاء</th>
                  <th className="py-3 px-4 text-right">معايير التصفية</th>
                  <th className="py-3 px-4 text-right">وجهة المزامنة</th>
                  <th className="py-3 px-4 text-left">إجراء الحملة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ui-border-base">
                {segments.map((seg: any) => (
                  <tr key={seg.id} className="hover:bg-ui-bg-subtle-hover transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-xs text-ui-fg-base">{seg.name}</div>
                      {seg.description && (
                        <div className="text-[11px] text-ui-fg-muted mt-0.5">{seg.description}</div>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-black text-xs text-purple-700">
                      {seg.customer_count || 0} قارئ
                    </td>
                    <td className="py-3.5 px-4 text-xs text-ui-fg-subtle font-mono text-[11px]">
                      {seg.rule_criteria}
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge color="blue" className="text-[10px]">
                        {seg.sync_destination}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-left">
                      <Button
                        size="small"
                        variant="secondary"
                        onClick={() => handleTriggerCampaign(seg.name)}
                        className="text-xs h-7 gap-1"
                      >
                        <Zap className="w-3 h-3 text-amber-500" />
                        <span>إطلاق حملة</span>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Container>

        {/* Add Segment Form */}
        <Container className="p-5 h-fit bg-ui-bg-base border border-ui-border-base shadow-xs">
          <Heading level="h2" className="text-base font-bold text-ui-fg-base mb-1">
            إنشاء تعريف شريحة جديدة
          </Heading>
          <Text className="text-xs text-ui-fg-subtle mb-4">
            حفظ وصف الجمهور وقواعده المقترحة. التنفيذ والمزامنة يحتاجان ربط مزود؛ لا تُرسل رسائل من هنا.
          </Text>

          <form onSubmit={handleCreate} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-ui-fg-base">اسم الشريحة</label>
              <Input
                placeholder="مثال: رواد الروايات الصوتية الغامرة"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="text-xs"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-ui-fg-base">الوصف الموجز</label>
              <Input
                placeholder="مثال: استماع يفوق 20 ساعة أسبوعياً"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-ui-fg-base">قاعدة التصفية (Rule Query)</label>
              <Input
                placeholder="مثال: audio_hours > 30 & preferred_format = 'audiobook'"
                value={criteria}
                onChange={(e) => setCriteria(e.target.value)}
                className="text-xs font-mono"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-ui-fg-base">وجهة المزامنة التلقائية</label>
              <select
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full h-8 px-2 text-xs rounded-lg border border-ui-border-base bg-ui-bg-field text-ui-fg-base"
              >
                <option value="غير مربوط">غير مربوط بمزود</option>
                <option value="Klaviyo VIP & Meta Custom Audiences">Klaviyo VIP & Meta Custom Audiences</option>
                <option value="WhatsApp Broadcast Channel">WhatsApp Broadcast Channel</option>
                <option value="Audio Drip Email Sequence">Audio Drip Email Sequence</option>
                <option value="Direct Aramex VIP Box Dispatch">Direct Aramex VIP Box Dispatch</option>
              </select>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 text-xs gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isSubmitting ? "جارِ الحفظ..." : "حفظ تعريف الشريحة"}</span>
            </Button>
          </form>
        </Container>
      </div>
    </div>
  )
}

export const config = defineRouteConfig({
  label: "شرائح وتصنيف الجمهور",
})

export default AudienceSegmentsPage
