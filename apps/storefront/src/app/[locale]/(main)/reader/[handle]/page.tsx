import { getReadingBook } from "@/lib/catalog-server"
export const dynamic = "force-dynamic"
import { realmBase, realmForAge } from "@/lib/realms"
import React from "react"
import { notFound, redirect } from "next/navigation"
import { isValidLocale, defaultLocale, Locale } from "@/lib/i18n"
import { ParchmentReaderView } from "@/components/reader/parchment-reader-view"


export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; handle: string }>
}) {
  const { handle } = await params
  const book = await getReadingBook(handle)
  if (!book) {
    return { title: "القارئ الرقمي | StoryVerse" }
  }

  return {
    title: `قراءة: ${book.title} | قارئ المخطوطات السحابي`,
    description: `اقرأ رواية ${book.title} بقلم ${book.author.name} في قارئ المخطوطات الورقي المؤمن ضد القرصنة.`,
  }
}

export default async function ReaderPage({
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
  if (realm !== "originals") redirect(realmBase(validLocale, realm) + "/reader/" + book.handle)

  return <ParchmentReaderView book={book} locale={validLocale} />
}
