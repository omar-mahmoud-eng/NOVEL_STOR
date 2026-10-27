export function nextBillingEnd(currentEnd: Date | string, interval: string): Date {
  const current = new Date(currentEnd)
  if (!Number.isFinite(current.getTime()) || !["month", "year"].includes(interval)) throw new Error("Invalid billing period")
  const result = new Date(current)
  const day = current.getUTCDate()
  result.setUTCDate(1)
  if (interval === "year") result.setUTCFullYear(result.getUTCFullYear() + 1)
  else result.setUTCMonth(result.getUTCMonth() + 1)
  const lastDay = new Date(Date.UTC(result.getUTCFullYear(), result.getUTCMonth() + 1, 0)).getUTCDate()
  result.setUTCDate(Math.min(day, lastDay))
  return result
}
