"use client"

import React, { useState } from "react"
import Link from "next/link"

type FamilyHubViewProps = {
  locale: "ar" | "en"
}

export function FamilyHubView({ locale }: FamilyHubViewProps) {
  const isRtl = locale === "ar"

  const [activeTab, setActiveTab] = useState<"profiles" | "controls" | "activity">("profiles")
  const [screenTimeLimit, setScreenTimeLimit] = useState(45) // minutes
  const [safeContentStrict, setSafeContentStrict] = useState(true)

  const familyMembers = [
    {
      id: "parent",
      name: "د. طارق السعيد",
      role: "المشرف الأبوي الأساسي",
      ageTag: "18+ كبار",
      avatar: "👨‍💼",
      status: "نشط الآن",
      hasPin: true,
    },
    {
      id: "child_1",
      name: "مروان طارق",
      role: "كوكب الاستكشاف",
      ageTag: "٨ سنوات (Kids)",
      avatar: "🧒",
      status: "٣٥ دقيقة قراءة اليوم",
      hasPin: true,
    },
    {
      id: "child_2",
      name: "ليان طارق",
      role: "واحة البراعم (Little)",
      ageTag: "٥ سنوات (Little)",
      avatar: "👧",
      status: "حكاية قبل النوم مكتملة",
      hasPin: false,
    },
  ]

  return (
    <div className="min-h-screen bg-[#10131c] text-[#e0e2ef] py-10 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-emerald-600/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-96 left-[-100px] w-[500px] h-[500px] bg-[#e6c184]/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-[1280px] w-full mx-auto px-4 sm:px-6 relative z-10 space-y-10">
        {/* Breadcrumb Navigation (Matching Stitch f01_base_1440) */}
        <nav className="flex items-center gap-2 text-xs font-bold text-[#d1c5b5]">
          <Link href={`/${locale}`} className="hover:text-[#e6c184] transition-colors">
            {isRtl ? "المكتبة العامة" : "Home"}
          </Link>
          <span className="text-[#4e463a]">/</span>
          <span className="text-[#e6c184]">{isRtl ? "مركز الأسرة والرقابة الأبوية" : "Family Hub & Controls"}</span>
        </nav>

        {/* Monumental Editorial Header (Stitch f01) */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1c1f29] border border-[#4e463a]/40 text-[#e6c184] text-xs font-bold">
            <span className="material-symbols-outlined text-[16px]">family_restroom</span>
            <span>{isRtl ? "منظومة الأمان والرقابة الأبوية" : "Parental Safety System"}</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-black text-[#e0e2ef] tracking-tight">
            {isRtl ? "مساحة هادئة ومحمية لعائلتك في StoryVerse" : "A Safe & Quiet Space for Your Family"}
          </h1>
          <p className="text-xs sm:text-sm text-[#d1c5b5] max-w-2xl leading-relaxed">
            {isRtl
              ? "تحكم كامل في الملفات الشخصية لكل طفل، تقييد أوقات الشاشات، وفصل صارم بين روايات البالغين وحكايات الصغار برمز PIN أمني."
              : "Complete control over child profiles, screen time limits, and strict separation between mature novels and children's stories with security PIN."}
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-2 border-b border-[#4e463a]/40 pb-3">
          <button
            onClick={() => setActiveTab("profiles")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "profiles"
                ? "bg-[#e6c184] text-[#422c00]"
                : "bg-[#1c1f29] text-[#d1c5b5] hover:text-[#e0e2ef]"
            }`}
          >
            {isRtl ? "الملفات العائلية (٣)" : "Family Profiles (3)"}
          </button>
          <button
            onClick={() => setActiveTab("controls")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "controls"
                ? "bg-[#e6c184] text-[#422c00]"
                : "bg-[#1c1f29] text-[#d1c5b5] hover:text-[#e0e2ef]"
            }`}
          >
            {isRtl ? "إعدادات الأمان ووقت الشاشة" : "Safety & Screen Time"}
          </button>
        </div>

        {/* Tab 1: Profiles Grid */}
        {activeTab === "profiles" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {familyMembers.map((member) => (
              <div
                key={member.id}
                className="p-6 rounded-3xl bg-[#1c1f29] border border-[#4e463a]/40 space-y-5 shadow-xl hover:border-[#e6c184] transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="text-4xl">{member.avatar}</span>
                  <span className="px-2.5 py-1 rounded-full bg-[#272a33] text-[#e6c184] text-[11px] font-mono font-bold">
                    {member.ageTag}
                  </span>
                </div>

                <div>
                  <h3 className="font-serif text-lg font-black text-[#e0e2ef]">{member.name}</h3>
                  <span className="text-xs text-[#9a8f81] block mt-0.5">{member.role}</span>
                  <span className="text-xs text-emerald-400 block mt-2 font-medium">{member.status}</span>
                </div>

                <div className="pt-3 border-t border-[#4e463a]/30 flex items-center justify-between">
                  <span className="text-[11px] text-[#9a8f81] flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">lock</span>
                    <span>{member.hasPin ? (isRtl ? "محمي بـ PIN" : "PIN Protected") : (isRtl ? "مفتوح" : "Open")}</span>
                  </span>

                  <button className="px-3 py-1.5 rounded-lg bg-[#272a33] hover:bg-[#32343e] text-xs font-bold text-[#e6c184] transition-colors">
                    {isRtl ? "تعديل الصلاحيات" : "Edit Access"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Safety & Screen Time Controls (Stitch f01) */}
        {activeTab === "controls" && (
          <div className="p-8 rounded-3xl bg-[#1c1f29] border border-[#4e463a]/40 max-w-3xl space-y-8 shadow-xl">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-base font-black text-[#e0e2ef]">
                    {isRtl ? "الحد اليومي لوقت القراءة والاستماع للشاشات" : "Daily Screen Time Limit"}
                  </h3>
                  <p className="text-xs text-[#a5a7b7] mt-0.5">
                    {isRtl
                      ? "يتم إغلاق التطبيق برمز حماية بعد انقضاء الوقت المحدد للأطفال."
                      : "Locks app after set time threshold with PIN prompt."}
                  </p>
                </div>
                <span className="text-lg font-black text-[#e6c184] font-mono">{screenTimeLimit} دقيقة</span>
              </div>

              <input
                type="range"
                min="15"
                max="120"
                step="15"
                value={screenTimeLimit}
                onChange={(e) => setScreenTimeLimit(Number(e.target.value))}
                className="w-full accent-[#e6c184]"
              />
            </div>

            <div className="pt-4 border-t border-[#4e463a]/30 flex items-center justify-between">
              <div>
                <h3 className="font-serif text-base font-black text-[#e0e2ef]">
                  {isRtl ? "التصفية الصارمة للمحتوى الراشد (+١٨)" : "Strict 18+ Content Filter"}
                </h3>
                <p className="text-xs text-[#a5a7b7] mt-0.5">
                  {isRtl
                    ? "حجب كامل لكافة الروايات المصنفة للبالغين عن حسابات الأطفال والناشئة."
                    : "Blocks all adult titles from search and recommendations."}
                </p>
              </div>

              <button
                onClick={() => setSafeContentStrict(!safeContentStrict)}
                className={`w-12 h-6 rounded-full transition-colors relative ${
                  safeContentStrict ? "bg-emerald-500" : "bg-gray-600"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${
                    safeContentStrict ? "end-0.5" : "start-0.5"
                  }`}
                />
              </button>
            </div>

            <div className="p-4 rounded-xl bg-[#181b25] border border-[#4e463a]/30 flex items-center justify-between text-xs text-[#d1c5b5]">
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#e6c184] text-[18px]">verified</span>
                <span>{isRtl ? "تم تفعيل حماية الأسرة السيادية بنجاح" : "Sovereign Family Protection Active"}</span>
              </span>
              <span className="text-emerald-400 font-bold">مؤمن</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
