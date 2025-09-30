"use client";

import { forwardRef, useCallback, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import type { AutosuggestResult } from "@/lib/mock/autosuggestMockData";
import { Loader2Icon, SparklesIcon } from "lucide-react";

interface AutosuggestProps {
  suggestions: AutosuggestResult[];
  isLoading: boolean;
  error: string | null;
  selectedIndex: number;
  isVisible: boolean;
  onSelect: (suggestion: AutosuggestResult) => void;
  onNavigateUp: () => void;
  onNavigateDown: () => void;
  className?: string;
}

export const Autosuggest = forwardRef<HTMLDivElement, AutosuggestProps>(
  ({
    suggestions,
    isLoading,
    error,
    selectedIndex,
    isVisible,
    onSelect,
    onNavigateUp,
    onNavigateDown,
    className,
  }, ref) => {
    const listRef = useRef<HTMLDivElement>(null);

    // Scroll selected item into view
    useEffect(() => {
      if (selectedIndex >= 0 && listRef.current) {
        const selectedElement = listRef.current.children[selectedIndex] as HTMLElement;
        if (selectedElement) {
          selectedElement.scrollIntoView({
            block: "nearest",
            behavior: "smooth",
          });
        }
      }
    }, [selectedIndex]);

    const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
      switch (event.key) {
        case "ArrowUp":
          event.preventDefault();
          onNavigateUp();
          break;
        case "ArrowDown":
          event.preventDefault();
          onNavigateDown();
          break;
        case "Enter":
          event.preventDefault();
          if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
            onSelect(suggestions[selectedIndex]);
          }
          break;
        case "Escape":
          event.preventDefault();
          // Let parent handle escape
          break;
      }
    }, [selectedIndex, suggestions, onSelect, onNavigateUp, onNavigateDown]);

    if (!isVisible) {
      return null;
    }

    // Simple popover-style autosuggest
    return (
      <div
        ref={ref}
        className="absolute bottom-full left-0 right-0 mb-2 z-[9999]"
        style={{
          backgroundColor: 'white',
          border: '2px solid #e5e7eb',
          borderRadius: '8px',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          minHeight: '120px',
          width: '100%',
          display: 'block',
          visibility: 'visible',
          opacity: '1',
          zIndex: 9999,
          position: 'absolute',
        }}
        onKeyDown={handleKeyDown}
        tabIndex={-1}
        role="listbox"
        aria-label="Autosuggestions"
        data-autosuggest="true"
      >
        {/* Header */}
        <div className="px-3 py-2 border-b bg-gray-50">
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <SparklesIcon size={12} />
            <span>Suggestions</span>
            {isLoading && <Loader2Icon size={12} className="animate-spin" />}
          </div>
          {/* Hint for users */}
          <div className="text-xs text-gray-500 mt-1">
            💡 Try typing: "tell me", "what are", "how to", "help me"
          </div>
        </div>

        {/* Content */}
        <div className="max-h-48 overflow-y-auto" ref={listRef}>
          {error ? (
            <div className="px-3 py-2 text-sm text-red-600">
              {error}
            </div>
          ) : suggestions.length === 0 && !isLoading ? (
            <div className="px-3 py-2 text-sm text-gray-500">
              <div>No suggestions available</div>
              <div className="text-xs mt-1 text-gray-400">
                Try typing: "tell me", "what are", "how to", "help me", "create", "write"
              </div>
            </div>
          ) : (
            suggestions.map((suggestion, index) => (
              <AutosuggestItem
                key={suggestion.id}
                suggestion={suggestion}
                isSelected={index === selectedIndex}
                onClick={() => onSelect(suggestion)}
              />
            ))
          )}
        </div>

        {/* Footer with keyboard hints */}
        {suggestions.length > 0 && (
          <div className="px-3 py-1 border-t bg-gray-50">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>↑↓ Navigate</span>
              <span>Enter to select</span>
              <span>Esc to close</span>
            </div>
          </div>
        )}
      </div>
    );
  }
);

Autosuggest.displayName = "Autosuggest";

interface AutosuggestItemProps {
  suggestion: AutosuggestResult;
  isSelected: boolean;
  onClick: () => void;
}

function AutosuggestItem({ suggestion, isSelected, onClick }: AutosuggestItemProps) {
  const getTypeIcon = (type: AutosuggestResult["type"]) => {
    switch (type) {
      case "question":
        return "❓";
      case "command":
        return "⚡";
      case "completion":
        return "💬";
      case "suggestion":
        return "💡";
      default:
        return "💬";
    }
  };

  const getTypeColor = (type: AutosuggestResult["type"]) => {
    switch (type) {
      case "question":
        return "text-blue-600 dark:text-blue-400";
      case "command":
        return "text-purple-600 dark:text-purple-400";
      case "completion":
        return "text-green-600 dark:text-green-400";
      case "suggestion":
        return "text-orange-600 dark:text-orange-400";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <div
      className={cn(
        "px-3 py-2 cursor-pointer transition-colors",
        "hover:bg-gray-100 hover:text-gray-900",
        "flex items-center gap-3",
        isSelected 
          ? "bg-blue-100 text-blue-900 border-l-4 border-blue-500" 
          : "bg-white text-gray-900"
      )}
      onClick={onClick}
      role="option"
      aria-selected={isSelected}
    >
      {/* Type icon */}
      <span className="text-sm flex-shrink-0">
        {getTypeIcon(suggestion.type)}
      </span>
      
      {/* Suggestion text */}
      <span className="flex-1 text-sm truncate">
        {suggestion.text}
      </span>
      
      {/* Type badge */}
      <span className={cn(
        "text-xs px-2 py-0.5 rounded-full bg-muted",
        getTypeColor(suggestion.type)
      )}>
        {suggestion.type}
      </span>
      
      {/* Confidence indicator */}
      <div className="flex-shrink-0 w-8 h-2 bg-muted rounded-full overflow-hidden">
        <div 
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${suggestion.confidence * 100}%` }}
        />
      </div>
    </div>
  );
}
