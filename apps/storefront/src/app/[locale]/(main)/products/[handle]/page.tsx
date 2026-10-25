import React from "react"
import { notFound } from "next/navigation"
import { isValidLocale, defaultLocale, Locale, locales, getDictionary } from "@/lib/i18n"
import { COLLECTOR_EDITIONS } from "../page"
import { ProductDetailView } from "@/components/products/product-detail-view"

export function generateStaticParams() {
  const params: { locale: string; handle: string }[] = []
  for (const locale of locales) {
    for (const item of COLLECTOR_EDITIONS) {
      params.push({ locale, handle: item.handle })
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
  const item = COLLECTOR_EDITIONS.find((p) => p.handle === handle)
  if (!item) return { title: "المقتنى غير موجود" }

  return {
    title: `${item.title} | StoryVerse Deluxe`,
    description: item.description,
  }
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ locale: string; handle: string }>
}) {
  const { locale, handle } = await params
  const validLocale = isValidLocale(locale) ? (locale as Locale) : defaultLocale
  const dict = getDictionary(validLocale)

  const item = COLLECTOR_EDITIONS.find((p) => p.handle === handle)
  if (!item) {
    notFound()
  }

  const product = {
    id: item.id,
    title: item.title,
    handle: item.handle,
    description: item.description,
    price: item.price,
    currencyCode: "SAR",
    thumbnail: item.thumbnail,
    images: [item.thumbnail],
    inStock: item.inStock,
    sku: `DELUXE-${item.id.toUpperCase()}`,
    variants: [
      { id: `variant_${item.id}_box`, title: item.editionType, inStock: true },
      { id: `variant_${item.id}_signed`, title: "نسخة موقعة من المؤلف + ختم ملكي", inStock: true },
    ],
    specs: {
      "نوع الطبعة": item.editionType,
      "جودة الورق": "ورق قطني أرشيفي 120gsm خالي من الأحماض",
      "التجليد": "جلد طبيعي فاخر مع ختم مذهب",
      "الشحن والتغليف": "صندوق حماية مقوى وشحن مباشر بالباب",
      "الضمان": "شهادة أصالة موثقة برقم تسلسلي",
    },
  }

  return (
    <div className="min-h-screen bg-[#10131c]">
      <ProductDetailView product={product} locale={validLocale} dict={dict} />
    </div>
  )
}
