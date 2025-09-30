# 🗄️ Database Viewer & Search Implementation

This document explains how to access and use the PostgreSQL database viewer and search functionality.

## 🌐 **Database Viewer Access**

### **No Need to Run Script Each Time!**

The database viewer is **always available** at:
```
http://localhost:3000/db-viewer.html
```

You only need to run `./open-db-viewer.sh` if you want to **automatically open it in your browser**. The viewer itself is permanently accessible as long as your Next.js server is running.

### **How to Access:**

1. **Automatic (Recommended):**
   ```bash
   ./open-db-viewer.sh
   ```
   This opens the viewer in your default browser.

2. **Manual:**
   - Open your browser
   - Navigate to: `http://localhost:3000/db-viewer.html`

3. **Direct API Access:**
   ```bash
   # Get database overview
   curl "http://localhost:3000/api/db-viewer?table=overview"
   
   # Get all chats
   curl "http://localhost:3000/api/db-viewer?table=chats"
   
   # Get all messages
   curl "http://localhost:3000/api/db-viewer?table=messages"
   
   # Get all users
   curl "http://localhost:3000/api/db-viewer?table=users"
   ```

## 🔍 **Search API Endpoints**

### **Search Chats**
```bash
# Search for chats containing "greeting"
curl "http://localhost:3000/api/search?q=greeting&limit=5"

# Search for chats containing "javascript"  
curl "http://localhost:3000/api/search?q=javascript&limit=5"

# Search with pagination
curl "http://localhost:3000/api/search?q=test&limit=10&offset=0"
```

### **Get All Chats**
```bash
# Get all chats with pagination
curl "http://localhost:3000/api/chats?limit=20&offset=0"

# Get chats for specific user
curl "http://localhost:3000/api/chats?userId=USER_ID&limit=10"
```

### **Get Specific Chat**
```bash
# Get chat by ID
curl "http://localhost:3000/api/chats/CHAT_ID"
```

## 🚀 **Frontend Search Integration**

### **Current Status:**
- ✅ **Mock Service** - Uses sample data for development
- ✅ **Real Service** - Uses actual PostgreSQL database
- ✅ **Service Switching** - Easy toggle between mock and real

### **Service Configuration:**
```typescript
// lib/config/searchConfig.ts
export const SEARCH_CONFIG = {
  USE_MOCK_SERVICE: false, // Currently using real database
  API_BASE_URL: "/api",
  ENABLE_LOGGING: true,
};
```

### **How to Switch Services:**
```typescript
// Switch to mock service (for development)
SearchServiceFactory.switchToMockService();

// Switch to real service (for production)
SearchServiceFactory.switchToRealService();
```

## 🗄️ **Database Schema**

### **Tables:**
- **`Chat`** - Chat conversations
- **`Message_v2`** - Chat messages (new format)
- **`User`** - User accounts
- **`Vote_v2`** - Message votes/ratings

### **Search Indexes:**
- **`idx_chat_title_gin`** - Fast full-text search on chat titles
- **`idx_message_content_gin`** - Fast full-text search on message content
- **`idx_chat_search_composite`** - Composite index for relevance scoring
- **`idx_message_chat_created`** - Efficient message-chat joins

### **Custom Functions:**
- **`calculate_search_relevance()`** - Calculate search relevance scores
- **`extract_message_text()`** - Extract text from message JSON
- **`refresh_chat_search_index()`** - Refresh materialized view

## 🔧 **Development Setup**

### **Prerequisites:**
- PostgreSQL running on `localhost:5432`
- Next.js development server running on `localhost:3000`
- Database connection: `postgresql://postgres:postgres@localhost:5432/postgres`

### **Start Development:**
```bash
# Start the Next.js server
npm run dev

# Or with database environment
npm run dev:full
```

### **Database Migrations:**
```bash
# Run database migrations
npm run db:migrate

# Generate new migrations
npm run db:generate

# Open Drizzle Studio (alternative database viewer)
npm run db:studio
```

## 📊 **Current Database Content**

Your PostgreSQL database contains:
- **2 chats** (including searchable content)
- **4 messages** (with JSON parts structure)
- **21 users** (authentication data)

### **Searchable Content:**
- **"Simple Greeting Interaction"** - Matches "greeting" searches
- **"JavaScript Code for Implementing Binary Search Algorithm"** - Matches "javascript" searches

## 🎯 **Search Features**

### **Frontend Features:**
- ✅ **Real-time search** with 2-character minimum
- ✅ **Keyboard navigation** (↑↓ arrows, Enter, Escape)
- ✅ **Request cancellation** to prevent race conditions
- ✅ **Loading states** and error handling
- ✅ **Focus management** during search

### **Backend Features:**
- ✅ **Full-text search** with PostgreSQL tsvector
- ✅ **Relevance scoring** (title matches get higher scores)
- ✅ **Cross-field search** (titles + message content)
- ✅ **Pagination** support
- ✅ **Input validation** and error handling

## 🔄 **Service Architecture**

### **File Structure:**
```
lib/
├── mock/
│   └── searchMockData.ts      # Mock service with sample data
├── services/
│   └── searchService.ts      # Real API service implementation
├── config/
│   └── searchConfig.ts       # Service configuration
└── db/
    ├── queries.ts            # Database queries and connection
    ├── schema.ts             # Database schema definitions
    └── migrations/           # Database migration files

app/api/
├── search/route.ts           # Search API endpoint
├── chats/route.ts            # Chats API endpoint
├── chats/[id]/route.ts       # Individual chat API endpoint
└── db-viewer/route.ts        # Database viewer API endpoint

components/search/             # Frontend search components
hooks/useSearch.ts            # Search hook with service integration
```

### **Service Switching:**
```typescript
// The service factory automatically chooses the right service
const searchService = SearchServiceFactory.getService();

// Check current service
const isUsingMock = SearchServiceFactory.isUsingMockService();
console.log(`Using ${isUsingMock ? 'Mock' : 'Real'} service`);
```

## 🧪 **Testing**

### **API Testing:**
```bash
# Test all search endpoints
curl "http://localhost:3000/api/search?q=test&limit=5"
curl "http://localhost:3000/api/chats?limit=5"
curl "http://localhost:3000/api/chats/CHAT_ID"
```

### **Frontend Testing:**
1. Open `http://localhost:3000`
2. Use the search bar in the sidebar
3. Type at least 2 characters
4. Test keyboard navigation (↑↓ arrows, Enter, Escape)

### **Database Testing:**
1. Open `http://localhost:3000/db-viewer.html`
2. Navigate between Overview, Chats, Messages, Users tabs
3. Verify search results match database content

## 🚀 **Production Deployment**

### **Environment Variables:**
```bash
# .env.local (development)
POSTGRES_URL=postgresql://postgres:postgres@localhost:5432/postgres

# Production (Neon/other PostgreSQL service)
POSTGRES_URL=postgresql://username:password@host:port/database
```

### **Service Configuration:**
```typescript
// lib/config/searchConfig.ts
export const SEARCH_CONFIG = {
  USE_MOCK_SERVICE: false, // Use real database in production
  API_BASE_URL: "/api",
  ENABLE_LOGGING: false,   // Disable logging in production
};
```

## 📝 **Quick Reference**

### **Database Viewer:**
- **URL:** `http://localhost:3000/db-viewer.html`
- **Script:** `./open-db-viewer.sh` (optional - just opens browser)
- **API:** `http://localhost:3000/api/db-viewer?table=TABLE_NAME`

### **Search APIs:**
- **Search:** `GET /api/search?q=QUERY&limit=LIMIT&offset=OFFSET`
- **All Chats:** `GET /api/chats?limit=LIMIT&offset=OFFSET`
- **Chat by ID:** `GET /api/chats/CHAT_ID`

### **Service Switching:**
- **Mock Service:** `SearchServiceFactory.switchToMockService()`
- **Real Service:** `SearchServiceFactory.switchToRealService()`
- **Check Status:** `SearchServiceFactory.isUsingMockService()`

---

**🎉 Your search system is fully functional with real PostgreSQL data!**
