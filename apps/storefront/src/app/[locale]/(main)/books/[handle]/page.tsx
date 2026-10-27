import { getReadingBook } from "@/lib/catalog-server"
export const dynamic = "force-dynamic"
import { realmBase, realmForAge } from "@/lib/realms"
import React from "react"
import { notFound, redirect } from "next/navigation"
import { isValidLocale, defaultLocale, Locale } from "@/lib/i18n"
import { BookDetailView } from "@/components/products/book-detail-view"
import { OriginalStoryDetail } from "@/components/reader/original-story-detail"


export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; handle: string }>
}) {
  const { handle } = await params
  const book = await getReadingBook(handle)
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

  const book = await getReadingBook(handle)
  if (!book) {
    notFound()
  }

  const realm = realmForAge(book.ageGroup)
  if (realm !== "originals") redirect(realmBase(validLocale, realm) + "/books/" + book.handle)

  return (
    <div className="min-h-screen bg-background">
      <OriginalStoryDetail book={book} locale={validLocale} />
    </div>
  )
}
