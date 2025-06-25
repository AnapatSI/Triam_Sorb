import { Upload, Edit, Brain, TrendingUp } from "lucide-react"
import { useTranslation } from '@/hooks/useTranslation'

const icons = [Upload, Edit, Brain, TrendingUp]

export default function HowItWorks({ language }: { language: 'en' | 'th' }) {
  const t = useTranslation();
  return (
    <section className="py-20 px-4 bg-gradient-to-r from-gray-50/50 to-gray-100/50 dark:from-gray-900/20 dark:to-gray-800/20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-black to-gray-800 dark:from-white dark:to-gray-200 bg-clip-text text-transparent">
            {t.howItWorks.title}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-6xl mx-auto">
            {t.howItWorks.description}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {t.howItWorks.steps.map((step: any, index: number) => {
            const Icon = icons[index]
            return (
              <div key={index} className="glass-card p-8 text-center relative">
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-br from-black to-gray-800 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {step.step}
                </div>
                <div className="w-16 h-16 bg-gradient-to-br from-black to-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{step.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
