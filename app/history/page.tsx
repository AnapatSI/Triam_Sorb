"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Search, TrendingUp, FileText, Brain, Clock, Filter, X, Trash, AlertTriangle } from "lucide-react"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { supabaseApi } from "@/lib/supabase"
import { useAuth } from "@/components/AuthProvider"
import { useRouter } from "next/navigation"
import { useTranslation } from '@/hooks/useTranslation';
import { useLanguage } from '@/components/LanguageProvider';

// Beautiful Delete Confirmation Modal Component
interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  lessonTitle: string;
  t: any;
}

function DeleteModal({ isOpen, onClose, onConfirm, lessonTitle, t }: DeleteModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-6 mx-4 max-w-md w-full animate-in fade-in-0 zoom-in-95 duration-200">
        {/* Icon */}
        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
        </div>
        
        {/* Content */}
        <div className="text-center mb-6">
          <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
            {t.history.confirmDelete || "ยืนยันการลบ"}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-2">
            {t.history.deleteConfirmMessage}
          </p>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 mt-3">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
              "{lessonTitle}"
            </p>
          </div>
          <p className="text-sm text-red-600 dark:text-red-400 mt-2">
            {t.history.deleteWarning}
          </p>
        </div>
        
        {/* Actions */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800"
          >
            {t.history.cancel || "ยกเลิก"}
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white"
          >
            <Trash className="w-4 h-4 mr-2" />
            {t.history.delete || "ลบ"}
          </Button>
        </div>
      </div>
    </div>
  );
}

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

function formatMinutes(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

export default function HistoryPage() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [sortBy, setSortBy] = useState("date")
  const [history, setHistory] = useState<any[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const router = useRouter()
  const t = useTranslation();
  const { language } = useLanguage();
  const [subjectFilter, setSubjectFilter] = useState<string>('all');
  const [subjects, setSubjects] = useState<string[]>([]);
  
  // Delete modal state
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    itemId: string | null;
    lessonTitle: string;
  }>({
    isOpen: false,
    itemId: null,
    lessonTitle: ''
  });

  // Debounced search function
  const debouncedSearch = useCallback(
    (() => {
      let timeoutId: NodeJS.Timeout
      return (value: string) => {
        clearTimeout(timeoutId)
        timeoutId = setTimeout(() => {
          setSearchTerm(value)
          setPage(1) // Reset to first page when searching
        }, 300)
      }
    })(),
    []
  )

  // Fetch categories
  useEffect(() => {
    if (!user?.id) return
    
    async function fetchCategories() {
      const { data } = await supabaseApi.getCategories(user!.id)
      setCategories(data)
    }
    fetchCategories()
  }, [user])

  // Fetch history with filters
  useEffect(() => {
    if (!user?.id) return

    let isMounted = true
    async function fetchHistory() {
      setLoading(true)
      setError(null)
      try {
        const { data, error, count } = await supabaseApi.getLearningHistory(
          user!.id, 
          page, 
          PAGE_SIZE,
          {
            searchTerm: searchTerm || undefined,
            category: filterCategory !== "all" ? filterCategory : undefined,
            sortBy: sortBy as 'date' | 'score' | 'title'
          }
        )

        if (error) {
          throw error
        }

        if (isMounted) {
          setHistory(data ?? [])
          setTotal(count ?? 0)
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || "เกิดข้อผิดพลาดในการโหลดข้อมูล")
        }
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
  }, [user, page, searchTerm, filterCategory, sortBy])

  // Reset page when filters change
  useEffect(() => {
    setPage(1)
  }, [filterCategory, sortBy])

  // Stats calculation (only for displayed data)
  const averageScore =
    history.length > 0
      ? Math.round(history.reduce((sum, item) => sum + (item.comprehension_score || 0), 0) / history.length)
      : 0
  const totalTimeSpent = history.reduce((sum, item) => sum + (parseInt(item.time_spent || "0") || 0), 0)
  const totalLessons = total

  // Pagination controls
  const totalPages = Math.ceil(total / PAGE_SIZE)

  // Clear only subject filter
  const clearSubjectFilter = () => {
    setSubjectFilter('all');
  };

  // Clear only main filters (search, category, sort)
  const clearMainFilters = () => {
    setSearchTerm("");
    setFilterCategory("all");
    setSortBy("date");
    setPage(1);
  };

  // Clear only category filter
  const clearCategoryFilter = () => {
    setFilterCategory('all');
    setPage(1);
  };

  const hasActiveFilters = searchTerm || filterCategory !== "all" || sortBy !== "date"

  // Fetch unique subjects from history after fetching history
  useEffect(() => {
    if (history.length > 0) {
      const uniqueSubjects = Array.from(new Set(history.map(item => item.subject).filter(Boolean)));
      setSubjects(uniqueSubjects);
    }
  }, [history]);

  // Enhanced delete handler with beautiful modal
  const handleDeleteClick = (id: string, lessonTitle: string) => {
    setDeleteModal({
      isOpen: true,
      itemId: id,
      lessonTitle: lessonTitle
    });
  }

  const handleDeleteConfirm = async () => {
    if (!deleteModal.itemId) return;
    
    try {
      // Optimistic UI update
      setHistory(prev => prev.filter(item => item.id !== deleteModal.itemId));
      
      // Close modal
      setDeleteModal({ isOpen: false, itemId: null, lessonTitle: '' });
      
      // Delete from database
      await supabaseApi.deleteLearningHistory(deleteModal.itemId);
      
      // Update total count
      setTotal(prev => prev - 1);
      
    } catch (err) {
      // Revert optimistic update on error
      window.location.reload(); // Simple revert - you could implement more sophisticated error handling
      alert(t.history.deleteError || "ไม่สามารถลบประวัติรายการได้");
    }
  }

  const handleDeleteCancel = () => {
    setDeleteModal({ isOpen: false, itemId: null, lessonTitle: '' });
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 mt-12">
          <h1 className="text-4xl md:text-5xl font-bold pb-3 mb-6 bg-gradient-to-r from-black to-gray-800 dark:from-white dark:to-gray-200 bg-clip-text text-transparent">
            {t.history.title}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-1xl mx-auto">
            {t.history.description}
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{t.history.avgScore}</p>
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
                  <p className="text-sm text-gray-600 dark:text-gray-300">{t.history.totalLessons}</p>
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
                  <p className="text-sm text-gray-600 dark:text-gray-300">{t.history.totalTime}</p>
                  <p className="text-3xl font-bold text-black dark:text-white">
                    {formatMinutes(totalTimeSpent)}
                  </p>
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
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Filter className="w-5 h-5" />
                {t.history.filterAndSearch}
              </CardTitle>
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearMainFilters}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-4 h-4 mr-1" />
                  {t.history.clearFilters}
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder={t.history.searchPlaceholder}
                    defaultValue={searchTerm}
                    onChange={(e) => debouncedSearch(e.target.value)}
                    className="pl-10 glass border-0"
                  />
                </div>
              </div>
              {/* <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-full md:w-48 glass border-0">
                  <SelectValue placeholder={t.history.category} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t.history.allCategories}</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select> */}
              {filterCategory !== 'all' && (
                <Button variant="ghost" size="sm" onClick={clearCategoryFilter}>
                  {t.history.clearFilters || "Clear Category"}
                </Button>
              )}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full md:w-48 glass border-0">
                  <SelectValue placeholder={t.history.sortBy} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">{t.history.sortDate}</SelectItem>
                  <SelectItem value="score">{t.history.sortScore}</SelectItem>
                  <SelectItem value="title">{t.history.sortTitle}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Add subject filter dropdown above the history list */}
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          {/* <Select value={subjectFilter} onValueChange={setSubjectFilter}>
            <SelectTrigger className="w-full md:w-48 glass border-0">
              <SelectValue placeholder="Subject" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Subjects</SelectItem>
              {subjects.map((subject) => (
                <SelectItem key={subject} value={subject}>{subject}</SelectItem>
              ))}
            </SelectContent>
          </Select> */}
          {subjectFilter !== 'all' && (
            <Button variant="ghost" size="sm" onClick={clearSubjectFilter}>
              Clear Subject Filter
            </Button>
          )}
        </div>

        {/* Loading/Error State */}
        {loading && (
          <div className="text-center py-12 text-gray-500">{t.history.loading}</div>
        )}
        {error && (
          <div className="text-center py-12 text-red-500">{t.history.error}</div>
        )}

        {/* Learning History List */}
        {!loading && !error && (
          <>
            <div className="space-y-4">
              {history.filter(item => subjectFilter === 'all' || item.subject === subjectFilter).map((item) => (
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
                                <span>{new Date(item.created_at).toLocaleDateString(language === 'th' ? 'th-TH' : 'en-US')}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                <span>{item.time_spent || '-'}</span>
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
                          <p className="text-sm text-gray-600 dark:text-gray-300">{t.history.comprehensionScore}</p>
                        </div>
                        <Button 
                          variant="outline" 
                          className="glass-button"
                          onClick={() => router.push(`/history/${item.id}`)}
                        >
                          {t.history.viewDetail}
                        </Button>
                        <Button 
                          variant="destructive" 
                          className="glass-button hover:bg-red-600 transition-colors"
                          onClick={() => handleDeleteClick(item.id, item.lesson_title)}
                          title={t.history.delete || "ลบ"}
                        >
                          <Trash className="w-4 h-4" />
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

        {!loading && !error && history.length === 0 && (
          <Card className="glass-card">
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-gray-400 to-gray-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                {hasActiveFilters ? t.history.noLessonsWithFilters : t.history.noLessons}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {hasActiveFilters 
                  ? t.history.tryChangingFilters
                  : t.history.startLearning
                }
              </p>
              <div className="flex gap-2 justify-center">
                {hasActiveFilters && (
                  <Button variant="outline" className="glass-button" onClick={clearMainFilters}>
                    {t.history.clearFilters}
                  </Button>
                )}
                <Button className="glass-button" asChild>
                  <a href="/upload">{t.history.uploadNewLesson}</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Beautiful Delete Confirmation Modal */}
        <DeleteModal
          isOpen={deleteModal.isOpen}
          onClose={handleDeleteCancel}
          onConfirm={handleDeleteConfirm}
          lessonTitle={deleteModal.lessonTitle}
          t={t}
        />
      </div>
    </div>
  )
}