"use client"

import React from "react"
import Link from "next/link"
import Image from "next/image"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { useCart } from "@/context/cart-context"
import { formatCurrency } from "@/lib/utils"
import { ShoppingBag, Plus, Minus, Trash2, ArrowRight, ArrowLeft, ShieldCheck } from "lucide-react"

export function CartSheet({
  locale,
  dict,
}: {
  locale: "ar" | "en"
  dict: any
}) {
  const { cart, isOpen, setIsOpen, updateQuantity, removeItem, isLoading } = useCart()

  const isRtl = locale === "ar"
  const items = cart?.items || []
  const subtotal = cart?.subtotal || 0
  const taxTotal = cart?.tax_total || Math.round(subtotal * 0.15)
  const total = cart?.total || subtotal + taxTotal
  const currency = cart?.currency_code || "SAR"

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent
        side={isRtl ? "left" : "right"}
        className="flex flex-col w-full sm:max-w-lg p-0 bg-background border-border"
      >
        {/* Header */}
        <SheetHeader className="p-6 border-b border-border flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-primary" />
            <SheetTitle className="text-lg font-bold">{dict.cart.title}</SheetTitle>
            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-semibold">
              {items.length}
            </span>
          </div>
        </SheetHeader>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4 py-12">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold text-base">{dict.cart.empty_title}</h3>
                <p className="text-xs text-muted-foreground max-w-xs">{dict.cart.empty_description}</p>
              </div>
              <Button onClick={() => setIsOpen(false)} className="mt-4">
                {dict.cart.start_shopping}
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {items.map((item) => (
                <div key={item.id} className="py-4 flex gap-4 first:pt-0 last:pb-0">
                  {/* Thumbnail */}
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-muted border border-border shrink-0">
                    {item.thumbnail ? (
                      <Image
                        src={item.thumbnail}
                        alt={item.title}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        <ShoppingBag className="w-6 h-6 opacity-40" />
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="font-medium text-sm line-clamp-1">{item.title}</h4>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-muted-foreground hover:text-destructive transition-colors p-1"
                          title={dict.cart.remove}
                          disabled={isLoading}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      {item.variant?.title && (
                        <p className="text-xs text-muted-foreground mt-0.5">{item.variant.title}</p>
                      )}
                    </div>

                    <div className="flex justify-between items-center mt-2">
                      {/* Quantity Controller */}
                      <div className="flex items-center border border-border rounded-md">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={isLoading || item.quantity <= 1}
                          className="p-1 hover:bg-muted transition-colors disabled:opacity-40"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 text-xs font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={isLoading}
                          className="p-1 hover:bg-muted transition-colors disabled:opacity-40"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Authoritative Subtotal */}
                      <span className="font-semibold text-sm">
                        {formatCurrency(item.unit_price * item.quantity, currency, locale)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Summary (if items exist) */}
        {items.length > 0 && (
          <div className="p-6 border-t border-border bg-muted/30 space-y-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>{dict.cart.subtotal}</span>
                <span>{formatCurrency(subtotal, currency, locale)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground text-xs">
                <span>{dict.cart.tax_vat}</span>
                <span>{formatCurrency(taxTotal, currency, locale)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground text-xs">
                <span>{dict.cart.estimated_shipping}</span>
                <span className="text-emerald-600 font-medium">{dict.cart.free_shipping}</span>
              </div>
              <div className="flex justify-between font-bold text-base pt-2 border-t border-border text-foreground">
                <span>{dict.cart.total}</span>
                <span>{formatCurrency(total, currency, locale)}</span>
              </div>
            </div>

            <Button asChild className="w-full text-base h-12 gap-2" onClick={() => setIsOpen(false)}>
              <Link href={`/${locale}/checkout`}>
                <span>{dict.cart.proceed_to_checkout}</span>
                {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </Link>
            </Button>

            <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>{dict.cart.security_guarantee}</span>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
