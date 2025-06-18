"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, FileText, CheckCircle, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const { toast } = useToast()

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile) {
      const allowedTypes = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "text/plain",
      ]
      if (allowedTypes.includes(selectedFile.type)) {
        setFile(selectedFile)
        setUploadSuccess(false)
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF, DOCX, or TXT file.",
          variant: "destructive",
        })
      }
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setUploading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Mock successful upload
      setUploadSuccess(true)
      toast({
        title: "File uploaded successfully!",
        description: "Your lesson has been processed and is ready for learning.",
      })
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "There was an error uploading your file. Please try again.",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Upload Your Lesson
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Upload your study materials and let our AI help you learn more effectively.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Upload File
              </CardTitle>
              <CardDescription>Supported formats: PDF, DOCX, TXT (Max 10MB)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center hover:border-blue-400 transition-colors">
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  accept=".pdf,.docx,.txt"
                  onChange={handleFileChange}
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Upload className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-lg font-medium mb-2">Click to upload or drag and drop</p>
                  <p className="text-gray-500 dark:text-gray-400">PDF, DOCX, or TXT files</p>
                </label>
              </div>

              {file && (
                <div className="glass rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <FileText className="w-8 h-8 text-blue-500" />
                    <div className="flex-1">
                      <p className="font-medium">{file.name}</p>
                      <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
                    </div>
                    {uploadSuccess && <CheckCircle className="w-6 h-6 text-green-500" />}
                  </div>
                </div>
              )}

              <Button
                onClick={handleUpload}
                disabled={!file || uploading || uploadSuccess}
                className="w-full glass-button"
                size="lg"
              >
                {uploading ? "Uploading..." : uploadSuccess ? "Uploaded Successfully" : "Upload File"}
              </Button>

              {uploadSuccess && (
                <div className="glass rounded-xl p-4 bg-green-50/50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                  <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">File processed successfully!</span>
                  </div>
                  <p className="text-sm text-green-600 dark:text-green-300 mt-1">
                    Your lesson is ready. You can now proceed to share your understanding.
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
                Upload Guidelines
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400">1</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Choose Quality Content</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Upload well-structured lessons with clear concepts for better AI analysis.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400">2</span>
                  </div>
                  <div>
                    <h4 className="font-medium">File Size Limit</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Keep files under 10MB for optimal processing speed and performance.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400">3</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Supported Formats</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      PDF, DOCX, and TXT files are supported with automatic content extraction.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400">4</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Privacy & Security</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Your files are encrypted and processed securely. We never share your content.
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
