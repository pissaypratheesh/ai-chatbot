/**
 * Test script to verify autosuggest backend integration
 * Run this in browser console to test the service switching
 */

import { AutosuggestServiceFactory } from "@/lib/mock/autosuggestMockData";
import { getAutosuggestServiceStatus } from "@/lib/config/autosuggestConfig";

export async function testAutosuggestBackend() {
  console.log("🧪 Testing Autosuggest Backend Integration");
  console.log("========================================");
  
  // Test 1: Check current service status
  console.log("\n1. Checking service status:");
  const status = getAutosuggestServiceStatus();
  console.log("Current service:", status);
  
  // Test 2: Get service instance
  console.log("\n2. Getting service instance:");
  const service = AutosuggestServiceFactory.getService();
  console.log("Service type:", service.constructor.name);
  
  // Test 3: Test suggestions with "tell me"
  console.log("\n3. Testing suggestions with 'tell me':");
  try {
    const suggestions = await service.getSuggestions("tell me");
    console.log("✅ Suggestions received:", suggestions.length);
    console.log("Sample suggestions:", suggestions.slice(0, 3));
  } catch (error) {
    console.error("❌ Error getting suggestions:", error);
  }
  
  // Test 4: Test starter suggestions
  console.log("\n4. Testing starter suggestions:");
  try {
    const starterSuggestions = await service.getStarterSuggestions();
    console.log("✅ Starter suggestions received:", starterSuggestions.length);
    console.log("Sample starter suggestions:", starterSuggestions.slice(0, 3));
  } catch (error) {
    console.error("❌ Error getting starter suggestions:", error);
  }
  
  // Test 5: Test request cancellation
  console.log("\n5. Testing request cancellation:");
  try {
    const controller = new AbortController();
    const promise = service.getSuggestions("test", controller.signal);
    
    // Cancel after 50ms
    setTimeout(() => {
      controller.abort();
      console.log("🔄 Request cancelled");
    }, 50);
    
    await promise;
    console.log("❌ Request should have been cancelled");
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      console.log("✅ Request cancellation working correctly");
    } else {
      console.error("❌ Unexpected error:", error);
    }
  }
  
  console.log("\n🎉 Backend integration test complete!");
}

// Export for browser console usage
(window as any).testAutosuggestBackend = testAutosuggestBackend;
