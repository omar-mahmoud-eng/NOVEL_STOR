"use client"

import React, { useState } from "react"
import { useFamilySetting as useLocalSetting } from "@/hooks/use-family-setting"
import { useCustomerAuth } from "@/context/customer-auth-context"
import { useReadingState } from "@/context/reading-state-context"
import { useRouter } from "next/navigation"
import Link from "@/components/common/realm-link"

type FamilyHubViewProps = {
  locale: "ar" | "en"
}

export function FamilyHubView({ locale }: FamilyHubViewProps) {
  const isRtl = locale === "ar"
  const router = useRouter()
  const {customer}=useCustomerAuth()
  const {state}=useReadingState()
  const [profiles]=useLocalSetting<Array<{id:string;name:string;realm:"little"|"kids"|"teens"}>>("storyverse.family.profiles",[])
  const [privacyAck, setPrivacyAck] = useLocalSetting("storyverse.family.privacy", false)
  const [activeTab, setActiveTab] = useState<"overview" | "profiles" | "controls">("overview")
  const [screenTimeLimit, setScreenTimeLimit] = useLocalSetting("storyverse.family.timeLimit", 45)
  const [quietHoursActive, setQuietHoursActive] = useLocalSetting("storyverse.family.quiet", true)
  const [saveToast, setSaveToast] = useState(false)

  const handleSaveTemp = () => {
    localStorage.setItem(`storyverse.family.privacy${customer?`.`+customer.id:""}`, JSON.stringify(privacyAck))
    localStorage.setItem(`storyverse.family.timeLimit${customer?`.`+customer.id:""}`, JSON.stringify(screenTimeLimit))
    localStorage.setItem(`storyverse.family.quiet${customer?`.`+customer.id:""}`, JSON.stringify(quietHoursActive))
    setSaveToast(true)
    router.push(`/${locale}/platforms`)
  }

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] text-[#0F172A] py-8 sm:py-12 relative overflow-hidden font-sans">
      {/* Ambient serene slate/teal glows */}
      <div className="absolute -top-32 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-96 left-10 w-80 h-80 bg-slate-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col gap-8">
        {/* Top Breadcrumb & Step Progress Ribbon (Stitch F01) */}
        <div className="flex flex-col gap-4">
          <nav aria-label="مسار التنقل" className="flex items-center gap-2 text-slate-500 text-xs">
            <Link href={`/${locale}`} className="hover:text-slate-900 transition-colors">
              {isRtl ? "الرئيسية" : "Home"}
            </Link>
            <span>/</span>
            <span className="hover:text-slate-900 transition-colors">
              {isRtl ? "مركز الأسرة" : "Family Hub"}
            </span>
            <span>/</span>
            <span className="text-slate-900 font-bold">
              {isRtl ? "تهيئة حساب العائلة والخصوصية" : "Family Setup & Privacy"}
            </span>
          </nav>

          {/* 3-Step Progress Ribbon (Stitch F01) */}
          <div className="bg-white p-2 rounded-2xl flex items-center justify-between gap-3 shadow-sm border border-slate-200">
            {/* Step 1: Active */}
            <div className="flex-1 flex items-center gap-3 bg-slate-50 px-4 py-2.5 rounded-xl border border-teal-200 shadow-sm">
              <div className="w-7 h-7 rounded-full bg-teal-700 text-white flex items-center justify-center text-xs font-bold shrink-0">
                ١
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                  {isRtl ? "نظرة عامة والخصوصية" : "Overview & Privacy"}
                </span>
                <span className="text-[11px] text-teal-700 font-semibold">
                  {isRtl ? "الخطوة الحالية (F01)" : "Current Step (F01)"}
                </span>
              </div>
            </div>

            <div className="text-slate-300 hidden sm:flex items-center">
              <span className="material-symbols-outlined text-[20px] rtl:rotate-180">arrow_forward</span>
            </div>

            {/* Step 2 */}
            <div className="flex-1 flex items-center gap-3 px-4 py-2.5 rounded-xl opacity-75">
              <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-xs font-bold shrink-0">
                ٢
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs sm:text-sm font-semibold text-slate-700 truncate">
                  {isRtl ? "التحقق والموافقة" : "Consent & Verification"}
                </span>
                <span className="text-[11px] text-slate-400">
                  {isRtl ? "المرحلة القادمة (F02)" : "Next (F02)"}
                </span>
              </div>
            </div>

            <div className="text-slate-300 hidden sm:flex items-center">
              <span className="material-symbols-outlined text-[20px] rtl:rotate-180">arrow_forward</span>
            </div>

            {/* Step 3 */}
            <div className="flex-1 flex items-center gap-3 px-4 py-2.5 rounded-xl opacity-75">
              <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-xs font-bold shrink-0">
                ٣
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs sm:text-sm font-semibold text-slate-700 truncate">
                  {isRtl ? "تخصيص القراء" : "Reader Profiles"}
                </span>
                <span className="text-[11px] text-slate-400">
                  {isRtl ? "إنشاء الملفات" : "Create Profiles"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Editorial Header Section with Visual Trust Anchor (Stitch F01) */}
        <section className="bg-white p-6 sm:p-10 rounded-3xl shadow-sm border border-slate-200 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="flex-1 flex flex-col gap-3 z-10 text-right">
            <div className="inline-flex items-center gap-2 bg-teal-50 text-teal-800 px-3.5 py-1.5 rounded-full w-fit text-xs font-bold border border-teal-200">
              <span className="material-symbols-outlined text-[16px]">verified_user</span>
              <span>{isRtl ? "تفضيلات قراءة الأسرة" : "Family reading preferences"}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              {isRtl
                ? "مساحة هادئة ومحمية لعائلتك في StoryVerse"
                : "A Serene, Safe Sanctuary for Your Family"}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl">
              {isRtl
                ? "منصة مطالعة باللغة العربية تضع خصوصية الطفل وسلامته النفسية فوق كل اعتبار. قبل الشروع في تخصيص فضاءات القراءة لأبنائك، نوضح لك مبادئنا الصارمة في حفظ البيانات وإدارتها دون استغلال أو تتبع خفي."
                : "An Arabic literary sanctuary designed with the child's dignity and psychological wellbeing first. Below are our strict commitments regarding data governance, free from monetization or covert tracking."}
            </p>
          </div>

          {/* Trust Visual Badge & Image */}
          <div className="w-full md:w-56 h-40 relative shrink-0 rounded-2xl overflow-hidden bg-slate-900 shadow-sm flex items-center justify-center">
            <img
              className="w-full h-full object-cover opacity-80"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuB29YSEmkDhW4DglggAL1aW-p9fkZnEtm7zvK222ZJdxuglV2Nb1uo0p5ZQ2niw4OMTtYmGMPLspAYzktc-FCQOTGPhSes0fG6ELrqXbTKEJHkfhvaCGxBozaseTXL7HriMEyUHu-ljDSvxypVebAwI5PD5EY7_YoeM3f4EcdfWl7X9fm1KW3Fxq9TShRyaO-kxezK9Fv0PnlaM0FCuXUuzQEukd5VttfhnIFn6gK6bQ7amXh2K7yT5"
              alt="بيئة خاضعة لإشرافك الكامل"
            />
            <div className="absolute inset-0 bg-slate-950/40" />
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center text-white">
              <span className="material-symbols-outlined text-[34px] mb-1 text-teal-300">security</span>
              <span className="text-xs font-bold">
                {isRtl ? "بيئة خاضعة لإشرافك الكامل" : "Under Full Parental Sovereignty"}
              </span>
            </div>
          </div>
        </section>

        {/* View Switcher Tabs: Overview vs. Live Controls */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === "overview"
                ? "bg-teal-700 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            {isRtl ? "ميثاق الخصوصية وحماية الطفل" : "Privacy & Safety Charter"}
          </button>
          <button
            onClick={() => setActiveTab("controls")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === "controls"
                ? "bg-teal-700 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            {isRtl ? "لوحة الإشراف وحدود الشاشات" : "Screen Time & Controls"}
          </button>
        </div>

        <Link href={`/${locale}/family-hub/profiles`} className="text-sm font-bold underline text-teal-800">{isRtl ? "إدارة ملفات الأسرة" : "Manage family profiles"}</Link>
        {activeTab === "overview" ? (
          <>
            {/* Two-column Comparison & Commitment Grid (Stitch F01) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Right Box: What is collected (Essential for reading) */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-200 flex flex-col justify-between">
                <div className="flex flex-col gap-6">
                  <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                    <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[24px]">fact_check</span>
                    </div>
                    <div className="flex flex-col text-right">
                      <h2 className="text-lg font-bold text-slate-900">
                        {isRtl ? "الحد الأدنى الضروري لخدمة القراءة" : "Essential Minimum Data"}
                      </h2>
                      <span className="text-xs text-teal-700 font-semibold">
                        {isRtl ? "ما نحتاجه فقط لتخصيص تجربة ملهمة" : "Only what enriches the literary experience"}
                      </span>
                    </div>
                  </div>

                  <ul className="flex flex-col gap-4 text-right">
                    {[
                      {
                        icon: "badge",
                        titleAr: "اسم مستعار أو لقب حركي (Pseudonym)",
                        descAr: "لا نشترط الأسماء الرسمية أو العائلية الحقيقية مطلقاً داخل واجهات الطفل.",
                      },
                      {
                        icon: "auto_stories",
                        titleAr: "الفئة العمرية التقريبية",
                        descAr: "(3-6، 7-12، 13-17 عاماً) لعرض الفهرس اللغوي والقصصي الملائم وتفادي حرق النصوص.",
                      },
                      {
                        icon: "face_4",
                        titleAr: "صورة رمزية مجهزة مسبقاً (Illustrated Avatar)",
                        descAr: "مكتبة مرسومة بعناية يختار منها الطفل شخصيته المحببة دون رفع صور حقيقية.",
                      },
                      {
                        icon: "timer",
                        titleAr: "تفضيلات الخط والحدود الزمنية الطوعية",
                        descAr: "حجم الحرف، مسافات التشكيل، ومؤقت الجلسة للوقاية من إجهاد النظر.",
                      },
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                        <span className="material-symbols-outlined text-teal-700 text-[20px] shrink-0 mt-0.5">
                          {item.icon}
                        </span>
                        <div className="flex flex-col">
                          <span className="text-xs sm:text-sm font-bold text-slate-900">{item.titleAr}</span>
                          <span className="text-xs text-slate-500 mt-0.5 leading-relaxed">{item.descAr}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 pt-4 flex items-center justify-between text-xs bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-100">
                  <span className="text-slate-500">{isRtl ? "التشفير أثناء التخزين والنقل" : "Data Encryption"}</span>
                  <span className="font-bold text-slate-900 font-mono">AES-256 بت معتمد</span>
                </div>
              </div>

              {/* Left Box: Strictly Prohibited / Never Collected (Stitch F01) */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-200 flex flex-col justify-between">
                <div className="flex flex-col gap-6">
                  <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                    <div className="w-10 h-10 rounded-xl bg-red-100 text-red-700 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[24px]">block</span>
                    </div>
                    <div className="flex flex-col text-right">
                      <h2 className="text-lg font-bold text-slate-900">
                        {isRtl ? "ضمانات الحماية والخصوصية الصارمة" : "Strict Prohibitions"}
                      </h2>
                      <span className="text-xs text-red-700 font-semibold">
                        {isRtl ? "ممارسات محظورة قطيعاً ومستبعدة برمجياً" : "Excluded by architectural design"}
                      </span>
                    </div>
                  </div>

                  <ul className="flex flex-col gap-4 text-right">
                    {[
                      {
                        icon: "no_accounts",
                        titleAr: "لا هواتف ولا صور واقعية للطفل",
                        descAr: "خلو تام من جمع البريد الإلكتروني أو أرقام الهواتف أو الصور الفوتوغرافية الحقيقية.",
                      },
                      {
                        icon: "mic_off",
                        titleAr: "لا تسجيل صوتي وميكروفون معطل",
                        descAr: "الميكروفون معطل برمجياً في كافة واجهات الأطفال والناشئة لمنع جمع البصمات الصوتية.",
                      },
                      {
                        icon: "location_off",
                        titleAr: "لا تتبع جغرافي (GPS) ولا إعلانات تجارية",
                        descAr: "منع ملفات تعريف الارتباط التسويقية ومستشعرات الموقع وخلو كامل من الإعلانات.",
                      },
                      {
                        icon: "speaker_notes_off",
                        titleAr: "لا شبكات تواصل أو محادثات مفتوحة",
                        descAr: "لا توجد قوائم متابعين أو رسائل خاصة (DMs) تجنباً لأي اتصال غير مراقب.",
                      },
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3 bg-red-50/40 p-3.5 rounded-xl border border-red-100">
                        <span className="material-symbols-outlined text-red-600 text-[20px] shrink-0 mt-0.5">
                          {item.icon}
                        </span>
                        <div className="flex flex-col">
                          <span className="text-xs sm:text-sm font-bold text-slate-900">{item.titleAr}</span>
                          <span className="text-xs text-slate-500 mt-0.5 leading-relaxed">{item.descAr}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 pt-4 flex items-center justify-between text-xs bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-100">
                  <span className="text-slate-500">{isRtl ? "حالة الاتصال والشبكات" : "Network Status"}</span>
                  <span className="font-bold text-teal-800">
                    {isRtl ? "معزولة تماماً داخل مساحة القراءة" : "Fully Sandboxed Sanctuary"}
                  </span>
                </div>
              </div>
            </div>

            {/* Explanation of Guardian Ownership Card (Stitch F01) */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-200 flex flex-col md:flex-row items-start gap-6 text-right">
              <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center shrink-0 shadow-sm">
                <span className="material-symbols-outlined text-[28px]">shield_person</span>
              </div>
              <div className="flex-1 flex flex-col gap-1.5">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-bold text-slate-900">
                    {isRtl ? "الملكية الإدارية والقانونية الكاملة لولي الأمر" : "Full Guardian Legal Ownership"}
                  </h3>
                  <span className="bg-teal-50 text-teal-800 text-[11px] px-2.5 py-0.5 rounded-full font-bold border border-teal-200">
                    {isRtl ? "مبدأ السيادة الأبوية" : "Parental Sovereignty"}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {isRtl
                    ? "الملفات الشخصية للأبناء ليست حسابات مستقلة؛ إنها ملفات تابعة ومملوكة قانونياً وتقنياً لولي الأمر، ويمكن تعديلها أو تصدير بيانات مطالعتها أو مسحها نهائياً بضغطة زر واحدة في أي وقت دون حاجة لتقديم مبررات."
                    : "Children profiles are sub-profiles owned strictly by the guardian. They can be updated, exported, or permanently purged with a single click at any time."}
                </p>
              </div>
            </div>
          </>
        ) : (
          /* Live Controls Tab: Active Family Profiles & Limiters */
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {profiles.map(profile=>({id:profile.id,name:profile.name,role:profile.realm,ageTag:profile.realm==="little"?"3–6":profile.realm==="kids"?"7–12":"13–17",avatar:profile.realm==="little"?"🧸":"📚",status:`${Object.values(state[profile.realm].entries).filter(entry=>entry.completed).length} نصوص مكتملة في هذه المنصة`})).map((member) => (
                <div
                  key={member.id}
                  className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between gap-4 text-right"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-3xl">{member.avatar}</span>
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {member.ageTag}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">{member.name}</h3>
                    <p className="text-xs text-slate-500">{member.role}</p>
                    <p className="text-xs text-teal-700 font-semibold mt-1">{member.status}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Screen Time & Quiet Hours Limiter */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm text-right space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {isRtl ? "مؤقت وقت السكون والاستراحة اليومية" : "Quiet time and reading reminder"}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {isRtl
                    ? "يظهر تذكير بأخذ استراحة بعد الوقت المحدد في منصات الصغار على هذا الجهاز. التذكير لا يقفل الجهاز ولا يمنع المتابعة."
                    : "A reminder appears after the selected reading time on this device. It does not lock the device or prevent reading."}
                </p>
              </div>

              <div className="flex flex-col gap-2 max-w-md">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-600">{isRtl ? "التذكير بعد:" : "Allowed Daily Reading:"}</span>
                  <span className="text-teal-800 text-sm font-mono">{screenTimeLimit} دقيقة</span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="120"
                  step="15"
                  value={screenTimeLimit}
                  onChange={(e) => setScreenTimeLimit(Number(e.target.value))}
                  className="w-full accent-teal-700 cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>15 د</span>
                  <span>45 د</span>
                  <span>90 د</span>
                  <span>120 د</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="flex flex-col text-right">
                  <span className="text-xs sm:text-sm font-bold text-slate-900">
                    {isRtl ? "إظهار تذكير وقت الهدوء (بعد الساعة ٨ مساءً)" : "Quiet time reminder (After 8 PM)"}
                  </span>
                  <span className="text-xs text-slate-500">
                    {isRtl ? "رسالة هادئة في منصات الصغار تقترح القراءة والاستراحة" : "A gentle reminder in the child reading realms"}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setQuietHoursActive(!quietHoursActive)}
                  className={`w-12 h-7 rounded-full transition-colors relative ${
                    quietHoursActive ? "bg-teal-700" : "bg-slate-300"
                  }`}
                >
                  <span
                    className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-transform ${
                      quietHoursActive ? "right-6" : "right-1"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Verification Checklist & Action Buttons (Stitch F01) */}
        <div className="flex flex-col gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <input
                id="privacy-ack"
                type="checkbox"
                checked={privacyAck}
                onChange={(e) => setPrivacyAck(e.target.checked)}
                className="w-5 h-5 accent-teal-700 cursor-pointer rounded"
              />
              <label htmlFor="privacy-ack" className="text-xs sm:text-sm font-bold text-slate-900 cursor-pointer">
                {isRtl
                  ? "أقر باطلاعي على شروط الخصوصية والميثاق المخصص لحماية الأطفال"
                  : "I acknowledge and agree to the child privacy charter"}
              </label>
            </div>
            <div className="flex items-center gap-1.5 text-slate-500 text-xs">
              <span className="material-symbols-outlined text-[16px] text-teal-700">lock</span>
              <span>{isRtl ? "متوافق مع معايير COPPA و GDPR-K الدولية" : "COPPA & GDPR-K Compliant"}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              onClick={handleSaveTemp}
              type="button"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors border border-slate-200"
            >
              <span className="material-symbols-outlined text-[18px]">save</span>
              <span>{isRtl ? "مغادرة وحفظ التقدم مؤقتاً" : "Save Progress & Exit"}</span>
            </button>

            <div className="w-full sm:w-auto flex flex-col sm:flex-row items-center gap-3">
              <Link
                href={`/${locale}/login`}
                className="text-xs text-slate-600 hover:text-slate-900 underline underline-offset-4 font-semibold"
              >
                {isRtl ? "هل لديك حساب بالفعل؟ تسجيل دخول ولي الأمر (P11)" : "Already have an account? Sign In"}
              </Link>
              <Link
                href={`/${locale}/family-hub/verify`}
                className={`w-full sm:w-auto px-8 py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all ${
                  privacyAck
                    ? "bg-teal-700 text-white hover:bg-teal-800 active:scale-95"
                    : "bg-slate-300 text-slate-500 pointer-events-none"
                }`}
              >
                <span>{isRtl ? "المتابعة إلى التحقق وموافقة ولي الأمر (F02)" : "Proceed to Guardian Verification (F02)"}</span>
                <span className="material-symbols-outlined text-[18px] rtl:rotate-180">arrow_forward</span>
              </Link>
            </div>
          </div>

          {/* Legal Footnote */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-start gap-3 text-right">
            <span className="material-symbols-outlined text-slate-400 text-[18px] shrink-0 mt-0.5">info</span>
            <p className="text-[11px] sm:text-xs text-slate-500 leading-relaxed">
              <strong className="text-slate-800 font-bold">
                {isRtl ? "ملاحظة قانونية:" : "Legal Note:"}
              </strong>{" "}
              {isRtl
                ? "إدخال رمز المرور العائلي (PIN) أو إكمال الإعداد لا يمثل إثباتاً قانونياً للوصاية، وتتطلب الصلاحيات الحساسة (مثل عمليات الشراء وتغيير الملكية) توثيقاً مستقلاً عبر البريد المعتمد لولي الأمر."
                : "Entering the family PIN does not replace legal guardianship. Sensitive changes (such as subscription management or ownership transfer) require secondary email verification."}
            </p>
          </div>
        </div>
      </div>

      {/* Save Notification Toast */}
      {saveToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-teal-800 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-bold animate-in fade-in slide-in-from-bottom-4">
          <span className="material-symbols-outlined text-[18px]">check_circle</span>
          <span>{isRtl ? "تم حفظ تقدم الإعدادات بنجاح!" : "Progress saved successfully!"}</span>
        </div>
      )}
    </div>
  )
}
