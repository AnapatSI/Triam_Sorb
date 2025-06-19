import { GoogleGenerativeAI } from "@google/generative-ai"

export interface AIAnalysisResult {
  comprehensionScore: number
  isCorrect: boolean
  factualAccuracy: number
  feedback: string
  strengths: string[]
  areasForImprovement: string[]
  suggestions: string[]
  detailedExplanation: string
  keyConcepts: string[]
  misconceptions: string[]
  confidenceLevel: 'high' | 'medium' | 'low'
}

export interface LessonContent {
  title: string
  content: string
  sections: Array<{
    title: string
    content: string
  }>
  summary: string
}

export interface AIProvider {
  name: 'anthropic' | 'local' | 'mock' | 'gemini'
  apiKey?: string
  model?: string
  temperature?: number
  maxTokens?: number
}

export interface KnowledgeValidationResult {
  overallAccuracy: number
  questionResults: Array<{
    question: string
    userAnswer: string
    isCorrect: boolean
    correctAnswer: string
    explanation: string
  }>
  confidence: number
}

export class AIAnalyzer {
  private static aiProvider: AIProvider = {
    name: 'mock', // Default to mock for development
    model: 'mock-model'
  }

  static configureAI(provider: AIProvider) {
    this.aiProvider = provider
  }

  static async analyzeUnderstanding(
    lessonContent: LessonContent,
    userUnderstanding: string
  ): Promise<AIAnalysisResult> {
    try {
      switch (this.aiProvider.name) {
        case 'gemini':
          return await this.analyzeWithGemini(lessonContent, userUnderstanding)
        case 'anthropic':
          return await this.analyzeWithAnthropic(lessonContent, userUnderstanding)
        case 'local':
          return await this.analyzeWithLocalAPI(lessonContent, userUnderstanding)
        case 'mock':
        default:
          return await this.simulateAIAnalysis(lessonContent, userUnderstanding)
      }
    } catch (error) {
      console.error('AI Analysis failed:', error)
      // Fallback to mock analysis if AI service fails
      return await this.simulateAIAnalysis(lessonContent, userUnderstanding)
    }
  }

  // Enhanced knowledge validation method
  static async validateKnowledge(
    lessonContent: LessonContent,
    userUnderstanding: string,
    specificQuestions?: string[]
  ): Promise<KnowledgeValidationResult> {
    try {
      if (this.aiProvider.name === 'mock') {
        return this.simulateKnowledgeValidation(lessonContent, userUnderstanding, specificQuestions)
      }

      const prompt = this.buildValidationPrompt(lessonContent, userUnderstanding, specificQuestions)
      const aiResponse = await this.getAIResponse(prompt)
      return this.parseValidationResponse(aiResponse)
    } catch (error) {
      console.error('Knowledge validation failed:', error)
      return this.simulateKnowledgeValidation(lessonContent, userUnderstanding, specificQuestions)
    }
  }

  private static async analyzeWithOpenAI(
    lessonContent: LessonContent,
    userUnderstanding: string
  ): Promise<AIAnalysisResult> {
    if (!this.aiProvider.apiKey) {
      throw new Error('OpenAI API key not configured')
    }

    const prompt = this.buildAnalysisPrompt(lessonContent, userUnderstanding)
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.aiProvider.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: this.aiProvider.model || 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are an expert educational AI that analyzes student understanding and provides detailed feedback. Respond in JSON format.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 2000
      })
    })

    if (!response.ok) {
      throw new Error('OpenAI API request failed')
    }

    const data = await response.json()
    const aiResponse = data.choices[0].message.content
    
    return this.parseAIResponse(aiResponse, lessonContent, userUnderstanding)
  }

  private static async analyzeWithAnthropic(
    lessonContent: LessonContent,
    userUnderstanding: string
  ): Promise<AIAnalysisResult> {
    if (!this.aiProvider.apiKey) {
      throw new Error('Anthropic API key not configured')
    }

    const prompt = this.buildAnalysisPrompt(lessonContent, userUnderstanding)
    
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.aiProvider.apiKey}`,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: this.aiProvider.model || 'claude-3-sonnet-20240229',
        max_tokens: 2000,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      })
    })

    if (!response.ok) {
      throw new Error('Anthropic API request failed')
    }

    const data = await response.json()
    const aiResponse = data.content[0].text
    
    return this.parseAIResponse(aiResponse, lessonContent, userUnderstanding)
  }

  private static async analyzeWithLocalAPI(
    lessonContent: LessonContent,
    userUnderstanding: string
  ): Promise<AIAnalysisResult> {
    // Use the existing API structure
    const { api } = await import('./api')
    
    const response = await api.analyzeUnderstanding({
      lesson_content: lessonContent.content,
      user_understanding: userUnderstanding
    })

    return {
      comprehensionScore: response.comprehension_score,
      isCorrect: response.comprehension_score >= 70,
      factualAccuracy: response.comprehension_score, // Map to factual accuracy
      feedback: response.detailed_feedback,
      strengths: response.strengths,
      areasForImprovement: response.improvements,
      suggestions: response.suggestions,
      detailedExplanation: response.detailed_feedback,
      keyConcepts: this.extractKeyConcepts(lessonContent.content),
      misconceptions: [],
      confidenceLevel: 'medium'
    }
  }

  private static async analyzeWithGemini(
    lessonContent: LessonContent,
    userUnderstanding: string
  ): Promise<AIAnalysisResult> {
    if (!this.aiProvider.apiKey) {
      throw new Error('Gemini API key not configured')
    }
    const genAI = new GoogleGenerativeAI(this.aiProvider.apiKey)
    const modelName = this.aiProvider.model || 'gemini-pro'
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
    return this.parseAIResponse(aiResponse, lessonContent, userUnderstanding)
  }

  private static buildAnalysisPrompt(lessonContent: LessonContent, userUnderstanding: string): string {
    return `You are an expert educational AI that analyzes student understanding. Please analyze the following student's understanding of the lesson content.

LESSON TITLE: ${lessonContent.title}
LESSON CONTENT: ${lessonContent.content}
LESSON SUMMARY: ${lessonContent.summary}

STUDENT'S UNDERSTANDING: ${userUnderstanding}

Please provide a comprehensive analysis in the following JSON format (respond ONLY with valid JSON):
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

Analysis guidelines:
1. Comprehension Score: How well the student understands the main concepts (0-100)
2. Factual Accuracy: How accurate the student's statements are (0-100)
3. Strengths: What the student understood correctly
4. Areas for Improvement: What concepts need more clarification
5. Suggestions: Specific actionable advice for improvement
6. Key Concepts: Important terms and ideas from the lesson
7. Misconceptions: Any incorrect understanding that needs correction
8. Feedback: Overall assessment in Thai language

Focus on being constructive and educational. If the student's understanding is limited, provide encouraging feedback with specific guidance.`
  }

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

Respond in JSON format (respond ONLY with valid JSON):
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
}`
  }

  private static async getAIResponse(prompt: string): Promise<string> {
    const provider = this.aiProvider
    
    switch (provider.name) {
      case 'gemini':
        const geminiResponse = await fetch('https://api.gemini.com/v1/messages', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${provider.apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: provider.model || 'gemini-pro',
            messages: [{ role: 'user', content: prompt }],
            max_tokens: provider.maxTokens || 2000,
            temperature: provider.temperature || 0.3
          })
        })
        
        if (!geminiResponse.ok) {
          const errorData = await geminiResponse.json()
          throw new Error(`Gemini API error: ${errorData.error?.message || geminiResponse.statusText}`)
        }
        
        const geminiData = await geminiResponse.json()
        return geminiData.content[0].text

      case 'anthropic':
        const anthropicResponse = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${provider.apiKey}`,
            'Content-Type': 'application/json',
            'anthropic-version': '2023-06-01'
          },
          body: JSON.stringify({
            model: provider.model || 'claude-3-sonnet-20240229',
            messages: [{ role: 'user', content: prompt }],
            max_tokens: provider.maxTokens || 2000,
            temperature: provider.temperature || 0.3
          })
        })
        
        if (!anthropicResponse.ok) {
          const errorData = await anthropicResponse.json()
          throw new Error(`Anthropic API error: ${errorData.error?.message || anthropicResponse.statusText}`)
        }
        
        const anthropicData = await anthropicResponse.json()
        return anthropicData.content[0].text

      default:
        throw new Error('AI provider not supported for validation')
    }
  }

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