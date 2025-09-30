"use client";

import { useCallback, useRef } from "react";
import { useSearch as useSearchContext } from "@/components/providers/SearchProvider";
import { SearchServiceFactory, type MockChat } from "@/lib/mock/searchMockData";
import { CancellableSearchService } from "@/lib/services/searchService";
import { SEARCH_CONFIG } from "@/lib/config/searchConfig";

// Use the same interface as mock data for consistency
type Chat = MockChat;

interface UseSearchOptions {
  onChatClick?: (chatId: string) => void;
  minChars?: number;
}

export function useSearch(options: UseSearchOptions = {}) {
  const { searchState, search, clearSearch, setResults, setLoading } = useSearchContext();
  const { minChars = 2 } = options;
  
  // Request cancellation and tracking
  const abortControllerRef = useRef<AbortController | null>(null);
  const requestIdRef = useRef<number>(0);

  // Mock search function with request cancellation
  const performSearch = useCallback(async (query: string) => {
    // Don't search if query is too short
    if (query.trim().length < minChars) {
      setResults([]);
      return;
    }

    if (!query.trim()) {
      setResults([]);
      return;
    }

    // Cancel previous request if it exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller for this request
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    // Generate unique request ID
    const requestId = ++requestIdRef.current;

    setLoading(true);

    try {
      // Get search service (mock or real)
      const searchService = SearchServiceFactory.getService();
      
      // Use CancellableSearchService for real API calls with AbortController support
      let results: Chat[];
      if (searchService instanceof CancellableSearchService) {
        results = await searchService.searchChats(query, abortController.signal);
      } else {
        // For mock service, use regular method
        results = await searchService.searchChats(query);
      }
      
      // Check if this request was cancelled
      if (abortController.signal.aborted) {
        console.log(`Request ${requestId} was cancelled for query: "${query}"`);
        return;
      }

      // Check if this is still the latest request
      if (requestId !== requestIdRef.current) {
        console.log(`Request ${requestId} is stale, ignoring results for query: "${query}"`);
        return;
      }

      if (SEARCH_CONFIG.ENABLE_LOGGING) {
        const serviceType = SearchServiceFactory.isUsingMockService() ? "Mock" : "Real";
        console.log(`Request ${requestId} completed successfully for query: "${query}" using ${serviceType} service`);
      }
      setResults(results);
    } catch (error) {
      // Check if this request was cancelled
      if (abortController.signal.aborted) {
        console.log(`Request ${requestId} was cancelled for query: "${query}"`);
        return;
      }

      // Check if this is still the latest request
      if (requestId !== requestIdRef.current) {
        console.log(`Request ${requestId} is stale, ignoring error for query: "${query}"`);
        return;
      }

      console.error(`Search error for request ${requestId}:`, error);
      setResults([]);
    } finally {
      // Only update loading state if this is still the latest request
      if (requestId === requestIdRef.current) {
        setLoading(false);
      }
    }
  }, [setResults, setLoading, minChars]);

  const handleSearch = useCallback((query: string) => {
    // Only search if query meets minimum character requirement
    if (query.trim().length >= minChars) {
      search(query);
      performSearch(query);
    } else {
      // Clear search if query is too short
      clearSearch();
    }
  }, [search, performSearch, clearSearch, minChars]);

  const handleClear = useCallback(() => {
    // Cancel any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    clearSearch();
  }, [clearSearch]);

  const handleChatClick = useCallback((chatId: string) => {
    // Cancel any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    options.onChatClick?.(chatId);
    // Clear search after clicking a chat
    clearSearch();
  }, [options.onChatClick, clearSearch]);

  return {
    searchState,
    handleSearch,
    handleClear,
    handleChatClick,
    minChars,
  };
}
