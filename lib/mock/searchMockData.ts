/**
 * Mock search data for development and testing
 * This file can be easily replaced with real API calls when backend is implemented
 */

export interface MockChat {
  id: string;
  title: string;
  createdAt: Date | string; // Can be Date (mock) or string (API)
  visibility: "private" | "public";
  messageCount?: number;
  lastMessage?: string;
  lastMessageAt?: Date | string; // Can be Date (mock) or string (API)
}

/**
 * Mock search results data
 * Simulates real chat history with various topics and timestamps
 */
export const MOCK_SEARCH_DATA: MockChat[] = [
  {
    id: "1",
    title: "How to implement search functionality",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    visibility: "private",
    messageCount: 15,
    lastMessage: "Let's implement the search feature step by step",
    lastMessageAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
  },
  {
    id: "2",
    title: "Search optimization techniques",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    visibility: "public",
    messageCount: 8,
    lastMessage: "We should use PostgreSQL full-text search",
    lastMessageAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
  },
  {
    id: "3",
    title: "Database indexing strategies",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    visibility: "private",
    messageCount: 12,
    lastMessage: "GIN indexes work great for full-text search",
    lastMessageAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
  },
  {
    id: "4",
    title: "React search implementation",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    visibility: "public",
    messageCount: 6,
    lastMessage: "Using AbortController for request cancellation",
    lastMessageAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
  },
  {
    id: "5",
    title: "Race condition prevention",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    visibility: "private",
    messageCount: 10,
    lastMessage: "Request ID tracking prevents stale results",
    lastMessageAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
  },
  {
    id: "6",
    title: "Next.js API routes",
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
    visibility: "public",
    messageCount: 7,
    lastMessage: "Creating search endpoints with proper error handling",
    lastMessageAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
  },
  {
    id: "7",
    title: "PostgreSQL full-text search",
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // 6 days ago
    visibility: "private",
    messageCount: 14,
    lastMessage: "Using tsvector for efficient text search",
    lastMessageAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
  },
  {
    id: "8",
    title: "TypeScript best practices",
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000), // 8 days ago
    visibility: "public",
    messageCount: 9,
    lastMessage: "Proper type definitions for search results",
    lastMessageAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
  },
  {
    id: "9",
    title: "UI/UX design patterns",
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
    visibility: "private",
    messageCount: 11,
    lastMessage: "Creating intuitive search interfaces",
    lastMessageAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
  },
  {
    id: "10",
    title: "Performance optimization",
    createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000), // 12 days ago
    visibility: "public",
    messageCount: 13,
    lastMessage: "Debouncing and request cancellation for better UX",
    lastMessageAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000), // 9 days ago
  },
];

/**
 * Mock search service that simulates API behavior
 * This can be easily replaced with real API calls
 */
export class MockSearchService {
  /**
   * Simulates API delay with variable timing for testing race conditions
   */
  private static getRandomDelay(): number {
    return Math.random() * 1000 + 200; // 200-1200ms
  }

  /**
   * Mock search function that filters results based on query
   * @param query - Search query string
   * @param delay - Optional delay override for testing
   * @returns Promise<MockChat[]> - Filtered search results
   */
  static async searchChats(query: string, delay?: number): Promise<MockChat[]> {
    // Simulate API delay
    const actualDelay = delay ?? this.getRandomDelay();
    await new Promise(resolve => setTimeout(resolve, actualDelay));

    // Filter results based on query
    const filteredResults = MOCK_SEARCH_DATA.filter(chat => 
      chat.title.toLowerCase().includes(query.toLowerCase()) ||
      chat.lastMessage?.toLowerCase().includes(query.toLowerCase())
    );

    return filteredResults;
  }

  /**
   * Mock function to get all chats (for testing)
   * @returns Promise<MockChat[]> - All mock chats
   */
  static async getAllChats(): Promise<MockChat[]> {
    const delay = this.getRandomDelay();
    await new Promise(resolve => setTimeout(resolve, delay));
    return [...MOCK_SEARCH_DATA];
  }

  /**
   * Mock function to get chat by ID
   * @param id - Chat ID
   * @returns Promise<MockChat | null> - Chat or null if not found
   */
  static async getChatById(id: string): Promise<MockChat | null> {
    const delay = this.getRandomDelay();
    await new Promise(resolve => setTimeout(resolve, delay));
    return MOCK_SEARCH_DATA.find(chat => chat.id === id) || null;
  }
}

/**
 * Future API service interface
 * This defines the contract for the real API service
 */
export interface SearchService {
  searchChats(query: string): Promise<MockChat[]>;
  getAllChats(): Promise<MockChat[]>;
  getChatById(id: string): Promise<MockChat | null>;
}

/**
 * Service factory to easily switch between mock and real services
 */
export class SearchServiceFactory {
  private static useMockService = true; // Set to false when real API is ready

  static getService(): SearchService {
    if (this.useMockService) {
      return MockSearchService;
    }
    
    // Import real service dynamically to avoid circular dependencies
    const { CancellableSearchService } = require("../services/searchService");
    return new CancellableSearchService();
  }

  /**
   * Switch to real service when backend is ready
   */
  static switchToRealService(): void {
    this.useMockService = false;
    console.log("🔄 Switched to real search service");
  }

  /**
   * Switch back to mock service for development
   */
  static switchToMockService(): void {
    this.useMockService = true;
    console.log("🔄 Switched to mock search service");
  }

  /**
   * Check if currently using mock service
   */
  static isUsingMockService(): boolean {
    return this.useMockService;
  }
}
