"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface Chat {
  id: string;
  title: string;
  createdAt: Date;
  visibility: "private" | "public";
  messageCount?: number;
  lastMessage?: string;
  lastMessageAt?: Date;
}

interface SearchState {
  query: string;
  results: Chat[];
  isLoading: boolean;
  isSearching: boolean;
}

interface SearchContextType {
  searchState: SearchState;
  search: (query: string) => void;
  clearSearch: () => void;
  setResults: (results: Chat[]) => void;
  setLoading: (loading: boolean) => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

interface SearchProviderProps {
  children: ReactNode;
}

export function SearchProvider({ children }: SearchProviderProps) {
  const [searchState, setSearchState] = useState<SearchState>({
    query: "",
    results: [],
    isLoading: false,
    isSearching: false,
  });

  const search = useCallback((query: string) => {
    setSearchState(prev => ({
      ...prev,
      query,
      isSearching: true,
      isLoading: true,
    }));
  }, []);

  const clearSearch = useCallback(() => {
    setSearchState({
      query: "",
      results: [],
      isLoading: false,
      isSearching: false,
    });
  }, []);

  const setResults = useCallback((results: Chat[]) => {
    setSearchState(prev => ({
      ...prev,
      results,
      isLoading: false,
    }));
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    setSearchState(prev => ({
      ...prev,
      isLoading: loading,
    }));
  }, []);

  const value: SearchContextType = {
    searchState,
    search,
    clearSearch,
    setResults,
    setLoading,
  };

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
}
