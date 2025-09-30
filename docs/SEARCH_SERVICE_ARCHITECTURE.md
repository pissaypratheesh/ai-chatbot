# Search Service Architecture

This document explains how the search service is structured and how to switch between mock and real services. The implementation includes both frontend components and backend API endpoints with PostgreSQL integration.

## 📁 File Structure

```
lib/
├── mock/
│   └── searchMockData.ts          # Mock data and service factory
├── services/
│   └── searchService.ts           # Real API service implementation
├── config/
│   └── searchConfig.ts            # Service configuration
├── utils/
│   └── dateUtils.ts               # Date handling utilities
└── hooks/
    └── useSearch.ts               # Search hook using services

app/api/
├── search/
│   ├── route.ts                   # General search endpoint
│   └── titles/
│       └── route.ts               # Title-only search endpoint
├── chats/
│   ├── route.ts                   # All chats endpoint
│   └── [id]/
│       └── route.ts               # Single chat endpoint
└── db-viewer/
    └── route.ts                   # Database viewer API

components/search/
└── ServiceSwitcher.tsx            # UI component for service switching
```

## 🔄 Service Switching

### Current Setup (Both Services Available)
The application supports both mock and real services with easy switching:

- **Real Service (Default)**: Connects to PostgreSQL database via API endpoints
- **Mock Service**: Uses hardcoded data with variable delays for testing
- **Service Switcher**: UI component to toggle between services instantly

### Switching Methods

#### Method 1: UI Service Switcher (Recommended)
```typescript
// Use the ServiceSwitcher component in the sidebar
// Click the toggle button to switch between "Mock Service" and "Real Service"
// Changes take effect immediately
```

#### Method 2: Configuration File
```typescript
// lib/config/searchConfig.ts
export const SEARCH_CONFIG = {
  USE_MOCK_SERVICE: false, // Default: real service (set to true for mock)
  // ... other config
};
```

#### Method 3: Runtime Switching
```typescript
import { enableRealSearchService } from "@/lib/config/searchConfig";

// Switch to real service
enableRealSearchService();
```

#### Method 4: Direct Factory Call
```typescript
import { SearchServiceFactory } from "@/lib/mock/searchMockData";

// Switch to real service
SearchServiceFactory.switchToRealService();
```

## 🛠️ Implementation Status

### ✅ Completed Implementation

#### Backend API Endpoints
- ✅ `GET /api/search?q={query}` - General search with full-text search
- ✅ `GET /api/search/titles?q={query}` - Title-only search (used by real service)
- ✅ `GET /api/chats` - Get all chats with pagination
- ✅ `GET /api/chats/{id}` - Get chat by ID
- ✅ `GET /api/db-viewer` - Database viewer API

#### Database Integration
- ✅ PostgreSQL connection with environment-specific SSL configuration
- ✅ Database migrations with full-text search indexes
- ✅ GIN indexes for fast text search on titles and content
- ✅ Materialized view for search optimization
- ✅ Custom PostgreSQL functions for relevance scoring

#### Service Architecture
- ✅ Service factory pattern for easy switching
- ✅ Mock service with variable delays for testing
- ✅ Real service with AbortController support
- ✅ Request cancellation and race condition prevention
- ✅ Date handling for both Date objects and strings

#### Frontend Components
- ✅ ServiceSwitcher component for UI-based switching
- ✅ SearchBar with debouncing and keyboard navigation
- ✅ SearchResults with highlighting and selection
- ✅ Date utilities for consistent date formatting
- ✅ Error handling and loading states

## 🔧 Service Interface

Both mock and real services implement the same interface:

```typescript
interface SearchService {
  searchChats(query: string, signal?: AbortSignal): Promise<MockChat[]>;
  getAllChats(): Promise<MockChat[]>;
  getChatById(id: string): Promise<MockChat | null>;
}

// MockChat interface supports both Date objects and strings
interface MockChat {
  id: string;
  title: string;
  createdAt: Date | string; // Handles both mock Date objects and API strings
  visibility: "private" | "public";
  messageCount?: number;
  lastMessage?: string;
  lastMessageAt?: Date | string; // Handles both mock Date objects and API strings
}
```

## 📊 Service Comparison

### Mock Service
- **Data Source**: Hardcoded array of 10 sample chats
- **Search Method**: JavaScript filtering with case-insensitive matching
- **Performance**: Variable delays (200-1200ms) to simulate network conditions
- **Use Case**: Development, testing, and demonstration
- **Date Format**: JavaScript Date objects
- **Features**: Race condition testing, request cancellation simulation

### Real Service
- **Data Source**: PostgreSQL database via API endpoints
- **Search Method**: PostgreSQL ILIKE queries with GIN indexes
- **Performance**: ~50-200ms database queries with optimized indexes
- **Use Case**: Production environment with real user data
- **Date Format**: ISO string dates from PostgreSQL
- **Features**: Full-text search, relevance scoring, pagination

## 🗄️ Database Integration

### PostgreSQL Configuration
```typescript
// Environment-specific connection handling
const isLocal = POSTGRES_URL.includes('localhost');
const isNeon = POSTGRES_URL.includes('neon.tech');

const connectionConfig = {
  max: 20,
  idle_timeout: 20,
  connect_timeout: 10,
  ...(isNeon && {
    ssl: 'require' as const,
    max_lifetime: 60 * 30,
  }),
  ...(isLocal && {
    ssl: false,
    max_lifetime: 60 * 60,
  }),
};
```

### Search Indexes
```sql
-- GIN indexes for fast full-text search
CREATE INDEX idx_chat_title_gin ON "Chat" USING gin(to_tsvector('english', title));
CREATE INDEX idx_message_content_gin ON "Message_v2" USING gin(to_tsvector('english', parts::text));

-- Composite indexes for efficient queries
CREATE INDEX idx_chat_search_composite ON "Chat" ("createdAt" DESC, visibility);
CREATE INDEX idx_message_chat_created ON "Message_v2" ("chatId", "createdAt" DESC);
```

### API Endpoints

#### Title Search (`/api/search/titles`)
```typescript
// Used by RealSearchService for title-only search
GET /api/search/titles?q={query}&limit={limit}&offset={offset}

// Response format:
{
  "chats": [
    {
      "id": "uuid",
      "title": "Chat Title",
      "createdAt": "2025-09-29T10:45:55.361Z",
      "visibility": "private",
      "messageCount": 5,
      "lastMessage": "Last message content",
      "lastMessageAt": "2025-09-29T10:45:55.361Z"
    }
  ],
  "total": 1,
  "query": "search term",
  "limit": 10,
  "offset": 0,
  "searchType": "title-only"
}
```

#### General Search (`/api/search`)
```typescript
// Full-text search including message content
GET /api/search?q={query}&limit={limit}&offset={offset}

// Includes relevance scoring and message content search
```

## 📊 Mock Data

The mock service includes 10 sample chats with:
- Various topics (search, database, React, JavaScript, etc.)
- Different timestamps (1-12 days ago)
- Mixed visibility (private/public)
- Realistic message counts and content
- Variable delays for testing race conditions

## 🚀 Features

- **Seamless Switching**: No code changes needed in components
- **Request Cancellation**: Both services support AbortController
- **Race Condition Prevention**: Request ID tracking
- **Error Handling**: Consistent error handling across services
- **Logging**: Configurable logging for debugging
- **Type Safety**: Full TypeScript support
- **Date Handling**: Robust handling of Date objects and strings
- **Database Integration**: PostgreSQL with optimized indexes
- **Service Factory**: Easy switching between mock and real services
- **UI Toggle**: ServiceSwitcher component for instant switching

## 🧪 Testing

### Mock Service Testing
```typescript
// Test with mock data
const mockService = SearchServiceFactory.getService();
const results = await mockService.searchChats("search");
console.log(results); // Returns filtered mock data
```

### Real Service Testing
```typescript
// Test with real API
SearchServiceFactory.switchToRealService();
const realService = SearchServiceFactory.getService();
const results = await realService.searchChats("search");
console.log(results); // Returns data from PostgreSQL via API
```

### Database Testing
```bash
# Test API endpoints directly
curl "http://localhost:3000/api/search/titles?q=greeting&limit=5"
curl "http://localhost:3000/api/chats?limit=10"
curl "http://localhost:3000/api/db-viewer"

# View database in browser
open "http://localhost:3000/db-viewer.html"
```

## 🔍 Debugging

### Check Current Service
```typescript
import { getSearchServiceStatus } from "@/lib/config/searchConfig";

const status = getSearchServiceStatus();
console.log(status); // { isUsingMock: true, serviceType: "Mock" }
```

### Enable Logging
```typescript
// lib/config/searchConfig.ts
export const SEARCH_CONFIG = {
  ENABLE_LOGGING: true, // Enable detailed logging
  // ... other config
};
```

### Console Output Examples
```
🔍 Search service initialized: Mock
Request 1 completed successfully for query: "search" using Mock service
🔄 Switched to real search service
Request 2 completed successfully for query: "search" using Real service
```

## 📝 Development Tools

### Database Viewer
- **URL**: `http://localhost:3000/db-viewer.html`
- **Purpose**: Inspect PostgreSQL data in browser
- **Features**: View chats, messages, users, and search indexes
- **Helper Script**: `./open-db-viewer.sh`

### Service Switcher
- **Location**: Top of sidebar
- **Function**: Toggle between Mock and Real services
- **Visual**: Blue button for Mock, Green button for Real
- **Instant**: Changes take effect immediately

### API Testing
- **Search**: `/api/search/titles?q={query}`
- **Chats**: `/api/chats?limit={limit}&offset={offset}`
- **Single Chat**: `/api/chats/{id}`
- **Database Viewer**: `/api/db-viewer`

## 📝 Notes

- Mock service uses variable delays (200-1200ms) to simulate real network conditions
- Real service includes proper error handling and AbortController support
- All services maintain the same interface for easy switching
- Configuration is centralized for easy management
- Date handling supports both JavaScript Date objects and ISO strings
- PostgreSQL integration includes optimized indexes for fast search
- Service switching can be done via UI, configuration, or programmatically
- Database viewer provides web-based interface for development
- API endpoints support pagination and error handling
- Full-text search includes relevance scoring and message content search
