# Autosuggest Feature Implementation Plan

## Overview
Implement an AI-powered autosuggest feature similar to ChatGPT's, but with suggestions appearing **above** the input field instead of below, to accommodate the current UX/UI constraints.

## MVP Features
1. **Real-time AI suggestions** as user types
2. **Suggestions positioned above input** field
3. **Keyboard navigation** (arrow keys, Enter to accept)
4. **Debounced API calls** to prevent excessive requests
5. **Graceful error handling** and fallback states
6. **Minimal character threshold** before triggering suggestions

## Technical Architecture

### 1. API Endpoint
**File**: `app/api/autosuggest/route.ts`
- **Method**: POST
- **Purpose**: Generate AI-powered suggestions based on partial input
- **Input**: 
  ```typescript
  {
    text: string;           // Current input text
    chatId?: string;        // Optional chat context
    modelId: string;        // Selected AI model
  }
  ```
- **Output**:
  ```typescript
  {
    suggestions: string[];  // Array of suggestion strings
    error?: string;         // Error message if any
  }
  ```

### 2. Custom Hook
**File**: `hooks/useAutosuggest.ts`
- **Purpose**: Manage autosuggest state and API calls
- **Features**:
  - Debounced API calls (500ms delay)
  - Minimum character threshold (3+ characters)
  - Caching mechanism for recent suggestions
  - Loading states and error handling
  - Keyboard navigation state

### 3. Autosuggest Component
**File**: `components/autosuggest.tsx`
- **Purpose**: Render suggestion dropdown above input
- **Features**:
  - Positioned absolutely above input field
  - Smooth animations (fade in/out)
  - Keyboard navigation support
  - Click to select functionality
  - Responsive design

### 4. Integration Points
**File**: `components/multimodal-input.tsx`
- **Modifications**:
  - Add autosuggest hook integration
  - Position autosuggest component above input
  - Handle keyboard events for navigation
  - Manage focus states

## Implementation Details

### API Implementation
```typescript
// app/api/autosuggest/route.ts
export async function POST(request: Request) {
  const { text, chatId, modelId } = await request.json();
  
  // Validate input
  if (!text || text.length < 3) {
    return Response.json({ suggestions: [] });
  }
  
  // Use existing AI provider
  const model = myProvider.languageModel(modelId);
  
  // Generate suggestions using AI
  const result = await generateText({
    model,
    prompt: `Complete this partial message with helpful suggestions: "${text}"`,
    maxTokens: 50,
  });
  
  return Response.json({ 
    suggestions: parseSuggestions(result.text) 
  });
}
```

### Hook Implementation
```typescript
// hooks/useAutosuggest.ts
export function useAutosuggest(input: string, modelId: string) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  
  const debouncedFetchSuggestions = useDebouncedCallback(
    async (text: string) => {
      if (text.length < 3) {
        setSuggestions([]);
        return;
      }
      
      setIsLoading(true);
      try {
        const response = await fetch('/api/autosuggest', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text, modelId }),
        });
        
        const data = await response.json();
        setSuggestions(data.suggestions || []);
      } catch (error) {
        console.error('Autosuggest error:', error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    },
    500
  );
  
  useEffect(() => {
    debouncedFetchSuggestions(input);
  }, [input, debouncedFetchSuggestions]);
  
  return {
    suggestions,
    isLoading,
    selectedIndex,
    setSelectedIndex,
  };
}
```

### Component Implementation
```typescript
// components/autosuggest.tsx
interface AutosuggestProps {
  suggestions: string[];
  isLoading: boolean;
  selectedIndex: number;
  onSelect: (suggestion: string) => void;
  onKeyDown: (event: KeyboardEvent) => void;
  isVisible: boolean;
}

export function Autosuggest({
  suggestions,
  isLoading,
  selectedIndex,
  onSelect,
  onKeyDown,
  isVisible,
}: AutosuggestProps) {
  if (!isVisible || suggestions.length === 0) return null;
  
  return (
    <div className="absolute bottom-full left-0 right-0 mb-2 rounded-lg border bg-background shadow-lg">
      {suggestions.map((suggestion, index) => (
        <div
          key={index}
          className={`px-3 py-2 cursor-pointer transition-colors ${
            index === selectedIndex 
              ? 'bg-accent text-accent-foreground' 
              : 'hover:bg-muted'
          }`}
          onClick={() => onSelect(suggestion)}
        >
          {suggestion}
        </div>
      ))}
    </div>
  );
}
```

## Integration Strategy

### 1. MultimodalInput Modifications
- Add autosuggest hook
- Position autosuggest component above input
- Handle keyboard navigation
- Manage visibility states

### 2. Keyboard Navigation
- **Arrow Up/Down**: Navigate through suggestions
- **Enter**: Accept selected suggestion
- **Escape**: Close suggestions
- **Tab**: Accept first suggestion

### 3. Styling Considerations
- Position suggestions above input field
- Ensure proper z-index layering
- Responsive design for mobile/desktop
- Smooth animations and transitions

## Performance Optimizations

### 1. Debouncing
- 500ms delay before API call
- Cancel previous requests when new input arrives

### 2. Caching
- Cache recent suggestions in memory
- Avoid duplicate API calls for same input

### 3. Rate Limiting
- Minimum 3 characters before triggering
- Maximum 1 request per 500ms

### 4. Error Handling
- Graceful fallback when API fails
- No suggestions shown on error
- Console logging for debugging

## Testing Strategy

### 1. Unit Tests
- Hook functionality
- API endpoint responses
- Component rendering

### 2. Integration Tests
- End-to-end suggestion flow
- Keyboard navigation
- Error scenarios

### 3. Performance Tests
- Debouncing behavior
- API call frequency
- Memory usage

## Security Considerations

### 1. Input Validation
- Sanitize user input
- Limit suggestion length
- Prevent injection attacks

### 2. Rate Limiting
- Implement per-user rate limits
- Prevent abuse of API endpoint

### 3. Content Filtering
- Filter inappropriate suggestions
- Respect user preferences

## Future Enhancements (Post-MVP)

1. **Context-aware suggestions** based on chat history
2. **Personalized suggestions** based on user patterns
3. **Multi-language support**
4. **Suggestion categories** (questions, commands, etc.)
5. **Voice input integration**
6. **Suggestion analytics** and optimization

## Implementation Timeline

### Phase 1: Core Implementation (2-3 days)
- [ ] Create API endpoint
- [ ] Implement useAutosuggest hook
- [ ] Create Autosuggest component
- [ ] Basic integration with MultimodalInput

### Phase 2: Polish & Testing (1-2 days)
- [ ] Keyboard navigation
- [ ] Error handling
- [ ] Performance optimization
- [ ] Testing and bug fixes

### Phase 3: Final Integration (1 day)
- [ ] Styling and animations
- [ ] Mobile responsiveness
- [ ] Final testing and deployment

## Success Metrics

1. **Functionality**: Suggestions appear and work correctly
2. **Performance**: <200ms response time for suggestions
3. **UX**: Smooth keyboard navigation and selection
4. **Reliability**: Graceful error handling and fallbacks
5. **Adoption**: Users find suggestions helpful and use them

## Risk Mitigation

1. **API Failures**: Graceful degradation, no suggestions shown
2. **Performance Issues**: Debouncing and caching implemented
3. **UX Conflicts**: Careful positioning and z-index management
4. **Browser Compatibility**: Test across major browsers
5. **Mobile Experience**: Responsive design considerations

---

**Note**: This plan focuses on MVP features to ensure rapid implementation while maintaining code quality and user experience. The architecture is designed to be extensible for future enhancements.
