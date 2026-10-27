"use client"

import { useEffect, useState } from "react"
import Link from "@/components/common/realm-link"
import { useCustomerAuth } from "@/context/customer-auth-context"
import { useAudio } from "@/context/audio-context"
import { Button } from "@/components/ui/button"
import { BookOpen, Headphones, Loader2 } from "lucide-react"

type Media = { id: string; title: string; format: string; stream_endpoint: string; chapter_number: number }
type Library = { items: Media[]; vip_subscription: { active: boolean; remaining_credits?: number; expires_at?: string } }

export function CustomerLibraryView({ locale }: { locale: "ar" | "en" }) {
  const { customer, isLoading: authLoading } = useCustomerAuth()
  const { playTrack } = useAudio()
  const [library, setLibrary] = useState<Library | null>(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [opening, setOpening] = useState<string | null>(null)
  const ar = locale === "ar"
  useEffect(() => {
    if (!customer) { setLibrary(null); return }
    const controller = new AbortController()
    setLoading(true)
    setError("")
    fetch("/api/medusa/store/library", { cache: "no-store", signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error(ar ? "تعذر تحميل المكتبة. حاول مجددًا." : "Unable to load library. Please try again.")
        return response.json()
      })
      .then(setLibrary)
      .catch((err) => { if (err.name !== "AbortError") setError(err.message) })
      .finally(() => { if (!controller.signal.aborted) setLoading(false) })
    return () => controller.abort()
  }, [customer?.id, ar])

  async function openMedia(item: Media) {
    setOpening(item.id)
    setError("")
    try {
      const response = await fetch(`/api/medusa/store/library/stream/${encodeURIComponent(item.id)}`, { cache: "no-store" })
      const result = await response.json()
      if (!response.ok || !result.stream_payload?.stream_url) throw new Error(result.message || (ar ? "تعذر فتح المحتوى." : "Unable to open content."))
      const url = new URL(result.stream_payload.stream_url)
      if (!["http:", "https:"].includes(url.protocol)) throw new Error("Invalid media URL")
      if (item.format.startsWith("audio")) playTrack({ id: item.id, title: item.title, author: "StoryVerse", coverUrl: "", audioUrl: url.href })
      else window.location.assign(url.href)
    } catch (err: any) { setError(err.message) }
    finally { setOpening(null) }
  }

  return <main className="container mx-auto max-w-6xl px-4 py-12 space-y-6">
    <h1 className="text-3xl font-bold">{ar ? "مكتبتي الرقمية" : "My digital library"}</h1>
    {error && <p role="alert" className="text-destructive">{error}</p>}
    {authLoading || loading ? <Loader2 aria-label={ar ? "جارٍ التحميل" : "Loading"} className="animate-spin" /> : !customer ? <div className="space-y-4">
      <p>{ar ? "سجّل الدخول لعرض إصداراتك المرخصة." : "Sign in to view your licensed editions."}</p>
      <Button asChild><Link href={`/${locale}/account`}>{ar ? "تسجيل الدخول" : "Sign in"}</Link></Button>
    </div> : <>
      <p className="text-muted-foreground">{library?.vip_subscription?.active
        ? (ar ? `اشتراك نشط · ${library.vip_subscription.remaining_credits ?? 0} رصيد كتاب` : `Active subscription · ${library.vip_subscription.remaining_credits ?? 0} book credits`)
        : (ar ? "الإصدارات المرتبطة بمشترياتك المدفوعة." : "Editions from your paid purchases.")}</p>
      {!library?.items?.length && !error && <p>{ar ? "لا توجد إصدارات مرخصة في مكتبتك بعد." : "Your library has no licensed editions yet."}</p>}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{library?.items.map((item) => <article key={item.id} className="rounded-2xl border border-border p-5 space-y-4">
        {item.format.startsWith("audio") ? <Headphones /> : <BookOpen />}
        <h2 className="font-bold">{item.title}</h2><p className="text-sm text-muted-foreground">{item.format}</p>
        <Button onClick={() => openMedia(item)} disabled={opening !== null}>{opening === item.id ? <Loader2 className="animate-spin" /> : ar ? "فتح الإصدار" : "Open edition"}</Button>
      </article>)}</div>
    </>}
  </main>
}
