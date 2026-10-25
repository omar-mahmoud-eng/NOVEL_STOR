import React, { useState } from "react"
import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Text, Badge, Button, Input } from "@medusajs/ui"
import {
  BookOpen,
  Mic,
  FileText,
  Music,
  Lock,
  Sparkles,
  UploadCloud,
  CheckCircle2,
  Plus,
  Trash2,
} from "lucide-react"

type ProductProps = {
  data: {
    id: string
    title: string
    handle: string
    metadata?: Record<string, any>
  }
}

const StoryMediaWidget = ({ data }: ProductProps) => {
  const [ageGroup, setAgeGroup] = useState<string>(
    (data.metadata?.age_group as string) || "kids_7_12"
  )
  const [authorName, setAuthorName] = useState<string>(
    (data.metadata?.author_name as string) || "د. غسان الكيلاني"
  )
  const [narratorName, setNarratorName] = useState<string>(
    (data.metadata?.narrator_name as string) || "سامي المهدي (صوت رخيم)"
  )
  const [samplePdfKey, setSamplePdfKey] = useState<string>(
    (data.metadata?.sample_pdf_key as string) || "samples/sample-chapter-1.pdf"
  )
  const [sampleAudioKey, setSampleAudioKey] = useState<string>(
    (data.metadata?.sample_audio_key as string) || "samples/sample-audio-preview.mp3"
  )
  const [protectedEbookKey, setProtectedEbookKey] = useState<string>(
    (data.metadata?.protected_ebook_key as string) || `drm/ebooks/${data.id}-master.epub`
  )

  const [chapters, setChapters] = useState([
    {
      chapterNumber: 1,
      title: "الفصل الأول: البداية في الغابة المسحورة",
      duration: "14:20",
      key: `drm/audiobooks/${data.id}/ch-01.mp3`,
      isSample: true,
    },
    {
      chapterNumber: 2,
      title: "الفصل الثاني: سر الخريطة الفضية",
      duration: "18:45",
      key: `drm/audiobooks/${data.id}/ch-02.mp3`,
      isSample: false,
    },
  ])

  const [isSaved, setIsSaved] = useState(false)

  const handleSave = () => {
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 2000)
  }

  const addChapter = () => {
    const nextNum = chapters.length + 1
    setChapters([
      ...chapters,
      {
        chapterNumber: nextNum,
        title: `الفصل ${nextNum}: عنوان الفصل الجديد`,
        duration: "15:00",
        key: `drm/audiobooks/${data.id}/ch-0${nextNum}.mp3`,
        isSample: false,
      },
    ])
  }

  const removeChapter = (idx: number) => {
    setChapters(chapters.filter((_, i) => i !== idx))
  }

  return (
    <Container className="p-6 bg-white dark:bg-ui-bg-base border border-ui-border-base rounded-xl shadow-xs mt-6 space-y-6">
      {/* Widget Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-ui-border-base">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-ui-tag-purple-bg text-ui-tag-purple-icon flex items-center justify-center shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <Heading level="h2" className="text-base font-bold text-ui-fg-base">
                Story & Multi-Format Digital Media Manager
              </Heading>
              <Badge color="purple" className="text-[11px]">
                DRM Protected
              </Badge>
            </div>
            <Text className="text-xs text-ui-fg-subtle">
              Manage Age Group, Author, Voice Narrator, and Private S3 Encrypted Audio & E-Books.
            </Text>
          </div>
        </div>

        <Button
          variant="secondary"
          size="small"
          onClick={handleSave}
          className="flex items-center gap-1.5 shrink-0"
        >
          {isSaved ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Changes Saved!</span>
            </>
          ) : (
            <>
              <UploadCloud className="w-4 h-4" />
              <span>Save & Sync DRM</span>
            </>
          )}
        </Button>
      </div>

      {/* Grid: Age Group, Author, Narrator */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-ui-fg-subtle">Target Age Category</label>
          <select
            value={ageGroup}
            onChange={(e) => setAgeGroup(e.target.value)}
            className="w-full h-9 px-3 rounded-lg border border-ui-border-base bg-ui-bg-field text-xs text-ui-fg-base"
          >
            <option value="kids_3_6">👶 أطفال الصغار (3 - 6 سنوات / Early)</option>
            <option value="kids_7_12">🧒 أطفال وناشئة (7 - 12 سنة / Middle Grade)</option>
            <option value="teens_13_17">🧑 يافعين وشباب (13 - 17 سنة / Young Adult)</option>
            <option value="adults_18_plus">🧑‍💼 بالغين وروايات عامة (18+ / General Fiction)</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-ui-fg-subtle">Assigned Author</label>
          <Input
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            className="h-9 text-xs"
            placeholder="Author full name"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-ui-fg-subtle">Voice Narrator</label>
          <Input
            value={narratorName}
            onChange={(e) => setNarratorName(e.target.value)}
            className="h-9 text-xs"
            placeholder="Audiobook Voice Actor"
          />
        </div>
      </div>

      {/* Free Previews Section */}
      <div className="p-4 rounded-xl bg-ui-bg-subtle/60 border border-ui-border-base space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-ui-fg-interactive" />
          <Text className="text-xs font-bold uppercase tracking-wider text-ui-fg-base">
            Free Public Previews (No Auth Gate)
          </Text>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[11px] font-medium text-ui-fg-subtle flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" /> Sample Chapter PDF Key
            </label>
            <Input
              value={samplePdfKey}
              onChange={(e) => setSamplePdfKey(e.target.value)}
              className="h-8 text-xs font-mono"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[11px] font-medium text-ui-fg-subtle flex items-center gap-1.5">
              <Music className="w-3.5 h-3.5" /> 2-Minute Audio Sample MP3 Key
            </label>
            <Input
              value={sampleAudioKey}
              onChange={(e) => setSampleAudioKey(e.target.value)}
              className="h-8 text-xs font-mono"
            />
          </div>
        </div>
      </div>

      {/* DRM Protected E-Book & Audiobook Files */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-ui-tag-orange-icon" />
            <Text className="text-xs font-bold uppercase tracking-wider text-ui-fg-base">
              Protected Digital Master Assets (Private S3 Bucket)
            </Text>
          </div>
          <Button variant="secondary" size="small" onClick={addChapter} className="h-7 text-xs gap-1">
            <Plus className="w-3 h-3" /> Add Audiobook Chapter
          </Button>
        </div>

        {/* Master E-Book Key */}
        <div className="p-3 rounded-lg border border-ui-border-base bg-ui-bg-field flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <FileText className="w-4 h-4 text-ui-fg-subtle shrink-0" />
            <div>
              <Text className="text-xs font-semibold text-ui-fg-base">Protected E-Book Master (EPUB)</Text>
              <Text className="text-[11px] font-mono text-ui-fg-muted">{protectedEbookKey}</Text>
            </div>
          </div>
          <Badge color="orange">Encrypted DRM</Badge>
        </div>

        {/* Audiobook Chapters Table */}
        <div className="border border-ui-border-base rounded-lg overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-ui-bg-subtle text-ui-fg-subtle border-b border-ui-border-base font-semibold">
              <tr>
                <th className="py-2 px-3">#</th>
                <th className="py-2 px-3">Chapter Title</th>
                <th className="py-2 px-3">Duration</th>
                <th className="py-2 px-3">Private Storage Key</th>
                <th className="py-2 px-3">Access</th>
                <th className="py-2 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ui-border-base">
              {chapters.map((ch, idx) => (
                <tr key={idx} className="hover:bg-ui-bg-subtle/40">
                  <td className="py-2 px-3 font-bold">{ch.chapterNumber}</td>
                  <td className="py-2 px-3 font-medium text-ui-fg-base">{ch.title}</td>
                  <td className="py-2 px-3 text-ui-fg-muted font-mono">{ch.duration}</td>
                  <td className="py-2 px-3 font-mono text-[11px] text-ui-fg-subtle select-all">
                    {ch.key}
                  </td>
                  <td className="py-2 px-3">
                    {ch.isSample ? (
                      <Badge color="green">Free Sample</Badge>
                    ) : (
                      <Badge color="blue">DRM Locked</Badge>
                    )}
                  </td>
                  <td className="py-2 px-3 text-right">
                    <button
                      onClick={() => removeChapter(idx)}
                      className="text-ui-fg-subtle hover:text-ui-fg-error p-1"
                      title="Remove chapter"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Container>
  )
}

export const config = defineWidgetConfig({
  zone: "product.details.after",
})

export default StoryMediaWidget
