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
      <div className="flex flex-col md:flex-row justify-end p-4 gap-2 md:gap-0">
        <button
          className={`w-full md:w-auto px-4 py-2 md:mr-2 rounded ${language === 'en' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => handleLanguageChange('en')}
        >
          English
        </button>
        <button
          className={`w-full md:w-auto px-4 py-2 rounded ${language === 'th' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => handleLanguageChange('th')}
        >
          ไทย
        </button>
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <Hero user={user} language={language} />
        <Features language={language} />
        <HowItWorks language={language} />
        <CTA user={user} language={language} />
      </Suspense>
    </main>
  )
}
