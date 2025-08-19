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
          <Heading className="logo">Amnezia <Text as="span" className="warp-logo">+&nbsp;WARP</Text></Heading>
          <WarpGenerator/>
          <Flex gap="2">
            <Button asChild variant="soft">
              <Link target="_blank" href="https://telegra.ph/Amnezia--WARP-08-19"><BookOpenText /> Инструкция</a>
            </Button>
            <Button asChild variant="soft">
              <Link target="_blank" href="https://github.com/user-attachments/assets/d2b87e56-f7ff-429e-b49c-07dbd798a37a"><Play /> Видео</a>
            </Button>
          </Flex>
          <Flex gap="2">
            <Button asChild variant="soft">
              <Link target="_blank" href="{repoUrl}/discussions"><MessageCircle/> Обсудить</a>
            </Button>
            <Button asChild variant="soft">
              <Link target="_blank" href="{repoUrl}/issues"><Bug/> Сообщить об ошибке</a>
            </Button>
          </Flex>
          <Link target="_blank" href="{repoUrl}/issues"><Code/> Исходный код</a>
        </div>
      </main>
    </>
  )
}
