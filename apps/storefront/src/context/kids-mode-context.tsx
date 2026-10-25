"use client"

import React, { createContext, useContext, useState, useEffect } from "react"

type KidsModeContextType = {
  isKidsMode: boolean
  toggleKidsMode: () => void
  setKidsMode: (enabled: boolean) => void
}

const KidsModeContext = createContext<KidsModeContextType | undefined>(undefined)

export function KidsModeProvider({ children }: { children: React.ReactNode }) {
  const [isKidsMode, setIsKidsMode] = useState<boolean>(false)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("publishing_safe_kids_mode")
      if (stored === "true") {
        setIsKidsMode(true)
      }
    }
  }, [])

  const toggleKidsMode = () => {
    setIsKidsMode((prev) => {
      const next = !prev
      if (typeof window !== "undefined") {
        localStorage.setItem("publishing_safe_kids_mode", next ? "true" : "false")
      }
      return next
    })
  }

  const setKidsMode = (enabled: boolean) => {
    setIsKidsMode(enabled)
    if (typeof window !== "undefined") {
      localStorage.setItem("publishing_safe_kids_mode", enabled ? "true" : "false")
    }
  }

  return (
    <KidsModeContext.Provider value={{ isKidsMode, toggleKidsMode, setKidsMode }}>
      {children}
    </KidsModeContext.Provider>
  )
}

export function useKidsMode() {
  const context = useContext(KidsModeContext)
  if (!context) {
    throw new Error("useKidsMode must be used within a KidsModeProvider")
  }
  return context
}
