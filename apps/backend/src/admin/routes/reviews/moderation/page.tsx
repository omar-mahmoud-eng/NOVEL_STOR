import React, { useState, useEffect } from "react"
import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Text, Badge, Button, Table } from "@medusajs/ui"
import { Star, CheckCircle2, XCircle, ShieldCheck, Filter } from "lucide-react"
import { SubNav } from "../../../components/sub-nav"

const reviewTabs = [
  { label: "لوحة التحكم (Dashboard)", href: "/app/reviews" },
  { label: "طابور التدقيق (Moderation Queue)", href: "/app/reviews/moderation", active: true },
  { label: "معرض التقييمات وشارات التوثيق (UGC)", href: "/app/reviews/social-proof" },
]

const ReviewsModerationPage = () => {
  const [reviews, setReviews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState("pending")
  const [actionId, setActionId] = useState<string | null>(null)

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await fetch("/admin/reviews")
      if (res.ok) {
        const json = await res.json()
        setReviews(json.reviews || [])
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

  const handleUpdate = async (id: string, status: string) => {
    setActionId(id)
    try {
      const res = await fetch("/admin/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      })
      if (res.ok) {
        await fetchData()
      }
    } catch (err) {
      console.error(err)
    } finally {
      setActionId(null)
    }
  }

  const filtered = reviews.filter((r) => {
    if (statusFilter === "all") return true
    return r.status === statusFilter
  })

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto" dir="rtl">
      <SubNav
        parentTitle="تقييمات وآراء العملاء"
        currentTitle="طابور الإشراف والتدقيق الفوري | Moderation Queue"
        description="اعتماد التقييمات الحقيقية بنقرة واحدة ونشرها على صفحات الروايات، أو رفض المخالفات."
        icon={ShieldCheck}
        tabs={reviewTabs}
        onRefresh={fetchData}
        isLoading={loading}
      />

      <Container className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <Heading level="h2" className="text-base font-bold text-ui-fg-base">
            إدارة طابور المراجعة والاعتماد
          </Heading>
          <div className="flex gap-1 bg-ui-bg-subtle p-1 rounded-lg border border-ui-border-base text-xs">
            <button
              onClick={() => setStatusFilter("all")}
              className={`px-3 py-1 rounded font-medium ${statusFilter === "all" ? "bg-ui-bg-base font-bold shadow-sm" : "text-ui-fg-subtle"}`}
            >
              الكل ({reviews.length})
            </button>
            <button
              onClick={() => setStatusFilter("pending")}
              className={`px-3 py-1 rounded font-medium ${statusFilter === "pending" ? "bg-ui-bg-base text-yellow-700 font-bold shadow-sm" : "text-ui-fg-subtle"}`}
            >
              قيد التدقيق ({reviews.filter((r) => r.status === "pending").length})
            </button>
            <button
              onClick={() => setStatusFilter("approved")}
              className={`px-3 py-1 rounded font-medium ${statusFilter === "approved" ? "bg-ui-bg-base text-green-700 font-bold shadow-sm" : "text-ui-fg-subtle"}`}
            >
              المعتمدة ({reviews.filter((r) => r.status === "approved").length})
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>الرواية / المنتج</Table.HeaderCell>
                <Table.HeaderCell>القارئ</Table.HeaderCell>
                <Table.HeaderCell>التقييم</Table.HeaderCell>
                <Table.HeaderCell>العنوان والتعليق</Table.HeaderCell>
                <Table.HeaderCell>الحالة</Table.HeaderCell>
                <Table.HeaderCell>إجراءات الإشراف</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {filtered.map((rev) => (
                <Table.Row key={rev.id}>
                  <Table.Cell>
                    <div className="font-semibold text-sm text-ui-fg-base">{rev.product_title}</div>
                  </Table.Cell>
                  <Table.Cell>
                    <div className="text-sm font-medium text-ui-fg-base">{rev.customer_name}</div>
                    {rev.verified_purchase && (
                      <span className="text-[11px] text-green-700 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> مشتري موثق
                      </span>
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    <span className="font-bold text-amber-500">★ {rev.rating}.0</span>
                  </Table.Cell>
                  <Table.Cell className="max-w-md">
                    <div className="font-bold text-xs text-ui-fg-base">{rev.title}</div>
                    <div className="text-xs text-ui-fg-subtle line-clamp-2 mt-0.5">{rev.comment}</div>
                  </Table.Cell>
                  <Table.Cell>
                    <Badge color={rev.status === "approved" ? "green" : rev.status === "rejected" ? "red" : "orange"}>
                      {rev.status === "approved" ? "معتمد ومنشور" : rev.status === "rejected" ? "مرفوض" : "قيد التدقيق"}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex items-center gap-2">
                      {rev.status !== "approved" && (
                        <Button
                          size="small"
                          variant="secondary"
                          className="bg-green-50 text-green-700 border-green-200"
                          disabled={actionId === rev.id}
                          onClick={() => handleUpdate(rev.id, "approved")}
                        >
                          اعتماد
                        </Button>
                      )}
                      {rev.status !== "rejected" && (
                        <Button
                          size="small"
                          variant="secondary"
                          className="bg-red-50 text-red-700 border-red-200"
                          disabled={actionId === rev.id}
                          onClick={() => handleUpdate(rev.id, "rejected")}
                        >
                          رفض
                        </Button>
                      )}
                    </div>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      </Container>
    </div>
  )
}

export const config = defineRouteConfig({
  label: "Moderation Queue",
})

export default ReviewsModerationPage
