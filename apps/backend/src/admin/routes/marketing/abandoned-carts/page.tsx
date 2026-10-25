import React, { useState, useEffect } from "react"
import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Text, Badge, Button, Table } from "@medusajs/ui"
import { ShoppingCart, Mail, Smartphone, CheckCircle2, RefreshCw } from "lucide-react"
import { SubNav } from "../../../components/sub-nav"

const marketingTabs = [
  { label: "لوحة التحكم (Dashboard)", href: "/app/marketing" },
  { label: "حملات النشر (Campaigns)", href: "/app/marketing/campaigns" },
  { label: "أتمتة السلات المتروكة (Abandoned Carts)", href: "/app/marketing/abandoned-carts", active: true },
  { label: "مسارات الأتمتة (Workflows)", href: "/app/marketing/automations" },
]

const AbandonedCartsPage = () => {
  const [carts, setCarts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await fetch("/admin/marketing")
      if (res.ok) {
        const json = await res.json()
        setCarts(json.abandoned_carts || [])
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

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto" dir="rtl">
      <SubNav
        parentTitle="التسويق متعدد القنوات"
        currentTitle="أتمتة استرداد السلات المتروكة | Cart Abandonment Recovery"
        description="نظام أوتوماتيكي يتتبع العملاء المترددين ويرسل كوبونات خصم تحفيزية خلال 1 إلى 24 ساعة."
        icon={ShoppingCart}
        tabs={marketingTabs}
        onRefresh={fetchData}
        isLoading={loading}
      />

      <Container className="p-6">
        <Heading level="h2" className="text-base font-bold text-ui-fg-base mb-4">
          سجل السلات المتروكة وحالات الاسترداد التلقائي
        </Heading>

        <div className="overflow-x-auto">
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>اسم العميل والبيانات</Table.HeaderCell>
                <Table.HeaderCell>قيمة السلة</Table.HeaderCell>
                <Table.HeaderCell>كود الخصم المعروض</Table.HeaderCell>
                <Table.HeaderCell>حالة الأتمتة</Table.HeaderCell>
                <Table.HeaderCell>وقت التخلي عن السلة</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {carts.map((c) => (
                <Table.Row key={c.id}>
                  <Table.Cell>
                    <div className="font-semibold text-sm text-ui-fg-base">{c.customer_name}</div>
                    <div className="text-xs text-ui-fg-subtle font-mono">{c.customer_email}</div>
                  </Table.Cell>
                  <Table.Cell className="font-bold text-sm text-ui-fg-base">
                    {Number(c.cart_value).toLocaleString()} ر.س
                  </Table.Cell>
                  <Table.Cell>
                    <code className="bg-purple-50 text-purple-700 px-2 py-0.5 rounded text-xs font-mono font-bold">
                      {c.discount_code_offered || "SAVE10"}
                    </code>
                  </Table.Cell>
                  <Table.Cell>
                    <Badge color={c.recovery_status === "recovered" ? "green" : "orange"}>
                      {c.recovery_status === "recovered"
                        ? "تم استرداد السلة بنجاح 💰"
                        : c.recovery_status === "whatsapp_sent"
                        ? "تم إرسال تذكير WhatsApp 💬"
                        : "تم إرسال بريد تذكيري 📧"}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell className="text-xs text-ui-fg-subtle">
                    {new Date(c.created_at).toLocaleString("ar-SA")}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      </Container>
    </div>
  )
}

export const config = defineRouteConfig({
  label: "Abandoned Carts",
})

export default AbandonedCartsPage
