"use client"
import { useCatalogBooks } from "@/context/catalog-context"

import { useEffect, useState, type CSSProperties } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { BookOpen, Headphones, Bookmark, ChevronLeft, ChevronRight, Home, Map, Search, Volume2, Check, ArrowRight, ArrowLeft, Minus, Plus, Pause, Play, RotateCcw, Download, WifiOff, Settings, NotebookPen } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useReadingState } from "@/context/reading-state-context"
import { useNarration } from "@/hooks/use-narration"
import { ParentGate } from "@/components/family/parent-gate"
import { REALMS, realmBase, type ReadingRealm } from "@/lib/realms"
import { PUBLISHING_BOOKS, type StoryBookData } from "@/lib/books-data"
import reference from "@/lib/stitch-reading-reference.json"
import { searchText } from "@/lib/search-text"

export type RealmScreen = "books" | "reader" | "player" | "illustrated" | "interactive" | "library" | "preferences" | "quest-map" | "levels" | "words" | "detective" | "complete" | "activities" | "offline" | "audiobooks"
export const CHILD_SCREENS: RealmScreen[] = ["books", "reader", "player", "illustrated", "interactive", "library", "preferences", "quest-map", "levels", "words", "detective", "complete", "activities", "offline", "audiobooks"]
const littleScenes = [
  "نَزَلَ المَطَرُ بِهُدُوءٍ.", "فَتَحَ نُونُو مِظَلَّتَهُ.", "رَأَى عُصْفُورًا عِنْدَ البَابِ.",
  "قَالَ: تَعَالَ نَحْتَمِي مَعًا.", "وَقَفَ العُصْفُورُ تَحْتَ المِظَلَّةِ.", "ابْتَسَمَ نُونُو، وَانْتَهَتِ الحِكَايَةُ.",
]
const littleReferences = [reference.l03_base_1440, reference.l03_scene_2_390, reference.l03_scene_3_390, reference.l03_scene_4_390, reference.l03_scene_5_390, reference.l03_scene_6_390]
const vocabulary = {
  little: [{ word: "مِظَلَّةٌ", definition: "تَحْمِينَا مِنَ المَطَرِ.", example: "فَتَحَ نُونُو مِظَلَّتَهُ." }, { word: "عُصْفُورٌ", definition: "طَائِرٌ صَغِيرٌ يُغَرِّدُ بِلُطْفٍ.", example: "وَقَفَ العُصْفُورُ قُرْبَ نُونُو." }, { word: "مَطَرٌ", definition: "قَطَرَاتُ مَاءٍ تَنْزِلُ مِنَ الغَيْمِ.", example: "نَزَلَ المَطَرُ بِهُدُوءٍ." }],
  kids: [{ word: "مَرْفَأٌ", definition: "مكان آمن على الشاطئ تستريح فيه القوارب والسفن.", example: "سأل زيد حارس المرفأ عن المفتاح." }, { word: "مَنَارَةٌ", definition: "برج مرتفع يضيء الطريق للسفن.", example: "أضاءت المنارة الساحل في المساء." }, { word: "بُوصَلَةٌ", definition: "أداة تساعدنا على معرفة الاتجاهات.", example: "أشارت البوصلة إلى الشمال." }],
  teens: [{ word: "المدار", definition: "المسار الذي يتحرك فيه جسم حول جسم آخر.", example: "راقبت ليان اختلاف المدار في الخريطة." }, { word: "الإحداثيات", definition: "قيم تحدد موضع نقطة على خريطة أو في الفضاء.", example: "دوّن عمر الإحداثيات في دفتر المرصد." }, { word: "العدسة", definition: "قطعة شفافة تجمع الضوء أو تغير مساره.", example: "تأملت ليان النقوش خلف العدسة." }],
}
type Props = { realm: Exclude<ReadingRealm, "originals">; screen: RealmScreen; book?: StoryBookData; locale: "ar" | "en"; query?: string; initialPage?: number; category?: string }
type Scene = { text: string; image: string }
function scenesFor(book: StoryBookData, realm: Props["realm"], screen:RealmScreen): Scene[] {
  if (book.id === "book_little_01") return (book.sectionImages ? book.sampleText : littleScenes).map((text, index) => ({ text, image: book.sectionImages?.[index] || littleReferences[index % littleReferences.length].images[0].src }))
  if(book.id==="book_kids_01" && screen==="illustrated" && !book.sectionImages)return [0,1,2].map(index=>({text:reference.k09_base_1440.paragraphs[index===0?0:index+1],image:reference.k09_base_1440.images[0].src}))
  const paragraphs = book.sampleText.length ? book.sampleText : [book.description]
  return paragraphs.map((text,index) => ({ text, image: book.sectionImages?.[index] || book.coverUrl }))
}

export function RealmExperience(props:Props) {
 const books=useCatalogBooks().filter(book=>book.ageGroup===REALMS[props.realm].group)
 if(!props.book&&!books.length)return <div className="realm-width py-12 space-y-6"><h1>{props.locale==="ar"?"لا توجد حكايات منشورة في هذه المنصة حاليًا.":"No stories are currently published in this realm."}</h1><Link href={realmBase(props.locale,props.realm)}>{props.locale==="ar"?"الرئيسية":"Home"}</Link></div>
 return <RealmExperienceContent {...props}/>
}
function RealmExperienceContent({ realm, screen, book: supplied, locale, query = "", initialPage, category="all" }: Props) {
  const PUBLISHING_BOOKS = useCatalogBooks()
  const config = REALMS[realm], base = realmBase(locale, realm), ar = locale === "ar"
  const books = PUBLISHING_BOOKS.filter((book) => book.ageGroup === config.group)
  const book = supplied || books.find((value) => value.id === config.featured) || books[0]
  const scenes = scenesFor(book, realm, screen)
  const { state, ready, scopeKey, updateEntry, updateSettings, clearHistory } = useReadingState()
  const [restoredKey,setRestoredKey]=useState("")
  const identity=`${scopeKey}:${book.id}:${screen}`
  const entry = state[realm].entries[book.id] || {}, settings = state[realm]
  const router = useRouter()
  const narration = useNarration()
  const [filter,setFilter]=useState(category)
  const [page, setPage] = useState(0), [search, setSearch] = useState(query), [onlySaved, setOnlySaved] = useState(false)
  const [drawer, setDrawer] = useState(false), [word, setWord] = useState<number | null>(null), [zoom, setZoom] = useState(1)
  const [question, setQuestion] = useState(0), [answer, setAnswer] = useState<number | null>(null), [feedback, setFeedback] = useState("")
  const [branch, setBranch] = useState<string[]>([]), [online, setOnline] = useState(true), [busy, setBusy] = useState<string | null>(null)
  const [status, setStatus] = useState(""), [showNotes, setShowNotes] = useState(false), [notes, setNotes] = useState("")
  useEffect(() => setSearch(query), [query])
  useEffect(() => setFilter(category), [category])
  useEffect(() => { setQuestion(0); setAnswer(null); setFeedback(""); setDrawer(false); setShowNotes(false); setZoom(1) }, [book.id, screen])
  const safePage=Math.max(0,Math.min(page,scenes.length-1))
  const text = scenes[page]?.text || scenes[0].text
  const words = vocabulary[realm]
  const href = (view: RealmScreen, id = book.id) => `${base}/${view}${["books", "reader", "player", "illustrated", "interactive", "quest-map", "words", "detective", "complete", "activities"].includes(view) ? `/${id}` : ""}`
  useEffect(() => {
    if (!ready) return
    const stored = state[realm].entries[book.id] || {}
    setPage(Math.max(0, Math.min(scenes.length - 1, initialPage ?? stored.page ?? 0)))
    setBranch(Array.isArray(stored.branch) ? stored.branch : [])
    setNotes(stored.notes || "");setRestoredKey(identity)
  }, [ready, realm, book.id, initialPage,scopeKey,screen])
  useEffect(() => {
    const change = () => setOnline(navigator.onLine)
    change(); window.addEventListener("online", change); window.addEventListener("offline", change)
    return () => { window.removeEventListener("online", change); window.removeEventListener("offline", change) }
  }, [])
  useEffect(() => {
    if (ready && restoredKey===identity && ["reader", "player", "illustrated"].includes(screen)) updateEntry(realm, book.id, { page, furthest: Math.max(entry.furthest || 0, page) })
  }, [ready, screen, page, realm, book.id,restoredKey,identity])
  function changePage(next: number) { narration.stop(); setPage(Math.max(0, Math.min(scenes.length - 1, next))) }
  function finish() { narration.stop(); updateEntry(realm, book.id, { completed: true, page: scenes.length - 1, furthest: scenes.length - 1 }); router.push(href("complete")) }
  function toggleSave(id = book.id) { updateEntry(realm, id, { saved: !state[realm].entries[id]?.saved }) }
  const saveLabel = entry.saved ? (ar ? "محفوظ في رفي" : "Saved to my shelf") : (ar ? "احفظ في رفي" : "Save to my shelf")
  const style = { "--realm-accent": config.color, "--realm-bg": config.background, "--realm-ink": config.ink, "--realm-surface": config.surface } as CSSProperties
  const labels: Record<RealmScreen, string> = { books: realm === "little" ? "حكايات قبل النوم الهادئة" : "استكشف الحكايات", reader: "القراءة", player: "القراءة مع الاستماع", illustrated: "اللوحات المصورة", interactive: "اختر مسار الحكاية", library: "رفي الخاص", preferences: "تفضيلات القراءة", "quest-map": "خريطة المغامرة", levels: "مستوى القراءة المريح", words: "مستكشف الكلمات", detective: "محقق الحكاية", complete: "أتممت هذا الفصل", activities: "دليل القراءة معًا", offline: "حكاياتي دون اتصال", audiobooks: "حكايات مسموعة" }
  const isStage = ["reader", "player", "illustrated", "interactive", "quest-map", "words", "detective", "complete"].includes(screen)
  const link = (view: RealmScreen, label: string, icon?: React.ReactNode) => <Link className="realm-button" href={href(view)}>{icon}{label}</Link>
  async function downloadBook(item: StoryBookData) {
    setBusy(item.id); setStatus("")
    try {
      if (!("caches" in window) || !("serviceWorker" in navigator)) throw new Error(ar ? "الحفظ دون اتصال غير متاح في هذا المتصفح." : "Offline storage is unavailable.")
      await navigator.serviceWorker.register("/reading-sw.js", { scope: "/" })
      await navigator.serviceWorker.ready
      const cache = await caches.open("storyverse-reading-v1")
      const urls = [`${base}/offline`, `${base}/reader/${item.id}`, `${base}/books/${item.id}`]
      for (const url of urls) {
        const response = await fetch(url, { cache: "no-store" })
        if (!response.ok) throw new Error(ar ? "تعذر تحميل الحكاية. تحقق من الاتصال وحاول مجددًا." : "Unable to download the story. Please retry online.")
        const html = await response.clone().text()
        await cache.put(new Request(new URL(url, window.location.origin)), response)
        const assets = [...new Set(Array.from(html.matchAll(/(?:src|href)="([^" ]*\/_next\/static\/[^" ]+)"/g)).map((match) => match[1].replace(/&amp;/g, "&")))]
        await Promise.all(assets.map(async (asset) => { const result = await fetch(asset); if (result.ok) await cache.put(new Request(new URL(asset, location.origin)), result) }))
      }
      updateEntry(realm, item.id, { downloaded: true })
      setStatus(ar ? "تم حفظ النص وواجهة القراءة على هذا الجهاز. ظهور الصور دون اتصال يعتمد على حفظها أثناء التصفح." : "Story text and reader saved on this device. Offline pictures depend on previously cached images.")
    } catch (error: any) { setStatus(error.message || (ar ? "تعذر الحفظ." : "Download failed.")) }
    finally { setBusy(null) }
  }
  function printable() {
    const title = book.title.replace(/[&<>"']/g, character=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[character] || character))
    const html = `<!doctype html><html lang="ar" dir="rtl"><meta charset="utf-8"><title>${title}</title><style>body{font-family:Arial;padding:40px;line-height:2}h1{color:#36574b}.box{height:350px;border:2px dashed #999;border-radius:24px}</style><h1>${title}</h1><p>ارسم المشهد الذي أحببته من الحكاية، وتحدث عنه مع أسرتك.</p><div class="box"></div><p>ما الذي يجعلنا نساعد أصدقاءنا؟</p></html>`
    const url = URL.createObjectURL(new Blob([html], { type: "text/html;charset=utf-8" }))
    const anchor = document.createElement("a"); anchor.href = url; anchor.download = `storyverse-${book.id}-activity.html`; anchor.click(); setTimeout(() => URL.revokeObjectURL(url), 1000)
    setStatus(ar ? "تم تنزيل ورقة النشاط. افتح الملف واطبعه من المتصفح." : "Activity downloaded. Open the file and print it from your browser.")
  }
  function choose(value: string) { const next = [...branch, value]; setBranch(next); updateEntry(realm, book.id, { branch: next }) }
  const resultBooks = books.filter((item) => (filter==="all" || (realm==="kids"?(filter==="knowledge"?Number(item.id.slice(-2))>=5:Number(item.id.slice(-2))<=4):realm==="teens"?Number(item.id.slice(-2))<=5:true)) && (!onlySaved || state[realm].entries[item.id]?.saved) && searchText(`${item.title} ${item.description}`).includes(searchText(search)))
  const card = (item: StoryBookData) => <article key={item.id} className="realm-card realm-book-card">
    <Link href={`${base}/books/${item.id}`}><img src={item.coverUrl} alt={item.title} loading="lazy" className="realm-cover" /></Link>
    <div className="space-y-3"><h2 className="text-lg font-bold"><Link href={`${base}/books/${item.id}`}>{item.title}</Link></h2><p className="text-sm opacity-75 line-clamp-2">{item.description}</p>
      <div className="flex flex-wrap gap-2"><Link className="realm-button realm-primary" href={`${base}/reader/${item.id}`}>{state[realm].entries[item.id]?.page ? (ar ? "متابعة القراءة" : "Continue") : (ar ? "ابدأ القراءة" : "Read")}</Link>
        <button className="realm-button" onClick={() => toggleSave(item.id)} aria-pressed={!!state[realm].entries[item.id]?.saved}><Bookmark size={18} fill={state[realm].entries[item.id]?.saved ? "currentColor" : "none"} />{ar ? "رفي" : "My shelf"}</button></div>
    </div></article>
  return <div className={`realm-experience realm-${realm}`} style={style} data-realm-screen={screen} data-quiet={settings.quiet}>
    <header className={`realm-stage-header ${isStage ? "sticky top-0 z-30" : ""}`}>
      <div className="realm-width flex flex-wrap items-center justify-between gap-3">
        <Link href={isStage ? href("books") : base} className="realm-button" aria-label={ar ? "العودة إلى المنصة" : "Back to realm"}>{ar ? <ArrowRight size={20} /> : <ArrowLeft size={20} />}<span className="hidden sm:inline">{isStage ? book.title : ar ? config.label : config.en}</span></Link>
        <span className="font-bold text-sm">{ar ? labels[screen] : screen.replaceAll("-", " ")}</span>
        <ParentGate locale={locale} onContinue={() => router.push(`/${locale}/family-hub`)}><span className="realm-button">{ar ? "للأهل" : "Parents"}</span></ParentGate>
      </div>
    </header>
    {!isStage && <nav aria-label={ar ? "التنقل داخل المنصة" : "Realm navigation"} className="realm-width realm-subnav">
      {[["", ar ? "الرئيسية" : "Home"], ["books", ar ? "الحكايات" : "Stories"], ["library", ar ? "رفي" : "My shelf"], [realm === "little" ? "activities" : "levels", ar ? realm === "little" ? "نقرأ معًا" : "مستوى القراءة" : "Reading tools"], ["offline", ar ? "دون اتصال" : "Offline"]].map(([view, label]) => <Link key={view} href={view ? `${base}/${view}` : base} aria-current={view === screen ? "page" : undefined}>{label}</Link>)}
    </nav>}
    <div className="realm-width realm-content">
      {(status || narration.message) && <p role="status" className="realm-notice">{status || narration.message}</p>}

      {["books", "audiobooks"].includes(screen) && !supplied && <>
        <h1 className="realm-title">{ar ? labels[screen] : screen === "audiobooks" ? "Read and listen" : "Find your next story"}</h1>
        <div className="realm-card flex flex-wrap gap-3 items-center"><label className="relative flex-1 min-w-0"><span className="sr-only">{ar ? "ابحث في الحكايات" : "Search stories"}</span><input className="realm-input" placeholder={ar ? "ابحث عن حكاية…" : "Search stories…"} value={search} onChange={(event) => setSearch(event.target.value)} /></label>
          <button className="realm-button" aria-pressed={onlySaved} onClick={() => setOnlySaved(!onlySaved)}><Bookmark size={18} />{ar ? "رفي فقط" : "Saved only"}</button></div>
        <p role="status">{resultBooks.length} {ar ? "حكايات في هذه المنصة" : "stories in this realm"}</p>
        {resultBooks.length ? <div className="realm-grid">{resultBooks.map(card)}</div> : <div className="realm-card text-center space-y-4"><Search className="mx-auto" /><h2>{ar ? "لا توجد حكايات مطابقة" : "No matching stories"}</h2><button className="realm-button" onClick={() => { setSearch(""); setOnlySaved(false);setFilter("all") }}>{ar ? "مسح البحث" : "Clear search"}</button></div>}
      </>}

      {screen === "books" && supplied && <>
        <article className="realm-card grid md:grid-cols-[220px_1fr] gap-8 items-start">
          <img src={book.coverUrl} alt={book.title} className="w-full max-w-60 mx-auto rounded-2xl shadow-lg" />
          <div className="space-y-5">{book.product_id&&<ParentGate locale={locale} onContinue={()=>router.push(`/${locale}/products/${book.product_id}`)}><span className="realm-button">{ar?"عرض المنتج للأهل":"Store edition for parents"}</span></ParentGate>}<span className="realm-pill">{config.age} · {ar ? config.label : config.en}</span><h1 className="realm-title">{book.title}</h1><p className="leading-8">{book.description}</p>
            <p className="text-sm opacity-70">{ar ? "النص المتاح للقراءة في هذه النسخة" : "Available reading text"} · {scenes.length} {ar ? "مقاطع" : "sections"}</p>
            <div className="flex flex-wrap gap-3">{link("reader", ar ? "متابعة القراءة" : "Read", <BookOpen size={20} />)}{link("player", ar ? "استماع مع النص" : "Read aloud", <Headphones size={20} />)}{link("illustrated", ar ? "اللوحات المصورة" : "Pictures")}<button className="realm-button" onClick={() => toggleSave()} aria-pressed={!!entry.saved}><Bookmark size={18} />{saveLabel}</button></div>
          </div>
        </article>
        <section className="realm-card space-y-4"><h2 className="text-xl font-bold">{ar ? "مسار القراءة" : "Reading path"}</h2>{scenes.map((scene, index) => <Link key={index} className="realm-chapter" href={`${href("reader")}?page=${index}`}><span className="realm-number">{index + 1}</span><span className="min-w-0 flex-1 truncate">{realm === "little" ? scene.text : `${ar ? "المقطع" : "Section"} ${index + 1}`}</span>{(entry.furthest ?? -1) >= index && <Check size={20} />}</Link>)}</section>
        <div className="realm-grid">{link("words", ar ? "مستكشف الكلمات" : "Word explorer")}{link(realm === "little" ? "interactive" : "quest-map", ar ? realm === "little" ? "نختار معًا" : "خريطة المغامرة" : "Explore")}{link(realm === "little" ? "activities" : "detective", ar ? realm === "little" ? "أنشطة للأسرة" : "محقق الحكاية" : "Reading activity")}</div>
      </>}

      {["reader", "player", "illustrated"].includes(screen) && <>
        <div className="realm-toolbar">
          <button className="realm-button" onClick={() => setDrawer(!drawer)} aria-expanded={drawer}><BookOpen size={18} />{ar ? "المقاطع" : "Sections"}</button>
          <button className="realm-button" aria-label={ar ? "تصغير الخط" : "Smaller text"} onClick={() => updateSettings(realm, { fontSize: Math.max(16, settings.fontSize - 2) })}><Minus size={18} />A</button>
          <button className="realm-button" aria-label={ar ? "تكبير الخط" : "Larger text"} onClick={() => updateSettings(realm, { fontSize: Math.min(32, settings.fontSize + 2) })}><Plus size={18} />A</button>
          {realm !== "little" && <button className="realm-button" onClick={() => updateSettings(realm, { theme: settings.theme === "night" ? "paper" : "night" })}>{ar ? "تبديل الإضاءة" : "Toggle theme"}</button>}
          <button className="realm-button" aria-pressed={!!entry.saved} onClick={() => toggleSave()}><Bookmark size={18} />{ar ? "علامة مرجعية" : "Bookmark"}</button>
          {realm === "teens" && <button className="realm-button" onClick={() => setShowNotes(!showNotes)} aria-expanded={showNotes}><NotebookPen size={18} />{ar ? "دفتر ملاحظاتي" : "My notes"}</button>}
        </div>
        {drawer && <nav className="realm-card space-y-2" aria-label={ar ? "فهرس المقاطع" : "Section index"}>{scenes.map((scene, index) => <button key={index} className="realm-chapter w-full" aria-current={page === index ? "step" : undefined} onClick={() => { changePage(index); setDrawer(false) }}>{index + 1}. {realm === "little" ? scene.text : `${ar ? "المقطع" : "Section"} ${index + 1}`}</button>)}</nav>}
        <div className="realm-progress"><span style={{ width: `${((page + 1) / scenes.length) * 100}%` }} /></div>
        <p className="text-center text-sm opacity-75">{ar ? "المشهد" : "Scene"} {page + 1} {ar ? "من" : "of"} {scenes.length} · {book.title}</p>
        <article className={`realm-reader ${settings.theme === "night" && realm !== "little" ? "realm-reader-night" : ""}`}>
          {(realm === "little" || screen === "illustrated" || page === 0) && <div className="overflow-hidden rounded-3xl"><img src={scenes[safePage].image} alt={`${book.title} — ${ar ? "المشهد" : "scene"} ${page + 1}`} className={`realm-scene ${realm === "little" ? "realm-scene-little" : ""}`} style={{ transform: `scale(${zoom})` }} /></div>}
          {screen === "illustrated" && <div className="flex justify-center gap-2"><button className="realm-button" onClick={() => setZoom(Math.max(1, zoom - 0.2))} disabled={zoom <= 1} aria-label={ar ? "تصغير الصورة" : "Zoom out"}><Minus size={18} /></button><span className="self-center">{Math.round(zoom * 100)}%</span><button className="realm-button" onClick={() => setZoom(Math.min(2, zoom + 0.2))} disabled={zoom >= 2} aria-label={ar ? "تكبير الصورة" : "Zoom in"}><Plus size={18} /></button></div>}
          <div className="realm-reading-text" style={{ fontSize: settings.fontSize, fontFamily: settings.fontFamily === "sans" ? "var(--font-arabic), sans-serif" : "var(--font-serif), var(--font-arabic), serif" }}>
            {realm === "little" ? text.split(" ").map((value, index) => <button key={index} onClick={() => narration.speak(value, 0.75, locale)} className="realm-word" aria-label={`${ar ? "استمع إلى" : "Hear"} ${value}`}>{value}</button>) : <p>{text.split(/(\s+)/).map((part,index)=>{const normalize=(value:string)=>value.replace(/[ً-ٰٟ]/g,"").replace(/[^ء-ي]/g,"").replace(/^ال/,"");const match=words.findIndex(item=>normalize(item.word)===normalize(part));return match>=0?<button className="realm-inline-word" key={index} onClick={()=>setWord(match)}>{part}</button>:part})}</p>}
          </div>
          <button className="realm-button realm-primary w-full" onClick={() => narration.toggle(text, settings.speed, locale)} aria-pressed={narration.speaking && !narration.paused}>{narration.speaking && !narration.paused ? <Pause size={22} /> : <Volume2 size={22} />}{ar ? narration.speaking && !narration.paused ? "إيقاف مؤقت" : "استمع إلى النص" : "Read aloud"}</button>
          {screen === "player" && <label className="flex items-center justify-between gap-3">{ar ? "سرعة القراءة الصوتية" : "Speech speed"}<select className="realm-input max-w-40" value={settings.speed} onChange={(event) => { narration.stop(); updateSettings(realm, { speed: Number(event.target.value) }) }}>{[0.75, 1, 1.25, 1.5].map((speed) => <option key={speed} value={speed}>{speed}×</option>)}</select></label>}
        </article>
        <div className="realm-pagination"><button className="realm-button" disabled={page === 0} onClick={() => changePage(page - 1)}>{ar ? "السابق" : "Previous"}</button><button className="realm-button realm-primary" onClick={() => page === scenes.length - 1 ? finish() : changePage(page + 1)}>{ar ? page === scenes.length - 1 ? "أتممت القراءة" : "التالي" : page === scenes.length - 1 ? "Finish reading" : "Next"}</button></div>
        {showNotes && <section className="realm-card space-y-3"><label className="block font-bold" htmlFor="story-note">{ar ? "ملاحظاتي الخاصة" : "Private notes"}</label><textarea id="story-note" className="realm-input min-h-32" value={notes} onChange={(event) => setNotes(event.target.value)} /><button className="realm-button" onClick={() => { updateEntry(realm, book.id, { notes }); setStatus(ar ? "حُفظت الملاحظة على هذا الجهاز." : "Note saved on this device.") }}>{ar ? "حفظ الملاحظة" : "Save note"}</button></section>}
        <aside className="realm-card"><h2 className="font-bold mb-2">{ar ? "سؤال للمشاركة والتأمل" : "A question to reflect on"}</h2><p>{realm === "little" ? "كيف نشعر عندما نشارك صديقًا مكانًا دافئًا؟" : realm === "kids" ? "لماذا سأل زيد حارس المرفأ قبل استخدام المفتاح؟" : "كيف يمكننا التأكد من تفسيرنا للإشارة قبل اتخاذ القرار؟"}</p><div className="flex flex-wrap gap-3 mt-4">{link("words", ar ? "استكشف الكلمات" : "Explore words")}{realm !== "little" && link("quest-map", ar ? "خريطة القراءة" : "Reading map")}</div></aside>
      </>}

      {screen === "library" && <><h1 className="realm-title">{ar ? "رفي الخاص" : "My shelf"}</h1><p>{ar ? "الحكايات المحفوظة وتقدم القراءة في هذه المنصة على هذا الجهاز." : "Saved stories and reading progress for this realm on this device."}</p><div className="realm-grid">{books.filter((item) => { const value = state[realm].entries[item.id]; return value?.saved || value?.updatedAt }).map(card)}</div>{!books.some((item) => state[realm].entries[item.id]?.saved || state[realm].entries[item.id]?.updatedAt) && <div className="realm-card space-y-4"><BookOpen size={36} /><p>{ar ? "رفك ينتظر أول حكاية. احفظ حكاية أو ابدأ القراءة." : "Your shelf is ready for your first story."}</p><Link className="realm-button" href={`${base}/books`}>{ar ? "استكشف الحكايات" : "Explore stories"}</Link></div>}</>}

      {screen === "levels" && <><h1 className="realm-title">{ar ? "اختر مستوى القراءة المريح لك" : "Choose a comfortable reading level"}</h1><div className="realm-grid">{[1, 2, 3].map((level) => <button key={level} className="realm-card text-start space-y-3" aria-pressed={settings.level === level} onClick={() => updateSettings(realm, { level, fontSize: [26, 22, 20][level - 1] })}><span className="realm-number">{level}</span><h2 className="text-xl font-bold">{ar ? ["بداية هادئة", "قارئ مستكشف", "قارئ متمرس"][level - 1] : ["Gentle start", "Explorer", "Confident reader"][level - 1]}</h2><p>{ar ? ["جمل قصيرة وخط أكبر.", "وتيرة متوسطة وقراءة مريحة.", "مساحة أوسع للنص والتأمل."][level - 1] : "A reading pace that suits you."}</p>{settings.level === level && <Check />}</button>)}</div><article className="realm-card leading-loose" style={{ fontSize: settings.fontSize }}>{scenes[0].text}</article>{link("reader", ar ? "ابدأ بهذا المستوى" : "Read at this level")}</>}

      {screen === "words" && <><h1 className="realm-title">{ar ? "مستكشف كلمات الحكاية" : "Story word explorer"}</h1><div className="realm-grid">{words.map((item, index) => <article key={item.word} className="realm-card text-center space-y-4"><h2 className="text-3xl font-bold">{item.word}</h2><p className="leading-8">{item.definition}</p><button className="realm-button" onClick={() => narration.speak(`${item.word}. ${item.definition}`, 0.8, locale)}><Volume2 size={20} />{ar ? "استمع" : "Listen"}</button><button className="realm-button" onClick={() => setWord(index)}>{ar ? "الكلمة في الحكاية" : "See example"}</button></article>)}</div>{link("reader", ar ? "العودة للحكاية" : "Back to story")}</>}

      {screen === "quest-map" && <><h1 className="realm-title">{ar ? `خريطة القراءة: ${book.title}` : "Your reading journey"}</h1><div className="realm-map"><svg viewBox="0 0 600 260" aria-hidden="true"><path d="M45 195 C110 30 180 260 300 130 S450 230 555 55" fill="none" stroke="currentColor" strokeWidth="5" strokeDasharray="12 12" /></svg>{scenes.map((_, index) => <Link key={index} className="realm-map-stop" style={{ left: `${8 + index * (84 / Math.max(1, scenes.length - 1))}%`, top: `${index % 2 ? 27 : 63}%` }} href={`${href("reader")}?page=${index}`}><span className="realm-number">{(entry.furthest ?? -1) >= index ? <Check size={20} /> : index + 1}</span><span>{ar ? "المحطة" : "Stop"} {index + 1}</span></Link>)}</div><div className="realm-card space-y-3"><h2 className="font-bold">{ar ? "محطتي في الحكاية" : "The old harbour"}</h2><p>{scenes[safePage].text}</p>{link("reader", ar ? "انطلق للقراءة" : "Start reading")}{link("detective", ar ? "محقق الحكاية" : "Story detective")}</div></>}

      {screen === "detective" && <>
        <h1 className="realm-title">{ar ? "محقق الحكاية" : "Story detective"}</h1>
        <section className="realm-card space-y-6 text-center"><p>{ar ? "سؤال" : "Question"} {question + 1} / 3</p><h2 className="text-2xl font-bold">{(book.id==="book_kids_01"?["ماذا فعل زيد عندما وجد المفتاح النحاسي؟", "ما وظيفة المنارة في الحكاية؟", "لماذا نتأنى قبل اتخاذ القرار؟"]:["ما اسم الحكاية التي قرأتها؟","كيف نتأكد من معنى كلمة جديدة؟","لماذا نتأنى قبل اتخاذ القرار؟"])[question]}</h2>
          <div className="grid gap-3">{(book.id==="book_kids_01"?[["سأل حارس المرفأ", "ألقى المفتاح في البحر", "أخفاه دون سؤال"], ["ترشد السفن بضوئها", "تخفي البحر", "تجمع الأمطار"], ["لنفهم ونحافظ على سلامتنا", "لننسى السؤال", "لنتوقف عن القراءة"]]:[[book.title,"حكاية أخرى","لم أقرأ بعد"],["نراجع النص والمعنى","نتجاهل الكلمة","نختار معنى دون قراءة"],["لنفهم ونحافظ على سلامتنا","لننسى السؤال","لنتوقف عن القراءة"]])[question].map((option, index) => <button className="realm-button justify-center" key={option} aria-pressed={answer === index} onClick={() => { setAnswer(index); setFeedback(index === 0 ? "أحسنت التأمل! هذا ما يوضحه النص." : "لنعد إلى الحكاية ونفكر بهدوء. يمكنك المحاولة مرة أخرى.") }}>{option}</button>)}</div>
          {feedback && <p role="status" className="realm-notice">{feedback}</p>}
          {answer === 0 && <button className="realm-button realm-primary" onClick={() => { if (question === 2) finish(); else { setQuestion(question + 1); setAnswer(null); setFeedback("") } }}>{question === 2 ? "أتممت التأمل" : "السؤال التالي"}</button>}
        </section>{link("reader", ar ? "راجع الحكاية" : "Read the story again")}
      </>}

      {screen === "interactive" && realm!=="little" && <section className="realm-card space-y-5"><h1 className="realm-title">{book.title}</h1><p className="leading-9">{scenes[Math.min(branch.length,scenes.length-1)].text}</p><div className="flex flex-wrap gap-3">{link("reader",ar?"أتتبع تفاصيل النص":"Read the text")}{link("words",ar?"أستكشف كلمات الحكاية":"Explore words")}</div></section>}
      {screen === "interactive" && realm==="little" && <><h1 className="realm-title">{ar ? "ماذا يفعل نونو الآن؟" : "What happens next?"}</h1><article className="realm-card text-center space-y-6"><img src={littleReferences[branch.includes("nest") ? 5 : 3].images[0].src} alt={book.title} className="realm-scene realm-scene-little" />
        <p className="text-2xl leading-loose">{branch.length === 0 ? "رَأَى نُونُو العُصْفُورَ الصَّغِيرَ تَحْتَ المَطَرِ. مَاذَا نَخْتَارُ؟" : branch.length === 1 ? branch[0] === "shelter" ? "دَعَا نُونُو العُصْفُورَ لِيَحْتَمِي مَعَهُ. كَيْفَ نُسَاعِدُهُ بَعْدَ ذَلِكَ؟" : "بَحَثَ نُونُو عَنِ العُشِّ بِرِفْقَةِ الكَبِيرِ. مَاذَا نَفْعَلُ الآنَ؟" : branch[0] === "shelter" ? "وَجَدَ العُصْفُورُ الدِّفْءَ، وَابْتَسَمَ الصَّدِيقَانِ. نِهَايَةٌ دَافِئَةٌ." : "عَادَ العُصْفُورُ إِلَى عُشِّهِ بِسَلَامٍ. نِهَايَةٌ هَادِئَةٌ."}</p>
        {branch.length < 2 ? <div className="grid sm:grid-cols-2 gap-4"><button className="realm-button realm-primary" onClick={() => choose(branch.length ? "together" : "shelter")}>{branch.length ? "نَنْتَظِرُ مَعًا بِهُدُوءٍ" : "نَحْتَمِي بِالمِظَلَّةِ"}</button><button className="realm-button" onClick={() => choose(branch.length ? "nest" : "nest")}>{branch.length ? "نَعُودُ بِرِفْقَةِ الكَبِيرِ" : "نَبْحَثُ عَنِ العُشِّ"}</button></div> : <button className="realm-button realm-primary" onClick={finish}>{ar ? "انتهت الحكاية" : "Finish story"}</button>}
        <div className="flex flex-wrap justify-center gap-3"><button className="realm-button" disabled={!branch.length} onClick={() => { const next = branch.slice(0, -1); setBranch(next); updateEntry(realm, book.id, { branch: next }) }}>{ar ? "خطوة للخلف" : "Undo"}</button><button className="realm-button" onClick={() => { setBranch([]); updateEntry(realm, book.id, { branch: [] }) }}><RotateCcw size={18} />{ar ? "نختار من جديد" : "Restart"}</button></div>
      </article></>}

      {screen === "complete" && <section className="realm-card text-center space-y-6 max-w-3xl mx-auto"><span className="realm-complete-symbol">✓</span><h1 className="realm-title">{ar ? realm === "little" ? "انتهت الحكاية، وحان وقت الهدوء" : "أتممت هذا الفصل!" : "A lovely place to pause"}</h1><p className="text-xl">{book.title}</p><p>{ar ? "ما اللحظة التي أحببتها؟ شاركها مع أسرتك، أو احتفظ بها في دفترك." : "What moment stayed with you? Share it with your family or keep a note."}</p><div className="flex flex-wrap justify-center gap-3"><Link className="realm-button" href={`${href("reader")}?page=0`}>{ar?"نقرأ مرة أخرى":"Read again"}</Link><Link className="realm-button" href={`${base}/library`}>{ar ? "العودة إلى رفي" : "My shelf"}</Link>{link("activities", ar ? "نشاط هادئ معًا" : "A quiet activity")}</div><button className="realm-button" onClick={() => toggleSave()} aria-pressed={!!entry.saved}>{saveLabel}</button></section>}

      {screen === "activities" && <><h1 className="realm-title">{ar ? "دليل القراءة معًا" : "Reading together"}</h1><p>{ar ? "مرافقة هادئة للحكاية وأسئلة مفتوحة دون تقييم أو ضغط." : "A gentle companion to your shared reading time."}</p><div className="realm-grid">{["نقرأ ونستمع معًا", "نتأمل ونتحدث", "نرسم ونلوّن"].map((title, index) => <article className="realm-card space-y-4" key={title}><span className="realm-number">{index + 1}</span><h2 className="text-xl font-bold">{title}</h2><p>{["دع صغيرك يختار المشهد الذي يرغب في سماعه.", "اسأل: كيف شعرت الشخصية؟ واستمع إلى الإجابة دون تصحيح أو استعجال.", "ارسم مشهدًا تحبه من الحكاية، ولونه بعيدًا عن الشاشة."][index]}</p>{index === 0 ? link("player", "نبدأ الاستماع") : index === 1 ? link("reader", "نعود إلى الحكاية") : <ParentGate locale={locale} onContinue={printable}><span className="realm-button"><Download size={18} />تنزيل ورقة النشاط</span></ParentGate>}</article>)}</div><ParentGate locale={locale} onContinue={() => window.print()}><span className="realm-button">{ar ? "طباعة دليل الأسرة" : "Print family guide"}</span></ParentGate></>}

      {screen === "offline" && <><h1 className="realm-title">{online ? ar ? "حكايات جاهزة لوقت الهدوء" : "Stories ready for quiet time" : ar ? "نحن الآن دون اتصال بالشبكة" : "You are offline"}</h1><p className="flex items-center gap-2"><WifiOff size={20} />{ar ? "احفظ نصوص الحكايات على هذا الجهاز وأنت متصل، ثم عد إليها دون شبكة." : "Save story text on this device while online, then return offline."}</p><div className="realm-grid">{books.map((item) => <article key={item.id} className="realm-card space-y-4"><h2 className="font-bold">{item.title}</h2>{state[realm].entries[item.id]?.downloaded ? <><span className="realm-pill">{ar ? "محفوظ على هذا الجهاز" : "Saved on this device"}</span><Link className="realm-button realm-primary" href={`${base}/reader/${item.id}`}>{ar ? "افتح الحكاية" : "Open story"}</Link></> : <button className="realm-button" disabled={!online || busy !== null} onClick={() => downloadBook(item)}><Download size={18} />{busy === item.id ? ar ? "جارٍ الحفظ…" : "Saving…" : ar ? "حفظ دون اتصال" : "Save offline"}</button>}</article>)}</div></>}

      {screen === "preferences" && <><h1 className="realm-title">{ar ? "تفضيلات القراءة" : "Reading preferences"}</h1><section className="realm-card space-y-5"><label className="realm-setting">{ar ? "حجم الخط" : "Text size"}<input aria-label={ar ? "حجم الخط" : "Text size"} type="range" min={16} max={32} step={2} value={settings.fontSize} onChange={(event) => updateSettings(realm, { fontSize: Number(event.target.value) })} /><span>{settings.fontSize}</span></label><label className="realm-setting">{ar ? "نوع الخط" : "Font"}<select className="realm-input max-w-48" value={settings.fontFamily} onChange={(event) => updateSettings(realm, { fontFamily: event.target.value })}><option value="serif">خط كتابي</option><option value="sans">خط مبسط</option></select></label><label className="realm-setting">{ar ? "وقت الهدوء" : "Quiet time"}<input type="checkbox" checked={settings.quiet} onChange={(event) => updateSettings(realm, { quiet: event.target.checked })} /></label><p style={{ fontSize: settings.fontSize }} className="leading-loose">{scenes[0].text}</p><p role="status">{ar ? "تحفظ التفضيلات تلقائيًا لهذه المنصة على هذا الجهاز." : "Preferences save automatically for this realm on this device."}</p><button className="realm-button" onClick={() => { clearHistory(realm); setStatus(ar ? "تم مسح تقدم القراءة لهذه المنصة مع الاحتفاظ بقائمة الحكايات المحفوظة." : "Reading progress cleared; saved stories kept.") }}>{ar ? "مسح تقدم القراءة" : "Clear reading progress"}</button></section></>}

    </div>
    <Dialog open={word !== null} onOpenChange={(open) => { if (!open) setWord(null) }}><DialogContent dir={ar ? "rtl" : "ltr"}><DialogHeader><DialogTitle>{word !== null ? words[word].word : ""}</DialogTitle></DialogHeader>{word !== null && <><p className="leading-8">{words[word].definition}</p><blockquote className="realm-notice">{words[word].example}</blockquote><button className="realm-button" onClick={() => narration.speak(words[word].example, 0.8, locale)}><Volume2 size={18} />{ar ? "استمع للمثال" : "Hear example"}</button></>}</DialogContent></Dialog>
  </div>
}
