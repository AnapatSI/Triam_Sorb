"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Search, TrendingUp, FileText, Brain, Clock, Filter } from "lucide-react"

// Mock learning history data
const mockHistory = [
  {
    id: 1,
    title: "บทนำสู่การเรียนรู้ของเครื่อง",
    date: "2024-01-15",
    score: 85,
    status: "completed",
    timeSpent: "12 นาที",
    category: "AI/ML",
  },
  {
    id: 2,
    title: "React Hooks แบบเจาะลึก",
    date: "2024-01-14",
    score: 92,
    status: "completed",
    timeSpent: "18 นาที",
    category: "การพัฒนาเว็บ",
  },
  {
    id: 3,
    title: "การทำให้ฐานข้อมูลเป็นมาตรฐาน",
    date: "2024-01-13",
    score: 78,
    status: "completed",
    timeSpent: "15 นาที",
    category: "ฐานข้อมูล",
  },
  {
    id: 4,
    title: "โครงสร้างข้อมูล Python",
    date: "2024-01-12",
    score: 88,
    status: "completed",
    timeSpent: "20 นาที",
    category: "การเขียนโปรแกรม",
  },
  {
    id: 5,
    title: "พื้นฐานความปลอดภัยเครือข่าย",
    date: "2024-01-11",
    score: 76,
    status: "completed",
    timeSpent: "25 นาที",
    category: "ความปลอดภัย",
  },
]

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

  const filteredHistory = mockHistory.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === "all" || item.category === filterCategory
    return matchesSearch && matchesCategory
  })

  const averageScore = Math.round(mockHistory.reduce((sum, item) => sum + item.score, 0) / mockHistory.length)
  const totalTimeSpent = mockHistory.reduce((sum, item) => sum + Number.parseInt(item.timeSpent), 0)
  const totalLessons = mockHistory.length

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

        {/* Learning History List */}
        <div className="space-y-4">
          {filteredHistory.map((item) => (
            <Card key={item.id} className="glass-card hover:scale-[1.02] transition-transform duration-300">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-black to-gray-800 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Brain className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{item.date}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{item.timeSpent}</span>
                          </div>
                          <Badge variant="outline" className="glass">
                            {item.category}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className={`text-2xl font-bold ${getScoreColor(item.score)}`}>{item.score}%</p>
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

        {filteredHistory.length === 0 && (
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
