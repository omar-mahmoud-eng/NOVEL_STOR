import {adminFetch} from "../../lib/admin-fetch"
import React, { useState, useEffect } from "react"
import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Text, Badge, Button, Table, Input } from "@medusajs/ui"
import {
  Headphones,
  MessageSquare,
  AlertTriangle,
  Clock,
  CheckCircle2,
  RefreshCw,
  Send,
  User,
  Package,
  Sparkles,
  Inbox,
} from "lucide-react"
import { SubNav } from "../../components/sub-nav"

const helpdeskTabs = [
  { label: "لوحة التحكم (Dashboard)", href: "/app/helpdesk", active: true },
  { label: "صندوق المحادثات والتذاكر (Inbox)", href: "/app/helpdesk/inbox" },
  { label: "الردود الجاهزة والماكرو (Canned Replies)", href: "/app/helpdesk/canned-replies" },
]

const HelpdeskPage = () => {
  const [tickets, setTickets] = useState<any[]>([])
  const [messages, setMessages] = useState<any[]>([])
  const [summary, setSummary] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedTicket, setSelectedTicket] = useState<any>(null)
  const [replyMessage, setReplyMessage] = useState("")
  const [replyStatus, setReplyStatus] = useState("resolved")
  const [isSending, setIsSending] = useState(false)

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await adminFetch("/admin/helpdesk")
      if (res.ok) {
        const data = await res.json()
        setTickets(data.tickets || [])
        setMessages(data.messages || [])
        setSummary(data.summary || null)
        if (!selectedTicket && data.tickets?.length > 0) {
          setSelectedTicket(data.tickets[0])
        }
      }
    } catch (err) {
      console.error("Error fetching helpdesk data:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedTicket || !replyMessage.trim()) return
    setIsSending(true)
    try {
      const res = await adminFetch("/admin/helpdesk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ticket_id: selectedTicket.id,
          sender_name: "مدير خدمة العملاء - فريق الدعم",
          message: replyMessage.trim(),
          new_new_status: replyStatus,
        }),
      })
      if (res.ok) {
        setReplyMessage("")
        await fetchData()
        // Update selected ticket in place
        setSelectedTicket((prev: any) => ({
          ...prev,
          status: replyStatus,
        }))
      }
    } catch (err) {
      console.error("Error sending reply:", err)
    } finally {
      setIsSending(false)
    }
  }

  const filteredTickets = tickets.filter((t) => {
    if (statusFilter === "all") return true
    return t.status === statusFilter
  })

  const currentMessages = messages.filter((m) => m.ticket_id === selectedTicket?.id)

  const getPriorityBadge = (prio: string) => {
    switch (prio?.toLowerCase()) {
      case "urgent":
        return <Badge color="red" className="font-bold">⚠️ عاجل جداً</Badge>
      case "high":
        return <Badge color="orange" className="font-semibold">عالي الأولوية</Badge>
      default:
        return <Badge color="blue">عادي</Badge>
    }
  }

  const getStatusBadge = (st: string) => {
    switch (st?.toLowerCase()) {
      case "resolved":
        return <Badge color="green">تم الحل بنجاح</Badge>
      case "in_progress":
        return <Badge color="blue">قيد المعالجة</Badge>
      default:
        return <Badge color="orange">مفتوحة بانتظار الرد</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <SubNav
        parentTitle="Helpdesk & Support"
        currentTitle="Support Overview & SLA Performance"
        description="بديل مدمج أصيل لـ (Zendesk & Gorgias) لإدارة تذاكر استفسارات الشحن وتفعيل الروايات الرقمية والرد الفوري"
        icon={Headphones}
        tabs={helpdeskTabs}
        onRefresh={fetchData}
        isLoading={loading}
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Container className="p-5 border-l-4 border-l-sky-600">
          <div className="flex items-center justify-between">
            <Text className="text-sm font-medium text-ui-fg-subtle">إجمالي تذاكر الدعم</Text>
            <Inbox className="w-5 h-5 text-sky-600" />
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-ui-fg-base">
              {summary ? summary.total_tickets : "0"}
            </span>
            <span className="text-sm text-ui-fg-subtle mr-2">تذكرة</span>
          </div>
          <Text className="text-xs text-ui-fg-subtle mt-2">عبر قنوات المتجر والبريد</Text>
        </Container>

        <Container className="p-5 border-l-4 border-l-amber-500">
          <div className="flex items-center justify-between">
            <Text className="text-sm font-medium text-ui-fg-subtle">تذاكر مفتوحة بانتظار الرد</Text>
            <Clock className="w-5 h-5 text-amber-500" />
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-amber-600">
              {summary ? summary.open_count : "0"}
            </span>
          </div>
          <Text className="text-xs text-amber-700 mt-2 font-medium">تتطلب استجابة سريعة</Text>
        </Container>

        <Container className="p-5 border-l-4 border-l-blue-500">
          <div className="flex items-center justify-between">
            <Text className="text-sm font-medium text-ui-fg-subtle">قيد المعالجة والتحري</Text>
            <MessageSquare className="w-5 h-5 text-blue-500" />
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-blue-600">
              {summary ? summary.in_progress_count : "0"}
            </span>
          </div>
          <Text className="text-xs text-ui-fg-subtle mt-2">مع شركات الشحن أو التقنية</Text>
        </Container>

        <Container className="p-5 border-l-4 border-l-red-500">
          <div className="flex items-center justify-between">
            <Text className="text-sm font-medium text-ui-fg-subtle">تذاكر طارئة وعاجلة</Text>
            <AlertTriangle className="w-5 h-5 text-red-500" />
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-red-600">
              {summary ? summary.urgent_count : "0"}
            </span>
          </div>
          <Text className="text-xs text-red-700 mt-2 font-medium">أعلى أولوية استجابة</Text>
        </Container>
      </div>

      {/* Main Split View: Ticket List & Conversation Thread */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Ticket List (Left/Main - 5 cols) */}
        <Container className="p-5 lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <Heading level="h2" className="text-base font-semibold text-ui-fg-base">
              صندوق التذاكر الواردة
            </Heading>
            <div className="flex gap-1 bg-ui-bg-subtle p-0.5 rounded-lg border border-ui-border-base text-xs">
              <button
                onClick={() => setStatusFilter("all")}
                className={`px-2 py-1 rounded ${statusFilter === "all" ? "bg-ui-bg-base font-bold shadow-sm" : "text-ui-fg-subtle"}`}
              >
                الكل
              </button>
              <button
                onClick={() => setStatusFilter("open")}
                className={`px-2 py-1 rounded ${statusFilter === "open" ? "bg-ui-bg-base font-bold text-amber-600 shadow-sm" : "text-ui-fg-subtle"}`}
              >
                المفتوحة
              </button>
              <button
                onClick={() => setStatusFilter("resolved")}
                className={`px-2 py-1 rounded ${statusFilter === "resolved" ? "bg-ui-bg-base font-bold text-green-600 shadow-sm" : "text-ui-fg-subtle"}`}
              >
                المغلقة
              </button>
            </div>
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {filteredTickets.map((t) => (
              <div
                key={t.id}
                onClick={() => setSelectedTicket(t)}
                className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                  selectedTicket?.id === t.id
                    ? "border-sky-500 bg-sky-50/50 shadow-sm"
                    : "border-ui-border-base bg-ui-bg-base hover:bg-ui-bg-subtle"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="font-bold text-sm text-ui-fg-base line-clamp-1">{t.subject}</div>
                  {getPriorityBadge(t.priority)}
                </div>
                <div className="flex items-center gap-2 mt-2 text-xs text-ui-fg-subtle">
                  <User className="w-3.5 h-3.5" />
                  <span>{t.customer_name}</span>
                  {t.order_id && (
                    <span className="font-mono bg-ui-bg-subtle px-1.5 py-0.5 rounded text-[11px]">
                      {t.order_id}
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-ui-border-base/50 text-[11px] text-ui-fg-subtle">
                  <span>{new Date(t.created_at).toLocaleString("ar-SA")}</span>
                  {getStatusBadge(t.status)}
                </div>
              </div>
            ))}
          </div>
        </Container>

        {/* Selected Ticket Conversation & Quick Reply (Right - 7 cols) */}
        <Container className="p-6 lg:col-span-7 flex flex-col justify-between min-h-[500px]">
          {selectedTicket ? (
            <div className="flex flex-col h-full space-y-4">
              {/* Ticket Details Header */}
              <div className="pb-4 border-b border-ui-border-base">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <Heading level="h2" className="text-lg font-bold text-ui-fg-base">
                      {selectedTicket.subject}
                    </Heading>
                    <div className="flex items-center gap-3 mt-1.5 text-xs text-ui-fg-subtle">
                      <span className="font-medium text-ui-fg-base">العميل: {selectedTicket.customer_name}</span>
                      <span className="font-mono">({selectedTicket.customer_email})</span>
                      {selectedTicket.order_id && (
                        <span className="bg-sky-50 text-sky-700 border border-sky-200 px-2 py-0.5 rounded font-mono text-[11px]">
                          رقم الطلب: {selectedTicket.order_id}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getPriorityBadge(selectedTicket.priority)}
                    {getStatusBadge(selectedTicket.status)}
                  </div>
                </div>
              </div>

              {/* Messages Thread */}
              <div className="flex-1 space-y-3 overflow-y-auto max-h-[350px] p-2 bg-ui-bg-subtle/50 rounded-lg">
                {currentMessages.length === 0 ? (
                  <div className="text-center py-8 text-ui-fg-subtle text-xs">
                    لا توجد رسائل سابقة في هذه التذكرة.
                  </div>
                ) : (
                  currentMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`p-3.5 rounded-lg max-w-[85%] text-sm ${
                        msg.sender_type === "agent"
                          ? "mr-auto bg-sky-600 text-white rounded-br-none"
                          : "ml-auto bg-ui-bg-base border border-ui-border-base text-ui-fg-base rounded-bl-none shadow-sm"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className={`text-xs font-bold ${msg.sender_type === "agent" ? "text-sky-100" : "text-ui-fg-subtle"}`}>
                          {msg.sender_name}
                        </span>
                        <span className={`text-[10px] ${msg.sender_type === "agent" ? "text-sky-200" : "text-ui-fg-subtle"}`}>
                          {new Date(msg.created_at).toLocaleTimeString("ar-SA", { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                      <div className="leading-relaxed whitespace-pre-wrap">{msg.message}</div>
                    </div>
                  ))
                )}
              </div>

              {/* Reply Form */}
              <form onSubmit={handleSendReply} className="pt-3 border-t border-ui-border-base space-y-3">
                <textarea
                  className="w-full text-sm bg-ui-bg-base border border-ui-border-base rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none"
                  rows={3}
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  placeholder="اكتب رد الدعم الفني للعميل هنا..."
                  required
                />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-ui-fg-subtle">تحديث حالة التذكرة إلى:</span>
                    <select
                      className="text-xs bg-ui-bg-base border border-ui-border-base rounded px-2 py-1"
                      value={replyStatus}
                      onChange={(e) => setReplyStatus(e.target.value)}
                    >
                      <option value="resolved">حل التذكرة وإغلاقها (Resolved)</option>
                      <option value="in_progress">قيد المتابعة (In Progress)</option>
                      <option value="open">إبقاء مفتوحة (Open)</option>
                    </select>
                  </div>
                  <Button
                    type="submit"
                    variant="primary"
                    className="bg-sky-600 hover:bg-sky-700 text-white"
                    disabled={isSending || !replyMessage.trim()}
                  >
                    <Send className="w-3.5 h-3.5 ml-1.5" />
                    {isSending ? "جاري الإرسال..." : "إرسال الرد للعميل"}
                  </Button>
                </div>
              </form>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-ui-fg-subtle py-12">
              <Headphones className="w-12 h-12 text-ui-fg-muted mb-2" />
              <p className="text-sm">اختر تذكرة من القائمة الجانبية لعرض تفاصيلها والرد عليها.</p>
            </div>
          )}
        </Container>
      </div>
    </div>
  )
}

export const config = defineRouteConfig({
  label: "Helpdesk & Support",
  icon: Headphones,
})

export default HelpdeskPage
