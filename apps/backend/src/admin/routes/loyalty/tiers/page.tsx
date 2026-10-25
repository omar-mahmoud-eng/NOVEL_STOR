import React, { useState, useEffect } from "react"
import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Text, Badge, Button, Table, Input } from "@medusajs/ui"
import { Award, Crown, ShieldCheck, Zap, ArrowRight, CheckCircle2, TrendingUp } from "lucide-react"
import { SubNav } from "../../../components/sub-nav"

const loyaltyTabs = [
  { label: "لوحة التحكم (Dashboard)", href: "/app/loyalty" },
  { label: "هيكل فئات الـ VIP (Tier Ladder)", href: "/app/loyalty/tiers", active: true },
  { label: "كتالوج قسائم المكافآت (Rewards)", href: "/app/loyalty/rewards" },
]

const tierDefinitions = [
  {
    key: "bronze",
    name: "برونزي (Bronze Starter)",
    threshold: "0 نقطة / $0 إنفاق",
    multiplier: "1.0x نقاط",
    badgeColor: "grey" as const,
    perks: ["كسب نقطة لكل دولار", "هدية ترحيبية 50 نقطة", "وصول للعروض العامة"],
  },
  {
    key: "silver",
    name: "فضي (Silver Reader)",
    threshold: "500 نقطة / $150 إنفاق",
    multiplier: "1.25x نقاط",
    badgeColor: "blue" as const,
    perks: ["مضاعف نقاط 1.25x", "شحن مجاني على الطلبات فوق $50", "معاينة الروايات قبل النشر"],
  },
  {
    key: "gold",
    name: "ذهبي (Gold Bibliophile)",
    threshold: "1,500 نقطة / $500 إنفاق",
    multiplier: "1.5x نقاط",
    badgeColor: "orange" as const,
    perks: ["مضاعف نقاط 1.5x", "خصم دائم 10% على الكتب الصوتية", "شحن سريع مجاني لجميع الطلبات"],
  },
  {
    key: "platinum",
    name: "بلاتيني (Platinum Luminary)",
    threshold: "3,500 نقطة / $1,200 إنفاق",
    multiplier: "2.0x نقاط",
    badgeColor: "purple" as const,
    perks: ["مضاعف نقاط 2.0x", "كتاب صوتي شهري مجاناً", "دعوة لجلسات توقيع حصرية مع الروائيين", "مدير حساب VIP مخصص"],
  },
]

const LoyaltyTiersPage = () => {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await fetch("/admin/loyalty")
      if (res.ok) {
        const json = await res.json()
        setData(json)
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

  const members = data?.members || []
  const countsByTier = members.reduce((acc: any, m: any) => {
    const t = (m.tier_level || "bronze").toLowerCase()
    acc[t] = (acc[t] || 0) + 1
    return acc
  }, {})

  return (
    <div className="space-y-6">
      <SubNav
        parentTitle="Loyalty & VIP"
        currentTitle="VIP Tier Ladder & Rules"
        description="إدارة مستويات العضوية، شروط الترقية، مضاعفات النقاط، والمزايا الحصرية لكل رتبة"
        icon={Crown}
        tabs={loyaltyTabs}
        onRefresh={fetchData}
        isLoading={loading}
      />

      {/* Tier Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {tierDefinitions.map((tier) => {
          const count = countsByTier[tier.key] || 0
          return (
            <Container key={tier.key} className="p-5 flex flex-col justify-between border-t-4" style={{
              borderTopColor: tier.key === "platinum" ? "#9333ea" : tier.key === "gold" ? "#eab308" : tier.key === "silver" ? "#3b82f6" : "#64748b"
            }}>
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Badge color={tier.badgeColor}>{tier.name.split(" ")[0]}</Badge>
                  <span className="text-xs font-bold text-ui-fg-muted">{count} عضو نشط</span>
                </div>
                <h3 className="font-bold text-base text-ui-fg-base mb-1">{tier.name}</h3>
                <div className="text-xs text-ui-fg-subtle mb-3">حد الترقية: {tier.threshold}</div>
                <div className="inline-block bg-ui-bg-subtle px-2.5 py-1 rounded text-xs font-semibold text-ui-fg-interactive mb-4">
                  {tier.multiplier}
                </div>

                <div className="space-y-1.5 pt-2 border-t border-ui-border-base text-xs text-ui-fg-subtle">
                  <div className="font-semibold text-ui-fg-base mb-1">المزايا الممنوحة:</div>
                  {tier.perks.map((perk, i) => (
                    <div key={i} className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 flex-shrink-0" />
                      <span>{perk}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Container>
          )
        })}
      </div>

      {/* Members in Tiers Table */}
      <Container className="p-0 overflow-hidden">
        <div className="p-4 border-b border-ui-border-base flex items-center justify-between">
          <div>
            <Heading level="h2" className="text-base font-bold text-ui-fg-base">
              توزيع العملاء في سلّم الـ VIP
            </Heading>
            <Text className="text-xs text-ui-fg-subtle">
              قائمة العملاء المحدثة بحسب رصيد النقاط وفئة الترقية الحالية
            </Text>
          </div>
          <Badge color="green">محدث تلقائياً</Badge>
        </div>

        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>معرف العميل (Customer)</Table.HeaderCell>
              <Table.HeaderCell>الفئة الحالية (Tier)</Table.HeaderCell>
              <Table.HeaderCell>الرصيد المتاح (Points)</Table.HeaderCell>
              <Table.HeaderCell>مجموع النقاط التاريخي (Lifetime)</Table.HeaderCell>
              <Table.HeaderCell>آخر نشاط</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {members.slice(0, 10).map((m: any) => (
              <Table.Row key={m.id}>
                <Table.Cell className="font-mono text-xs font-semibold">{m.customer_id}</Table.Cell>
                <Table.Cell>
                  <Badge
                    color={
                      m.tier_level === "platinum"
                        ? "purple"
                        : m.tier_level === "gold"
                        ? "orange"
                        : m.tier_level === "silver"
                        ? "blue"
                        : "grey"
                    }
                  >
                    {m.tier_level?.toUpperCase() || "BRONZE"}
                  </Badge>
                </Table.Cell>
                <Table.Cell className="font-bold text-sm text-emerald-600">
                  {Number(m.points_balance || 0).toLocaleString()} pt
                </Table.Cell>
                <Table.Cell className="text-xs text-ui-fg-subtle">
                  {Number(m.lifetime_points || 0).toLocaleString()} pt
                </Table.Cell>
                <Table.Cell className="text-xs text-ui-fg-muted">
                  {m.updated_at ? new Date(m.updated_at).toLocaleDateString("ar-SA") : "اليوم"}
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
  label: "VIP Tiers",
})

export default LoyaltyTiersPage
