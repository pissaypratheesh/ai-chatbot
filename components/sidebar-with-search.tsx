"use client";

import { useRouter } from "next/navigation";
import type { User } from "next-auth";
import { SearchBar } from "@/components/search/SearchBar";
import { SearchResults } from "@/components/search/SearchResults";
import { ServiceSwitcher } from "@/components/search/ServiceSwitcher";
import { SidebarHistory } from "@/components/sidebar-history";
import { useSearch } from "@/hooks/useSearch";
import { SidebarGroup, SidebarGroupContent } from "@/components/ui/sidebar";

interface SidebarWithSearchProps {
  user: User | undefined;
  minChars?: number;
}

export function SidebarWithSearch({ user, minChars = 2 }: SidebarWithSearchProps) {
  const router = useRouter();
  
  const { searchState, handleSearch, handleClear, handleChatClick } = useSearch({
    onChatClick: (chatId: string) => {
      router.push(`/chat/${chatId}`);
    },
    minChars,
  });

  return (
    <>
      {/* Service Switcher */}
      <SidebarGroup>
        <SidebarGroupContent>
          <div className="px-2 py-2">
            <ServiceSwitcher />
          </div>
        </SidebarGroupContent>
      </SidebarGroup>

      {/* Search Bar */}
      <SidebarGroup>
        <SidebarGroupContent>
          <div className="px-2 py-2">
            <SearchBar
              onSearch={handleSearch}
              onClear={handleClear}
              isLoading={searchState.isLoading}
              placeholder="Search conversations..."
              minChars={minChars}
            />
          </div>
        </SidebarGroupContent>
      </SidebarGroup>

      {/* Search Results or Regular History */}
      {searchState.isSearching ? (
        <SidebarGroup>
          <SidebarGroupContent>
            <SearchResults
              chats={searchState.results}
              query={searchState.query}
              isLoading={searchState.isLoading}
              onChatClick={handleChatClick}
              minChars={minChars}
            />
          </SidebarGroupContent>
        </SidebarGroup>
      ) : (
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarHistory user={user} />
          </SidebarGroupContent>
        </SidebarGroup>
      )}
    </>
  );
}
