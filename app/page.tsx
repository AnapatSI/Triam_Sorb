import { Suspense } from "react"
import Hero from "@/components/sections/Hero"
import Features from "@/components/sections/Features"
import HowItWorks from "@/components/sections/HowItWorks"
import CTA from "@/components/sections/CTA"

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Suspense fallback={<div>Loading...</div>}>
        <Hero />
        <Features />
        <HowItWorks />
        <CTA />
      </Suspense>
    </main>
  )
}
