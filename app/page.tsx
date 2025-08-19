import Image from "next/image"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
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
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
			          <AccordionTrigger>Видео инструкция</AccordionTrigger>
              <AccordionContent>
                <video width="300" controls>
                  <source src="https://github.com/user-attachments/assets/25ca6193-7911-4b58-afc9-098f3dce9871" type="video/mp4" />
                </video>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </main>
    </>
  )
}
