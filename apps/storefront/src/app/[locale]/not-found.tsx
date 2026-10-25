"use client"

import React from "react"
import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#10131c] text-[#e0e2ef] flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md w-full bg-[#1c1f29] p-8 rounded-3xl shadow-2xl border border-[#4e463a]/40 space-y-4">
        <h1 className="text-6xl font-black text-[#e6c184] font-serif">٤٠٤</h1>
        <h2 className="text-xl font-bold text-[#e0e2ef]">الصفحة غير موجودة</h2>
        <p className="text-xs text-[#d1c5b5] leading-relaxed">
          لم نتمكن من العثور على الرواق أو الرواية المطلوبة في أرشيف StoryVerse.
        </p>
        <div className="pt-4">
          <Link
            href="/ar"
            className="inline-flex items-center gap-2 rounded-xl bg-[#e6c184] px-6 py-3 text-xs font-bold text-[#422c00] shadow-md hover:bg-[#ffdeaa] transition-colors"
          >
            <span>العودة للمكتبة</span>
            <span>←</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
