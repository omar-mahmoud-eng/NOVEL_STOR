import React from "react"
import Link from "next/link"
import { ShieldCheck, Truck, RotateCcw, Headphones, Lock } from "lucide-react"

export function Footer({
  locale,
  dict,
}: {
  locale: "ar" | "en"
  dict: any
}) {
  return (
    <footer className="border-t border-border bg-muted/30 mt-auto">
      {/* Trust Badges Bar */}
      <div className="border-b border-border bg-background/50">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-start">
            <div className="flex flex-col md:flex-row items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-sm">
                  {locale === "ar" ? "شحن خليجي سريع" : "Express Regional Delivery"}
                </h4>
                <p className="text-xs text-muted-foreground">
                  {locale === "ar" ? "توصيل خلال 24-48 ساعة" : "24-48 hours to your door"}
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-sm">
                  {locale === "ar" ? "منتجات أصلية 100%" : "100% Authentic Products"}
                </h4>
                <p className="text-xs text-muted-foreground">
                  {locale === "ar" ? "ضمان رسمي معتمد" : "Official brand warranty"}
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-sm">
                  {locale === "ar" ? "إرجاع سهل ومجاني" : "Hassle-Free Returns"}
                </h4>
                <p className="text-xs text-muted-foreground">
                  {locale === "ar" ? "خلال 14 يوماً من الاستلام" : "Within 14 calendar days"}
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Headphones className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-sm">
                  {locale === "ar" ? "دعم عملاء 24/7" : "24/7 Dedicated Support"}
                </h4>
                <p className="text-xs text-muted-foreground">
                  {locale === "ar" ? "خدمة فورية بالعربية والإنجليزية" : "Instant Arabic & English care"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2 font-bold text-lg">
              <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-black">
                M
              </div>
              <span>{dict.common.store_name}</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {dict.common.tagline}
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-600 font-medium pt-2">
              <Lock className="w-3.5 h-3.5" />
              <span>{locale === "ar" ? "منصة محمية ومشفرة بالكامل" : "Fully Hardened Zero-Trust Platform"}</span>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-3">{dict.nav.categories}</h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <Link href={`/${locale}/products`} className="hover:text-primary transition-colors">
                  {locale === "ar" ? "الإلكترونيات الذكية" : "Smart Electronics"}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/products`} className="hover:text-primary transition-colors">
                  {locale === "ar" ? "أجهزة المنزل المبتكرة" : "Smart Home Living"}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/products`} className="hover:text-primary transition-colors">
                  {locale === "ar" ? "الملحقات والإكسسوارات" : "Accessories & Audio"}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-3">
              {locale === "ar" ? "خدمة العملاء" : "Customer Care"}
            </h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <Link href={`/${locale}/account`} className="hover:text-primary transition-colors">
                  {dict.account.orders}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/products`} className="hover:text-primary transition-colors">
                  {locale === "ar" ? "سياسة الشحن والتوصيل" : "Shipping & Delivery Policy"}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/products`} className="hover:text-primary transition-colors">
                  {locale === "ar" ? "سياسة الإرجاع والاستبدال" : "Returns & Exchanges"}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-3">
              {locale === "ar" ? "طرق الدفع المعتمدة" : "Accepted Payment Methods"}
            </h4>
            <p className="text-xs text-muted-foreground mb-3">
              {locale === "ar"
                ? "دفع آمن معتمد بالريال السعودي والدولار وبطاقات مدى المحلية."
                : "Secure local Mada cards, Apple Pay, Visa, and Mastercard in SAR, AED, USD."}
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="text-[11px] font-bold px-2.5 py-1 bg-background rounded border border-border shadow-2xs">
                Mada مدى
              </span>
              <span className="text-[11px] font-bold px-2.5 py-1 bg-background rounded border border-border shadow-2xs">
                Apple Pay
              </span>
              <span className="text-[11px] font-bold px-2.5 py-1 bg-background rounded border border-border shadow-2xs">
                Visa
              </span>
              <span className="text-[11px] font-bold px-2.5 py-1 bg-background rounded border border-border shadow-2xs">
                Mastercard
              </span>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-border mt-10 pt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} {dict.common.store_name}. All Rights Reserved.
        </div>
      </div>
    </footer>
  )
}
