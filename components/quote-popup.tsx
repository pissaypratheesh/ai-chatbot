"use client";

import { MessageSquareQuoteIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { TextSelection } from "@/hooks/useTextSelection";

interface QuotePopupProps {
  selection: TextSelection;
  isVisible: boolean;
  onQuote: () => void;
  className?: string;
}

export function QuotePopup({ 
  selection, 
  isVisible, 
  onQuote, 
  className 
}: QuotePopupProps) {
  if (!isVisible || !selection) return null;

  const { text, position } = selection;
  
  // Truncate text for display if too long
  const displayText = text.length > 50 ? `${text.slice(0, 47)}...` : text;

  const handleQuoteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onQuote();
  };

  return (
    <div
      className={cn(
        "absolute z-50 flex items-center gap-2 rounded-lg border bg-background p-2 shadow-lg",
        "animate-in fade-in-0 zoom-in-95 duration-200",
        className
      )}
      data-quote-popup
      style={{
        left: position.x,
        top: position.y - 50, // Position above the selection
        transform: "translateX(-50%)",
      }}
      onClick={(e) => e.stopPropagation()}
      onContextMenu={(e) => e.preventDefault()}
    >
      <div className="flex items-center gap-2">
        <MessageSquareQuoteIcon className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground max-w-[200px] truncate">
          "{displayText}"
        </span>
      </div>
      <Button
        size="sm"
        variant="default"
        onClick={handleQuoteClick}
        className="h-7 px-3 text-xs"
      >
        Quote
      </Button>
    </div>
  );
}
