import {adminFetch} from "../../lib/admin-fetch"
import React, { useState, useEffect } from "react"
import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Text, Badge, Button, Table, Input } from "@medusajs/ui"
import {
  Package,
  Layers,
  ArrowRightLeft,
  Truck,
  Building2,
  RefreshCw,
  PlusCircle,
  CheckCircle,
  AlertCircle,
  ArrowDownLeft,
  ArrowUpRight,
  Sparkles,
} from "lucide-react"
import { SubNav } from "../../components/sub-nav"

const warehouseTabs = [
  { label: "لوحة التحكم (Dashboard)", href: "/app/warehouse", active: true },
  { label: "مواقع الأرفف والخانَات (Bins & Racks)", href: "/app/warehouse/bins" },
  { label: "حركات المخزون والتدقيق (Stock Audit)", href: "/app/warehouse/movements" },
]

const WarehousePage = () => {
  const [bins, setBins] = useState<any[]>([])
  const [movements, setMovements] = useState<any[]>([])
  const [summary, setSummary] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // Quick Movement State
  const [movementType, setMovementType] = useState("purchase_order")
  const [sku, setSku] = useState("NOVEL-DESERT-HC")
  const [quantity, setQuantity] = useState<number>(50)
  const [fromLoc, setFromLoc] = useState("المورد: مطابع الشرق الأوسط")
  const [toLoc, setToLoc] = useState("مستودع الرياض المركزي (RUH-01)")
  const [refNumber, setRefNumber] = useState("")
  const [reason, setReason] = useState("استلام دفعة طباعة فاخرة جديدة")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [feedbackMsg, setFeedbackMsg] = useState("")

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await adminFetch("/admin/warehouse")
      if (res.ok) {
        const data = await res.json()
        setBins(data.bins || [])
        setMovements(data.movements || [])
        setSummary(data.summary || null)
      }
    } catch (err) {
      console.error("Error fetching warehouse data:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleCreateMovement = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!sku || !quantity || !refNumber) return
    setIsSubmitting(true)
    try {
      const res = await adminFetch("/admin/warehouse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          movement_type: movementType,
          sku,
          quantity: Number(quantity),
          from_location: fromLoc,
          to_location: toLoc,
          reference_number: refNumber,
          reason,
        }),
      })
      if (res.ok) {
        setFeedbackMsg("تم حفظ حركة المخزون في سجل التدقيق.")
        setTimeout(() => setFeedbackMsg(""), 4000)
        setRefNumber("")
        fetchData()
      }
    } catch (err) {
      console.error("Error creating stock movement:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getMovementBadge = (type: string) => {
    switch (type) {
      case "purchase_order":
        return (
          <Badge color="green" className="flex items-center gap-1 font-semibold">
            <ArrowDownLeft className="w-3 h-3" /> استلام توريد (PO)
          </Badge>
        )
      case "order_pick":
        return (
          <Badge color="orange" className="flex items-center gap-1 font-semibold">
            <ArrowUpRight className="w-3 h-3" /> صرف طلب عميل (Pick)
          </Badge>
        )
      case "inter_transfer":
        return (
          <Badge color="blue" className="flex items-center gap-1 font-semibold">
            <ArrowRightLeft className="w-3 h-3" /> مناقلة بين المستودعات
          </Badge>
        )
      default:
        return <Badge color="grey">{type}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <SubNav
        parentTitle="Warehouse & WMS"
        currentTitle="Fulfillment & Inventory Overview"
        description="سجل الأرفف والمناقلات اليدوية؛ إدارة المخزون القابل للبيع متاحة من Inventory في ميدوسا"
        icon={Package}
        tabs={warehouseTabs}
        onRefresh={fetchData}
        isLoading={loading}
      />

      <Text className="text-sm text-ui-fg-subtle">الحركات تحفظ سجل تدقيق فقط. لتعديل مخزون البيع افتح <a className="underline" href="/app/inventory">مخزون Medusa</a>.</Text>
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Container className="p-5 border-l-4 border-l-orange-600">
          <div className="flex items-center justify-between">
            <Text className="text-sm font-medium text-ui-fg-subtle">إجمالي خانات وأرفف التخزين</Text>
            <Layers className="w-5 h-5 text-orange-600" />
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-ui-fg-base">
              {summary ? summary.total_bins : "0"}
            </span>
            <span className="text-sm text-ui-fg-subtle mr-2">خانة (Bin)</span>
          </div>
          <Text className="text-xs text-ui-fg-subtle mt-2">مرقمة وفق معايير WMS العالمية</Text>
        </Container>

        <Container className="p-5 border-l-4 border-l-blue-600">
          <div className="flex items-center justify-between">
            <Text className="text-sm font-medium text-ui-fg-subtle">إجمالي الكتب والوحدات المخزنة</Text>
            <Package className="w-5 h-5 text-blue-600" />
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-blue-600">
              {summary ? Number(summary.total_units_stored).toLocaleString() : "0"}
            </span>
            <span className="text-sm text-ui-fg-subtle mr-2">نسخة مطبوعة</span>
          </div>
          <Text className="text-xs text-ui-fg-subtle mt-2">
            من أصل سعة قصوى {summary ? Number(summary.total_warehouse_capacity).toLocaleString() : "0"} وحدة
          </Text>
        </Container>

        <Container className="p-5 border-l-4 border-l-green-600">
          <div className="flex items-center justify-between">
            <Text className="text-sm font-medium text-ui-fg-subtle">نسبة إشغال السعة التخزينية</Text>
            <Building2 className="w-5 h-5 text-green-600" />
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-green-700">
              {summary && Number(summary.total_warehouse_capacity) > 0
                ? Math.round(
                    (Number(summary.total_units_stored) /
                      Number(summary.total_warehouse_capacity)) *
                      100
                  )
                : 0}
              %
            </span>
          </div>
          <Text className="text-xs text-green-700 mt-2 font-medium">سعة تشغيلية مثالية ومستقرة</Text>
        </Container>

        <Container className="p-5 border-l-4 border-l-purple-600">
          <div className="flex items-center justify-between">
            <Text className="text-sm font-medium text-ui-fg-subtle">مراكز التوزيع الإقليمية</Text>
            <Truck className="w-5 h-5 text-purple-600" />
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-purple-600">
              {summary ? summary.active_warehouses : "2"}
            </span>
            <span className="text-sm text-ui-fg-subtle mr-2">مستودع رئيسي</span>
          </div>
          <Text className="text-xs text-ui-fg-subtle mt-2">الرياض (KSA) ودبي (UAE)</Text>
        </Container>
      </div>

      {/* Warehouse Bins & Movement Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bins Table */}
        <Container className="p-6 lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <Heading level="h2" className="text-lg font-semibold text-ui-fg-base">
              خريطة الأرفف وخانات التخزين بالمستودعات (Bin Locations)
            </Heading>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>كود الخانة / الرف</Table.HeaderCell>
                  <Table.HeaderCell>المستودع والمنطقة</Table.HeaderCell>
                  <Table.HeaderCell>الرمز المخزني (SKU)</Table.HeaderCell>
                  <Table.HeaderCell>الرصيد الفعلي</Table.HeaderCell>
                  <Table.HeaderCell>نسبة الامتلاء</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {bins.length === 0 ? (
                  <Table.Row>
                    <Table.Cell className="text-center py-6 text-ui-fg-subtle">
                      لا توجد بيانات خانات تخزين.
                    </Table.Cell>
                  </Table.Row>
                ) : (
                  bins.map((bin) => {
                    const pct = Math.min(
                      100,
                      Math.round((bin.current_quantity / bin.capacity) * 100)
                    )
                    return (
                      <Table.Row key={bin.id}>
                        <Table.Cell>
                          <code className="bg-orange-50 border border-orange-200 text-orange-800 font-bold px-2 py-0.5 rounded text-xs font-mono">
                            {bin.bin_code}
                          </code>
                        </Table.Cell>
                        <Table.Cell>
                          <div className="font-semibold text-sm text-ui-fg-base">{bin.location_name}</div>
                          <div className="text-xs text-ui-fg-subtle">{bin.zone}</div>
                        </Table.Cell>
                        <Table.Cell className="font-mono text-xs font-medium text-ui-fg-base">
                          {bin.sku || "فارغ (متاح)"}
                        </Table.Cell>
                        <Table.Cell>
                          <span className="font-bold text-sm text-ui-fg-base">
                            {bin.current_quantity}
                          </span>
                          <span className="text-xs text-ui-fg-subtle mr-1">/ {bin.capacity}</span>
                        </Table.Cell>
                        <Table.Cell className="w-36">
                          <div className="flex items-center gap-2">
                            <div className="w-full bg-ui-bg-subtle rounded-full h-2 overflow-hidden border border-ui-border-base">
                              <div
                                className={`h-full rounded-full ${
                                  pct > 80 ? "bg-amber-500" : pct > 50 ? "bg-green-500" : "bg-blue-500"
                                }`}
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                            <span className="text-xs font-semibold text-ui-fg-subtle">{pct}%</span>
                          </div>
                        </Table.Cell>
                      </Table.Row>
                    )
                  })
                )}
              </Table.Body>
            </Table>
          </div>
        </Container>

        {/* Quick Stock Movement Form */}
        <Container className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <PlusCircle className="w-5 h-5 text-orange-600" />
            <Heading level="h2" className="text-base font-semibold text-ui-fg-base">
              تسجيل حركة مخزنية جديدة
            </Heading>
          </div>
          <form onSubmit={handleCreateMovement} className="space-y-3">
            <div>
              <label className="text-xs font-medium text-ui-fg-subtle block mb-1">
                نوع الحركة المخزنية
              </label>
              <select
                className="w-full text-sm bg-ui-bg-base border border-ui-border-base rounded-md p-2"
                value={movementType}
                onChange={(e) => setMovementType(e.target.value)}
              >
                <option value="purchase_order">استلام توريد جديد (Inbound PO)</option>
                <option value="inter_transfer">مناقلة بين المستودعات (Transfer)</option>
                <option value="order_pick">صرف وتجهيز طلب (Outbound Pick)</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-ui-fg-subtle block mb-1">
                الرمز المخزني (SKU)
              </label>
              <Input
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="NOVEL-DESERT-HC"
                required
              />
            </div>
            <div>
              <label className="text-xs font-medium text-ui-fg-subtle block mb-1">
                الكمية (العدد)
              </label>
              <Input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                placeholder="50"
                required
              />
            </div>
            <div>
              <label className="text-xs font-medium text-ui-fg-subtle block mb-1">
                من موقع (From Location)
              </label>
              <Input
                value={fromLoc}
                onChange={(e) => setFromLoc(e.target.value)}
                placeholder="المورد أو الرف المصدر"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-ui-fg-subtle block mb-1">
                إلى موقع (To Location)
              </label>
              <Input
                value={toLoc}
                onChange={(e) => setToLoc(e.target.value)}
                placeholder="مستودع الرياض أو دبي"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-ui-fg-subtle block mb-1">
                رقم المستند المرجعي (PO / Order #)
              </label>
              <Input
                value={refNumber}
                onChange={(e) => setRefNumber(e.target.value)}
                placeholder="PO-2026-908"
                required
              />
            </div>
            <div>
              <label className="text-xs font-medium text-ui-fg-subtle block mb-1">
                سبب العملية وملاحظات
              </label>
              <Input
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="إعادة تعبئة مخزون الروايات الورقية"
              />
            </div>
            <Button
              type="submit"
              variant="primary"
              className="w-full bg-orange-600 hover:bg-orange-700 text-white mt-2"
              disabled={isSubmitting}
            >
              <Package className="w-4 h-4 ml-1.5" />
              {isSubmitting ? "جاري التحديث..." : "تنفيذ الحركة وتوثيقها"}
            </Button>
            {feedbackMsg && (
              <div className="p-2.5 bg-green-50 border border-green-200 text-green-800 text-xs rounded-md flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                {feedbackMsg}
              </div>
            )}
          </form>
        </Container>
      </div>

      {/* Live Audit Log of Stock Movements */}
      <Container className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <Heading level="h2" className="text-lg font-semibold text-ui-fg-base">
              سجل تدقيق حركات المخزون والمناقلات الحية (Audit Trail)
            </Heading>
            <Text className="text-xs text-ui-fg-subtle mt-1">
              توثيق آلي لكل استلام أو صرف أو نقل بين مستودعات الرياض ودبي لضمان دقة المخزون 100%
            </Text>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>نوع الحركة</Table.HeaderCell>
                <Table.HeaderCell>الرمز المخزني (SKU)</Table.HeaderCell>
                <Table.HeaderCell>الكمية</Table.HeaderCell>
                <Table.HeaderCell>من الموقع</Table.HeaderCell>
                <Table.HeaderCell>إلى الموقع</Table.HeaderCell>
                <Table.HeaderCell>رقم المستند المرجعي</Table.HeaderCell>
                <Table.HeaderCell>السبب والملاحظات</Table.HeaderCell>
                <Table.HeaderCell>الوقت والتاريخ</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {movements.length === 0 ? (
                <Table.Row>
                  <Table.Cell className="text-center py-6 text-ui-fg-subtle">
                    لا توجد حركات مخزنية مسجلة.
                  </Table.Cell>
                </Table.Row>
              ) : (
                movements.map((mov) => (
                  <Table.Row key={mov.id}>
                    <Table.Cell>{getMovementBadge(mov.movement_type)}</Table.Cell>
                    <Table.Cell className="font-mono text-xs font-bold text-ui-fg-base">
                      {mov.sku}
                    </Table.Cell>
                    <Table.Cell>
                      <span className="font-extrabold text-sm text-ui-fg-base">
                        {mov.quantity > 0 ? `+${mov.quantity}` : mov.quantity}
                      </span>
                    </Table.Cell>
                    <Table.Cell className="text-xs text-ui-fg-subtle">{mov.from_location}</Table.Cell>
                    <Table.Cell className="text-xs font-medium text-ui-fg-base">{mov.to_location}</Table.Cell>
                    <Table.Cell>
                      <code className="bg-ui-bg-subtle px-2 py-0.5 rounded text-xs font-mono font-semibold">
                        {mov.reference_number}
                      </code>
                    </Table.Cell>
                    <Table.Cell className="text-xs text-ui-fg-subtle">{mov.reason}</Table.Cell>
                    <Table.Cell className="text-xs text-ui-fg-subtle">
                      {new Date(mov.created_at).toLocaleString("ar-SA")}
                    </Table.Cell>
                  </Table.Row>
                ))
              )}
            </Table.Body>
          </Table>
        </div>
      </Container>
    </div>
  )
}

export const config = defineRouteConfig({
  label: "Warehouse & WMS",
  icon: Package,
})

export default WarehousePage
