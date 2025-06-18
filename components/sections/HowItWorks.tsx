import { Upload, Edit, Brain, TrendingUp } from "lucide-react"

const steps = [
  {
    icon: Upload,
    title: "Upload Your Lesson",
    description: "Upload PDF, DOCX, or TXT files containing your study material.",
    step: "01",
  },
  {
    icon: Edit,
    title: "Share Your Understanding",
    description: "Write what you understood from the lesson in your own words.",
    step: "02",
  },
  {
    icon: Brain,
    title: "Get AI Feedback",
    description: "Receive detailed analysis highlighting areas for improvement.",
    step: "03",
  },
  {
    icon: TrendingUp,
    title: "Track Your Progress",
    description: "Monitor your learning journey and see your improvement over time.",
    step: "04",
  },
]

export default function HowItWorks() {
  return (
    <section className="py-20 px-4 bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-900/20 dark:to-purple-900/20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Simple steps to transform your learning experience with AI-powered feedback.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <div key={index} className="glass-card p-8 text-center relative">
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {step.step}
                </div>
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
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
