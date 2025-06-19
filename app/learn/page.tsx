"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Brain, Send, FileText, Clock, Target, AlertCircle, Settings } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { AIAnalyzer, type AIAnalysisResult } from "@/lib/ai-analyzer"
import { type ParsedContent } from "@/lib/file-parser"

// Fallback lesson data if no uploaded content
const fallbackLesson = {
  title: "บทนำสู่การเรียนรู้ของเครื่อง",
  content:
    "การเรียนรู้ของเครื่องเป็นส่วนย่อยของปัญญาประดิษฐ์ที่ทำให้คอมพิวเตอร์สามารถเรียนรู้และตัดสินใจจากข้อมูลโดยไม่ต้องถูกโปรแกรมอย่างชัดเจน มันเกี่ยวข้องกับอัลกอริทึมที่สามารถระบุรูปแบบในข้อมูลและทำนายหรือตัดสินใจตามรูปแบบเหล่านั้น มีการเรียนรู้ของเครื่องสามประเภทหลัก: การเรียนรู้แบบมีผู้ดูแล (การเรียนรู้ด้วยข้อมูลที่มีป้ายกำกับ) การเรียนรู้แบบไม่มีผู้ดูแล (การค้นหารูปแบบในข้อมูลที่ไม่มีป้ายกำกับ) และการเรียนรู้แบบเสริมแรง (การเรียนรู้ผ่านการลองผิดลองถูกด้วยรางวัลและบทลงโทษ)",
  wordCount: 156,
  estimatedReadTime: 2,
  sections: [
    {
      title: "บทนำ",
      content: "การเรียนรู้ของเครื่องเป็นส่วนย่อยของปัญญาประดิษฐ์...",
      level: 1
    }
  ],
  summary: "บทเรียนเกี่ยวกับพื้นฐานการเรียนรู้ของเครื่อง"
}

export default function LearnPage() {
  const [understanding, setUnderstanding] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<AIAnalysisResult | null>(null)
  const [currentLesson, setCurrentLesson] = useState<ParsedContent>(fallbackLesson)
  const { toast } = useToast()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    if (typeof window !== "undefined") {
      // Load lesson from localStorage if available
      const storedLesson = localStorage.getItem('currentLesson')
      if (storedLesson) {
        try {
          const lesson = JSON.parse(storedLesson)
          setCurrentLesson(lesson)
        } catch (error) {
          console.error('Error parsing stored lesson:', error)
        }
      }
    }
  }, [toast])

  const handleSubmit = async () => {
    if (!understanding.trim()) {
      toast({
        title: "กรุณาแชร์ความเข้าใจของคุณ",
        description: "เขียนสิ่งที่คุณเรียนรู้จากบทเรียนก่อนรับข้อเสนอแนะ",
        variant: "destructive",
      })
      return
    }

    setIsAnalyzing(true)
    try {
      // Use AI Analyzer to analyze understanding (will be Gemini in next step)
      const result = await AIAnalyzer.analyzeUnderstanding(currentLesson, understanding)
      setAnalysisResult(result)
      setShowFeedback(true)
      
      // Remove OpenAI provider/model display
      toast({
        title: "การวิเคราะห์เสร็จสิ้น!",
        description: `ความเข้าใจของคุณได้รับการวิเคราะห์แล้ว`,
      })
    } catch (error) {
      console.error('Analysis error:', error)
      toast({
        title: "การวิเคราะห์ล้มเหลว",
        description: "เกิดข้อผิดพลาดในการวิเคราะห์ความเข้าใจของคุณ กรุณาลองใหม่อีกครั้ง",
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
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-black to-gray-800 bg-clip-text text-transparent">
            แชร์ความเข้าใจของคุณ
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            อ่านบทเรียนด้านล่างและเขียนสิ่งที่คุณเข้าใจ AI ของเราจะวิเคราะห์ความเข้าใจของคุณและให้ข้อเสนอแนะ
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Lesson Content */}
          <Card className="glass-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  {currentLesson.title}
                </CardTitle>
                <div className="flex gap-2">
                  <Badge variant="secondary" className="glass">
                    <Clock className="w-3 h-3 mr-1" />
                    {currentLesson.estimatedReadTime} นาที
                  </Badge>
                  <Badge variant="secondary" className="glass">
                    {currentLesson.wordCount.toLocaleString()} คำ
                  </Badge>
                </div>
              </div>
              <CardDescription>อ่านบทเรียนนี้อย่างระมัดระวังแล้วแชร์ความเข้าใจของคุณ</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="prose prose-gray dark:prose-invert max-w-none">
                {currentLesson.sections && currentLesson.sections.length > 0 ? (
                  <div className="space-y-4">
                    {currentLesson.sections.map((section, index) => (
                      <div key={index} className="mb-4">
                        <h3 className={`font-semibold mb-2 ${section.level === 1 ? 'text-lg' : 'text-base'}`}>
                          {section.title}
                        </h3>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                          {section.content}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{currentLesson.content}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Understanding Input */}
          <div className="space-y-6">
            {/* Understanding Input */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  ความเข้าใจของคุณ
                </CardTitle>
                <CardDescription>เขียนสิ่งที่คุณเข้าใจจากบทเรียนด้วยคำพูดของคุณเอง</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Textarea
                  placeholder="แชร์สิ่งที่คุณเรียนรู้จากบทเรียนนี้ อธิบายแนวคิดหลักด้วยคำพูดของคุณเอง..."
                  value={understanding}
                  onChange={(e) => setUnderstanding(e.target.value)}
                  className="min-h-[200px] glass border-0 resize-none"
                />

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{understanding.length} ตัวอักษร</span>
                  <span>แนะนำอย่างน้อย 50 ตัวอักษร</span>
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
                      กำลังวิเคราะห์ความเข้าใจ...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      รับข้อเสนอแนะจาก AI
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* AI Feedback Section */}
        {showFeedback && analysisResult && (
          <div className="mt-12">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  ข้อเสนอแนะและการวิเคราะห์จาก AI
                </CardTitle>
                <CardDescription>นี่คือข้อเสนอแนะที่ปรับแต่งเฉพาะบุคคลตามความเข้าใจของคุณ</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Comprehension Score */}
                <div className="glass rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">คะแนนความเข้าใจ</h3>
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {analysisResult.comprehensionScore}%
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full ${
                        analysisResult.comprehensionScore >= 80 
                          ? 'bg-gradient-to-r from-green-500 to-black dark:to-white'
                          : analysisResult.comprehensionScore >= 60
                          ? 'bg-gradient-to-r from-yellow-500 to-black dark:to-white'
                          : 'bg-gradient-to-r from-red-500 to-black dark:to-white'
                      }`}
                      style={{ width: `${analysisResult.comprehensionScore}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                    {analysisResult.feedback}
                  </p>
                </div>

                {/* Strengths */}
                {analysisResult.strengths.length > 0 && (
                  <div className="glass rounded-xl p-6">
                    <h3 className="text-lg font-semibold mb-4 text-green-600 dark:text-green-400">✓ จุดแข็ง</h3>
                    <ul className="space-y-2">
                      {analysisResult.strengths.map((strength, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span>{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Areas for Improvement */}
                {analysisResult.areasForImprovement.length > 0 && (
                  <div className="glass rounded-xl p-6">
                    <h3 className="text-lg font-semibold mb-4 text-orange-600 dark:text-orange-400">
                      ⚠ พื้นที่ที่ต้องปรับปรุง
                    </h3>
                    <ul className="space-y-2">
                      {analysisResult.areasForImprovement.map((area, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span>{area}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Suggestions */}
                {analysisResult.suggestions.length > 0 && (
                  <div className="glass rounded-xl p-6">
                    <h3 className="text-lg font-semibold mb-4 text-blue-600 dark:text-blue-400">
                      💡 ข้อเสนอแนะ
                    </h3>
                    <ul className="space-y-2">
                      {analysisResult.suggestions.map((suggestion, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span>{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Key Concepts */}
                {analysisResult.keyConcepts.length > 0 && (
                  <div className="glass rounded-xl p-6">
                    <h3 className="text-lg font-semibold mb-4 text-purple-600 dark:text-purple-400">
                      🔑 แนวคิดหลัก
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {analysisResult.keyConcepts.map((concept, index) => (
                        <Badge key={index} variant="outline" className="glass">
                          {concept}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Detailed Explanation */}
                {analysisResult.detailedExplanation && (
                  <div className="glass rounded-xl p-6">
                    <h3 className="text-lg font-semibold mb-4">คำอธิบายโดยละเอียด</h3>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {analysisResult.detailedExplanation}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* No Lesson Warning */}
        {isClient && !localStorage.getItem('currentLesson') && (
          <div className="mt-8">
            <Card className="glass-card border-orange-200 dark:border-orange-800">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 text-orange-600 dark:text-orange-400">
                  <AlertCircle className="w-5 h-5" />
                  <div>
                    <h3 className="font-medium">ไม่มีบทเรียนที่อัปโหลด</h3>
                    <p className="text-sm text-orange-500 dark:text-orange-300">
                      กรุณาอัปโหลดไฟล์บทเรียนของคุณก่อนเพื่อเริ่มการเรียนรู้
                    </p>
                  </div>
                </div>
                <Button className="mt-4 glass-button" asChild>
                  <a href="/upload">อัปโหลดบทเรียน</a>
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
