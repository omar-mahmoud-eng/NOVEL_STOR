import React, { useState, useEffect } from "react"
import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Text, Badge, Button, Table, Input } from "@medusajs/ui"
import {
  Users,
  Search,
  Phone,
  Mail,
  BookOpen,
  Headphones,
  ShoppingBag,
  Sparkles,
  ShieldCheck,
  HeartHandshake,
  Crown,
  ChevronRight,
  Flame,
  Activity,
  Send,
  Gift,
  Award,
  MessageSquare,
  MessageCircle,
  X,
  CheckCircle2,
  MapPin,
} from "lucide-react"
import { SubNav } from "../../../components/sub-nav"

const crmTabs = [
  { label: "لوحة التحكم (Dashboard)", href: "/app/crm" },
  { label: "سجلات العملاء 360 (Customer 360)", href: "/app/crm/customers", active: true },
  { label: "شرائح وتصنيف الجمهور (Audience Segments)", href: "/app/crm/segments" },
]

const Customer360Page = () => {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [tierFilter, setTierFilter] = useState("all")
  const [formatFilter, setFormatFilter] = useState("all")
  const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null)

  // Drawer action state
  const [activeDrawerTab, setActiveDrawerTab] = useState<"telemetry" | "whatsapp" | "loyalty" | "notes">("telemetry")
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Dispatch state
  const [dispatchChannel, setDispatchChannel] = useState<"whatsapp" | "sms" | "email">("whatsapp")
  const [customMsgSubject, setCustomMsgSubject] = useState("توصية أدبية حصرية من دار النشر 📚")
  const [customMsgBody, setCustomMsgBody] = useState("")

  // Notes state
  const [newNoteContent, setNewNoteContent] = useState("")
  const [newNoteType, setNewNoteType] = useState("call")

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await fetch("/admin/crm")
      if (res.ok) {
        const json = await res.json()
        setData(json)
        if (selectedCustomer) {
          const updated = json.customers?.find((c: any) => c.id === selectedCustomer.id)
          if (updated) setSelectedCustomer(updated)
        }
      }
    } catch (err) {
      console.error("[Customer 360 fetch error]", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const customers = data?.customers || []

  // Pre-fill message body when selected customer changes
  useEffect(() => {
    if (selectedCustomer) {
      setCustomMsgBody(
        `أهلاً بك أ. ${selectedCustomer.name}، نود إعلامكم بتوفر أعمال وروايات جديدة تتناسب مع تفضيلكم (${selectedCustomer.preferred_format_ar}). يسعدنا تقديم كود خصم خاص بكم: VIPREADER20.`
      )
    }
  }, [selectedCustomer])

  const filtered = customers.filter((c: any) => {
    const matchesSearch =
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.email?.toLowerCase().includes(search.toLowerCase()) ||
      c.city?.toLowerCase().includes(search.toLowerCase()) ||
      c.phone?.includes(search)

    const matchesTier = tierFilter === "all" || c.vip_tier === tierFilter
    const matchesFormat = formatFilter === "all" || c.preferred_format === formatFilter

    return matchesSearch && matchesTier && matchesFormat
  })

  // Quick Dispatch Message
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
          template_key: "custom_customer_profile_dispatch",
          recipient: dispatchChannel === "email" ? selectedCustomer.email : selectedCustomer.phone,
          subject: customMsgSubject,
          message_body: customMsgBody.trim(),
          sent_by: "فريق النخبة",
        }),
      })

      if (res.ok) {
        setActionSuccessMsg(`تم إرسال الرسالة عبر ${dispatchChannel.toUpperCase()} بنجاح!`)
        setTimeout(() => setActionSuccessMsg(null), 3500)
        await fetchData()
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Quick Add Note
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
          author_name: "مدير علاقات العملاء",
          note_type: newNoteType,
          content: newNoteContent.trim(),
        }),
      })

      if (res.ok) {
        setNewNoteContent("")
        setActionSuccessMsg("تم توثيق الملاحظة في ملف العميل بنجاح!")
        setTimeout(() => setActionSuccessMsg(null), 3500)
        await fetchData()
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Quick Book Credit
  const handleGrantCredit = async () => {
    if (!selectedCustomer) return
    setIsSubmitting(true)
    try {
      const res = await fetch("/admin/crm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "grant_credit",
          customer_id: selectedCustomer.id,
          credits_delta: 1,
        }),
      })
      if (res.ok) {
        setActionSuccessMsg("تمت إضافة +1 رصيد كتاب مجاني فوراً!")
        setTimeout(() => setActionSuccessMsg(null), 3500)
        await fetchData()
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6" dir="rtl">
      <SubNav
        parentTitle="Reader CRM 360°"
        currentTitle="سجل ملفات القراء الفردية الشامل | Customer 360° Directory"
        description="سجل ملفات القراء الفردية، إحصاءات ساعات الاستماع الصوتية، تكرار الشراء، وسجل التفاعل المباشر المرتبط بقاعدة بيانات PostgreSQL"
        icon={Users}
        tabs={crmTabs}
        onRefresh={fetchData}
        isLoading={loading}
      />

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative max-w-md flex-1">
          <Input
            placeholder="ابحث بالاسم، البريد، رقم الهاتف أو المدينة..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pr-9 text-xs h-9"
          />
          <Search className="w-4 h-4 text-ui-fg-muted absolute right-3 top-2.5 pointer-events-none" />
        </div>

        <div className="flex items-center gap-2.5">
          <select
            value={formatFilter}
            onChange={(e) => setFormatFilter(e.target.value)}
            className="h-9 px-3 text-xs rounded-lg border border-ui-border-base bg-ui-bg-field text-ui-fg-base focus:outline-none"
          >
            <option value="all">كافة صيغ القراءة</option>
            <option value="hybrid">هجين (صوتي + ورقي)</option>
            <option value="deluxe_paperback">طبعات ورقية فاخرة</option>
            <option value="audiobook_immersive">كتب صوتية غامرة</option>
            <option value="drm_digital_ebook">رقمي محمي DRM</option>
          </select>

          <select
            value={tierFilter}
            onChange={(e) => setTierFilter(e.target.value)}
            className="h-9 px-3 text-xs rounded-lg border border-ui-border-base bg-ui-bg-field text-ui-fg-base focus:outline-none"
          >
            <option value="all">كافة رتب الـ VIP</option>
            <option value="platinum_elite">الصالون البلاتيني الممتاز</option>
            <option value="gold_salon">نادي النخبة الذهبي</option>
            <option value="silver_club">عضوية القارئ الفضي</option>
            <option value="bronze_reader">القارئ المبتدئ</option>
          </select>
        </div>
      </div>

      {/* Customers Table */}
      <Container className="p-0 overflow-hidden bg-ui-bg-base border border-ui-border-base shadow-xs">
        <div className="p-4 border-b border-ui-border-base flex items-center justify-between bg-ui-bg-subtle/50">
          <div>
            <Heading level="h2" className="text-sm font-bold text-ui-fg-base">
              دليل القراء والعملاء المعتمدين ({filtered.length})
            </Heading>
            <Text className="text-xs text-ui-fg-subtle">
              بيانات القياس عن بُعد (Telemetry) وسلوك القراءة الفعلي لكل عميل
            </Text>
          </div>
          <Badge color="purple" className="text-xs">
            360 Unified Profile
          </Badge>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs border-collapse">
            <thead className="bg-ui-bg-subtle border-b border-ui-border-base text-ui-fg-muted font-bold">
              <tr>
                <th className="py-3 px-4 text-right">القارئ والبيانات</th>
                <th className="py-3 px-4 text-right">فئة العضوية (Tier)</th>
                <th className="py-3 px-4 text-right">النمط المفضل</th>
                <th className="py-3 px-4 text-right">ساعات الاستماع</th>
                <th className="py-3 px-4 text-right">القيمة الدائمة (LTV)</th>
                <th className="py-3 px-4 text-right">مخاطر المغادرة</th>
                <th className="py-3 px-4 text-left">الملف 360°</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ui-border-base">
              {filtered.map((c: any) => (
                <tr
                  key={c.id}
                  onClick={() => setSelectedCustomer(c)}
                  className="hover:bg-ui-bg-subtle-hover cursor-pointer transition-colors"
                >
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={c.avatar}
                        alt={c.name}
                        className="w-10 h-10 rounded-full object-cover border border-ui-border-base shrink-0"
                      />
                      <div>
                        <div className="font-bold text-xs text-ui-fg-base">{c.name}</div>
                        <div className="text-[11px] text-ui-fg-muted">
                          {c.email} • {c.city}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge
                      color={
                        c.vip_tier === "platinum_elite"
                          ? "purple"
                          : c.vip_tier === "gold_salon"
                          ? "orange"
                          : c.vip_tier === "silver_club"
                          ? "blue"
                          : "grey"
                      }
                      className="text-[11px] font-semibold"
                    >
                      {c.vip_tier_ar}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4 text-xs font-medium text-ui-fg-base">
                    {c.preferred_format_ar}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1 font-bold text-xs text-ui-fg-base">
                      <span>{c.audio_hours}</span>
                      <span className="text-[10px] text-ui-fg-muted font-normal">ساعة</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-black text-xs text-emerald-600">
                    {parseFloat(c.lifetime_value_sar).toLocaleString()} ر.س
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge
                      color={
                        c.churn_risk === "low"
                          ? "green"
                          : c.churn_risk === "medium"
                          ? "orange"
                          : "red"
                      }
                      className="text-[10px]"
                    >
                      {c.churn_risk === "low"
                        ? "منخفضة (آمن)"
                        : c.churn_risk === "medium"
                        ? "متوسطة"
                        : "عالية الخطر ⚠️"}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4 text-left">
                    <Button
                      size="small"
                      variant="secondary"
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedCustomer(c)
                      }}
                      className="text-xs h-7"
                    >
                      عرض الملف 360°
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Container>

      {/* Customer 360° Drawer Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-start bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-2xl h-full bg-ui-bg-base border-l border-ui-border-base p-6 overflow-y-auto flex flex-col justify-between shadow-2xl">
            <div className="space-y-6">
              {/* Header */}
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
                      <Badge color="purple" className="text-[10px]">
                        {selectedCustomer.vip_tier_ar}
                      </Badge>
                    </div>
                    <Text className="text-xs text-ui-fg-muted mt-0.5">
                      {selectedCustomer.city} • هاتف: {selectedCustomer.phone}
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

              {/* Alert */}
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

              {/* Tabs */}
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
                  <span>إرسال مباشر</span>
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
                  <span>الملاحظات ({selectedCustomer.notes?.length || 0})</span>
                </button>
              </div>

              {/* Content Tab 1 */}
              {activeDrawerTab === "telemetry" && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl border border-ui-border-base bg-ui-bg-subtle space-y-2">
                    <div className="flex items-center justify-between">
                      <Text className="text-xs font-bold text-ui-fg-base flex items-center gap-1.5">
                        <BookOpen className="w-4 h-4 text-purple-600" />
                        <span>يقرأ ويستمع حالياً:</span>
                      </Text>
                      <Badge color="purple" className="text-[10px]">
                        سرعة السرد: {selectedCustomer.preferred_speed}
                      </Badge>
                    </div>
                    <Text className="font-bold text-xs text-ui-fg-base p-3 bg-ui-bg-base rounded-xl border border-ui-border-base">
                      {selectedCustomer.currently_reading}
                    </Text>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      size="small"
                      variant="secondary"
                      onClick={handleGrantCredit}
                      disabled={isSubmitting}
                      className="text-xs gap-1"
                    >
                      <Gift className="w-3.5 h-3.5 text-purple-600" />
                      <span>إهداء رصيد كتاب (+1 Credit)</span>
                    </Button>
                  </div>
                </div>
              )}

              {/* Content Tab 2: WhatsApp / Message */}
              {activeDrawerTab === "whatsapp" && (
                <form onSubmit={handleSendMessage} className="space-y-3">
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
                      واتساب
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
                      رسالة SMS
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

                  <Input
                    value={customMsgSubject}
                    onChange={(e) => setCustomMsgSubject(e.target.value)}
                    placeholder="عنوان الإشعار..."
                    className="text-xs h-8"
                  />

                  <textarea
                    rows={4}
                    value={customMsgBody}
                    onChange={(e) => setCustomMsgBody(e.target.value)}
                    placeholder="نص الرسالة..."
                    className="w-full p-2.5 text-xs rounded-xl border border-ui-border-base bg-ui-bg-field text-ui-fg-base focus:outline-none"
                  />

                  <Button type="submit" size="small" disabled={isSubmitting} className="text-xs gap-1.5">
                    <Send className="w-3.5 h-3.5" />
                    <span>إرسال فوري وتوثيق بالسجل</span>
                  </Button>
                </form>
              )}

              {/* Content Tab 3: Notes */}
              {activeDrawerTab === "notes" && (
                <div className="space-y-4">
                  <form onSubmit={handleAddNote} className="space-y-2 p-3.5 rounded-2xl border border-ui-border-base bg-ui-bg-subtle">
                    <textarea
                      rows={2}
                      value={newNoteContent}
                      onChange={(e) => setNewNoteContent(e.target.value)}
                      placeholder="اكتب ملاحظة توثيقية..."
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
                      </select>
                      <Button type="submit" size="small" disabled={isSubmitting} className="text-xs">
                        حفظ الملاحظة
                      </Button>
                    </div>
                  </form>

                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {selectedCustomer.notes && selectedCustomer.notes.length > 0 ? (
                      selectedCustomer.notes.map((note: any) => (
                        <div
                          key={note.id}
                          className="p-3 rounded-xl border border-ui-border-base bg-ui-bg-base text-xs space-y-1"
                        >
                          <div className="flex items-center justify-between text-[11px] text-ui-fg-muted">
                            <span className="font-bold text-ui-fg-base">{note.author_name}</span>
                            <span>{new Date(note.created_at).toLocaleDateString("ar-SA")}</span>
                          </div>
                          <p className="text-ui-fg-subtle leading-relaxed">{note.content}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-ui-fg-muted text-center py-4">
                        لا توجد ملاحظات مسجلة بعد.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Close */}
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
  label: "سجلات العملاء 360",
})

export default Customer360Page
