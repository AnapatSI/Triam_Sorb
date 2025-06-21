"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Search, TrendingUp, FileText, Brain, Clock, Filter } from "lucide-react"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { supabaseApi } from "@/lib/supabase"

const PAGE_SIZE = 5

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

export default function HistoryPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [sortBy, setSortBy] = useState("date")
  const [history, setHistory] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    let isMounted = true
    async function fetchHistory() {
      setLoading(true)
      setError(null)
      try {
        const user = await supabaseApi.getCurrentUser()
        if (!user) {
          setError("ไม่พบผู้ใช้ กรุณาเข้าสู่ระบบใหม่อีกครั้ง")
          setLoading(false)
          return
        }
        // Get paginated data
        const { data, error, count } = await supabaseApi.getLearningHistory(user.id, page, PAGE_SIZE)

        if (error) {
          throw error
        }

        if (isMounted) {
          setHistory(data ?? [])
          setTotal(count ?? 0)
        }
      } catch (err: any) {
        setError(err.message || "เกิดข้อผิดพลาดในการโหลดข้อมูล")
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }
    fetchHistory()
    return () => {
      isMounted = false
    }
  }, [page])

  // Filtering
  const filteredHistory = history.filter((item) => {
    const matchesSearch = item.lesson_title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === "all" || item.category === filterCategory
    return matchesSearch && matchesCategory
  })

  // Sorting
  const sortedHistory = [...filteredHistory].sort((a, b) => {
    if (sortBy === "score") return (b.comprehension_score || 0) - (a.comprehension_score || 0)
    if (sortBy === "title") return a.lesson_title.localeCompare(b.lesson_title)
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  })

  // Stats
  const averageScore =
    sortedHistory.length > 0
      ? Math.round(sortedHistory.reduce((sum, item) => sum + (item.comprehension_score || 0), 0) / sortedHistory.length)
      : 0
  const totalTimeSpent = sortedHistory.reduce((sum, item) => sum + (parseInt(item.time_spent || "0") || 0), 0)
  const totalLessons = total

  // Pagination controls
  const totalPages = Math.ceil(total / PAGE_SIZE)

  return (
    <div className="min-h-screen pt-32 pb-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-black to-gray-800 bg-clip-text text-transparent">
            ประวัติการเรียนรู้
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            ติดตามความก้าวหน้าและทบทวนการเดินทางการเรียนรู้ของคุณด้วยการวิเคราะห์ที่ละเอียด
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">คะแนนเฉลี่ย</p>
                  <p className="text-3xl font-bold text-black dark:text-white">{averageScore}%</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-black to-gray-800 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">บทเรียนทั้งหมด</p>
                  <p className="text-3xl font-bold text-black dark:text-white">{totalLessons}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-gray-800 to-black rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">เวลาที่ใช้</p>
                  <p className="text-3xl font-bold text-black dark:text-white">{totalTimeSpent} นาที</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-black to-gray-700 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="glass-card mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              กรองและค้นหา
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="ค้นหาบทเรียน..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 glass border-0"
                  />
                </div>
              </div>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-full md:w-48 glass border-0">
                  <SelectValue placeholder="หมวดหมู่" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">ทุกหมวดหมู่</SelectItem>
                  <SelectItem value="AI/ML">AI/ML</SelectItem>
                  <SelectItem value="การพัฒนาเว็บ">การพัฒนาเว็บ</SelectItem>
                  <SelectItem value="ฐานข้อมูล">ฐานข้อมูล</SelectItem>
                  <SelectItem value="การเขียนโปรแกรม">การเขียนโปรแกรม</SelectItem>
                  <SelectItem value="ความปลอดภัย">ความปลอดภัย</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full md:w-48 glass border-0">
                  <SelectValue placeholder="เรียงตาม" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">วันที่</SelectItem>
                  <SelectItem value="score">คะแนน</SelectItem>
                  <SelectItem value="title">ชื่อเรื่อง</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Loading/Error State */}
        {loading && (
          <div className="text-center py-12 text-gray-500">กำลังโหลด...</div>
        )}
        {error && (
          <div className="text-center py-12 text-red-500">{error}</div>
        )}

        {/* Learning History List */}
        {!loading && !error && (
          <>
            <div className="space-y-4">
              {sortedHistory.map((item) => (
                <Card key={item.id} className="glass-card hover:scale-[1.02] transition-transform duration-300">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-black to-gray-800 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Brain className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold mb-1">{item.lesson_title}</h3>
                            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                <span>{item.created_at?.slice(0, 10)}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                <span>{item.time_spent || "-"}</span>
                              </div>
                              <Badge variant="outline" className="glass">
                                {item.category || "-"}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className={`text-2xl font-bold ${getScoreColor(item.comprehension_score || 0)}`}>{item.comprehension_score || 0}%</p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">คะแนนความเข้าใจ</p>
                        </div>
                        <Button variant="outline" className="glass-button">
                          ดูรายละเอียด
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination className="mt-8">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={e => {
                        e.preventDefault();
                        setPage(p => Math.max(1, p - 1))
                      }}
                      aria-disabled={page === 1}
                    />
                  </PaginationItem>
                  {[...Array(totalPages)].map((_, i) => (
                    <PaginationItem key={i}>
                      <PaginationLink
                        href="#"
                        isActive={page === i + 1}
                        onClick={e => {
                          e.preventDefault();
                          setPage(i + 1)
                        }}
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={e => {
                        e.preventDefault();
                        setPage(p => Math.min(totalPages, p + 1))
                      }}
                      aria-disabled={page === totalPages}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </>
        )}

        {!loading && !error && sortedHistory.length === 0 && (
          <Card className="glass-card">
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-gray-400 to-gray-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">ไม่พบบทเรียน</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                ไม่มีบทเรียนที่ตรงกับเกณฑ์การค้นหาของคุณ
              </p>
              <Button className="glass-button" asChild>
                <a href="/upload">อัปโหลดบทเรียนใหม่</a>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
