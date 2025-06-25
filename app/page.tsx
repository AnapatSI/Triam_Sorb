"use client"

import { Suspense } from "react"
import { useAuth } from "@/components/AuthProvider"
import Hero from "@/components/sections/Hero"
import Features from "@/components/sections/Features"
import HowItWorks from "@/components/sections/HowItWorks"
import CTA from "@/components/sections/CTA"

export default function HomePage() {
  const { user } = useAuth()

  return (
    <main className="min-h-screen">
      <Suspense fallback={<div>Loading...</div>}>
        <Hero user={user} />
        <Features />
        <HowItWorks />
        <CTA user={user} />
      </Suspense>
    </main>
  )
}
