"use client"

import React from "react"
import { useKidsMode } from "@/context/kids-mode-context"
import { Sparkles, ShieldCheck } from "lucide-react"

export function KidsModeToggle({ locale }: { locale: "ar" | "en" }) {
  const { isKidsMode, toggleKidsMode } = useKidsMode()

  return (
    <button
      onClick={toggleKidsMode}
      className={`relative inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all border shadow-xs select-none ${
        isKidsMode
          ? "bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/80 dark:text-amber-200 dark:border-amber-700 ring-2 ring-amber-400/30"
          : "bg-muted text-muted-foreground border-border hover:text-foreground"
      }`}
      title={
        locale === "ar"
          ? "تفعيل أو إيقاف وضع الأطفال الآمن لتصفية المحتوى المناسب للأعمار من 3 إلى 12 سنة"
          : "Toggle Safe Kids Mode to filter stories tailored for ages 3 to 12"
      }
    >
      <span className="text-base leading-none">👶</span>
      <span>
        {locale === "ar"
          ? isKidsMode
            ? "وضع الأطفال مفعل"
            : "وضع الأطفال الآمن"
          : isKidsMode
          ? "Kids Mode: ON"
          : "Safe Kids Mode"}
      </span>
      {isKidsMode && <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-pulse" />}
    </button>
  )
}
