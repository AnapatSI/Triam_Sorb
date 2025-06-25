"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, FileText, CheckCircle, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { FileParser, type ParsedContent } from "@/lib/file-parser"

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [parsedContent, setParsedContent] = useState<ParsedContent | null>(null)
  const { toast } = useToast()

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
        <div className="text-center mb-12 mt-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-black to-gray-800 dark:from-white dark:to-gray-200 bg-clip-text text-transparent">
            อัปโหลดบทเรียนของคุณ
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-1xl mx-auto">
            อัปโหลดเนื้อหาการศึกษาของคุณและให้ AI ของเราช่วยให้คุณเรียนรู้ได้อย่างมีประสิทธิภาพมากขึ้น
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                อัปโหลดไฟล์
              </CardTitle>
              <CardDescription>รูปแบบที่รองรับ: TXT เท่านั้น (สูงสุด 10MB)</CardDescription>
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
                  <p className="text-lg font-medium mb-2">คลิกเพื่ออัปโหลดหรือลากและวาง</p>
                  <p className="text-gray-500 dark:text-gray-400">ไฟล์ TXT เท่านั้น</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    * กรุณาแปลงไฟล์ PDF หรือ DOCX เป็น TXT ก่อนอัปโหลด
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
                  <h4 className="font-medium text-blue-700 dark:text-blue-400 mb-2">ข้อมูลไฟล์ที่ประมวลผลแล้ว</h4>
                  <div className="space-y-1 text-sm text-blue-600 dark:text-blue-300">
                    <p>• ชื่อ: {parsedContent.title}</p>
                    <p>• จำนวนคำ: {parsedContent.wordCount.toLocaleString()} คำ</p>
                    <p>• เวลาอ่านโดยประมาณ: {parsedContent.estimatedReadTime} นาที</p>
                    <p>• จำนวนส่วน: {parsedContent.sections.length} ส่วน</p>
                  </div>
                </div>
              )}

              <Button
                onClick={handleUpload}
                disabled={!file || uploading || uploadSuccess}
                className="w-full glass-button"
                size="lg"
              >
                {uploading ? "กำลังประมวลผล..." : uploadSuccess ? "อัปโหลดสำเร็จแล้ว" : "อัปโหลดและประมวลผลไฟล์"}
              </Button>

              {uploadSuccess && (
                <div className="glass rounded-xl p-4 bg-green-50/50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                  <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">ประมวลผลไฟล์สำเร็จ!</span>
                  </div>
                  <p className="text-sm text-green-600 dark:text-green-300 mt-1">
                    บทเรียนของคุณพร้อมแล้ว คุณสามารถดำเนินการเพื่อแชร์ความเข้าใจของคุณได้
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
                แนวทางการอัปโหลด
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-black dark:bg-white rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-white dark:text-black">1</span>
                  </div>
                  <div>
                    <h4 className="font-medium">เลือกเนื้อหาที่มีคุณภาพ</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      อัปโหลดบทเรียนที่มีโครงสร้างที่ดีพร้อมแนวคิดที่ชัดเจนเพื่อการวิเคราะห์ AI ที่ดีขึ้น
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-black dark:bg-white rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-white dark:text-black">2</span>
                  </div>
                  <div>
                    <h4 className="font-medium">ขีดจำกัดขนาดไฟล์</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      เก็บไฟล์ไว้ต่ำกว่า 10MB เพื่อความเร็วในการประมวลผลและประสิทธิภาพที่ดีที่สุด
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-black dark:bg-white rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-white dark:text-black">3</span>
                  </div>
                  <div>
                    <h4 className="font-medium">รูปแบบที่รองรับ</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      ขณะนี้รองรับเฉพาะไฟล์ TXT เท่านั้น กรุณาแปลงไฟล์ PDF หรือ DOCX เป็น TXT ก่อนอัปโหลด
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-black dark:bg-white rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-white dark:text-black">4</span>
                  </div>
                  <div>
                    <h4 className="font-medium">ความเป็นส่วนตัวและความปลอดภัย</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      ไฟล์ของคุณถูกเข้ารหัสและประมวลผลอย่างปลอดภัย เราไม่เคยแชร์เนื้อหาของคุณ
                    </p>
                  </div>
                </div>
              </div>

              {uploadSuccess && (
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <Button className="w-full glass-button" asChild>
                    <a href="/learn">Continue to Learning</a>
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
