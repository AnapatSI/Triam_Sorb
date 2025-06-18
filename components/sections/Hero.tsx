import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Upload, Brain, TrendingUp } from "lucide-react"

export default function Hero() {
  return (
    <section className="pt-32 pb-20 px-4">
      <div className="max-w-6xl mx-auto text-center">
        <div className="glass-card p-12 mb-12">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Learn Smarter with AI
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Upload your lessons, share your understanding, and get personalized AI feedback to accelerate your learning
            journey.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/upload">
              <Button size="lg" className="glass-button text-lg px-8 py-4">
                Start Learning
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="glass-button text-lg px-8 py-4">
              Watch Demo
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="glass-card p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Upload className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Upload & Parse</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Upload PDF, DOCX, or TXT files. Our system automatically extracts and processes your content.
            </p>
          </div>

          <div className="glass-card p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">AI Analysis</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Share what you understood. Our AI analyzes your comprehension and identifies knowledge gaps.
            </p>
          </div>

          <div className="glass-card p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Track Progress</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Monitor your learning journey with detailed analytics and personalized recommendations.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
