import { getReadingBook } from "@/lib/catalog-server"
export const dynamic = "force-dynamic"
import { realmBase, realmForAge } from "@/lib/realms"
import React from "react"
import { notFound, redirect } from "next/navigation"
import { isValidLocale, defaultLocale, Locale } from "@/lib/i18n"
import { StudioPlayerView } from "@/components/player/studio-player-view"


export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; handle: string }>
}) {
  const { handle } = await params
  const book = await getReadingBook(handle)
  if (!book) {
    return { title: "مشغل الاستوديو الصوتي | StoryVerse" }
  }

  return {
    title: `استماع: ${book.title} | مشغل الاستوديو مع النص المتزامن`,
    description: `استمع لرواية ${book.title} بصوت ${book.narrator?.name || "نخبة الرواة"} مع متابعة النص السردي المتزامن حياً بتقنية الصوت المكاني.`,
  }
}

export default async function PlayerPage({
  params,
}: {
  params: Promise<{ locale: string; handle: string }>
}) {
  const { locale, handle } = await params
  const validLocale = isValidLocale(locale) ? (locale as Locale) : defaultLocale

  const book = await getReadingBook(handle)
  if (!book) {
    notFound()
  }

  const realm = realmForAge(book.ageGroup)
  if (realm !== "originals") redirect(realmBase(validLocale, realm) + "/player/" + book.handle)

  return <StudioPlayerView book={book} locale={validLocale} />
}
