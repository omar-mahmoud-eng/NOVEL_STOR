import React from "react"
import { isValidLocale, defaultLocale, Locale } from "@/lib/i18n"
import { PUBLISHING_BOOKS } from "@/lib/books-data"
import { PublishingCatalogView, StoryBook } from "@/components/products/publishing-catalog-view"

export const metadata = {
  title: "مكتبة الروايات والقصص لجميع الأعمار | منصة النشر المتكاملة",
  description:
    "استكشف آلاف الروايات والقصص المصورة للأطفال واليافعين والكبار بصيغ ورقية وإلكترونية وصوتية مع حماية ضد القرصنة.",
}

export default async function BooksCatalogPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams?: Promise<{ age?: string }>
}) {
  const { locale } = await params
  const validLocale = isValidLocale(locale) ? (locale as Locale) : defaultLocale
  const resolvedSearchParams = searchParams ? await searchParams : undefined
  const initialAge = resolvedSearchParams?.age || "all"

  const formattedBooks: StoryBook[] = PUBLISHING_BOOKS.map((b) => ({
    id: b.id,
    title: b.title,
    handle: b.handle,
    author: b.author.name,
    narrator: b.narrator?.name,
    ageGroup: b.ageGroup,
    coverUrl: b.coverUrl,
    paperbackPrice: b.paperbackPrice,
    ebookPrice: b.ebookPrice,
    audiobookPrice: b.audiobookPrice,
    hasAudioSample: b.hasAudioSample,
    sampleAudioUrl: b.sampleAudioUrl,
    sampleAudioDuration: b.sampleAudioDuration,
    defaultVariantId: b.defaultVariantId,
    description: b.description,
  }))

  return (
    <div className="min-h-screen bg-background">
      <PublishingCatalogView
        initialBooks={formattedBooks}
        locale={validLocale}
        initialAge={initialAge}
      />
    </div>
  )
}
