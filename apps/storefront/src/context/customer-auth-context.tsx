"use client"

import React, { createContext, useContext, useState, useEffect } from "react"

export type AgeGroupType = "kids_3_6" | "kids_7_12" | "teens_13_17" | "adults_18_plus"

export type CustomerUser = {
  id: string
  name: string
  email: string
  phone?: string
  city?: string
  avatar?: string
  ageGroup: AgeGroupType
  isVip: boolean
  vipPlan?: string
  credits: number
  preferredFormat: "paperback" | "ebook" | "audiobook" | "hybrid"
  unlockedBooksCount: number
}

export type AgeGroupThemeConfig = {
  id: AgeGroupType
  labelAr: string
  labelEn: string
  taglineAr: string
  taglineEn: string
  icon: string
  colorTheme: {
    bgLight: string
    badgeBg: string
    badgeText: string
    accentBorder: string
    gradient: string
    buttonClass: string
  }
  targetPath: string
  recommendedBookHandle: string
}

export const AGE_GROUP_CONFIGS: Record<AgeGroupType, AgeGroupThemeConfig> = {
  kids_3_6: {
    id: "kids_3_6",
    labelAr: "براعم الأطفال (3 - 6 سنوات)",
    labelEn: "Early Childhood (Ages 3-6)",
    taglineAr: "قصص ما قبل النوم، رسوم دافئة، وحكايات صوتية تعزز القيم والخيال الهادئ",
    taglineEn: "Bedtime stories, gentle illustrations, and soothing audio tales",
    icon: "👶",
    colorTheme: {
      bgLight: "bg-amber-500/5",
      badgeBg: "bg-amber-500/15",
      badgeText: "text-amber-500 dark:text-amber-400",
      accentBorder: "border-amber-400/30",
      gradient: "from-amber-500/20 via-orange-400/10 to-transparent",
      buttonClass: "bg-amber-500 hover:bg-amber-600 text-white",
    },
    targetPath: "/books?age=kids_3_6",
    recommendedBookHandle: "samsem-the-bunny-adventure",
  },
  kids_7_12: {
    id: "kids_7_12",
    labelAr: "الناشئة والمستكشفون (7 - 12 سنة)",
    labelEn: "Young Explorers (Ages 7-12)",
    taglineAr: "مغامرات الفضاء السحيق، أسرار البحار السبعة، وخيال علمي يوقظ روح الاكتشاف",
    taglineEn: "Space exploration, mysteries of the seven seas, and sci-fi discovery",
    icon: "🧒",
    colorTheme: {
      bgLight: "bg-emerald-500/5",
      badgeBg: "bg-emerald-500/15",
      badgeText: "text-emerald-500 dark:text-emerald-400",
      accentBorder: "border-emerald-400/30",
      gradient: "from-emerald-500/20 via-teal-400/10 to-transparent",
      buttonClass: "bg-emerald-600 hover:bg-emerald-700 text-white",
    },
    targetPath: "/books?age=kids_7_12",
    recommendedBookHandle: "secret-spaceship-emerald-planet",
  },
  teens_13_17: {
    id: "teens_13_17",
    labelAr: "اليافعون والشباب (13 - 17 سنة)",
    labelEn: "Teens & YA (Ages 13-17)",
    taglineAr: "ألغاز أندلسية غامضة، شفرات تاريخية، وإثارة بوليسية تحبس الأنفاس",
    taglineEn: "Cryptic historical codes, Andalusian mysteries, and gripping thrillers",
    icon: "🧑",
    colorTheme: {
      bgLight: "bg-purple-500/5",
      badgeBg: "bg-purple-500/15",
      badgeText: "text-purple-400 dark:text-purple-300",
      accentBorder: "border-purple-400/30",
      gradient: "from-purple-500/20 via-indigo-500/10 to-transparent",
      buttonClass: "bg-purple-600 hover:bg-purple-700 text-white",
    },
    targetPath: "/books?age=teens_13_17",
    recommendedBookHandle: "alhambra-code-andalusian-manuscript",
  },
  adults_18_plus: {
    id: "adults_18_plus",
    labelAr: "الأدب الكلاسيكي والتاريخي (18+ سنة)",
    labelEn: "Classic Literature & History (18+)",
    taglineAr: "روائع بيت الحكمة، صالون الفكر والتاريخ، وملاحم أدبية راقية لصفوة القراء",
    taglineEn: "House of Wisdom epics, literary salons, and philosophical masterpieces",
    icon: "🧑‍💼",
    colorTheme: {
      bgLight: "bg-amber-600/5",
      badgeBg: "bg-amber-600/15",
      badgeText: "text-amber-600 dark:text-amber-300",
      accentBorder: "border-amber-600/30",
      gradient: "from-amber-700/20 via-amber-600/10 to-transparent",
      buttonClass: "bg-amber-700 hover:bg-amber-800 text-white",
    },
    targetPath: "/books?age=adults_18_plus",
    recommendedBookHandle: "spectres-of-ancient-baghdad",
  },
}

export const DEMO_CUSTOMERS: CustomerUser[] = [
  {
    id: "cust_sarah_02",
    name: "سارة العتيبي (أم راكان)",
    email: "sarah.otaibi@example.com",
    phone: "+966 54 987 6543",
    city: "جدة",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
    ageGroup: "kids_3_6",
    isVip: true,
    vipPlan: "باقة براعم الأطفال (Kids Story Pass)",
    credits: 0,
    preferredFormat: "audiobook",
    unlockedBooksCount: 2,
  },
  {
    id: "cust_fahad_03",
    name: "فهد الدوسري (مستكشف ناشئ)",
    email: "fahad.dossary@example.com",
    phone: "+966 55 456 7890",
    city: "الدمام",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
    ageGroup: "kids_7_12",
    isVip: false,
    credits: 0,
    preferredFormat: "paperback",
    unlockedBooksCount: 2,
  },
  {
    id: "cust_yasmeen_04",
    name: "ياسمين النجار (قارئة ألغاز)",
    email: "yasmeen.najjar@example.com",
    phone: "+966 56 321 9988",
    city: "الخبر",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80",
    ageGroup: "teens_13_17",
    isVip: true,
    vipPlan: "باقة VIP اليافعين والشباب",
    credits: 1,
    preferredFormat: "hybrid",
    unlockedBooksCount: 3,
  },
  {
    id: "cust_tariq_01",
    name: "طارق المنصور (أدب وتاريخ)",
    email: "tariq.almansoor@example.com",
    phone: "+966 50 123 4567",
    city: "الرياض",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80",
    ageGroup: "adults_18_plus",
    isVip: true,
    vipPlan: "باقة VIP القارئ والمستمع (شهري)",
    credits: 2,
    preferredFormat: "hybrid",
    unlockedBooksCount: 4,
  },
]

type CustomerAuthContextType = {
  customer: CustomerUser | null
  isLoading: boolean
  activeAgeGroup: AgeGroupType
  setActiveAgeGroup: (age: AgeGroupType) => void
  login: (email: string, password?: string, ageGroup?: AgeGroupType) => Promise<{ success: boolean; targetUrl: string }>
  register: (data: {
    name: string
    email: string
    password?: string
    phone?: string
    ageGroup?: AgeGroupType
    preferredFormat?: "paperback" | "ebook" | "audiobook" | "hybrid"
  }) => Promise<{ success: boolean; targetUrl: string }>
  logout: () => void
  switchDemoCustomer: (customerId: string) => AgeGroupType
}

const CustomerAuthContext = createContext<CustomerAuthContextType | undefined>(undefined)

export function CustomerAuthProvider({ children }: { children: React.ReactNode }) {
  const [customer, setCustomer] = useState<CustomerUser | null>(DEMO_CUSTOMERS[3]) // Default to Tariq (Adults)
  const [activeAgeGroup, setActiveAgeGroup] = useState<AgeGroupType>("adults_18_plus")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("publishing_customer_session")
      if (stored) {
        try {
          const parsed = JSON.parse(stored) as CustomerUser
          setCustomer(parsed)
          if (parsed.ageGroup) {
            setActiveAgeGroup(parsed.ageGroup)
          }
        } catch {
          setCustomer(DEMO_CUSTOMERS[3])
        }
      }
    }
  }, [])

  const saveCustomer = (cust: CustomerUser | null) => {
    setCustomer(cust)
    if (typeof window !== "undefined") {
      if (cust) {
        localStorage.setItem("publishing_customer_session", JSON.stringify(cust))
        if (cust.ageGroup === "kids_3_6") {
          localStorage.setItem("safe_kids_mode_active", "true")
        } else {
          localStorage.removeItem("safe_kids_mode_active")
        }
        setActiveAgeGroup(cust.ageGroup)
      } else {
        localStorage.removeItem("publishing_customer_session")
        localStorage.removeItem("safe_kids_mode_active")
      }
    }
  }

  const login = async (
    email: string,
    password?: string,
    selectedAgeGroup?: AgeGroupType
  ): Promise<{ success: boolean; targetUrl: string }> => {
    setIsLoading(true)
    try {
      await new Promise((r) => setTimeout(r, 350))
      const found = DEMO_CUSTOMERS.find((c) => c.email.toLowerCase() === email.toLowerCase())
      
      let loggedUser: CustomerUser
      if (found) {
        loggedUser = {
          ...found,
          ageGroup: selectedAgeGroup || found.ageGroup,
        }
      } else {
        const assignedAge = selectedAgeGroup || "adults_18_plus"
        loggedUser = {
          id: `cust_${Date.now()}`,
          name: email.split("@")[0],
          email,
          ageGroup: assignedAge,
          isVip: false,
          credits: 0,
          preferredFormat: "ebook",
          unlockedBooksCount: 1,
        }
      }

      saveCustomer(loggedUser)
      const targetUrl = AGE_GROUP_CONFIGS[loggedUser.ageGroup].targetPath
      return { success: true, targetUrl }
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (data: {
    name: string
    email: string
    password?: string
    phone?: string
    ageGroup?: AgeGroupType
    preferredFormat?: "paperback" | "ebook" | "audiobook" | "hybrid"
  }): Promise<{ success: boolean; targetUrl: string }> => {
    setIsLoading(true)
    try {
      await new Promise((r) => setTimeout(r, 350))
      const assignedAge = data.ageGroup || "adults_18_plus"
      const newCust: CustomerUser = {
        id: `cust_${Date.now()}`,
        name: data.name,
        email: data.email,
        phone: data.phone,
        ageGroup: assignedAge,
        isVip: true, // Welcome bonus: 1 month free VIP
        vipPlan: "باقة VIP الترحيبية للقراء الجدد",
        credits: 1,
        preferredFormat: data.preferredFormat || "hybrid",
        unlockedBooksCount: 1,
      }
      saveCustomer(newCust)
      const targetUrl = AGE_GROUP_CONFIGS[assignedAge].targetPath
      return { success: true, targetUrl }
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    saveCustomer(null)
  }

  const switchDemoCustomer = (customerId: string): AgeGroupType => {
    const found = DEMO_CUSTOMERS.find((c) => c.id === customerId)
    if (found) {
      saveCustomer(found)
      return found.ageGroup
    }
    return "adults_18_plus"
  }

  return (
    <CustomerAuthContext.Provider
      value={{
        customer,
        isLoading,
        activeAgeGroup,
        setActiveAgeGroup,
        login,
        register,
        logout,
        switchDemoCustomer,
      }}
    >
      {children}
    </CustomerAuthContext.Provider>
  )
}

export function useCustomerAuth() {
  const context = useContext(CustomerAuthContext)
  if (!context) {
    throw new Error("useCustomerAuth must be used within a CustomerAuthProvider")
  }
  return context
}
