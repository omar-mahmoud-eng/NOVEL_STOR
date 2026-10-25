import React, { useState, useEffect } from "react"
import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Text, Badge, Button, Table, Input } from "@medusajs/ui"
import {
  BookOpen,
  FileText,
  Eye,
  Globe,
  PlusCircle,
  RefreshCw,
  CheckCircle,
  Search,
  Sparkles,
  ExternalLink,
} from "lucide-react"
import { SubNav } from "../../components/sub-nav"

const cmsTabs = [
  { label: "لوحة التحكم (Dashboard)", href: "/app/cms", active: true },
  { label: "استوديو المقالات وSEO (Composer & Articles)", href: "/app/cms/composer" },
  { label: "تصنيفات المدونة (Categories)", href: "/app/cms/categories" },
]

const CmsPage = () => {
  const [articles, setArticles] = useState<any[]>([])
  const [summary, setSummary] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // Article Composer State
  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")
  const [category, setCategory] = useState("دراسات أدبية ونقد")
  const [authorName, setAuthorName] = useState("هيئة التحرير")
  const [coverImage, setCoverImage] = useState("https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=1200&q=80")
  const [excerpt, setExcerpt] = useState("")
  const [metaTitle, setMetaTitle] = useState("")
  const [metaDescription, setMetaDescription] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [feedbackMsg, setFeedbackMsg] = useState("")

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await fetch("/admin/cms")
      if (res.ok) {
        const data = await res.json()
        setArticles(data.articles || [])
        setSummary(data.summary || null)
      }
    } catch (err) {
      console.error("Error fetching CMS data:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // Auto-generate slug and meta title from title
  const handleTitleChange = (val: string) => {
    setTitle(val)
    if (!slug) {
      const generatedSlug = val
        .trim()
        .toLowerCase()
        .replace(/[\s\W-]+/g, "-")
        .replace(/^-+|-+$/g, "")
      setSlug(generatedSlug || "novel-article")
    }
    if (!metaTitle) {
      setMetaTitle(`${val} | مدونة الروايات`)
    }
  }

  const handleCreateArticle = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !slug) return
    setIsSubmitting(true)
    try {
      const res = await fetch("/admin/cms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          slug,
          excerpt,
          content: excerpt,
          author_name: authorName,
          category,
          cover_image: coverImage,
          meta_title: metaTitle || title,
          meta_description: metaDescription || excerpt,
        }),
      })
      if (res.ok) {
        setFeedbackMsg("تم نشر المقال الجديد بنجاح في الواجهة والمدونة!")
        setTimeout(() => setFeedbackMsg(""), 4000)
        setTitle("")
        setSlug("")
        setExcerpt("")
        setMetaTitle("")
        setMetaDescription("")
        fetchData()
      }
    } catch (err) {
      console.error("Error creating article:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <SubNav
        parentTitle="Headless CMS & Blog"
        currentTitle="Editorial Dashboard & Traffic Metrics"
        description="بديل مدمج أصيل لـ (WordPress & Contentful) لنشر المقالات الأدبية وأخبار المؤلفين مع محاكي نتائج بحث Google ومؤشرات القراءة"
        icon={BookOpen}
        tabs={cmsTabs}
        onRefresh={fetchData}
        isLoading={loading}
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Container className="p-5 border-l-4 border-l-emerald-600">
          <div className="flex items-center justify-between">
            <Text className="text-sm font-medium text-ui-fg-subtle">إجمالي المقالات الأدبية</Text>
            <FileText className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-ui-fg-base">
              {summary ? summary.total_articles : "0"}
            </span>
            <span className="text-sm text-ui-fg-subtle mr-2">مقال منسوخ</span>
          </div>
          <Text className="text-xs text-ui-fg-subtle mt-2">مقالات نقدية وكواليس كتابة</Text>
        </Container>

        <Container className="p-5 border-l-4 border-l-blue-600">
          <div className="flex items-center justify-between">
            <Text className="text-sm font-medium text-ui-fg-subtle">المقالات المنشورة النشطة</Text>
            <Globe className="w-5 h-5 text-blue-600" />
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-blue-600">
              {summary ? summary.published_count : "0"}
            </span>
          </div>
          <Text className="text-xs text-green-700 mt-2 font-medium">مفهرسة في محركات البحث</Text>
        </Container>

        <Container className="p-5 border-l-4 border-l-purple-600">
          <div className="flex items-center justify-between">
            <Text className="text-sm font-medium text-ui-fg-subtle">إجمالي قراءات المقالات</Text>
            <Eye className="w-5 h-5 text-purple-600" />
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-purple-600">
              {summary ? Number(summary.total_views).toLocaleString() : "0"}
            </span>
            <span className="text-sm text-ui-fg-subtle mr-2">مشاهدة</span>
          </div>
          <Text className="text-xs text-ui-fg-subtle mt-2">عبر الواجهة وموقع الروايات</Text>
        </Container>

        <Container className="p-5 border-l-4 border-l-amber-500">
          <div className="flex items-center justify-between">
            <Text className="text-sm font-medium text-ui-fg-subtle">التصنيفات التحريرية</Text>
            <BookOpen className="w-5 h-5 text-amber-500" />
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-amber-600">
              {summary ? summary.total_categories : "0"}
            </span>
            <span className="text-sm text-ui-fg-subtle mr-2">تصنيف أدبي</span>
          </div>
          <Text className="text-xs text-ui-fg-subtle mt-2">منظمة ومصنفة بعناية</Text>
        </Container>
      </div>

      {/* Composer & Google SERP Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Article Editor Form (7 cols) */}
        <Container className="p-6 lg:col-span-7 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <PlusCircle className="w-5 h-5 text-emerald-600" />
            <Heading level="h2" className="text-base font-semibold text-ui-fg-base">
              محرر نشر المقالات والمحتوى الإخباري
            </Heading>
          </div>
          <form onSubmit={handleCreateArticle} className="space-y-3">
            <div>
              <label className="text-xs font-medium text-ui-fg-subtle block mb-1">
                عنوان المقال (Article Title)
              </label>
              <Input
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="مثال: رحلة في أدب الخيال التاريخي العربي وتأثيره"
                required
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-ui-fg-subtle block mb-1">
                  الرابط الدائم (Slug)
                </label>
                <Input
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="historical-fiction-journey"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-medium text-ui-fg-subtle block mb-1">
                  التصنيف (Category)
                </label>
                <select
                  className="w-full text-sm bg-ui-bg-base border border-ui-border-base rounded-md p-2"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="دراسات أدبية ونقد">دراسات أدبية ونقد</option>
                  <option value="حوارات المؤلفين">حوارات المؤلفين</option>
                  <option value="إصدارات وتوقيعات">إصدارات وتوقيعات</option>
                  <option value="كواليس الإنتاج الصوتي">كواليس الإنتاج الصوتي</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-ui-fg-subtle block mb-1">
                  الكاتب / الناقد (Author)
                </label>
                <Input
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="د. ماجد بن سلطان"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-ui-fg-subtle block mb-1">
                  رابط صورة الغلاف (Cover Image)
                </label>
                <Input
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  placeholder="https://..."
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-ui-fg-subtle block mb-1">
                مقدمة المقال والملخص (Excerpt)
              </label>
              <textarea
                className="w-full text-sm bg-ui-bg-base border border-ui-border-base rounded-md p-2.5 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500"
                rows={3}
                value={excerpt}
                onChange={(e) => {
                  setExcerpt(e.target.value)
                  if (!metaDescription) setMetaDescription(e.target.value)
                }}
                placeholder="اكتب نبذة شيقة تجذب القارئ وتظهر في بطاقة المقال..."
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-ui-fg-subtle block mb-1">
                  عنوان SEO لمحرك البحث (Meta Title)
                </label>
                <Input
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  placeholder="العنوان الظاهر في نتائج Google"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-ui-fg-subtle block mb-1">
                  وصف SEO لمحرك البحث (Meta Description)
                </label>
                <Input
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  placeholder="الوصف الظاهر تحت الرابط في Google"
                />
              </div>
            </div>
            <Button
              type="submit"
              variant="primary"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white mt-2"
              disabled={isSubmitting}
            >
              <BookOpen className="w-4 h-4 ml-1.5" />
              {isSubmitting ? "جاري النشر..." : "نشر المقال وتعميمه على المتجر"}
            </Button>
            {feedbackMsg && (
              <div className="p-2.5 bg-green-50 border border-green-200 text-green-800 text-xs rounded-md flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                {feedbackMsg}
              </div>
            )}
          </form>
        </Container>

        {/* Live Google SERP Preview Card (5 cols) */}
        <Container className="p-6 lg:col-span-5 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Search className="w-5 h-5 text-blue-600" />
            <Heading level="h2" className="text-base font-semibold text-ui-fg-base">
              معاينة الظهور في Google (Live SERP Preview)
            </Heading>
          </div>
          <Text className="text-xs text-ui-fg-subtle">
            هكذا سيظهر مقالك في نتائج بحث Google عند بحث القراء عن كلمات المقال الرئيسية:
          </Text>

          {/* Google Result Card Simulation */}
          <div className="p-4 bg-ui-bg-base border border-ui-border-base rounded-xl shadow-sm space-y-1.5 font-sans" dir="ltr">
            <div className="flex items-center gap-2 text-xs text-gray-700">
              <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800 font-bold text-[10px]">
                N
              </div>
              <div className="flex flex-col">
                <span className="text-[12px] font-semibold text-[#202124]">Novels Enterprise</span>
                <span className="text-[10px] text-[#5f6368] font-mono">
                  https://novels.example.com/blog/{slug || "slug-preview"}
                </span>
              </div>
            </div>
            <div className="text-[#1a0dab] hover:underline cursor-pointer text-base font-medium line-clamp-1 pt-1">
              {metaTitle || title || "عنوان المقال كما يظهر في نتائج بحث محرك جوجل"}
            </div>
            <div className="text-[13px] text-[#4d5156] leading-relaxed line-clamp-2">
              {metaDescription || excerpt || "ملخص المقال التحفيزي والوصف التعريفي الذي يجذب المستخدمين للنقر وقراءة المقال الكامل على منصتك..."}
            </div>
          </div>

          <div className="pt-4 border-t border-ui-border-base space-y-2 text-xs text-ui-fg-subtle">
            <div className="flex items-center justify-between">
              <span>طول عنوان SEO:</span>
              <span className={`font-mono font-bold ${metaTitle.length > 60 ? "text-amber-600" : "text-green-600"}`}>
                {metaTitle.length} / 60 حرف
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>طول وصف Meta:</span>
              <span className={`font-mono font-bold ${metaDescription.length > 160 ? "text-amber-600" : "text-green-600"}`}>
                {metaDescription.length} / 160 حرف
              </span>
            </div>
            <div className="p-2.5 bg-blue-50 border border-blue-200 text-blue-900 rounded text-[11px] leading-relaxed" dir="rtl">
              💡 <strong>نصيحة تحسين محركات البحث (SEO):</strong> يتم توليد خريطة الموقع XML (`sitemap.xml`) وبيانات Schema.org (JSON-LD) تلقائياً لكل مقال جديد.
            </div>
          </div>
        </Container>
      </div>

      {/* Articles Directory Table */}
      <Container className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <Heading level="h2" className="text-lg font-semibold text-ui-fg-base">
              سجل المقالات والمدونات المنشورة
            </Heading>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>غلاف المقال</Table.HeaderCell>
                <Table.HeaderCell>عنوان المقال والرابط</Table.HeaderCell>
                <Table.HeaderCell>التصنيف</Table.HeaderCell>
                <Table.HeaderCell>الكاتب</Table.HeaderCell>
                <Table.HeaderCell>المشاهدات</Table.HeaderCell>
                <Table.HeaderCell>الحالة</Table.HeaderCell>
                <Table.HeaderCell>تاريخ النشر</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {articles.length === 0 ? (
                <Table.Row>
                  <Table.Cell className="text-center py-6 text-ui-fg-subtle">
                    لا توجد مقالات منشورة حالياً.
                  </Table.Cell>
                </Table.Row>
              ) : (
                articles.map((art) => (
                  <Table.Row key={art.id}>
                    <Table.Cell className="w-16">
                      <img
                        src={art.cover_image}
                        alt={art.title}
                        className="w-12 h-10 object-cover rounded shadow-sm"
                      />
                    </Table.Cell>
                    <Table.Cell>
                      <div className="font-semibold text-sm text-ui-fg-base">{art.title}</div>
                      <div className="text-xs text-ui-fg-subtle font-mono">/blog/{art.slug}</div>
                    </Table.Cell>
                    <Table.Cell>
                      <Badge color="purple">{art.category}</Badge>
                    </Table.Cell>
                    <Table.Cell className="text-sm font-medium text-ui-fg-base">
                      {art.author_name}
                    </Table.Cell>
                    <Table.Cell>
                      <span className="font-bold text-sm text-ui-fg-base">
                        {Number(art.view_count).toLocaleString()} 👁️
                      </span>
                    </Table.Cell>
                    <Table.Cell>
                      <Badge color={art.status === "published" ? "green" : "grey"}>
                        {art.status === "published" ? "منشور ومفهرس" : "مسودة"}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell className="text-xs text-ui-fg-subtle">
                      {new Date(art.published_at || art.created_at).toLocaleDateString("ar-SA")}
                    </Table.Cell>
                  </Table.Row>
                ))
              )}
            </Table.Body>
          </Table>
        </div>
      </Container>
    </div>
  )
}

export const config = defineRouteConfig({
  label: "Headless CMS & Blog",
  icon: BookOpen,
})

export default CmsPage
