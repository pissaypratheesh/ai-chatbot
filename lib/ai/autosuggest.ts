/**
 * AI-powered autosuggest generation
 * Uses existing AI providers to generate contextual suggestions
 */

import { LanguageModel } from "ai";
import type { AutosuggestResult } from "@/lib/mock/autosuggestMockData";

/**
 * Generate AI-powered autosuggestions based on partial text
 * @param model - AI language model to use
 * @param text - Partial text input from user
 * @param maxSuggestions - Maximum number of suggestions to generate
 * @returns Promise<AutosuggestResult[]> - Array of suggestions
 */
export async function generateAutosuggestions(
  model: LanguageModel,
  text: string,
  maxSuggestions: number = 5
): Promise<AutosuggestResult[]> {
  const prompt = `Generate ${maxSuggestions} autocomplete suggestions for the partial text: "${text}"

Return suggestions that:
1. Complete the user's thought naturally
2. Are contextually relevant and helpful
3. Vary in type (questions, commands, completions)
4. Are concise (under 50 characters)
5. Sound natural and conversational

Format as JSON array with: id, text, type, confidence
Types: "completion", "question", "command", "suggestion"
Confidence: 0.0 to 1.0 (higher = more relevant)

Example format:
[
  {"id": "1", "text": "tell me about", "type": "completion", "confidence": 0.9},
  {"id": "2", "text": "what are the benefits of", "type": "question", "confidence": 0.8}
]`;

  try {
    const result = await model.generateText({
      prompt,
      maxTokens: 300,
      temperature: 0.7,
    });

    // Parse the JSON response
    const suggestions = JSON.parse(result.text);
    
    // Validate and format the suggestions
    return suggestions.map((s: any, index: number) => ({
      id: s.id || `ai-${Date.now()}-${index}`,
      text: s.text || "",
      type: (s.type || "completion") as AutosuggestResult["type"],
      confidence: Math.max(0, Math.min(1, s.confidence || 0.8)),
    })).filter((s: AutosuggestResult) => s.text.length > 0);
    
  } catch (error) {
    console.error("Failed to generate AI suggestions:", error);
    
    // Fallback to basic suggestions if AI fails
    return generateFallbackSuggestions(text, maxSuggestions);
  }
}

/**
 * Generate fallback suggestions when AI fails
 * @param text - Partial text input
 * @param maxSuggestions - Maximum number of suggestions
 * @returns AutosuggestResult[] - Basic fallback suggestions
 */
function generateFallbackSuggestions(text: string, maxSuggestions: number): AutosuggestResult[] {
  const fallbackSuggestions: AutosuggestResult[] = [];
  
  // Common completions based on text patterns
  if (text.toLowerCase().includes("tell me")) {
    fallbackSuggestions.push(
      { id: "fallback-1", text: "tell me about", type: "completion", confidence: 0.8 },
      { id: "fallback-2", text: "tell me how to", type: "completion", confidence: 0.7 },
      { id: "fallback-3", text: "tell me more about", type: "completion", confidence: 0.6 }
    );
  } else if (text.toLowerCase().includes("what")) {
    fallbackSuggestions.push(
      { id: "fallback-4", text: "what are the benefits of", type: "question", confidence: 0.8 },
      { id: "fallback-5", text: "what is the best way to", type: "question", confidence: 0.7 }
    );
  } else if (text.toLowerCase().includes("how")) {
    fallbackSuggestions.push(
      { id: "fallback-6", text: "how does", type: "question", confidence: 0.8 },
      { id: "fallback-7", text: "how to", type: "question", confidence: 0.7 }
    );
  } else {
    // Generic completions
    fallbackSuggestions.push(
      { id: "fallback-8", text: "explain", type: "command", confidence: 0.6 },
      { id: "fallback-9", text: "help me with", type: "completion", confidence: 0.5 },
      { id: "fallback-10", text: "create a", type: "command", confidence: 0.5 }
    );
  }
  
  return fallbackSuggestions.slice(0, maxSuggestions);
}

/**
 * Generate starter suggestions for empty input
 * @param model - AI language model to use
 * @param maxSuggestions - Maximum number of suggestions
 * @returns Promise<AutosuggestResult[]> - Array of starter suggestions
 */
export async function generateStarterSuggestions(
  model: LanguageModel,
  maxSuggestions: number = 5
): Promise<AutosuggestResult[]> {
  const prompt = `Generate ${maxSuggestions} helpful starter suggestions for a chat interface.

These should be:
1. Common conversation starters
2. Helpful prompts for various tasks
3. Mix of questions, commands, and completions
4. Concise and engaging (under 50 characters)

Format as JSON array with: id, text, type, confidence
Types: "completion", "question", "command", "suggestion"

Example format:
[
  {"id": "starter-1", "text": "help me with", "type": "completion", "confidence": 0.9},
  {"id": "starter-2", "text": "what are the benefits of", "type": "question", "confidence": 0.8}
]`;

  try {
    const result = await model.generateText({
      prompt,
      maxTokens: 300,
      temperature: 0.8,
    });

    const suggestions = JSON.parse(result.text);
    
    return suggestions.map((s: any, index: number) => ({
      id: s.id || `starter-${Date.now()}-${index}`,
      text: s.text || "",
      type: (s.type || "completion") as AutosuggestResult["type"],
      confidence: Math.max(0, Math.min(1, s.confidence || 0.8)),
    })).filter((s: AutosuggestResult) => s.text.length > 0);
    
  } catch (error) {
    console.error("Failed to generate starter suggestions:", error);
    
    // Fallback starter suggestions
    return [
      { id: "starter-fallback-1", text: "help me with", type: "completion", confidence: 0.9 },
      { id: "starter-fallback-2", text: "what are the benefits of", type: "question", confidence: 0.8 },
      { id: "starter-fallback-3", text: "explain how to", type: "completion", confidence: 0.8 },
      { id: "starter-fallback-4", text: "create a", type: "command", confidence: 0.7 },
      { id: "starter-fallback-5", text: "tell me about", type: "completion", confidence: 0.7 },
    ].slice(0, maxSuggestions);
  }
}
