// Quick test script to verify mock service
import { MockAutosuggestService } from "@/lib/mock/autosuggestMockData";

async function testMockService() {
  console.log("🧪 Testing MockAutosuggestService directly...");
  
  try {
    const result = await MockAutosuggestService.getSuggestions("tell me");
    console.log("✅ Mock service test result:", result);
    return result;
  } catch (error) {
    console.error("❌ Mock service test failed:", error);
    return null;
  }
}

// Export for browser testing
if (typeof window !== "undefined") {
  (window as any).testMockService = testMockService;
  console.log("🌐 testMockService() available in browser console");
}
