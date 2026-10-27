"use client"

import React, { useState, useEffect } from "react"
import {variantAvailable,preferredVariant} from "@/lib/product-availability"
import { medusaClient } from "@/lib/medusa-client"
import Image from "@/components/ui/media-image"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useCart } from "@/context/cart-context"
import { formatCurrency } from "@/lib/utils"
import {
  ShoppingBag,
  Check,
  ShieldCheck,
  Truck,
  RotateCcw,
  Zap,
  Plus,
  Minus,
  Loader2,
  Lock,
} from "lucide-react"

export type ProductDetailViewProps = {
  product: {
    id: string
    title: string
    handle: string
    description: string
    price: number
    currencyCode?: string
    thumbnail: string
    images: string[]
    inStock: boolean
    sku: string
    variants: Array<{ id: string; title: string; inStock: boolean; price?: number }>
    specs: Record<string, string>
  }
  locale: "ar" | "en"
  dict: any
}

export function ProductDetailView({
  product: editorialProduct,
  locale,
  dict,
}: ProductDetailViewProps) {
  const [product, setProduct] = useState(editorialProduct)
  const [available, setAvailable] = useState(false)
  const [purchaseError, setPurchaseError] = useState("")
  const router = useRouter()
  const { addItem, isLoading: cartLoading } = useCart()

  const [selectedImage, setSelectedImage] = useState(product.thumbnail || product.images[0])
  const [selectedVariantId, setSelectedVariantId] = useState(product.variants[0]?.id || "")
  useEffect(() => {
    let cancelled = false
    setAvailable(false)
    setProduct(editorialProduct);setSelectedImage(editorialProduct.thumbnail||editorialProduct.images[0]||"");setPurchaseError("")
    medusaClient.getPricedProduct(editorialProduct.handle).then((resolved) => {
      if (cancelled) return
      if (!resolved?.variants?.length) throw new Error("Product unavailable")
      const variants = resolved.variants.filter((variant: any) => Number.isFinite(variant.calculated_price?.calculated_amount))
      if (!variants.length) throw new Error("Pricing unavailable")
      const selected=preferredVariant(variants)
      if(!selected)throw new Error("Pricing unavailable")
      setProduct({ ...editorialProduct, inStock:variants.some(variantAvailable), price: selected.calculated_price.calculated_amount * 100, variants: variants.map((variant: any) => ({ id: variant.id, title: variant.title, inStock: variantAvailable(variant), price: variant.calculated_price.calculated_amount * 100 })) })
      setSelectedVariantId(selected.id)
      setAvailable(true)
    }).catch(() => { if (!cancelled) setPurchaseError(locale === "ar" ? "هذا الإصدار غير متاح للشراء حاليًا." : "This edition is unavailable for purchase.") })
    return () => { cancelled = true }
  }, [editorialProduct, locale])
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)
  const [justAdded, setJustAdded] = useState(false)

  const isRtl = locale === "ar"
  const selectedVariant=product.variants.find(variant=>variant.id===selectedVariantId)
  const canBuy=available&&selectedVariant?.inStock===true

  const handleAddToCart = async () => {
    if (!selectedVariantId || !canBuy) return
    setIsAdding(true)
    try {
      await addItem(selectedVariantId, quantity)
      setJustAdded(true)
      setTimeout(() => setJustAdded(false), 2000)
    } catch (err) {
      setPurchaseError((err as any).message || "Unable to add to cart")
      console.error(err)
    } finally {
      setIsAdding(false)
    }
  }

  const handleBuyNow = async () => {
    if (!selectedVariantId || !canBuy) return
    setIsAdding(true)
    try {
      await addItem(selectedVariantId, quantity)
      router.push(`/${locale}/checkout`)
    } catch (err) {
      setPurchaseError((err as any).message || "Unable to add to cart")
      console.error(err)
      setIsAdding(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      {purchaseError && <p role="alert" className="mb-4 text-destructive">{purchaseError}</p>}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left Column: Image Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square w-full rounded-3xl overflow-hidden bg-muted border border-border shadow-xs">
            {selectedImage ? (
              <Image
                unoptimized={/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?\//.test(selectedImage)}
                src={selectedImage}
                alt={product.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground font-bold">
                {locale==="ar"?"لا توجد صورة للمنتج":"No product image"}
              </div>
            )}
            <div className="absolute top-4 start-4">
              {product.inStock ? (
                <Badge variant="success" className="text-xs px-3 py-1 shadow-xs">
                  {dict.product.in_stock}
                </Badge>
              ) : (
                <Badge variant="destructive" className="text-xs px-3 py-1 shadow-xs">
                  {dict.product.out_of_stock}
                </Badge>
              )}
            </div>
          </div>

          {/* Image Thumbnails Carousel */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`relative w-20 h-20 rounded-xl overflow-hidden bg-muted border-2 transition-all shrink-0 ${
                    selectedImage === img
                      ? "border-primary ring-2 ring-primary/20"
                      : "border-border hover:border-muted-foreground/50"
                  }`}
                >
                  <Image unoptimized={/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?\//.test(img)} src={img} alt="" fill className="object-cover" sizes="80px" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Information, Variants & Add to Cart */}
        <div className="flex flex-col space-y-6">
          <div>
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {dict.product.sku}: {product.sku}
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground mt-2 leading-tight">
              {product.title}
            </h1>
          </div>

          {/* Pricing Section */}
          <div className="p-4 rounded-2xl bg-muted/40 border border-border flex items-baseline justify-between">
            <div>
              <div className="text-3xl font-black text-foreground">
                {available?formatCurrency(product.price, product.currencyCode || "SAR", locale):isRtl?"التحقق من السعر…":"Checking price…"}
              </div>
              <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>{available?dict.product.price_verified:isRtl?"السعر من المتجر":"Store pricing"}</span>
              </div>
            </div>
            <div className="text-xs font-semibold text-emerald-600 bg-emerald-500/10 px-2.5 py-1 rounded-full">
              {locale === "ar" ? "خيارات التوصيل عند تجهيز الطلب" : "Delivery options at checkout"}
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground leading-relaxed">
            {product.description}
          </p>

          {/* Variant Selector */}
          {product.variants.length > 0 && (
            <div className="space-y-3">
              <label className="text-sm font-semibold text-foreground">
                {dict.product.variant}:
              </label>
              <div className="flex flex-wrap gap-2.5">
                {product.variants.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => { setSelectedVariantId(v.id); if (v.price !== undefined) setProduct((current) => ({ ...current, price: v.price! })) }}
                    className={`px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                      selectedVariantId === v.id
                        ? "border-primary bg-primary text-primary-foreground shadow-xs"
                        : "border-border bg-background hover:bg-muted text-foreground"
                    }`}
                  >
                    {v.title}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Selector & CTAs */}
          <div className="pt-2 space-y-4">
            <div className="flex items-center gap-4">
              <span className="text-sm font-semibold text-foreground">{dict.product.quantity}:</span>
              <div className="flex items-center border border-border rounded-xl bg-background">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1 || isAdding}
                  className="p-2.5 hover:bg-muted transition-colors disabled:opacity-40"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 text-sm font-bold">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  disabled={isAdding}
                  className="p-2.5 hover:bg-muted transition-colors disabled:opacity-40"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <Button
                variant={justAdded ? "secondary" : "default"}
                size="lg"
                onClick={handleAddToCart}
                disabled={!canBuy || isAdding || cartLoading}
                className="h-12 rounded-xl text-base font-semibold gap-2"
              >
                {isAdding ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>{dict.product.adding}</span>
                  </>
                ) : justAdded ? (
                  <>
                    <Check className="w-5 h-5 text-emerald-600" />
                    <span>{locale === "ar" ? "تمت الإضافة بنجاح!" : "Added to Cart!"}</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5" />
                    <span>{dict.product.add_to_cart}</span>
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                size="lg"
                onClick={handleBuyNow}
                disabled={!canBuy || isAdding || cartLoading}
                className="h-12 rounded-xl text-base font-semibold border-primary/30 hover:border-primary text-primary hover:bg-primary/5 gap-2"
              >
                <Zap className="w-4 h-4" />
                <span>{locale === "ar" ? "شراء فوري الآن" : "Buy It Now"}</span>
              </Button>
            </div>
          </div>

          {/* Trust Guarantees */}
          <div className="pt-6 border-t border-border grid grid-cols-2 gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-primary shrink-0" />
              <span>{locale === "ar" ? "خيارات التوصيل حسب العنوان" : "Delivery options depend on your address"}</span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-primary shrink-0" />
              <span>{locale === "ar" ? "تواصل مع الدعم لمراجعة الطلب" : "Contact support about your order"}</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{locale === "ar" ? "بيانات المنتج من المتجر" : "Product details from the store"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{locale === "ar" ? "دفع آمن ومشفر بالكامل" : "Encrypted SSL Payment"}</span>
            </div>
          </div>

          {/* Technical Specifications Section */}
          {product.specs && Object.keys(product.specs).length > 0 && (
            <div className="pt-6 border-t border-border space-y-3">
              <h3 className="font-bold text-base text-foreground">
                {dict.product.specifications}
              </h3>
              <div className="divide-y divide-border text-xs rounded-xl border border-border overflow-hidden">
                {Object.entries(product.specs).map(([key, val]) => (
                  <div key={key} className="flex justify-between py-2.5 px-4 bg-muted/20">
                    <span className="font-medium text-muted-foreground">{key}</span>
                    <span className="font-semibold text-foreground">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
