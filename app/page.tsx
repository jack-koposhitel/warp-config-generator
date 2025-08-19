import Image from "next/image"
import { Accordion } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { WarpGenerator } from "@/components/warp-generator"
import { Analytics } from "@vercel/analytics/next"

export default function Home() {
  return (
    <>
      <Analytics/>
      <main className="flex min-h-screen flex-col items-center justify-center p-4 w-full">
        <div className="flex flex-col items-center justify-center gap-6 w-[300px]">
          <h1 className="logo">Amnezia <span className="warp-logo">+&nbsp;WARP</span></h1>
          <WarpGenerator/>
          <Accordion.Root type="single" collapsible>
            <Accordion.Item value="item-1">
              <Accordion.Header>
			          <Accordion.Trigger>▶ Видео</Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content>
                <video width="300" controls>
                  <source src="https://github.com/user-attachments/assets/86df4274-9383-46bf-b9ea-4427ca021e9a" type="video/mp4"/>
                </video>
              </Accordion.Content>
            </Accordion.Item>
          </Accordion.Root>
        </div>
      </main>
    </>
  )
}
