import React, { useState } from "react"
import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Text, Badge, Button, Table } from "@medusajs/ui"
import { DollarSign, TrendingUp, Percent, Wallet, ArrowUpRight, CheckCircle2, Users } from "lucide-react"
import { SubNav } from "../../../components/sub-nav"

const analyticsTabs = [
  { label: "لوحة التحكم (Dashboard)", href: "/app/analytics" },
  { label: "المؤشرات المالية واقتصاديات الوحدة (Unit Economics)", href: "/app/analytics/unit-economics", active: true },
  { label: "لوجستيات الشحن والناقلين (Carrier SLA)", href: "/app/analytics/shipments" },
]

const cohorts = [
  { cohort: "يناير 2026", customers: 1240, m1: "100%", m2: "42%", m3: "35%", m6: "28%", ltv: "$184.50" },
  { cohort: "فبراير 2026", customers: 1480, m1: "100%", m2: "46%", m3: "38%", m6: "31%", ltv: "$198.20" },
  { cohort: "مارس 2026", customers: 1820, m1: "100%", m2: "49%", m3: "41%", m6: "-", ltv: "$210.00" },
  { cohort: "أبريل 2026", customers: 2150, m1: "100%", m2: "52%", m3: "-", m6: "-", ltv: "$225.80" },
]

const novelEconomics = [
  { title: "ملحمة الصحراء الكبرى (Hardcover)", retailPrice: "$34.00", printCost: "$8.50", shippingCost: "$4.20", authorRoyalty: "$5.10", netMargin: "$16.20 (47.6%)" },
  { title: "أصداء الأندلس المفقودة (Audiobook)", retailPrice: "$18.00", printCost: "$0.00", shippingCost: "$0.00", authorRoyalty: "$3.24", netMargin: "$14.76 (82.0%)" },
  { title: "ظلال في مهب الريح (Deluxe Box)", retailPrice: "$65.00", printCost: "$16.00", shippingCost: "$6.50", authorRoyalty: "$9.75", netMargin: "$32.75 (50.3%)" },
  { title: "حكايات قبل النوم للأطفال (Hardcover)", retailPrice: "$22.00", printCost: "$5.50", shippingCost: "$3.80", authorRoyalty: "$3.30", netMargin: "$9.40 (42.7%)" },
]

const UnitEconomicsPage = () => {
  return (
    <div className="space-y-6">
      <SubNav
        parentTitle="Financial & Logistics Analytics"
        currentTitle="Unit Economics & Cohort Retention"
        description="تحليل اقتصادات الوحدة على مستوى كل رواية، نسب LTV إلى CAC، وفترات استرداد التكلفة وجداول احتفاظ الأفواج"
        icon={TrendingUp}
        tabs={analyticsTabs}
      />

      {/* High-Level Ratios */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Container className="p-4 border-l-4 border-l-emerald-600">
          <div className="text-xs text-ui-fg-subtle font-medium">نسبة LTV إلى CAC (LTV:CAC Ratio)</div>
          <div className="text-2xl font-black text-emerald-600 mt-1">4.2 : 1</div>
          <div className="text-[11px] text-ui-fg-muted mt-1">المعيار الذهبي الممتاز ({`>`} 3.0)</div>
        </Container>

        <Container className="p-4 border-l-4 border-l-blue-600">
          <div className="text-xs text-ui-fg-subtle font-medium">تكلفة الاستحواذ على العميل (CAC)</div>
          <div className="text-2xl font-black text-blue-600 mt-1">$48.20</div>
          <div className="text-[11px] text-ui-fg-muted mt-1">بما يشمل حملات Meta و Google</div>
        </Container>

        <Container className="p-4 border-l-4 border-l-purple-600">
          <div className="text-xs text-ui-fg-subtle font-medium">فترة استرداد التكلفة (CAC Payback)</div>
          <div className="text-2xl font-black text-purple-600 mt-1">2.4 شهر</div>
          <div className="text-[11px] text-ui-fg-muted mt-1">استرداد كامل للتسويق في الطلب الثاني</div>
        </Container>

        <Container className="p-4 border-l-4 border-l-amber-600">
          <div className="text-xs text-ui-fg-subtle font-medium">متوسط هامش المساهمة الصافي</div>
          <div className="text-2xl font-black text-amber-600 mt-1">62.8%</div>
          <div className="text-[11px] text-ui-fg-muted mt-1">مدعوم بهامش الكتب الصوتية (82%)</div>
        </Container>
      </div>

      {/* Cohort Retention Table */}
      <Container className="p-0 overflow-hidden">
        <div className="p-4 border-b border-ui-border-base flex items-center justify-between">
          <div>
            <Heading level="h2" className="text-base font-bold text-ui-fg-base">
              تحليل أفواج العملاء ونسب الاحتفاظ (Cohort Retention Matrix)
            </Heading>
            <Text className="text-xs text-ui-fg-subtle">
              متابعة تكرار الشراء عبر الأشهر من تاريخ أول طلب
            </Text>
          </div>
          <Badge color="purple">30/60/90 Days Retention</Badge>
        </div>

        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>فوج الشراء (Cohort)</Table.HeaderCell>
              <Table.HeaderCell>العملاء الجدد</Table.HeaderCell>
              <Table.HeaderCell>الشهر 1</Table.HeaderCell>
              <Table.HeaderCell>الشهر 2</Table.HeaderCell>
              <Table.HeaderCell>الشهر 3</Table.HeaderCell>
              <Table.HeaderCell>الشهر 6</Table.HeaderCell>
              <Table.HeaderCell>القيمة الدائمة المتوقعة (LTV)</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {cohorts.map((c, i) => (
              <Table.Row key={i}>
                <Table.Cell className="font-semibold text-xs text-ui-fg-base">{c.cohort}</Table.Cell>
                <Table.Cell className="font-bold text-xs">{c.customers.toLocaleString()}</Table.Cell>
                <Table.Cell className="text-xs font-semibold bg-emerald-50 text-emerald-800">{c.m1}</Table.Cell>
                <Table.Cell className="text-xs font-semibold bg-emerald-50/70 text-emerald-800">{c.m2}</Table.Cell>
                <Table.Cell className="text-xs font-semibold bg-emerald-50/40 text-emerald-800">{c.m3}</Table.Cell>
                <Table.Cell className="text-xs font-semibold text-ui-fg-subtle">{c.m6}</Table.Cell>
                <Table.Cell className="font-black text-xs text-emerald-600">{c.ltv}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Container>

      {/* Unit Economics by Novel */}
      <Container className="p-0 overflow-hidden">
        <div className="p-4 border-b border-ui-border-base flex items-center justify-between">
          <div>
            <Heading level="h2" className="text-base font-bold text-ui-fg-base">
              اقتصاديات الوحدة لكل رواية (Unit Margin Breakdown)
            </Heading>
            <Text className="text-xs text-ui-fg-subtle">
              سعر البيع، تكلفة الطباعة والتغليف (COGS)، الشحن، عمولة المؤلف والربح الصافي
            </Text>
          </div>
          <Badge color="green">Unit Profitability</Badge>
        </div>

        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>الرواية والتنسيق</Table.HeaderCell>
              <Table.HeaderCell>سعر التجزئة</Table.HeaderCell>
              <Table.HeaderCell>تكلفة الطباعة / التجهيز</Table.HeaderCell>
              <Table.HeaderCell>تكلفة الشحن اللوجستي</Table.HeaderCell>
              <Table.HeaderCell>حقوق المؤلف (Royalty)</Table.HeaderCell>
              <Table.HeaderCell>صافي الهامش المساهم</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {novelEconomics.map((n, i) => (
              <Table.Row key={i}>
                <Table.Cell className="font-semibold text-xs text-ui-fg-base">{n.title}</Table.Cell>
                <Table.Cell className="font-bold text-xs">{n.retailPrice}</Table.Cell>
                <Table.Cell className="text-xs text-ui-fg-subtle">{n.printCost}</Table.Cell>
                <Table.Cell className="text-xs text-ui-fg-subtle">{n.shippingCost}</Table.Cell>
                <Table.Cell className="text-xs text-ui-fg-subtle">{n.authorRoyalty}</Table.Cell>
                <Table.Cell className="font-black text-xs text-emerald-600">{n.netMargin}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Container>
    </div>
  )
}

export const config = defineRouteConfig({
  label: "Unit Economics",
})

export default UnitEconomicsPage
