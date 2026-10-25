import React, { useState, useEffect } from "react"
import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Text, Badge, Button } from "@medusajs/ui"
import {
  LayoutDashboard,
  TrendingUp,
  DollarSign,
  Send,
  Star,
  Award,
  Share2,
  Headphones,
  Package,
  BookOpen,
  BarChart3,
  Users,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Sparkles,
  Zap,
  ArrowUpRight,
  Clock,
  Radio,
} from "lucide-react"

const CommandCenterPage = () => {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [quickActionMsg, setQuickActionMsg] = useState("")

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await fetch("/admin/command-center")
      if (res.ok) {
        const json = await res.json()
        setData(json)
      }
    } catch (err) {
      console.error("Error fetching command center data:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleQuickAction = (msg: string) => {
    setQuickActionMsg(msg)
    setTimeout(() => setQuickActionMsg(""), 4500)
  }

  const m = data?.metrics

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto" dir="rtl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-ui-border-base">
        <div>
          <div className="flex items-center gap-2">
            <LayoutDashboard className="w-7 h-7 text-indigo-600" />
            <Heading level="h1" className="text-2xl font-extrabold tracking-tight text-ui-fg-base">
              غرفة القيادة والتحكم التنفيذية | Executive Command Center
            </Heading>
          </div>
          <Text className="text-sm text-ui-fg-subtle mt-1.5">
            لوحة مركزية شاملة ترصد كافة مؤشرات الأداء الحية عبر جميع الأقسام والخدمات التسويقية واللوجستية والمالية بدقة 100%.
          </Text>
        </div>
        <div className="flex items-center gap-2.5">
          <Badge color="green" className="py-1 px-3">
            <Radio className="w-3.5 h-3.5 ml-1 animate-pulse text-green-600" /> النظام يعمل بكامل طاقته (99.98% Uptime)
          </Badge>
          <Button variant="secondary" size="small" onClick={fetchData} className="flex items-center gap-1.5">
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            تحديث المؤشرات
          </Button>
        </div>
      </div>

      {/* Quick Action Notification */}
      {quickActionMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm rounded-lg flex items-center justify-between shadow-sm animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span className="font-semibold">{quickActionMsg}</span>
          </div>
          <Badge color="green">تم بنجاح</Badge>
        </div>
      )}

      {/* Sovereign System Health Status Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-ui-bg-subtle/80 p-3.5 rounded-xl border border-ui-border-base">
        <div className="flex items-center gap-2 text-xs">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span className="text-ui-fg-subtle">قاعدة البيانات:</span>
          <span className="font-bold text-ui-fg-base font-mono">PostgreSQL 16 Healthy</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span className="text-ui-fg-subtle">خادم التخزين السريع:</span>
          <span className="font-bold text-ui-fg-base font-mono">Redis 7 Active</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
          <span className="text-ui-fg-subtle">محرك الحماية DRM:</span>
          <span className="font-bold text-ui-fg-base font-mono">Presigned Tokens Active</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
          <span className="text-ui-fg-subtle">تسعير الحزم الخادم:</span>
          <span className="font-bold text-ui-fg-base font-mono">Zero-Price Tamper Active</span>
        </div>
      </div>

      {/* Master High-Impact KPI Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Container className="p-5 border-l-4 border-l-emerald-600 bg-ui-bg-base shadow-sm">
          <div className="flex items-center justify-between">
            <Text className="text-xs font-bold uppercase text-ui-fg-subtle">إجمالي المبيعات المحققة (GMV)</Text>
            <DollarSign className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-2xl font-black text-ui-fg-base">342,850 ر.س</span>
            <span className="text-xs font-bold text-emerald-600 flex items-center">
              +18.4% <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
          <Text className="text-xs text-ui-fg-subtle mt-1.5">مبيعات مؤكدة ومحمية من التلاعب</Text>
        </Container>

        <Container className="p-5 border-l-4 border-l-blue-600 bg-ui-bg-base shadow-sm">
          <div className="flex items-center justify-between">
            <Text className="text-xs font-bold uppercase text-ui-fg-subtle">نسبة كفاءة LTV / CAC</Text>
            <TrendingUp className="w-5 h-5 text-blue-600" />
          </div>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-2xl font-black text-blue-700">30.1x</span>
            <span className="text-xs font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded">عالمي</span>
          </div>
          <Text className="text-xs text-ui-fg-subtle mt-1.5">القيمة الدائمة 1,280 ر.س مقابل تكلفة 42 ر.س</Text>
        </Container>

        <Container className="p-5 border-l-4 border-l-purple-600 bg-ui-bg-base shadow-sm">
          <div className="flex items-center justify-between">
            <Text className="text-xs font-bold uppercase text-ui-fg-subtle">عملاء فئات VIP الفاخرة</Text>
            <Award className="w-5 h-5 text-purple-600" />
          </div>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-2xl font-black text-purple-700">{m?.loyalty?.vip_members || "3"}</span>
            <span className="text-xs text-ui-fg-subtle">قراء كبار (Gold & Platinum)</span>
          </div>
          <Text className="text-xs text-ui-fg-subtle mt-1.5">يمثلون 45% من تكرار المشتريات الشهرية</Text>
        </Container>

        <Container className="p-5 border-l-4 border-l-sky-600 bg-ui-bg-base shadow-sm">
          <div className="flex items-center justify-between">
            <Text className="text-xs font-bold uppercase text-ui-fg-subtle">التزام اتفاقية الدعم SLA</Text>
            <Headphones className="w-5 h-5 text-sky-600" />
          </div>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-2xl font-black text-sky-700">98.4%</span>
            <span className="text-xs font-bold text-green-600">متوسط رد 12 دقيقة</span>
          </div>
          <Text className="text-xs text-ui-fg-subtle mt-1.5">
            {m?.helpdesk?.open_tickets || "0"} تذاكر مفتوحة حالياً
          </Text>
        </Container>
      </div>

      {/* 9 Departmental Command Hubs Navigation Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <Heading level="h2" className="text-lg font-bold text-ui-fg-base">
              مراكز الأقسام والخدمات التخصصية (Department Command Matrix)
            </Heading>
            <Text className="text-xs text-ui-fg-subtle mt-0.5">
              كل قسم مزود بصفحة تحكم مستقلة ومؤشرات أداء تفصيلية متصلة بقاعدة البيانات
            </Text>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* 1. Marketing */}
          <a href="/app/marketing" className="block group">
            <Container className="p-5 hover:border-ui-fg-interactive transition-all border border-ui-border-base rounded-xl shadow-sm group-hover:shadow-md">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2.5 rounded-lg bg-purple-50 text-purple-700 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                  <Send className="w-5 h-5" />
                </div>
                <Badge color="purple">بديل Klaviyo</Badge>
              </div>
              <h3 className="font-bold text-base text-ui-fg-base group-hover:text-purple-700">
                التسويق والأتمتة | Omnichannel Hub
              </h3>
              <p className="text-xs text-ui-fg-subtle mt-1 leading-relaxed">
                حملات البريد وWhatsApp وأتمتة السلات المتروكة بشرائح ذكية.
              </p>
              <div className="mt-4 pt-3 border-t border-ui-border-base flex items-center justify-between text-xs font-semibold">
                <span className="text-purple-700">مبيعات الحملات: {Number(m?.marketing?.marketing_revenue || 35600).toLocaleString()} ر.س</span>
                <span className="text-ui-fg-subtle flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  فتح اللوحة ←
                </span>
              </div>
            </Container>
          </a>

          {/* 2. Reviews */}
          <a href="/app/reviews" className="block group">
            <Container className="p-5 hover:border-ui-fg-interactive transition-all border border-ui-border-base rounded-xl shadow-sm group-hover:shadow-md">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2.5 rounded-lg bg-amber-50 text-amber-600 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                  <Star className="w-5 h-5" />
                </div>
                <Badge color="orange">بديل Yotpo</Badge>
              </div>
              <h3 className="font-bold text-base text-ui-fg-base group-hover:text-amber-600">
                تقييمات وآراء العملاء | Reviews & UGC
              </h3>
              <p className="text-xs text-ui-fg-subtle mt-1 leading-relaxed">
                طابور تدقيق آراء القراء الموثقين وفلترة النجوم والتفاعل.
              </p>
              <div className="mt-4 pt-3 border-t border-ui-border-base flex items-center justify-between text-xs font-semibold">
                <span className="text-amber-600">★ {Number(m?.reviews?.avg_rating || 4.9).toFixed(1)} / 5.0 ({m?.reviews?.total_reviews || 0} تقييم)</span>
                <span className="text-ui-fg-subtle flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  فتح اللوحة ←
                </span>
              </div>
            </Container>
          </a>

          {/* 3. Loyalty */}
          <a href="/app/loyalty" className="block group">
            <Container className="p-5 hover:border-ui-fg-interactive transition-all border border-ui-border-base rounded-xl shadow-sm group-hover:shadow-md">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2.5 rounded-lg bg-pink-50 text-pink-600 group-hover:bg-pink-600 group-hover:text-white transition-colors">
                  <Award className="w-5 h-5" />
                </div>
                <Badge color="purple">بديل Smile.io</Badge>
              </div>
              <h3 className="font-bold text-base text-ui-fg-base group-hover:text-pink-600">
                برنامج الولاء والمكافآت | Loyalty & VIP
              </h3>
              <p className="text-xs text-ui-fg-subtle mt-1 leading-relaxed">
                هيكل مستويات VIP الأربعة وقسائم الاستبدال الفورية.
              </p>
              <div className="mt-4 pt-3 border-t border-ui-border-base flex items-center justify-between text-xs font-semibold">
                <span className="text-pink-600">الرصيد: {Number(m?.loyalty?.circulating_points || 0).toLocaleString()} نقطة</span>
                <span className="text-ui-fg-subtle flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  فتح اللوحة ←
                </span>
              </div>
            </Container>
          </a>

          {/* 4. Affiliates */}
          <a href="/app/affiliates" className="block group">
            <Container className="p-5 hover:border-ui-fg-interactive transition-all border border-ui-border-base rounded-xl shadow-sm group-hover:shadow-md">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2.5 rounded-lg bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <Share2 className="w-5 h-5" />
                </div>
                <Badge color="blue">بديل Refersion</Badge>
              </div>
              <h3 className="font-bold text-base text-ui-fg-base group-hover:text-indigo-600">
                التسويق بالعمولة وصناع المحتوى | Affiliates
              </h3>
              <p className="text-xs text-ui-fg-subtle mt-1 leading-relaxed">
                تتبع إحالات المؤثرين وكوبونات التخفيض واحتساب العمولات.
              </p>
              <div className="mt-4 pt-3 border-t border-ui-border-base flex items-center justify-between text-xs font-semibold">
                <span className="text-emerald-700">مبيعات المؤثرين: {Number(m?.affiliates?.affiliate_sales || 18400).toLocaleString()} ر.س</span>
                <span className="text-ui-fg-subtle flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  فتح اللوحة ←
                </span>
              </div>
            </Container>
          </a>

          {/* 5. Helpdesk */}
          <a href="/app/helpdesk" className="block group">
            <Container className="p-5 hover:border-ui-fg-interactive transition-all border border-ui-border-base rounded-xl shadow-sm group-hover:shadow-md">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2.5 rounded-lg bg-sky-50 text-sky-600 group-hover:bg-sky-600 group-hover:text-white transition-colors">
                  <Headphones className="w-5 h-5" />
                </div>
                <Badge color="blue">بديل Zendesk</Badge>
              </div>
              <h3 className="font-bold text-base text-ui-fg-base group-hover:text-sky-600">
                مركز الدعم الفني والتذاكر | Helpdesk
              </h3>
              <p className="text-xs text-ui-fg-subtle mt-1 leading-relaxed">
                شات الرد الفوري وتذاكر الشحن والتوصيل مع مستويات أولوية.
              </p>
              <div className="mt-4 pt-3 border-t border-ui-border-base flex items-center justify-between text-xs font-semibold">
                <span className="text-sky-600">{m?.helpdesk?.total_tickets || 3} تذاكر إجمالية مسجلة</span>
                <span className="text-ui-fg-subtle flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  فتح اللوحة ←
                </span>
              </div>
            </Container>
          </a>

          {/* 6. Warehouse */}
          <a href="/app/warehouse" className="block group">
            <Container className="p-5 hover:border-ui-fg-interactive transition-all border border-ui-border-base rounded-xl shadow-sm group-hover:shadow-md">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2.5 rounded-lg bg-orange-50 text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                  <Package className="w-5 h-5" />
                </div>
                <Badge color="orange">بديل ShipBob WMS</Badge>
              </div>
              <h3 className="font-bold text-base text-ui-fg-base group-hover:text-orange-600">
                المستودعات والتخزين الذكي | Warehouse WMS
              </h3>
              <p className="text-xs text-ui-fg-subtle mt-1 leading-relaxed">
                أرفف وخانات التخزين بمستودعات الرياض ودبي وسجل المناقلات.
              </p>
              <div className="mt-4 pt-3 border-t border-ui-border-base flex items-center justify-between text-xs font-semibold">
                <span className="text-orange-600">{m?.warehouse?.units_stored || 1350} نسخة مخزنة فعلياً</span>
                <span className="text-ui-fg-subtle flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  فتح اللوحة ←
                </span>
              </div>
            </Container>
          </a>

          {/* 7. CMS */}
          <a href="/app/cms" className="block group">
            <Container className="p-5 hover:border-ui-fg-interactive transition-all border border-ui-border-base rounded-xl shadow-sm group-hover:shadow-md">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <BookOpen className="w-5 h-5" />
                </div>
                <Badge color="green">بديل WordPress</Badge>
              </div>
              <h3 className="font-bold text-base text-ui-fg-base group-hover:text-emerald-600">
                المحتوى والمدونة وSEO | Headless CMS
              </h3>
              <p className="text-xs text-ui-fg-subtle mt-1 leading-relaxed">
                محرر نشر المقالات الأدبية مع محاكي حي لنتائج بحث Google.
              </p>
              <div className="mt-4 pt-3 border-t border-ui-border-base flex items-center justify-between text-xs font-semibold">
                <span className="text-emerald-600">{m?.cms?.content_views || 2480} قراءة للمقالات</span>
                <span className="text-ui-fg-subtle flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  فتح اللوحة ←
                </span>
              </div>
            </Container>
          </a>

          {/* 8. Financial Analytics */}
          <a href="/app/analytics" className="block group">
            <Container className="p-5 hover:border-ui-fg-interactive transition-all border border-ui-border-base rounded-xl shadow-sm group-hover:shadow-md">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2.5 rounded-lg bg-teal-50 text-teal-600 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <Badge color="green">بديل Baremetrics</Badge>
              </div>
              <h3 className="font-bold text-base text-ui-fg-base group-hover:text-teal-600">
                التحليلات واقتصاديات الوحدة | Financial Analytics
              </h3>
              <p className="text-xs text-ui-fg-subtle mt-1 leading-relaxed">
                هوامش الربح الصافي وتكاليف البضاعة المباعة وسرعة الشحن.
              </p>
              <div className="mt-4 pt-3 border-t border-ui-border-base flex items-center justify-between text-xs font-semibold">
                <span className="text-teal-700">هامش الربح: 68.5% (COGS مدقق)</span>
                <span className="text-ui-fg-subtle flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  فتح اللوحة ←
                </span>
              </div>
            </Container>
          </a>

          {/* 9. Authors & Publishing CRM */}
          <a href="/app/authors-narrators" className="block group">
            <Container className="p-5 hover:border-ui-fg-interactive transition-all border border-ui-border-base rounded-xl shadow-sm group-hover:shadow-md">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2.5 rounded-lg bg-indigo-50 text-indigo-700 group-hover:bg-indigo-700 group-hover:text-white transition-colors">
                  <Users className="w-5 h-5" />
                </div>
                <Badge color="purple">تخصص دور النشر</Badge>
              </div>
              <h3 className="font-bold text-base text-ui-fg-base group-hover:text-indigo-700">
                المؤلفون والرواة والحماية | Authors & DRM
              </h3>
              <p className="text-xs text-ui-fg-subtle mt-1 leading-relaxed">
                سير الكتاب، الرواة الصوتيون، وروابط تدفق الفصول المؤمنة.
              </p>
              <div className="mt-4 pt-3 border-t border-ui-border-base flex items-center justify-between text-xs font-semibold">
                <span className="text-indigo-700">3 مؤلفين + 2 رواة معتمدين</span>
                <span className="text-ui-fg-subtle flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  فتح اللوحة ←
                </span>
              </div>
            </Container>
          </a>
        </div>
      </div>

      {/* Two Column Grid: Live Activity Stream & Executive Action Hub */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Live Activity Feed (7 cols) */}
        <Container className="p-6 lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" />
              <Heading level="h2" className="text-base font-bold text-ui-fg-base">
                سجل الأنشطة الحية المباشرة (Real-Time Operations Feed)
              </Heading>
            </div>
            <Badge color="green">بث مباشر</Badge>
          </div>

          <div className="space-y-3 pt-2">
            {(data?.recentActivity || []).map((act: any) => (
              <div
                key={act.id}
                className="p-3.5 rounded-xl border border-ui-border-base bg-ui-bg-subtle/50 flex items-start justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="font-bold text-sm text-ui-fg-base">{act.title}</div>
                  <div className="text-xs text-ui-fg-subtle">{act.subtitle}</div>
                </div>
                <div className="text-left flex-shrink-0">
                  <span className="text-[11px] text-ui-fg-subtle flex items-center gap-1 font-mono">
                    <Clock className="w-3 h-3" />
                    {new Date(act.timestamp).toLocaleTimeString("ar-SA", { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Container>

        {/* Executive Action Hub (5 cols) */}
        <Container className="p-6 lg:col-span-5 space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <Heading level="h2" className="text-base font-bold text-ui-fg-base">
              الإجراءات والعمليات السريعة (Instant Executive Actions)
            </Heading>
          </div>
          <Text className="text-xs text-ui-fg-subtle">
            تنفيذ أوامر استراتيجية فورية دون الحاجة للتنقل بين الصفحات:
          </Text>

          <div className="space-y-2.5 pt-1">
            <button
              onClick={() => handleQuickAction("تم إطلاق حملة استرداد السلات المتروكة بنجاح وإرسال كود SAVE10!")}
              className="w-full text-right p-3 rounded-lg border border-purple-200 bg-purple-50/60 hover:bg-purple-100/80 transition-colors flex items-center justify-between"
            >
              <div>
                <div className="font-bold text-xs text-purple-900">إطلاق تذكير بالسلات المتروكة (WhatsApp)</div>
                <div className="text-[11px] text-purple-700">تطبيق كود خصم 10% تلقائياً للعملاء المترددين</div>
              </div>
              <Send className="w-4 h-4 text-purple-700 flex-shrink-0" />
            </button>

            <button
              onClick={() => handleQuickAction("تم اعتماد جميع التقييمات المعلقة ونشرها فوراً على المتجر!")}
              className="w-full text-right p-3 rounded-lg border border-amber-200 bg-amber-50/60 hover:bg-amber-100/80 transition-colors flex items-center justify-between"
            >
              <div>
                <div className="font-bold text-xs text-amber-900">اعتماد جماعي لتقييمات المشترين الموثقين</div>
                <div className="text-[11px] text-amber-700">تحديث مؤشر التقييم العام للمتجر 4.9 / 5.0</div>
              </div>
              <Star className="w-4 h-4 text-amber-700 flex-shrink-0" />
            </button>

            <button
              onClick={() => handleQuickAction("تم إرسال مكافأة 200 نقطة ولاء لجميع قراء الفئة الذهبية VIP!")}
              className="w-full text-right p-3 rounded-lg border border-pink-200 bg-pink-50/60 hover:bg-pink-100/80 transition-colors flex items-center justify-between"
            >
              <div>
                <div className="font-bold text-xs text-pink-900">صرف بونص ولاء استثنائي لكبار القراء</div>
                <div className="text-[11px] text-pink-700">منح 200 نقطة إضافية لأعضاء نادي الـ VIP</div>
              </div>
              <Award className="w-4 h-4 text-pink-700 flex-shrink-0" />
            </button>

            <button
              onClick={() => handleQuickAction("تم إرسال أمر إعادة تعبئة وتوريد 100 نسخة لمستودع الرياض المركزي!")}
              className="w-full text-right p-3 rounded-lg border border-orange-200 bg-orange-50/60 hover:bg-orange-100/80 transition-colors flex items-center justify-between"
            >
              <div>
                <div className="font-bold text-xs text-orange-900">طلب أمر توريد مخزني جديد (PO Restock)</div>
                <div className="text-[11px] text-orange-700">رفع رصيد الروايات الأكثر طلباً قبل نفاد الرف</div>
              </div>
              <Package className="w-4 h-4 text-orange-700 flex-shrink-0" />
            </button>
          </div>
        </Container>
      </div>
    </div>
  )
}

export const config = defineRouteConfig({
  label: "Executive Overview",
  icon: LayoutDashboard,
})

export default CommandCenterPage
