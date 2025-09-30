# Test Scripts

This folder contains various test scripts for validating different aspects of the Yupp chat application. Each script is designed to test specific functionality and can be run independently.

## 📁 Scripts Overview

### 🔐 Authentication & Session Tests

#### `test-auth-flow.sh`
**Purpose**: Tests the complete authentication flow including guest authentication and session management.

**What it tests**:
- Root route redirect behavior
- Guest authentication endpoint
- Session debug functionality
- Chat history API access

**How to run**:
```bash
chmod +x test-auth-flow.sh
./test-auth-flow.sh
```

**Prerequisites**: 
- Server running on `http://localhost:3000`
- `curl` and `jq` installed

---

### 🔍 Search API Tests

#### `test-search-api.js`
**Purpose**: Basic search API endpoint testing with simple queries.

**What it tests**:
- GET `/api/chats` - Retrieve all chats
- GET `/api/search` - Search functionality
- Query validation (minimum character requirements)
- Error handling for invalid requests

**How to run**:
```bash
node test-search-api.js
```

**Expected output**: Shows search results and validates query restrictions.

---

#### `test-api-direct.js`
**Purpose**: Comprehensive API testing with detailed response analysis.

**What it tests**:
- All chat endpoints (`/api/chats`)
- Search endpoints (`/api/search`)
- Individual chat retrieval (`/api/chats/[id]`)
- Request headers and response validation
- Error scenarios and edge cases

**How to run**:
```bash
node test-api-direct.js
```

**Features**:
- Detailed HTTP response analysis
- Header inspection
- JSON response formatting
- Error message validation

---

#### `test-all-apis.js`
**Purpose**: Comprehensive test suite covering all API endpoints with structured test cases.

**What it tests**:
- ✅ Get all chats with pagination
- ✅ Search functionality with various queries
- ✅ Input validation (short queries)
- ✅ Non-existent term handling
- ✅ Specific chat retrieval by ID
- ✅ 404 error handling for non-existent chats

**How to run**:
```bash
node test-all-apis.js
```

**Test cases**:
1. Get all chats (`/api/chats?limit=5`)
2. Search for "greeting" (`/api/search?q=greeting&limit=5`)
3. Search for "javascript" (`/api/search?q=javascript&limit=5`)
4. Short query validation (`/api/search?q=a&limit=5`) - should fail
5. Non-existent term search (`/api/search?q=nonexistent&limit=5`)
6. Specific chat retrieval (`/api/chats/[id]`)
7. Non-existent chat handling (`/api/chats/00000000-0000-0000-0000-000000000000`) - should fail

---

### 🗄️ Database & Service Tests

#### `test-search-services.js`
**Purpose**: Tests both Mock and Real search services, including service switching functionality.

**What it tests**:
- Mock service with dummy data
- Real service with PostgreSQL database
- Service switching capabilities
- Database content overview
- Title-only search functionality

**How to run**:
```bash
node test-search-services.js
```

**Features**:
- Tests multiple search queries
- Database statistics display
- Service configuration instructions
- Mock vs Real service comparison

**Service Types**:
- **Mock Service**: Uses dummy data, no database dependency
- **Real Service**: Uses PostgreSQL with title-only search

---

### 🐛 Bug Fix Validation

#### `test-date-fix.js`
**Purpose**: Validates the fix for date handling issues in chat data.

**What it tests**:
- Date parsing from API responses
- Type checking for date fields (`createdAt`, `lastMessageAt`)
- Date utility functions
- Error handling for malformed dates

**How to run**:
```bash
node test-date-fix.js
```

**Validates**:
- ✅ MockChat interface accepts `Date | string`
- ✅ SearchResults Chat interface accepts `Date | string`
- ✅ Safe date parsing functions
- ✅ Proper type checking and error handling

---

## 🚀 Quick Start

1. **Start your development server**:
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

2. **Run individual tests**:
   ```bash
   # Test authentication flow
   ./tests/scripts/test-auth-flow.sh
   
   # Test search APIs
   node tests/scripts/test-search-api.js
   
   # Test all APIs comprehensively
   node tests/scripts/test-all-apis.js
   ```

3. **Run all tests** (bash script):
   ```bash
   # Create a simple test runner
   for script in tests/scripts/test-*.js; do
     echo "Running $script..."
     node "$script"
     echo "---"
   done
   ```

## 📋 Prerequisites

- **Node.js** (v18+ recommended)
- **Development server** running on `http://localhost:3000`
- **Database** (PostgreSQL) for real service tests
- **curl** and **jq** for shell script tests

## 🔧 Configuration

### Environment Variables
Make sure these are set in your environment:
- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_SECRET` - Authentication secret
- `NEXTAUTH_URL` - Application URL (default: `http://localhost:3000`)

### Service Configuration
Edit `lib/config/searchConfig.ts` to switch between services:
```typescript
export const SEARCH_CONFIG = {
  USE_MOCK_SERVICE: true,  // true = mock, false = real
};
```

## 🐛 Troubleshooting

### Common Issues

1. **"Connection refused" errors**:
   - Ensure the development server is running
   - Check if the server is on the correct port (3000)

2. **Database connection errors**:
   - Verify PostgreSQL is running
   - Check `DATABASE_URL` environment variable
   - Run database migrations if needed

3. **Permission errors on shell scripts**:
   ```bash
   chmod +x tests/scripts/test-auth-flow.sh
   ```

4. **Missing dependencies**:
   ```bash
   npm install
   # or
   pnpm install
   ```

## 📊 Test Results Interpretation

### Success Indicators
- ✅ Green checkmarks indicate successful tests
- 📊 Data counts show expected results
- 🔍 Search results match expected patterns

### Failure Indicators
- ❌ Red X marks indicate test failures
- Error messages show specific issues
- Status codes help identify HTTP-level problems

## 🔄 Continuous Integration

These scripts can be integrated into CI/CD pipelines:

```yaml
# Example GitHub Actions workflow
- name: Run API Tests
  run: |
    npm run dev &
    sleep 10
    node tests/scripts/test-all-apis.js
```

## 📝 Adding New Tests

When adding new test scripts:

1. Follow the naming convention: `test-[feature].js`
2. Include comprehensive error handling
3. Add clear console output with emojis
4. Document prerequisites and expected behavior
5. Update this README with the new test description

## 🎯 Test Coverage

Current test coverage includes:
- ✅ Authentication flow
- ✅ Search API endpoints
- ✅ Database operations
- ✅ Error handling
- ✅ Service switching
- ✅ Date handling
- ✅ Input validation

Missing coverage:
- 🔄 Message API endpoints
- 🔄 User management
- 🔄 File upload functionality
- 🔄 Real-time features
