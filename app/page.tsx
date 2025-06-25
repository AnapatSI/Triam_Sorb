"use client"

import { Suspense } from "react"
import { useAuth } from "@/components/AuthProvider"
import { useLanguage } from '@/components/LanguageProvider'
import Hero from "@/components/sections/Hero"
import Features from "@/components/sections/Features"
import HowItWorks from "@/components/sections/HowItWorks"
import CTA from "@/components/sections/CTA"

export default function HomePage() {
  const { user } = useAuth()
  const { language, setLanguage } = useLanguage()

  const handleLanguageChange = (lang: 'en' | 'th') => setLanguage(lang)

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
