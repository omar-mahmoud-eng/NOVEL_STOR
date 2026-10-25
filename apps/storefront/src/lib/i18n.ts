import ar from "@/messages/ar.json"
import en from "@/messages/en.json"

export const locales = ["ar", "en"] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = "ar"

const dictionaries = {
  ar,
  en,
}

export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale)
}

export function getDictionary(locale: Locale) {
  return dictionaries[locale] || dictionaries[defaultLocale]
}

export function getDirection(locale: Locale): "rtl" | "ltr" {
  return locale === "ar" ? "rtl" : "ltr"
}

export type Dictionary = typeof ar
