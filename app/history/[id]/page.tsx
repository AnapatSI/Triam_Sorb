"use client"

import { useParams, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, BookOpen, Clock, Target, MessageSquare, FileText, Calendar, Brain, Upload, History } from "lucide-react"
import { supabase, type LearningSession } from "@/lib/supabase"
import { useAuth } from "@/components/AuthProvider"
import { useTranslation } from '@/hooks/useTranslation';
import { useLanguage } from '@/components/LanguageProvider';

export default function LessonDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [lesson, setLesson] = useState<LearningSession | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const t = useTranslation();
  const { language } = useLanguage();

  useEffect(() => {
    if (!params.id || !user?.id) return

    async function fetchLessonDetail() {
      try {
        setLoading(true)
        const lessonId = params.id as string
        
        // ดึงข้อมูลบทเรียนจาก learning_sessions
        const { data, error } = await supabase
          .from('learning_sessions')
          .select('*')
          .eq('id', lessonId)
          .eq('user_id', user!.id)
          .single()

        if (error) {
          throw error
        }

        if (!data) {
          setError('ไม่พบข้อมูลบทเรียน')
          return
        }

        setLesson(data)
      } catch (err) {
        console.error('Error fetching lesson detail:', err)
        setError('เกิดข้อผิดพลาดในการโหลดข้อมูล')
      } finally {
        setLoading(false)
      }
    }

    fetchLessonDetail()
  }, [params.id, user?.id])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600 dark:text-green-400"
    if (score >= 80) return "text-black dark:text-white"
    if (score >= 70) return "text-orange-600 dark:text-orange-400"
    return "text-red-600 dark:text-red-400"
  }

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 90) return "default"
    if (score >= 80) return "secondary"
    return "outline"
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">{t.history.loading}</h2>
          </div>
        </div>
      </div>
    )
  }

  if (error || !lesson) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">{t.history.errorTitle}</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">{error || t.history.notFound}</p>
            <Button onClick={() => router.push('/history')} className="glass-button">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t.history.backToHistory}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-start mb-6">
            <Button 
              onClick={() => router.push('/history')} 
              variant="outline" 
              className="glass-button"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t.history.backToHistory}
            </Button>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-black to-gray-800 dark:from-white dark:to-gray-200 bg-clip-text text-transparent">
            {t.history.lessonDetail}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {t.history.viewContent}
          </p>
        </div>

        {/* Lesson Overview Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{t.history.comprehensionScore}</p>
                  <p className={`text-3xl font-bold ${getScoreColor(lesson.comprehension_score || 0)}`}>
                    {lesson.comprehension_score || 0}%
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-black to-gray-800 rounded-xl flex items-center justify-center">
                  <Target className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{t.history.date}</p>
                  <p className="text-lg font-bold text-black dark:text-white">
                    {new Date(lesson.created_at).toLocaleDateString(language === 'th' ? 'th-TH' : 'en-US')}
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-gray-800 to-black rounded-xl flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{t.history.timeSpent}</p>
                  <p className="text-3xl font-bold text-black dark:text-white">
                    {lesson.time_spent || '0'} {t.history.minutes}
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-black to-gray-700 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Lesson Info */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  {t.history.lessonInfo}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold mb-2">{lesson.lesson_title}</h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {lesson.category && (
                      <Badge variant="secondary" className="glass">
                        {lesson.category}
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                    <Calendar className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{t.history.date}</p>
                      <p className="font-medium">{formatDate(lesson.created_at)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                    <Clock className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{t.history.timeSpent}</p>
                      <p className="font-medium">{lesson.time_spent || t.history.notSpecified}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Original Content */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  {t.history.lessonContent}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-gray dark:prose-invert max-w-none">
                  <div className="whitespace-pre-wrap text-gray-700 dark:text-gray-300 leading-relaxed">
                    {lesson.lesson_content || t.history.noContent}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* User Understanding */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  {t.history.yourUnderstanding}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-gray dark:prose-invert max-w-none">
                  <div className="whitespace-pre-wrap text-gray-700 dark:text-gray-300 leading-relaxed bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    {lesson.user_understanding || t.history.noUnderstanding}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Score Card */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  {t.history.comprehensionScore}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className={`text-6xl font-bold mb-2 ${getScoreColor(lesson.comprehension_score || 0)}`}>
                  {lesson.comprehension_score || 0}%
                </div>
                <Badge variant={getScoreBadgeVariant(lesson.comprehension_score || 0)} className="text-sm">
                  {lesson.comprehension_score >= 90 ? t.history.excellent : 
                   lesson.comprehension_score >= 80 ? t.history.veryGood :
                   lesson.comprehension_score >= 70 ? t.history.good : t.history.needImprovement}
                </Badge>
              </CardContent>
            </Card>

            {/* AI Feedback */}
            {lesson.ai_feedback && (
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    {t.history.aiAdvice}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm prose-gray dark:prose-invert max-w-none">
                    <div className="whitespace-pre-wrap text-gray-700 dark:text-gray-300 leading-relaxed bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                      {lesson.ai_feedback}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Actions */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  {t.history.actions}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  onClick={() => router.push('/learn')} 
                  className="w-full glass-button"
                  size="lg"
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  {t.history.learnNewLesson}
                </Button>
                <Button 
                  onClick={() => router.push('/upload')} 
                  variant="outline" 
                  className="w-full glass-button"
                  size="lg"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {t.history.uploadNewLesson}
                </Button>
                <Button 
                  onClick={() => router.push('/history')} 
                  variant="outline" 
                  className="w-full glass-button"
                  size="lg"
                >
                  <History className="h-4 w-4 mr-2" />
                  {t.history.backToHistory}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
} 