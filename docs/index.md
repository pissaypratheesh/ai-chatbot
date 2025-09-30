# 📚 Documentation Index

Welcome to the Vercel AI Chatbot documentation! This folder contains comprehensive documentation for the project, including implementation guides, architecture details, and deployment instructions.

## 📋 Documentation Overview

### 🏠 **Main Project Documentation**
- **[README_custom.md](./README_custom.md)** - Complete project overview with architecture diagrams, setup instructions, and MCP integration details

### 🔍 **Search Feature Documentation**
- **[SEARCH_IMPLEMENTATION_STATUS.md](./SEARCH_IMPLEMENTATION_STATUS.md)** - Current implementation status of the chat search feature with detailed technical specifications
- **[SEARCH_SERVICE_ARCHITECTURE.md](./SEARCH_SERVICE_ARCHITECTURE.md)** - Service architecture documentation explaining mock/real service switching and API integration
- **[CHAT_SEARCH_IMPLEMENTATION_PLAN.md](./CHAT_SEARCH_IMPLEMENTATION_PLAN.md)** - Long-term implementation plan for advanced search features

### 🗄️ **Database Documentation**
- **[DATABASE_VIEWER_README.md](./DATABASE_VIEWER_README.md)** - Guide for using the web-based database viewer and PostgreSQL integration
- **[NEON_DEPLOYMENT_GUIDE.md](./NEON_DEPLOYMENT_GUIDE.md)** - Step-by-step guide for deploying with Neon PostgreSQL

### 📝 **Development Documentation**
- **[BACKEND_SEARCH_IMPLEMENTATION.md](./BACKEND_SEARCH_IMPLEMENTATION.md)** - Backend search implementation details
- **[todo.md](./todo.md)** - Development task tracking
- **[prompts.md](./prompts.md)** - AI prompts and templates

## 🚀 Quick Start

1. **New to the project?** Start with [README_custom.md](./README_custom.md)
2. **Working on search features?** Check [SEARCH_IMPLEMENTATION_STATUS.md](./SEARCH_IMPLEMENTATION_STATUS.md)
3. **Need to understand services?** Read [SEARCH_SERVICE_ARCHITECTURE.md](./SEARCH_SERVICE_ARCHITECTURE.md)
4. **Working with the database?** See [DATABASE_VIEWER_README.md](./DATABASE_VIEWER_README.md)
5. **Deploying to production?** Follow [NEON_DEPLOYMENT_GUIDE.md](./NEON_DEPLOYMENT_GUIDE.md)

## 📊 Documentation Structure

```
docs/
├── README_custom.md                    # Main project documentation
├── SEARCH_IMPLEMENTATION_STATUS.md     # Current search implementation
├── SEARCH_SERVICE_ARCHITECTURE.md     # Service architecture details
├── CHAT_SEARCH_IMPLEMENTATION_PLAN.md # Future search enhancements
├── DATABASE_VIEWER_README.md          # Database viewer guide
├── NEON_DEPLOYMENT_GUIDE.md           # Production deployment guide
├── BACKEND_SEARCH_IMPLEMENTATION.md   # Backend implementation details
├── todo.md                            # Development task tracking
├── prompts.md                         # AI prompts and templates
└── index.md                           # This file
```

## 🎯 Key Features Documented

### ✅ **Implemented Features**
- **Search Functionality**: Complete frontend and backend implementation
- **Service Architecture**: Mock/Real service switching with factory pattern
- **Database Integration**: PostgreSQL with optimized indexes
- **Date Handling**: Robust handling of Date objects and strings
- **API Endpoints**: RESTful search and chat APIs
- **Database Viewer**: Web-based PostgreSQL data inspection
- **MCP Integration**: Model Context Protocol tools for enhanced development

### 🔄 **Future Enhancements**
- **Search Caching**: Redis implementation
- **Semantic Search**: OpenAI embeddings
- **Advanced Filtering**: Date ranges, visibility, etc.
- **Search Analytics**: User behavior tracking
- **Performance Optimization**: Virtual scrolling for large results

## 🛠️ Development Resources

### **API Endpoints**
- `GET /api/search/titles` - Title-only search
- `GET /api/search` - General search with full-text
- `GET /api/chats` - All chats with pagination
- `GET /api/chats/{id}` - Single chat by ID
- `GET /api/db-viewer` - Database viewer API

### **Database Tools**
- **Web Viewer**: `http://localhost:3000/db-viewer.html`
- **Helper Script**: `./open-db-viewer.sh`
- **MCP Integration**: PostgreSQL management via Cursor

### **Service Switching**
- **UI Toggle**: ServiceSwitcher component in sidebar
- **Configuration**: `lib/config/searchConfig.ts`
- **Factory Pattern**: `lib/mock/searchMockData.ts`

## 📝 Contributing to Documentation

When updating documentation:

1. **Keep it current**: Update docs when implementing new features
2. **Include examples**: Provide code snippets and usage examples
3. **Use diagrams**: Mermaid diagrams for complex concepts
4. **Test instructions**: Verify all setup and testing steps work
5. **Cross-reference**: Link related documentation sections

## 🔗 External Resources

- [Vercel AI SDK Documentation](https://sdk.vercel.ai/)
- [Next.js App Router](https://nextjs.org/docs/app)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [Neon Database](https://neon.tech/)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

---

**Last Updated**: January 2025  
**Project Version**: Enhanced Vercel AI Chatbot with Search & MCP Integration
