import React, { useState, useEffect } from "react"
import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Text, Badge, Button, Input } from "@medusajs/ui"
import {
  Users,
  Mic,
  BookOpen,
  Plus,
  Percent,
  Play,
  CheckCircle2,
  Sparkles,
  RefreshCw,
} from "lucide-react"
import { SubNav } from "../../components/sub-nav"

const authorsTabs = [
  { label: "لوحة التحكم (Dashboard)", href: "/app/authors-narrators", active: true },
  { label: "تراخيص وحماية البث الصوتي (DRM & Tokens)", href: "/app/authors-narrators/drm" },
]

type Author = {
  id: string
  name: string
  bio: string
  avatar: string
  royaltyPercentage: number
  titlesCount: number
}

type Narrator = {
  id: string
  name: string
  bio: string
  avatar: string
  sampleVoiceUrl: string
  titlesCount: number
}

const initialAuthors: Author[] = [
  {
    id: "auth_01",
    name: "د. غسان الكيلاني",
    bio: "كاتب وأكاديمي متخصص في أدب الخيال العلمي والروايات الفلسفية المعاصرة في العالم العربي.",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80",
    royaltyPercentage: 18,
    titlesCount: 5,
  },
  {
    id: "auth_02",
    name: "منى السعيد",
    bio: "مؤلفة ورسامة قصص أطفال حائزة على جوائز إقليمية في أدب الناشئة والقصص المصورة.",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80",
    royaltyPercentage: 15,
    titlesCount: 8,
  },
  {
    id: "auth_03",
    name: "عمر اليافعي",
    bio: "روائي متخصص في دراما الفانتازيا التاريخية المستوحاة من أساطير الجزيرة العربية.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
    royaltyPercentage: 20,
    titlesCount: 3,
  },
]

const initialNarrators: Narrator[] = [
  {
    id: "narr_01",
    name: "سامي المهدي",
    bio: "صوت إذاعي درامي رخيم، قدم عشرات الأعمال الصوتية والروايات الحائزة على تقييمات استثنائية.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80",
    sampleVoiceUrl: "https://example.com/samples/sami-sample.mp3",
    titlesCount: 6,
  },
  {
    id: "narr_02",
    name: "ريم الجودر",
    bio: "ممثلة صوتية متخصصة في الأداء الحيوي لقصص الأطفال والمسرح الصوتي للشخصيات المتعددة.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
    sampleVoiceUrl: "https://example.com/samples/reem-sample.mp3",
    titlesCount: 9,
  },
]

const AuthorsNarratorsPage = () => {
  const [activeTab, setActiveTab] = useState<"authors" | "narrators">("authors")
  const [authors, setAuthors] = useState<Author[]>(initialAuthors)
  const [narrators, setNarrators] = useState<Narrator[]>(initialNarrators)
  const [loading, setLoading] = useState(false)

  const [showAddAuthor, setShowAddAuthor] = useState(false)
  const [newAuthorName, setNewAuthorName] = useState("")
  const [newAuthorBio, setNewAuthorBio] = useState("")
  const [newAuthorRoyalty, setNewAuthorRoyalty] = useState(15)

  const [showAddNarrator, setShowAddNarrator] = useState(false)
  const [newNarratorName, setNewNarratorName] = useState("")
  const [newNarratorBio, setNewNarratorBio] = useState("")
  const [feedbackMsg, setFeedbackMsg] = useState("")

  const fetchData = async () => {
    setLoading(true)
    try {
      const [authRes, narrRes] = await Promise.all([
        fetch("/admin/authors"),
        fetch("/admin/narrators"),
      ])
      if (authRes.ok) {
        const data = await authRes.json()
        if (data.authors && data.authors.length > 0) {
          setAuthors(
            data.authors.map((a: any) => ({
              id: a.id,
              name: a.name,
              bio: a.bio || "مؤلف أدبي معتمد في الدار.",
              avatar: a.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80",
              royaltyPercentage: a.royalty_percentage || 15,
              titlesCount: 4,
            }))
          )
        }
      }
      if (narrRes.ok) {
        const data = await narrRes.json()
        if (data.narrators && data.narrators.length > 0) {
          setNarrators(
            data.narrators.map((n: any) => ({
              id: n.id,
              name: n.name,
              bio: n.bio || "راوٍ صوتي مسجل في استوديوهات الدار.",
              avatar: n.avatar_url || "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80",
              sampleVoiceUrl: n.sample_voice_url || "https://example.com/samples/voice.mp3",
              titlesCount: 6,
            }))
          )
        }
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

  const handleCreateAuthor = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newAuthorName.trim()) return

    try {
      const res = await fetch("/admin/authors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newAuthorName.trim(),
          bio: newAuthorBio.trim(),
          royalty_percentage: newAuthorRoyalty,
        }),
      })

      if (res.ok) {
        setFeedbackMsg("تم تسجيل وحفظ بيانات المؤلف في قاعدة البيانات بنجاح!")
        setTimeout(() => setFeedbackMsg(""), 3500)
        setNewAuthorName("")
        setNewAuthorBio("")
        setShowAddAuthor(false)
        await fetchData()
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleCreateNarrator = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newNarratorName.trim()) return

    try {
      const res = await fetch("/admin/narrators", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newNarratorName.trim(),
          bio: newNarratorBio.trim(),
        }),
      })

      if (res.ok) {
        setFeedbackMsg("تم تسجيل وحفظ بيانات الراوي الصوتي في قاعدة البيانات بنجاح!")
        setTimeout(() => setFeedbackMsg(""), 3500)
        setNewNarratorName("")
        setNewNarratorBio("")
        setShowAddNarrator(false)
        await fetchData()
      }
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6" dir="rtl">
      <SubNav
        parentTitle="Authors & Narrators"
        currentTitle="Author Royalties & Contributor Directory"
        description="إدارة ملفات المؤلفين، نسب الملكية الفكرية، والمعلقين الصوتيين المسجلين لاستوديوهات الروايات"
        icon={Users}
        tabs={authorsTabs}
        onRefresh={fetchData}
        isLoading={loading}
        actionButton={
          activeTab === "authors" ? (
            <Button
              variant="primary"
              size="small"
              onClick={() => setShowAddAuthor(!showAddAuthor)}
              className="gap-1.5"
            >
              <Plus className="w-4 h-4" /> إضافة مؤلف جديد
            </Button>
          ) : (
            <Button
              variant="primary"
              size="small"
              onClick={() => setShowAddNarrator(!showAddNarrator)}
              className="gap-1.5"
            >
              <Plus className="w-4 h-4" /> إضافة معلق صوتي
            </Button>
          )
        }
      />

      {feedbackMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span className="font-medium">{feedbackMsg}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 border-b border-ui-border-base pb-3">
        <button
          onClick={() => setActiveTab("authors")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
            activeTab === "authors"
              ? "bg-ui-bg-base border border-ui-border-base shadow-2xs text-ui-fg-base"
              : "text-ui-fg-subtle hover:text-ui-fg-base"
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>المؤلفون والمفكرون ({authors.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("narrators")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
            activeTab === "narrators"
              ? "bg-ui-bg-base border border-ui-border-base shadow-2xs text-ui-fg-base"
              : "text-ui-fg-subtle hover:text-ui-fg-base"
          }`}
        >
          <Mic className="w-4 h-4" />
          <span>الرواة والمسرح الصوتي ({narrators.length})</span>
        </button>
      </div>

      {/* Add Author Modal / Form */}
      {showAddAuthor && (
        <Container className="p-6 bg-ui-bg-subtle/50 border border-ui-border-base rounded-xl">
          <form onSubmit={handleCreateAuthor} className="space-y-4">
            <Heading level="h3" className="text-sm font-bold text-ui-fg-base">
              تسجيل مؤلف جديد
            </Heading>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                placeholder="اسم المؤلف (مثال: د. غسان الكيلاني)"
                value={newAuthorName}
                onChange={(e) => setNewAuthorName(e.target.value)}
                required
              />
              <Input
                placeholder="نبذة أدبية مختصرة"
                value={newAuthorBio}
                onChange={(e) => setNewAuthorBio(e.target.value)}
              />
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min={0}
                  max={100}
                  value={newAuthorRoyalty}
                  onChange={(e) => setNewAuthorRoyalty(Number(e.target.value))}
                  className="w-24"
                />
                <span className="text-xs text-ui-fg-subtle">% نسبة الأرباح</span>
                <Button type="submit" variant="primary" size="small" className="mr-auto">
                  حفظ في قاعدة البيانات
                </Button>
              </div>
            </div>
          </form>
        </Container>
      )}

      {/* Add Narrator Modal / Form */}
      {showAddNarrator && (
        <Container className="p-6 bg-ui-bg-subtle/50 border border-ui-border-base rounded-xl">
          <form onSubmit={handleCreateNarrator} className="space-y-4">
            <Heading level="h3" className="text-sm font-bold text-ui-fg-base">
              تسجيل معلق صوتي جديد
            </Heading>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                placeholder="اسم الراوي (مثال: سامي المهدي)"
                value={newNarratorName}
                onChange={(e) => setNewNarratorName(e.target.value)}
                required
              />
              <Input
                placeholder="خصائص الصوت ونبذة فنية"
                value={newNarratorBio}
                onChange={(e) => setNewNarratorBio(e.target.value)}
              />
              <div className="flex items-center gap-2">
                <Button type="submit" variant="primary" size="small" className="mr-auto">
                  حفظ في قاعدة البيانات
                </Button>
              </div>
            </div>
          </form>
        </Container>
      )}

      {/* Authors Tab Content */}
      {activeTab === "authors" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {authors.map((author) => (
            <Container
              key={author.id}
              className="p-5 bg-white dark:bg-ui-bg-base border border-ui-border-base rounded-xl shadow-xs space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <img
                    src={author.avatar}
                    alt={author.name}
                    className="w-12 h-12 rounded-full object-cover border border-ui-border-base shrink-0"
                  />
                  <div>
                    <Heading level="h3" className="text-base font-bold text-ui-fg-base">
                      {author.name}
                    </Heading>
                    <span className="text-xs text-ui-fg-subtle">
                      {author.titlesCount} روايات مرتبطة
                    </span>
                  </div>
                </div>

                <Text className="text-xs text-ui-fg-muted line-clamp-3 leading-relaxed">
                  {author.bio}
                </Text>
              </div>

              <div className="pt-3 border-t border-ui-border-base flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-ui-fg-subtle">
                  <Percent className="w-3.5 h-3.5 text-emerald-600" />
                  <span>نسبة الملكية: {author.royaltyPercentage}%</span>
                </div>
                <Badge color="green">شريك معتمد</Badge>
              </div>
            </Container>
          ))}
        </div>
      )}

      {/* Narrators Tab Content */}
      {activeTab === "narrators" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {narrators.map((narrator) => (
            <Container
              key={narrator.id}
              className="p-5 bg-white dark:bg-ui-bg-base border border-ui-border-base rounded-xl shadow-xs space-y-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={narrator.avatar}
                    alt={narrator.name}
                    className="w-14 h-14 rounded-full object-cover border border-ui-border-base shrink-0"
                  />
                  <div>
                    <Heading level="h3" className="text-base font-bold text-ui-fg-base">
                      {narrator.name}
                    </Heading>
                    <span className="text-xs text-ui-fg-subtle">
                      معلق صوتي معتمد • {narrator.titlesCount} كتب صوتية
                    </span>
                  </div>
                </div>

                <Badge color="purple">Studio Verified</Badge>
              </div>

              <Text className="text-xs text-ui-fg-muted leading-relaxed">
                {narrator.bio}
              </Text>

              <div className="p-3 bg-ui-bg-subtle rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center">
                    <Play className="w-3.5 h-3.5 fill-current" />
                  </div>
                  <span className="text-xs font-medium text-ui-fg-base">عينة الأداء الصوتي (Dolby Atmos)</span>
                </div>
                <span className="text-[11px] font-mono text-ui-fg-muted">48kHz High-Fidelity</span>
              </div>
            </Container>
          ))}
        </div>
      )}
    </div>
  )
}

export const config = defineRouteConfig({
  label: "Authors & Narrators",
  icon: Users,
})

export default AuthorsNarratorsPage
