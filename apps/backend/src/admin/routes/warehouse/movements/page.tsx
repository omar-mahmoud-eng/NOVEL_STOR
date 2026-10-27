import {adminFetch} from "../../../lib/admin-fetch"
import React, { useState, useEffect } from "react"
import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Text, Badge, Button, Table, Input } from "@medusajs/ui"
import { ArrowRightLeft, Plus, CheckCircle2, Truck, ArrowDownLeft, ArrowUpRight } from "lucide-react"
import { SubNav } from "../../../components/sub-nav"

const warehouseTabs = [
  { label: "لوحة التحكم (Dashboard)", href: "/app/warehouse" },
  { label: "مواقع الأرفف والخانَات (Bins & Racks)", href: "/app/warehouse/bins" },
  { label: "حركات المخزون والتدقيق (Stock Audit)", href: "/app/warehouse/movements", active: true },
]

const StockMovementsPage = () => {
  const [movements, setMovements] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
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
        setMovements(data.movements || [])
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
        setFeedbackMsg("تم تسجيل حركة المخزون وتحديث السجلات بنجاح!")
        setTimeout(() => setFeedbackMsg(""), 4000)
        setRefNumber("")
        fetchData()
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <SubNav
        parentTitle="Warehouse & WMS"
        currentTitle="Stock Movements & Audit Trail"
        description="سجل تدقيق حركة الشحنات، التوريد من المطابع، التحويل بين الفروع، وسندات الصرف"
        icon={ArrowRightLeft}
        tabs={warehouseTabs}
        onRefresh={fetchData}
        isLoading={loading}
      />

      <Text className="text-sm text-ui-fg-subtle">هذا سجل تدقيق يدوي. تعديل المخزون القابل للبيع يتم من <a className="underline" href="/app/inventory">مخزون Medusa</a>.</Text>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Movements Table */}
        <Container className="lg:col-span-2 p-0 overflow-hidden">
          <div className="p-4 border-b border-ui-border-base flex items-center justify-between">
            <div>
              <Heading level="h2" className="text-base font-bold text-ui-fg-base">
                سجل حركات المخزون والمناقلات ({movements.length})
              </Heading>
              <Text className="text-xs text-ui-fg-subtle">
                تدقيق محاسبي كامل لجميع الواردات والمنصرفات مع أرقام السندات
              </Text>
            </div>
            <Badge color="orange">Immutable Ledger</Badge>
          </div>

          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>نوع الحركة</Table.HeaderCell>
                <Table.HeaderCell>الرواية (SKU)</Table.HeaderCell>
                <Table.HeaderCell>الكمية</Table.HeaderCell>
                <Table.HeaderCell>من الموقع</Table.HeaderCell>
                <Table.HeaderCell>إلى الموقع</Table.HeaderCell>
                <Table.HeaderCell>رقم السند</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {movements.map((mov) => {
                const isInbound = ["purchase_order", "inbound_po", "inbound"].includes(mov.movement_type)
                return (
                  <Table.Row key={mov.id}>
                    <Table.Cell>
                      <Badge color={isInbound ? "green" : "blue"} className="text-[11px]">
                        {mov.movement_type}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell className="font-mono text-xs font-bold text-ui-fg-base">
                      {mov.sku}
                    </Table.Cell>
                    <Table.Cell className={`font-bold text-xs ${isInbound ? "text-emerald-600" : "text-ui-fg-base"}`}>
                      {isInbound ? `+${mov.quantity}` : `-${mov.quantity}`}
                    </Table.Cell>
                    <Table.Cell className="text-xs text-ui-fg-subtle">{mov.from_location}</Table.Cell>
                    <Table.Cell className="text-xs font-medium text-ui-fg-base">{mov.to_location}</Table.Cell>
                    <Table.Cell>
                      <span className="font-mono text-xs bg-ui-bg-subtle px-2 py-0.5 rounded font-semibold">
                        {mov.reference_number}
                      </span>
                    </Table.Cell>
                  </Table.Row>
                )
              })}
            </Table.Body>
          </Table>
        </Container>

        {/* New Movement Form */}
        <Container className="p-5 h-fit">
          <Heading level="h2" className="text-base font-bold text-ui-fg-base mb-1">
            تسجيل حركة مخزون جديدة
          </Heading>
          <Text className="text-xs text-ui-fg-subtle mb-4">
            إدخال سند توريد، نقل بين المستودعات، أو تسوية جردية
          </Text>

          <form onSubmit={handleCreateMovement} className="space-y-3.5">
            <div>
              <label className="text-xs font-semibold text-ui-fg-base block mb-1">
                نوع الحركة
              </label>
              <select
                className="w-full text-xs p-2 rounded-md border border-ui-border-base bg-ui-bg-base text-ui-fg-base"
                value={movementType}
                onChange={(e) => setMovementType(e.target.value)}
              >
                <option value="purchase_order">توريد من المطبعة (Inbound PO)</option>
                <option value="inter_transfer">تحويل بين مستودعين (Transfer)</option>
                <option value="order_pick">صرف طلبات شحن (Outbound)</option>
                <option value="inventory_adjustment">تسوية جردية (Adjustment)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-ui-fg-base block mb-1">
                رمز الرواية (SKU)
              </label>
              <Input
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="NOVEL-DESERT-HC"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-ui-fg-base block mb-1">
                الكمية (Units)
              </label>
              <Input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                min={1}
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-ui-fg-base block mb-1">
                من موقع (From Location)
              </label>
              <Input
                value={fromLoc}
                onChange={(e) => setFromLoc(e.target.value)}
                placeholder="المصدر"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-ui-fg-base block mb-1">
                إلى موقع (To Location)
              </label>
              <Input
                value={toLoc}
                onChange={(e) => setToLoc(e.target.value)}
                placeholder="الوجهة"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-ui-fg-base block mb-1">
                رقم السند / البوليصة (Ref No)
              </label>
              <Input
                value={refNumber}
                onChange={(e) => setRefNumber(e.target.value)}
                placeholder="مثال: PO-2026-9044"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-ui-fg-base block mb-1">
                سبب العملية وملاحظات الجرد
              </label>
              <Input
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="ملاحظات توثيقية"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-orange-600 hover:bg-orange-700 text-white"
              disabled={isSubmitting || !sku || !refNumber}
            >
              <Plus className="w-4 h-4 ml-1.5" />
              {isSubmitting ? "جاري التوثيق..." : "توثيق حركة المخزون"}
            </Button>

            {feedbackMsg && (
              <div className="p-2.5 bg-green-50 border border-green-200 text-green-800 text-xs rounded-md flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                {feedbackMsg}
              </div>
            )}
          </form>
        </Container>
      </div>
    </div>
  )
}

export const config = defineRouteConfig({
  label: "Stock Movements",
})

export default StockMovementsPage
