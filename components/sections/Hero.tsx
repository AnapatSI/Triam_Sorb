import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, BookOpen, GraduationCap, Target } from "lucide-react"
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
        <div className="glass-card pt-12 pb-12 mb-12 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-gray-200/20 dark:border-gray-700/20">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-slate-700 to-slate-900 dark:from-slate-600 dark:to-slate-800 rounded-2xl flex items-center justify-center shadow-lg">
              <BookOpen className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold pb-4 mb-8 bg-gradient-to-r from-slate-700 via-slate-800 to-slate-900 dark:from-slate-300 dark:via-slate-200 dark:to-slate-100 bg-clip-text text-transparent">
            {t.hero.title}
          </h1>
          <p className="text-xl md:text-2xl font-medium text-gray-700 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            {t.hero.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <Link href="/study">
                <Button size="lg" className="text-lg px-8 py-4 bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 text-white shadow-lg transition-all duration-200">
                  {t.hero.startStudying}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            ) : (
              <Link href="/login">
                <Button size="lg" className="text-lg px-8 py-4 bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 text-white shadow-lg transition-all duration-200">
                  {t.hero.login}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            )}
            <Button variant="outline" size="lg" className="text-lg px-8 py-4 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-200">
              {t.hero.tryDemo}
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="glass-card p-8 text-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-gray-200/20 dark:border-gray-700/20 hover:shadow-lg transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-600 to-emerald-700 dark:from-emerald-500 dark:to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-100">
              {t.hero.textAnalysisTitle}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 font-medium leading-relaxed">
              {t.hero.textAnalysisDesc}
            </p>
          </div>

          <div className="glass-card p-8 text-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-gray-200/20 dark:border-gray-700/20 hover:shadow-lg transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-100">
              {t.hero.comprehensionCheckTitle}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 font-medium leading-relaxed">
              {t.hero.comprehensionCheckDesc}
            </p>
          </div>

          <div className="glass-card p-8 text-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-gray-200/20 dark:border-gray-700/20 hover:shadow-lg transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-br from-violet-600 to-violet-700 dark:from-violet-500 dark:to-violet-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md">
              <Target className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-100">
              {t.hero.aiRecommendationsTitle}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 font-medium leading-relaxed">
              {t.hero.aiRecommendationsDesc}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}