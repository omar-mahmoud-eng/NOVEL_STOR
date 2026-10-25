"use client"

import React from "react"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="ar" dir="rtl" className="dark">
      <body className="min-h-screen bg-[#10131c] text-[#e0e2ef] flex flex-col items-center justify-center p-6 text-center font-sans">
        <div className="max-w-md w-full bg-[#1c1f29] p-8 rounded-3xl shadow-2xl border border-[#4e463a]/40 space-y-4">
          <h1 className="text-6xl font-black text-[#ffb4ab] font-serif">٥٠٠</h1>
          <h2 className="text-xl font-bold text-[#e0e2ef]">حدث خطأ غير متوقع</h2>
          <p className="text-xs text-[#d1c5b5] leading-relaxed">
            واجهت المنصة خطأً غير متوقع أثناء معالجة طلبك في الأرشيف الأدبي.
          </p>
          <div className="pt-4">
            <button
              onClick={() => reset()}
              className="inline-flex items-center gap-2 rounded-xl bg-[#e6c184] px-6 py-3 text-xs font-bold text-[#422c00] shadow-md hover:bg-[#ffdeaa] transition-colors"
            >
              <span>إعادة المحاولة</span>
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}
