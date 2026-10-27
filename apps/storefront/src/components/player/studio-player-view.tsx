"use client"
import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { Play, Pause, SkipBack, SkipForward, Headphones, BookOpen } from "lucide-react"
import { useReadingState } from "@/context/reading-state-context"
import { useNarration } from "@/hooks/use-narration"
import type { StoryBookData } from "@/lib/books-data"

export function StudioPlayerView({ book, locale }: { book: StoryBookData; locale: "ar" | "en" }) {
  const { state, ready, scopeKey, updateEntry, updateSettings } = useReadingState()
  const [cue, setCue] = useState(0), [timer, setTimer] = useState(0)
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  const narration = useNarration(), ar = locale === "ar", settings = state.originals
  const cues = book.sampleText.length ? book.sampleText : [book.description]
  const safeCue = Math.max(0, Math.min(cue, cues.length - 1))
  useEffect(() => { narration.stop(); if (ready) setCue(Math.max(0, Math.min(cues.length - 1, state.originals.entries[book.id]?.page || 0))) }, [ready, book.id, scopeKey])
  useEffect(() => () => { if (timeout.current) clearTimeout(timeout.current) }, [])
  function jump(index: number) { narration.stop(); setCue(Math.max(0, Math.min(cues.length - 1, index))); updateEntry("originals", book.id, { page: index, furthest: Math.max(index, state.originals.entries[book.id]?.furthest || 0) }) }
  function setSleep(minutes: number) { if (timeout.current) clearTimeout(timeout.current); setTimer(minutes); if (minutes) timeout.current = setTimeout(() => { narration.stop(); setTimer(0) }, minutes * 60000) }
  return <div className="original-reading-page min-h-screen"><header className="original-reading-width py-5 flex justify-between items-center gap-4"><Link className="original-button" href={`/${locale}/audiobooks`}>{ar ? "المكتبة الصوتية" : "Audio library"}</Link><Link className="original-button" href={`/${locale}/books/${book.handle}`}>{ar ? "تفاصيل الرواية" : "Story details"}</Link></header><div className="original-reading-width space-y-8 py-8">
    <article className="original-panel grid md:grid-cols-[240px_1fr] gap-8 items-center"><img src={book.coverUrl} alt={book.title} className="rounded-2xl w-full max-w-60 mx-auto shadow-xl" /><div className="space-y-5"><span className="original-tag"><Headphones size={16} />{ar ? "قراءة صوتية للنص المتاح" : "Read the available text aloud"}</span><h1 className="text-3xl sm:text-4xl font-serif font-bold leading-relaxed">{book.title}</h1><p>{book.author.name}</p><p className="text-sm text-[#b1a99e]">{ar ? "الصوت من قارئ الجهاز؛ لا يبدأ تلقائيًا. توفر الصوت العربي يعتمد على إعدادات المتصفح والجهاز." : "Uses your device's speech voice. Playback starts when you press play."}</p><div className="flex items-center justify-center gap-4"><button className="original-button" disabled={safeCue === 0} onClick={() => jump(safeCue - 1)} aria-label={ar ? "المقطع السابق" : "Previous section"}><SkipBack size={24} /></button><button className="original-button original-primary p-5" onClick={() => narration.toggle(cues[safeCue], settings.speed, locale)} aria-label={ar ? narration.speaking && !narration.paused ? "إيقاف مؤقت" : "تشغيل القراءة الصوتية" : "Play or pause reading"}>{narration.speaking && !narration.paused ? <Pause size={30} /> : <Play size={30} />}</button><button className="original-button" disabled={safeCue === cues.length - 1} onClick={() => jump(safeCue + 1)} aria-label={ar ? "المقطع التالي" : "Next section"}><SkipForward size={24} /></button></div><progress className="w-full" value={narration.position} max={cues[safeCue].length} /><div className="flex flex-wrap gap-4 items-center"><label className="flex items-center gap-2">{ar ? "السرعة" : "Speed"}<select className="original-select" value={settings.speed} onChange={(event) => { narration.stop(); updateSettings("originals", { speed: Number(event.target.value) }) }}>{[0.75, 1, 1.25, 1.5].map((rate) => <option value={rate} key={rate}>{rate}×</option>)}</select></label><label className="flex items-center gap-2">{ar ? "مؤقت السكون" : "Sleep timer"}<select className="original-select" value={timer} onChange={(event) => setSleep(Number(event.target.value))}>{[0, 5, 15, 30].map((minutes) => <option value={minutes} key={minutes}>{minutes ? `${minutes} ${ar ? "دقيقة" : "min"}` : ar ? "بدون" : "Off"}</option>)}</select></label></div></div></article>
    {narration.message && <p role="status" className="original-panel">{narration.message}</p>}
    <article className="original-panel space-y-5"><h2 className="text-2xl font-bold">{ar ? "النص المتزامن" : "Reading text"}</h2><p className="text-xl leading-loose" aria-live="polite">{cues[safeCue]}</p><Link className="original-button" href={`/${locale}/reader/${book.handle}?page=${cue}`}><BookOpen size={20} />{ar ? "افتح القارئ من هنا" : "Open reader here"}</Link></article>
    <nav aria-label={ar ? "المقاطع الصوتية" : "Audio sections"} className="grid gap-3">{cues.map((text, index) => <button key={index} className="original-panel text-start" aria-current={cue === index ? "step" : undefined} onClick={() => jump(index)}>{index + 1}. {text.slice(0, 100)}…</button>)}</nav>
  </div></div>
}
