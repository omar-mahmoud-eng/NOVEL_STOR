export const dynamic = "force-dynamic"
import React from "react"
import { isValidLocale, defaultLocale, Locale } from "@/lib/i18n"
import { IllustratedReaderView } from "@/components/illustrated/illustrated-reader-view"
import { getReadingBook, getFirstOriginalBook } from "@/lib/catalog-server"
import Link from "next/link"
import { realmBase, realmForAge } from "@/lib/realms"
import { notFound, redirect } from "next/navigation"

export const metadata = {
  title: "سجل المخطوطات والإنتاج السردي المصور (P19) | StoryVerse",
  description: "قارئ الروايات المصورة الفاخرة: نمط الكتاب المزدوج، الشرائح، والويب تون الرأسي مع تكبير عالي الدقة.",
}

export default async function IllustratedPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{book?:string}>
}) {
  const { locale } = await params
  const validLocale = isValidLocale(locale) ? (locale as Locale) : defaultLocale

  const query=await searchParams
  const book=query.book?await getReadingBook(query.book):await getFirstOriginalBook()
  if(!book){if(query.book)notFound();return <section className="mx-auto max-w-xl px-6 py-20 text-center"><h1 className="text-2xl font-bold">{validLocale==='ar'?'لا توجد قصص مصورة منشورة حاليًا':'No published stories are available'}</h1><Link className="mt-6 inline-block underline" href={`/${validLocale}/books`}>{validLocale==='ar'?'العودة إلى المكتبة':'Back to the library'}</Link></section>}
  const realm=realmForAge(book.ageGroup)
  if(realm!=="originals")redirect(`${realmBase(validLocale,realm)}/illustrated/${book.id}`)
  return <IllustratedReaderView locale={validLocale} book={book} />
}
