import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center bg-muted/20 text-foreground font-sans">
      <div className="max-w-md w-full bg-card p-8 rounded-3xl shadow-sm border border-border space-y-4">
        <h1 className="text-5xl font-black text-primary">404</h1>
        <h2 className="text-xl font-bold">الصفحة غير موجودة</h2>
        <p className="text-xs text-muted-foreground">
          Page Not Found. The requested page could not be located.
        </p>
        <div className="pt-4">
          <Link
            href="/ar"
            className="inline-block rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors"
          >
            العودة للمتجر / Return to Store
          </Link>
        </div>
      </div>
    </div>
  )
}
