import React from "react"
import { notFound } from "next/navigation"
import { isValidLocale, defaultLocale, Locale } from "@/lib/i18n"
import { getBookByHandle, getAllBooks } from "@/lib/books-data"
import { BookDetailView } from "@/components/products/book-detail-view"

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
    return { title: "الكتاب غير موجود" }
  }

  return {
    title: `${book.title} | ${book.author.name}`,
    description: book.description,
  }
}

export default async function BookDetailPage({
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

  return (
    <div className="min-h-screen bg-background">
      <BookDetailView book={book} locale={validLocale} />
    </div>
  )
}
