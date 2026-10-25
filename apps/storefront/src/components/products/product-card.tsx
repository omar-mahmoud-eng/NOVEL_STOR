"use client"

import React, { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useCart } from "@/context/cart-context"
import { formatCurrency } from "@/lib/utils"
import { ShoppingBag, Check, Loader2 } from "lucide-react"

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
    <div className="group relative flex flex-col rounded-2xl border border-border bg-card overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300">
      {/* Thumbnail & Badges */}
      <Link href={`/${locale}/products/${handle}`} className="relative aspect-square w-full overflow-hidden bg-muted">
        {thumbnail ? (
          <Image
            src={thumbnail}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground/40 font-bold text-3xl">
            MEDUSA
          </div>
        )}

        {/* Stock Status Badge */}
        <div className="absolute top-3 start-3">
          {inStock ? (
            <Badge variant="success" className="text-[11px] shadow-xs">
              {dict.product.in_stock}
            </Badge>
          ) : (
            <Badge variant="destructive" className="text-[11px] shadow-xs">
              {dict.product.out_of_stock}
            </Badge>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        <Link href={`/${locale}/products/${handle}`}>
          <h3 className="font-semibold text-base text-foreground group-hover:text-primary transition-colors line-clamp-2">
            {title}
          </h3>
        </Link>

        {/* Price & Taxes */}
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-lg font-bold text-foreground">
            {formatCurrency(price, currencyCode, locale)}
          </span>
          <span className="text-[11px] text-muted-foreground">
            {locale === "ar" ? "شامل الضريبة" : "Incl. VAT"}
          </span>
        </div>

        {/* Quick Add Button */}
        <div className="mt-4 pt-3 border-t border-border flex items-center justify-between gap-2">
          <Button
            variant={justAdded ? "secondary" : "default"}
            size="sm"
            onClick={handleQuickAdd}
            disabled={!inStock || isAdding}
            className="w-full gap-2 rounded-xl h-10 font-medium"
          >
            {isAdding ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{dict.product.adding}</span>
              </>
            ) : justAdded ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span>{locale === "ar" ? "تمت الإضافة!" : "Added!"}</span>
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
