// API functions for connecting to FastAPI backend

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export interface UploadResponse {
  success: boolean
  message: string
  file_id: string
  content: string
}

export interface AnalysisRequest {
  lesson_content: string
  user_understanding: string
}

export interface AnalysisResponse {
  success: boolean
  comprehension_score: number
  strengths: string[]
  improvements: string[]
  suggestions: string[]
  detailed_feedback: string
}

export const api = {
  // File upload endpoint
  async uploadFile(file: File): Promise<UploadResponse> {
    const formData = new FormData()
    formData.append("file", file)

    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      throw new Error("Failed to upload file")
    }

    return response.json()
  },

  // AI analysis endpoint
  async analyzeUnderstanding(data: AnalysisRequest): Promise<AnalysisResponse> {
    const response = await fetch(`${API_BASE_URL}/analyze`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error("Failed to analyze understanding")
    }

    return response.json()
  },

  // Health check endpoint
  async healthCheck(): Promise<{ status: string }> {
    const response = await fetch(`${API_BASE_URL}/health`)

    if (!response.ok) {
      throw new Error("API health check failed")
    }

    return response.json()
  },
}

// Example usage in components:
/*
// In upload component:
const handleUpload = async (file: File) => {
  try {
    const result = await api.uploadFile(file)
    console.log('Upload successful:', result)
  } catch (error) {
    console.error('Upload failed:', error)
  }
}

// In learning component:
const handleAnalysis = async (lessonContent: string, understanding: string) => {
  try {
    const result = await api.analyzeUnderstanding({
      lesson_content: lessonContent,
      user_understanding: understanding
    })
    console.log('Analysis result:', result)
  } catch (error) {
    console.error('Analysis failed:', error)
  }
}
*/
