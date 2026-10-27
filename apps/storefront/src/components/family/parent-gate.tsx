"use client"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export function ParentGate({ locale, onContinue, children }: { locale: "ar" | "en"; onContinue: () => void; children: React.ReactNode }) {
  const [open, setOpen] = useState(false), [answer, setAnswer] = useState(""), [error, setError] = useState("")
  const ar = locale === "ar"
  return <>
    <button type="button" onClick={() => { setOpen(true); setAnswer(""); setError("") }}>{children}</button>
    <Dialog open={open} onOpenChange={setOpen}><DialogContent className="max-w-sm" dir={ar ? "rtl" : "ltr"}>
      <DialogHeader><DialogTitle>{ar ? "بوابة الأهل والمربين" : "Parent gate"}</DialogTitle></DialogHeader>
      <p>{ar ? "للمتابعة إلى مساحة الأهل، أجب عن المسألة التالية:" : "To continue to the parent area, answer:"}</p>
      <p className="text-2xl font-bold text-center" dir="ltr">17 + 8 = ?</p>
      <form className="space-y-3" onSubmit={(event) => { event.preventDefault(); const value = answer.replace(/[٠-٩]/g, (digit) => String(digit.charCodeAt(0) - 1632)); if (value.trim() === "25") { setOpen(false); onContinue() } else setError(ar ? "الإجابة غير صحيحة. حاول مرة أخرى." : "Please try again.") }}>
        <label className="block">{ar ? "الإجابة" : "Answer"}<input autoFocus required inputMode="numeric" value={answer} onChange={(event) => setAnswer(event.target.value)} className="mt-2 w-full rounded-xl border p-3 bg-background" /></label>
        {error && <p role="alert" className="text-red-700">{error}</p>}
        <button className="w-full rounded-xl bg-teal-800 p-3 text-white" type="submit">{ar ? "متابعة" : "Continue"}</button>
      </form>
      <p className="text-xs text-muted-foreground">{ar ? "بوابة للمرافقة الأسرية على الجهاز؛ ليست إثبات هوية أو وصاية." : "A local family gate, not proof of identity or guardianship."}</p>
    </DialogContent></Dialog>
  </>
}
