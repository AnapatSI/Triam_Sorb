# AI Integration Guide - Triam Sorb

## Overview

Triam Sorb integrates OpenAI GPT-3.5 (and other AI models) to provide intelligent analysis of user understanding. The AI analyzes student responses to educational content and provides detailed feedback, suggestions, and learning recommendations.

## Features

### 🤖 AI-Powered Understanding Analysis
- **Comprehension Scoring**: AI evaluates how well students understand the material (0-100%)
- **Factual Accuracy**: Checks the accuracy of student statements
- **Strengths Identification**: Highlights what students understand correctly
- **Improvement Areas**: Identifies concepts that need more clarification
- **Personalized Suggestions**: Provides actionable learning advice
- **Misconception Detection**: Identifies and corrects misunderstandings

### 🎯 Multiple AI Providers
- **OpenAI GPT-3.5-turbo** (Default): Fast, cost-effective analysis
- **OpenAI GPT-4**: Advanced analysis for complex content
- **Anthropic Claude**: Alternative AI perspective
- **Mock Mode**: Simulated responses for development/testing

## Setup

### 1. Environment Configuration

Create a `.env.local` file in your project root:

```env
# Required for AI features
NEXT_PUBLIC_OPENAI_API_KEY=your_openai_api_key_here

# Optional: Alternative AI providers
NEXT_PUBLIC_ANTHROPIC_API_KEY=your_anthropic_api_key_here
NEXT_PUBLIC_LOCAL_API_KEY=your_local_api_key_here
```

### 2. Get OpenAI API Key

1. Visit [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in
3. Go to "API Keys" section
4. Create a new API key
5. Copy the key to your `.env.local` file

## Usage

### Basic Usage

```typescript
import { AIAnalyzer } from '@/lib/ai-analyzer'
import { initializeAI } from '@/lib/ai-config'

// Initialize AI with GPT-3.5
initializeAI('openai')

// Analyze student understanding
const result = await AIAnalyzer.analyzeUnderstanding(
  lessonContent,
  studentUnderstanding
)

console.log(result.comprehensionScore) // 0-100
console.log(result.feedback) // Thai language feedback
console.log(result.strengths) // What they understood well
console.log(result.areasForImprovement) // What needs work
```

### Switching AI Models

```typescript
import { switchToGPT35, switchToGPT4 } from '@/lib/ai-config'

// Switch to GPT-3.5 (cost-effective)
switchToGPT35()

// Switch to GPT-4 (more advanced)
switchToGPT4()
```

### UI Component Usage

```tsx
import { AIConfig } from '@/components/ui/ai-config'

function MyComponent() {
  return (
    <AIConfig 
      onConfigChange={() => {
        // Handle AI configuration changes
        console.log('AI configuration updated')
      }} 
    />
  )
}
```

## API Reference

### AIAnalyzer Class

#### `analyzeUnderstanding(lessonContent, userUnderstanding)`

Analyzes a student's understanding of educational content.

**Parameters:**
- `lessonContent`: Object containing lesson information
- `userUnderstanding`: String of student's understanding

**Returns:**
```typescript
{
  comprehensionScore: number,        // 0-100
  isCorrect: boolean,                // Overall correctness
  factualAccuracy: number,           // 0-100
  feedback: string,                  // Thai language feedback
  strengths: string[],               // What they understood well
  areasForImprovement: string[],     // What needs work
  suggestions: string[],             // Actionable advice
  detailedExplanation: string,       // Detailed analysis
  keyConcepts: string[],             // Important concepts
  misconceptions: string[],          // Misunderstandings
  confidenceLevel: 'high' | 'medium' | 'low'
}
```

#### `validateKnowledge(lessonContent, userUnderstanding, questions?)`

Validates knowledge against specific questions.

**Parameters:**
- `lessonContent`: Lesson content object
- `userUnderstanding`: Student's understanding
- `questions`: Optional array of specific questions

**Returns:**
```typescript
{
  overallAccuracy: number,           // 0-100
  questionResults: Array<{
    question: string,
    userAnswer: string,
    isCorrect: boolean,
    correctAnswer: string,
    explanation: string
  }>,
  confidence: number                 // 0-100
}
```

### Configuration Functions

#### `initializeAI(providerName)`

Initialize AI with specified provider.

**Parameters:**
- `providerName`: 'openai' | 'anthropic' | 'local' | 'mock'

**Returns:** boolean (success status)

#### `switchToGPT35()`

Switch to GPT-3.5-turbo model.

#### `switchToGPT4()`

Switch to GPT-4 model.

#### `isAIConfigured()`

Check if AI is properly configured.

**Returns:** boolean

#### `getCurrentAIProvider()`

Get current AI provider information.

**Returns:**
```typescript
{
  name: string,
  model: string,
  apiKey?: string,
  temperature?: number,
  maxTokens?: number
}
```

## Cost Optimization

### GPT-3.5 vs GPT-4

| Model | Cost | Speed | Accuracy | Best For |
|-------|------|-------|----------|----------|
| GPT-3.5-turbo | Low | Fast | Good | General analysis |
| GPT-4 | High | Slow | Excellent | Complex content |

### Tips for Cost Management

1. **Use GPT-3.5 by default** - It's cost-effective and fast
2. **Switch to GPT-4 only for complex analysis** - When you need higher accuracy
3. **Monitor usage** - Check your OpenAI dashboard regularly
4. **Use mock mode for development** - Avoid API costs during testing
5. **Implement rate limiting** - Prevent excessive API calls

## Error Handling

### Common Errors

```typescript
try {
  const result = await AIAnalyzer.analyzeUnderstanding(content, understanding)
} catch (error) {
  if (error.message.includes('API key')) {
    // Handle missing/invalid API key
    console.error('Please check your OpenAI API key')
  } else if (error.message.includes('rate limit')) {
    // Handle rate limiting
    console.error('Rate limit exceeded, please wait')
  } else {
    // Handle other errors
    console.error('Analysis failed:', error.message)
  }
}
```

### Fallback Behavior

When AI analysis fails, the system automatically falls back to:
1. Mock analysis (simulated responses)
2. Basic error feedback
3. Encouragement to try again

## Best Practices

### 1. Content Preparation
- Ensure lesson content is clear and well-structured
- Include key concepts and definitions
- Provide context for complex topics

### 2. User Experience
- Show AI status indicators
- Provide clear feedback on analysis progress
- Handle errors gracefully with helpful messages

### 3. Performance
- Cache analysis results when appropriate
- Implement proper loading states
- Consider batch processing for multiple analyses

### 4. Security
- Never expose API keys in client-side code
- Use environment variables for configuration
- Implement proper error handling

## Troubleshooting

### AI Not Responding
1. Check API key configuration
2. Verify internet connection
3. Check OpenAI service status
4. Review rate limits

### Poor Analysis Quality
1. Ensure lesson content is comprehensive
2. Check if user input is sufficient
3. Consider switching to GPT-4 for complex content
4. Review prompt engineering

### High Costs
1. Switch to GPT-3.5-turbo
2. Implement usage monitoring
3. Add rate limiting
4. Use mock mode for development

## Support

For issues with AI integration:
1. Check the browser console for error messages
2. Verify your API key and configuration
3. Test with mock mode first
4. Review the OpenAI API documentation

## License

This AI integration is part of the Triam Sorb project and follows the same license terms. 