import React, { useState } from "react"
import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Text, Badge, Button } from "@medusajs/ui"
import {
  BarChart3,
  TrendingUp,
  PackageCheck,
  Clock,
  Truck,
  ArrowUpRight,
  ShieldCheck,
  RefreshCw,
  Globe2,
  DollarSign,
  PieChart,
  Percent,
  Wallet,
} from "lucide-react"
import { SubNav } from "../../components/sub-nav"

const analyticsTabs = [
  { label: "لوحة التحكم (Dashboard)", href: "/app/analytics", active: true },
  { label: "المؤشرات المالية واقتصاديات الوحدة (Unit Economics)", href: "/app/analytics/unit-economics" },
  { label: "لوجستيات الشحن والناقلين (Carrier SLA)", href: "/app/analytics/shipments" },
]

const mockShipments = [
  {
    id: "ord_01HXYZ123456",
    customer: "Tariq Al-Mansoor",
    destination: "Riyadh, Saudi Arabia",
    carrier: "Aramex Express",
    tracking: "ARX-9823412SA",
    status: "in_transit",
    itemsCount: 3,
    total: "SAR 1,450.00",
    created: "2026-10-25 07:15",
  },
  {
    id: "ord_01HXYZ789012",
    customer: "Fatima Al-Zahra",
    destination: "Dubai, United Arab Emirates",
    carrier: "DHL Express",
    tracking: "DHL-4421908AE",
    status: "delivered",
    itemsCount: 1,
    total: "AED 890.00",
    created: "2026-10-24 14:30",
  },
  {
    id: "ord_01HXYZ345678",
    customer: "Omar Al-Hashemi",
    destination: "Jeddah, Saudi Arabia",
    carrier: "SMSA Express",
    tracking: "SMSA-1120938SA",
    status: "processing",
    itemsCount: 2,
    total: "SAR 620.00",
    created: "2026-10-25 06:45",
  },
  {
    id: "ord_01HXYZ901234",
    customer: "Sarah Jenkins",
    destination: "London, United Kingdom",
    carrier: "FedEx International",
    tracking: "FDX-7731244GB",
    status: "in_transit",
    itemsCount: 4,
    total: "USD 540.00",
    created: "2026-10-24 19:10",
  },
]

const AnalyticsPage = () => {
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => setIsRefreshing(false), 800)
  }

  return (
    <div className="space-y-6">
      <SubNav
        parentTitle="Financial & Logistics Analytics"
        currentTitle="Executive Financial & SLA Dashboard"
        description="بديل مدمج أصيل لـ (QuickBooks & Baremetrics & ShipStation) لمتابعة هوامش الربح الصافي وتكاليف الاستحواذ وسرعة الشحن"
        icon={BarChart3}
        tabs={analyticsTabs}
        onRefresh={handleRefresh}
        isLoading={isRefreshing}
      />

      {/* Financial & Unit Economics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Container className="p-5 border-l-4 border-l-emerald-600">
          <div className="flex items-center justify-between">
            <Text className="text-xs font-bold text-ui-fg-subtle">
              إجمالي الإيرادات (Gross Revenue)
            </Text>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-ui-fg-base">342,850 ر.س</span>
            <span className="text-xs font-bold text-emerald-600 flex items-center">
              +18.4% <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
          <Text className="text-xs text-ui-fg-subtle mt-1">عبر العمليات المعتمدة المباشرة</Text>
        </Container>

        <Container className="p-5 border-l-4 border-l-blue-600">
          <div className="flex items-center justify-between">
            <Text className="text-xs font-bold text-ui-fg-subtle">
              هامش الربح الإجمالي (Gross Margin)
            </Text>
            <Percent className="w-4 h-4 text-blue-600" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-blue-700">68.5%</span>
            <span className="text-xs font-bold text-green-600 flex items-center">
              +2.1% <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
          <Text className="text-xs text-ui-fg-subtle mt-1">بعد خصم تكاليف الطباعة والتخزين (COGS)</Text>
        </Container>

        <Container className="p-5 border-l-4 border-l-purple-600">
          <div className="flex items-center justify-between">
            <Text className="text-xs font-bold text-ui-fg-subtle">
              القيمة الدائمة للعميل (LTV)
            </Text>
            <Wallet className="w-4 h-4 text-purple-600" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-purple-700">1,280 ر.س</span>
            <span className="text-xs text-ui-fg-subtle font-medium">/ قارئ</span>
          </div>
          <Text className="text-xs text-ui-fg-subtle mt-1">معدل تكرار الشراء 3.4 طلبات/سنة</Text>
        </Container>

        <Container className="p-5 border-l-4 border-l-amber-500">
          <div className="flex items-center justify-between">
            <Text className="text-xs font-bold text-ui-fg-subtle">
              تكلفة الاستحواذ المدمجة (Blended CAC)
            </Text>
            <PieChart className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-amber-700">42.50 ر.س</span>
            <span className="text-xs text-green-600 font-bold">-8.5% توفير</span>
          </div>
          <Text className="text-xs text-ui-fg-subtle mt-1">نسبة LTV / CAC = 30.1x (ممتازة جداً)</Text>
        </Container>
      </div>

      {/* Fulfillment & Logistics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Container className="p-5 border-l-4 border-l-teal-500">
          <div className="flex items-center justify-between">
            <Text className="text-xs font-bold text-ui-fg-subtle">
              دقة الإنجاز والتنفيذ (Fulfillment Rate)
            </Text>
            <PackageCheck className="w-4 h-4 text-teal-600" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-ui-fg-base">99.2%</span>
            <span className="text-xs font-bold text-green-600">+0.8%</span>
          </div>
          <Text className="text-xs text-ui-fg-subtle mt-1">1,240 طلباً بدون أي نفاد للمخزون</Text>
        </Container>

        <Container className="p-5 border-l-4 border-l-indigo-500">
          <div className="flex items-center justify-between">
            <Text className="text-xs font-bold text-ui-fg-subtle">
              متوسط وقت التجهيز (Dispatch Time)
            </Text>
            <Clock className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-indigo-700">4.2 ساعات</span>
          </div>
          <Text className="text-xs text-ui-fg-subtle mt-1">من اعتماد الطلب حتى التسليم للناقل</Text>
        </Container>

        <Container className="p-5 border-l-4 border-l-sky-500">
          <div className="flex items-center justify-between">
            <Text className="text-xs font-bold text-ui-fg-subtle">
              شحنات قيد التوصيل (In Transit)
            </Text>
            <Truck className="w-4 h-4 text-sky-600" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-sky-700">148 طرد</span>
          </div>
          <Text className="text-xs text-ui-fg-subtle mt-1">عبر أرامكس وسمسا وDHL</Text>
        </Container>

        <Container className="p-5 border-l-4 border-l-rose-500">
          <div className="flex items-center justify-between">
            <Text className="text-xs font-bold text-ui-fg-subtle">
              متوسط قيمة السلة (AOV)
            </Text>
            <TrendingUp className="w-4 h-4 text-rose-600" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-rose-700">276.50 ر.س</span>
          </div>
          <Text className="text-xs text-ui-fg-subtle mt-1">+14% بفضل الحزم والاشتراكات</Text>
        </Container>
      </div>

      {/* Regional Performance & Market Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Container className="p-6 lg:col-span-1 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Globe2 className="w-5 h-5 text-ui-fg-interactive" />
            <Heading level="h2" className="text-base font-semibold text-ui-fg-base">
              توزيع المبيعات الجغرافية
            </Heading>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="font-medium text-ui-fg-base">المملكة العربية السعودية (SAR)</span>
                <span className="font-bold text-ui-fg-base">64%</span>
              </div>
              <div className="w-full h-2 bg-ui-bg-subtle rounded-full overflow-hidden">
                <div className="h-full bg-emerald-600 rounded-full" style={{ width: "64%" }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="font-medium text-ui-fg-base">دولة الإمارات العربية المتحدة (AED)</span>
                <span className="font-bold text-ui-fg-base">22%</span>
              </div>
              <div className="w-full h-2 bg-ui-bg-subtle rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 rounded-full" style={{ width: "22%" }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="font-medium text-ui-fg-base">الكويت وقطر (KWD / QAR)</span>
                <span className="font-bold text-ui-fg-base">9%</span>
              </div>
              <div className="w-full h-2 bg-ui-bg-subtle rounded-full overflow-hidden">
                <div className="h-full bg-purple-600 rounded-full" style={{ width: "9%" }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="font-medium text-ui-fg-base">الدول العالمية (USD / EUR)</span>
                <span className="font-bold text-ui-fg-base">5%</span>
              </div>
              <div className="w-full h-2 bg-ui-bg-subtle rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: "5%" }} />
              </div>
            </div>
          </div>
        </Container>

        {/* Live Active Shipments Table */}
        <Container className="p-6 lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <Heading level="h2" className="text-base font-semibold text-ui-fg-base">
              تتبع الشحنات الحية عبر شركات التوصيل المعتمدة
            </Heading>
            <Badge color="blue">تحديث فوري</Badge>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-sm">
              <thead className="text-xs uppercase text-ui-fg-subtle border-b border-ui-border-base">
                <tr>
                  <th className="pb-3 font-semibold">رقم الطلب والعميل</th>
                  <th className="pb-3 font-semibold">الوجهة</th>
                  <th className="pb-3 font-semibold">شركة الشحن والتتبع</th>
                  <th className="pb-3 font-semibold">الحالة</th>
                  <th className="pb-3 font-semibold text-left">القيمة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ui-border-base">
                {mockShipments.map((shipment) => (
                  <tr key={shipment.id} className="hover:bg-ui-bg-subtle/50 transition-colors">
                    <td className="py-3 font-medium text-ui-fg-base">
                      {shipment.id.slice(-8).toUpperCase()}
                      <div className="text-xs text-ui-fg-subtle">{shipment.customer}</div>
                    </td>
                    <td className="py-3 text-ui-fg-subtle">{shipment.destination}</td>
                    <td className="py-3">
                      <div className="font-medium text-ui-fg-base">{shipment.carrier}</div>
                      <div className="font-mono text-xs text-ui-fg-subtle select-all">
                        {shipment.tracking}
                      </div>
                    </td>
                    <td className="py-3">
                      {shipment.status === "delivered" ? (
                        <Badge color="green">تم التسليم</Badge>
                      ) : shipment.status === "in_transit" ? (
                        <Badge color="blue">في الطريق</Badge>
                      ) : (
                        <Badge color="grey">قيد التجهيز</Badge>
                      )}
                    </td>
                    <td className="py-3 text-left font-bold text-ui-fg-base" dir="ltr">
                      {shipment.total}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Container>
      </div>
    </div>
  )
}

export const config = defineRouteConfig({
  label: "Financial & Logistics Analytics",
  icon: BarChart3,
})

export default AnalyticsPage
