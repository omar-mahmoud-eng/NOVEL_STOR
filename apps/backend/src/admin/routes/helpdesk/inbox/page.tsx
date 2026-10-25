import React, { useState, useEffect } from "react"
import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Text, Badge, Button, Input } from "@medusajs/ui"
import { Inbox, Headphones, Send, Clock, CheckCircle2, User, AlertTriangle } from "lucide-react"
import { SubNav } from "../../../components/sub-nav"

const helpdeskTabs = [
  { label: "لوحة التحكم (Dashboard)", href: "/app/helpdesk" },
  { label: "صندوق المحادثات والتذاكر (Inbox)", href: "/app/helpdesk/inbox", active: true },
  { label: "الردود الجاهزة والماكرو (Canned Replies)", href: "/app/helpdesk/canned-replies" },
]

const TicketInboxPage = () => {
  const [tickets, setTickets] = useState<any[]>([])
  const [messages, setMessages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTicket, setSelectedTicket] = useState<any>(null)
  const [replyMessage, setReplyMessage] = useState("")
  const [replyStatus, setReplyStatus] = useState("resolved")
  const [isSending, setIsSending] = useState(false)
  const [feedback, setFeedback] = useState("")

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await fetch("/admin/helpdesk")
      if (res.ok) {
        const data = await res.json()
        setTickets(data.tickets || [])
        setMessages(data.messages || [])
        if (!selectedTicket && data.tickets?.length > 0) {
          setSelectedTicket(data.tickets[0])
        }
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

  const currentMessages = messages.filter((m) => m.ticket_id === selectedTicket?.id)

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedTicket || !replyMessage.trim()) return
    setIsSending(true)
    try {
      const res = await fetch("/admin/helpdesk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ticket_id: selectedTicket.id,
          message: replyMessage,
          status: replyStatus,
        }),
      })
      if (res.ok) {
        setFeedback("تم إرسال الرد وتحديث حالة التذكرة بنجاح!")
        setReplyMessage("")
        setTimeout(() => setFeedback(""), 3500)
        fetchData()
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="space-y-6">
      <SubNav
        parentTitle="Helpdesk & Support"
        currentTitle="Live Ticket Inbox & Threads"
        description="صندوق الوارد المباشر، الرد الفوري على استفسارات الروايات والشحن وتغيير حالات التذاكر"
        icon={Inbox}
        tabs={helpdeskTabs}
        onRefresh={fetchData}
        isLoading={loading}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[600px]">
        {/* Ticket List (Left 5 Cols) */}
        <Container className="lg:col-span-5 p-0 overflow-hidden flex flex-col">
          <div className="p-3.5 border-b border-ui-border-base bg-ui-bg-subtle/50 flex items-center justify-between">
            <span className="text-xs font-bold text-ui-fg-base">
              جميع التذاكر الواردة ({tickets.length})
            </span>
            <Badge color="blue">Direct Customer Care</Badge>
          </div>

          <div className="divide-y divide-ui-border-base overflow-y-auto max-h-[650px]">
            {tickets.length === 0 ? (
              <div className="p-8 text-center text-xs text-ui-fg-subtle">
                لا توجد تذاكر حالياً
              </div>
            ) : (
              tickets.map((t) => {
                const isSelected = selectedTicket?.id === t.id
                return (
                  <button
                    key={t.id}
                    onClick={() => setSelectedTicket(t)}
                    className={`w-full text-right p-4 transition-all hover:bg-ui-bg-subtle block ${
                      isSelected ? "bg-ui-bg-subtle border-r-4 border-r-sky-500" : ""
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-xs text-ui-fg-base truncate max-w-[200px]">
                        {t.subject}
                      </span>
                      <Badge
                        color={
                          t.status === "resolved"
                            ? "green"
                            : t.status === "in_progress"
                            ? "blue"
                            : "orange"
                        }
                      >
                        {t.status === "resolved" ? "مغلقة" : t.status === "in_progress" ? "جارية" : "مفتوحة"}
                      </Badge>
                    </div>
                    <div className="text-xs text-ui-fg-subtle line-clamp-2 mb-2">
                      {t.description || "لا يوجد وصف إضافي"}
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-ui-fg-muted">
                      <span>{t.customer_email || "عميل مسجل"}</span>
                      <span>{t.created_at ? new Date(t.created_at).toLocaleDateString("ar-SA") : ""}</span>
                    </div>
                  </button>
                )
              })
            )}
          </div>
        </Container>

        {/* Ticket Details & Chat (Right 7 Cols) */}
        <Container className="lg:col-span-7 p-5 flex flex-col justify-between">
          {selectedTicket ? (
            <div className="space-y-4 flex flex-col h-full justify-between">
              <div>
                {/* Header */}
                <div className="pb-3 border-b border-ui-border-base flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-base text-ui-fg-base">{selectedTicket.subject}</h3>
                    <div className="text-xs text-ui-fg-subtle mt-0.5">
                      العميل: {selectedTicket.customer_email} | الأولوية: {selectedTicket.priority}
                    </div>
                  </div>
                  <Badge color={selectedTicket.status === "resolved" ? "green" : "orange"}>
                    {selectedTicket.status}
                  </Badge>
                </div>

                {/* Messages Feed */}
                <div className="py-4 space-y-3 max-h-[380px] overflow-y-auto">
                  <div className="bg-ui-bg-subtle/70 p-3.5 rounded-lg border border-ui-border-base">
                    <div className="text-[11px] font-bold text-ui-fg-base mb-1">
                      رسالة العميل الافتتاحية:
                    </div>
                    <p className="text-xs text-ui-fg-subtle whitespace-pre-wrap">
                      {selectedTicket.description}
                    </p>
                  </div>

                  {currentMessages.map((m) => (
                    <div
                      key={m.id}
                      className={`p-3.5 rounded-lg text-xs ${
                        m.sender_type === "admin"
                          ? "bg-sky-50 border border-sky-200 text-sky-950 mr-6"
                          : "bg-ui-bg-subtle border border-ui-border-base ml-6"
                      }`}
                    >
                      <div className="flex items-center justify-between font-bold text-[10px] mb-1">
                        <span>{m.sender_type === "admin" ? "فريق الدعم (Admin)" : "العميل"}</span>
                        <span>{new Date(m.created_at).toLocaleTimeString("ar-SA")}</span>
                      </div>
                      <p className="whitespace-pre-wrap">{m.body}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reply Form */}
              <form onSubmit={handleSendReply} className="pt-3 border-t border-ui-border-base space-y-3">
                <textarea
                  className="w-full text-xs p-3 rounded-lg border border-ui-border-base bg-ui-bg-base text-ui-fg-base focus:outline-none focus:ring-1 focus:ring-sky-500"
                  rows={3}
                  placeholder="اكتب رد الدعم الفني هنا مباشرة..."
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  required
                />
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-ui-fg-subtle font-medium">تغيير الحالة:</span>
                    <select
                      value={replyStatus}
                      onChange={(e) => setReplyStatus(e.target.value)}
                      className="text-xs p-1.5 rounded-md border border-ui-border-base bg-ui-bg-base"
                    >
                      <option value="resolved">تم الحل (Resolved)</option>
                      <option value="in_progress">قيد المتابعة (In Progress)</option>
                      <option value="open">إبقاء مفتوحة (Open)</option>
                    </select>
                  </div>

                  <Button
                    type="submit"
                    className="bg-sky-600 hover:bg-sky-700 text-white"
                    disabled={isSending || !replyMessage.trim()}
                  >
                    <Send className="w-3.5 h-3.5 ml-1.5" />
                    {isSending ? "جاري الإرسال..." : "إرسال الرد"}
                  </Button>
                </div>

                {feedback && (
                  <div className="p-2 bg-green-50 border border-green-200 text-green-800 text-xs rounded flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                    {feedback}
                  </div>
                )}
              </form>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-ui-fg-subtle">
              <Inbox className="w-10 h-10 mb-2 opacity-50" />
              <p className="text-xs">اختر تذكرة من اليسار لبدء المراسلة الفورية</p>
            </div>
          )}
        </Container>
      </div>
    </div>
  )
}

export const config = defineRouteConfig({
  label: "Ticket Inbox",
})

export default TicketInboxPage
