export interface ParsedContent {
  title: string
  content: string
  sections: ContentSection[]
  summary: string
  wordCount: number
  estimatedReadTime: number // in minutes
}

export interface ContentSection {
  title: string
  content: string
  level: number
}

export class FileParser {
  static async parseFile(file: File): Promise<ParsedContent> {
    const fileType = file.type
    const fileName = file.name.replace(/\.[^/.]+$/, '') // Remove extension

    try {
      let content = ''

      if (fileType === 'text/plain') {
        content = await this.parseTXT(file)
      } else {
        throw new Error('Currently only TXT files are supported. Please convert your file to TXT format.')
      }

      // Process and organize content
      const sections = this.extractSections(content)
      const summary = this.generateSummary(content)
      const wordCount = this.countWords(content)
      const estimatedReadTime = Math.ceil(wordCount / 200) // Average reading speed: 200 words per minute

      return {
        title: fileName,
        content,
        sections,
        summary,
        wordCount,
        estimatedReadTime
      }
    } catch (error) {
      console.error('Error parsing file:', error)
      throw new Error(`Failed to parse file: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  private static async parseTXT(file: File): Promise<string> {
    const text = await file.text()
    return text.trim()
  }

  private static extractSections(content: string): ContentSection[] {
    const lines = content.split('\n')
    const sections: ContentSection[] = []
    let currentSection: ContentSection | null = null

    for (const line of lines) {
      const trimmedLine = line.trim()
      if (!trimmedLine) continue

      // Detect headers (simple heuristic)
      const isHeader = this.isHeader(trimmedLine)
      
      if (isHeader) {
        if (currentSection) {
          sections.push(currentSection)
        }
        
        const level = this.getHeaderLevel(trimmedLine)
        currentSection = {
          title: trimmedLine.replace(/^[#\d\.\s]+/, '').trim(),
          content: '',
          level
        }
      } else if (currentSection) {
        currentSection.content += (currentSection.content ? '\n' : '') + trimmedLine
      }
    }

    if (currentSection) {
      sections.push(currentSection)
    }

    // If no sections were detected, create a single section
    if (sections.length === 0) {
      sections.push({
        title: 'Content',
        content: content,
        level: 1
      })
    }

    return sections
  }

  private static isHeader(line: string): boolean {
    // Check for common header patterns
    const headerPatterns = [
      /^#{1,6}\s/, // Markdown headers
      /^\d+\.\s/, // Numbered lists
      /^[A-Z][A-Z\s]+$/, // ALL CAPS headers
      /^[A-Z][a-z]+(\s+[A-Z][a-z]+)*$/, // Title Case headers
    ]

    return headerPatterns.some(pattern => pattern.test(line))
  }

  private static getHeaderLevel(line: string): number {
    if (line.match(/^#{1,6}\s/)) {
      const match = line.match(/^(#{1,6})\s/)
      return match ? match[1].length : 1
    }
    return 1
  }

  private static generateSummary(content: string): string {
    // Simple summary generation - in production, use AI for better summaries
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 10)
    const importantSentences = sentences.slice(0, 3)
    return importantSentences.join('. ') + '.'
  }

  private static countWords(text: string): number {
    return text.split(/\s+/).filter(word => word.length > 0).length
  }
} 