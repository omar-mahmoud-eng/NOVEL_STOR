"use client"

import React, { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { BookOpen, X, Sun, Moon, Type, ChevronLeft, ChevronRight } from "lucide-react"

type SampleReaderProps = {
  isOpen: boolean
  onClose: () => void
  bookTitle: string
  authorName: string
  sampleText: string[]
  locale: "ar" | "en"
}

export function SampleReaderModal({
  isOpen,
  onClose,
  bookTitle,
  authorName,
  sampleText,
  locale,
}: SampleReaderProps) {
  const [currentPage, setCurrentPage] = useState(0)
  const [fontSize, setFontSize] = useState<"sm" | "base" | "lg">("base")
  const [theme, setTheme] = useState<"day" | "sepia" | "night">("day")

  const isRtl = locale === "ar"

  const themeClasses = {
    day: "bg-white text-gray-900 border-gray-200",
    sepia: "bg-[#fbf0d9] text-[#5f4b32] border-[#ecd5b3]",
    night: "bg-[#18181b] text-zinc-100 border-zinc-800",
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className={`max-w-3xl h-[85vh] flex flex-col p-0 rounded-3xl overflow-hidden shadow-2xl transition-colors select-none ${themeClasses[theme]}`}
        onContextMenu={(e) => e.preventDefault()} // Anti-scraping defense
      >
        {/* Header Controls */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-inherit">
          <div className="flex items-center gap-2.5 min-w-0">
            <BookOpen className="w-5 h-5 shrink-0 opacity-70" />
            <div className="min-w-0">
              <h3 className="text-sm font-bold truncate">{bookTitle}</h3>
              <p className="text-xs opacity-60 truncate">{authorName} • عينة قراءة مجانية</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Font Size Toggle */}
            <button
              onClick={() =>
                setFontSize((prev) => (prev === "sm" ? "base" : prev === "base" ? "lg" : "sm"))
              }
              className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              title="تعديل حجم الخط"
            >
              <Type className="w-4 h-4" />
            </button>

            {/* Reading Theme Toggle */}
            <button
              onClick={() =>
                setTheme((prev) => (prev === "day" ? "sepia" : prev === "sepia" ? "night" : "day"))
              }
              className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              title="نمط القراءة (نهاري / دافئ / ليلي)"
            >
              {theme === "night" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Reader Body Page */}
        <div className="flex-1 overflow-y-auto px-8 sm:px-14 py-8 text-justify leading-relaxed">
          <div
            className={`space-y-6 ${
              fontSize === "sm" ? "text-sm" : fontSize === "lg" ? "text-lg" : "text-base"
            }`}
          >
            <div className="text-center pb-4 opacity-50 text-xs font-mono">
              --- الفصل الأول (الصفحة {currentPage + 1} من {sampleText.length}) ---
            </div>
            <p className="leading-loose tracking-wide whitespace-pre-line font-serif">
              {sampleText[currentPage] || "جاري تحميل محتوى العينة..."}
            </p>
          </div>
        </div>

        {/* Navigation Footer */}
        <div className="px-6 py-3.5 border-t border-inherit flex items-center justify-between text-xs font-medium">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
            disabled={currentPage === 0}
            className="gap-1.5"
          >
            {isRtl ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            <span>الصفحة السابقة</span>
          </Button>

          <span className="opacity-60 font-mono">
            {currentPage + 1} / {sampleText.length}
          </span>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.min(sampleText.length - 1, p + 1))}
            disabled={currentPage === sampleText.length - 1}
            className="gap-1.5"
          >
            <span>الصفحة التالية</span>
            {isRtl ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
