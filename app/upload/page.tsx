"use client"

import type React from "react"

import { useState } from "react"
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, FileText, CheckCircle, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { FileParser, type ParsedContent } from "@/lib/file-parser"
import { useLanguage } from '@/components/LanguageProvider'
import { useRouter } from "next/navigation"

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [parsedContent, setParsedContent] = useState<ParsedContent | null>(null)
  const { toast } = useToast()
  const { language } = useLanguage()
  const t = useTranslation()
  const router = useRouter();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile) {
      const allowedTypes = [
        "text/plain",
      ]
      if (allowedTypes.includes(selectedFile.type)) {
        setFile(selectedFile)
        setUploadSuccess(false)
        setParsedContent(null)
      } else {
        toast({
          title: "ประเภทไฟล์ไม่ถูกต้อง",
          description: "กรุณาอัปโหลดไฟล์ TXT เท่านั้น",
          variant: "destructive",
        })
      }
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setUploading(true)
    try {
      // Parse the file using FileParser
      const parsed = await FileParser.parseFile(file)
      setParsedContent(parsed)

      // Store parsed content in localStorage for the learn page
      localStorage.setItem('currentLesson', JSON.stringify({
        ...parsed,
        uploadedAt: new Date().toISOString(),
        fileName: file.name
      }))

      // Simulate additional processing time
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock successful upload
      setUploadSuccess(true)
      toast({
        title: "อัปโหลดไฟล์สำเร็จ!",
        description: `บทเรียน "${parsed.title}" ได้รับการประมวลผลแล้ว (${parsed.wordCount} คำ, ประมาณ ${parsed.estimatedReadTime} นาทีในการอ่าน)`,
      })
      // Redirect to learn page for user to fill their understanding
      router.push("/learn")
      return;
    } catch (error) {
      console.error('Upload error:', error)
      const errorMessage = error instanceof Error ? error.message : "เกิดข้อผิดพลาดในการอัปโหลดไฟล์ของคุณ กรุณาลองใหม่อีกครั้ง"
      
      toast({
        title: "การอัปโหลดล้มเหลว",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 ไบต์"
    const k = 1024
    const sizes = ["ไบต์", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-4xl md:text-5xl font-bold pb-3 mb-2 bg-gradient-to-r from-black to-gray-800 dark:from-white dark:to-gray-200 bg-clip-text text-transparent">
            {t.upload.title}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {t.upload.description}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                {t.upload.uploadFile}
              </CardTitle>
              <CardDescription>{t.upload.supportedFormats}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center hover:border-black dark:hover:border-white transition-colors">
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  accept=".txt"
                  onChange={handleFileChange}
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <div className="w-16 h-16 bg-gradient-to-br from-black to-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Upload className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-lg font-medium mb-2">{t.upload.clickToUpload}</p>
                  <p className="text-gray-500 dark:text-gray-400">{t.upload.onlyTxt}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    {t.upload.convertNote}
                  </p>
                </label>
              </div>

              {file && (
                <div className="glass rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <FileText className="w-8 h-8 text-black dark:text-white" />
                    <div className="flex-1">
                      <p className="font-medium">{file.name}</p>
                      <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
                    </div>
                    {uploadSuccess && <CheckCircle className="w-6 h-6 text-green-500" />}
                  </div>
                </div>
              )}

              {parsedContent && (
                <div className="glass rounded-xl p-4 bg-blue-50/50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                  <h4 className="font-medium text-blue-700 dark:text-blue-400 mb-2">{t.upload.processedInfo}</h4>
                  <div className="space-y-1 text-sm text-blue-600 dark:text-blue-300">
                    <p>• {t.upload.fileName}: {parsedContent.title}</p>
                    <p>• {t.upload.wordCount}: {parsedContent.wordCount.toLocaleString()}</p>
                    <p>• {t.upload.estimatedReadTime}: {parsedContent.estimatedReadTime}</p>
                    <p>• {t.upload.sectionCount}: {parsedContent.sections.length}</p>
                  </div>
                </div>
              )}

              <Button
                onClick={handleUpload}
                disabled={!file || uploading || uploadSuccess}
                className="w-full glass-button"
                size="lg"
              >
                {uploading
                  ? t.upload.processing
                  : uploadSuccess
                  ? t.upload.uploadSuccess
                  : t.upload.uploadAndProcess}
              </Button>

              {uploadSuccess && (
                <div className="glass rounded-xl p-4 bg-green-50/50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                  <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">{t.upload.success}</span>
                  </div>
                  <p className="text-sm text-green-600 dark:text-green-300 mt-1">
                    {t.upload.readyToShare}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                {t.upload.qualityContent}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-black dark:bg-white rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-white dark:text-black">1</span>
                  </div>
                  <div>
                    <h4 className="font-medium">{t.upload.qualityContent}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {t.upload.qualityContentDesc}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-black dark:bg-white rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-white dark:text-black">2</span>
                  </div>
                  <div>
                    <h4 className="font-medium">{t.upload.fileSizeLimit}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {t.upload.fileSizeLimitDesc}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-black dark:bg-white rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-white dark:text-black">3</span>
                  </div>
                  <div>
                    <h4 className="font-medium">{t.upload.supportedFormat}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {t.upload.supportedFormatDesc}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-black dark:bg-white rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-white dark:text-black">4</span>
                  </div>
                  <div>
                    <h4 className="font-medium">{t.upload.privacy}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {t.upload.privacyDesc}
                    </p>
                  </div>
                </div>
              </div>

              {uploadSuccess && (
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <Button className="w-full glass-button" asChild>
                    <a href="/learn">{t.upload.continueToLearning}</a>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
