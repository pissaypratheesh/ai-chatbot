"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AutosuggestServiceFactory, type AutosuggestResult } from "@/lib/mock/autosuggestMockData";
import { CancellableAutosuggestService } from "@/lib/services/autosuggestService";
import { AUTOSUGGEST_CONFIG } from "@/lib/config/autosuggestConfig";

interface UseAutosuggestOptions {
  minChars?: number;
  debounceDelay?: number;
  maxSuggestions?: number;
}

interface AutosuggestState {
  suggestions: AutosuggestResult[];
  isLoading: boolean;
  error: string | null;
  selectedIndex: number;
  isVisible: boolean;
}

export function useAutosuggest(options: UseAutosuggestOptions = {}) {
  const { 
    minChars = AUTOSUGGEST_CONFIG.MIN_CHARS,
    debounceDelay = AUTOSUGGEST_CONFIG.DEBOUNCE_DELAY,
    maxSuggestions = AUTOSUGGEST_CONFIG.MAX_SUGGESTIONS
  } = options;
  
  const [state, setState] = useState<AutosuggestState>({
    suggestions: [],
    isLoading: false,
    error: null,
    selectedIndex: -1,
    isVisible: false,
  });
  
  // Request cancellation and tracking
  const abortControllerRef = useRef<AbortController | null>(null);
  const requestIdRef = useRef<number>(0);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Mock autosuggest function with request cancellation
  const performAutosuggest = useCallback(async (input: string) => {
    // Don't suggest if input is too short
    if (input.trim().length < minChars) {
      setState(prev => ({
        ...prev,
        suggestions: [],
        isLoading: false,
        error: null,
        isVisible: false,
        selectedIndex: -1,
      }));
      return;
    }

    if (!input.trim()) {
      setState(prev => ({
        ...prev,
        suggestions: [],
        isLoading: false,
        error: null,
        isVisible: false,
        selectedIndex: -1,
      }));
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

    setState(prev => ({
      ...prev,
      isLoading: true,
      error: null,
      isVisible: true,
    }));

    try {
      // Get autosuggest service (mock or real)
      const autosuggestService = AutosuggestServiceFactory.getService();
      
      // Use CancellableAutosuggestService for real API calls with AbortController support
      let suggestions: AutosuggestResult[];
      if (autosuggestService instanceof CancellableAutosuggestService) {
        suggestions = await autosuggestService.getSuggestions(input, abortController.signal);
      } else {
        // For mock service, use regular method
        suggestions = await autosuggestService.getSuggestions(input);
      }
      
      // Check if this request was cancelled
      if (abortController.signal.aborted) {
        console.log(`Request ${requestId} was cancelled for input: "${input}"`);
        return;
      }

      // Check if this is still the latest request
      if (requestId !== requestIdRef.current) {
        console.log(`Request ${requestId} is stale, ignoring results for input: "${input}"`);
        return;
      }

      if (AUTOSUGGEST_CONFIG.ENABLE_LOGGING) {
        const serviceType = AutosuggestServiceFactory.isUsingMockService() ? "Mock" : "Real";
        console.log(`Request ${requestId} completed successfully for input: "${input}" using ${serviceType} service`);
      }

      // Limit suggestions and update state
      const limitedSuggestions = suggestions.slice(0, maxSuggestions);
      
      if (AUTOSUGGEST_CONFIG.ENABLE_LOGGING) {
        console.log("📝 Suggestions received:", limitedSuggestions);
      }
      
      setState(prev => {
        const newState = {
          ...prev,
          suggestions: limitedSuggestions,
          isLoading: false,
          error: null,
          isVisible: limitedSuggestions.length > 0,
          selectedIndex: limitedSuggestions.length > 0 ? 0 : -1, // Auto-select first suggestion
        };
        console.log("🔄 Updating autosuggest state:", newState);
        return newState;
      });
    } catch (error) {
      // Check if this request was cancelled
      if (abortController.signal.aborted) {
        console.log(`Request ${requestId} was cancelled for input: "${input}"`);
        return;
      }

      // Check if this is still the latest request
      if (requestId !== requestIdRef.current) {
        console.log(`Request ${requestId} is stale, ignoring error for input: "${input}"`);
        return;
      }

      console.error(`Autosuggest error for request ${requestId}:`, error);
      setState(prev => ({
        ...prev,
        suggestions: [],
        isLoading: false,
        error: error instanceof Error ? error.message : "Failed to get suggestions",
        isVisible: false,
        selectedIndex: -1,
      }));
    }
  }, [minChars, maxSuggestions]);

  // Debounced autosuggest function
  const debouncedAutosuggest = useCallback((input: string) => {
    // Clear existing timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Set new timeout
    debounceTimeoutRef.current = setTimeout(() => {
      performAutosuggest(input);
    }, debounceDelay);
  }, [performAutosuggest, debounceDelay]);

  const handleInput = useCallback((input: string) => {
    // Only suggest if input meets minimum character requirement
    if (input.trim().length >= minChars) {
      debouncedAutosuggest(input);
    } else {
      // Clear suggestions if input is too short
      setState(prev => ({
        ...prev,
        suggestions: [],
        isLoading: false,
        error: null,
        isVisible: false,
        selectedIndex: -1,
      }));
    }
  }, [debouncedAutosuggest, minChars]);

  const handleClear = useCallback(() => {
    // Cancel any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    // Clear debounce timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    
    setState(prev => ({
      ...prev,
      suggestions: [],
      isLoading: false,
      error: null,
      isVisible: false,
      selectedIndex: -1,
    }));
  }, []);

  const selectSuggestion = useCallback((index: number) => {
    if (index >= 0 && index < state.suggestions.length) {
      setState(prev => ({
        ...prev,
        selectedIndex: index,
      }));
    }
  }, [state.suggestions.length]);

  const navigateUp = useCallback(() => {
    if (state.suggestions.length === 0) return;
    
    setState(prev => ({
      ...prev,
      selectedIndex: prev.selectedIndex <= 0 
        ? prev.suggestions.length - 1 
        : prev.selectedIndex - 1,
    }));
  }, [state.suggestions.length]);

  const navigateDown = useCallback(() => {
    if (state.suggestions.length === 0) return;
    
    setState(prev => ({
      ...prev,
      selectedIndex: prev.selectedIndex >= prev.suggestions.length - 1 
        ? 0 
        : prev.selectedIndex + 1,
    }));
  }, [state.suggestions.length]);

  const getSelectedSuggestion = useCallback(() => {
    if (state.selectedIndex >= 0 && state.selectedIndex < state.suggestions.length) {
      return state.suggestions[state.selectedIndex];
    }
    return null;
  }, [state.selectedIndex, state.suggestions]);

  const acceptSuggestion = useCallback(() => {
    const selected = getSelectedSuggestion();
    if (selected) {
      // Clear suggestions after accepting
      handleClear();
      return selected.text;
    }
    return null;
  }, [getSelectedSuggestion, handleClear]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  return {
    // State
    suggestions: state.suggestions,
    isLoading: state.isLoading,
    error: state.error,
    selectedIndex: state.selectedIndex,
    isVisible: state.isVisible,
    
    // Actions
    handleInput,
    handleClear,
    selectSuggestion,
    navigateUp,
    navigateDown,
    getSelectedSuggestion,
    acceptSuggestion,
    
    // Configuration
    minChars,
    debounceDelay,
    maxSuggestions,
  };
}
