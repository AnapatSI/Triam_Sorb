import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Upload, Brain, TrendingUp } from "lucide-react"
import { User } from "@supabase/supabase-js"
import { useTranslation } from "@/hooks/useTranslation"

interface HeroProps {
  user: User | null
  language: 'en' | 'th'
}

export default function Hero({ user, language }: HeroProps) {
  const t = useTranslation();

  return (
    <section className="pt-32 pb-20 px-4 mt-2 mb-12">
      <div className="max-w-6xl mx-auto text-center">
        <div className="glass-card pt-6 pb-6 mb-12">
          <h1 className="text-4xl md:text-5xl font-bold pb-4  bg-gradient-to-r from-black via-gray-800 to-black dark:from-white dark:via-gray-200 dark:to-white bg-clip-text text-transparent">
            {t.hero.title}
          </h1>
          <p className="text-xl md:text-1xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            {t.hero.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <Link href="/learn">
                <Button size="lg" className="glass-button text-lg px-8 py-4 dark:text-white">
                  {t.hero.startLearning}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            ) : (
              <Link href="/login">
                <Button size="lg" className="glass-button text-lg px-8 py-4">
                  {t.hero.login}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            )}
            {/* <Button variant="outline" size="lg" className="glass-button text-lg px-8 py-4">
              {t.hero.seeDemo}
            </Button> */}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="glass-card p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-black to-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Upload className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              {t.hero.uploadProcessTitle}
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              {t.hero.uploadProcessDesc}
            </p>
          </div>

          <div className="glass-card p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-gray-800 to-black rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              {t.hero.aiAnalysisTitle}
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              {t.hero.aiAnalysisDesc}
            </p>
          </div>

          <div className="glass-card p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-black to-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              {t.hero.trackProgressTitle}
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              {t.hero.trackProgressDesc}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
