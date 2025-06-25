"use client"

import { useAuth } from "@/components/AuthProvider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { LogOut, User, Mail, Calendar, BookOpen, TrendingUp, Clock, Brain, Upload, History } from "lucide-react"
import { useState, useEffect } from "react"
import { supabaseApi, type LearningSession } from "@/lib/supabase"
import { useTranslation } from '@/hooks/useTranslation';
import { useLanguage } from '@/components/LanguageProvider';


interface DashboardStats {
  totalLessons: number
  averageScore: number
  totalTimeSpent: number
  recentLessons: LearningSession[]
}

export default function DashboardPage() {
  const { user, signOut } = useAuth()
  const router = useRouter()
  const t = useTranslation()
  const { language } = useLanguage()
  const [stats, setStats] = useState<DashboardStats>({
    totalLessons: 0,
    averageScore: 0,
    totalTimeSpent: 0,
    recentLessons: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user?.id) return

    async function fetchStats() {
      try {
        // Get learning history for stats
        const { data: history, count } = await supabaseApi.getLearningHistory(user!.id, 1, 100)
        
        if (history && history.length > 0) {
          const totalLessons = count || 0
          const averageScore = Math.round(
            history.reduce((sum, item) => sum + (item.comprehension_score || 0), 0) / history.length
          )
          const totalTimeSpent = history.reduce((sum, item) => {
            const timeSpent = parseInt(item.time_spent?.replace(/\D/g, '') || '0')
            return sum + timeSpent
          }, 0)
          const recentLessons = history.slice(0, 3) // Get 3 most recent

          setStats({
            totalLessons,
            averageScore,
            totalTimeSpent,
            recentLessons
          })
        }
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [user])

  const handleSignOut = async () => {
    await signOut()
    router.push('/login')
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">{t.dashboard.loading}</h2>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 mt-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-black to-gray-800 dark:from-white dark:to-gray-200 bg-clip-text text-transparent">
            {t.dashboard.title}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {t.dashboard.welcome}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-12">
          {/* User Profile Card */}
          <Card className="md:col-span-2 glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                {t.dashboard.profile}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-6">
                <Avatar className="h-20 w-20">
                  <AvatarFallback className="text-2xl bg-gradient-to-br from-black to-gray-800 text-white">
                    {user.email?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-semibold">{user.email}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{t.dashboard.userType}</p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <Mail className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{t.dashboard.email}</p>
                    <p className="font-medium">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <Calendar className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{t.dashboard.date_regis}</p>
                    <p className="font-medium">{new Date(user.created_at).toLocaleDateString(language === 'th' ? 'th-TH' : 'en-US')}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                {t.dashboard.actions}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                onClick={() => router.push('/learn')} 
                className="w-full glass-button"
                size="lg"
              >
                <BookOpen className="h-4 w-4 mr-2" />
                {t.dashboard.startLearning}
              </Button>
              <Button 
                onClick={() => router.push('/upload')} 
                variant="outline" 
                className="w-full glass-button"
                size="lg"
              >
                <Upload className="h-4 w-4 mr-2" />
                {t.dashboard.uploadLesson}
              </Button>
              <Button 
                onClick={() => router.push('/history')} 
                variant="outline" 
                className="w-full glass-button"
                size="lg"
              >
                <History className="h-4 w-4 mr-2" />
                {t.dashboard.history}
              </Button>
              <Button 
                onClick={handleSignOut} 
                variant="destructive" 
                className="w-full"
                size="lg"
              >
                <LogOut className="h-4 w-4 mr-2" />
                {t.dashboard.logout}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-3 mb-12">
          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t.dashboard.totalLessons}</CardTitle>
              <BookOpen className="h-4 w-4 text-gray-600 dark:text-gray-300" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {loading ? (
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                ) : (
                  stats.totalLessons
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {stats.totalLessons === 0 ? t.dashboard.startLearning : t.dashboard.studied_already}
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t.dashboard.avgScore}</CardTitle>
              <TrendingUp className="h-4 w-4 text-gray-600 dark:text-gray-300" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {loading ? (
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                ) : (
                  `${stats.averageScore}%`
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {stats.averageScore === 0 ? t.dashboard.noScore : t.dashboard.avgScoreLabel}
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t.dashboard.timeSpent}</CardTitle>
              <Clock className="h-4 w-4 text-gray-600 dark:text-gray-300" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {loading ? (
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                ) : (
                  `${stats.totalTimeSpent} ${t.dashboard.minutes}`
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {stats.totalTimeSpent === 0 ? t.dashboard.startLearning : t.dashboard.totalTimeLabel}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Lessons */}
        {stats.recentLessons.length > 0 && (
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                {t.dashboard.recentLessons}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.recentLessons.map((lesson) => (
                  <div key={lesson.id} className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-black to-gray-800 rounded-lg flex items-center justify-center">
                        <BookOpen className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-medium">{lesson.lesson_title}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {new Date(lesson.created_at).toLocaleDateString(language === 'th' ? 'th-TH' : 'en-US')}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-600 dark:text-green-400">
                        {lesson.comprehension_score || 0}%
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-300">{t.dashboard.score}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-center">
                <Button 
                  onClick={() => router.push('/history')} 
                  variant="outline" 
                  className="glass-button"
                >
                  {t.dashboard.viewAllHistory}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {!loading && stats.totalLessons === 0 && (
          <Card className="glass-card">
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-gray-400 to-gray-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t.dashboard.startLearningTitle}</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                {t.dashboard.noLessons}
              </p>
              <div className="flex gap-3 justify-center">
                <Button 
                  onClick={() => router.push('/upload')} 
                  className="glass-button"
                  size="lg"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {t.dashboard.uploadLesson}
                </Button>
                <Button 
                  onClick={() => router.push('/learn')} 
                  variant="outline" 
                  className="glass-button"
                  size="lg"
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  {t.dashboard.startLearning}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
} 