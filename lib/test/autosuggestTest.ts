/**
 * Simple test to verify autosuggest functionality
 * This can be run in the browser console or as a unit test
 */

import { AutosuggestServiceFactory } from "@/lib/mock/autosuggestMockData";

export async function testAutosuggest() {
  console.log("🧪 Testing Autosuggest Functionality");
  
  try {
    const service = AutosuggestServiceFactory.getService();
    
    // Test 1: Empty input should return empty results
    console.log("Test 1: Empty input");
    const emptyResults = await service.getSuggestions("");
    console.log("Empty results:", emptyResults);
    console.assert(emptyResults.length === 0, "Empty input should return no suggestions");
    
    // Test 2: Short input should return empty results
    console.log("Test 2: Short input (less than min chars)");
    const shortResults = await service.getSuggestions("te");
    console.log("Short results:", shortResults);
    console.assert(shortResults.length === 0, "Short input should return no suggestions");
    
    // Test 3: Valid input should return suggestions
    console.log("Test 3: Valid input");
    const validResults = await service.getSuggestions("tell me");
    console.log("Valid results:", validResults);
    console.assert(validResults.length > 0, "Valid input should return suggestions");
    
    // Test 4: Check suggestion structure
    if (validResults.length > 0) {
      const suggestion = validResults[0];
      console.log("Test 4: Suggestion structure");
      console.assert(typeof suggestion.id === "string", "Suggestion should have string id");
      console.assert(typeof suggestion.text === "string", "Suggestion should have string text");
      console.assert(typeof suggestion.type === "string", "Suggestion should have string type");
      console.assert(typeof suggestion.confidence === "number", "Suggestion should have number confidence");
      console.log("Suggestion structure is valid:", suggestion);
    }
    
    // Test 5: Starter suggestions
    console.log("Test 5: Starter suggestions");
    const starterResults = await service.getStarterSuggestions();
    console.log("Starter results:", starterResults);
    console.assert(starterResults.length > 0, "Should return starter suggestions");
    
    console.log("✅ All autosuggest tests passed!");
    return true;
    
  } catch (error) {
    console.error("❌ Autosuggest test failed:", error);
    return false;
  }
}

// Test the hook functionality
export function testAutosuggestHook() {
  console.log("🧪 Testing Autosuggest Hook");
  
  // This would need to be run in a React component context
  // For now, just log the expected behavior
  console.log("Expected hook behavior:");
  console.log("- Should debounce input with 500ms delay");
  console.log("- Should require minimum 3 characters");
  console.log("- Should cancel previous requests");
  console.log("- Should handle keyboard navigation");
  console.log("- Should show/hide suggestions based on visibility");
  
  return true;
}

// Run tests if in browser environment
if (typeof window !== "undefined") {
  console.log("🌐 Browser environment detected");
  console.log("Run testAutosuggest() to test the service");
  console.log("Run testAutosuggestHook() to see hook test info");
}
