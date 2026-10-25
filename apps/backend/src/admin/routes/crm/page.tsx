import React, { useState } from "react"
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
} from "lucide-react"
import { SubNav } from "../../components/sub-nav"

const crmTabs = [
  { label: "لوحة التحكم (Dashboard)", href: "/app/crm", active: true },
  { label: "سجلات العملاء 360 (Customer 360)", href: "/app/crm/customers" },
  { label: "شرائح وتصنيف الجمهور (Audience Segments)", href: "/app/crm/segments" },
]

type ReaderCustomer = {
  id: string
  name: string
  email: string
  phone: string
  city: string
  avatar: string
  tier: "vip_annual" | "vip_monthly" | "kids_pass" | "regular_buyer"
  tierLabelAr: string
  tierLabelEn: string
  preferredFormat: "audiobook" | "ebook" | "paperback" | "hybrid"
  formatLabelAr: string
  engagementScore: number // 0-100
  totalOrders: number
  lifetimeValue: number // in SAR
  bookCredits: number
  churnRisk: "low" | "medium" | "high"
  lastActivity: string
  readingStats: {
    audioHours: number
    pagesRead: number
    preferredSpeed: string
    completedBooks: string[]
    currentlyReading: string
  }
  notes: Array<{
    id: string
    author: string
    date: string
    type: "support" | "preference" | "call" | "gift"
    content: string
  }>
}

const INITIAL_CRM_CUSTOMERS: ReaderCustomer[] = [
  {
    id: "cust_tariq_01",
    name: "طارق المنصور",
    email: "tariq.almansoor@example.com",
    phone: "+966 50 123 4567",
    city: "الرياض (Riyadh)",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80",
    tier: "vip_monthly",
    tierLabelAr: "مشترك VIP شهري",
    tierLabelEn: "Monthly VIP Pass",
    preferredFormat: "hybrid",
    formatLabelAr: "هجين (صوتي + إلكتروني)",
    engagementScore: 94,
    totalOrders: 14,
    lifetimeValue: 1850,
    bookCredits: 2,
    churnRisk: "low",
    lastActivity: "اليوم، 08:30 ص (استماع لرواية شفرة قصر الحمراء)",
    readingStats: {
      audioHours: 52.4,
      pagesRead: 1420,
      preferredSpeed: "1.5x",
      completedBooks: [
        "شفرة قصر الحمراء: لغز المخطوطة الأندلسية",
        "كنز البحار السبعة والبوصلة المفقودة",
      ],
      currentlyReading: "أطياف بغداد القديمة: ملحمة أسرار الرافدين",
    },
    notes: [
      {
        id: "note_1",
        author: "سارة (دعم العملاء)",
        date: "2026-10-22",
        type: "preference",
        content: "يفضل دائماً الاستماع بسرعة 1.5x أثناء القيادة صباحاً، وطلب إشعاره فور توفر روايات د. غسان الكيلاني الجديدة.",
      },
      {
        id: "note_2",
        author: "فهد (إدارة VIP)",
        date: "2026-10-15",
        type: "gift",
        content: "تم إهداؤه رصيد كتاب مجاني تقديراً لإكماله 50 ساعة استماع متواصلة عبر المنصة.",
      },
    ],
  },
  {
    id: "cust_sarah_02",
    name: "سارة العتيبي",
    email: "sarah.otaibi@example.com",
    phone: "+966 54 987 6543",
    city: "جدة (Jeddah)",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
    tier: "kids_pass",
    tierLabelAr: "باقة براعم الأطفال",
    tierLabelEn: "Kids Bedtime Pass",
    preferredFormat: "audiobook",
    formatLabelAr: "قصص صوتية مهدئة للأطفال",
    engagementScore: 89,
    totalOrders: 8,
    lifetimeValue: 740,
    bookCredits: 0,
    churnRisk: "low",
    lastActivity: "أمس، 08:15 م (تشغيل قصة الأرنب سمسم)",
    readingStats: {
      audioHours: 34.2,
      pagesRead: 410,
      preferredSpeed: "1.0x",
      completedBooks: [
        "مغامرة الأرنب الصغير سمسم في الغابة السحرية",
        "أين اختفت نجمتي الساطعة؟",
      ],
      currentlyReading: "أين اختفت نجمتي الساطعة؟ (إعادة تشغيل مسائي)",
    },
    notes: [
      {
        id: "note_3",
        author: "نورة (دعم VIP)",
        date: "2026-10-20",
        type: "call",
        content: "اتصال متابعة: أبدت إعجابها بنبرة صوت الراوية ريم الجودر لمساعدة أطفالها على النوم بهدوء بدون شاشات.",
      },
    ],
  },
  {
    id: "cust_fahad_03",
    name: "فهد الدوسري",
    email: "fahad.dossary@example.com",
    phone: "+966 55 456 7890",
    city: "الدمام (Dammam)",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
    tier: "regular_buyer",
    tierLabelAr: "مشتري نسخ ورقية فاخرة",
    tierLabelEn: "Physical Collector",
    preferredFormat: "paperback",
    formatLabelAr: "ورقي مطبوع فاخر",
    engagementScore: 68,
    totalOrders: 6,
    lifetimeValue: 920,
    bookCredits: 0,
    churnRisk: "medium",
    lastActivity: "قبل 6 أيام (استلام شحنة أرامكس)",
    readingStats: {
      audioHours: 4.0,
      pagesRead: 620,
      preferredSpeed: "1.0x",
      completedBooks: ["سفينة الفضاء السرية وسر كوكب الزمرد"],
      currentlyReading: "كنز البحار السبعة والبوصلة المفقودة",
    },
    notes: [
      {
        id: "note_4",
        author: "خالد (اللوجستيات)",
        date: "2026-10-18",
        type: "support",
        content: "استفسر عن إمكانية الحصول على نسخة ورقية موقعة بخط اليد من الكاتب عمر اليافعي.",
      },
    ],
  },
  {
    id: "cust_mona_04",
    name: "د. منى الهاشمي",
    email: "dr.mona.hashemi@example.com",
    phone: "+971 50 112 2334",
    city: "دبي (Dubai)",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&q=80",
    tier: "vip_annual",
    tierLabelAr: "اشتراك سنوي شامل All-Access",
    tierLabelEn: "Annual VIP Pass",
    preferredFormat: "hybrid",
    formatLabelAr: "هجين شامل لكافة الصيغ",
    engagementScore: 98,
    totalOrders: 26,
    lifetimeValue: 3450,
    bookCredits: 18,
    churnRisk: "low",
    lastActivity: "اليوم، 10:15 ص (قراءة سحابية - أطياف بغداد)",
    readingStats: {
      audioHours: 114.0,
      pagesRead: 3890,
      preferredSpeed: "1.25x",
      completedBooks: [
        "أطياف بغداد القديمة: ملحمة أسرار الرافدين",
        "شفرة قصر الحمراء: لغز المخطوطة الأندلسية",
      ],
      currentlyReading: "أطياف بغداد القديمة (قراءة المخطوطات والتعليقات)",
    },
    notes: [
      {
        id: "note_5",
        author: "فيصل (كبار الشخصيات VIP)",
        date: "2026-10-24",
        type: "gift",
        content: "تمت دعوتها للمشاركة في جلسة نقاش خاصة مع الكاتب د. غسان الكيلاني عبر منصة Zoom.",
      },
    ],
  },
  {
    id: "cust_khalid_05",
    name: "خالد بن سلطان",
    email: "khalid.sultan@example.com",
    phone: "+966 56 333 4455",
    city: "المدينة المنورة (Madinah)",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80",
    tier: "regular_buyer",
    tierLabelAr: "قارئ إلكتروني متقطع",
    tierLabelEn: "Occasional E-Reader",
    preferredFormat: "ebook",
    formatLabelAr: "كتب إلكترونية EPUB",
    engagementScore: 42,
    totalOrders: 2,
    lifetimeValue: 180,
    bookCredits: 0,
    churnRisk: "high",
    lastActivity: "قبل 28 يوماً (قراءة عينة مجانية)",
    readingStats: {
      audioHours: 1.5,
      pagesRead: 110,
      preferredSpeed: "1.0x",
      completedBooks: [],
      currentlyReading: "أين اختفت نجمتي الساطعة؟",
    },
    notes: [
      {
        id: "note_6",
        author: "نظام التنبيهات الآلية",
        date: "2026-10-24",
        type: "preference",
        content: "تم تصنيف القارئ ضمن شريحة المخاطر المرتفعة (High Churn Risk) بسبب غياب النشاط لأكثر من 25 يوماً. مقترح إرسال كوبون خصم ترحيبي.",
      },
    ],
  },
]

export function ReaderCrmPage() {
  const [customers, setCustomers] = useState<ReaderCustomer[]>(INITIAL_CRM_CUSTOMERS)
  const [searchQuery, setSearchQuery] = useState("")
  const [tierFilter, setTierFilter] = useState<string>("all")
  const [riskFilter, setRiskFilter] = useState<string>("all")
  const [selectedCustomer, setSelectedCustomer] = useState<ReaderCustomer | null>(null)

  // Quick Action form state inside drawer
  const [newNoteContent, setNewNoteContent] = useState("")
  const [newNoteType, setNewNoteType] = useState<"support" | "preference" | "call" | "gift">("call")
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null)

  // Calculations for executive KPI cards
  const totalCustomers = customers.length
  const totalVipCount = customers.filter((c) => c.tier.startsWith("vip")).length
  const avgLtv = Math.round(
    customers.reduce((acc, c) => acc + c.lifetimeValue, 0) / totalCustomers
  )
  const highRiskCount = customers.filter((c) => c.churnRisk === "high").length

  // Filtered customers
  const filteredCustomers = customers.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.city.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesTier = tierFilter === "all" || c.tier === tierFilter
    const matchesRisk = riskFilter === "all" || c.churnRisk === riskFilter

    return matchesSearch && matchesTier && matchesRisk
  })

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedCustomer || !newNoteContent.trim()) return

    const newNote = {
      id: `note_${Date.now()}`,
      author: "مسؤول خدمة القراء (Admin)",
      date: new Date().toISOString().split("T")[0],
      type: newNoteType,
      content: newNoteContent.trim(),
    }

    const updated = customers.map((c) => {
      if (c.id === selectedCustomer.id) {
        return {
          ...c,
          notes: [newNote, ...c.notes],
        }
      }
      return c
    })

    setCustomers(updated)
    setSelectedCustomer({
      ...selectedCustomer,
      notes: [newNote, ...selectedCustomer.notes],
    })
    setNewNoteContent("")
    setActionSuccessMsg("تم حفظ الملاحظة بنجاح في سجل القارئ!")
    setTimeout(() => setActionSuccessMsg(null), 3000)
  }

  const handleGiftCredit = (customerId: string) => {
    const updated = customers.map((c) => {
      if (c.id === customerId) {
        return {
          ...c,
          bookCredits: c.bookCredits + 1,
        }
      }
      return c
    })
    setCustomers(updated)
    if (selectedCustomer && selectedCustomer.id === customerId) {
      setSelectedCustomer({
        ...selectedCustomer,
        bookCredits: selectedCustomer.bookCredits + 1,
      })
    }
    setActionSuccessMsg("تمت إضافة +1 رصيد كتاب مجاني لحساب القارئ فوراً!")
    setTimeout(() => setActionSuccessMsg(null), 3000)
  }

  const handleSendOffer = (promoCode: string) => {
    setActionSuccessMsg(`تم إرسال بريد العرض الخاص بكود الخصم [${promoCode}] للقارئ!`)
    setTimeout(() => setActionSuccessMsg(null), 3500)
  }

  return (
    <div className="space-y-6">
      <SubNav
        parentTitle="Reader CRM 360°"
        currentTitle="Reader Intelligence & Retention Dashboard"
        description="نظام ذكي متكامل لمتابعة سلوك القراءة والاستماع، وإدارة اشتراكات VIP، وتتبع مخاطر الانسحاب، وتقديم الدعم المخصص"
        icon={Users}
        tabs={crmTabs}
      />

      {/* KPI Intelligence Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Container className="p-5 flex items-center justify-between">
          <div>
            <Text className="text-xs text-ui-fg-muted font-medium mb-1">إجمالي القراء المسجلين</Text>
            <div className="flex items-baseline gap-2">
              <Heading level="h2" className="text-2xl font-black">
                {totalCustomers.toLocaleString()}
              </Heading>
              <Badge color="green" className="text-[10px]">
                نشط 100%
              </Badge>
            </div>
            <Text className="text-[11px] text-ui-fg-subtle mt-1">عبر كافة الفئات العمرية</Text>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </Container>

        <Container className="p-5 flex items-center justify-between">
          <div>
            <Text className="text-xs text-ui-fg-muted font-medium mb-1">مشتركو باقات VIP</Text>
            <div className="flex items-baseline gap-2">
              <Heading level="h2" className="text-2xl font-black text-purple-600">
                {totalVipCount}
              </Heading>
              <Badge color="purple" className="text-[10px]">
                {Math.round((totalVipCount / totalCustomers) * 100)}%
              </Badge>
            </div>
            <Text className="text-[11px] text-ui-fg-subtle mt-1">توليد اشتراكات دورية متكررة</Text>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Sparkles className="w-6 h-6" />
          </div>
        </Container>

        <Container className="p-5 flex items-center justify-between">
          <div>
            <Text className="text-xs text-ui-fg-muted font-medium mb-1">متوسط القيمة الدائمة (LTV)</Text>
            <div className="flex items-baseline gap-2">
              <Heading level="h2" className="text-2xl font-black">
                {avgLtv.toLocaleString()} ر.س
              </Heading>
              <Badge color="green" className="text-[10px]">
                +14% هذا الربع
              </Badge>
            </div>
            <Text className="text-[11px] text-ui-fg-subtle mt-1">شامل الكتب الورقية والرقمية</Text>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
        </Container>

        <Container className="p-5 flex items-center justify-between">
          <div>
            <Text className="text-xs text-ui-fg-muted font-medium mb-1">مؤشر مخاطر المغادرة (Churn)</Text>
            <div className="flex items-baseline gap-2">
              <Heading level="h2" className="text-2xl font-black text-amber-600">
                {highRiskCount} قراء
              </Heading>
              <Badge color={highRiskCount > 0 ? "orange" : "green"} className="text-[10px]">
                {highRiskCount > 0 ? "يتطلب تدخلاً" : "مستقر"}
              </Badge>
            </div>
            <Text className="text-[11px] text-ui-fg-subtle mt-1">انقطاع القراءة لأكثر من 20 يوماً</Text>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <AlertCircle className="w-6 h-6" />
          </div>
        </Container>
      </div>

      {/* Filter and Search Bar */}
      <Container className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Input
            placeholder="بحث بالاسم، البريد، أو المدينة..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 text-xs"
          />
          <Search className="w-4 h-4 text-ui-fg-muted absolute left-3 top-2.5 pointer-events-none" />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Tier Filter */}
          <select
            value={tierFilter}
            onChange={(e) => setTierFilter(e.target.value)}
            className="h-8 px-3 text-xs rounded-lg border border-ui-border-base bg-ui-bg-field text-ui-fg-base focus:outline-none"
          >
            <option value="all">جميع الباقات والشرائح</option>
            <option value="vip_monthly">مشترك VIP شهري</option>
            <option value="vip_annual">اشتراك سنوي شامل All-Access</option>
            <option value="kids_pass">باقة براعم الأطفال</option>
            <option value="regular_buyer">مشترو الكتب العاديين</option>
          </select>

          {/* Risk Filter */}
          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="h-8 px-3 text-xs rounded-lg border border-ui-border-base bg-ui-bg-field text-ui-fg-base focus:outline-none"
          >
            <option value="all">كافة مستويات المخاطر</option>
            <option value="low">مخاطر منخفضة (نشط جداً)</option>
            <option value="medium">مخاطر متوسطة</option>
            <option value="high">مخاطر مرتفعة (بحاجة لتنشيط)</option>
          </select>
        </div>
      </Container>

      {/* Main CRM Customers Table */}
      <Container className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs border-collapse">
            <thead className="bg-ui-bg-subtle border-b border-ui-border-base text-ui-fg-muted uppercase font-semibold">
              <tr>
                <th className="py-3 px-4 text-start">القارئ والبيانات</th>
                <th className="py-3 px-4 text-start">شريحة الاشتراك</th>
                <th className="py-3 px-4 text-start">الصيغة المفضلة</th>
                <th className="py-3 px-4 text-start">مؤشر التفاعل</th>
                <th className="py-3 px-4 text-start">الإنفاق (LTV)</th>
                <th className="py-3 px-4 text-start">مخاطر المغادرة</th>
                <th className="py-3 px-4 text-end">إجراءات CRM</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ui-border-base">
              {filteredCustomers.map((customer) => (
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
                        className="w-9 h-9 rounded-full object-cover border border-ui-border-base shrink-0"
                      />
                      <div>
                        <Text className="font-bold text-ui-fg-base">{customer.name}</Text>
                        <Text className="text-[11px] text-ui-fg-muted">{customer.email}</Text>
                      </div>
                    </div>
                  </td>

                  {/* Tier */}
                  <td className="py-3.5 px-4">
                    <Badge
                      color={
                        customer.tier === "vip_annual"
                          ? "purple"
                          : customer.tier === "vip_monthly"
                          ? "blue"
                          : customer.tier === "kids_pass"
                          ? "green"
                          : "grey"
                      }
                      className="text-[11px]"
                    >
                      {customer.tierLabelAr}
                    </Badge>
                  </td>

                  {/* Preferred Format */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5 text-ui-fg-subtle">
                      {customer.preferredFormat === "audiobook" ? (
                        <Headphones className="w-3.5 h-3.5 text-blue-500" />
                      ) : customer.preferredFormat === "ebook" ? (
                        <BookOpen className="w-3.5 h-3.5 text-emerald-500" />
                      ) : customer.preferredFormat === "paperback" ? (
                        <ShoppingBag className="w-3.5 h-3.5 text-amber-500" />
                      ) : (
                        <Sparkles className="w-3.5 h-3.5 text-purple-500" />
                      )}
                      <span>{customer.formatLabelAr}</span>
                    </div>
                  </td>

                  {/* Engagement Score */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-ui-bg-field rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            customer.engagementScore >= 80
                              ? "bg-emerald-500"
                              : customer.engagementScore >= 60
                              ? "bg-blue-500"
                              : "bg-amber-500"
                          }`}
                          style={{ width: `${customer.engagementScore}%` }}
                        />
                      </div>
                      <span className="font-bold text-[11px]">{customer.engagementScore}%</span>
                    </div>
                  </td>

                  {/* LTV & Orders */}
                  <td className="py-3.5 px-4">
                    <Text className="font-bold text-ui-fg-base">
                      {customer.lifetimeValue.toLocaleString()} ر.س
                    </Text>
                    <Text className="text-[10px] text-ui-fg-muted">{customer.totalOrders} طلبات</Text>
                  </td>

                  {/* Churn Risk */}
                  <td className="py-3.5 px-4">
                    <Badge
                      color={
                        customer.churnRisk === "low"
                          ? "green"
                          : customer.churnRisk === "medium"
                          ? "orange"
                          : "red"
                      }
                      className="text-[10px]"
                    >
                      {customer.churnRisk === "low"
                        ? "منخفض"
                        : customer.churnRisk === "medium"
                        ? "متوسط"
                        : "مرتفع ⚠️"}
                    </Badge>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-end">
                    <Button
                      size="small"
                      variant="secondary"
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedCustomer(customer)
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
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-2xl h-full bg-ui-bg-base border-s border-ui-border-base p-6 overflow-y-auto flex flex-col justify-between shadow-2xl">
            <div className="space-y-6">
              {/* Drawer Top Navigation & Close */}
              <div className="flex items-center justify-between pb-4 border-b border-ui-border-base">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedCustomer.avatar}
                    alt={selectedCustomer.name}
                    className="w-12 h-12 rounded-full object-cover border"
                  />
                  <div>
                    <Heading level="h2" className="text-lg font-bold">
                      {selectedCustomer.name}
                    </Heading>
                    <Text className="text-xs text-ui-fg-muted">{selectedCustomer.city}</Text>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedCustomer(null)}
                  className="p-2 rounded-lg hover:bg-ui-bg-subtle text-ui-fg-muted"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Success Notification Alert */}
              {actionSuccessMsg && (
                <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{actionSuccessMsg}</span>
                </div>
              )}

              {/* Quick Metrics Bar */}
              <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-ui-bg-subtle border border-ui-border-base text-center">
                <div>
                  <Text className="text-[11px] text-ui-fg-muted">رصيد الكتب المتبقي</Text>
                  <Text className="text-xl font-black text-purple-600 mt-0.5">
                    {selectedCustomer.bookCredits} رصيد
                  </Text>
                </div>
                <div>
                  <Text className="text-[11px] text-ui-fg-muted">إجمالي الإنفاق (LTV)</Text>
                  <Text className="text-xl font-black text-ui-fg-base mt-0.5">
                    {selectedCustomer.lifetimeValue} ر.س
                  </Text>
                </div>
                <div>
                  <Text className="text-[11px] text-ui-fg-muted">ساعات الاستماع</Text>
                  <Text className="text-xl font-black text-blue-600 mt-0.5">
                    {selectedCustomer.readingStats.audioHours} س
                  </Text>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-2">
                <Text className="text-xs font-bold text-ui-fg-base">بيانات التواصل والترخيص:</Text>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="flex items-center gap-2 p-2.5 rounded-xl border border-ui-border-base bg-ui-bg-field">
                    <Mail className="w-4 h-4 text-ui-fg-muted shrink-0" />
                    <span className="truncate">{selectedCustomer.email}</span>
                  </div>
                  <div className="flex items-center gap-2 p-2.5 rounded-xl border border-ui-border-base bg-ui-bg-field">
                    <Phone className="w-4 h-4 text-ui-fg-muted shrink-0" />
                    <span>{selectedCustomer.phone}</span>
                  </div>
                </div>
              </div>

              {/* Reading Habits & Journey */}
              <div className="space-y-3 p-4 rounded-2xl border border-ui-border-base bg-ui-bg-subtle">
                <div className="flex items-center justify-between">
                  <Text className="text-xs font-bold text-ui-fg-base flex items-center gap-1.5">
                    <Headphones className="w-4 h-4 text-purple-600" />
                    <span>سجل القراءة والاستماع الذكي:</span>
                  </Text>
                  <Badge color="purple" className="text-[10px]">
                    السرعة المفضلة: {selectedCustomer.readingStats.preferredSpeed}
                  </Badge>
                </div>

                <div className="text-xs space-y-1.5 text-ui-fg-subtle">
                  <p>
                    <strong className="text-ui-fg-base">يقرأ حالياً:</strong>{" "}
                    {selectedCustomer.readingStats.currentlyReading}
                  </p>
                  <p>
                    <strong className="text-ui-fg-base">الروايات المكتملة:</strong>{" "}
                    {selectedCustomer.readingStats.completedBooks.join(" • ") || "لم يكمل روايات بعد"}
                  </p>
                  <p className="text-[11px] text-ui-fg-muted pt-1">
                    آخر تفاعل مسجل: {selectedCustomer.lastActivity}
                  </p>
                </div>
              </div>

              {/* Direct VIP & Relationship Actions */}
              <div className="space-y-2">
                <Text className="text-xs font-bold text-ui-fg-base">إجراءات تعزيز ولاء القارئ:</Text>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    size="small"
                    variant="secondary"
                    onClick={() => handleGiftCredit(selectedCustomer.id)}
                    className="text-xs gap-1.5"
                  >
                    <Gift className="w-3.5 h-3.5 text-purple-600" />
                    <span>إهداء رصيد كتاب (+1 Credit)</span>
                  </Button>

                  <Button
                    size="small"
                    variant="secondary"
                    onClick={() => handleSendOffer("VIPREADER25")}
                    className="text-xs gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5 text-blue-600" />
                    <span>إرسال كود تنشيط (VIP25)</span>
                  </Button>
                </div>
              </div>

              {/* Interaction Notes & CRM Timeline */}
              <div className="space-y-3 pt-2 border-t border-ui-border-base">
                <Text className="text-xs font-bold text-ui-fg-base flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-blue-600" />
                  <span>سجل ملاحظات وتفاعلات فريق خدمة القراء:</span>
                </Text>

                {/* Add New Note Form */}
                <form onSubmit={handleAddNote} className="space-y-2">
                  <textarea
                    rows={2}
                    value={newNoteContent}
                    onChange={(e) => setNewNoteContent(e.target.value)}
                    placeholder="اكتب ملاحظة جديدة (مثلاً: رغبة القارئ في روايات تاريخية معينة، استفسار هاتفي...)"
                    className="w-full p-2.5 text-xs rounded-xl border border-ui-border-base bg-ui-bg-field text-ui-fg-base focus:outline-none"
                  />
                  <div className="flex items-center justify-between">
                    <select
                      value={newNoteType}
                      onChange={(e: any) => setNewNoteType(e.target.value)}
                      className="h-7 px-2 text-[11px] rounded border border-ui-border-base bg-ui-bg-field"
                    >
                      <option value="call">مكالمة هاتفية</option>
                      <option value="support">دعم فني</option>
                      <option value="preference">تفضيل قراءة</option>
                      <option value="gift">إهداء أو مكافأة</option>
                    </select>

                    <Button type="submit" size="small" className="text-xs">
                      إضافة ملاحظة
                    </Button>
                  </div>
                </form>

                {/* Notes List */}
                <div className="space-y-2 mt-3 max-h-48 overflow-y-auto">
                  {selectedCustomer.notes.map((note) => (
                    <div
                      key={note.id}
                      className="p-3 rounded-xl border border-ui-border-base bg-ui-bg-subtle text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between text-[11px] text-ui-fg-muted">
                        <span className="font-semibold text-ui-fg-base">{note.author}</span>
                        <span>{note.date}</span>
                      </div>
                      <p className="text-ui-fg-subtle leading-relaxed">{note.content}</p>
                    </div>
                  ))}
                </div>
              </div>
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
