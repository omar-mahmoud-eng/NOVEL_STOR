import React, { useState, useEffect } from "react"
import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Text, Badge, Button, Input } from "@medusajs/ui"
import { FileText, Globe, Search, CheckCircle2, Eye, Sparkles } from "lucide-react"
import { SubNav } from "../../../components/sub-nav"

const cmsTabs = [
  { label: "لوحة التحكم (Dashboard)", href: "/app/cms" },
  { label: "استوديو المقالات وSEO (Composer & Articles)", href: "/app/cms/composer", active: true },
  { label: "تصنيفات المدونة (Categories)", href: "/app/cms/categories" },
]

const ArticleComposerPage = () => {
  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")
  const [category, setCategory] = useState("دراسات أدبية ونقد")
  const [authorName, setAuthorName] = useState("هيئة التحرير")
  const [coverImage, setCoverImage] = useState("https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=1200&q=80")
  const [content, setContent] = useState("")
  const [metaTitle, setMetaTitle] = useState("")
  const [metaDescription, setMetaDescription] = useState("")
  const [status, setStatus] = useState("published")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [feedbackMsg, setFeedbackMsg] = useState("")

  const autoGenerateSlug = (val: string) => {
    setTitle(val)
    if (!slug) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^\w\u0621-\u064A\s-]/g, "")
          .trim()
          .replace(/\s+/g, "-")
      )
    }
    if (!metaTitle) {
      setMetaTitle(`${val} | منصة الروايات العالمية`)
    }
  }

  const handlePublish = async (e: React.FormEvent) => {
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
          category,
          author_name: authorName,
          cover_image: coverImage,
          excerpt: metaDescription || title,
          content: content || "محتوى المقال الأدبي...",
          meta_title: metaTitle || title,
          meta_description: metaDescription || title,
          status,
        }),
      })
      if (res.ok) {
        setFeedbackMsg("تم نشر وتأليف المقال الأدبي وتحديث محاكي Google بنجاح!")
        setTimeout(() => setFeedbackMsg(""), 4500)
        setTitle("")
        setSlug("")
        setContent("")
        setMetaTitle("")
        setMetaDescription("")
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <SubNav
        parentTitle="Headless CMS & Blog"
        currentTitle="Article Composer & SEO Studio"
        description="محرر المقالات الأدبية، ضبط بيانات الميتا و OpenGraph ومحاكاة مظهر نتائج Google SERP الفورية"
        icon={FileText}
        tabs={cmsTabs}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Editor (Left 7 Cols) */}
        <Container className="lg:col-span-7 p-6">
          <Heading level="h2" className="text-base font-bold text-ui-fg-base mb-1">
            صياغة المقال الأدبي والنقدي
          </Heading>
          <Text className="text-xs text-ui-fg-subtle mb-6">
            أدخل تفاصيل التدوينة الأدبية، التصنيف والوسائط
          </Text>

          <form onSubmit={handlePublish} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-ui-fg-base block mb-1">
                عنوان المقال
              </label>
              <Input
                placeholder="مثال: تحليل البنية السردية في روايات نجيب محفوظ"
                value={title}
                onChange={(e) => autoGenerateSlug(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-ui-fg-base block mb-1">
                  الرابط الدائم (Slug)
                </label>
                <Input
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="naguib-mahfouz-narrative-structure"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-ui-fg-base block mb-1">
                  القسم الأدبي
                </label>
                <select
                  className="w-full text-xs p-2 rounded-md border border-ui-border-base bg-ui-bg-base text-ui-fg-base"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="دراسات أدبية ونقد">دراسات أدبية ونقد</option>
                  <option value="أخبار الروايات والإصدارات">أخبار الروايات والإصدارات</option>
                  <option value="حوارات مع المؤلفين">حوارات مع المؤلفين</option>
                  <option value="عالم الكتب الصوتية">عالم الكتب الصوتية</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-ui-fg-base block mb-1">
                  اسم الكاتب / الناقد
                </label>
                <Input
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="د. سارة المنصور"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-ui-fg-base block mb-1">
                  حالة النشر
                </label>
                <select
                  className="w-full text-xs p-2 rounded-md border border-ui-border-base bg-ui-bg-base text-ui-fg-base"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="published">نشر فوري وتصدير لمحركات البحث</option>
                  <option value="draft">حفظ كمسودة تحريرية</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-ui-fg-base block mb-1">
                رابط صورة الغلاف المقال
              </label>
              <Input
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                placeholder="https://..."
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-ui-fg-base block mb-1">
                محتوى التدوينة الكامل (Rich Article Body)
              </label>
              <textarea
                className="w-full text-xs p-3 rounded-lg border border-ui-border-base bg-ui-bg-base text-ui-fg-base focus:outline-none focus:ring-1 focus:ring-emerald-500 font-sans leading-relaxed"
                rows={8}
                placeholder="اكتب المقال الأدبي هنا بشكل كامل..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-ui-fg-base block mb-1">
                وصف الميتا لمحركات البحث (Meta Description)
              </label>
              <Input
                placeholder="قراءة نقدية معاصرة في الثلاثية وتأثيرها على الرواية العربية الحديثة..."
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
              disabled={isSubmitting || !title || !slug}
            >
              <FileText className="w-4 h-4 ml-1.5" />
              {isSubmitting ? "جاري النشر..." : "نشر المقال الأدبي وتفعيل الـ SEO"}
            </Button>

            {feedbackMsg && (
              <div className="p-3 bg-green-50 border border-green-200 text-green-800 text-xs rounded-md flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                {feedbackMsg}
              </div>
            )}
          </form>
        </Container>

        {/* Live Google SERP Simulator (Right 5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <Container className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <Search className="w-4 h-4 text-sky-600" />
              <Heading level="h3" className="text-sm font-bold text-ui-fg-base">
                محاكي نتائج محرك بحث Google (SERP Preview)
              </Heading>
            </div>
            <Text className="text-[11px] text-ui-fg-subtle mb-4">
              هكذا ستظهر هذه التدوينة للجمهور عند البحث في Google عن الرواية
            </Text>

            <div className="p-4 bg-white border border-gray-200 rounded-xl shadow-sm text-right space-y-1">
              <div className="flex items-center gap-2 text-xs text-gray-700">
                <div className="w-4 h-4 rounded-full bg-emerald-600 flex items-center justify-center text-white text-[9px] font-bold">
                  ر
                </div>
                <span className="text-[11px] text-gray-600 truncate">
                  https://novels-platform.com/blog/{slug || "slug-preview"}
                </span>
              </div>
              <div className="text-sm font-semibold text-blue-800 hover:underline cursor-pointer line-clamp-1">
                {metaTitle || title || "عنوان المقال يظهر هنا بنتائج Google"}
              </div>
              <div className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                {metaDescription ||
                  "مقتطف التدوينة الأدبية ووصف محركات البحث الذي يشجع القراء على النقر والدخول إلى المنصة..."}
              </div>
            </div>
          </Container>

          {/* Social OpenGraph Preview Card */}
          <Container className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <Globe className="w-4 h-4 text-indigo-600" />
              <Heading level="h3" className="text-sm font-bold text-ui-fg-base">
                بطاقة المشاركة الاجتماعية (OpenGraph)
              </Heading>
            </div>
            <div className="rounded-xl border border-ui-border-base overflow-hidden bg-ui-bg-subtle/40">
              <img
                src={coverImage}
                alt="Cover Preview"
                className="w-full h-36 object-cover"
                onError={(e: any) => {
                  e.target.src = "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=800&q=80"
                }}
              />
              <div className="p-3 text-right">
                <div className="text-[10px] text-ui-fg-muted uppercase tracking-wider mb-0.5">
                  NOVELS-PLATFORM.COM
                </div>
                <div className="text-xs font-bold text-ui-fg-base line-clamp-1">
                  {title || "عنوان الرواية أو المقال الأدبي"}
                </div>
                <div className="text-[11px] text-ui-fg-subtle line-clamp-1 mt-0.5">
                  {metaDescription || "استكشف أحدث المقالات الأدبية والدراسات النقدية الحصرية"}
                </div>
              </div>
            </div>
          </Container>
        </div>
      </div>
    </div>
  )
}

export const config = defineRouteConfig({
  label: "Article Composer",
})

export default ArticleComposerPage
