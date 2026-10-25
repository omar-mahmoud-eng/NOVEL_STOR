import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(
  amount: number,
  currencyCode = "SAR",
  locale: "ar" | "en" = "ar"
): string {
  try {
    return new Intl.NumberFormat(locale === "ar" ? "ar-SA" : "en-US", {
      style: "currency",
      currency: currencyCode.toUpperCase(),
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount / 100)
  } catch {
    const symbol = currencyCode === "SAR" ? (locale === "ar" ? "ر.س" : "SAR") : currencyCode
    return `${(amount / 100).toFixed(2)} ${symbol}`
  }
}

export function formatDate(dateString: string | Date, locale: "ar" | "en" = "ar"): string {
  const date = typeof dateString === "string" ? new Date(dateString) : dateString
  return new Intl.DateTimeFormat(locale === "ar" ? "ar-SA" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date)
}
