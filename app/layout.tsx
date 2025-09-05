import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import type React from "react"
import Script from "next/script"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Amnezia + WARP | Генератор конфигураций для обхода блокировок",
  description: "Бесплатный генератор конфигураций WARP для подключения через Amnezia. Создавайте конфиги для настройки VPN, обхода блокировок сайтов и доступа к заблокированным ресурсам. Поддержка всех устройств: Android, iOS, Linux, macOS, Windows",
  keywords: "Amnezia, WARP, VPN, конфиг, генератор, обход блокировок, AmneziaWG, Wireguard, Cloudflare, настройка, доступ к заблокированным сайтам, обход цензуры",
  authors: [{ name: "WARP Generator" }],
  openGraph: {
    title: "Amnezia + WARP | Генератор конфигураций для обхода блокировок",
    description: "Создавайте конфигурации Amnezia + WARP для обхода блокировок и доступа к заблокированным сайтам",
    type: "website",
    locale: "ru_RU",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <head>
        <link rel="icon" href="/cloud.ico" type="image/x-icon" />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
