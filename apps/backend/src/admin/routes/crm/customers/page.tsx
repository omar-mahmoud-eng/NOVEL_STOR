import React, { useState } from "react"
import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Text, Badge, Button, Table, Input } from "@medusajs/ui"
import { Users, Search, Phone, Mail, BookOpen, Headphones, ShieldCheck, HeartHandshake } from "lucide-react"
import { SubNav } from "../../../components/sub-nav"

const crmTabs = [
  { label: "لوحة التحكم (Dashboard)", href: "/app/crm" },
  { label: "سجلات العملاء 360 (Customer 360)", href: "/app/crm/customers", active: true },
  { label: "شرائح وتصنيف الجمهور (Audience Segments)", href: "/app/crm/segments" },
]

const crmCustomers = [
  { id: "cust_tariq_01", name: "طارق بن منصور المنصور", email: "tariq.mansoor@example.com", phone: "+966 50 123 4567", city: "الرياض", tier: "VIP بلاتيني سنوي", format: "هجين (صوتي + ورقي فاخر)", ltv: "3,450 ر.س", orders: 12, churnRisk: "low", hours: 48.5 },
  { id: "cust_sarah_02", name: "د. سارة بنت عبد الله العتيبي", email: "dr.sarah.otb@example.com", phone: "+966 55 987 6543", city: "جدة", tier: "VIP ذهبي سنوي", format: "روايات صوتية حصرية", ltv: "2,890 ر.س", orders: 9, churnRisk: "low", hours: 82.0 },
  { id: "cust_omar_03", name: "عمر الهاشمي", email: "omar.hashemi@example.com", phone: "+971 50 444 8899", city: "دبي", tier: "باقة العائلة واليافعين", format: "ورقي + قصص أطفال", ltv: "1,120 ر.س", orders: 5, churnRisk: "medium", hours: 12.0 },
  { id: "cust_fatima_04", name: "فاطمة الزهراء البلوشي", email: "fatima.balushi@example.com", phone: "+968 91 234 567", city: "مسقط", tier: "VIP بلاتيني سنوي", format: "هجين (صوتي + ورقي)", ltv: "4,150 ر.س", orders: 15, churnRisk: "low", hours: 114.0 },
  { id: "cust_khalid_05", name: "خالد بن سلطان", email: "khalid.sultan@example.com", phone: "+966 56 333 4455", city: "المدينة المنورة", tier: "قارئ إلكتروني متقطع", format: "كتب إلكترونية EPUB", ltv: "180 ر.س", orders: 2, churnRisk: "high", hours: 1.5 },
]

const Customer360Page = () => {
  const [search, setSearch] = useState("")

  const filtered = crmCustomers.filter(
    (c) =>
      c.name.includes(search) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.city.includes(search)
  )

  return (
    <div className="space-y-6">
      <SubNav
        parentTitle="Reader CRM 360°"
        currentTitle="Customer 360° Directory & Profiles"
        description="سجل ملفات القراء الفردية، إحصاءات ساعات الاستماع الصوتية، تكرار الشراء، وتاريخ التواصل"
        icon={Users}
        tabs={crmTabs}
      />

      {/* Search Bar */}
      <div className="max-w-md">
        <Input
          placeholder="ابحث بالاسم، البريد أو المدينة..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Customers Table */}
      <Container className="p-0 overflow-hidden">
        <div className="p-4 border-b border-ui-border-base flex items-center justify-between">
          <div>
            <Heading level="h2" className="text-base font-bold text-ui-fg-base">
              دليل القراء والعملاء المعتمدين ({filtered.length})
            </Heading>
            <Text className="text-xs text-ui-fg-subtle">
              بيانات القياس عن بُعد (Telemetry) وسلوك القراءة لكل عميل
            </Text>
          </div>
          <Badge color="purple">360 Unified Profile</Badge>
        </div>

        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>القارئ</Table.HeaderCell>
              <Table.HeaderCell>فئة العضوية (Tier)</Table.HeaderCell>
              <Table.HeaderCell>النمط المفضل</Table.HeaderCell>
              <Table.HeaderCell>ساعات الاستماع</Table.HeaderCell>
              <Table.HeaderCell>القيمة الدائمة (LTV)</Table.HeaderCell>
              <Table.HeaderCell>مخاطر المغادرة</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {filtered.map((c) => (
              <Table.Row key={c.id}>
                <Table.Cell>
                  <div className="font-bold text-xs text-ui-fg-base">{c.name}</div>
                  <div className="text-[11px] text-ui-fg-subtle">{c.email} • {c.city}</div>
                </Table.Cell>
                <Table.Cell>
                  <Badge color={c.tier.includes("بلاتيني") ? "purple" : c.tier.includes("ذهبي") ? "orange" : "blue"}>
                    {c.tier}
                  </Badge>
                </Table.Cell>
                <Table.Cell className="text-xs font-medium text-ui-fg-subtle">{c.format}</Table.Cell>
                <Table.Cell className="text-xs font-bold text-ui-fg-base">{c.hours} ساعة</Table.Cell>
                <Table.Cell className="font-black text-xs text-emerald-600">{c.ltv}</Table.Cell>
                <Table.Cell>
                  <Badge color={c.churnRisk === "low" ? "green" : c.churnRisk === "medium" ? "orange" : "red"}>
                    {c.churnRisk === "low" ? "منخفضة (آمن)" : c.churnRisk === "medium" ? "متوسطة" : "عالية الخطر"}
                  </Badge>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Container>
    </div>
  )
}

export const config = defineRouteConfig({
  label: "Customer 360",
})

export default Customer360Page
