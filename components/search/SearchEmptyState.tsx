"use client";

import { Search } from "lucide-react";

interface SearchEmptyStateProps {
  query: string;
  className?: string;
}

export function SearchEmptyState({ query, className = "" }: SearchEmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-8 px-4 text-center ${className}`}>
      <div className="rounded-full bg-muted p-3 mb-4">
        <Search className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-2">No conversations found</h3>
      <p className="text-muted-foreground mb-4">
        No conversations match your search for <span className="font-medium">"{query}"</span>
      </p>
      <div className="text-sm text-muted-foreground">
        <p className="mb-2">Try:</p>
        <ul className="space-y-1 text-left">
          <li>• Using different keywords</li>
          <li>• Checking your spelling</li>
          <li>• Using more general terms</li>
        </ul>
      </div>
    </div>
  );
}
