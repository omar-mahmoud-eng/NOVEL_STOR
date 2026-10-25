import React, { useState } from "react"
import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Text, Badge, Button, Table, Input } from "@medusajs/ui"
import { Users, Plus, CheckCircle2, Filter, Sparkles, Send, ArrowRight } from "lucide-react"
import { SubNav } from "../../../components/sub-nav"

const crmTabs = [
  { label: "لوحة التحكم (Dashboard)", href: "/app/crm" },
  { label: "سجلات العملاء 360 (Customer 360)", href: "/app/crm/customers" },
  { label: "شرائح وتصنيف الجمهور (Audience Segments)", href: "/app/crm/segments", active: true },
]

const audienceSegments = [
  { id: "seg_1", name: "مشتركو الـ VIP عالي القيمة (Whales)", count: 480, criteria: "LTV > $500 & VIP Pass Active", syncDestination: "Klaviyo VIP & Meta Custom Audience", avgEngagement: "94%" },
  { id: "seg_2", name: "عشاق الكتب الصوتية الشغوفين (Power Listeners)", count: 920, criteria: "ساعات استماع > 30 ساعة شهرياً", syncDestination: "Audio Drip Campaign", avgEngagement: "88%" },
  { id: "seg_3", name: "المعرضون لخطر الانقطاع (At-Risk Churn)", count: 210, criteria: "لا يوجد نشاط > 25 يوماً & رصيد غير مستخدم", syncDestination: "Win-back Flow", avgEngagement: "32%" },
  { id: "seg_4", name: "مشترو الطبعات الورقية الفاخرة المجمعة", count: 640, criteria: "شراء مجموعات كاملة أو Hardcovers", syncDestination: "New Release Early Access", avgEngagement: "78%" },
]

const AudienceSegmentsPage = () => {
  const [segments, setSegments] = useState(audienceSegments)
  const [name, setName] = useState("")
  const [criteria, setCriteria] = useState("")
  const [feedback, setFeedback] = useState("")

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !criteria) return
    const newSeg = {
      id: `seg_${Date.now()}`,
      name,
      count: Math.floor(Math.random() * 200) + 50,
      criteria,
      syncDestination: "Automated Segment Sync",
      avgEngagement: "65%",
    }
    setSegments([...segments, newSeg])
    setName("")
    setCriteria("")
    setFeedback("تم إنشاء شريحة الجمهور الديناميكية وتفعيل المزامنة التلقائية بنجاح!")
    setTimeout(() => setFeedback(""), 3500)
  }

  return (
    <div className="space-y-6">
      <SubNav
        parentTitle="Reader CRM 360°"
        currentTitle="Dynamic Audience Segments"
        description="بناء شرائح الجمهور السلوكية، معايير التصفية التلقائية، والمزامنة المباشرة مع مسارات التسويق"
        icon={Filter}
        tabs={crmTabs}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Segments List */}
        <Container className="lg:col-span-2 p-0 overflow-hidden">
          <div className="p-4 border-b border-ui-border-base flex items-center justify-between">
            <div>
              <Heading level="h2" className="text-base font-bold text-ui-fg-base">
                الشرائح السلوكية النشطة ({segments.length})
              </Heading>
              <Text className="text-xs text-ui-fg-subtle">
                تحدث هذه الشرائح تلقائياً في الزمن الفعلي بناءً على سلوك القارئ
              </Text>
            </div>
            <Badge color="purple">Dynamic Audiences</Badge>
          </div>

          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>اسم الشريحة</Table.HeaderCell>
                <Table.HeaderCell>عدد الأعضاء</Table.HeaderCell>
                <Table.HeaderCell>معايير التصفية (Rule)</Table.HeaderCell>
                <Table.HeaderCell>وجهة المزامنة</Table.HeaderCell>
                <Table.HeaderCell>متوسط التفاعل</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {segments.map((seg) => (
                <Table.Row key={seg.id}>
                  <Table.Cell className="font-semibold text-xs text-ui-fg-base">{seg.name}</Table.Cell>
                  <Table.Cell className="font-bold text-xs text-purple-700">{seg.count} قارئ</Table.Cell>
                  <Table.Cell className="text-xs text-ui-fg-subtle">{seg.criteria}</Table.Cell>
                  <Table.Cell className="text-xs">
                    <Badge color="blue">{seg.syncDestination}</Badge>
                  </Table.Cell>
                  <Table.Cell className="font-bold text-xs text-emerald-600">{seg.avgEngagement}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </Container>

        {/* Add Segment Form */}
        <Container className="p-5 h-fit">
          <Heading level="h2" className="text-base font-bold text-ui-fg-base mb-1">
            إنشاء شريحة ديناميكية جديدة
          </Heading>
          <Text className="text-xs text-ui-fg-subtle mb-4">
            تحديد شروط استهداف القراء بناءً على مشترياتهم وسلوك الاستماع
          </Text>

          <form onSubmit={handleCreate} className="space-y-3.5">
            <div>
              <label className="text-xs font-semibold text-ui-fg-base block mb-1">
                اسم الشريحة
              </label>
              <Input
                placeholder="مثال: قراء روايات الخيال العلمي المعاصر"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-ui-fg-base block mb-1">
                معيار التصفية السلوكي
              </label>
              <Input
                placeholder="مثال: شراء روايتين من قسم الخيال العلمي + تقييم 5 نجوم"
                value={criteria}
                onChange={(e) => setCriteria(e.target.value)}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              disabled={!name || !criteria}
            >
              <Plus className="w-4 h-4 ml-1.5" />
              حفظ وتوليد الشريحة
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
  label: "Audience Segments",
})

export default AudienceSegmentsPage
