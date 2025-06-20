// ไฟล์นี้ประกอบด้วยคลาสและฟังก์ชันสำหรับวิเคราะห์ความเข้าใจของผู้เรียนด้วย AI
// รองรับทั้งโหมด mock (จำลอง), local API, Anthropic, Gemini และ OpenAI (บางส่วน)
// มีการประเมินความเข้าใจ, ตรวจสอบความรู้, และให้ฟีดแบ็คเชิงลึก

import { GoogleGenerativeAI } from "@google/generative-ai"

// ผลลัพธ์การวิเคราะห์ความเข้าใจของ AI
export interface AIAnalysisResult {
  comprehensionScore: number // คะแนนความเข้าใจ (0-100)
  isCorrect: boolean // ถูกต้องหรือไม่
  factualAccuracy: number // ความถูกต้องของข้อเท็จจริง (0-100)
  feedback: string // ข้อเสนอแนะ (ภาษาไทย)
  strengths: string[] // จุดแข็ง (ภาษาไทย)
  areasForImprovement: string[] // จุดที่ควรปรับปรุง (ภาษาไทย)
  suggestions: string[] // ข้อเสนอแนะเพิ่มเติม (ภาษาไทย)
  detailedExplanation: string // คำอธิบายเชิงลึก (ภาษาไทย)
  keyConcepts: string[] // แนวคิดสำคัญ
  misconceptions: string[] // ความเข้าใจผิด (ภาษาไทย)
  confidenceLevel: 'high' | 'medium' | 'low' // ระดับความมั่นใจ
  rawGeminiResponse?: string // ข้อมูลดิบที่ Gemini ส่งกลับ (debug)
}

// โครงสร้างเนื้อหาบทเรียน
export interface LessonContent {
  title: string // ชื่อบทเรียน
  content: string // เนื้อหาหลัก
  sections: Array<{
    title: string // ชื่อหัวข้อย่อย
    content: string // เนื้อหาหัวข้อย่อย
  }>
  summary: string // สรุปเนื้อหา
}

// การตั้งค่าผู้ให้บริการ AI
export interface AIProvider {
  name: 'gemini' // ชื่อผู้ให้บริการ
  apiKey?: string // คีย์ API
  model?: string // ชื่อโมเดล
  temperature?: number // ค่า temperature
  maxTokens?: number // จำนวน token สูงสุด
}

// ผลลัพธ์การตรวจสอบความรู้
export interface KnowledgeValidationResult {
  overallAccuracy: number // ความถูกต้องโดยรวม (0-100)
  questionResults: Array<{
    question: string // คำถาม
    userAnswer: string // คำตอบของผู้ใช้
    isCorrect: boolean // ถูกต้องหรือไม่
    correctAnswer: string // คำตอบที่ถูกต้อง
    explanation: string // คำอธิบาย (ภาษาไทย)
  }>
  confidence: number // ระดับความมั่นใจ (0-100)
}

// คลาสหลักสำหรับวิเคราะห์และตรวจสอบความเข้าใจของผู้เรียนด้วย AI
export class AIAnalyzer {
  private static aiProvider: AIProvider = {
    name: 'gemini', // ใช้ Gemini เป็นค่าเริ่มต้นเท่านั้น
    model: 'gemini-2.5-flash'
  }

  // กำหนดค่าผู้ให้บริการ AI (รองรับเฉพาะ Gemini)
  static configureAI(provider: AIProvider) {
    if (provider.name !== 'gemini') {
      throw new Error('ขณะนี้ระบบรองรับเฉพาะ Gemini AI เท่านั้น')
    }
    this.aiProvider = {
      ...provider,
      model: provider.model || 'gemini-2.5-flash'
    }
  }

  // วิเคราะห์ความเข้าใจของผู้เรียน (ใช้ Gemini เท่านั้น)
  static async analyzeUnderstanding(
    lessonContent: LessonContent,
    userUnderstanding: string
  ): Promise<AIAnalysisResult> {
    if (!this.aiProvider.apiKey) {
      throw new Error('Gemini API key not configured')
    }
    return await this.analyzeWithGemini(lessonContent, userUnderstanding)
  }

  // ตรวจสอบความรู้ของผู้เรียน (ใช้ Gemini เท่านั้น)
  static async validateKnowledge(
    lessonContent: LessonContent,
    userUnderstanding: string,
    specificQuestions?: string[]
  ): Promise<KnowledgeValidationResult> {
    if (!this.aiProvider.apiKey) {
      throw new Error('Gemini API key not configured')
    }
    const prompt = this.buildValidationPrompt(lessonContent, userUnderstanding, specificQuestions)
    const aiResponse = await this.getAIResponse(prompt)
    return this.parseValidationResponse(aiResponse)
  }

  // วิเคราะห์ด้วย Gemini (Google Generative AI)
  private static async analyzeWithGemini(
    lessonContent: LessonContent,
    userUnderstanding: string
  ): Promise<AIAnalysisResult> {
    const genAI = new GoogleGenerativeAI(this.aiProvider.apiKey!)
    const modelName = this.aiProvider.model || 'gemini-2.5-flash'
    const model = genAI.getGenerativeModel({ model: modelName })
    const prompt = this.buildAnalysisPrompt(lessonContent, userUnderstanding)
    const response = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }]
        }
      ],
      generationConfig: {
        temperature: this.aiProvider.temperature || 0.3,
        maxOutputTokens: this.aiProvider.maxTokens || 2000,
      }
    })
    // Gemini SDK returns result as { response: { candidates: [ { content: { parts: [ { text }] } } ] } }
    const aiResponse = response.response?.candidates?.[0]?.content?.parts?.[0]?.text || ''
    const parsed = this.parseAIResponse(aiResponse, lessonContent, userUnderstanding)
    return {
      ...parsed,
      rawGeminiResponse: aiResponse
    }
  }

  // สร้าง prompt สำหรับวิเคราะห์ความเข้าใจ
  private static buildAnalysisPrompt(lessonContent: LessonContent, userUnderstanding: string): string {
    return `You are an expert educational AI that analyzes student understanding. Please analyze the following student's understanding of the lesson content.

LESSON TITLE: ${lessonContent.title}
LESSON CONTENT: ${lessonContent.content}
LESSON SUMMARY: ${lessonContent.summary}

STUDENT'S UNDERSTANDING: ${userUnderstanding}

Please provide a comprehensive analysis in the following JSON format (respond ONLY with valid JSON, do not include any explanation, markdown, or text outside the JSON):
{
  "comprehensionScore": number (0-100),
  "factualAccuracy": number (0-100),
  "isCorrect": boolean,
  "feedback": "string (in Thai language)",
  "strengths": ["string array (in Thai)"],
  "areasForImprovement": ["string array (in Thai)"],
  "suggestions": ["string array (in Thai)"],
  "detailedExplanation": "string (in Thai)",
  "keyConcepts": ["string array"],
  "misconceptions": ["string array (in Thai)"],
  "confidenceLevel": "high|medium|low"
}

Return only JSON. Do not add any other text.`
  }

  // สร้าง prompt สำหรับตรวจสอบความรู้
  private static buildValidationPrompt(
    lessonContent: LessonContent,
    userUnderstanding: string,
    specificQuestions?: string[]
  ): string {
    const questions = specificQuestions || [
      'What are the main concepts covered in this lesson?',
      'What are the key definitions or terms?',
      'What are the main processes or methods described?',
      'What are the important relationships between concepts?'
    ]

    return `You are an expert educational validator. Please validate the student's knowledge of the following lesson.

LESSON: ${lessonContent.title}
CONTENT: ${lessonContent.content}

STUDENT'S UNDERSTANDING: ${userUnderstanding}

Please validate the student's knowledge by answering these questions:
${questions.map((q, i) => `${i + 1}. ${q}`).join('\n')}

Respond in JSON format ONLY (respond ONLY with valid JSON, do not include any explanation, markdown, or text outside the JSON):
{
  "overallAccuracy": number (0-100),
  "questionResults": [
    {
      "question": "string",
      "userAnswer": "extracted from student understanding",
      "isCorrect": boolean,
      "correctAnswer": "string",
      "explanation": "string (in Thai)"
    }
  ],
  "confidence": number (0-100)
}

Return only JSON. Do not add any other text.`
  }

  // เรียกใช้งาน AI provider เพื่อขอผลลัพธ์ (ใช้กับ validateKnowledge)
  private static async getAIResponse(prompt: string): Promise<string> {
    const provider = this.aiProvider
    if (!provider.apiKey) {
      throw new Error('Gemini API key not configured')
    }
    const genAI = new GoogleGenerativeAI(provider.apiKey)
    const modelName = provider.model || 'gemini-2.5-flash'
    const model = genAI.getGenerativeModel({ model: modelName })
    const response = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }]
        }
      ],
      generationConfig: {
        temperature: provider.temperature || 0.3,
        maxOutputTokens: provider.maxTokens || 2000,
      }
    })
    // Gemini SDK returns result as { response: { candidates: [ { content: { parts: [ { text }] } } ] } }
    return response.response?.candidates?.[0]?.content?.parts?.[0]?.text || ''
  }

  // แปลงผลลัพธ์จาก AI เป็น AIAnalysisResult
  private static parseAIResponse(aiResponse: string, lessonContent: LessonContent, userUnderstanding: string): AIAnalysisResult {
    try {
      // Clean the response to extract JSON
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error('No JSON found in AI response')
      }

      const parsed = JSON.parse(jsonMatch[0])
      
      return {
        comprehensionScore: parsed.comprehensionScore || 0,
        isCorrect: parsed.isCorrect || false,
        factualAccuracy: parsed.factualAccuracy || parsed.comprehensionScore || 0,
        feedback: parsed.feedback || 'ไม่สามารถวิเคราะห์ได้',
        strengths: parsed.strengths || [],
        areasForImprovement: parsed.areasForImprovement || [],
        suggestions: parsed.suggestions || [],
        detailedExplanation: parsed.detailedExplanation || '',
        keyConcepts: parsed.keyConcepts || this.extractKeyConcepts(lessonContent.content),
        misconceptions: parsed.misconceptions || [],
        confidenceLevel: parsed.confidenceLevel || 'medium'
      }
    } catch (error) {
      console.error('Failed to parse AI response:', error)
      // Fallback to mock analysis - return a basic result instead of calling async method
      return {
        comprehensionScore: 50,
        isCorrect: false,
        factualAccuracy: 50,
        feedback: 'เกิดข้อผิดพลาดในการวิเคราะห์ กรุณาลองใหม่อีกครั้ง',
        strengths: ['พยายามแสดงความเข้าใจแล้ว'],
        areasForImprovement: ['ควรลองเขียนความเข้าใจให้ละเอียดมากขึ้น'],
        suggestions: ['ลองอ่านเนื้อหาอีกครั้งและเขียนสิ่งที่เข้าใจ'],
        detailedExplanation: 'ไม่สามารถวิเคราะห์ได้เนื่องจากข้อผิดพลาดทางเทคนิค',
        keyConcepts: this.extractKeyConcepts(lessonContent.content),
        misconceptions: [],
        confidenceLevel: 'low'
      }
    }
  }

  // แปลงผลลัพธ์จาก AI เป็น KnowledgeValidationResult
  private static parseValidationResponse(aiResponse: string): KnowledgeValidationResult {
    try {
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error('No JSON found in validation response')
      }
      return JSON.parse(jsonMatch[0])
    } catch (error) {
      console.error('Failed to parse validation response:', error)
      throw error
    }
  }

  // จำลองการตรวจสอบความรู้ (mock)
  private static simulateKnowledgeValidation(
    lessonContent: LessonContent,
    userUnderstanding: string,
    specificQuestions?: string[]
  ): Promise<KnowledgeValidationResult> {
    // Simulate processing time
    return new Promise(resolve => {
      setTimeout(() => {
        const questions = specificQuestions || [
          'What are the main concepts?',
          'What are the key terms?',
          'What are the main processes?'
        ]

        const questionResults = questions.map((question, index) => ({
          question,
          userAnswer: `Answer ${index + 1} from student understanding`,
          isCorrect: Math.random() > 0.3,
          correctAnswer: `Correct answer for question ${index + 1}`,
          explanation: `Explanation for question ${index + 1}`
        }))

        const correctAnswers = questionResults.filter(r => r.isCorrect).length
        const overallAccuracy = Math.round((correctAnswers / questionResults.length) * 100)

        resolve({
          overallAccuracy,
          questionResults,
          confidence: Math.round(Math.random() * 40 + 60) // 60-100%
        })
      }, 1500)
    })
  }

  // จำลองการวิเคราะห์ความเข้าใจ (mock)
  private static async simulateAIAnalysis(
    lessonContent: LessonContent,
    userUnderstanding: string
  ): Promise<AIAnalysisResult> {
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Extract key concepts from lesson content
    const keyConcepts = this.extractKeyConcepts(lessonContent.content)
    
    // Analyze user understanding against key concepts
    const analysis = this.analyzeAgainstKeyConcepts(keyConcepts, userUnderstanding)
    
    // Calculate comprehension score
    const comprehensionScore = this.calculateComprehensionScore(analysis)
    
    // Generate feedback
    const feedback = this.generateFeedback(analysis, comprehensionScore)
    
    return {
      comprehensionScore,
      isCorrect: comprehensionScore >= 70,
      factualAccuracy: comprehensionScore,
      feedback,
      strengths: analysis.strengths,
      areasForImprovement: analysis.areasForImprovement,
      suggestions: analysis.suggestions,
      detailedExplanation: this.generateDetailedExplanation(lessonContent, userUnderstanding, analysis),
      keyConcepts,
      misconceptions: [],
      confidenceLevel: 'medium'
    }
  }

  // ดึงแนวคิดสำคัญจากเนื้อหา (แบบง่าย)
  private static extractKeyConcepts(content: string): string[] {
    // Simple key concept extraction
    // In production, use NLP or AI to extract concepts
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 10)
    const concepts: string[] = []
    
    // Extract potential key concepts (simplified approach)
    const conceptPatterns = [
      /(\w+(?:\s+\w+){0,3})\s+(?:is|are|refers to|means|defined as)/gi,
      /(?:the|a|an)\s+(\w+(?:\s+\w+){0,3})\s+(?:process|method|technique|approach|system)/gi,
      /(\w+(?:\s+\w+){0,3})\s+(?:consists of|includes|contains|involves)/gi
    ]
    
    sentences.forEach(sentence => {
      conceptPatterns.forEach(pattern => {
        const matches = sentence.match(pattern)
        if (matches) {
          concepts.push(...matches.slice(1).map(m => m.trim().toLowerCase()))
        }
      })
    })
    
    // Remove duplicates and filter out common words
    const commonWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by']
    return [...new Set(concepts)].filter(concept => 
      concept.length > 2 && !commonWords.includes(concept)
    ).slice(0, 10) // Limit to top 10 concepts
  }

  // วิเคราะห์ความเข้าใจของผู้เรียนเทียบกับแนวคิดสำคัญ
  private static analyzeAgainstKeyConcepts(keyConcepts: string[], userUnderstanding: string): {
    strengths: string[]
    areasForImprovement: string[]
    suggestions: string[]
    conceptMatches: number
  } {
    const userWords = userUnderstanding.toLowerCase().split(/\s+/)
    const strengths: string[] = []
    const areasForImprovement: string[] = []
    const suggestions: string[] = []
    
    let conceptMatches = 0
    
    keyConcepts.forEach(concept => {
      const conceptWords = concept.split(/\s+/)
      const isUnderstood = conceptWords.some(word => 
        userWords.some(userWord => userWord.includes(word) || word.includes(userWord))
      )
      
      if (isUnderstood) {
        conceptMatches++
        strengths.push(`เข้าใจแนวคิด "${concept}" ได้อย่างถูกต้อง`)
      } else {
        areasForImprovement.push(`ควรศึกษาเพิ่มเติมเกี่ยวกับ "${concept}"`)
        suggestions.push(`ลองค้นหาข้อมูลเพิ่มเติมเกี่ยวกับ "${concept}" และความสำคัญของมัน`)
      }
    })
    
    // Check for misconceptions
    const misconceptions = this.detectMisconceptions(userUnderstanding)
    misconceptions.forEach(misconception => {
      areasForImprovement.push(misconception)
    })
    
    // Add general suggestions
    if (conceptMatches < keyConcepts.length * 0.5) {
      suggestions.push('ลองอ่านเนื้อหาอีกครั้งและจดบันทึกแนวคิดหลัก')
      suggestions.push('สร้างแผนผังความคิดเพื่อเชื่อมโยงแนวคิดต่างๆ')
    }
    
    return {
      strengths,
      areasForImprovement,
      suggestions,
      conceptMatches
    }
  }

  // ตรวจจับความเข้าใจผิดจากข้อความของผู้เรียน
  private static detectMisconceptions(userUnderstanding: string): string[] {
    const misconceptions: string[] = []
    
    // Simple misconception detection patterns
    const misconceptionPatterns = [
      {
        pattern: /(?:ไม่|ไม่ใช่|ผิด|ไม่ถูกต้อง)/,
        message: 'ตรวจสอบข้อความที่แสดงความไม่แน่ใจหรือความเข้าใจผิด'
      },
      {
        pattern: /(?:อาจจะ|น่าจะ|คงจะ|ไม่แน่ใจ)/,
        message: 'ลองหาข้อมูลเพิ่มเติมเพื่อยืนยันความเข้าใจ'
      }
    ]
    
    misconceptionPatterns.forEach(({ pattern, message }) => {
      if (pattern.test(userUnderstanding)) {
        misconceptions.push(message)
      }
    })
    
    return misconceptions
  }

  // คำนวณคะแนนความเข้าใจ
  private static calculateComprehensionScore(analysis: {
    conceptMatches: number
    strengths: string[]
    areasForImprovement: string[]
  }): number {
    const { conceptMatches, strengths, areasForImprovement } = analysis
    
    // Base score from concept matches (assuming we have key concepts)
    let score = Math.min(100, (conceptMatches / 5) * 100) // Normalize to 5 concepts
    
    // Adjust based on strengths and areas for improvement
    const strengthBonus = Math.min(20, strengths.length * 5)
    const improvementPenalty = Math.min(30, areasForImprovement.length * 5)
    
    score = Math.max(0, Math.min(100, score + strengthBonus - improvementPenalty))
    
    return Math.round(score)
  }

  // สร้างข้อความ feedback (ภาษาไทย)
  private static generateFeedback(
    analysis: {
      strengths: string[]
      areasForImprovement: string[]
      suggestions: string[]
    },
    score: number
  ): string {
    const { strengths, areasForImprovement } = analysis
    
    if (score >= 90) {
      return 'ยอดเยี่ยม! คุณมีความเข้าใจที่ลึกซึ้งในเนื้อหานี้'
    } else if (score >= 80) {
      return 'ดีมาก! คุณเข้าใจเนื้อหาส่วนใหญ่แล้ว แต่ยังมีพื้นที่ที่สามารถปรับปรุงได้'
    } else if (score >= 70) {
      return 'ดี! คุณมีความเข้าใจพื้นฐานที่ดี แต่ควรศึกษาเพิ่มเติมในบางส่วน'
    } else if (score >= 50) {
      return 'คุณมีความเข้าใจบางส่วนแล้ว แต่ยังต้องศึกษาเพิ่มเติมมาก'
    } else {
      return 'แนะนำให้อ่านเนื้อหาอีกครั้งและจดบันทึกแนวคิดหลัก'
    }
  }

  // สร้างคำอธิบายเชิงลึก (ภาษาไทย)
  private static generateDetailedExplanation(
    lessonContent: LessonContent,
    userUnderstanding: string,
    analysis: {
      strengths: string[]
      areasForImprovement: string[]
      conceptMatches: number
    }
  ): string {
    const { conceptMatches } = analysis
    const totalConcepts = this.extractKeyConcepts(lessonContent.content).length
    
    return `จากการวิเคราะห์ความเข้าใจของคุณ พบว่าคุณเข้าใจแนวคิดหลัก ${conceptMatches} จาก ${totalConcepts} แนวคิด

เนื้อหาหลักของบทเรียนนี้เกี่ยวกับ: ${lessonContent.summary}

ความเข้าใจของคุณ: "${userUnderstanding}"

คำแนะนำ: ${analysis.areasForImprovement.length > 0 
  ? `ควรศึกษาเพิ่มเติมใน ${analysis.areasForImprovement.length} หัวข้อ` 
  : 'ความเข้าใจของคุณครอบคลุมเนื้อหาหลักแล้ว'}`
  }
} 