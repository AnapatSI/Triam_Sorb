import { AIAnalyzer, type AIProvider } from './ai-analyzer'

// AI Configuration for Gemini only
export const AI_CONFIG = {
  gemini: {
    name: 'gemini' as const,
    apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY || '',
    model: 'gemini-pro',
    maxTokens: 2000,
    temperature: 0.3
  },
  // ...other providers if needed (mock, anthropic, etc.)
}

// Initialize AI Analyzer with Gemini provider
export function initializeAI() {
  const provider = AI_CONFIG.gemini;
  if (!provider.apiKey) {
    console.warn('Gemini API key not found. Using mock provider instead.');
    // fallback logic...
    return false;
  }

  return true;
}



