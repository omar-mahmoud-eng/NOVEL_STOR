import React, { useState } from "react"
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

  const [showAddAuthor, setShowAddAuthor] = useState(false)
  const [newAuthorName, setNewAuthorName] = useState("")
  const [newAuthorBio, setNewAuthorBio] = useState("")
  const [newAuthorRoyalty, setNewAuthorRoyalty] = useState(15)

  const [showAddNarrator, setShowAddNarrator] = useState(false)
  const [newNarratorName, setNewNarratorName] = useState("")
  const [newNarratorBio, setNewNarratorBio] = useState("")

  const handleCreateAuthor = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newAuthorName.trim()) return

    const created: Author = {
      id: `auth_${Date.now().toString(36)}`,
      name: newAuthorName.trim(),
      bio: newAuthorBio.trim() || "مؤلف أدبي معتمد في المنصة.",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80",
      royaltyPercentage: newAuthorRoyalty,
      titlesCount: 0,
    }

    setAuthors([created, ...authors])
    setNewAuthorName("")
    setNewAuthorBio("")
    setShowAddAuthor(false)
  }

  const handleCreateNarrator = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newNarratorName.trim()) return

    const created: Narrator = {
      id: `narr_${Date.now().toString(36)}`,
      name: newNarratorName.trim(),
      bio: newNarratorBio.trim() || "راوٍ صوتي مسجل في المنصة.",
      avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&q=80",
      sampleVoiceUrl: "https://example.com/samples/voice.mp3",
      titlesCount: 0,
    }

    setNarrators([created, ...narrators])
    setNewNarratorName("")
    setNewNarratorBio("")
    setShowAddNarrator(false)
  }

  return (
    <div className="space-y-6">
      <SubNav
        parentTitle="Authors & Narrators"
        currentTitle="Author Royalties & Contributor Directory"
        description="إدارة ملفات المؤلفين، نسب الملكية الفكرية، والمعلقين الصوتيين المسجلين لاستوديوهات الروايات"
        icon={Users}
        tabs={authorsTabs}
        actionButton={
          activeTab === "authors" ? (
            <Button
              variant="primary"
              size="small"
              onClick={() => setShowAddAuthor(!showAddAuthor)}
              className="gap-1.5"
            >
              <Plus className="w-4 h-4" /> Add Author
            </Button>
          ) : (
            <Button
              variant="primary"
              size="small"
              onClick={() => setShowAddNarrator(!showAddNarrator)}
              className="gap-1.5"
            >
              <Plus className="w-4 h-4" /> Add Voice Narrator
            </Button>
          )
        }
      />

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
          <span>Authors ({authors.length})</span>
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
          <span>Voice Narrators ({narrators.length})</span>
        </button>
      </div>

      {/* Add Author Modal / Form */}
      {showAddAuthor && (
        <Container className="p-6 bg-ui-bg-subtle/50 border border-ui-border-base rounded-xl">
          <form onSubmit={handleCreateAuthor} className="space-y-4">
            <Heading level="h3" className="text-sm font-bold text-ui-fg-base">
              Add New Author Profile
            </Heading>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                placeholder="Author Name (e.g. د. غسان الكيلاني)"
                value={newAuthorName}
                onChange={(e) => setNewAuthorName(e.target.value)}
                required
              />
              <Input
                placeholder="Short Literary Biography"
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
                <span className="text-xs text-ui-fg-subtle">% Royalty</span>
                <Button type="submit" variant="primary" size="small" className="ml-auto">
                  Save Author
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
              Add New Voice Narrator Profile
            </Heading>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                placeholder="Narrator Name (e.g. سامي المهدي)"
                value={newNarratorName}
                onChange={(e) => setNewNarratorName(e.target.value)}
                required
              />
              <Input
                placeholder="Voice Characteristics & Bio"
                value={newNarratorBio}
                onChange={(e) => setNewNarratorBio(e.target.value)}
              />
              <div className="flex items-center gap-2">
                <Button type="submit" variant="primary" size="small" className="ml-auto">
                  Save Narrator
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
                    className="w-12 h-12 rounded-full object-cover border border-ui-border-base"
                  />
                  <div>
                    <Heading level="h3" className="text-base font-bold text-ui-fg-base">
                      {author.name}
                    </Heading>
                    <span className="text-xs text-ui-fg-subtle">
                      {author.titlesCount} Linked Stories
                    </span>
                  </div>
                </div>

                <Text className="text-xs text-ui-fg-muted line-clamp-3 leading-relaxed">
                  {author.bio}
                </Text>
              </div>

              <div className="pt-3 border-t border-ui-border-base flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-ui-fg-subtle">
                  <Percent className="w-3.5 h-3.5 text-ui-tag-green-icon" />
                  <span>Royalty: {author.royaltyPercentage}%</span>
                </div>
                <Badge color="green">Active Partner</Badge>
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
                    className="w-14 h-14 rounded-full object-cover border border-ui-border-base"
                  />
                  <div>
                    <Heading level="h3" className="text-base font-bold text-ui-fg-base">
                      {narrator.name}
                    </Heading>
                    <span className="text-xs text-ui-fg-subtle">
                      Audio Narrator • {narrator.titlesCount} Audiobooks
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
                  <div className="w-7 h-7 rounded-full bg-ui-tag-purple-bg text-ui-tag-purple-icon flex items-center justify-center">
                    <Play className="w-3.5 h-3.5 fill-current" />
                  </div>
                  <span className="text-xs font-medium text-ui-fg-base">Sample Voice Reel (1:20)</span>
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
