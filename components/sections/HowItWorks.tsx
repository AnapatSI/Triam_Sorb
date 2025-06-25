import { Edit3, MessageSquare, Brain, TrendingUp } from "lucide-react"
import { useTranslation } from '@/hooks/useTranslation'

const icons = [Edit3, MessageSquare, Brain, TrendingUp]

export default function HowItWorks({ language }: { language: 'en' | 'th' }) {
  const t = useTranslation();
  return (
    <section className="py-20 px-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-slate-700 to-slate-900 dark:from-slate-600 dark:to-slate-800 rounded-2xl flex items-center justify-center shadow-lg">
              <Brain className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-slate-700 to-slate-900 dark:from-slate-300 dark:to-slate-100 bg-clip-text text-transparent">
            {t.howItWorks.title}
          </h2>
          <p className="text-xl md:text-2xl font-medium text-gray-700 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
            {t.howItWorks.description}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {t.howItWorks.steps.map((step: any, index: number) => {
            const Icon = icons[index]
            const gradientColors = [
              'from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600',
              'from-emerald-600 to-emerald-700 dark:from-emerald-500 dark:to-emerald-600', 
              'from-violet-600 to-violet-700 dark:from-violet-500 dark:to-violet-600',
              'from-amber-600 to-amber-700 dark:from-amber-500 dark:to-amber-600'
            ]
            
            return (
              <div key={index} className="glass-card p-8 text-center relative hover:shadow-xl transition-all duration-300 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border border-gray-200/30 dark:border-gray-700/30 hover:-translate-y-1">
                <div className={`absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-br ${gradientColors[index]} rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg`}>
                  {step.step}
                </div>
                <div className={`w-16 h-16 bg-gradient-to-br ${gradientColors[index]} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-md`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">{step.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 font-medium leading-relaxed">{step.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}