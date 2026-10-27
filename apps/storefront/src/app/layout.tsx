import type { Metadata } from "next"
import localFont from "next/font/local"
import "@/styles/globals.css"

const inter = localFont({
  src: "../assets/fonts/Inter.ttf",
  weight: "100 900",
  variable: "--font-inter",
  display: "swap",
})

const ibmPlexArabic = localFont({
  src: [
    {path:"../assets/fonts/IBMPlexSansArabic-Light.ttf",weight:"300"},
    {path:"../assets/fonts/IBMPlexSansArabic-Regular.ttf",weight:"400"},
    {path:"../assets/fonts/IBMPlexSansArabic-Medium.ttf",weight:"500"},
    {path:"../assets/fonts/IBMPlexSansArabic-SemiBold.ttf",weight:"600"},
    {path:"../assets/fonts/IBMPlexSansArabic-Bold.ttf",weight:"700"},
  ],
  variable: "--font-arabic",
  display: "swap",
})

const notoSansArabic = localFont({
  src: "../assets/fonts/NotoSansArabic.ttf",
  weight: "100 900",
  variable: "--font-noto-sans",
  display: "swap",
})

const notoSerif = localFont({
  src: "../assets/fonts/NotoNaskhArabic.ttf",
  weight: "400 700",
  variable: "--font-serif",
  display: "swap",
})
const ruqaa = localFont({ src: [{path:"../assets/fonts/ArefRuqaa-Regular.ttf",weight:"400"},{path:"../assets/fonts/ArefRuqaa-Bold.ttf",weight:"700"}], variable: "--font-ruqaa", display: "swap" })

export const metadata: Metadata = {
  title: "StoryVerse | منصة الروايات والأدب العربي الرقمي والصوتي",
  description: "المنصة السيادية المتكاملة لقراءة واستماع الروايات العربية لجميع الأعمار وفق تصميم Google Stitch",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      className={`${inter.variable} ${ibmPlexArabic.variable} ${notoSansArabic.variable} ${notoSerif.variable} ${ruqaa.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans">
        {children}
      </body>
    </html>
  )
}
