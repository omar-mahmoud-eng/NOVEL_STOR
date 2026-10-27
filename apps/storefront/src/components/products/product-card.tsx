"use client"

import React, { useState } from "react"
import Link from "@/components/common/realm-link"
import Image from "@/components/ui/media-image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useCart } from "@/context/cart-context"
import { formatCurrency } from "@/lib/utils"
import { ShoppingBag, Check, Loader2, Star, BookOpen, Sparkles } from "lucide-react"

export type ProductCardProps = {
  id: string
  title: string
  handle: string
  thumbnail?: string
  price: number
  currencyCode?: string
  inStock?: boolean
  defaultVariantId: string
  locale: "ar" | "en"
  dict: any
}

export function ProductCard({
  title,
  handle,
  thumbnail,
  price,
  currencyCode = "SAR",
  inStock = true,
  defaultVariantId,
  locale,
  dict,
}: ProductCardProps) {
  const { addItem } = useCart()
  const [isAdding, setIsAdding] = useState(false)
  const [justAdded, setJustAdded] = useState(false)

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!defaultVariantId || !inStock) return

    setIsAdding(true)
    try {
      await addItem(defaultVariantId, 1)
      setJustAdded(true)
      setTimeout(() => setJustAdded(false), 1500)
    } catch (error) {
      console.error("Error adding product:", error)
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <div className="stitch-card group relative flex flex-col rounded-3xl border border-border/80 bg-card overflow-hidden shadow-xs hover:shadow-2xl transition-all duration-300">
      {/* Thumbnail & Badges Container */}
      <Link
        href={`/${locale}/products/${handle}`}
        className="relative aspect-square w-full overflow-hidden bg-muted/40 p-4 flex items-center justify-center"
      >
        {/* Ambient Warm Glow behind the product */}
        <div className="absolute inset-0 bg-radial from-amber-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {thumbnail ? (
          <div className="stitch-book-3d relative w-4/5 h-4/5 rounded-xl overflow-hidden shadow-md group-hover:scale-105 transition-transform duration-500">
            <Image
              src={thumbnail}
              alt={title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
            />
          </div>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground/40 font-bold">
            <BookOpen className="w-12 h-12 mb-2 text-amber-500/40" />
            <span className="text-xs font-mono tracking-wider">SOVEREIGN</span>
          </div>
        )}

        {/* Stock Status Badge */}
        <div className="absolute top-3 start-3 z-10">
          {inStock ? (
            <Badge variant="success" className="text-[10px] font-bold px-2 py-0.5 shadow-xs backdrop-blur-sm">
              {dict.product.in_stock}
            </Badge>
          ) : (
            <Badge variant="destructive" className="text-[10px] font-bold px-2 py-0.5 shadow-xs">
              {dict.product.out_of_stock}
            </Badge>
          )}
        </div>

        {/* Rating Pill */}
        <div className="absolute top-3 end-3 z-10 flex items-center gap-1 px-2 py-0.5 rounded-full bg-background/90 backdrop-blur-md border border-border/80 text-[10px] font-bold text-foreground shadow-xs">
          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
          <span>4.9</span>
        </div>
      </Link>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        <Link href={`/${locale}/products/${handle}`}>
          <h3 className="font-extrabold text-base text-foreground group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors line-clamp-2 leading-snug">
            {title}
          </h3>
        </Link>

        {/* Price & Taxes */}
        <div className="mt-3 flex items-baseline justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-black text-foreground">
              {formatCurrency(price, currencyCode, locale)}
            </span>
            <span className="text-[10px] text-muted-foreground">
              {locale === "ar" ? "شامل الضريبة" : "Incl. VAT"}
            </span>
          </div>

          <span className="text-[10px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md">
            {locale === "ar" ? "أصلي معتمد" : "Authentic"}
          </span>
        </div>

        {/* Quick Add Button */}
        <div className="mt-4 pt-3 border-t border-border/70 flex items-center justify-between gap-2">
          <Button
            variant={justAdded ? "secondary" : "default"}
            size="sm"
            onClick={handleQuickAdd}
            disabled={!inStock || isAdding}
            className={`w-full gap-2 rounded-xl h-10 font-bold transition-all ${
              justAdded
                ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/30"
                : "stitch-gold-gradient text-white border-0 shadow-md"
            }`}
          >
            {isAdding ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{dict.product.adding}</span>
              </>
            ) : justAdded ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span>{locale === "ar" ? "تمت الإضافة للسلة!" : "Added!"}</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span>{dict.product.add_to_cart}</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
