import React, { useState, useEffect } from "react"
import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Text, Badge, Button, Input } from "@medusajs/ui"
import {
  Users,
  Search,
  Sparkles,
  TrendingUp,
  HeartHandshake,
  AlertCircle,
  Phone,
  Mail,
  BookOpen,
  Headphones,
  ShoppingBag,
  Star,
  Plus,
  Clock,
  Send,
  MessageSquare,
  Gift,
  CheckCircle2,
  X,
  Filter,
  ShieldCheck,
  Award,
  RefreshCw,
  Crown,
  Zap,
  Activity,
  Flame,
  MessageCircle,
  MapPin,
  ChevronRight,
} from "lucide-react"
import { SubNav } from "../../components/sub-nav"

const crmTabs = [
  { label: "لوحة التحكم (Dashboard)", href: "/app/crm", active: true },
  { label: "سجلات العملاء 360 (Customer 360)", href: "/app/crm/customers" },
  { label: "شرائح وتصنيف الجمهور (Audience Segments)", href: "/app/crm/segments" },
]

export function ReaderCrmPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [tierFilter, setTierFilter] = useState<string>("all")
  const [formatFilter, setFormatFilter] = useState<string>("all")
  const [riskFilter, setRiskFilter] = useState<string>("all")
  const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null)

  // Drawer Action States
  const [activeDrawerTab, setActiveDrawerTab] = useState<"telemetry" | "whatsapp" | "notes" | "loyalty">("telemetry")
  const [newNoteContent, setNewNoteContent] = useState("")
  const [newNoteType, setNewNoteType] = useState<string>("call")
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // WhatsApp Dispatcher State
  const [selectedTemplate, setSelectedTemplate] = useState("recommendation")
  const [customMsgBody, setCustomMsgBody] = useState("")
  const [customMsgSubject, setCustomMsgSubject] = useState("")
  const [dispatchChannel, setDispatchChannel] = useState<"whatsapp" | "sms" | "email">("whatsapp")

  // Points & Tier Adjustment State
  const [pointsDelta, setPointsDelta] = useState<number>(100)
  const [pointsReason, setPointsReason] = useState("مكافأة ولاء إضافية من فريق خدمة القراء")
  const [newTierSelect, setNewTierSelect] = useState("platinum_elite")

  const fetchCrmData = async () => {
    setLoading(true)
    try {
      const res = await fetch("/admin/crm")
      if (res.ok) {
        const json = await res.json()
        setData(json)
        // Keep selected customer updated if drawer is open
        if (selectedCustomer) {
          const updatedSelected = json.customers?.find((c: any) => c.id === selectedCustomer.id)
          if (updatedSelected) setSelectedCustomer(updatedSelected)
        }
      }
    } catch (err) {
      console.error("[CRM fetch error]", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCrmData()
  }, [])

  const customers = data?.customers || []
  const metrics = data?.metrics || {
    total_readers: 5,
    total_orders: 16,
    total_revenue_sar: "1483.50",
    avg_order_value_sar: "92.72",
    vip_readers_count: 2,
    at_risk_readers_count: 1,
    total_audio_hours_listened: "235.6",
  }

  // Pre-crafted message templates in authentic Saudi Arabic
  const messageTemplates: Record<string, { subject: string; body: string }> = {
    recommendation: {
      subject: "ترشيح أدبي خاص يليق بذوقكم الرفيع 📚",
      body: selectedCustomer
        ? `أهلاً بك أ. ${selectedCustomer.name}، لاحظنا شغفك بروايات وأعمال الأدب التاريخي والاستماع بسرعة ${selectedCustomer.preferred_speed}. يسرنا إهداؤك فصلاً حصرياً من الرواية الجديدة "أطياف بغداد القديمة" عبر تطبيق النخبة.`
        : "",
    },
    winback: {
      subject: "اشتقنا لتواجدكم بين صفحات كتبنا ☕",
      body: selectedCustomer
        ? `عزيزنا القارئ ${selectedCustomer.name}، نود الاطمئنان عليكم! لم نسجل استماعاً جديداً منذ فترة. قمنا بإضافة 100 نقطة ولاء مجانية في محفظتك لاستئناف رحلة القراءة اليوم.`
        : "",
    },
    completion_bonus: {
      subject: "مبارك إتمام الرواية! هدية رصيد كتاب مجاني 🎖️",
      body: selectedCustomer
        ? `تهانينا الحارة أ. ${selectedCustomer.name}! تقديراً لإتمامك قراءة كتابك الأخير، تم إيداع (+1) رصيد كتاب مجاني إضافي في باقتك للاستمتاع بروايتك القادمة فوراً.`
        : "",
    },
    vip_salon_invite: {
      subject: "دعوة خاصة لحضور جلسة الصالون الأدبي الافتراضي ✨",
      body: selectedCustomer
        ? `سعادة ${selectedCustomer.name}، بصفتكم عضواً مميزاً في ${selectedCustomer.vip_tier_ar}، يسعدنا دعوتكم للمشاركة في الندوة الحوارية المباشرة مع مؤلفي الدار هذا الأسبوع عبر المنصة الصوتية.`
        : "",
    },
    delivery_followup: {
      subject: "متابعة وصول طبعتكم الفاخرة الموقعة 📦",
      body: selectedCustomer
        ? `مرحباً أ. ${selectedCustomer.name}، نود التأكد من استلامكم لنسختكم الورقية الفاخرة ذات التغليف الملكي بمدينة ${selectedCustomer.city}. فريق خدمة القراء في خدمتكم لأي استفسار.`
        : "",
    },
  }

  // Update template body when template changes or customer changes
  useEffect(() => {
    if (messageTemplates[selectedTemplate]) {
      setCustomMsgSubject(messageTemplates[selectedTemplate].subject)
      setCustomMsgBody(messageTemplates[selectedTemplate].body)
    }
  }, [selectedTemplate, selectedCustomer])

  // Filtered customers
  const filteredCustomers = customers.filter((c: any) => {
    const matchesSearch =
      c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone?.includes(searchQuery)

    const matchesTier = tierFilter === "all" || c.vip_tier === tierFilter
    const matchesFormat = formatFilter === "all" || c.preferred_format === formatFilter
    const matchesRisk = riskFilter === "all" || c.churn_risk === riskFilter

    return matchesSearch && matchesTier && matchesFormat && matchesRisk
  })

  // 1. Add Note Action (Persisted in DB)
  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedCustomer || !newNoteContent.trim()) return

    setIsSubmitting(true)
    try {
      const res = await fetch("/admin/crm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "add_note",
          customer_id: selectedCustomer.id,
          author_name: "فريق النخبة (Admin)",
          note_type: newNoteType,
          content: newNoteContent.trim(),
        }),
      })

      if (res.ok) {
        setNewNoteContent("")
        setActionSuccessMsg("تم حفظ الملاحظة وتوثيقها في قاعدة بيانات القارئ بنجاح!")
        setTimeout(() => setActionSuccessMsg(null), 3500)
        await fetchCrmData()
      }
    } catch (err) {
      console.error("[Add note error]", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  // 2. Dispatch Communication Action (Persisted in DB)
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedCustomer || !customMsgBody.trim()) return

    setIsSubmitting(true)
    try {
      const res = await fetch("/admin/crm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "send_message",
          customer_id: selectedCustomer.id,
          channel: dispatchChannel,
          template_key: selectedTemplate,
          recipient: dispatchChannel === "email" ? selectedCustomer.email : selectedCustomer.phone,
          subject: customMsgSubject,
          message_body: customMsgBody.trim(),
          sent_by: "مدير علاقات القراء",
        }),
      })

      if (res.ok) {
        setActionSuccessMsg(`تم إرسال رسالة ${dispatchChannel.toUpperCase()} وحفظها في سجل التواصل بنجاح!`)
        setTimeout(() => setActionSuccessMsg(null), 4000)
        await fetchCrmData()
      }
    } catch (err) {
      console.error("[Send message error]", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  // 3. Grant Credit Action (Persisted in DB)
  const handleGrantCredit = async (delta: number) => {
    if (!selectedCustomer) return
    setIsSubmitting(true)
    try {
      const res = await fetch("/admin/crm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "grant_credit",
          customer_id: selectedCustomer.id,
          credits_delta: delta,
        }),
      })
      if (res.ok) {
        setActionSuccessMsg(`تمت إضافة (+${delta}) رصيد كتب مجاني لحساب القارئ فوراً!`)
        setTimeout(() => setActionSuccessMsg(null), 3500)
        await fetchCrmData()
      }
    } catch (err) {
      console.error("[Grant credit error]", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  // 4. Adjust Loyalty Points Action (Persisted in DB)
  const handleAdjustPoints = async () => {
    if (!selectedCustomer) return
    setIsSubmitting(true)
    try {
      const res = await fetch("/admin/crm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "adjust_points",
          customer_id: selectedCustomer.id,
          points_delta: pointsDelta,
          reason: pointsReason,
        }),
      })
      if (res.ok) {
        setActionSuccessMsg(`تم تعديل رصيد النقاط بمقدار (${pointsDelta > 0 ? "+" + pointsDelta : pointsDelta}) نقطة بنجاح!`)
        setTimeout(() => setActionSuccessMsg(null), 3500)
        await fetchCrmData()
      }
    } catch (err) {
      console.error("[Adjust points error]", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  // 5. Update VIP Tier Action (Persisted in DB)
  const handleUpdateTier = async () => {
    if (!selectedCustomer) return
    setIsSubmitting(true)
    try {
      const res = await fetch("/admin/crm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update_tier",
          customer_id: selectedCustomer.id,
          new_tier: newTierSelect,
        }),
      })
      if (res.ok) {
        setActionSuccessMsg(`تمت ترقية رتبة القارئ في قاعدة البيانات بنجاح!`)
        setTimeout(() => setActionSuccessMsg(null), 3500)
        await fetchCrmData()
      }
    } catch (err) {
      console.error("[Update tier error]", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6" dir="rtl">
      {/* Top Header & Navigation */}
      <SubNav
        parentTitle="Reader CRM 360°"
        currentTitle="لوحة ذكاء القراء وإدارة العلاقات التشغيلية المباشرة | Reader Intelligence Dashboard"
        description="نظام إدارة علاقات القراء الاحترافي: القياس عن بعد لجلسات الاستماع، التفاعل المباشر عبر واتساب، أتمتة ولاء كبار القراء، وتفادي انقطاع النشاط (Churn Prevention)."
        icon={Users}
        tabs={crmTabs}
        onRefresh={fetchCrmData}
        isLoading={loading}
      />

      {/* KPI Intelligence Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Readers */}
        <Container className="p-5 flex items-center justify-between border-r-4 border-r-blue-600 bg-ui-bg-base shadow-xs">
          <div>
            <Text className="text-xs text-ui-fg-muted font-bold mb-1">إجمالي القراء المسجلين</Text>
            <div className="flex items-baseline gap-2">
              <Heading level="h2" className="text-2xl font-black text-ui-fg-base">
                {metrics.total_readers}
              </Heading>
              <Badge color="green" className="text-[10px]">
                نشط في قاعدة البيانات
              </Badge>
            </div>
            <Text className="text-[11px] text-ui-fg-subtle mt-1">تتبع دقيق لملفات القراءة الفردية</Text>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
        </Container>

        {/* Card 2: VIP Salon Members */}
        <Container className="p-5 flex items-center justify-between border-r-4 border-r-purple-600 bg-ui-bg-base shadow-xs">
          <div>
            <Text className="text-xs text-ui-fg-muted font-bold mb-1">أعضاء الصالون الأدبي و VIP</Text>
            <div className="flex items-baseline gap-2">
              <Heading level="h2" className="text-2xl font-black text-purple-600">
                {metrics.vip_readers_count}
              </Heading>
              <Badge color="purple" className="text-[10px]">
                {metrics.total_readers > 0 ? Math.round((metrics.vip_readers_count / metrics.total_readers) * 100) : 0}% من الجمهور
              </Badge>
            </div>
            <Text className="text-[11px] text-ui-fg-subtle mt-1">أعلى معدل ولاء وتكرار شراء</Text>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <Crown className="w-6 h-6" />
          </div>
        </Container>

        {/* Card 3: Total Audio Hours Listened */}
        <Container className="p-5 flex items-center justify-between border-r-4 border-r-emerald-600 bg-ui-bg-base shadow-xs">
          <div>
            <Text className="text-xs text-ui-fg-muted font-bold mb-1">ساعات الاستماع التراكمية</Text>
            <div className="flex items-baseline gap-2">
              <Heading level="h2" className="text-2xl font-black text-emerald-600">
                {metrics.total_audio_hours_listened}
              </Heading>
              <Text className="text-xs font-bold text-emerald-700">ساعة صوتية</Text>
            </div>
            <Text className="text-[11px] text-ui-fg-subtle mt-1">عبر تقنيات الصوت الغامر Dolby</Text>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Headphones className="w-6 h-6" />
          </div>
        </Container>

        {/* Card 4: Churn Risk */}
        <Container className="p-5 flex items-center justify-between border-r-4 border-r-amber-500 bg-ui-bg-base shadow-xs">
          <div>
            <Text className="text-xs text-ui-fg-muted font-bold mb-1">مؤشر مخاطر انقطاع القراءة</Text>
            <div className="flex items-baseline gap-2">
              <Heading level="h2" className="text-2xl font-black text-amber-600">
                {metrics.at_risk_readers_count}
              </Heading>
              <Badge color={metrics.at_risk_readers_count > 0 ? "orange" : "green"} className="text-[10px]">
                {metrics.at_risk_readers_count > 0 ? "بحاجة لتنشيط" : "مستقر تماماً"}
              </Badge>
            </div>
            <Text className="text-[11px] text-ui-fg-subtle mt-1">انقطاع القراءة أكثر من 20 يوماً</Text>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Flame className="w-6 h-6" />
          </div>
        </Container>
      </div>

      {/* Filter and Live Search Bar */}
      <Container className="p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-ui-bg-base">
        <div className="relative flex-1 max-w-md">
          <Input
            placeholder="بحث فوري: اسم القارئ، البريد، رقم الهاتف، أو المدينة..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-9 text-xs h-9"
          />
          <Search className="w-4 h-4 text-ui-fg-muted absolute right-3 top-2.5 pointer-events-none" />
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Format Filter */}
          <select
            value={formatFilter}
            onChange={(e) => setFormatFilter(e.target.value)}
            className="h-9 px-3 text-xs rounded-lg border border-ui-border-base bg-ui-bg-field text-ui-fg-base focus:outline-none"
          >
            <option value="all">كافة صيغ القراءة</option>
            <option value="hybrid">هجين (صوتي + ورقي)</option>
            <option value="deluxe_paperback">طبعات ورقية فاخرة وموقعة</option>
            <option value="audiobook_immersive">كتب صوتية غامرة</option>
            <option value="drm_digital_ebook">رقمي محمي DRM</option>
            <option value="collector_bundle">باقة النخبة والمجموعات</option>
          </select>

          {/* Tier Filter */}
          <select
            value={tierFilter}
            onChange={(e) => setTierFilter(e.target.value)}
            className="h-9 px-3 text-xs rounded-lg border border-ui-border-base bg-ui-bg-field text-ui-fg-base focus:outline-none"
          >
            <option value="all">كافة رتب العضوية</option>
            <option value="platinum_elite">الصالون البلاتيني الممتاز</option>
            <option value="gold_salon">نادي النخبة الذهبي</option>
            <option value="silver_club">القارئ الفضي</option>
            <option value="bronze_reader">القارئ المبتدئ</option>
          </select>

          {/* Risk Filter */}
          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="h-9 px-3 text-xs rounded-lg border border-ui-border-base bg-ui-bg-field text-ui-fg-base focus:outline-none"
          >
            <option value="all">كافة مستويات المخاطر</option>
            <option value="low">مخاطر منخفضة (نشط ومتفاعل)</option>
            <option value="medium">مخاطر متوسطة</option>
            <option value="high">مخاطر مرتفعة (منقطع)</option>
          </select>
        </div>
      </Container>

      {/* Main CRM Readers Table */}
      <Container className="p-0 overflow-hidden bg-ui-bg-base border border-ui-border-base shadow-xs">
        <div className="p-4 border-b border-ui-border-base flex items-center justify-between bg-ui-bg-subtle/50">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-600" />
            <Heading level="h2" className="text-sm font-bold text-ui-fg-base">
              دليل القراء والملفات الموحدة 360° ({filteredCustomers.length})
            </Heading>
          </div>
          <Badge color="blue" className="text-xs">
            ربط مباشر مع PostgreSQL
          </Badge>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs border-collapse">
            <thead className="bg-ui-bg-subtle border-b border-ui-border-base text-ui-fg-muted font-bold">
              <tr>
                <th className="py-3 px-4 text-right">القارئ والمدينة</th>
                <th className="py-3 px-4 text-right">فئة الاشتراك (VIP Tier)</th>
                <th className="py-3 px-4 text-right">الصيغة المفضلة</th>
                <th className="py-3 px-4 text-right">القياس الصوتي</th>
                <th className="py-3 px-4 text-right">مؤشر التفاعل</th>
                <th className="py-3 px-4 text-right">الإنفاق الدائم (LTV)</th>
                <th className="py-3 px-4 text-right">مخاطر الانقطاع</th>
                <th className="py-3 px-4 text-left">الإجراءات السريعة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ui-border-base">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-ui-fg-muted">
                    لا توجد سجلات مطابقة لمعايير البحث الحالية.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer: any) => (
                  <tr
                    key={customer.id}
                    onClick={() => setSelectedCustomer(customer)}
                    className="hover:bg-ui-bg-subtle-hover cursor-pointer transition-colors"
                  >
                    {/* Customer Info */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={customer.avatar}
                          alt={customer.name}
                          className="w-10 h-10 rounded-full object-cover border border-ui-border-base shrink-0"
                        />
                        <div>
                          <Text className="font-bold text-ui-fg-base text-xs">{customer.name}</Text>
                          <div className="flex items-center gap-1.5 text-[11px] text-ui-fg-muted mt-0.5">
                            <MapPin className="w-3 h-3 text-ui-fg-subtle shrink-0" />
                            <span>{customer.city}</span>
                            <span>•</span>
                            <span dir="ltr">{customer.phone}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Tier */}
                    <td className="py-3.5 px-4">
                      <Badge
                        color={
                          customer.vip_tier === "platinum_elite"
                            ? "purple"
                            : customer.vip_tier === "gold_salon"
                            ? "orange"
                            : customer.vip_tier === "silver_club"
                            ? "blue"
                            : "grey"
                        }
                        className="text-[11px] font-semibold"
                      >
                        {customer.vip_tier_ar}
                      </Badge>
                    </td>

                    {/* Preferred Format */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 text-ui-fg-base">
                        {customer.preferred_format?.includes("audio") ? (
                          <Headphones className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                        ) : customer.preferred_format?.includes("paperback") ? (
                          <ShoppingBag className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        ) : customer.preferred_format?.includes("ebook") ? (
                          <BookOpen className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        ) : (
                          <Sparkles className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                        )}
                        <span className="text-xs truncate max-w-[150px]">{customer.preferred_format_ar}</span>
                      </div>
                    </td>

                    {/* Audio Hours */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1">
                        <Text className="font-bold text-xs text-ui-fg-base">{customer.audio_hours}</Text>
                        <Text className="text-[10px] text-ui-fg-muted">ساعة</Text>
                      </div>
                      <Text className="text-[10px] text-ui-fg-subtle">{customer.pages_read} صفحة</Text>
                    </td>

                    {/* Engagement Score */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-ui-bg-field rounded-full overflow-hidden shrink-0">
                          <div
                            className={`h-full rounded-full ${
                              customer.engagement_score >= 80
                                ? "bg-emerald-500"
                                : customer.engagement_score >= 60
                                ? "bg-blue-500"
                                : "bg-amber-500"
                            }`}
                            style={{ width: `${customer.engagement_score}%` }}
                          />
                        </div>
                        <span className="font-bold text-[11px]">{customer.engagement_score}%</span>
                      </div>
                    </td>

                    {/* LTV & Orders */}
                    <td className="py-3.5 px-4">
                      <Text className="font-bold text-ui-fg-base text-xs">
                        {parseFloat(customer.lifetime_value_sar).toLocaleString()} ر.س
                      </Text>
                      <Text className="text-[10px] text-ui-fg-muted">{customer.total_orders} طلبات مكتملة</Text>
                    </td>

                    {/* Churn Risk */}
                    <td className="py-3.5 px-4">
                      <Badge
                        color={
                          customer.churn_risk === "low"
                            ? "green"
                            : customer.churn_risk === "medium"
                            ? "orange"
                            : "red"
                        }
                        className="text-[10px]"
                      >
                        {customer.churn_risk === "low"
                          ? "منخفض (آمن)"
                          : customer.churn_risk === "medium"
                          ? "متوسط"
                          : "مرتفع ⚠️"}
                      </Badge>
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4 text-left">
                      <Button
                        size="small"
                        variant="secondary"
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedCustomer(customer)
                        }}
                        className="text-xs h-7 gap-1"
                      >
                        <span>الملف 360°</span>
                        <ChevronRight className="w-3 h-3 rotate-180" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Container>

      {/* Customer 360° Drawer Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-start bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-2xl h-full bg-ui-bg-base border-l border-ui-border-base p-6 overflow-y-auto flex flex-col justify-between shadow-2xl">
            <div className="space-y-6">
              {/* Drawer Top Navigation & Close */}
              <div className="flex items-center justify-between pb-4 border-b border-ui-border-base">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedCustomer.avatar}
                    alt={selectedCustomer.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-purple-500 shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <Heading level="h2" className="text-base font-bold text-ui-fg-base">
                        {selectedCustomer.name}
                      </Heading>
                      <Badge
                        color={
                          selectedCustomer.vip_tier === "platinum_elite"
                            ? "purple"
                            : selectedCustomer.vip_tier === "gold_salon"
                            ? "orange"
                            : "blue"
                        }
                        className="text-[10px]"
                      >
                        {selectedCustomer.vip_tier_ar}
                      </Badge>
                    </div>
                    <Text className="text-xs text-ui-fg-muted mt-0.5">
                      {selectedCustomer.city} • عضو مسجل برقم ID: {selectedCustomer.id}
                    </Text>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedCustomer(null)}
                  className="p-2 rounded-lg hover:bg-ui-bg-subtle text-ui-fg-muted transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Success Notification Alert */}
              {actionSuccessMsg && (
                <div className="p-3.5 rounded-xl bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span className="font-medium">{actionSuccessMsg}</span>
                </div>
              )}

              {/* Quick Metrics Bar */}
              <div className="grid grid-cols-4 gap-2.5 p-3.5 rounded-2xl bg-ui-bg-subtle border border-ui-border-base text-center">
                <div>
                  <Text className="text-[10px] text-ui-fg-muted font-bold">رصيد الكتب</Text>
                  <Text className="text-lg font-black text-purple-600 mt-0.5">
                    {selectedCustomer.book_credits} رصيد
                  </Text>
                </div>
                <div>
                  <Text className="text-[10px] text-ui-fg-muted font-bold">نقاط الولاء</Text>
                  <Text className="text-lg font-black text-amber-600 mt-0.5">
                    {selectedCustomer.points_balance} ن
                  </Text>
                </div>
                <div>
                  <Text className="text-[10px] text-ui-fg-muted font-bold">ساعات الاستماع</Text>
                  <Text className="text-lg font-black text-blue-600 mt-0.5">
                    {selectedCustomer.audio_hours} س
                  </Text>
                </div>
                <div>
                  <Text className="text-[10px] text-ui-fg-muted font-bold">الإنفاق (LTV)</Text>
                  <Text className="text-lg font-black text-emerald-600 mt-0.5">
                    {parseFloat(selectedCustomer.lifetime_value_sar).toLocaleString()} ر.س
                  </Text>
                </div>
              </div>

              {/* Navigation Tabs inside Drawer */}
              <div className="flex items-center gap-2 border-b border-ui-border-base pb-2">
                <button
                  onClick={() => setActiveDrawerTab("telemetry")}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 ${
                    activeDrawerTab === "telemetry"
                      ? "bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300"
                      : "text-ui-fg-muted hover:bg-ui-bg-subtle"
                  }`}
                >
                  <Activity className="w-3.5 h-3.5" />
                  <span>القياس وسلوك القراءة</span>
                </button>
                <button
                  onClick={() => setActiveDrawerTab("whatsapp")}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 ${
                    activeDrawerTab === "whatsapp"
                      ? "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300"
                      : "text-ui-fg-muted hover:bg-ui-bg-subtle"
                  }`}
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>إرسال واتساب مباشر</span>
                </button>
                <button
                  onClick={() => setActiveDrawerTab("loyalty")}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 ${
                    activeDrawerTab === "loyalty"
                      ? "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300"
                      : "text-ui-fg-muted hover:bg-ui-bg-subtle"
                  }`}
                >
                  <Gift className="w-3.5 h-3.5" />
                  <span>الولاء والرتبة</span>
                </button>
                <button
                  onClick={() => setActiveDrawerTab("notes")}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 ${
                    activeDrawerTab === "notes"
                      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                      : "text-ui-fg-muted hover:bg-ui-bg-subtle"
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>ملاحظات الفريق ({selectedCustomer.notes?.length || 0})</span>
                </button>
              </div>

              {/* Tab 1: Telemetry & Reading Habits */}
              {activeDrawerTab === "telemetry" && (
                <div className="space-y-4">
                  {/* Currently Reading & Progress */}
                  <div className="p-4 rounded-2xl border border-ui-border-base bg-ui-bg-subtle space-y-3">
                    <div className="flex items-center justify-between">
                      <Text className="text-xs font-bold text-ui-fg-base flex items-center gap-1.5">
                        <BookOpen className="w-4 h-4 text-purple-600" />
                        <span>يقرأ ويستمع حالياً:</span>
                      </Text>
                      <Badge color="purple" className="text-[10px]">
                        سرعة السرد: {selectedCustomer.preferred_speed}
                      </Badge>
                    </div>
                    <div className="p-3 bg-ui-bg-base rounded-xl border border-ui-border-base">
                      <Text className="font-bold text-xs text-ui-fg-base">
                        {selectedCustomer.currently_reading}
                      </Text>
                      <div className="mt-2 flex items-center justify-between text-[11px] text-ui-fg-muted">
                        <span>تقدم القراءة والاستماع</span>
                        <span className="font-bold text-purple-600">68% مكتمل</span>
                      </div>
                      <div className="w-full h-2 bg-ui-bg-field rounded-full mt-1 overflow-hidden">
                        <div className="h-full bg-purple-600 rounded-full" style={{ width: "68%" }} />
                      </div>
                    </div>
                  </div>

                  {/* Reading Statistics Breakdown */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3.5 rounded-xl border border-ui-border-base bg-ui-bg-field space-y-1">
                      <Text className="text-[11px] text-ui-fg-muted">الروايات المكتملة</Text>
                      <Text className="text-base font-black text-ui-fg-base">
                        {selectedCustomer.completed_books_count} أعمال مكتملة
                      </Text>
                    </div>
                    <div className="p-3.5 rounded-xl border border-ui-border-base bg-ui-bg-field space-y-1">
                      <Text className="text-[11px] text-ui-fg-muted">الصفحات المقروءة</Text>
                      <Text className="text-base font-black text-ui-fg-base">
                        {selectedCustomer.pages_read} صفحة
                      </Text>
                    </div>
                  </div>

                  {/* Churn Prediction & Retention Early Warning */}
                  <div className="p-4 rounded-2xl border border-amber-200 bg-amber-50/50 dark:border-amber-900/50 dark:bg-amber-950/20 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Flame className="w-4 h-4 text-amber-600" />
                        <Text className="text-xs font-bold text-amber-900 dark:text-amber-200">
                          نظام التنبؤ بمخاطر الانقطاع (AI Churn Early Warning)
                        </Text>
                      </div>
                      <Badge
                        color={
                          selectedCustomer.churn_risk === "low"
                            ? "green"
                            : selectedCustomer.churn_risk === "medium"
                            ? "orange"
                            : "red"
                        }
                      >
                        درجة المخاطرة: {selectedCustomer.churn_score}/100
                      </Badge>
                    </div>
                    <Text className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
                      {selectedCustomer.churn_risk === "high"
                        ? "⚠️ تنبيه عالي الأهمية: القارئ لم يسجل أي جلسة استماع أو شراء منذ أكثر من 25 يوماً مع وجود رصيد معلق. يُنصح بإرسال رسالة تنشيط واستئناف القراءة فوراً."
                        : selectedCustomer.churn_risk === "medium"
                        ? "مستوى نشاط متوسط. تم اقتراح إرسال توصية بأحدث الإصدارات المطابقة لذوقه الأدبي."
                        : "سلوك القارئ ممتاز ومتفاعل بانتظام. لا توجد أي مخاطر انسحاب مسجلة."}
                    </Text>
                  </div>
                </div>
              )}

              {/* Tab 2: WhatsApp & Communications Dispatch */}
              {activeDrawerTab === "whatsapp" && (
                <form onSubmit={handleSendMessage} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Text className="text-xs font-bold text-ui-fg-base flex items-center gap-1.5">
                      <Send className="w-4 h-4 text-blue-600" />
                      <span>إرسال رسالة مباشرة للقارئ:</span>
                    </Text>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setDispatchChannel("whatsapp")}
                        className={`px-2.5 py-1 text-[11px] font-bold rounded-md ${
                          dispatchChannel === "whatsapp"
                            ? "bg-emerald-600 text-white"
                            : "bg-ui-bg-subtle text-ui-fg-muted"
                        }`}
                      >
                        واتساب (WhatsApp)
                      </button>
                      <button
                        type="button"
                        onClick={() => setDispatchChannel("sms")}
                        className={`px-2.5 py-1 text-[11px] font-bold rounded-md ${
                          dispatchChannel === "sms"
                            ? "bg-blue-600 text-white"
                            : "bg-ui-bg-subtle text-ui-fg-muted"
                        }`}
                      >
                        رسالة نصية (SMS)
                      </button>
                      <button
                        type="button"
                        onClick={() => setDispatchChannel("email")}
                        className={`px-2.5 py-1 text-[11px] font-bold rounded-md ${
                          dispatchChannel === "email"
                            ? "bg-purple-600 text-white"
                            : "bg-ui-bg-subtle text-ui-fg-muted"
                        }`}
                      >
                        بريد إلكتروني
                      </button>
                    </div>
                  </div>

                  {/* Template Picker */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] text-ui-fg-muted font-bold">قالب الرسالة المعتمد:</label>
                    <select
                      value={selectedTemplate}
                      onChange={(e) => setSelectedTemplate(e.target.value)}
                      className="w-full h-8 px-3 text-xs rounded-lg border border-ui-border-base bg-ui-bg-field"
                    >
                      <option value="recommendation">توصية كتاب جديد حسب اهتمامات القارئ 📚</option>
                      <option value="winback">تنشيط واستئناف القراءة بعد فترة انقطاع ☕</option>
                      <option value="completion_bonus">مكافأة إتمام الرواية + رصيد مجاني 🎖️</option>
                      <option value="vip_salon_invite">دعوة خاصة لحضور جلسة الصالون الأدبي VIP ✨</option>
                      <option value="delivery_followup">متابعة استلام طبعة ورقية موقعة فاخرة 📦</option>
                    </select>
                  </div>

                  {/* Subject Input */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] text-ui-fg-muted font-bold">عنوان الإشعار:</label>
                    <Input
                      value={customMsgSubject}
                      onChange={(e) => setCustomMsgSubject(e.target.value)}
                      className="text-xs h-8"
                    />
                  </div>

                  {/* Message Body */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] text-ui-fg-muted font-bold">نص الرسالة المخصص:</label>
                    <textarea
                      rows={4}
                      value={customMsgBody}
                      onChange={(e) => setCustomMsgBody(e.target.value)}
                      className="w-full p-2.5 text-xs rounded-xl border border-ui-border-base bg-ui-bg-field text-ui-fg-base focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <Text className="text-[11px] text-ui-fg-muted">
                      سيتم إرسال الرسالة إلى:{" "}
                      <span className="font-bold text-ui-fg-base">
                        {dispatchChannel === "email" ? selectedCustomer.email : selectedCustomer.phone}
                      </span>
                    </Text>
                    <Button type="submit" size="small" disabled={isSubmitting} className="text-xs gap-1.5">
                      <Send className="w-3.5 h-3.5" />
                      <span>{isSubmitting ? "جارِ الإرسال..." : "إرسال الآن وتوثيق بالسجل"}</span>
                    </Button>
                  </div>
                </form>
              )}

              {/* Tab 3: Loyalty & Tier Management */}
              {activeDrawerTab === "loyalty" && (
                <div className="space-y-4">
                  {/* Book Credits Granting */}
                  <div className="p-4 rounded-2xl border border-ui-border-base bg-ui-bg-subtle space-y-3">
                    <Text className="text-xs font-bold text-ui-fg-base flex items-center gap-1.5">
                      <Gift className="w-4 h-4 text-purple-600" />
                      <span>إهداء أرصدة كتب مجانية (Book Credits):</span>
                    </Text>
                    <div className="flex items-center gap-2">
                      <Button
                        size="small"
                        variant="secondary"
                        onClick={() => handleGrantCredit(1)}
                        disabled={isSubmitting}
                        className="text-xs"
                      >
                        +1 رصيد كتاب
                      </Button>
                      <Button
                        size="small"
                        variant="secondary"
                        onClick={() => handleGrantCredit(2)}
                        disabled={isSubmitting}
                        className="text-xs"
                      >
                        +2 رصيد كتاب
                      </Button>
                      <Button
                        size="small"
                        variant="secondary"
                        onClick={() => handleGrantCredit(5)}
                        disabled={isSubmitting}
                        className="text-xs"
                      >
                        +5 أرصدة كتب (باقة VIP)
                      </Button>
                    </div>
                  </div>

                  {/* Loyalty Points Adjustment */}
                  <div className="p-4 rounded-2xl border border-ui-border-base bg-ui-bg-subtle space-y-3">
                    <Text className="text-xs font-bold text-ui-fg-base flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-amber-600" />
                      <span>تعديل رصيد نقاط الولاء:</span>
                    </Text>
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        type="number"
                        placeholder="مقدار النقاط (مثال: 150)"
                        value={pointsDelta}
                        onChange={(e) => setPointsDelta(parseInt(e.target.value) || 0)}
                        className="text-xs h-8"
                      />
                      <Input
                        placeholder="سبب التعديل..."
                        value={pointsReason}
                        onChange={(e) => setPointsReason(e.target.value)}
                        className="text-xs h-8"
                      />
                    </div>
                    <Button
                      size="small"
                      variant="secondary"
                      onClick={handleAdjustPoints}
                      disabled={isSubmitting}
                      className="text-xs"
                    >
                      تطبيق تعديل النقاط في قاعدة البيانات
                    </Button>
                  </div>

                  {/* Tier Upgrade */}
                  <div className="p-4 rounded-2xl border border-ui-border-base bg-ui-bg-subtle space-y-3">
                    <Text className="text-xs font-bold text-ui-fg-base flex items-center gap-1.5">
                      <Crown className="w-4 h-4 text-purple-600" />
                      <span>ترقية رتبة العضوية الأدبية:</span>
                    </Text>
                    <div className="flex items-center gap-2">
                      <select
                        value={newTierSelect}
                        onChange={(e) => setNewTierSelect(e.target.value)}
                        className="h-8 px-3 text-xs rounded-lg border border-ui-border-base bg-ui-bg-field flex-1"
                      >
                        <option value="platinum_elite">الصالون الأدبي البلاتيني الممتاز</option>
                        <option value="gold_salon">نادي النخبة الأدبي الذهبي</option>
                        <option value="silver_club">عضوية القارئ الفضي</option>
                        <option value="bronze_reader">عضوية القارئ المبتدئ</option>
                      </select>
                      <Button
                        size="small"
                        onClick={handleUpdateTier}
                        disabled={isSubmitting}
                        className="text-xs"
                      >
                        ترقية فورية
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 4: Staff Notes & History */}
              {activeDrawerTab === "notes" && (
                <div className="space-y-4">
                  {/* Add Note Form */}
                  <form onSubmit={handleAddNote} className="space-y-2 p-3.5 rounded-2xl border border-ui-border-base bg-ui-bg-subtle">
                    <Text className="text-xs font-bold text-ui-fg-base flex items-center gap-1.5">
                      <MessageSquare className="w-4 h-4 text-emerald-600" />
                      <span>إضافة ملاحظة جديدة لسجل القارئ:</span>
                    </Text>
                    <textarea
                      rows={2}
                      value={newNoteContent}
                      onChange={(e) => setNewNoteContent(e.target.value)}
                      placeholder="اكتب ملاحظة توثيقية (مثلاً: رغبة القارئ في طبعات معينة، مكالمة هاتفية، تفضيل روايات د. غسان الكيلاني...)"
                      className="w-full p-2 text-xs rounded-xl border border-ui-border-base bg-ui-bg-field text-ui-fg-base focus:outline-none"
                    />
                    <div className="flex items-center justify-between">
                      <select
                        value={newNoteType}
                        onChange={(e) => setNewNoteType(e.target.value)}
                        className="h-7 px-2 text-[11px] rounded border border-ui-border-base bg-ui-bg-field"
                      >
                        <option value="call">مكالمة هاتفية</option>
                        <option value="support">دعم فني</option>
                        <option value="preference">تفضيل قراءة</option>
                        <option value="gift">إهداء أو مكافأة</option>
                        <option value="editorial">ملاحظة تحريرية</option>
                      </select>
                      <Button type="submit" size="small" disabled={isSubmitting} className="text-xs">
                        {isSubmitting ? "جارِ الحفظ..." : "حفظ الملاحظة في DB"}
                      </Button>
                    </div>
                  </form>

                  {/* Notes Timeline List */}
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {selectedCustomer.notes && selectedCustomer.notes.length > 0 ? (
                      selectedCustomer.notes.map((note: any) => (
                        <div
                          key={note.id}
                          className="p-3 rounded-xl border border-ui-border-base bg-ui-bg-base text-xs space-y-1"
                        >
                          <div className="flex items-center justify-between text-[11px] text-ui-fg-muted">
                            <span className="font-bold text-ui-fg-base">{note.author_name}</span>
                            <div className="flex items-center gap-1.5">
                              <Badge color="grey" className="text-[9px]">
                                {note.note_type}
                              </Badge>
                              <span>{new Date(note.created_at).toLocaleDateString("ar-SA")}</span>
                            </div>
                          </div>
                          <p className="text-ui-fg-subtle leading-relaxed">{note.content}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-ui-fg-muted text-center py-4">
                        لا توجد ملاحظات مسجلة بعد. استخدم النموذج أعلاه لتوثيق أول ملاحظة.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Close Button */}
            <div className="pt-4 border-t border-ui-border-base mt-6">
              <Button
                variant="secondary"
                onClick={() => setSelectedCustomer(null)}
                className="w-full text-xs"
              >
                إغلاق النافذة
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export const config = defineRouteConfig({
  label: "Reader CRM 360°",
  icon: Users,
})

export default ReaderCrmPage
