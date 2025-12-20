import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import type React from "react"
import Script from "next/script"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Бесплатный VPN: WARP + Amnezia | Генератор конфигураций для обхода блокировок",
  description: "Генератор конфигураций WARP с маскирующим протоколом Amnezia. Создавайте конфиги для настройки VPN, обхода блокировок сайтов и доступа к заблокированным ресурсам. Поддержка Android, iOS, Linux, macOS, Windows",
  keywords: "Amnezia, WARP, VPN, амнезия, варп, впн, конфиг, генератор, обход блокировок, обход цензуры, доступ к заблокированным сайтам, настройка, КВН, подкоп, config, AmneziaWG, AWG, Wireguard, Cloudflare",
  authors: [{ name: "WARP + Amnezia" }],
  openGraph: {
    title: "Бесплатный VPN: WARP + Amnezia | Генератор конфигураций для обхода блокировок",
    description: "Создавайте конфигурации WARP с маскирующим протоколом Amnezia для обхода блокировок и доступа к заблокированным сайтам",
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
