import Image from "next/image"
import { Button } from "@/components/ui/button"
import { WarpGenerator } from "@/components/warp-generator"
import { Analytics } from "@vercel/analytics/next"

export default function Home() {
  return (
    <>
      <Analytics/>
      <main className="flex min-h-screen flex-col items-center justify-center p-4 w-full">
        <div className="flex flex-col items-center justify-center gap-6 w-[300px]">
          <h1>Amnezia <span className="warp-logo">+&nbsp;WARP</span></h1>
          <WarpGenerator/>
        </div>
      </main>
    </>
  )
}
