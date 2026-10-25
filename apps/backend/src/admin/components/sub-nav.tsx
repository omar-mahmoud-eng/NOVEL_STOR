import React from "react"
import { Container, Heading, Text, Badge, Button } from "@medusajs/ui"
import { ArrowRight, RefreshCw } from "lucide-react"

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
}) => {
  return (
    <div className="space-y-4 mb-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-ui-border-base">
        <div>
          <div className="flex items-center gap-2 text-xs text-ui-fg-subtle mb-1">
            <span>{parentTitle}</span>
            <span>/</span>
            <span className="font-semibold text-ui-fg-base">{currentTitle}</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Icon className="w-6 h-6 text-ui-fg-interactive" />
            <Heading level="h1" className="text-xl font-bold tracking-tight text-ui-fg-base">
              {currentTitle}
            </Heading>
          </div>
          <Text className="text-xs text-ui-fg-subtle mt-1">{description}</Text>
        </div>
        <div className="flex items-center gap-2">
          {actionButton}
          {onRefresh && (
            <Button
              variant="secondary"
              size="small"
              onClick={onRefresh}
              className="flex items-center gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
              تحديث
            </Button>
          )}
        </div>
      </div>

      {/* Sub-Tabs Bar (Matching Nested Sidebar Hierarchy) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-ui-border-base/60">
        {tabs.map((tab) => (
          <a
            key={tab.href}
            href={tab.href}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-2 whitespace-nowrap ${
              tab.active
                ? "bg-ui-bg-base text-ui-fg-base font-bold shadow-sm border border-ui-border-base"
                : "text-ui-fg-subtle hover:text-ui-fg-base hover:bg-ui-bg-subtle"
            }`}
          >
            <span>{tab.label}</span>
            {tab.badge && (
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  tab.active ? "bg-ui-bg-interactive text-white" : "bg-ui-bg-subtle text-ui-fg-subtle"
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
