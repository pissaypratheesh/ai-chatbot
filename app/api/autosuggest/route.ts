/**
 * Autosuggest API endpoint
 * Generates AI-powered suggestions based on partial text input
 */

import { NextRequest, NextResponse } from "next/server";
import { myProvider } from "@/lib/ai/providers";
import { generateAutosuggestions, generateStarterSuggestions } from "@/lib/ai/autosuggest";
import type { AutosuggestResult } from "@/lib/mock/autosuggestMockData";

/**
 * POST /api/autosuggest
 * Generate suggestions based on partial text
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, modelId = "chat-model", maxSuggestions = 5 } = body;
    
    // Validate input
    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { error: "Text input is required" },
        { status: 400 }
      );
    }

    if (text.length < 3) {
      return NextResponse.json({ suggestions: [] });
    }

    // For now, use mock data through API to ensure integration works
    // TODO: Switch to AI generation once AI provider is working
    console.log("📚 Using mock data through API for:", text);
    const { MockAutosuggestService } = await import("@/lib/mock/autosuggestMockData");
    const suggestions = await MockAutosuggestService.getSuggestions(text);
    
    return NextResponse.json({ 
      suggestions,
      query: text,
      model: modelId,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error("Autosuggest API error:", error);
    
    // Return empty suggestions on error (graceful degradation)
    return NextResponse.json(
      { 
        suggestions: [],
        error: "Failed to generate suggestions",
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/autosuggest/starter
 * Generate starter suggestions for empty input
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const modelId = searchParams.get("modelId") || "chat-model";
    const maxSuggestions = parseInt(searchParams.get("maxSuggestions") || "5");

    // Get the AI model
    const model = myProvider.languageModel(modelId);
    
    // Generate starter suggestions
    const suggestions = await generateStarterSuggestions(model, maxSuggestions);
    
    return NextResponse.json({ 
      suggestions,
      model: modelId,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error("Starter suggestions API error:", error);
    
    // Return fallback starter suggestions
    const fallbackSuggestions: AutosuggestResult[] = [
      { id: "starter-fallback-1", text: "help me with", type: "completion", confidence: 0.9 },
      { id: "starter-fallback-2", text: "what are the benefits of", type: "question", confidence: 0.8 },
      { id: "starter-fallback-3", text: "explain how to", type: "completion", confidence: 0.8 },
      { id: "starter-fallback-4", text: "create a", type: "command", confidence: 0.7 },
      { id: "starter-fallback-5", text: "tell me about", type: "completion", confidence: 0.7 },
    ].slice(0, parseInt(searchParams.get("maxSuggestions") || "5"));

    return NextResponse.json({ 
      suggestions: fallbackSuggestions,
      model: searchParams.get("modelId") || "chat-model",
      timestamp: new Date().toISOString()
    });
  }
}
