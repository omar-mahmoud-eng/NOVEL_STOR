import { notFound } from "next/navigation"
import { RealmExperience, type RealmScreen } from "@/components/realms/realm-experience"
import { getReadingBook } from "@/lib/catalog-server"
import { REALMS } from "@/lib/realms"
import { isValidLocale } from "@/lib/i18n"

const screens = ["books", "reader", "player", "illustrated", "interactive", "library", "preferences", "quest-map", "levels", "words", "detective", "complete", "activities", "offline", "audiobooks"]
export default async function RealmPage({ params, searchParams }: {
  params: Promise<{ locale: string; realm: string; screen: string[] }>
  searchParams: Promise<{ q?: string; page?: string;category?:string }>
}) {
  const { locale, realm, screen: segments } = await params
  if (!isValidLocale(locale) || !["little", "kids", "teens"].includes(realm) || !screens.includes(segments[0]) || segments.length > 2) notFound()
  const selected = realm as "little" | "kids" | "teens"
  const screen = segments[0] as RealmScreen
  const handle = segments[1]
  const book = handle ? await getReadingBook(handle) : undefined
  if (handle && (!book || book.ageGroup !== REALMS[selected].group)) notFound()
  const query = await searchParams
  const page = query.page && /^\d+$/.test(query.page) ? Number(query.page) : undefined
  return <RealmExperience realm={selected} screen={screen} book={book} locale={locale} query={query.q || ""} initialPage={page} category={query.category || "all"} />
}
