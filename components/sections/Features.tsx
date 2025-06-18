import { CheckCircle, FileText, MessageSquare, BarChart3, Shield, Zap } from "lucide-react"

const features = [
  {
    icon: FileText,
    title: "Multi-Format Support",
    description: "Upload PDF, DOCX, and TXT files with automatic content extraction and processing.",
  },
  {
    icon: MessageSquare,
    title: "Interactive Learning",
    description: "Express your understanding in your own words and receive detailed AI feedback.",
  },
  {
    icon: BarChart3,
    title: "Progress Tracking",
    description: "Visualize your learning journey with comprehensive analytics and insights.",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description: "Your data is encrypted and stored securely with enterprise-grade protection.",
  },
  {
    icon: Zap,
    title: "Instant Feedback",
    description: "Get immediate AI-powered analysis and suggestions to improve your understanding.",
  },
  {
    icon: CheckCircle,
    title: "Personalized Learning",
    description: "Adaptive learning paths tailored to your unique learning style and pace.",
  },
]

export default function Features() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Powerful Features
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Everything you need to enhance your learning experience with cutting-edge AI technology.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div key={index} className="glass-card p-8 hover:scale-105 transition-transform duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
