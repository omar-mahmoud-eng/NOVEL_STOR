import React from "react"
import { notFound } from "next/navigation"
import { getDictionary, isValidLocale, defaultLocale, Locale, locales } from "@/lib/i18n"
import { ProductDetailView } from "@/components/products/product-detail-view"

const catalogDetails: Record<string, any> = {
  "pro-wireless-headphones-anc": {
    id: "prod_01HQWXYZ1",
    title: "سماعات الرأس اللاسلكية الاحترافية ANC Pro Max",
    handle: "pro-wireless-headphones-anc",
    description:
      "سماعات رأس لاسلكية متطورة توفر عزلاً نشطاً للضوضاء (ANC) فائق الدقة، مع صوت مكاني غامر 360 درجة، وبطارية تدوم حتى 40 ساعة متواصلة مع دعم الشحن السريع عبر منفذ USB-C.",
    price: 89900,
    currencyCode: "SAR",
    thumbnail: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&q=85",
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&q=85",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=1200&q=85",
    ],
    inStock: true,
    sku: "ANC-PRO-MAX-01",
    variants: [
      { id: "variant_headphones_01", title: "أسود فلكي / Space Black", inStock: true },
      { id: "variant_headphones_02", title: "فضي تيتانيوم / Silver", inStock: true },
    ],
    specs: {
      "تقنية الاتصال": "Bluetooth 5.3 + Ultra Low Latency",
      "عمر البطارية": "40 ساعة مع تشغيل خاصية العزل",
      "منفذ الشحن": "USB-C Fast Charging",
      "الوزن": "245 جرام",
      "الضمان": "سنتان لدى الوكيل المعتمد",
    },
  },
  "ultra-smartwatch-titanium": {
    id: "prod_01HQWXYZ2",
    title: "الساعة الذكية المتطورة Ultra Titanium Edition",
    handle: "ultra-smartwatch-titanium",
    description:
      "ساعة ذكية رائدة مصنوعة من التيتانيوم المخصص لصناعات الفضاء، مع شاشة Retina OLED ساطعة، تتبع دقيق للمؤشرات الحيوية ونظام GPS مزدوج التردد.",
    price: 145000,
    currencyCode: "SAR",
    thumbnail: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&q=85",
    images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&q=85"],
    inStock: true,
    sku: "WATCH-ULTRA-TI",
    variants: [
      { id: "variant_smartwatch_01", title: "حزام برتقالي رياضي / 49mm", inStock: true },
      { id: "variant_smartwatch_02", title: "حزام أسود بحري / 49mm", inStock: true },
    ],
    specs: {
      "مادة الهيكل": "تيتانيوم فائق الصلابة Grade 5",
      "مقاومة الماء": "حتى عمق 100 متر (EN13319)",
      "مستشعرات الصحة": "تخطيط القلب ECG، قياس الأكسجين، وحرارة الجسم",
      "الشاشة": "Always-On Retina 3000 nits",
    },
  },
}

export function generateStaticParams() {
  const handles = Object.keys(catalogDetails)
  const params: { locale: string; handle: string }[] = []
  for (const locale of locales) {
    for (const handle of handles) {
      params.push({ locale, handle })
    }
  }
  return params
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ locale: string; handle: string }>
}) {
  const { locale, handle } = await params
  const validLocale = isValidLocale(locale) ? (locale as Locale) : defaultLocale
  const dict = getDictionary(validLocale)

  const product = catalogDetails[handle] || {
    id: `prod_${handle}`,
    title: handle.replace(/-/g, " ").toUpperCase(),
    handle,
    description:
      "منتج أصلي عالي الجودة متوفر لدى المتجر المعتمد، خاضع لاختبارات الجودة ومحمي بسياسة الإرجاع وضمان الوكيل.",
    price: 49900,
    currencyCode: "SAR",
    thumbnail: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&q=85",
    images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&q=85"],
    inStock: true,
    sku: `SKU-${handle.slice(0, 6).toUpperCase()}`,
    variants: [{ id: `var_${handle}`, title: "Standard Edition", inStock: true }],
    specs: {
      "الضمان": "سنتان ضمان الوكيل",
      "بلد المنشأ": "معتمد دولياً",
    },
  }

  return <ProductDetailView product={product} locale={validLocale} dict={dict} />
}
