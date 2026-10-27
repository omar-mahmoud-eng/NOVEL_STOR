"use client"

import React from "react"
import Link from "@/components/common/realm-link"
import Image from "@/components/ui/media-image"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { useCart } from "@/context/cart-context"
import { formatMedusaCurrency as formatCurrency } from "@/lib/utils"
import {
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Sparkles,
  Truck,
  BookOpen,
} from "lucide-react"

export function CartSheet({
  locale,
  dict,
}: {
  locale: "ar" | "en"
  dict: any
}) {
  const { cart, isOpen, setIsOpen, updateQuantity, removeItem, isLoading, error } = useCart()

  const isRtl = locale === "ar"
  const items = cart?.items || []
  const subtotal = cart?.subtotal || 0
  const taxTotal = cart?.tax_total ?? 0
  const total = cart?.total ?? 0
  const currency = cart?.currency_code || "SAR"


  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent
        side={isRtl ? "left" : "right"}
        className="flex flex-col w-full sm:max-w-lg p-0 bg-background border-border/80 shadow-2xl"
      >
        {error && <p role="alert" className="p-4 text-destructive">{error}</p>}
        {/* Header */}
        <SheetHeader className="p-6 border-b border-border/70 flex flex-row items-center justify-between bg-card/60 backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <SheetTitle className="text-base sm:text-lg font-black text-foreground">
                {dict.cart.title}
              </SheetTitle>
              <span className="text-[11px] text-muted-foreground">
                {items.length} {locale === "ar" ? "رواية وإصدار" : "items in cart"}
              </span>
            </div>
          </div>

          <span className="stitch-gold-gradient text-white text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-xs">
            Google Stitch
          </span>
        </SheetHeader>

        <p className="px-6 py-4 border-b text-sm">{locale==="ar"?"الشحن والضريبة حسب خيارات الطلب. الدفع مؤجل في هذه المرحلة.":"Shipping and tax depend on the order options. Payments are currently deferred."}</p>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4 py-16">
              <div className="w-20 h-20 rounded-3xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
                <BookOpen className="w-10 h-10" />
              </div>
              <div className="space-y-1.5">
                <h3 className="font-black text-lg text-foreground">{dict.cart.empty_title}</h3>
                <p className="text-xs text-muted-foreground max-w-xs leading-relaxed">
                  {dict.cart.empty_description}
                </p>
              </div>
              <Button
                onClick={() => setIsOpen(false)}
                className="stitch-gold-gradient text-white border-0 rounded-2xl h-11 px-6 font-bold shadow-md mt-2"
              >
                {dict.cart.start_shopping}
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-border/70">
              {items.map((item) => (
                <div key={item.id} className="py-4 flex gap-4 first:pt-0 last:pb-0">
                  {/* Thumbnail with 3D spine depth */}
                  <div className="stitch-book-3d relative w-20 h-24 rounded-xl overflow-hidden bg-muted/40 border border-border/80 shrink-0 shadow-sm">
                    {item.thumbnail ? (
                      <Image
                        src={item.thumbnail}
                        alt={item.title}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-amber-500/40">
                        <BookOpen className="w-6 h-6" />
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="font-extrabold text-sm text-foreground line-clamp-1">
                          {item.title}
                        </h4>
                        <button
                          onClick={() => removeItem(item.id).catch(() => {})}
                          className="text-muted-foreground hover:text-destructive transition-colors p-1"
                          title={dict.cart.remove}
                          disabled={isLoading}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      {item.variant?.title && (
                        <p className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold mt-0.5">
                          {item.variant.title}
                        </p>
                      )}
                    </div>

                    <div className="flex justify-between items-center mt-3">
                      {/* Quantity Controller */}
                      <div className="flex items-center border border-border/80 rounded-xl bg-muted/30">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1).catch(() => {})}
                          disabled={isLoading || item.quantity <= 1}
                          className="p-1.5 hover:bg-muted transition-colors disabled:opacity-40 rounded-s-xl"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 text-xs font-mono font-bold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1).catch(() => {})}
                          disabled={isLoading}
                          className="p-1.5 hover:bg-muted transition-colors disabled:opacity-40 rounded-e-xl"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Authoritative Subtotal */}
                      <span className="font-black text-sm text-foreground">
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
          <div className="p-6 border-t border-border/80 bg-card/70 backdrop-blur-md space-y-4">
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-muted-foreground">
                <span>{dict.cart.subtotal}</span>
                <span className="font-mono">{formatCurrency(subtotal, currency, locale)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground text-xs">
                <span>{dict.cart.tax_vat}</span>
                <span className="font-mono">{formatCurrency(taxTotal, currency, locale)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground text-xs">
                <span>{dict.cart.estimated_shipping}</span>
                <span className="text-emerald-600 font-bold">
                  {cart?.shipping_methods?.length ? formatCurrency(cart.shipping_total || 0, currency, locale) : locale === "ar" ? "يُحدد عند تجهيز الطلب" : "Calculated with order options"}
                </span>
              </div>
              <div className="flex justify-between font-black text-base pt-3 border-t border-border/70 text-foreground">
                <span>{dict.cart.total}</span>
                <span className="text-lg text-amber-600 dark:text-amber-400 font-mono">
                  {formatCurrency(total, currency, locale)}
                </span>
              </div>
            </div>

            <Button
              asChild
              className="stitch-gold-gradient text-white border-0 w-full text-base h-12 rounded-2xl gap-2 font-bold shadow-lg"
              onClick={() => setIsOpen(false)}
            >
              <Link href={`/${locale}/checkout`}>
                <span>{dict.cart.proceed_to_checkout}</span>
                {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </Link>
            </Button>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
              <span>دفع مشفر 256-bit • تدقيق فوري للمخزون والأسعار</span>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
