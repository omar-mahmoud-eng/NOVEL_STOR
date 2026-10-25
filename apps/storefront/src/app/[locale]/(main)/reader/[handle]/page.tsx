import React from "react"
import { notFound } from "next/navigation"
import { isValidLocale, defaultLocale, Locale } from "@/lib/i18n"
import { getBookByHandle, getAllBooks } from "@/lib/books-data"
import { ParchmentReaderView } from "@/components/reader/parchment-reader-view"

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

  const book = getBookByHandle(handle)
  if (!book) {
    notFound()
  }

  return <ParchmentReaderView book={book} locale={validLocale} />
}
