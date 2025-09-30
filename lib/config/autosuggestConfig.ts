/**
 * Autosuggest service configuration
 * Easy switching between mock and real services
 */

import { AutosuggestServiceFactory } from "../mock/autosuggestMockData";

/**
 * Configuration for autosuggest service
 */
export const AUTOSUGGEST_CONFIG = {
  // Set to true to use mock service for testing
  USE_MOCK_SERVICE: false, // Now using real AI API service
  
  // API endpoints (when using real service)
  API_BASE_URL: "/api",
  
  // Autosuggest-specific settings
  AUTOSUGGEST_ENDPOINT: "/autosuggest",
  STARTER_ENDPOINT: "/autosuggest/starter",
  
  // Performance settings
  DEFAULT_TIMEOUT: 5000, // 5 seconds
  RETRY_ATTEMPTS: 2,
  
  // UI settings
  MIN_CHARS: 3, // Minimum characters before triggering suggestions
  DEBOUNCE_DELAY: 500, // Debounce delay in milliseconds
  MAX_SUGGESTIONS: 5, // Maximum number of suggestions to show
  
  // Development settings
  ENABLE_LOGGING: true,
  ENABLE_PERFORMANCE_MONITORING: true,
  
  // Hybrid mock service settings
  MOCK_USE_LLM: true, // Enable LLM in mock service
  MOCK_LLM_FALLBACK: true, // Fallback to static data if LLM fails
} as const;

/**
 * Initialize autosuggest service based on configuration
 */
export function initializeAutosuggestService(): void {
  if (AUTOSUGGEST_CONFIG.USE_MOCK_SERVICE) {
    AutosuggestServiceFactory.switchToMockService();
  } else {
    AutosuggestServiceFactory.switchToRealService();
  }
  
  if (AUTOSUGGEST_CONFIG.ENABLE_LOGGING) {
    console.log(`💡 Autosuggest service initialized: ${AUTOSUGGEST_CONFIG.USE_MOCK_SERVICE ? 'Mock' : 'Real'}`);
  }
}

/**
 * Switch to real service (call this when backend is ready)
 */
export function enableRealAutosuggestService(): void {
  AutosuggestServiceFactory.switchToRealService();
}

/**
 * Switch back to mock service (for development/testing)
 */
export function enableMockAutosuggestService(): void {
  AutosuggestServiceFactory.switchToMockService();
}

/**
 * Get current service status
 */
export function getAutosuggestServiceStatus(): {
  isUsingMock: boolean;
  serviceType: string;
} {
  return {
    isUsingMock: AutosuggestServiceFactory.isUsingMockService(),
    serviceType: AutosuggestServiceFactory.isUsingMockService() ? "Mock" : "Real",
  };
}
