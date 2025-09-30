# Vercel AI Chatbot - Enhanced with MCP Tools

A full-featured, hackable Next.js AI chatbot built by Vercel, enhanced with Model Context Protocol (MCP) tools for PostgreSQL database management and GitHub integration.

## 🚀 Features

- **Next.js 14** with App Router and React Server Components
- **AI SDK** with OpenAI integration (GPT-4o)
- **PostgreSQL Database** with local development and Neon production setup
- **MCP Integration** for enhanced database and GitHub management
- **shadcn/ui** components with Tailwind CSS
- **Auth.js** for authentication
- **File Storage** with Vercel Blob (optional)

## 🏗️ Project Architecture

```mermaid
graph TB
    subgraph "Frontend Layer"
        A[Next.js App Router] --> B[React Components]
        B --> C[shadcn/ui Components]
        B --> D[Chat Interface]
    end
    
    subgraph "AI Layer"
        E[AI SDK] --> F[OpenAI Provider]
        F --> G[GPT-4o Models]
        E --> H[Custom Provider]
    end
    
    subgraph "Database Layer"
        I[PostgreSQL Local] --> J[Chat History]
        I --> K[User Data]
        L[Neon Production] --> M[Production Data]
    end
    
    subgraph "MCP Tools"
        N[PostgreSQL MCP] --> O[Database Management]
        P[GitHub MCP] --> Q[Repository Operations]
        R[Filesystem MCP] --> S[File Operations]
    end
    
    subgraph "Authentication"
        T[Auth.js] --> U[User Sessions]
        T --> V[Guest Access]
    end
    
    A --> E
    E --> I
    E --> L
    N --> I
    P --> Q
    R --> S
    A --> T
```

## 📁 Project Structure

```mermaid
graph TD
    A[yupp/] --> B[app/]
    A --> C[components/]
    A --> D[lib/]
    A --> E[hooks/]
    A --> F[artifacts/]
    A --> G[public/]
    A --> H[tests/]
    A --> I[postgres_data/]
    
    B --> B1["(auth)/ - Authentication pages"]
    B --> B2["(chat)/ - Chat interface pages"]
    B --> B3["layout.tsx - Root layout"]
    B --> B4["globals.css - Global styles"]
    
    C --> C1["ui/ - shadcn/ui components"]
    C --> C2["chat.tsx - Main chat component"]
    C --> C3["message.tsx - Message components"]
    C --> C4["sidebar.tsx - Navigation sidebar"]
    
    D --> D1["ai/ - AI provider configuration"]
    D --> D2["db/ - Database schema & queries"]
    D --> D3["editor/ - Code editor components"]
    D --> D4["utils.ts - Utility functions"]
    
    E --> E1["use-messages.tsx - Chat state management"]
    E --> E2["use-artifact.ts - Artifact handling"]
    E --> E3["use-mobile.ts - Mobile detection"]
    
    F --> F1["code/ - Code artifact components"]
    F --> F2["image/ - Image artifact components"]
    F --> F3["text/ - Text artifact components"]
    
    I --> I1["base/ - Database files"]
    I --> I2["global/ - System catalogs"]
    I --> I3["pg_wal/ - Transaction logs"]
```

## 📂 Detailed Folder Structure

### `/app` - Next.js App Router
- **`(auth)/`** - Authentication routes and pages
  - `login/page.tsx` - User login page
  - `register/page.tsx` - User registration page
  - `auth.ts` - Auth.js configuration
- **`(chat)/`** - Chat interface routes
  - `page.tsx` - Main chat page
  - `chat/[id]/page.tsx` - Individual chat sessions
  - `api/chat/` - Chat API endpoints
  - `api/history/` - Chat history API
- **`layout.tsx`** - Root application layout
- **`globals.css`** - Global CSS styles

### `/components` - React Components
- **`ui/`** - shadcn/ui component library
  - `button.tsx`, `input.tsx`, `card.tsx` - Basic UI components
  - `sidebar.tsx` - Navigation sidebar
  - `sheet.tsx` - Modal/drawer components
- **`chat.tsx`** - Main chat interface component
- **`message.tsx`** - Individual message components
- **`elements/`** - Specialized chat elements
  - `code-block.tsx` - Code syntax highlighting
  - `image.tsx` - Image display components
  - `tool.tsx` - Tool execution components

### `/lib` - Core Logic
- **`ai/`** - AI provider configuration
  - `providers.ts` - OpenAI provider setup
  - `models.ts` - Model definitions
  - `tools/` - AI tools (weather, suggestions, etc.)
- **`db/`** - Database management
  - `schema.ts` - Database schema definitions
  - `queries.ts` - Database query functions
  - `migrate.ts` - Database migration scripts
  - `migrations/` - SQL migration files
- **`editor/`** - Code editor components
  - `config.ts` - Editor configuration
  - `functions.tsx` - Editor utility functions

### `/hooks` - React Hooks
- **`use-messages.tsx`** - Chat message state management
- **`use-artifact.ts`** - Artifact creation and management
- **`use-mobile.ts`** - Mobile device detection
- **`use-scroll-to-bottom.tsx`** - Auto-scroll functionality

### `/artifacts` - AI-Generated Content
- **`code/`** - Code generation artifacts
- **`image/`** - Image generation artifacts
- **`text/`** - Text generation artifacts
- **`sheet/`** - Spreadsheet artifacts

### `/tests` - Testing Suite
- **`e2e/`** - End-to-end tests
- **`pages/`** - Page-specific tests
- **`routes/`** - API route tests

### `/postgres_data` - Local Database
- **`base/`** - Database data files
- **`global/`** - System catalogs and metadata
- **`pg_wal/`** - Write-ahead log files
- **`postgresql.conf`** - Database configuration

## 🔧 Environment Configuration

### Local Development (`.env.local`)
```bash
# OpenAI API Key for AI chat functionality
OPENAI_API_KEY=your-openai-api-key-here

# Authentication secret
AUTH_SECRET=YXaCNPd2rwspjD+xPHr4BVnImqdFJOyD/NA3oHJnXdo=

# PostgreSQL database connection (local)
POSTGRES_URL=postgresql://postgres:postgres@localhost:5432/postgres
```

### Production (Vercel Environment Variables)
```bash
# OpenAI API Key
OPENAI_API_KEY=your-openai-api-key-here

# Authentication secret
AUTH_SECRET=your-production-auth-secret

# Neon PostgreSQL database connection
POSTGRES_URL=postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/neondb

# Optional: Vercel Blob storage
BLOB_READ_WRITE_TOKEN=your-blob-token

# Optional: Redis caching
REDIS_URL=your-redis-url
```

## 🛠️ MCP Tools Integration

### PostgreSQL MCP (`crystaldba/postgres-mcp`)
- **Database Health Analysis** - Index health, connection utilization
- **Index Tuning** - Advanced algorithms for optimal indexes
- **Query Plan Analysis** - EXPLAIN plans and performance optimization
- **Schema Intelligence** - Context-aware SQL generation

### GitHub MCP (`mcp-github`)
- **Repository Management** - Create, update, delete repositories
- **Issue & PR Operations** - Manage issues and pull requests
- **Code Search** - Search across repositories
- **GitHub API Integration** - Full GitHub API access

### Filesystem MCP
- **File Operations** - Read, write, create files
- **Project Management** - Navigate project structure
- **Code Exploration** - Analyze codebase

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and pnpm
- PostgreSQL (local development)
- OpenAI API key
- GitHub Personal Access Token (for MCP)

### Installation
```bash
# Clone and install dependencies
git clone <your-repo>
cd yupp
pnpm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your API keys

# Start PostgreSQL (if not running)
pg_ctl -D postgres_data -l postgres.log start

# Run database migrations
pnpm db:migrate

# Start development server
pnpm dev
```

### MCP Configuration
The MCP servers are configured in `~/.cursor/mcp.json`:
```json
{
  "mcpServers": {
    "postgresql": {
      "command": "postgres-mcp",
      "args": ["postgresql://postgres:postgres@localhost:5432/postgres"]
    },
    "github": {
      "command": "mcp-github",
      "env": { "GITHUB_TOKEN": "your-github-token" }
    },
    "filesystem": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-filesystem", "/path/to/project"]
    }
  }
}
```

## 🎯 Key Features Explained

### AI Chat System
- **Streaming Responses** - Real-time message streaming
- **Multi-modal Input** - Text, images, and files
- **Context Awareness** - Maintains conversation history
- **Tool Integration** - Can execute code, search web, etc.

### Database Management
- **Local Development** - PostgreSQL running locally
- **Production Ready** - Neon database for hosting
- **Migrations** - Automated schema updates
- **MCP Integration** - Advanced database tools

### Authentication
- **Guest Access** - No signup required for basic usage
- **User Accounts** - Full user management
- **Session Management** - Secure session handling

## 🔄 Development Workflow

1. **Local Development** - Use local PostgreSQL
2. **Testing** - Run tests with `pnpm test`
3. **Database Changes** - Create migrations in `/lib/db/migrations`
4. **Deployment** - Push to Vercel with Neon database
5. **MCP Tools** - Use Cursor with MCP servers for enhanced development

## 📚 Additional Resources

- [Vercel AI SDK Documentation](https://sdk.vercel.ai/)
- [Next.js App Router](https://nextjs.org/docs/app)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [Neon Database](https://neon.tech/)
- [Model Context Protocol](https://modelcontextprotocol.io/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.