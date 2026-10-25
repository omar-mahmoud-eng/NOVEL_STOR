import React, { useState } from "react"
import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Text, Badge, Button, Table, Input } from "@medusajs/ui"
import { BookOpen, Plus, Tag, CheckCircle2, Bookmark, Folder } from "lucide-react"
import { SubNav } from "../../../components/sub-nav"

const cmsTabs = [
  { label: "لوحة التحكم (Dashboard)", href: "/app/cms" },
  { label: "استوديو المقالات وSEO (Composer & Articles)", href: "/app/cms/composer" },
  { label: "تصنيفات المدونة (Categories)", href: "/app/cms/categories", active: true },
]

const initialCategories = [
  { id: "cat_1", name: "دراسات أدبية ونقد", slug: "literary-studies", count: 8, description: "قراءات تفكيكية ونقدية لأشهر الروايات الكلاسيكية والمعاصرة" },
  { id: "cat_2", name: "أخبار الروايات والإصدارات", slug: "novel-releases", count: 14, description: "تغطية معارض الكتب، تدشين الطبعات الجديدة، وحفلات التوقيع" },
  { id: "cat_3", name: "حوارات مع المؤلفين", slug: "author-interviews", count: 6, description: "لقاءات حصرية مطولة مع نخبة الروائيين والمترجمين العرب" },
  { id: "cat_4", name: "عالم الكتب الصوتية", slug: "audiobooks-world", count: 9, description: "كواليس تسجيل الروايات الصوتية وتقنيات الأداء والإنتاج الصوتي" },
  { id: "cat_5", name: "جوائز الرواية العالمية", slug: "book-awards", count: 5, description: "متابعة قوائم البوكر، نوبل للآداب، والجوائز الأدبية الإقليمية" },
]

const EditorialCategoriesPage = () => {
  const [categories, setCategories] = useState(initialCategories)
  const [name, setName] = useState("")
  const [slug, setSlug] = useState("")
  const [description, setDescription] = useState("")
  const [feedback, setFeedback] = useState("")

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name) return
    const newCat = {
      id: `cat_${Date.now()}`,
      name,
      slug: slug || name.toLowerCase().replace(/\s+/g, "-"),
      count: 0,
      description: description || "تصنيف تحريري جديد",
    }
    setCategories([...categories, newCat])
    setName("")
    setSlug("")
    setDescription("")
    setFeedback("تم إنشاء وتثبيت القسم التحريري بنجاح!")
    setTimeout(() => setFeedback(""), 3500)
  }

  return (
    <div className="space-y-6">
      <SubNav
        parentTitle="Headless CMS & Blog"
        currentTitle="Editorial Categories & Taxonomy"
        description="هيكل أقسام المدونة الأدبية، التصنيفات الموضوعية والوسوم المخصصة لتنظيم المحتوى"
        icon={Folder}
        tabs={cmsTabs}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Categories List */}
        <Container className="lg:col-span-2 p-0 overflow-hidden">
          <div className="p-4 border-b border-ui-border-base flex items-center justify-between">
            <div>
              <Heading level="h2" className="text-base font-bold text-ui-fg-base">
                الأقسام والتصنيفات المعتمدة ({categories.length})
              </Heading>
              <Text className="text-xs text-ui-fg-subtle">
                تظهر هذه الأقسام في القائمة العلوية لمدونة المتجر وتصنيف المقالات
              </Text>
            </div>
            <Badge color="green">Active Taxonomies</Badge>
          </div>

          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>اسم القسم</Table.HeaderCell>
                <Table.HeaderCell>الرابط (Slug)</Table.HeaderCell>
                <Table.HeaderCell>الوصف التحريري</Table.HeaderCell>
                <Table.HeaderCell>عدد المقالات</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {categories.map((cat) => (
                <Table.Row key={cat.id}>
                  <Table.Cell className="font-semibold text-sm text-ui-fg-base flex items-center gap-2">
                    <Folder className="w-4 h-4 text-emerald-600" />
                    <span>{cat.name}</span>
                  </Table.Cell>
                  <Table.Cell className="font-mono text-xs text-ui-fg-subtle">
                    /blog/category/{cat.slug}
                  </Table.Cell>
                  <Table.Cell className="text-xs text-ui-fg-subtle max-w-[240px] truncate">
                    {cat.description}
                  </Table.Cell>
                  <Table.Cell>
                    <Badge color="blue">{cat.count} مقالات</Badge>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </Container>

        {/* Add Category Form */}
        <Container className="p-5 h-fit">
          <Heading level="h2" className="text-base font-bold text-ui-fg-base mb-1">
            إضافة قسم أدبي جديد
          </Heading>
          <Text className="text-xs text-ui-fg-subtle mb-4">
            توسيع هيكل مدونة الروايات بأقسام متخصصة جديدة
          </Text>

          <form onSubmit={handleAdd} className="space-y-3.5">
            <div>
              <label className="text-xs font-semibold text-ui-fg-base block mb-1">
                اسم القسم
              </label>
              <Input
                placeholder="مثال: أدب الخيال العلمي والفانتازيا"
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                  if (!slug) setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"))
                }}
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-ui-fg-base block mb-1">
                المعرف الرابط (Slug)
              </label>
              <Input
                placeholder="sci-fi-fantasy"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-ui-fg-base block mb-1">
                نبذة عن القسم
              </label>
              <Input
                placeholder="وصف مختصر للأعمال والمقالات المنشورة في هذا القسم"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
              disabled={!name}
            >
              <Plus className="w-4 h-4 ml-1.5" />
              تثبيت القسم في الموقع
            </Button>

            {feedback && (
              <div className="p-2.5 bg-green-50 border border-green-200 text-green-800 text-xs rounded-md flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                {feedback}
              </div>
            )}
          </form>
        </Container>
      </div>
    </div>
  )
}

export const config = defineRouteConfig({
  label: "Blog Categories",
})

export default EditorialCategoriesPage
