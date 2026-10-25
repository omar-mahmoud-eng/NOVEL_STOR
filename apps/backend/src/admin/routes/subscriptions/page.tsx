import React, { useState } from "react"
import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Text, Badge, Button, Input } from "@medusajs/ui"
import {
  Sparkles,
  TrendingUp,
  Users,
  CreditCard,
  Plus,
  Clock,
  Gift,
  AlertTriangle,
  CheckCircle2,
  Calendar,
} from "lucide-react"
import { SubNav } from "../../components/sub-nav"

const subscriptionsTabs = [
  { label: "لوحة التحكم (Dashboard)", href: "/app/subscriptions", active: true },
  { label: "باقات وخطط الاشتراكات (Plans & Tiers)", href: "/app/subscriptions/plans" },
]

type SubscriptionTier = {
  id: string
  title: string
  interval: "month" | "year"
  price: string
  credits: number
  activeSubscribers: number
  badgeColor: "purple" | "blue" | "green"
}

type Subscriber = {
  id: string
  email: string
  plan: string
  status: "active" | "past_due" | "paused"
  remainingCredits: number
  renewalDate: string
}

const initialTiers: SubscriptionTier[] = [
  {
    id: "tier_monthly_vip",
    title: "VIP Reader & Listener Pass (Monthly)",
    interval: "month",
    price: "SAR 39.00 / mo",
    credits: 1,
    activeSubscribers: 840,
    badgeColor: "purple",
  },
  {
    id: "tier_annual_vip",
    title: "VIP All-Access Reader Pass (Annual)",
    interval: "year",
    price: "SAR 390.00 / yr",
    credits: 14,
    activeSubscribers: 310,
    badgeColor: "blue",
  },
  {
    id: "tier_kids_pass",
    title: "Kids Bedtime Story Pass (Family)",
    interval: "month",
    price: "SAR 29.00 / mo",
    credits: 2,
    activeSubscribers: 190,
    badgeColor: "green",
  },
]

const initialSubscribers: Subscriber[] = [
  {
    id: "sub_01H123",
    email: "tariq.almansoor@example.com",
    plan: "VIP Reader & Listener Pass (Monthly)",
    status: "active",
    remainingCredits: 3,
    renewalDate: "2026-11-24",
  },
  {
    id: "sub_01H456",
    email: "fatima.alzahra@example.com",
    plan: "VIP All-Access Reader Pass (Annual)",
    status: "active",
    remainingCredits: 9,
    renewalDate: "2027-04-15",
  },
  {
    id: "sub_01H789",
    email: "khalid.omar@example.com",
    plan: "Kids Bedtime Story Pass (Family)",
    status: "past_due",
    remainingCredits: 0,
    renewalDate: "2026-10-25",
  },
]

const SubscriptionsPage = () => {
  const [tiers, setTiers] = useState<SubscriptionTier[]>(initialTiers)
  const [subscribers, setSubscribers] = useState<Subscriber[]>(initialSubscribers)
  const [showAddTier, setShowAddTier] = useState(false)
  const [newTierTitle, setNewTierTitle] = useState("")
  const [newTierPrice, setNewTierPrice] = useState("49")
  const [newTierCredits, setNewTierCredits] = useState(1)

  const handleAddTier = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTierTitle.trim()) return

    const created: SubscriptionTier = {
      id: `tier_${Date.now().toString(36)}`,
      title: newTierTitle.trim(),
      interval: "month",
      price: `SAR ${parseFloat(newTierPrice).toFixed(2)} / mo`,
      credits: newTierCredits,
      activeSubscribers: 0,
      badgeColor: "purple",
    }

    setTiers([...tiers, created])
    setNewTierTitle("")
    setShowAddTier(false)
  }

  const handleGiftCredit = (subId: string) => {
    setSubscribers((prev) =>
      prev.map((sub) =>
        sub.id === subId ? { ...sub, remainingCredits: sub.remainingCredits + 1 } : sub
      )
    )
  }

  const handleTogglePause = (subId: string) => {
    setSubscribers((prev) =>
      prev.map((sub) =>
        sub.id === subId
          ? { ...sub, status: sub.status === "paused" ? "active" : "paused" }
          : sub
      )
    )
  }

  return (
    <div className="space-y-6">
      <SubNav
        parentTitle="Subscriptions & Memberships"
        currentTitle="Recurring Memberships & Churn Analytics"
        description="إدارة باقات العضوية الشهرية والسنوية، تتبع تجديدات الدفعات وتوزيع أرصدة الكتب الصوتية"
        icon={Sparkles}
        tabs={subscriptionsTabs}
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Container className="p-5 bg-white dark:bg-ui-bg-base border border-ui-border-base rounded-xl shadow-xs">
          <div className="flex items-center justify-between">
            <Text className="text-xs font-medium uppercase tracking-wider text-ui-fg-subtle">
              Monthly Recurring (MRR)
            </Text>
            <div className="p-2 rounded-lg bg-ui-tag-green-bg text-ui-tag-green-icon">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-ui-fg-base">SAR 48,250</span>
          </div>
          <Text className="text-xs text-ui-fg-muted mt-1">+14.2% from last cycle</Text>
        </Container>

        <Container className="p-5 bg-white dark:bg-ui-bg-base border border-ui-border-base rounded-xl shadow-xs">
          <div className="flex items-center justify-between">
            <Text className="text-xs font-medium uppercase tracking-wider text-ui-fg-subtle">
              Active VIP Subscribers
            </Text>
            <div className="p-2 rounded-lg bg-ui-tag-purple-bg text-ui-tag-purple-icon">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-ui-fg-base">1,340 Readers</span>
          </div>
          <Text className="text-xs text-ui-fg-muted mt-1">98.4% payment retention rate</Text>
        </Container>

        <Container className="p-5 bg-white dark:bg-ui-bg-base border border-ui-border-base rounded-xl shadow-xs">
          <div className="flex items-center justify-between">
            <Text className="text-xs font-medium uppercase tracking-wider text-ui-fg-subtle">
              Credits Dispensed (MTD)
            </Text>
            <div className="p-2 rounded-lg bg-ui-tag-blue-bg text-ui-tag-blue-icon">
              <Gift className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-ui-fg-base">1,890 Credits</span>
          </div>
          <Text className="text-xs text-ui-fg-muted mt-1">Audiobooks & E-books unlocked</Text>
        </Container>

        <Container className="p-5 bg-white dark:bg-ui-bg-base border border-ui-border-base rounded-xl shadow-xs">
          <div className="flex items-center justify-between">
            <Text className="text-xs font-medium uppercase tracking-wider text-ui-fg-subtle">
              Renewal Scheduler
            </Text>
            <div className="p-2 rounded-lg bg-ui-tag-orange-bg text-ui-tag-orange-icon">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-ui-fg-base">BullMQ Active</span>
          </div>
          <Text className="text-xs text-ui-fg-muted mt-1">Daily automated cron running</Text>
        </Container>
      </div>

      {/* Add Tier Form */}
      {showAddTier && (
        <Container className="p-6 bg-ui-bg-subtle/50 border border-ui-border-base rounded-xl">
          <form onSubmit={handleAddTier} className="space-y-4">
            <Heading level="h3" className="text-sm font-bold text-ui-fg-base">
              Create New Membership Tier
            </Heading>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                placeholder="Tier Title (e.g. VIP Young Adult Reader Pass)"
                value={newTierTitle}
                onChange={(e) => setNewTierTitle(e.target.value)}
                required
              />
              <Input
                type="number"
                placeholder="Price (SAR)"
                value={newTierPrice}
                onChange={(e) => setNewTierPrice(e.target.value)}
                required
              />
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  placeholder="Monthly Credits"
                  value={newTierCredits}
                  onChange={(e) => setNewTierCredits(Number(e.target.value))}
                  min={1}
                />
                <Button type="submit" variant="primary" size="small" className="ml-auto">
                  Save Plan
                </Button>
              </div>
            </div>
          </form>
        </Container>
      )}

      {/* Available Tiers Overview */}
      <div className="space-y-3">
        <Heading level="h2" className="text-base font-bold text-ui-fg-base">
          Active Subscription Plans
        </Heading>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {tiers.map((tier) => (
            <Container
              key={tier.id}
              className="p-5 bg-white dark:bg-ui-bg-base border border-ui-border-base rounded-xl shadow-xs space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <Heading level="h3" className="text-sm font-bold text-ui-fg-base">
                    {tier.title}
                  </Heading>
                  <span className="text-xs text-ui-fg-subtle">{tier.interval}ly recurring</span>
                </div>
                <Badge color={tier.badgeColor}>{tier.credits} Book Credits</Badge>
              </div>

              <div className="text-xl font-black text-ui-fg-base">{tier.price}</div>

              <div className="pt-2 border-t border-ui-border-base flex justify-between text-xs text-ui-fg-muted">
                <span>Active Subscribers</span>
                <span className="font-bold text-ui-fg-base">{tier.activeSubscribers}</span>
              </div>
            </Container>
          ))}
        </div>
      </div>

      {/* Subscribers Renewal Queue Table */}
      <Container className="p-6 bg-white dark:bg-ui-bg-base border border-ui-border-base rounded-xl shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-ui-border-base">
          <Heading level="h2" className="text-base font-bold text-ui-fg-base">
            Subscriber Renewals & Credit Balances
          </Heading>
          <span className="text-xs text-ui-fg-subtle">Showing {subscribers.length} accounts</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-ui-bg-subtle text-ui-fg-subtle font-semibold border-b border-ui-border-base">
              <tr>
                <th className="py-2.5 px-3">Subscriber</th>
                <th className="py-2.5 px-3">Enrolled Tier</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Credits Balance</th>
                <th className="py-2.5 px-3">Next Renewal Date</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ui-border-base">
              {subscribers.map((sub) => (
                <tr key={sub.id} className="hover:bg-ui-bg-subtle/40">
                  <td className="py-3 px-3 font-medium text-ui-fg-base">
                    {sub.email}
                    <div className="text-[11px] text-ui-fg-muted font-mono">{sub.id}</div>
                  </td>
                  <td className="py-3 px-3 text-ui-fg-subtle">{sub.plan}</td>
                  <td className="py-3 px-3">
                    {sub.status === "active" ? (
                      <Badge color="green">Active</Badge>
                    ) : sub.status === "past_due" ? (
                      <Badge color="red">Payment Failed</Badge>
                    ) : (
                      <Badge color="orange">Paused</Badge>
                    )}
                  </td>
                  <td className="py-3 px-3 font-bold text-ui-fg-base">
                    {sub.remainingCredits} Credits
                  </td>
                  <td className="py-3 px-3 font-mono text-ui-fg-subtle">
                    {sub.renewalDate}
                  </td>
                  <td className="py-3 px-3 text-right space-x-2">
                    <Button
                      variant="secondary"
                      size="small"
                      onClick={() => handleGiftCredit(sub.id)}
                      className="h-7 text-xs"
                      title="Gift +1 Free Book Credit"
                    >
                      +1 Credit
                    </Button>
                    <Button
                      variant="secondary"
                      size="small"
                      onClick={() => handleTogglePause(sub.id)}
                      className="h-7 text-xs"
                    >
                      {sub.status === "paused" ? "Resume" : "Pause"}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Container>
    </div>
  )
}

export const config = defineRouteConfig({
  label: "Subscriptions & Plans",
  icon: Sparkles,
})

export default SubscriptionsPage
