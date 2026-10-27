import {adminFetch} from "../../../lib/admin-fetch"
import React, { useState, useEffect } from "react"
import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Text, Badge, Button } from "@medusajs/ui"
import { Sparkles, ThumbsUp, CheckCircle2, Star, Pin } from "lucide-react"
import { SubNav } from "../../../components/sub-nav"

const reviewTabs = [
  { label: "لوحة التحكم (Dashboard)", href: "/app/reviews" },
  { label: "طابور التدقيق (Moderation Queue)", href: "/app/reviews/moderation" },
  { label: "معرض التقييمات وشارات التوثيق (UGC)", href: "/app/reviews/social-proof", active: true },
]

const ReviewsSocialProofPage = () => {
  const [reviews, setReviews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await adminFetch("/admin/reviews")
      if (res.ok) {
        const json = await res.json()
        setReviews(json.reviews?.filter((r: any) => r.status === "approved") || [])
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto" dir="rtl">
      <SubNav
        parentTitle="تقييمات وآراء العملاء"
        currentTitle="معرض التقييمات الموثقة والإثبات الاجتماعي | UGC Social Proof"
        description="استعراض المراجعات المعتمدة وحالة توثيق الشراء."
        icon={Sparkles}
        tabs={reviewTabs}
        onRefresh={fetchData}
        isLoading={loading}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reviews.map((rev) => (
          <Container key={rev.id} className="p-5 space-y-3 border border-ui-border-base rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-amber-500 font-bold text-sm">
                {"★".repeat(rev.rating)}
                <span className="text-xs text-ui-fg-subtle mr-1">({rev.rating}.0)</span>
              </div>
              <Badge color="green" className="text-[10px]">
                <CheckCircle2 className="w-3 h-3 ml-1" /> {rev.verified_purchase?"مشتري موثق":"مراجعة منشورة"}
              </Badge>
            </div>
            <div>
              <div className="font-bold text-sm text-ui-fg-base">{rev.title}</div>
              <p className="text-xs text-ui-fg-subtle mt-1 leading-relaxed line-clamp-3">{rev.comment}</p>
            </div>
            <div className="pt-3 border-t border-ui-border-base flex items-center justify-between text-xs">
              <span className="font-semibold text-ui-fg-base">{rev.customer_name}</span>
              <span className="text-ui-fg-subtle flex items-center gap-1">
                <ThumbsUp className="w-3 h-3 text-blue-600" /> {rev.helpful_votes} مفيد
              </span>
            </div>
          </Container>
        ))}
      </div>
    </div>
  )
}

export const config = defineRouteConfig({
  label: "UGC Social Proof",
})

export default ReviewsSocialProofPage
