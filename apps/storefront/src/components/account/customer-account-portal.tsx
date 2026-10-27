"use client"

import React, { useState, useEffect } from "react"
import { formatMedusaCurrency } from "@/lib/utils"
import Link from "@/components/common/realm-link"
import { useRouter } from "next/navigation"
import {
  useCustomerAuth,
  DEMO_CUSTOMERS,
  DEMO_MODE,
  AGE_GROUP_CONFIGS,
  AgeGroupType,
} from "@/context/customer-auth-context"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  User,
  Package,
  MapPin,
  ExternalLink,
  Truck,
  CheckCircle2,
  Clock,
  Sparkles,
  BookOpen,
  Headphones,
  LogOut,
  LogIn,
  UserPlus,
  Loader2,
  ShieldCheck,
  CreditCard,
  Gift,
  ChevronRight,
  ChevronLeft,
  Compass,
  ArrowRight,
  ArrowLeft,
  Star,
} from "lucide-react"

type CustomerAccountPortalProps = {
  locale: "ar" | "en"
  dict: any
  initialTab?: "login" | "register"
}

export function CustomerAccountPortal({ locale, dict, initialTab = "login" }: CustomerAccountPortalProps) {
  const router = useRouter()
  const {
    customer,
    isLoading,
    login,
    register,
    logout,
    switchDemoCustomer,
    activeAgeGroup,
    setActiveAgeGroup,
  } = useCustomerAuth()

  const [authTab, setAuthTab] = useState<"login" | "register">(initialTab)

  // Selected age group for login & registration routing
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<AgeGroupType>("adults_18_plus")

  // Login form state
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")

  // Register form state
  const [regName, setRegName] = useState("")
  const [regEmail, setRegEmail] = useState("")
  const [regPassword, setRegPassword] = useState("")
  const [regPhone, setRegPhone] = useState("")
  const [regFormat, setRegFormat] = useState<"paperback" | "ebook" | "audiobook" | "hybrid">("hybrid")

  const [authError, setAuthError] = useState<string | null>(null)
  const [realOrders, setRealOrders] = useState<Array<{ id: string; date: string; status: string; statusAr: string; carrier: string; trackingNumber: string; total: string; items: string[] }>>([])
  const [orderError, setOrderError] = useState("")
  useEffect(() => {
    setRealOrders([])
    setOrderError("")
    if (!customer || DEMO_MODE) return
    const controller = new AbortController()
    fetch("/api/medusa/store/orders?limit=50", { cache: "no-store", signal: controller.signal })
      .then(async (response) => { if (!response.ok) throw new Error("Unable to load orders"); return response.json() })
      .then(({ orders }) => setRealOrders((orders || []).map((order: any) => ({ id: order.id,
        date: new Date(order.created_at).toLocaleDateString(locale === "ar" ? "ar-SA" : "en-US"), status: order.status, statusAr: order.status,
        carrier: "", trackingNumber: "", total: formatMedusaCurrency(order.total, order.currency_code, locale),
        items: (order.items || []).map((item: any) => `${item.title} × ${item.quantity}`) }))))
      .catch((error) => { if (error.name !== "AbortError") setOrderError(locale === "ar" ? "تعذر تحميل سجل الطلبات." : "Unable to load order history.") })
    return () => controller.abort()
  }, [customer?.id, locale])
  const isRtl = locale === "ar"

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthError(null)
    if (!loginEmail.trim()) {
      setAuthError(locale === "ar" ? "يرجى كتابة البريد الإلكتروني" : "Please enter your email")
      return
    }
    const result = await login(loginEmail.trim(), loginPassword, selectedAgeGroup)
      .catch(() => ({ success: false, targetUrl: "" }))
    if (result.success && result.targetUrl) {
      router.push(`/${locale}${result.targetUrl}`)
    } else {
      setAuthError(locale === "ar" ? "تعذر تسجيل الدخول. راجع البريد الإلكتروني وكلمة المرور." : "Unable to sign in. Check your email and password.")
    }
  }

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthError(null)
    if (!regName.trim() || !regEmail.trim()) {
      setAuthError(locale === "ar" ? "يرجى تعبئة جميع الحقول المطلوبة" : "Please fill required fields")
      return
    }
    const result = await register({
      name: regName.trim(),
      email: regEmail.trim(),
      password: regPassword,
      phone: regPhone.trim(),
      ageGroup: selectedAgeGroup,
      preferredFormat: regFormat,
    }).catch(() => ({ success: false, targetUrl: "" }))
    if (result.success && result.targetUrl) {
      router.push(`/${locale}${result.targetUrl}`)
    } else {
      setAuthError(locale === "ar" ? "تعذر إنشاء الحساب. راجع البيانات وكلمة المرور (٨ أحرف على الأقل)." : "Unable to register. Check your details and password (at least 8 characters).")
    }
  }

  const handleDemoSwitch = (id: string) => {
    const age = switchDemoCustomer(id)
    setSelectedAgeGroup(age)
    const target = AGE_GROUP_CONFIGS[age].targetPath
    router.push(`/${locale}${target}`)
  }

  // Sample order history for display
  const pastOrders = DEMO_MODE ? [
    {
      id: "ORD-01HQ8976AB",
      date: "2026-10-24",
      status: "delivered",
      statusAr: "تم التوصيل بنجاح",
      carrier: "Aramex Express",
      trackingNumber: "ARX-9823412SA",
      total: "SAR 115.00",
      items: [
        "شفرة قصر الحمراء: لغز المخطوطة الأندلسية (غلاف ورقي)",
        "النسخة الصوتية الكاملة (رصيد VIP مخصوم)",
      ],
    },
    {
      id: "ORD-01HQ3421XY",
      date: "2026-10-18",
      status: "delivered",
      statusAr: "تم التوصيل بنجاح",
      carrier: "SMSA Express",
      trackingNumber: "SMSA-551092SA",
      total: "SAR 45.00",
      items: ["مغامرة الأرنب الصغير سمسم في الغابة السحرية (نسخة ورقية)"],
    },
  ] : realOrders

  // If customer is NOT logged in: Show Stitch P12 Login / Register form + Demo Customer Switcher
  if (!customer) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <div className="bg-[#1c1f29] rounded-3xl border border-[#4e463a]/50 p-6 sm:p-10 shadow-2xl relative overflow-hidden text-start">
          {/* Subtle golden ambient glow */}
          <div className="absolute top-0 end-0 w-72 h-72 bg-[#e6c184]/5 rounded-full blur-3xl pointer-events-none" />

          {/* Header (Stitch P12 Folio) */}
          <div className="mb-6 relative z-10">
            <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-[#93000a]/20 text-[#ffb4ab] border border-[#ffb4ab]/30">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>بروتوكول التحقق الفئوي (+١٨)</span>
              </div>
              <span className="text-[10px] text-[#9a8f81] font-mono tracking-widest uppercase">
                Folio Registration • 012
              </span>
            </div>

            <h1 className="font-serif text-2xl sm:text-3xl font-black text-[#e0e2ef]">
              {locale === "ar" ? "بوابة القراء والتحقق السيادي" : "Reader Account Portal & Access"}
            </h1>
            <p className="font-serif text-xs text-[#d1c5b5] mt-1.5 leading-relaxed">
              {locale === "ar"
                ? "حساب للقراء البالغين والأوصياء. يبقى تقدم القراءة والمفضلة والملاحظات على هذا الجهاز لكل حساب."
                : "An account for adult readers and guardians. Reading progress, saved stories, and notes remain on this device per account."}
            </p>
          </div>

          {/* Guardian & Age Legal Policy Clarification Callout (Stitch P12 Signature) */}
          <div className="mb-6 p-4 rounded-2xl bg-[#181b25] border border-[#4e463a]/40 flex gap-3 items-start">
            <span className="material-symbols-outlined text-[#e6c184] text-[22px] shrink-0 mt-0.5">
              family_restroom
            </span>
            <div className="text-xs space-y-1">
              <span className="font-bold text-[#e6c184] block">
                {locale === "ar" ? "سياسة الحسابات الأسرية وإشراف الأوصياء:" : "Family & Guardian Policy:"}
              </span>
              <p className="text-[11px] text-[#cdc6b8] leading-relaxed">
                {locale === "ar"
                  ? "التسجيل لولي الأمر أو القارئ البالغ. اختر منصة القراءة المناسبة؛ ملفات الأطفال المحلية تُدار من مركز الأسرة. بوابة الأهل ليست إثبات هوية."
                  : "Registration is for an adult or guardian. Choose the reading platform; local child profiles are managed in the Family Hub. The parent gate does not verify identity."}
              </p>
            </div>
          </div>

          <Link className="text-sm text-[#e6c184] underline block mb-5" href={`/${locale}/forgot-password`}>{locale==="ar"?"نسيت كلمة المرور؟":"Forgot password?"}</Link>
          {/* Age Group Selector Card Grid */}
          <div className="mb-6">
            <label className="block text-xs font-bold text-[#e0e2ef] mb-2 text-start">
              {locale === "ar" ? "اختر الفئة العمرية (تحدد قسمك فور الدخول):" : "Select Age Group (Determines Destination):"}
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {(Object.keys(AGE_GROUP_CONFIGS) as AgeGroupType[]).map((groupKey) => {
                const conf = AGE_GROUP_CONFIGS[groupKey]
                const isSelected = selectedAgeGroup === groupKey
                return (
                  <button
                    key={groupKey}
                    type="button"
                    onClick={() => setSelectedAgeGroup(groupKey)}
                    className={`p-3 rounded-2xl border text-start transition-all relative overflow-hidden ${
                      isSelected
                        ? "bg-[#272a33] border-[#e6c184] ring-2 ring-[#e6c184]/40 shadow-xs"
                        : "bg-[#181b25] border-[#4e463a]/30 hover:bg-[#272a33]"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{conf.icon}</span>
                      <span className="font-bold text-xs text-[#e0e2ef]">
                        {locale === "ar" ? conf.labelAr : conf.labelEn}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#9a8f81] line-clamp-1">
                      {locale === "ar" ? conf.taglineAr : conf.taglineEn}
                    </p>
                    {isSelected && (
                      <span className="absolute top-2 left-2 text-[10px] font-bold text-[#e6c184]">
                        ✓
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Login / Register Tab Switcher */}
          <div className="grid grid-cols-2 p-1 rounded-2xl bg-[#181b25] border border-[#4e463a]/40 mb-6">
            <button
              onClick={() => {
                setAuthTab("login")
                setAuthError(null)
              }}
              className={`py-2.5 text-xs font-bold rounded-xl transition-all ${
                authTab === "login"
                  ? "bg-[#272a33] text-[#e6c184] shadow-xs border border-[#e6c184]/30"
                  : "text-[#9a8f81] hover:text-[#e0e2ef]"
              }`}
            >
              <span className="flex items-center justify-center gap-1.5">
                <LogIn className="w-4 h-4" />
                <span>{locale === "ar" ? "تسجيل الدخول والتوجيه" : "Sign In & Enter"}</span>
              </span>
            </button>

            <button
              onClick={() => {
                setAuthTab("register")
                setAuthError(null)
              }}
              className={`py-2.5 text-xs font-bold rounded-xl transition-all ${
                authTab === "register"
                  ? "bg-[#272a33] text-[#e6c184] shadow-xs border border-[#e6c184]/30"
                  : "text-[#9a8f81] hover:text-[#e0e2ef]"
              }`}
            >
              <span className="flex items-center justify-center gap-1.5">
                <UserPlus className="w-4 h-4" />
                <span>{locale === "ar" ? "إنشاء حساب قارئ جديد" : "Create Account"}</span>
              </span>
            </button>
          </div>

          {authError && (
            <div className="p-3 rounded-xl bg-destructive/10 text-destructive text-xs font-bold mb-4">
              {authError}
            </div>
          )}

          {/* Form: Login */}
          {authTab === "login" && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-foreground mb-1.5">
                  {locale === "ar" ? "البريد الإلكتروني:" : "Email Address:"}
                </label>
                <Input
                  type="email" aria-label={locale==="ar"?"البريد الإلكتروني":"Email address"}
                  required
                  placeholder="name@example.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="rounded-xl h-11 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-foreground mb-1.5">
                  {locale === "ar" ? "كلمة المرور:" : "Password:"}
                </label>
                <Input
                  type="password" aria-label={locale==="ar"?"كلمة المرور":"Password"}
                  required
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="rounded-xl h-11 text-xs"
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="stitch-gold-gradient text-white border-0 w-full rounded-2xl h-12 text-sm font-black gap-2 mt-2 shadow-lg hover:shadow-xl transition-all"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>
                      {locale === "ar"
                        ? `دخول والانتقال إلى ${AGE_GROUP_CONFIGS[selectedAgeGroup].labelAr}`
                        : `Sign In & Go to ${AGE_GROUP_CONFIGS[selectedAgeGroup].labelEn}`}
                    </span>
                    {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                  </>
                )}
              </Button>
            </form>
          )}

          {/* Form: Register */}
          {authTab === "register" && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-foreground mb-1.5">
                  {locale === "ar" ? "الاسم الكامل للقارئ:" : "Full Name:"}
                </label>
                <Input
                  type="text"
                  required
                  placeholder={locale === "ar" ? "مثال: عبد الله السعيد" : "e.g. John Doe"}
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  className="rounded-xl h-11 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-foreground mb-1.5">
                  {locale === "ar" ? "البريد الإلكتروني:" : "Email Address:"}
                </label>
                <Input
                  type="email" aria-label={locale==="ar"?"البريد الإلكتروني":"Email address"}
                  required
                  placeholder="reader@example.com"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="rounded-xl h-11 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-foreground mb-1.5" htmlFor="register-password">
                  {locale === "ar" ? "كلمة المرور:" : "Password:"}
                </label>
                <Input id="register-password" type="password" aria-label={locale==="ar"?"كلمة المرور":"Password"} autoComplete="new-password" required minLength={8} value={regPassword} onChange={(e) => setRegPassword(e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-bold text-foreground mb-1.5">
                  {locale === "ar" ? "رقم الجوال للتوصيل:" : "Mobile Number:"}
                </label>
                <Input
                  type="tel"
                  placeholder="+966 50 000 0000"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  className="rounded-xl h-11 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-foreground mb-1.5">
                  {locale === "ar" ? "صيغتك المفضلة:" : "Preferred Format:"}
                </label>
                <select
                  value={regFormat}
                  onChange={(e: any) => setRegFormat(e.target.value)}
                  className="w-full h-11 px-3 text-xs rounded-xl border border-input bg-background text-foreground"
                >
                  <option value="hybrid">هجين (أقرأ واستمع لكل الصيغ)</option>
                  <option value="audiobook">كتب صوتية درامية (Audiobooks)</option>
                  <option value="ebook">كتب إلكترونية (EPUB / PDF)</option>
                  <option value="paperback">كتب ورقية مطبوعة فاخرة</option>
                </select>
              </div>

              <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 text-xs flex items-center gap-2 text-primary font-medium">
                <Gift className="w-4 h-4 shrink-0" />
                <span>
                  {locale === "ar"
                    ? "هدية ترحيبية: 1 شهر VIP مجاني مع 1 رصيد كتاب فوري عند التسجيل!"
                    : "Welcome Gift: 1 Free Month VIP Pass + 1 Book Credit upon registration!"}
                </span>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="stitch-gold-gradient text-white border-0 w-full rounded-2xl h-12 text-sm font-black gap-2 mt-2 shadow-lg hover:shadow-xl transition-all"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>
                      {locale === "ar"
                        ? `إنشاء الحساب والانتقال إلى ${AGE_GROUP_CONFIGS[selectedAgeGroup].labelAr}`
                        : `Create Account & Enter ${AGE_GROUP_CONFIGS[selectedAgeGroup].labelEn}`}
                    </span>
                    {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                  </>
                )}
              </Button>
            </form>
          )}

          {/* Quick Demo Customer Switcher Bar */}
          {DEMO_MODE && <div className="mt-8 pt-6 border-t border-border">
            <span className="block text-center text-xs font-bold text-muted-foreground mb-3">
              {locale === "ar"
                ? "⚡ أو اختر شخصية قارئ تجريبية للانتقال الفوري المباشر لقسمها:"
                : "⚡ Or select a demo persona to instantly jump to their dedicated department:"}
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {DEMO_CUSTOMERS.map((c) => {
                const conf = AGE_GROUP_CONFIGS[c.ageGroup]
                return (
                  <button
                    key={c.id}
                    onClick={() => handleDemoSwitch(c.id)}
                    className="flex items-center justify-between p-3 rounded-2xl bg-muted/30 hover:bg-muted/70 border border-border/70 text-xs transition-all text-start"
                  >
                    <div className="flex items-center gap-2.5">
                      <img
                        src={c.avatar}
                        alt={c.name}
                        className="w-9 h-9 rounded-full object-cover border shrink-0"
                      />
                      <div>
                        <span className="font-bold text-foreground block text-xs">{c.name}</span>
                        <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                          <span>{conf.icon}</span>
                          <span>{locale === "ar" ? conf.labelAr.split("(")[0] : conf.labelEn.split("(")[0]}</span>
                        </span>
                      </div>
                    </div>
                    <Badge variant={c.isVip ? "default" : "secondary"} className="text-[10px] shrink-0">
                      {c.isVip ? "VIP" : "عادي"}
                    </Badge>
                  </button>
                )
              })}
            </div>
          </div>}
        </div>
      </div>
    )
  }

  // Active theme config based on customer's age group
  const activeConfig = AGE_GROUP_CONFIGS[customer.ageGroup || "adults_18_plus"]

  // Customer is LOGGED IN: Render full Account & Reader Dashboard with age styling
  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl space-y-8">
      {/* Age-Group Dedicated Realm Banner */}
      <div
        className={`stitch-card rounded-3xl p-6 sm:p-8 border shadow-md relative overflow-hidden bg-gradient-to-r ${activeConfig.colorTheme.gradient} ${activeConfig.colorTheme.accentBorder}`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black bg-background/80 backdrop-blur-xs border border-border shadow-2xs">
              <span className="text-base">{activeConfig.icon}</span>
              <span className={activeConfig.colorTheme.badgeText}>
                {locale === "ar" ? activeConfig.labelAr : activeConfig.labelEn}
              </span>
              {customer.ageGroup === "kids_3_6" && (
                <span className="ms-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 text-[10px] font-bold">
                  {locale === "ar" ? "وضع الأطفال الآمن مفعّل" : "Safe Kids Mode Active"}
                </span>
              )}
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-foreground">
              {locale === "ar" ? "أهلاً بك في رواقك الأدبي المخصص" : "Welcome to Your Literary Realm"}
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {locale === "ar" ? activeConfig.taglineAr : activeConfig.taglineEn}
            </p>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row gap-3">
            <Button
              asChild
              size="lg"
              className={`rounded-2xl h-12 px-6 font-bold shadow-md gap-2 ${activeConfig.colorTheme.buttonClass}`}
            >
              <Link href={`/${locale}${activeConfig.targetPath}`}>
                <Compass className="w-5 h-5" />
                <span>{locale === "ar" ? "تصفح روايات قسمك الآن" : "Explore Your Realm"}</span>
                {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Header Profile Summary */}
      <div className="bg-card rounded-3xl border border-border p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 rounded-2xl overflow-hidden border shrink-0">
            {customer.avatar ? (
              <img
                src={customer.avatar}
                alt={customer.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-primary text-primary-foreground font-bold text-2xl flex items-center justify-center">
                {customer.name.charAt(0)}
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-foreground">{customer.name}</h1>
              {customer.isVip ? (
                <Badge className="bg-purple-600 text-white text-[11px] font-bold gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>VIP</span>
                </Badge>
              ) : (
                <Badge variant="outline" className="text-[11px]">
                  {locale === "ar" ? "قارئ مسجل" : "Registered Reader"}
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {customer.email} {customer.phone && `• ${customer.phone}`} {customer.city && `• ${customer.city}`}
            </p>
          </div>
        </div>

        {/* Quick Actions & Logout */}
        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={logout}
            className="rounded-xl text-xs gap-1.5 text-destructive hover:bg-destructive/10 hover:border-destructive/30"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{locale === "ar" ? "تسجيل الخروج" : "Logout"}</span>
          </Button>
        </div>
      </div>

      {/* Reader 3-Pillar Cards: VIP Pass, Digital Library, Reading Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: VIP Membership Pass */}
        <div className="stitch-card rounded-3xl p-6 bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-background border border-amber-500/30 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-amber-700 dark:text-amber-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>{locale === "ar" ? "عضوية القارئ والمستمع" : "VIP Pass"}</span>
              </span>
              <span className="text-[11px] font-black px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-800 dark:text-amber-200">
                {customer.isVip ? (locale === "ar" ? "نشطة" : "Active") : (locale === "ar" ? "غير مفعلة" : "Inactive")}
              </span>
            </div>
            <h3 className="text-lg font-black text-foreground">
              {customer.vipPlan || (locale === "ar" ? "لا يوجد اشتراك نشط" : "No Active VIP Pass")}
            </h3>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              {locale === "ar"
                ? `لديك ${customer.credits} رصيد كتاب متبقي هذا الشهر لاقتناء أي رواية والاحتفاظ بها.`
                : `You have ${customer.credits} book credits remaining to unlock any title.`}
            </p>
          </div>

          <div className="pt-4 mt-3 border-t border-amber-500/20">
            <Button asChild size="sm" className="stitch-gold-gradient text-white border-0 w-full rounded-xl text-xs font-bold shadow-xs">
              <Link href={`/${locale}/subscriptions`}>
                {customer.isVip
                  ? (locale === "ar" ? "إدارة باقة VIP" : "Manage VIP Pass")
                  : (locale === "ar" ? "ترقية لحساب VIP" : "Upgrade to VIP")}
              </Link>
            </Button>
          </div>
        </div>

        {/* Card 2: Digital Library Shortcut */}
        <div className="stitch-card rounded-3xl p-6 bg-gradient-to-br from-emerald-500/10 via-amber-500/5 to-background border border-emerald-500/20 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4" />
                <span>{locale === "ar" ? "مكتبتي الرقمية" : "My Library"}</span>
              </span>
              <span className="text-[11px] font-black px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">
                {customer.unlockedBooksCount} {locale === "ar" ? "روايات" : "books"}
              </span>
            </div>
            <h3 className="text-lg font-black text-foreground">
              {locale === "ar" ? "المحتوى المرخص والقارئ السحابي" : "Protected Cloud Reader"}
            </h3>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              {locale === "ar"
                ? "اقرأ رواياتك الإلكترونية واستمع للكتب الصوتية عبر مشغلات الويب المؤمنة ضد القرصنة."
                : "Instant access to your in-browser EPUB reader and DRM chapter audio player."}
            </p>
          </div>

          <div className="pt-4 mt-3 border-t border-emerald-500/10">
            <Button asChild variant="outline" size="sm" className="w-full rounded-xl text-xs font-bold border-emerald-500/30 text-emerald-600 hover:bg-emerald-500/10">
              <Link href={`/${locale}/library`}>
                {locale === "ar" ? "فتح المكتبة الرقمية" : "Open Digital Library"}
              </Link>
            </Button>
          </div>
        </div>

        {/* Card 3: Switch Demo User Testing Bar */}
        {DEMO_MODE && <div className="stitch-card rounded-3xl p-6 bg-card border border-border/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-muted-foreground flex items-center gap-1.5">
                <User className="w-4 h-4" />
                <span>{locale === "ar" ? "تبديل الشريحة العمرية" : "Switch Persona"}</span>
              </span>
            </div>
            <h3 className="text-base font-black text-foreground">
              {locale === "ar" ? "اختبار تجربة باقي الفئات العمرية:" : "Test Other Age Groups:"}
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              {locale === "ar"
                ? "انقر لتجربة المتجر بعيون أطفال، ناشئة، يافعين، أو قراء أدب كلاسيكي."
                : "Click to explore the store tailored to each distinct age bracket."}
            </p>
          </div>

          <div className="pt-4 mt-3 border-t border-border grid grid-cols-2 gap-1.5">
            {DEMO_CUSTOMERS.map((c) => (
              <button
                key={c.id}
                onClick={() => handleDemoSwitch(c.id)}
                className={`py-1.5 px-2 rounded-xl text-[11px] font-bold border transition-all text-center ${
                  customer.id === c.id
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-muted/40 hover:bg-muted text-muted-foreground"
                }`}
                title={c.name}
              >
                {c.name.split(" ")[0]} ({AGE_GROUP_CONFIGS[c.ageGroup].icon})
              </button>
            ))}
          </div>
        </div>}
      </div>

      {/* Order History Section */}
      <div className="space-y-4">
        {orderError && <p role="alert" className="text-destructive">{orderError}</p>}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold text-foreground">
              {locale === "ar" ? "سجل الطلبات والمشتريات" : "Order History"}
            </h2>
          </div>
          <span className="text-xs text-muted-foreground">
            {pastOrders.length} {locale === "ar" ? "طلبات مكتملة" : "total orders"}
          </span>
        </div>

        <div className="space-y-3">
          {pastOrders.map((order) => (
            <div
              key={order.id}
              className="bg-card rounded-2xl border border-border p-5 shadow-2xs hover:shadow-xs transition-shadow space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border">
                <div>
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono font-bold text-sm text-foreground">
                      {order.id}
                    </span>
                    <Badge variant="outline" className="border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-bold text-[10px]">
                      <CheckCircle2 className="w-3 h-3 me-1" />
                      {locale === "ar" ? order.statusAr : order.status}
                    </Badge>
                  </div>
                  <span className="text-xs text-muted-foreground mt-1 block">
                    {order.date}
                  </span>
                </div>

                <div className="text-start sm:text-end">
                  <span className="font-bold text-base text-foreground block">
                    {order.total}
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    {order.carrier} • {order.trackingNumber}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-xs font-bold text-muted-foreground block mb-1.5">
                  {locale === "ar" ? "العناصر المشتراة:" : "Purchased Items:"}
                </span>
                <ul className="space-y-1">
                  {order.items.map((item, idx) => (
                    <li key={idx} className="text-xs text-foreground flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
