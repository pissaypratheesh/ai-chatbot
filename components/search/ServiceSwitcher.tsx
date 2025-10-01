"use client";

import { useState, useEffect } from "react";
import { SearchServiceFactory } from "@/lib/mock/searchMockData";
import { SEARCH_CONFIG } from "@/lib/config/searchConfig";

/**
 * Service Switcher Component
 * Allows easy switching between mock and real search services
 */
export function ServiceSwitcher() {
  const [isUsingMock, setIsUsingMock] = useState<boolean>(SEARCH_CONFIG.USE_MOCK_SERVICE);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Initialize service based on configuration
    if (SEARCH_CONFIG.USE_MOCK_SERVICE) {
      SearchServiceFactory.switchToMockService();
    } else {
      SearchServiceFactory.switchToRealService();
    }
    
    // Check current service status
    setIsUsingMock(SearchServiceFactory.isUsingMockService());
  }, []);

  const handleSwitch = async (useMock: boolean) => {
    setIsLoading(true);
    
    try {
      if (useMock) {
        SearchServiceFactory.switchToMockService();
        console.log("🔄 Switched to Mock Service");
      } else {
        SearchServiceFactory.switchToRealService();
        console.log("🔄 Switched to Real Service");
      }
      
      setIsUsingMock(useMock);
      
      // Show success message
      const message = useMock ? 
        "✅ Now using Mock Service (dummy data)" : 
        "✅ Now using Real Service (database data)";
      console.log(message);
      
    } catch (error) {
      console.error("Failed to switch service:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
      <h3 className="text-sm font-medium text-gray-900 mb-3">
        🔄 Search Service Switcher
      </h3>
      
      <div className="flex items-center space-x-4">
        <div className="flex items-center">
          <input
            id="mock-service"
            type="radio"
            name="service"
            checked={isUsingMock}
            onChange={() => handleSwitch(true)}
            disabled={isLoading}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
          />
          <label htmlFor="mock-service" className="ml-2 text-sm text-gray-700">
            Mock Service (Dummy Data)
          </label>
        </div>
        
        <div className="flex items-center">
          <input
            id="real-service"
            type="radio"
            name="service"
            checked={!isUsingMock}
            onChange={() => handleSwitch(false)}
            disabled={isLoading}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
          />
          <label htmlFor="real-service" className="ml-2 text-sm text-gray-700">
            Real Service (Database)
          </label>
        </div>
      </div>
      
      {isLoading && (
        <div className="mt-2 text-xs text-gray-500">
          Switching service...
        </div>
      )}
      
      <div className="mt-3 text-xs text-gray-500">
        {isUsingMock ? (
          <>
            <span className="text-orange-600">⚠️ Using Mock Data</span>
            <br />
            Search will return 10 sample chats with various topics
          </>
        ) : (
          <>
            <span className="text-green-600">✅ Using Real Database</span>
            <br />
            Search will return actual chats from PostgreSQL (title-only search)
          </>
        )}
      </div>
    </div>
  );
}
