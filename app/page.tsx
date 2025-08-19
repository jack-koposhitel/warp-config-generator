import Image from "next/image"
import { Button } from "@/components/ui/button"
import {
  BookOpenText,
  Bug,
  Code,
  MessageCircle,
  Play
} from "lucide-react"
import { WarpGenerator } from "@/components/warp-generator"
import { Analytics } from "@vercel/analytics/next"

const repoUrl = "https://github.com/jack-koposhitel/warp-config-generator"

export default function Home() {
  return (
    <>
      <Analytics/>
      <main className="flex min-h-screen flex-col items-center justify-center p-4 w-full">
        <div className="flex flex-col items-center justify-center gap-6 w-[300px]">
          <h1 className="logo">Amnezia <span className="warp-logo">+&nbsp;WARP</span></h1>
          <WarpGenerator/>
          <div className="flex gap-2 w-full">
            <Button asChild variant="secondary" className="flex-auto">
              <a href="https://telegra.ph/Amnezia--WARP-08-19" target="_blank"><BookOpenText /> Инструкция</a>
            </Button>
            <Button asChild variant="secondary" className="flex-auto">
              <a href="https://github.com/user-attachments/assets/d2b87e56-f7ff-429e-b49c-07dbd798a37a" target="_blank"><Play /> Видео</a>
            </Button>
          </div>
          <div className="flex gap-2 w-full">
            <Button asChild variant="secondary" className="flex-auto">
              <a href={`${repoUrl}/discussions`} target="_blank"><MessageCircle/> Обсудить</a>
            </Button>
            <Button asChild variant="secondary" className="flex-auto">
              <a href={`${repoUrl}/issues`} target="_blank"><Bug/> Сообщить об ошибке</a>
            </Button>
          </div>
          <Button asChild variant="link" className="w-full">
            <a href={repoUrl} target="_blank"><Code/> Исходный код</a>
          </Button>
        </div>
      </main>
    </>
  )
}
