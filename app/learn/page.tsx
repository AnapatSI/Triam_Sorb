"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Brain, Send, FileText, Clock, Target } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Mock lesson data
const mockLesson = {
  title: "Introduction to Machine Learning",
  content:
    "Machine learning is a subset of artificial intelligence that enables computers to learn and make decisions from data without being explicitly programmed. It involves algorithms that can identify patterns in data and make predictions or decisions based on those patterns. There are three main types of machine learning: supervised learning (learning with labeled data), unsupervised learning (finding patterns in unlabeled data), and reinforcement learning (learning through trial and error with rewards and penalties).",
  wordCount: 156,
  estimatedReadTime: "2 min",
}

export default function LearnPage() {
  const [understanding, setUnderstanding] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async () => {
    if (!understanding.trim()) {
      toast({
        title: "Please share your understanding",
        description: "Write what you learned from the lesson before getting feedback.",
        variant: "destructive",
      })
      return
    }

    setIsAnalyzing(true)
    try {
      // Simulate AI analysis
      await new Promise((resolve) => setTimeout(resolve, 3000))
      setShowFeedback(true)
      toast({
        title: "Analysis complete!",
        description: "Your understanding has been analyzed. Check the feedback below.",
      })
    } catch (error) {
      toast({
        title: "Analysis failed",
        description: "There was an error analyzing your understanding. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Share Your Understanding
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Read the lesson below and write what you understood. Our AI will analyze your comprehension and provide
            feedback.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Lesson Content */}
          <Card className="glass-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  {mockLesson.title}
                </CardTitle>
                <div className="flex gap-2">
                  <Badge variant="secondary" className="glass">
                    <Clock className="w-3 h-3 mr-1" />
                    {mockLesson.estimatedReadTime}
                  </Badge>
                  <Badge variant="secondary" className="glass">
                    {mockLesson.wordCount} words
                  </Badge>
                </div>
              </div>
              <CardDescription>Read through this lesson carefully and then share your understanding.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="prose prose-gray dark:prose-invert max-w-none">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{mockLesson.content}</p>
              </div>
            </CardContent>
          </Card>

          {/* Understanding Input */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5" />
                Your Understanding
              </CardTitle>
              <CardDescription>Write what you understood from the lesson in your own words.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Textarea
                placeholder="Share what you learned from this lesson. Explain the key concepts in your own words..."
                value={understanding}
                onChange={(e) => setUnderstanding(e.target.value)}
                className="min-h-[200px] glass border-0 resize-none"
              />

              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>{understanding.length} characters</span>
                <span>Minimum 50 characters recommended</span>
              </div>

              <Button
                onClick={handleSubmit}
                disabled={isAnalyzing || understanding.length < 10}
                className="w-full glass-button"
                size="lg"
              >
                {isAnalyzing ? (
                  <>
                    <Brain className="w-4 h-4 mr-2 animate-pulse" />
                    Analyzing Understanding...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Get AI Feedback
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* AI Feedback Section */}
        {showFeedback && (
          <div className="mt-12">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  AI Feedback & Analysis
                </CardTitle>
                <CardDescription>Here's your personalized feedback based on your understanding.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Comprehension Score */}
                <div className="glass rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Comprehension Score</h3>
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">85%</div>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full"
                      style={{ width: "85%" }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                    Great job! You demonstrated a solid understanding of the core concepts.
                  </p>
                </div>

                {/* Strengths */}
                <div className="glass rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-4 text-green-600 dark:text-green-400">✓ Strengths</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Correctly identified machine learning as a subset of AI</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Understood the concept of learning from data without explicit programming</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Mentioned pattern recognition as a key component</span>
                    </li>
                  </ul>
                </div>

                {/* Areas for Improvement */}
                <div className="glass rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-4 text-orange-600 dark:text-orange-400">
                    ⚠ Areas for Improvement
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Could elaborate more on the three types of machine learning</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Missing explanation of supervised vs unsupervised learning</span>
                    </li>
                  </ul>
                </div>

                {/* Suggestions */}
                <div className="glass rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-4 text-blue-600 dark:text-blue-400">💡 Suggestions</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Try to provide examples for each type of machine learning</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Consider explaining the difference between training and prediction phases</span>
                    </li>
                  </ul>
                </div>

                <div className="flex gap-4">
                  <Button className="glass-button" asChild>
                    <a href="/history">View Learning History</a>
                  </Button>
                  <Button variant="outline" className="glass-button" asChild>
                    <a href="/upload">Upload New Lesson</a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
