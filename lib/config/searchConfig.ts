/**
 * Search service configuration
 * Easy switching between mock and real services
 */

import { SearchServiceFactory } from "../mock/searchMockData";

/**
 * Configuration for search service
 */
export const SEARCH_CONFIG = {
  // Set to true to use mock service for testing
  USE_MOCK_SERVICE: false, // Default to real service (database)
  
  // API endpoints (when using real service)
  API_BASE_URL: "/api",
  
  // Search-specific settings
  SEARCH_ENDPOINT: "/search",
  CHATS_ENDPOINT: "/chats",
  
  // Performance settings
  DEFAULT_TIMEOUT: 10000, // 10 seconds
  RETRY_ATTEMPTS: 3,
  
  // Development settings
  ENABLE_LOGGING: true,
  ENABLE_PERFORMANCE_MONITORING: true,
} as const;

/**
 * Initialize search service based on configuration
 */
export function initializeSearchService(): void {
  if (SEARCH_CONFIG.USE_MOCK_SERVICE) {
    SearchServiceFactory.switchToMockService();
  } else {
    SearchServiceFactory.switchToRealService();
  }
  
  if (SEARCH_CONFIG.ENABLE_LOGGING) {
    console.log(`🔍 Search service initialized: ${SEARCH_CONFIG.USE_MOCK_SERVICE ? 'Mock' : 'Real'}`);
  }
}

/**
 * Switch to real service (call this when backend is ready)
 */
export function enableRealSearchService(): void {
  SearchServiceFactory.switchToRealService();
}

/**
 * Switch back to mock service (for development/testing)
 */
export function enableMockSearchService(): void {
  SearchServiceFactory.switchToMockService();
}

/**
 * Get current service status
 */
export function getSearchServiceStatus(): {
  isUsingMock: boolean;
  serviceType: string;
} {
  return {
    isUsingMock: SearchServiceFactory.isUsingMockService(),
    serviceType: SearchServiceFactory.isUsingMockService() ? "Mock" : "Real",
  };
}
