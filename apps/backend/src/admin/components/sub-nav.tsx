import React from "react"
import { Container, Heading, Text, Badge, Button } from "@medusajs/ui"
import { ArrowRight, RefreshCw, Sparkles } from "lucide-react"
import {AdminRequestNotice} from "./request-notice"

export interface NavTab {
  label: string
  href: string
  active?: boolean
  badge?: string
}

interface SubNavProps {
  parentTitle: string
  currentTitle: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  tabs: NavTab[]
  onRefresh?: () => void
  isLoading?: boolean
  actionButton?: React.ReactNode
  sampleData?: boolean
}

export const SubNav: React.FC<SubNavProps> = ({
  parentTitle,
  currentTitle,
  description,
  icon: Icon,
  tabs,
  onRefresh,
  isLoading,
  actionButton,
  sampleData,
}) => {
  return (
    <div className="space-y-4 mb-6">
      <AdminRequestNotice/>
      {sampleData && <p role="status" className="rounded-lg border border-amber-400 p-3 text-sm text-amber-700">هذه الشاشة تعرض بيانات توضيحية. لا تستخدمها في قرارات مالية أو تشغيلية حتى ربطها بالسجلات الفعلية.</p>}
      {/* Top Header with Google Stitch Design Hierarchy */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-ui-border-base/70">
        <div>
          <div className="flex items-center gap-2 text-xs text-ui-fg-subtle mb-1">
            <span className="font-medium text-amber-600/90 dark:text-amber-400/90">{parentTitle}</span>
            <span className="text-ui-fg-muted">/</span>
            <span className="font-bold text-ui-fg-base">{currentTitle}</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-300 font-semibold border border-amber-500/20 ms-1 flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5 text-amber-500" />
              <span>Stitch Vibe</span>
            </span>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-500/20">
              <Icon className="w-5 h-5" />
            </div>
            <Heading level="h1" className="text-xl font-black tracking-tight text-ui-fg-base">
              {currentTitle}
            </Heading>
          </div>
          <Text className="text-xs text-ui-fg-subtle mt-1.5 leading-relaxed">{description}</Text>
        </div>
        <div className="flex items-center gap-2">
          {actionButton}
          {onRefresh && (
            <Button
              variant="secondary"
              size="small"
              onClick={onRefresh}
              className="flex items-center gap-1.5 rounded-lg border-amber-500/20 hover:border-amber-500/40 text-xs font-bold"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
              تحديث
            </Button>
          )}
        </div>
      </div>

      {/* Sub-Tabs Bar (Enhanced with Google Stitch Gold Accents) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-ui-border-base/60">
        {tabs.map((tab) => (
          <a
            key={tab.href}
            href={tab.href}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-2 whitespace-nowrap ${
              tab.active
                ? "bg-amber-500/10 text-amber-700 dark:text-amber-300 font-bold shadow-xs border border-amber-500/40"
                : "text-ui-fg-subtle hover:text-ui-fg-base hover:bg-ui-bg-subtle"
            }`}
          >
            <span>{tab.label}</span>
            {tab.badge && (
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  tab.active
                    ? "bg-amber-600 text-white"
                    : "bg-ui-bg-subtle text-ui-fg-subtle"
                }`}
              >
                {tab.badge}
              </span>
            )}
          </a>
        ))}
      </div>
    </div>
  )
}
