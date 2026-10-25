import type { Metadata } from "next"
import { Inter, IBM_Plex_Sans_Arabic } from "next/font/google"
import "@/styles/globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const ibmPlexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-arabic",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Enterprise Headless E-Commerce",
  description: "Production-ready Medusa v2 & Next.js 15 Storefront",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      className={`${inter.variable} ${ibmPlexArabic.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  )
}
