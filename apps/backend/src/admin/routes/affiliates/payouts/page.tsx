import {adminFetch} from "../../../lib/admin-fetch"
import React, { useState, useEffect } from "react"
import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Text, Badge, Button, Table } from "@medusajs/ui"
import { CreditCard, CheckCircle2, Clock, DollarSign, Download, ArrowUpRight } from "lucide-react"
import { SubNav } from "../../../components/sub-nav"

const affiliateTabs = [
  { label: "لوحة التحكم (Dashboard)", href: "/app/affiliates" },
  { label: "دليل المؤثرين والمسوقين (Creators)", href: "/app/affiliates/creators" },
  { label: "مستحقات وتوزيع العمولات (Payouts)", href: "/app/affiliates/payouts", active: true },
]

const AffiliatePayoutsPage = () => {
  const [referrals, setReferrals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [msg, setMsg] = useState("")

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await adminFetch("/admin/affiliates")
      if (res.ok) {
        const data = await res.json()
        setReferrals(data.referrals || [])
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

  const pendingPayouts = referrals.filter((r) => (r.payout_status || r.status) !== "paid")
  const totalPendingAmount = pendingPayouts.reduce((sum, r) => sum + Number(r.commission_amount || 0), 0)
  const paidPayouts = referrals.filter((r) => (r.payout_status || r.status) === "paid")
  const totalPaidAmount = paidPayouts.reduce((sum, r) => sum + Number(r.commission_amount || 0), 0)

  const handleBatchPay = () => {
    const cell=(value:any)=>'"'+String(value??"").replace(/^[=+@-]/," '").replaceAll('"','""')+'"'
    const rows=[["Order","Affiliate","Amount","Commission","Status"],...pendingPayouts.map(r=>[r.order_id,r.affiliate_name||r.affiliate_id,r.order_amount,r.commission_amount,r.payout_status||r.status])]
    const url=URL.createObjectURL(new Blob(["\ufeff"+rows.map(row=>row.map(cell).join(",")).join("\r\n")],{type:"text/csv;charset=utf-8"}));const anchor=document.createElement("a");anchor.href=url;anchor.download="pending-commissions.csv";anchor.click();setTimeout(()=>URL.revokeObjectURL(url),1000);setMsg("تم تنزيل كشف المراجعة. الدفع مؤجل ولم يُنفذ تحويل.")
  }

  return (
    <div className="space-y-6">
      <SubNav
        parentTitle="Affiliates & Creators"
        currentTitle="Payout Settlements & Batching"
        description="تسوية مستحقات الشركاء، أوامر التحويل البنكي المجمعة وسجل العمولات المدفوعة"
        icon={CreditCard}
        tabs={affiliateTabs}
        onRefresh={fetchData}
        isLoading={loading}
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Container className="p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-ui-fg-subtle">العمولات المعلقة (Pending)</div>
            <div className="text-xl font-bold text-amber-600">${totalPendingAmount.toLocaleString()}</div>
            <div className="text-[11px] text-ui-fg-muted">{pendingPayouts.length} تسوية تنتظر الصرف</div>
          </div>
        </Container>

        <Container className="p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-ui-fg-subtle">العمولات المدفوعة (Settled)</div>
            <div className="text-xl font-bold text-emerald-600">${totalPaidAmount.toLocaleString()}</div>
            <div className="text-[11px] text-ui-fg-muted">{paidPayouts.length} تسوية مكتملة</div>
          </div>
        </Container>

        <Container className="p-4 flex flex-col justify-center">
          <Button
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
            onClick={handleBatchPay}
            disabled={processing || pendingPayouts.length === 0}
          >
            <CreditCard className="w-4 h-4 ml-1.5" />
            {`تنزيل كشف المستحقات (${pendingPayouts.length})`}
          </Button>
          {msg && <div className="text-[11px] text-emerald-700 font-semibold mt-1.5 text-center">{msg}</div>}
        </Container>
      </div>

      {/* Payouts Table */}
      <Container className="p-0 overflow-hidden">
        <div className="p-4 border-b border-ui-border-base flex items-center justify-between">
          <div>
            <Heading level="h2" className="text-base font-bold text-ui-fg-base">
              سجل تسويات الإحالات والطلبات ({referrals.length})
            </Heading>
            <Text className="text-xs text-ui-fg-subtle">
              تفاصيل كل طلب وارد عن طريق كود مؤثر وقيمة العمولة وحالة التحويل
            </Text>
          </div>
          <Badge color="blue">Live Feed</Badge>
        </div>

        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>معرف الطلب (Order ID)</Table.HeaderCell>
              <Table.HeaderCell>كود الشريك (Affiliate)</Table.HeaderCell>
              <Table.HeaderCell>قيمة الطلب</Table.HeaderCell>
              <Table.HeaderCell>العمولة المستحقة</Table.HeaderCell>
              <Table.HeaderCell>حالة الصرف</Table.HeaderCell>
              <Table.HeaderCell>تاريخ العملية</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {referrals.length === 0 ? (
              <Table.Row>
                <td className="text-center py-6 text-ui-fg-subtle" colSpan={6}>
                  لا توجد سجلات إحالة مسجلة حالياً
                </td>
              </Table.Row>
            ) : (
              referrals.map((ref) => (
                <Table.Row key={ref.id}>
                  <Table.Cell className="font-mono text-xs font-semibold">{ref.order_id}</Table.Cell>
                  <Table.Cell>
                    <span className="font-mono text-xs bg-ui-bg-subtle px-2 py-0.5 rounded font-bold">
                      {ref.affiliate_name || ref.affiliate_id}
                    </span>
                  </Table.Cell>
                  <Table.Cell className="font-bold text-xs text-ui-fg-base">
                    ${Number(ref.order_amount || 0).toLocaleString()}
                  </Table.Cell>
                  <Table.Cell className="font-bold text-xs text-emerald-600">
                    ${Number(ref.commission_amount || 0).toLocaleString()}
                  </Table.Cell>
                  <Table.Cell>
                    <Badge color={(ref.payout_status || ref.status) === "paid" ? "green" : "orange"}>
                      {(ref.payout_status || ref.status) === "paid" ? "تم التحويل" : "معلق"}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell className="text-xs text-ui-fg-subtle">
                    {ref.created_at ? new Date(ref.created_at).toLocaleDateString("ar-SA") : "اليوم"}
                  </Table.Cell>
                </Table.Row>
              ))
            )}
          </Table.Body>
        </Table>
      </Container>
    </div>
  )
}

export const config = defineRouteConfig({
  label: "Payouts & Settlements",
})

export default AffiliatePayoutsPage
