"use client"

import { Suspense } from "react"
import { useAuth } from "@/components/AuthProvider"
import { useLanguage } from '@/components/LanguageProvider'
import Hero from "@/components/sections/Hero"
import HowItWorks from "@/components/sections/HowItWorks"

export default function HomePage() {
  const { user } = useAuth()
  const { language, setLanguage } = useLanguage()

  return (
    <main className="min-h-screen">
      <Suspense fallback={<div>Loading...</div>}>
        <Hero user={user} language={language} />
        {/* <Features /> */}
        <HowItWorks language={language} />
        {/* <CTA user={user} /> */}
      </Suspense>
    </main>
  )
}
