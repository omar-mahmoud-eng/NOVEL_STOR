import React, { useState } from "react"
import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Text, Badge, Button, Table } from "@medusajs/ui"
import { Truck, Clock, ShieldCheck, CheckCircle2, AlertTriangle, ArrowUpRight } from "lucide-react"
import { SubNav } from "../../../components/sub-nav"

const analyticsTabs = [
  { label: "لوحة التحكم (Dashboard)", href: "/app/analytics" },
  { label: "المؤشرات المالية واقتصاديات الوحدة (Unit Economics)", href: "/app/analytics/unit-economics" },
  { label: "لوجستيات الشحن والناقلين (Carrier SLA)", href: "/app/analytics/shipments", active: true },
]

const carriers = [
  { name: "Aramex Express", onTimeRate: "98.2%", avgDeliveryDays: "2.1 يوم", totalShipments: 1420, exceptionsCount: 4, badgeColor: "red" as const },
  { name: "DHL Express", onTimeRate: "99.4%", avgDeliveryDays: "1.4 يوم", totalShipments: 890, exceptionsCount: 1, badgeColor: "orange" as const },
  { name: "SMSA Express", onTimeRate: "97.6%", avgDeliveryDays: "2.6 يوم", totalShipments: 1150, exceptionsCount: 8, badgeColor: "blue" as const },
  { name: "SPL (البريد السعودي)", onTimeRate: "96.1%", avgDeliveryDays: "3.2 يوم", totalShipments: 620, exceptionsCount: 6, badgeColor: "green" as const },
]

const recentShipments = [
  { id: "SHP-9081", order: "ord_01HXYZ123456", customer: "طارق المنصور", dest: "الرياض، السعودية", carrier: "Aramex", tracking: "ARX-9823412SA", status: "delivered", sla: "مبكر بـ 6 ساعات" },
  { id: "SHP-9082", order: "ord_01HXYZ789012", customer: "فاطمة الزهراء", dest: "دبي، الإمارات", carrier: "DHL", tracking: "DHL-4421908AE", status: "delivered", sla: "في الموعد المحدد" },
  { id: "SHP-9083", order: "ord_01HXYZ345678", customer: "عمر الهاشمي", dest: "جدة، السعودية", carrier: "SMSA", tracking: "SMSA-1120938SA", status: "in_transit", sla: "المتوقع غداً 2:00 م" },
  { id: "SHP-9084", order: "ord_01HXYZ901234", customer: "سارة العبدالله", dest: "الدوحة، قطر", carrier: "DHL", tracking: "DHL-8871290QA", status: "delivered", sla: "مبكر بيوم" },
  { id: "SHP-9085", order: "ord_01HXYZ567890", customer: "خالد بن فيصل", dest: "الدمام، السعودية", carrier: "Aramex", tracking: "ARX-5519283SA", status: "in_transit", sla: "في الموعد المحدد" },
]

const CarrierSlaPage = () => {
  return (
    <div className="space-y-6">
      <SubNav
        parentTitle="Financial & Logistics Analytics"
        currentTitle="Carrier Logistics & SLA Intelligence"
        description="متابعة دقة مواعيد شركات الشحن (Aramex, DHL, SMSA, SPL) والالتزام باتفاقيات مستوى الخدمة SLA"
        icon={Truck}
        tabs={analyticsTabs}
      />

      {/* Carrier Performance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {carriers.map((c, i) => (
          <Container key={i} className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Badge color={c.badgeColor}>{c.name}</Badge>
              <span className="text-xs font-bold text-emerald-600">{c.onTimeRate} SLA</span>
            </div>
            <div className="text-xl font-black text-ui-fg-base mb-1">{c.avgDeliveryDays}</div>
            <div className="text-xs text-ui-fg-subtle">متوسط وقت التوصيل حتى باب العميل</div>
            <div className="mt-3 pt-2 border-t border-ui-border-base flex items-center justify-between text-[11px] text-ui-fg-muted">
              <span>{c.totalShipments} شحنة منفذة</span>
              <span className="text-red-600">{c.exceptionsCount} استثناءات</span>
            </div>
          </Container>
        ))}
      </div>

      {/* Shipments SLA Table */}
      <Container className="p-0 overflow-hidden">
        <div className="p-4 border-b border-ui-border-base flex items-center justify-between">
          <div>
            <Heading level="h2" className="text-base font-bold text-ui-fg-base">
              تتبع الشحنات الحية والالتزام بموعد التسليم
            </Heading>
            <Text className="text-xs text-ui-fg-subtle">
              رصد حي لبوالص الشحن عبر الخليج وتوثيق سرعة الإنجاز
            </Text>
          </div>
          <Badge color="green">Live Logistics Feed</Badge>
        </div>

        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>رقم الشحنة</Table.HeaderCell>
              <Table.HeaderCell>العميل والوجهة</Table.HeaderCell>
              <Table.HeaderCell>شركة الشحن</Table.HeaderCell>
              <Table.HeaderCell>رقم البوليصة (Tracking)</Table.HeaderCell>
              <Table.HeaderCell>حالة التوصيل</Table.HeaderCell>
              <Table.HeaderCell>أداء الـ SLA</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {recentShipments.map((s) => (
              <Table.Row key={s.id}>
                <Table.Cell className="font-mono text-xs font-bold text-ui-fg-base">{s.id}</Table.Cell>
                <Table.Cell>
                  <div className="font-semibold text-xs text-ui-fg-base">{s.customer}</div>
                  <div className="text-[11px] text-ui-fg-subtle">{s.dest}</div>
                </Table.Cell>
                <Table.Cell className="text-xs font-semibold">{s.carrier}</Table.Cell>
                <Table.Cell>
                  <span className="font-mono text-xs bg-ui-bg-subtle px-2 py-0.5 rounded font-bold">
                    {s.tracking}
                  </span>
                </Table.Cell>
                <Table.Cell>
                  <Badge color={s.status === "delivered" ? "green" : "blue"}>
                    {s.status === "delivered" ? "تم التسليم بنجاح" : "في الطريق للعميل"}
                  </Badge>
                </Table.Cell>
                <Table.Cell className="text-xs font-semibold text-emerald-600">
                  {s.sla}
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
  label: "Carrier SLA",
})

export default CarrierSlaPage
