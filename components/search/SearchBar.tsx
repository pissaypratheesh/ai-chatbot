"use client";

import { useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";

interface SearchBarProps {
  onSearch: (query: string) => void;
  onClear: () => void;
  isLoading?: boolean;
  placeholder?: string;
  className?: string;
  minChars?: number;
}

export function SearchBar({
  onSearch,
  onClear,
  isLoading = false,
  placeholder = "Search conversations...",
  className = "",
  minChars = 2,
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounced search effect with minimum character threshold
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query.trim().length >= minChars) {
        onSearch(query.trim());
      } else if (query.trim().length === 0) {
        onClear();
      }
      // If query length is between 1 and minChars-1, do nothing (don't clear, don't search)
    }, 300);

    return () => {
      clearTimeout(timeoutId);
      // Note: Previous requests are cancelled in the useSearch hook
    };
  }, [query, onSearch, onClear, minChars]);

  const handleClear = () => {
    setQuery("");
    onClear();
    // Ensure focus is maintained after clearing
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      handleClear();
    } else if (e.key === "ArrowDown" && query.trim().length >= minChars) {
      // Allow arrow down to move focus to search results
      e.preventDefault();
      // Blur the input to allow SearchResults to handle navigation
      inputRef.current?.blur();
    }
  };

  // Maintain focus during loading state changes
  useEffect(() => {
    if (isLoading && inputRef.current && document.activeElement !== inputRef.current) {
      inputRef.current.focus();
    }
  }, [isLoading]);

  // Prevent focus loss during any state changes
  useEffect(() => {
    const handleFocusLoss = () => {
      if (inputRef.current && query && document.activeElement !== inputRef.current) {
        // Only refocus if user is still interacting with search
        setTimeout(() => {
          if (inputRef.current && query) {
            inputRef.current.focus();
          }
        }, 10);
      }
    };

    // Add a small delay to check for focus loss after state changes
    const timeoutId = setTimeout(handleFocusLoss, 50);
    
    return () => clearTimeout(timeoutId);
  }, [query, isLoading]);

  // Show hint when query is too short
  const showHint = query.trim().length > 0 && query.trim().length < minChars;

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full rounded-lg border border-input bg-background px-10 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        />
        {query && !isLoading && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            type="button"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        {isLoading && (
          <div className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
          </div>
        )}
        {query && isLoading && (
          <button
            onClick={handleClear}
            className="absolute right-8 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            type="button"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      {showHint && (
        <div className="mt-1 px-2 text-xs text-muted-foreground">
          Type at least {minChars} characters to search
        </div>
      )}
    </div>
  );
}
