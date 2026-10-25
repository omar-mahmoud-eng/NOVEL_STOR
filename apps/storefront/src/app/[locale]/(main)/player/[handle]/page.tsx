import React from "react"
import { notFound } from "next/navigation"
import { isValidLocale, defaultLocale, Locale } from "@/lib/i18n"
import { getBookByHandle, getAllBooks } from "@/lib/books-data"
import { StudioPlayerView } from "@/components/player/studio-player-view"

export async function generateStaticParams() {
  const books = getAllBooks()
  const locales = ["ar", "en"]
  const params: Array<{ locale: string; handle: string }> = []

  for (const locale of locales) {
    for (const book of books) {
      params.push({ locale, handle: book.handle })
    }
  }

  return params
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; handle: string }>
}) {
  const { handle } = await params
  const book = getBookByHandle(handle)
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

  const book = getBookByHandle(handle)
  if (!book) {
    notFound()
  }

  return <StudioPlayerView book={book} locale={validLocale} />
}
