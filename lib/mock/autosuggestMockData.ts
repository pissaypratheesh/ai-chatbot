/**
 * Mock autosuggest data for development and testing
 * This file can be easily replaced with real API calls when backend is implemented
 */

export interface AutosuggestResult {
  id: string;
  text: string;
  type: 'completion' | 'question' | 'command' | 'suggestion';
  confidence: number;
}

/**
 * Mock autosuggest suggestions data
 * Simulates AI-generated suggestions based on partial input
 */
export const MOCK_AUTOSUGGEST_DATA: AutosuggestResult[] = [
  // Common completions for "tell me"
  {
    id: "1",
    text: "tell me about",
    type: "completion",
    confidence: 0.9,
  },
  {
    id: "2", 
    text: "tell me how to",
    type: "completion",
    confidence: 0.88,
  },
  {
    id: "3",
    text: "tell me more about",
    type: "completion", 
    confidence: 0.85,
  },
  {
    id: "3a",
    text: "tell me more about the benefits of",
    type: "completion",
    confidence: 0.8,
  },
  {
    id: "3b",
    text: "tell me more about how to",
    type: "completion",
    confidence: 0.8,
  },
  {
    id: "3c",
    text: "tell me more about the differences between",
    type: "completion",
    confidence: 0.8,
  },
  {
    id: "3d",
    text: "tell me more about the advantages of",
    type: "completion",
    confidence: 0.8,
  },
  {
    id: "3e",
    text: "tell me more about the process of",
    type: "completion",
    confidence: 0.8,
  },
  {
    id: "3f",
    text: "tell me more about the history of",
    type: "completion",
    confidence: 0.8,
  },
  {
    id: "3g",
    text: "tell me more about the features of",
    type: "completion",
    confidence: 0.8,
  },
  {
    id: "4",
    text: "tell me the difference between",
    type: "completion",
    confidence: 0.82,
  },
  {
    id: "5",
    text: "tell me why",
    type: "completion",
    confidence: 0.7,
  },
  
  // "What" questions
  {
    id: "6",
    text: "what are the benefits of",
    type: "question",
    confidence: 0.9,
  },
  {
    id: "6a",
    text: "what are the benefits of using",
    type: "question",
    confidence: 0.85,
  },
  {
    id: "6b",
    text: "what are the benefits of implementing",
    type: "question",
    confidence: 0.85,
  },
  {
    id: "6c",
    text: "what are the benefits of adopting",
    type: "question",
    confidence: 0.85,
  },
  {
    id: "7",
    text: "what is the best way to",
    type: "question",
    confidence: 0.88,
  },
  {
    id: "8",
    text: "what should I know about",
    type: "question",
    confidence: 0.85,
  },
  {
    id: "9",
    text: "what are the advantages of",
    type: "question",
    confidence: 0.82,
  },
  {
    id: "10",
    text: "what is the difference between",
    type: "question",
    confidence: 0.8,
  },
  
  // "How" questions
  {
    id: "11",
    text: "how does",
    type: "question",
    confidence: 0.9,
  },
  {
    id: "12",
    text: "how to",
    type: "question",
    confidence: 0.88,
  },
  {
    id: "13",
    text: "how can I",
    type: "question",
    confidence: 0.85,
  },
  {
    id: "14",
    text: "how do I",
    type: "question",
    confidence: 0.82,
  },
  {
    id: "15",
    text: "how would you",
    type: "question",
    confidence: 0.8,
  },
  
  // "Explain" commands
  {
    id: "16",
    text: "explain how to",
    type: "command",
    confidence: 0.9,
  },
  {
    id: "17",
    text: "explain the concept of",
    type: "command",
    confidence: 0.88,
  },
  {
    id: "18",
    text: "explain why",
    type: "command",
    confidence: 0.85,
  },
  {
    id: "19",
    text: "explain the difference between",
    type: "command",
    confidence: 0.82,
  },
  
  // "Help me" requests
  {
    id: "20",
    text: "help me with",
    type: "completion",
    confidence: 0.9,
  },
  {
    id: "21",
    text: "help me understand",
    type: "completion",
    confidence: 0.88,
  },
  {
    id: "22",
    text: "help me create",
    type: "completion",
    confidence: 0.85,
  },
  {
    id: "23",
    text: "help me write",
    type: "completion",
    confidence: 0.82,
  },
  
  // "Create" commands
  {
    id: "24",
    text: "create a",
    type: "command",
    confidence: 0.9,
  },
  {
    id: "25",
    text: "create an example of",
    type: "command",
    confidence: 0.88,
  },
  {
    id: "26",
    text: "create a function that",
    type: "command",
    confidence: 0.85,
  },
  {
    id: "27",
    text: "create a script to",
    type: "command",
    confidence: 0.82,
  },
  
  // "Write" commands
  {
    id: "28",
    text: "write a",
    type: "command",
    confidence: 0.9,
  },
  {
    id: "29",
    text: "write code to",
    type: "command",
    confidence: 0.88,
  },
  {
    id: "30",
    text: "write a function that",
    type: "command",
    confidence: 0.85,
  },
  {
    id: "31",
    text: "write a script for",
    type: "command",
    confidence: 0.82,
  },
  
  // "Show me" requests
  {
    id: "32",
    text: "show me how to",
    type: "suggestion",
    confidence: 0.9,
  },
  {
    id: "33",
    text: "show me an example of",
    type: "suggestion",
    confidence: 0.88,
  },
  {
    id: "34",
    text: "show me the steps to",
    type: "suggestion",
    confidence: 0.85,
  },
  
  // "Compare" requests
  {
    id: "35",
    text: "compare",
    type: "suggestion",
    confidence: 0.9,
  },
  {
    id: "36",
    text: "compare the pros and cons of",
    type: "suggestion",
    confidence: 0.88,
  },
  {
    id: "37",
    text: "compare these options",
    type: "suggestion",
    confidence: 0.85,
  },
  
  // "Generate" commands
  {
    id: "38",
    text: "generate a",
    type: "command",
    confidence: 0.9,
  },
  {
    id: "39",
    text: "generate code for",
    type: "command",
    confidence: 0.88,
  },
  {
    id: "40",
    text: "generate a list of",
    type: "command",
    confidence: 0.85,
  },
  
  // "Debug" requests
  {
    id: "41",
    text: "debug this",
    type: "suggestion",
    confidence: 0.9,
  },
  {
    id: "42",
    text: "debug my code",
    type: "suggestion",
    confidence: 0.88,
  },
  {
    id: "43",
    text: "debug the issue with",
    type: "suggestion",
    confidence: 0.85,
  },
  
  // "Optimize" requests
  {
    id: "44",
    text: "optimize this",
    type: "suggestion",
    confidence: 0.9,
  },
  {
    id: "45",
    text: "optimize performance",
    type: "suggestion",
    confidence: 0.88,
  },
  {
    id: "46",
    text: "optimize the code",
    type: "suggestion",
    confidence: 0.85,
  },
  
  // "Implement" commands
  {
    id: "47",
    text: "implement",
    type: "command",
    confidence: 0.9,
  },
  {
    id: "48",
    text: "implement a solution for",
    type: "command",
    confidence: 0.88,
  },
  {
    id: "49",
    text: "implement error handling",
    type: "command",
    confidence: 0.85,
  },
  
  // "Test" requests
  {
    id: "50",
    text: "test this",
    type: "suggestion",
    confidence: 0.9,
  },
  {
    id: "51",
    text: "test the functionality",
    type: "suggestion",
    confidence: 0.88,
  },
  {
    id: "52",
    text: "test my code",
    type: "suggestion",
    confidence: 0.85,
  },
];

/**
 * Mock autosuggest service that simulates API behavior
 * Uses hardcoded data with realistic delays and filtering
 */
export class MockAutosuggestService {
  /**
   * Mock autosuggest function that filters and ranks results based on input
   * @param input - Partial input text
   * @param signal - AbortSignal for request cancellation (ignored in mock)
   * @returns Promise<AutosuggestResult[]> - Filtered and ranked suggestions
   */
  static async getSuggestions(input: string, signal?: AbortSignal): Promise<AutosuggestResult[]> {
    // Simulate API delay - use fixed delay to avoid hydration issues
    const actualDelay = 150; // Fixed 150ms delay
    await new Promise(resolve => setTimeout(resolve, actualDelay));

    if (!input.trim()) {
      return [];
    }

    const inputLower = input.toLowerCase().trim();
    
    // Filter suggestions based on strict prefix matching only
    // Exclude exact matches - only show suggestions for partial matches
    const matchedSuggestions = MOCK_AUTOSUGGEST_DATA.filter(suggestion => {
      const suggestionLower = suggestion.text.toLowerCase();
      return suggestionLower.startsWith(inputLower) && suggestionLower !== inputLower;
    })
    .sort((a, b) => b.confidence - a.confidence) // Sort by confidence
    .slice(0, 5); // Limit to top 5 suggestions

    return matchedSuggestions;
  }


  /**
   * Mock function to get suggestions for empty input (starter suggestions)
   * @param signal - AbortSignal for request cancellation (ignored in mock)
   * @returns Promise<AutosuggestResult[]> - Starter suggestions
   */
  static async getStarterSuggestions(signal?: AbortSignal): Promise<AutosuggestResult[]> {
    const delay = 150; // Fixed delay to avoid hydration issues
    await new Promise(resolve => setTimeout(resolve, delay));
    
    return MOCK_AUTOSUGGEST_DATA
      .filter(suggestion => suggestion.confidence > 0.8)
      .slice(0, 3);
  }
}

/**
 * Future API service interface
 * This defines the contract for the real API service
 */
export interface AutosuggestService {
  getSuggestions(input: string, signal?: AbortSignal): Promise<AutosuggestResult[]>;
  getStarterSuggestions(signal?: AbortSignal): Promise<AutosuggestResult[]>;
}

/**
 * Service factory to easily switch between mock and real services
 */
export class AutosuggestServiceFactory {
  private static useMockService = true; // Default to mock, will be overridden by config

  static getService(): AutosuggestService {
    // Check configuration first
    try {
      const { AUTOSUGGEST_CONFIG } = require("../config/autosuggestConfig");
      if (AUTOSUGGEST_CONFIG.USE_MOCK_SERVICE !== undefined) {
        this.useMockService = AUTOSUGGEST_CONFIG.USE_MOCK_SERVICE;
      }
    } catch (error) {
      // If config fails to load, use default mock service
      console.warn("Failed to load autosuggest config, using mock service:", error);
    }

    if (this.useMockService) {
      return MockAutosuggestService;
    }
    
    // Import real service dynamically to avoid circular dependencies
    const { CancellableAutosuggestService } = require("../services/autosuggestService");
    return new CancellableAutosuggestService();
  }

  /**
   * Switch to real service when backend is ready
   */
  static switchToRealService(): void {
    this.useMockService = false;
    console.log("🔄 Switched to real autosuggest service");
  }

  /**
   * Switch back to mock service for development
   */
  static switchToMockService(): void {
    this.useMockService = true;
    console.log("🔄 Switched to mock autosuggest service");
  }

  /**
   * Check if currently using mock service
   */
  static isUsingMockService(): boolean {
    return this.useMockService;
  }
}