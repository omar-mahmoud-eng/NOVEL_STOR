"use client"
import { useEffect, useRef, useState } from "react"

export function useNarration() {
  const [speaking, setSpeaking] = useState(false)
  const [paused, setPaused] = useState(false)
  const [message, setMessage] = useState("")
  const [position, setPosition] = useState(0)
  const utterance = useRef<SpeechSynthesisUtterance | null>(null)
  const stop = () => { utterance.current = null; if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel(); setSpeaking(false); setPaused(false); setPosition(0) }
  useEffect(() => () => { if ("speechSynthesis" in window) window.speechSynthesis.cancel() }, [])
  function speak(text: string, rate = 1, locale: "ar" | "en" = "ar") {
    setMessage("")
    if (!("speechSynthesis" in window) || typeof SpeechSynthesisUtterance === "undefined") { setMessage(locale === "ar" ? "القراءة الصوتية غير متاحة في هذا المتصفح. يمكنك متابعة النص." : "Read aloud is unavailable in this browser. You can continue reading."); return }
    window.speechSynthesis.cancel()
    const item = new SpeechSynthesisUtterance(text)
    const textLocale = /[\u0600-\u06FF]/.test(text) ? "ar" : "en"
    item.lang = textLocale === "ar" ? "ar-SA" : "en-US"
    item.rate = Math.max(0.5, Math.min(2, rate))
    const voice = window.speechSynthesis.getVoices().find((value) => value.lang.startsWith(textLocale))
    if (voice) item.voice = voice
    utterance.current = item; setPosition(0)
    item.onstart = () => { if (utterance.current === item) { setSpeaking(true); setPaused(false) } }
    item.onboundary = (event) => { if (utterance.current === item) setPosition(event.charIndex) }
    item.onend = () => { if (utterance.current === item) { setSpeaking(false); setPaused(false); setPosition(text.length) } }
    item.onerror = (event) => {
      if (utterance.current !== item) return
      setSpeaking(false); setPaused(false)
      if (!["canceled", "interrupted"].includes(event.error)) setMessage(locale === "ar" ? "تعذر تشغيل الصوت. تحقق من توفر صوت عربي في إعدادات جهازك." : "Unable to play speech. Check the installed voices on your device.")
    }
    window.speechSynthesis.speak(item)
  }
  function toggle(text: string, rate = 1, locale: "ar" | "en" = "ar") {
    if (speaking && !paused) { window.speechSynthesis.pause(); setPaused(true) }
    else if (paused && window.speechSynthesis.paused) { window.speechSynthesis.resume(); setPaused(false) }
    else speak(text, rate, locale)
  }
  return { speak, stop, toggle, speaking, paused, position, message }
}
