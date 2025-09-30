"use client";

import { useState, useEffect, useRef } from "react";
import { SearchEmptyState } from "./SearchEmptyState";
import { SearchHighlight } from "./SearchHighlight";
import { formatRelativeDate } from "@/lib/utils/dateUtils";

interface Chat {
  id: string;
  title: string;
  createdAt: Date | string; // Can be Date (mock) or string (API)
  visibility: "private" | "public";
  messageCount?: number;
  lastMessage?: string;
  lastMessageAt?: Date | string; // Can be Date (mock) or string (API)
}

interface SearchResultsProps {
  chats: Chat[];
  query: string;
  isLoading?: boolean;
  onChatClick?: (chatId: string) => void;
  className?: string;
  minChars?: number;
}

export function SearchResults({
  chats,
  query,
  isLoading = false,
  onChatClick,
  className = "",
  minChars = 2,
}: SearchResultsProps) {
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const resultsRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Reset selected index when results change
  useEffect(() => {
    setSelectedIndex(-1);
    itemRefs.current = [];
  }, [chats]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle navigation if we have results
      if (chats.length === 0) return;
      
      // Check if we should handle navigation
      const activeElement = document.activeElement;
      const isInputFocused = activeElement && (
        activeElement.tagName === 'INPUT' || 
        activeElement.tagName === 'TEXTAREA' ||
        activeElement.contentEditable === 'true'
      );

      // Handle arrow down from input field
      if (e.key === "ArrowDown" && isInputFocused) {
        e.preventDefault();
        setSelectedIndex(0); // Start from first item
        return;
      }

      // Don't interfere with typing in input fields for other keys
      if (isInputFocused && e.key !== "ArrowDown") {
        return;
      }

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex(prev => {
            if (prev === -1) return 0; // Start from first item
            return prev < chats.length - 1 ? prev + 1 : 0; // Wrap to first
          });
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex(prev => {
            if (prev === -1) return chats.length - 1; // Start from last item
            return prev > 0 ? prev - 1 : chats.length - 1; // Wrap to last
          });
          break;
        case "Enter":
          e.preventDefault();
          if (selectedIndex >= 0 && selectedIndex < chats.length) {
            onChatClick?.(chats[selectedIndex].id);
          }
          break;
        case "Escape":
          e.preventDefault();
          // Let the parent handle escape (clearing search)
          break;
        case "Home":
          e.preventDefault();
          setSelectedIndex(0);
          break;
        case "End":
          e.preventDefault();
          setSelectedIndex(chats.length - 1);
          break;
      }
    };

    // Always add listener when we have results
    if (chats.length > 0) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [chats, selectedIndex, onChatClick]);

  // Scroll selected item into view
  useEffect(() => {
    if (selectedIndex >= 0 && itemRefs.current[selectedIndex]) {
      itemRefs.current[selectedIndex]?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [selectedIndex]);

  if (isLoading) {
    return (
      <div className={`space-y-2 ${className}`}>
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="h-16 bg-muted rounded-lg" />
          </div>
        ))}
      </div>
    );
  }

  if (!query.trim()) {
    return null;
  }

  // Show hint if query is too short
  if (query.trim().length < minChars) {
    return (
      <div className={`flex flex-col items-center justify-center py-8 px-4 text-center ${className}`}>
        <div className="text-sm text-muted-foreground">
          Type at least {minChars} characters to search
        </div>
      </div>
    );
  }

  if (chats.length === 0) {
    return <SearchEmptyState query={query} className={className} />;
  }


  return (
    <div className={`space-y-1 ${className}`} ref={resultsRef}>
      <div className="px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
        {chats.length} conversation{chats.length !== 1 ? "s" : ""} found
        {selectedIndex >= 0 && (
          <span className="ml-2 text-xs text-blue-600 dark:text-blue-400">
            (↑↓ navigate, Enter select, Home/End jump, Esc clear)
          </span>
        )}
        {selectedIndex === -1 && chats.length > 0 && (
          <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
            (Press ↓ to navigate results)
          </span>
        )}
      </div>
      {chats.map((chat, index) => (
        <button
          key={chat.id}
          ref={(el) => (itemRefs.current[index] = el)}
          onClick={() => onChatClick?.(chat.id)}
          className={`group flex flex-col p-3 rounded-lg cursor-pointer transition-colors w-full text-left ${
            selectedIndex === index
              ? "bg-blue-100 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"
              : "hover:bg-muted/50"
          }`}
        >
          <div className="flex items-start justify-between mb-1">
            <h3 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2">
              <SearchHighlight text={chat.title} query={query} />
            </h3>
            <span className="text-xs text-muted-foreground ml-2 flex-shrink-0">
              {formatRelativeDate(chat.createdAt)}
            </span>
          </div>
          
          {chat.lastMessage && (
            <p className="text-xs text-muted-foreground line-clamp-2">
              <SearchHighlight text={chat.lastMessage} query={query} />
            </p>
          )}
          
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center space-x-2">
              <span className="text-xs text-muted-foreground">
                {chat.messageCount ? `${chat.messageCount} messages` : "No messages"}
              </span>
              {chat.visibility === "public" && (
                <span className="text-xs bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-1.5 py-0.5 rounded">
                  Public
                </span>
              )}
            </div>
            {chat.lastMessageAt && (
              <span className="text-xs text-muted-foreground">
                {formatRelativeDate(chat.lastMessageAt)}
              </span>
            )}
          </div>
        </button>
      ))}
    </div>
  );
}
