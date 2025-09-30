/**
 * Real API service implementation
 * This file contains the actual API calls to the backend
 */

import { SearchService, type MockChat } from "../mock/searchMockData";

/**
 * Real search service that makes actual API calls
 */
export class RealSearchService implements SearchService {
  private baseUrl: string;

  constructor(baseUrl: string = "/api") {
    this.baseUrl = baseUrl;
  }

  /**
   * Search chats using real API endpoint - Title only search
   * @param query - Search query string
   * @returns Promise<MockChat[]> - Search results from API
   */
  async searchChats(query: string): Promise<MockChat[]> {
    try {
      const response = await fetch(`${this.baseUrl}/search/titles?q=${encodeURIComponent(query)}&limit=20`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Search API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data.chats || [];
    } catch (error) {
      console.error("Search API error:", error);
      throw error;
    }
  }

  /**
   * Get all chats using real API endpoint
   * @returns Promise<MockChat[]> - All chats from API
   */
  async getAllChats(): Promise<MockChat[]> {
    try {
      const response = await fetch(`${this.baseUrl}/chats?limit=50`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Get chats API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data.chats || [];
    } catch (error) {
      console.error("Get chats API error:", error);
      throw error;
    }
  }

  /**
   * Get chat by ID using real API endpoint
   * @param id - Chat ID
   * @returns Promise<MockChat | null> - Chat or null if not found
   */
  async getChatById(id: string): Promise<MockChat | null> {
    try {
      const response = await fetch(`${this.baseUrl}/chats/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 404) {
        return null;
      }

      if (!response.ok) {
        throw new Error(`Get chat API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data.chat || null;
    } catch (error) {
      console.error("Get chat API error:", error);
      throw error;
    }
  }
}

/**
 * Search service with AbortController support for request cancellation
 */
export class CancellableSearchService implements SearchService {
  private baseUrl: string;

  constructor(baseUrl: string = "/api") {
    this.baseUrl = baseUrl;
  }

  /**
   * Search chats with request cancellation support - Title only search
   * @param query - Search query string
   * @param signal - AbortSignal for request cancellation
   * @returns Promise<MockChat[]> - Search results from API
   */
  async searchChats(query: string, signal?: AbortSignal): Promise<MockChat[]> {
    try {
      const response = await fetch(`${this.baseUrl}/search/titles?q=${encodeURIComponent(query)}&limit=20`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        signal, // Pass abort signal for cancellation
      });

      if (!response.ok) {
        throw new Error(`Search API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data.chats || [];
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        console.log("Search request was cancelled");
        throw error;
      }
      console.error("Search API error:", error);
      throw error;
    }
  }

  async getAllChats(): Promise<MockChat[]> {
    try {
      const response = await fetch(`${this.baseUrl}/chats?limit=50`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Get chats API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data.chats || [];
    } catch (error) {
      console.error("Get chats API error:", error);
      throw error;
    }
  }

  async getChatById(id: string): Promise<MockChat | null> {
    try {
      const response = await fetch(`${this.baseUrl}/chats/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 404) {
        return null;
      }

      if (!response.ok) {
        throw new Error(`Get chat API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data.chat || null;
    } catch (error) {
      console.error("Get chat API error:", error);
      throw error;
    }
  }
}
