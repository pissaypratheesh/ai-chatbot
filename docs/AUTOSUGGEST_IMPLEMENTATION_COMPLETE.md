# Autosuggest Service Architecture

This document explains how the autosuggest service is structured and how to switch between mock and real services. The implementation includes both frontend components and backend API endpoints with AI integration.

## 📁 File Structure

```
lib/
├── mock/
│   └── autosuggestMockData.ts        # Mock data and service factory
├── services/
│   └── autosuggestService.ts         # Real API service implementation
├── config/
│   └── autosuggestConfig.ts          # Service configuration
└── hooks/
    └── useAutosuggest.ts             # Autosuggest hook using services

app/api/
└── autosuggest/
    └── route.ts                      # Autosuggest API endpoint (to be implemented)

components/
├── autosuggest.tsx                   # UI component with portal support
└── multimodal-input.tsx              # Main input component with autosuggest integration
```

## 🔄 Service Switching

### Current Setup (Mock Service Active)
The application supports both mock and real services with easy switching:

- **Mock Service (Default)**: Uses hardcoded suggestions with variable delays for testing
- **Real Service**: Will connect to AI API endpoints for dynamic suggestions
- **Service Factory**: Easy switching between services with configuration flags

### Switching Methods

#### Method 1: Configuration File (Recommended)
```typescript
// lib/config/autosuggestConfig.ts
export const AUTOSUGGEST_CONFIG = {
  USE_MOCK_SERVICE: true, // Default: mock service (set to false for real API)
  MIN_CHARS: 3,
  DEBOUNCE_DELAY: 500,
  MAX_SUGGESTIONS: 5,
  ENABLE_LOGGING: true,
};
```

#### Method 2: Runtime Switching
```typescript
import { enableRealAutosuggestService } from "@/lib/config/autosuggestConfig";

// Switch to real service
enableRealAutosuggestService();
```

#### Method 3: Direct Factory Call
```typescript
import { AutosuggestServiceFactory } from "@/lib/mock/autosuggestMockData";

// Switch to real service
AutosuggestServiceFactory.switchToRealService();
```

## 🛠️ Implementation Status

### ✅ Completed Implementation

#### Frontend Components
- ✅ `Autosuggest` component with portal support and keyboard navigation
- ✅ `useAutosuggest` hook with debouncing and request cancellation
- ✅ `MultimodalInput` integration with autosuggest functionality
- ✅ Service factory pattern for easy switching
- ✅ Mock service with variable delays for testing
- ✅ Real service interface with AbortController support
- ✅ Request cancellation and race condition prevention
- ✅ Visual feedback for keyboard navigation (blue highlight, border)

#### Service Architecture
- ✅ Service factory pattern for easy switching
- ✅ Mock service with realistic suggestion data
- ✅ Real service interface ready for API integration
- ✅ Request cancellation and race condition prevention
- ✅ Debouncing with configurable delays
- ✅ Error handling and graceful fallbacks

#### UI/UX Features
- ✅ Suggestions positioned above input field (`bottom-16` positioning)
- ✅ Keyboard navigation (Arrow Up/Down, Enter, Escape, Tab)
- ✅ Visual selection feedback (blue background, left border)
- ✅ Loading states and error handling
- ✅ Smooth transitions and hover effects
- ✅ Accessibility features (ARIA labels, roles)

### 🚧 Backend Implementation Needed

#### API Endpoints (To Be Implemented)
- ❌ `POST /api/autosuggest` - Generate AI-powered suggestions
- ❌ AI integration with existing model providers
- ❌ Suggestion caching and optimization
- ❌ Rate limiting and error handling

## 🔧 Service Interface

Both mock and real services implement the same interface:

```typescript
interface AutosuggestService {
  getSuggestions(
    text: string, 
    signal?: AbortSignal
  ): Promise<AutosuggestResult[]>;
}

interface AutosuggestResult {
  id: string;
  text: string;
  type: "completion" | "question" | "command" | "suggestion";
  confidence?: number;
}
```

## 📊 Service Comparison

### Mock Service
- **Data Source**: Hardcoded array of 5 "tell me" related suggestions
- **Search Method**: JavaScript filtering with case-insensitive matching
- **Performance**: Variable delays (200-800ms) to simulate network conditions
- **Use Case**: Development, testing, and demonstration
- **Features**: Race condition testing, request cancellation simulation

### Real Service (To Be Implemented)
- **Data Source**: AI API endpoints using existing model providers
- **Search Method**: AI-powered text completion and suggestion generation
- **Performance**: ~200-1000ms depending on AI model response time
- **Use Case**: Production environment with dynamic AI suggestions
- **Features**: Context-aware suggestions, confidence scoring, caching

## 🎨 UI Implementation Details

### Portal Support
The autosuggest component was designed with portal support to bypass CSS conflicts:

```typescript
// Portal implementation (currently not used due to CSS conflicts)
import { createPortal } from "react-dom";

// Render autosuggest directly to document.body
return createPortal(
  <div className="fixed bottom-16 left-1/2 transform -translate-x-1/2 z-[9999]">
    {/* Autosuggest content */}
  </div>,
  document.body
);
```

**Note**: Portal implementation was attempted but reverted due to aggressive CSS rules in `globals.css` that override positioning. Current implementation uses absolute positioning within the input container.

### Positioning Strategy
```typescript
// Current positioning in multimodal-input.tsx
<Autosuggest
  className="absolute bottom-16 left-0 right-0 z-[9999]"
  // ... other props
/>
```

- **`bottom-16`**: Positions suggestions 64px from bottom of container
- **`left-0 right-0`**: Full width of container
- **`z-[9999]`**: High z-index to appear above other elements

### Visual Feedback System
```typescript
// Enhanced visual feedback for keyboard navigation
const getSelectionStyles = (isSelected: boolean) => ({
  backgroundColor: isSelected ? '#dbeafe' : 'white', // blue-100 : white
  color: isSelected ? '#1e3a8a' : '#111827', // blue-900 : gray-900
  borderLeft: isSelected ? '4px solid #3b82f6' : 'none', // blue-500 border
});
```

## Configuration

### Mock vs Real API
```typescript
// In autosuggestConfig.ts
export const AUTOSUGGEST_CONFIG = {
  USE_MOCK_SERVICE: true, // Set to false for real API
  MIN_CHARS: 3,
  DEBOUNCE_DELAY: 500,
  MAX_SUGGESTIONS: 5,
  ENABLE_LOGGING: true,
};
```

### Switching Services
```typescript
// Switch to real API when backend is ready
import { enableRealAutosuggestService } from "@/lib/config/autosuggestConfig";
enableRealAutosuggestService();

// Or switch back to mock for development
import { enableMockAutosuggestService } from "@/lib/config/autosuggestConfig";
enableMockAutosuggestService();
```

## Testing

### Manual Testing
1. Start typing in the chat input (minimum 3 characters)
2. Suggestions should appear above the input field
3. Use arrow keys to navigate
4. Press Enter to accept a suggestion
5. Press Escape to close suggestions

### Automated Testing
```typescript
import { testAutosuggest } from "@/lib/test/autosuggestTest";
await testAutosuggest(); // Run in browser console
```

## Mock Data Structure

The mock service provides realistic suggestions with:
- **Completion suggestions**: "tell me about", "explain how to"
- **Question suggestions**: "what are the benefits of", "how does"
- **Command suggestions**: "write a function that", "generate a"
- **Contextual suggestions**: "debug this code", "optimize performance"

Each suggestion includes:
- `id`: Unique identifier
- `text`: Suggestion text
- `type`: Category (completion, question, command, suggestion)
- `confidence`: Relevance score (0-1)

## 🚀 Backend Implementation Guide

### Required API Endpoint

Create `app/api/autosuggest/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { myProvider } from "@/lib/ai/providers";
import { generateAutosuggestions } from "@/lib/ai/autosuggest";

export async function POST(request: NextRequest) {
  try {
    const { text, modelId = "gpt-4o", maxSuggestions = 5 } = await request.json();
    
    if (!text || text.length < 3) {
      return NextResponse.json({ suggestions: [] });
    }

    // Use existing AI provider
    const model = myProvider.languageModel(modelId);
    
    // Generate AI-powered suggestions
    const suggestions = await generateAutosuggestions(model, text, maxSuggestions);
    
    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error("Autosuggest API error:", error);
    return NextResponse.json(
      { error: "Failed to generate suggestions" },
      { status: 500 }
    );
  }
}
```

### AI Suggestion Generation

Create `lib/ai/autosuggest.ts`:

```typescript
import { LanguageModel } from "ai";
import type { AutosuggestResult } from "@/lib/mock/autosuggestMockData";

export async function generateAutosuggestions(
  model: LanguageModel,
  text: string,
  maxSuggestions: number = 5
): Promise<AutosuggestResult[]> {
  const prompt = `Generate ${maxSuggestions} autocomplete suggestions for the partial text: "${text}"

Return suggestions that:
1. Complete the user's thought naturally
2. Are contextually relevant and helpful
3. Vary in type (questions, commands, completions)
4. Are concise (under 50 characters)

Format as JSON array with: id, text, type, confidence
Types: "completion", "question", "command", "suggestion"`;

  const result = await model.generateText({
    prompt,
    maxTokens: 200,
    temperature: 0.7,
  });

  try {
    const suggestions = JSON.parse(result.text);
    return suggestions.map((s: any, index: number) => ({
      id: s.id || `ai-${index}`,
      text: s.text,
      type: s.type || "completion",
      confidence: s.confidence || 0.8,
    }));
  } catch (error) {
    console.error("Failed to parse AI suggestions:", error);
    return [];
  }
}
```

### Service Integration

Update `lib/services/autosuggestService.ts`:

```typescript
import type { AutosuggestResult } from "@/lib/mock/autosuggestMockData";

export class CancellableAutosuggestService {
  private baseUrl: string;

  constructor(baseUrl: string = "/api/autosuggest") {
    this.baseUrl = baseUrl;
  }

  async getSuggestions(
    text: string,
    signal?: AbortSignal
  ): Promise<AutosuggestResult[]> {
    const response = await fetch(this.baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        maxSuggestions: 5,
      }),
      signal,
    });

    if (!response.ok) {
      throw new Error(`Autosuggest API error: ${response.status}`);
    }

    const data = await response.json();
    return data.suggestions || [];
  }
}
```

### Configuration Update

Update `lib/config/autosuggestConfig.ts`:

```typescript
export const AUTOSUGGEST_CONFIG = {
  USE_MOCK_SERVICE: false, // Set to false for real API
  MIN_CHARS: 3,
  DEBOUNCE_DELAY: 500,
  MAX_SUGGESTIONS: 5,
  ENABLE_LOGGING: true,
  API_ENDPOINT: "/api/autosuggest",
};
```

## Performance Features

- **Debouncing**: Prevents excessive API calls
- **Request Cancellation**: Cancels stale requests
- **Caching**: Can be added for frequently requested suggestions
- **Rate Limiting**: Built into the configuration
- **Error Recovery**: Graceful fallback on API failures

## Accessibility

- **Keyboard Navigation**: Full keyboard support
- **Screen Reader**: Proper ARIA labels and roles
- **Focus Management**: Maintains focus during navigation
- **Visual Indicators**: Clear selection states and loading indicators

## 🧪 Testing

### Mock Service Testing
```typescript
// Test with mock data
const mockService = AutosuggestServiceFactory.getService();
const results = await mockService.getSuggestions("tell me");
console.log(results); // Returns filtered mock data
```

### Real Service Testing
```typescript
// Test with real API
AutosuggestServiceFactory.switchToRealService();
const realService = AutosuggestServiceFactory.getService();
const results = await realService.getSuggestions("tell me");
console.log(results); // Returns data from AI API
```

### Manual Testing
1. Start typing in the chat input (minimum 3 characters)
2. Suggestions should appear above the input field
3. Use arrow keys to navigate
4. Press Enter to accept a suggestion
5. Press Escape to close suggestions

## 🔍 Debugging

### Check Current Service
```typescript
import { getAutosuggestServiceStatus } from "@/lib/config/autosuggestConfig";

const status = getAutosuggestServiceStatus();
console.log(status); // { isUsingMock: true, serviceType: "Mock" }
```

### Enable Logging
```typescript
// lib/config/autosuggestConfig.ts
export const AUTOSUGGEST_CONFIG = {
  ENABLE_LOGGING: true, // Enable detailed logging
  // ... other config
};
```

## 📝 Development Tools

### Service Switcher
- **Location**: Configuration file or runtime switching
- **Function**: Toggle between Mock and Real services
- **Instant**: Changes take effect immediately

### API Testing
- **Autosuggest**: `POST /api/autosuggest` with `{ text: "tell me" }`
- **Response**: `{ suggestions: [...] }`

---

## 🎯 **COMPREHENSIVE BACKEND IMPLEMENTATION PROMPT**

**Use this prompt in a new chat to implement the backend:**

---

# Implement AI-Powered Autosuggest Backend for Next.js Chat Application

## Context
I have a Next.js chat application with a **fully functional frontend autosuggest feature** that currently uses mock data. The frontend is complete with:

- ✅ Service factory pattern for easy switching between mock/real services
- ✅ Debounced API calls with request cancellation
- ✅ Keyboard navigation and visual feedback
- ✅ Error handling and loading states
- ✅ Positioned above input field with proper styling

## Current Frontend Architecture

**Files already implemented:**
- `lib/mock/autosuggestMockData.ts` - Mock service with factory
- `lib/services/autosuggestService.ts` - Real service interface (needs API integration)
- `lib/config/autosuggestConfig.ts` - Configuration with `USE_MOCK_SERVICE: true`
- `hooks/useAutosuggest.ts` - Hook with debouncing and cancellation
- `components/autosuggest.tsx` - UI component with keyboard navigation
- `components/multimodal-input.tsx` - Integration with chat input

**Service Interface:**
```typescript
interface AutosuggestService {
  getSuggestions(text: string, signal?: AbortSignal): Promise<AutosuggestResult[]>;
}

interface AutosuggestResult {
  id: string;
  text: string;
  type: "completion" | "question" | "command" | "suggestion";
  confidence?: number;
}
```

## Required Backend Implementation

### 1. Create API Endpoint
**File:** `app/api/autosuggest/route.ts`

Requirements:
- Accept POST requests with `{ text: string, modelId?: string, maxSuggestions?: number }`
- Use existing AI provider from `@/lib/ai/providers` (myProvider)
- Generate 5 contextual suggestions based on partial text
- Return format: `{ suggestions: AutosuggestResult[] }`
- Handle errors gracefully with proper HTTP status codes
- Support request cancellation via AbortSignal

### 2. Create AI Suggestion Generator
**File:** `lib/ai/autosuggest.ts`

Requirements:
- Function: `generateAutosuggestions(model: LanguageModel, text: string, maxSuggestions: number)`
- Use AI model to generate contextual completions
- Return varied suggestion types (completion, question, command, suggestion)
- Include confidence scores
- Handle JSON parsing errors gracefully
- Optimize for speed (under 1 second response time)

### 3. Update Real Service Implementation
**File:** `lib/services/autosuggestService.ts`

Requirements:
- Implement `CancellableAutosuggestService` class
- Make HTTP POST requests to `/api/autosuggest`
- Support AbortController for request cancellation
- Handle network errors and API errors
- Return empty array on failure (graceful degradation)

### 4. Update Configuration
**File:** `lib/config/autosuggestConfig.ts`

Requirements:
- Add `API_ENDPOINT: "/api/autosuggest"`
- Add function to switch to real service: `enableRealAutosuggestService()`
- Add function to switch to mock service: `enableMockAutosuggestService()`
- Add service status checker: `getAutosuggestServiceStatus()`

## Technical Requirements

### AI Integration
- Use existing `myProvider` from `@/lib/ai/providers`
- Support multiple models (gpt-4o, gpt-4o-reasoning)
- Generate suggestions that complete user's thoughts naturally
- Include different types: completions, questions, commands, suggestions
- Keep suggestions concise (under 50 characters)

### Performance
- Response time under 1 second
- Support request cancellation
- Handle rate limiting
- Graceful error handling
- Caching considerations (optional)

### Error Handling
- Network errors → return empty array
- API errors → return empty array with logging
- Invalid input → return empty array
- AI model errors → fallback to basic suggestions

## Testing Requirements

### API Testing
```bash
# Test the endpoint
curl -X POST http://localhost:3000/api/autosuggest \
  -H "Content-Type: application/json" \
  -d '{"text": "tell me about", "maxSuggestions": 5}'
```

### Service Testing
```typescript
// Test real service
import { AutosuggestServiceFactory } from "@/lib/mock/autosuggestMockData";
AutosuggestServiceFactory.switchToRealService();
const service = AutosuggestServiceFactory.getService();
const suggestions = await service.getSuggestions("tell me");
```

### Frontend Integration
- Switch `USE_MOCK_SERVICE: false` in config
- Test typing "tell me" in chat input
- Verify suggestions appear above input
- Test keyboard navigation
- Test request cancellation

## Expected Behavior

1. **User types "tell me"** → API generates contextual suggestions
2. **Suggestions appear above input** → User can navigate with arrow keys
3. **User presses Enter** → Suggestion fills input field
4. **User continues typing** → Previous request cancelled, new suggestions generated
5. **API fails** → Graceful fallback, no suggestions shown

## Success Criteria

- ✅ API endpoint responds with valid suggestions
- ✅ Frontend seamlessly switches from mock to real service
- ✅ Request cancellation works properly
- ✅ Error handling prevents UI crashes
- ✅ Performance is acceptable (< 1s response time)
- ✅ Suggestions are contextually relevant and varied

## Files to Create/Modify

**Create:**
- `app/api/autosuggest/route.ts`
- `lib/ai/autosuggest.ts`

**Modify:**
- `lib/services/autosuggestService.ts` (implement real service)
- `lib/config/autosuggestConfig.ts` (add switching functions)

**Test:**
- Switch `USE_MOCK_SERVICE: false` in config
- Test in browser with real API calls

---

**Status**: ✅ **FRONTEND COMPLETE** | 🚧 **BACKEND IMPLEMENTATION NEEDED**  
**Priority**: High - Ready for production with AI integration  
**Estimated Time**: 2-3 hours for full backend implementation
