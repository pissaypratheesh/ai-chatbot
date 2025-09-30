"use client";

import { useState } from "react";
import { SearchBar } from "@/components/search/SearchBar";
import { SearchResults } from "@/components/search/SearchResults";
import { useSearch } from "@/hooks/useSearch";

/**
 * Test component to demonstrate race condition prevention
 * This component shows how the search handles rapid typing scenarios
 */
export function SearchRaceConditionTest() {
  const [testLogs, setTestLogs] = useState<string[]>([]);
  
  const { searchState, handleSearch, handleClear, handleChatClick } = useSearch({
    onChatClick: (chatId: string) => {
      addLog(`Chat clicked: ${chatId}`);
    },
    minChars: 2,
  });

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setTestLogs(prev => [...prev.slice(-9), `${timestamp}: ${message}`]);
  };

  const handleTestSearch = (query: string) => {
    addLog(`Search triggered: "${query}"`);
    handleSearch(query);
  };

  const handleTestClear = () => {
    addLog("Search cleared");
    handleClear();
  };

  const simulateRapidTyping = () => {
    addLog("🧪 Starting rapid typing test...");
    
    // Simulate rapid typing scenario
    const testSequence = ["s", "se", "sea", "sear", "search", "searc", "search"];
    
    testSequence.forEach((query, index) => {
      setTimeout(() => {
        addLog(`Typing: "${query}"`);
        handleTestSearch(query);
      }, index * 100); // 100ms between each keystroke
    });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Search Race Condition Test</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Search Interface */}
        <div className="space-y-4">
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold mb-2">Search Interface</h3>
            <SearchBar
              onSearch={handleTestSearch}
              onClear={handleTestClear}
              isLoading={searchState.isLoading}
              placeholder="Test rapid typing..."
              minChars={2}
            />
            
            <div className="mt-4">
              <button
                onClick={simulateRapidTyping}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                🧪 Simulate Rapid Typing
              </button>
            </div>
          </div>

          {/* Search Results */}
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold mb-2">Search Results</h3>
            <SearchResults
              chats={searchState.results}
              query={searchState.query}
              isLoading={searchState.isLoading}
              onChatClick={handleChatClick}
              minChars={2}
            />
          </div>
        </div>

        {/* Test Logs */}
        <div className="space-y-4">
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold mb-2">Test Logs</h3>
            <div className="bg-gray-100 p-3 rounded text-sm font-mono max-h-96 overflow-y-auto">
              {testLogs.length === 0 ? (
                <div className="text-gray-500">No logs yet. Try typing or click the test button.</div>
              ) : (
                testLogs.map((log, index) => (
                  <div key={index} className="mb-1">
                    {log}
                  </div>
                ))
              )}
            </div>
            <button
              onClick={() => setTestLogs([])}
              className="mt-2 px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
            >
              Clear Logs
            </button>
          </div>

          {/* Instructions */}
          <div className="p-4 border rounded-lg bg-blue-50">
            <h3 className="font-semibold mb-2">Test Instructions</h3>
            <ul className="text-sm space-y-1">
              <li>• Type rapidly in the search box</li>
              <li>• Watch the console for request cancellation logs</li>
              <li>• Notice only the latest results are shown</li>
              <li>• Click "Simulate Rapid Typing" for automated test</li>
              <li>• Check browser console for detailed logs</li>
              <li>• <strong>Keyboard Navigation:</strong></li>
              <li>  - ↑↓ Arrow keys to navigate results</li>
              <li>  - Enter to select highlighted result</li>
              <li>  - Home/End to jump to first/last result</li>
              <li>  - Escape to clear search</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
