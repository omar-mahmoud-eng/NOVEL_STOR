export type ReadingRealm = "originals" | "little" | "kids" | "teens"
export const REALMS = {
  originals: { label: "المكتبة العامة", en: "Originals", age: "18+", group: "adults_18_plus", color: "#e6c184", background: "#10131c", ink: "#e0e2ef", surface: "#1c1f29", featured: "kharaet-al-ramad", prefix: "P" },
  little: { label: "واحة البراعم", en: "Little", age: "3–6", group: "kids_3_6", color: "#7b563e", background: "#fff8f2", ink: "#2b231e", surface: "#ffffff", featured: "book_little_01", prefix: "L" },
  kids: { label: "عالم المستكشفين", en: "Kids", age: "7–12", group: "kids_7_12", color: "#0875a5", background: "#f8f7ff", ink: "#182438", surface: "#ffffff", featured: "book_kids_01", prefix: "K" },
  teens: { label: "عالم اليافعين", en: "Teens", age: "13–17", group: "teens_13_17", color: "#4c43b7", background: "#faf8ff", ink: "#101542", surface: "#ffffff", featured: "book_teens_01", prefix: "T" },
} as const
export function isReadingRealm(value: string): value is ReadingRealm { return Object.hasOwn(REALMS, value) }
export function realmFromPath(path: string): ReadingRealm {
  const match = path.match(/^\/(ar|en)\/realms\/(little|kids|teens)(?:\/|$)/)
  return match ? match[2] as ReadingRealm : "originals"
}
export function realmForAge(group: string): ReadingRealm {
  return (Object.keys(REALMS) as ReadingRealm[]).find((realm) => REALMS[realm].group === group) || "originals"
}
export function realmBase(locale: string, realm: ReadingRealm) { return `/${locale}${realm === "originals" ? "" : `/realms/${realm}`}` }
export function scopedHref(href: string, realm: ReadingRealm): string {
  if (!href.startsWith("/") || href.startsWith("//")) return href
  const match = href.match(/^\/(ar|en)(\/[^?#]*)?([?#].*)?$/)
  if (!match) return href
  const [, locale, raw = "", suffix = ""] = match
  if (raw.startsWith("/realms/") || raw.startsWith("/family-hub") || /^\/(account|login|register|about|privacy|terms)/.test(raw)) return href
  const age = new URL(href, "https://storyverse.local").searchParams.get("age")
  const destination = age ? realmForAge(age) : realm
  if (destination === "originals") return href
  if (raw === "" || raw === "/" || /^\/(books|reader|player|audiobooks|illustrated|interactive|library|preferences|quest-map|levels|words|detective|complete|activities|offline)(\/|$)/.test(raw)) return `${realmBase(locale, destination)}${raw === "/" ? "" : raw}${suffix}`
  return href
}
