/**
 * Real API service implementation for autosuggest
 * This file contains the actual API calls to the backend
 */

import { AutosuggestService, type AutosuggestResult } from "../mock/autosuggestMockData";

/**
 * Real autosuggest service that makes actual API calls
 */
export class RealAutosuggestService implements AutosuggestService {
  private baseUrl: string;

  constructor(baseUrl: string = "/api") {
    this.baseUrl = baseUrl;
  }

  /**
   * Get suggestions using real API endpoint
   * @param input - Partial input text
   * @returns Promise<AutosuggestResult[]> - Suggestions from API
   */
  async getSuggestions(input: string): Promise<AutosuggestResult[]> {
    try {
      const response = await fetch(`${this.baseUrl}/autosuggest`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          text: input,
          limit: 5 
        }),
      });

      if (!response.ok) {
        throw new Error(`Autosuggest API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data.suggestions || [];
    } catch (error) {
      console.error("Autosuggest API error:", error);
      throw error;
    }
  }

  /**
   * Get starter suggestions using real API endpoint
   * @returns Promise<AutosuggestResult[]> - Starter suggestions from API
   */
  async getStarterSuggestions(): Promise<AutosuggestResult[]> {
    try {
      const response = await fetch(`${this.baseUrl}/autosuggest/starter`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Starter suggestions API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data.suggestions || [];
    } catch (error) {
      console.error("Starter suggestions API error:", error);
      throw error;
    }
  }
}

/**
 * Autosuggest service with AbortController support for request cancellation
 */
export class CancellableAutosuggestService implements AutosuggestService {
  private baseUrl: string;

  constructor(baseUrl: string = "/api") {
    this.baseUrl = baseUrl;
  }

  /**
   * Get suggestions with request cancellation support
   * @param input - Partial input text
   * @param signal - AbortSignal for request cancellation
   * @returns Promise<AutosuggestResult[]> - Suggestions from API
   */
  async getSuggestions(input: string, signal?: AbortSignal): Promise<AutosuggestResult[]> {
    try {
      const response = await fetch(`${this.baseUrl}/autosuggest`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          text: input,
          limit: 5 
        }),
        signal, // Pass abort signal for cancellation
      });

      if (!response.ok) {
        throw new Error(`Autosuggest API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data.suggestions || [];
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        console.log("Autosuggest request was cancelled");
        throw error;
      }
      console.error("Autosuggest API error:", error);
      throw error;
    }
  }

  /**
   * Get starter suggestions with request cancellation support
   * @param signal - AbortSignal for request cancellation
   * @returns Promise<AutosuggestResult[]> - Starter suggestions from API
   */
  async getStarterSuggestions(signal?: AbortSignal): Promise<AutosuggestResult[]> {
    try {
      const response = await fetch(`${this.baseUrl}/autosuggest/starter`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        signal, // Pass abort signal for cancellation
      });

      if (!response.ok) {
        throw new Error(`Starter suggestions API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data.suggestions || [];
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        console.log("Starter suggestions request was cancelled");
        throw error;
      }
      console.error("Starter suggestions API error:", error);
      throw error;
    }
  }
}
