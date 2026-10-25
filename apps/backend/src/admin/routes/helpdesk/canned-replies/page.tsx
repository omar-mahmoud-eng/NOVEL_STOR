import React, { useState } from "react"
import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Text, Badge, Button, Table, Input } from "@medusajs/ui"
import { MessageSquare, Plus, Copy, CheckCircle2, BookmarkCheck, Sparkles } from "lucide-react"
import { SubNav } from "../../../components/sub-nav"

const helpdeskTabs = [
  { label: "لوحة التحكم (Dashboard)", href: "/app/helpdesk" },
  { label: "صندوق المحادثات والتذاكر (Inbox)", href: "/app/helpdesk/inbox" },
  { label: "الردود الجاهزة والماكرو (Canned Replies)", href: "/app/helpdesk/canned-replies", active: true },
]

const initialTemplates = [
  {
    id: "macro_1",
    title: "تتبع شحنة رواية ورقية",
    category: "الشحن والتوصيل",
    shortcut: "/track",
    body: "أهلاً بك! يمكنك تتبع شحنتك عبر رقم البوليصة التالي لدى شركة الشحن المعتمدة. يستغرق التوصيل عادة بين 2-4 أيام عمل في دول الخليج.",
  },
  {
    id: "macro_2",
    title: "حل مشكلة الاستماع للكتب الصوتية",
    category: "الروايات الصوتية",
    shortcut: "/audio-fix",
    body: "مرحباً! نأسف لأي إزعاج واجهته. يرجى التأكد من تسجيل الدخول بنفس الحساب، وتحديث مشغل الصوت أو تجربة مسح الكاش. تم إعادة مزامنة ترخيص الاستماع لحسابك تلقائياً.",
  },
  {
    id: "macro_3",
    title: "تفعيل اشتراك العضوية VIP",
    category: "الاشتراكات",
    shortcut: "/vip-active",
    body: "سعداء بانضمامك إلى نادي القراء المميزين! تم تفعيل اشتراكك وإضافة رصيدك الشهري فوراً إلى محفظتك. استمتع بقراءة غير محدودة ومزايا حصرية.",
  },
  {
    id: "macro_4",
    title: "سياسة استبدال الكتب الورقية التالفة",
    category: "المرتجعات",
    shortcut: "/replace",
    body: "نعتذر بشدة عن وصول النسخة بحالة غير مرضية. لقد أصدرنا لك طلباً مجانياً لشحن نسخة جديدة تماماً دون أي تكاليف إضافية، وستصلك خلال 48 ساعة.",
  },
]

const CannedRepliesPage = () => {
  const [templates, setTemplates] = useState(initialTemplates)
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState("عام")
  const [shortcut, setShortcut] = useState("")
  const [body, setBody] = useState("")
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [feedback, setFeedback] = useState("")

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !body) return
    const newTpl = {
      id: `macro_${Date.now()}`,
      title,
      category,
      shortcut: shortcut ? (shortcut.startsWith("/") ? shortcut : `/${shortcut}`) : `/reply`,
      body,
    }
    setTemplates([newTpl, ...templates])
    setTitle("")
    setShortcut("")
    setBody("")
    setFeedback("تم إضافة قالب الرد السريع إلى مكتبة الدعم بنجاح!")
    setTimeout(() => setFeedback(""), 3500)
  }

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className="space-y-6">
      <SubNav
        parentTitle="Helpdesk & Support"
        currentTitle="Canned Macros & Fast Replies"
        description="قوالب الردود الجاهزة والماكرو السريع لفرق خدمة العملاء لتسريع الاستجابة وتحسين معدل حل التذاكر"
        icon={MessageSquare}
        tabs={helpdeskTabs}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Templates List */}
        <Container className="lg:col-span-2 p-0 overflow-hidden">
          <div className="p-4 border-b border-ui-border-base flex items-center justify-between">
            <div>
              <Heading level="h2" className="text-base font-bold text-ui-fg-base">
                مكتبة الردود السريعة المعتمدة ({templates.length})
              </Heading>
              <Text className="text-xs text-ui-fg-subtle">
                يمكن لموظفي الدعم نسخ القوالب بنقرة زر أو استدعاؤها عبر الاختصارات السريعة
              </Text>
            </div>
            <Badge color="blue">SLA Fast-Track</Badge>
          </div>

          <div className="divide-y divide-ui-border-base">
            {templates.map((tpl) => (
              <div key={tpl.id} className="p-4 hover:bg-ui-bg-subtle/50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-ui-fg-base">{tpl.title}</span>
                    <Badge color="purple">{tpl.category}</Badge>
                    <span className="font-mono text-xs bg-ui-bg-subtle text-ui-fg-interactive px-2 py-0.5 rounded font-bold">
                      {tpl.shortcut}
                    </span>
                  </div>
                  <Button
                    variant="secondary"
                    size="small"
                    onClick={() => handleCopy(tpl.id, tpl.body)}
                    className="flex items-center gap-1.5"
                  >
                    {copiedId === tpl.id ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700 font-bold">تم النسخ</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>نسخ النص</span>
                      </>
                    )}
                  </Button>
                </div>
                <p className="text-xs text-ui-fg-subtle leading-relaxed bg-ui-bg-subtle/40 p-3 rounded-lg border border-ui-border-base/50">
                  {tpl.body}
                </p>
              </div>
            ))}
          </div>
        </Container>

        {/* Create Template Form */}
        <Container className="p-5 h-fit">
          <Heading level="h2" className="text-base font-bold text-ui-fg-base mb-1">
            إضافة ماكرو جديد
          </Heading>
          <Text className="text-xs text-ui-fg-subtle mb-4">
            صياغة قالب إجابة موحدة للاستفسارات المتكررة
          </Text>

          <form onSubmit={handleAdd} className="space-y-3.5">
            <div>
              <label className="text-xs font-semibold text-ui-fg-base block mb-1">
                عنوان الماكرو
              </label>
              <Input
                placeholder="مثال: استفسار عن موعد توفر الطبعة الثانية"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-ui-fg-base block mb-1">
                التصنيف
              </label>
              <select
                className="w-full text-xs p-2 rounded-md border border-ui-border-base bg-ui-bg-base text-ui-fg-base"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="عام">عام</option>
                <option value="الشحن والتوصيل">الشحن والتوصيل</option>
                <option value="الروايات الصوتية">الروايات الصوتية</option>
                <option value="الاشتراكات">الاشتراكات</option>
                <option value="المرتجعات">المرتجعات</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-ui-fg-base block mb-1">
                اختصار الاستدعاء السريع (Shortcut)
              </label>
              <Input
                placeholder="مثال: /edition2"
                value={shortcut}
                onChange={(e) => setShortcut(e.target.value)}
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-ui-fg-base block mb-1">
                نص الرد الموحد
              </label>
              <textarea
                className="w-full text-xs p-3 rounded-lg border border-ui-border-base bg-ui-bg-base text-ui-fg-base focus:outline-none focus:ring-1 focus:ring-purple-500"
                rows={4}
                placeholder="اكتب نص الرد النموذجي هنا..."
                value={body}
                onChange={(e) => setBody(e.target.value)}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              disabled={!title || !body}
            >
              <Plus className="w-4 h-4 ml-1.5" />
              حفظ القالب في المكتبة
            </Button>

            {feedback && (
              <div className="p-2.5 bg-green-50 border border-green-200 text-green-800 text-xs rounded-md flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                {feedback}
              </div>
            )}
          </form>
        </Container>
      </div>
    </div>
  )
}

export const config = defineRouteConfig({
  label: "Canned Replies",
})

export default CannedRepliesPage
