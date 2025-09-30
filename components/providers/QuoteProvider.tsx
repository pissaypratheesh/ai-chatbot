"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import type { TextSelection } from "@/hooks/useTextSelection";

interface QuoteContextType {
  quotedText: string | null;
  quotedMessageId: string | null;
  setQuotedText: (text: string | null, messageId?: string | null) => void;
  clearQuote: () => void;
}

const QuoteContext = createContext<QuoteContextType | undefined>(undefined);

interface QuoteProviderProps {
  children: ReactNode;
}

export function QuoteProvider({ children }: QuoteProviderProps) {
  const [quotedText, setQuotedTextState] = useState<string | null>(null);
  const [quotedMessageId, setQuotedMessageId] = useState<string | null>(null);

  const setQuotedText = (text: string | null, messageId?: string | null) => {
    setQuotedTextState(text);
    setQuotedMessageId(messageId || null);
  };

  const clearQuote = () => {
    setQuotedTextState(null);
    setQuotedMessageId(null);
  };

  return (
    <QuoteContext.Provider
      value={{
        quotedText,
        quotedMessageId,
        setQuotedText,
        clearQuote,
      }}
    >
      {children}
    </QuoteContext.Provider>
  );
}

export function useQuote() {
  const context = useContext(QuoteContext);
  if (context === undefined) {
    throw new Error("useQuote must be used within a QuoteProvider");
  }
  return context;
}
