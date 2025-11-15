# Architecture Documentation

## Table of Contents

- [Executive Summary](#executive-summary)
- [High-Level Architecture](#high-level-architecture)
- [System Components](#system-components)
- [Component Relationships](#component-relationships)
- [Data Flow Architecture](#data-flow-architecture)
- [Deployment Architecture](#deployment-architecture)
- [Technology Stack](#technology-stack)
- [Design Decisions](#design-decisions)
- [Scalability Considerations](#scalability-considerations)
- [Security Architecture](#security-architecture)
- [Design Patterns](#design-patterns)
- [Future Architecture](#future-architecture)

---

## Executive Summary

The Minimalist CV application is a **server-rendered, statically-optimized web application** built on Next.js 14 with a GraphQL API layer. The architecture prioritizes:

- **Performance**: Sub-2s load times through SSR and edge optimization
- **Simplicity**: Single source of truth for data with zero runtime dependencies
- **Type Safety**: End-to-end TypeScript with GraphQL schema generation
- **Maintainability**: Clean separation of concerns and minimal abstractions
- **Portability**: Docker support and framework-agnostic API

### Architecture Characteristics

| Characteristic | Rating | Notes |
|----------------|--------|-------|
| **Performance** | ⭐⭐⭐⭐⭐ | Lighthouse 90+ all metrics |
| **Scalability** | ⭐⭐⭐⭐ | Horizontal scaling via serverless |
| **Security** | ⭐⭐⭐⭐ | Security headers, no sensitive data |
| **Maintainability** | ⭐⭐⭐⭐⭐ | Clean code, strong typing |
| **Portability** | ⭐⭐⭐⭐⭐ | Docker, Vercel, static export |
| **Complexity** | ⭐⭐ | Intentionally simple |

---

## High-Level Architecture

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT BROWSER                          │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐ │
│  │   HTML/CSS   │  │  JavaScript  │  │  Service Worker      │ │
│  │   (SSR)      │  │  (Hydration) │  │  (Future: PWA)       │ │
│  └──────────────┘  └──────────────┘  └──────────────────────┘ │
│                                                                 │
└────────────────────────────┬────────────────────────────────────┘
                             │
                 ┌───────────┴────────────┐
                 │  HTTPS (Port 443)      │
                 └───────────┬────────────┘
                             │
┌────────────────────────────┴────────────────────────────────────┐
│                     EDGE NETWORK (CDN)                          │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐ │
│  │ Static       │  │  Image       │  │  Cache Layer         │ │
│  │ Assets       │  │  Optimization│  │  (Vercel Edge)       │ │
│  └──────────────┘  └──────────────┘  └──────────────────────┘ │
│                                                                 │
└────────────────────────────┬────────────────────────────────────┘
                             │
                 ┌───────────┴────────────┐
                 │                        │
        ┌────────▼────────┐      ┌───────▼────────┐
        │                 │      │                │
        │  STATIC PAGES   │      │  API ROUTES    │
        │  (Pre-rendered) │      │  (Serverless)  │
        │                 │      │                │
        └────────┬────────┘      └───────┬────────┘
                 │                       │
                 │                       │
        ┌────────▼───────────────────────▼────────┐
        │      NEXT.JS APPLICATION LAYER          │
        │                                         │
        │  ┌──────────────┐  ┌─────────────────┐ │
        │  │ App Router   │  │ Server          │ │
        │  │ (Pages)      │  │ Components      │ │
        │  └──────────────┘  └─────────────────┘ │
        │                                         │
        │  ┌──────────────┐  ┌─────────────────┐ │
        │  │ GraphQL      │  │ Type System     │ │
        │  │ (Apollo)     │  │ (TypeScript)    │ │
        │  └──────────────┘  └─────────────────┘ │
        │                                         │
        └────────────────┬────────────────────────┘
                         │
                         │
                ┌────────▼────────┐
                │                 │
                │  DATA LAYER     │
                │                 │
                │  ┌───────────┐  │
                │  │ Resume    │  │
                │  │ Data File │  │
                │  │ (.tsx)    │  │
                │  └───────────┘  │
                │                 │
                └─────────────────┘
```

### Request Flow

```
User Request
     │
     ├─→ Static Asset Request (JS, CSS, Images)
     │   └─→ Edge CDN → Browser (Cached)
     │
     ├─→ Page Request (/)
     │   └─→ SSR → HTML → Browser → Hydration
     │
     └─→ API Request (/graphql)
         └─→ Serverless Function → GraphQL Resolver → Data → JSON
```

---

## System Components

### 1. Presentation Layer

**Location**: `src/app/` and `src/components/`

**Responsibilities**:
- Render UI components
- Handle user interactions
- Display resume data
- Manage loading/error states

**Key Components**:
```
src/app/
├── page.tsx                    # Main resume page
├── layout.tsx                  # Root layout
├── loading.tsx                 # Loading state
├── opengraph-image.tsx         # OG image generation
└── components/
    ├── Header.tsx              # Personal info section
    ├── Summary.tsx             # Professional summary
    ├── WorkExperience.tsx      # Employment history
    ├── Education.tsx           # Educational background
    ├── Skills.tsx              # Technical skills
    └── Projects.tsx            # Highlight projects
```

**Technology**:
- React 18 (Server Components)
- Next.js 14 App Router
- Tailwind CSS for styling

---

### 2. UI Component Library

**Location**: `src/components/ui/`

**Responsibilities**:
- Provide reusable UI primitives
- Ensure accessibility
- Maintain consistent design system

**Components**:
```
src/components/ui/
├── avatar.tsx                  # Profile picture
├── badge.tsx                   # Tags/labels
├── button.tsx                  # Interactive buttons
├── card.tsx                    # Content containers
├── command.tsx                 # Command palette
├── dialog.tsx                  # Modal dialogs
├── drawer.tsx                  # Slide-out panel
└── section.tsx                 # Section wrappers
```

**Technology**:
- Radix UI (accessible primitives)
- shadcn/ui (pre-styled components)
- class-variance-authority (variant management)

---

### 3. Data Layer

**Location**: `src/data/` and `src/lib/types.ts`

**Responsibilities**:
- Define resume data structure
- Store static resume content
- Provide type definitions

**Structure**:
```
src/data/
└── resume-data.tsx             # Single source of truth

src/lib/
└── types.ts                    # Type definitions
```

**Data Model**:
```typescript
ResumeData {
  ├── Personal Information (name, location, about, etc.)
  ├── Contact Information (email, phone, social links)
  ├── Work Experience[] (chronological)
  ├── Education[] (chronological)
  ├── Skills[]
  └── Projects[]
}
```

**Characteristics**:
- **Static**: No database, no CMS
- **Type-safe**: Full TypeScript coverage
- **Single file**: Easy to maintain and version

---

### 4. API Layer (GraphQL)

**Location**: `src/app/graphql/` and `src/apollo/`

**Responsibilities**:
- Expose resume data via GraphQL
- Handle API requests
- Transform data to API-compatible format

**Structure**:
```
src/apollo/
├── type-defs.ts                # GraphQL type definitions
└── resolvers.ts                # Query resolvers

src/app/graphql/
└── route.ts                    # API route handler
```

**Architecture**:
```
Request → Apollo Server → TypeGraphQL → Resolver → Data Transformation → Response
```

**Technology**:
- Apollo Server v4
- TypeGraphQL (decorator-based schema)
- Next.js Route Handlers

---

### 5. Utility Layer

**Location**: `src/lib/`

**Responsibilities**:
- Provide helper functions
- Type transformations
- Structured data generation

**Files**:
```
src/lib/
├── types.ts                    # Type definitions + transformers
├── utils.ts                    # General utilities (cn, etc.)
└── structured-data.ts          # JSON-LD for SEO
```

---

### 6. Error Handling Layer

**Location**: `src/components/`

**Responsibilities**:
- Catch and display errors gracefully
- Prevent full page crashes
- Provide user-friendly error messages

**Components**:
```
src/components/
├── error-boundary.tsx          # Global error boundary
├── section-error-boundary.tsx  # Section-specific errors
└── section-skeleton.tsx        # Loading states
```

**Error Handling Strategy**:
```
App
├── Global ErrorBoundary
│   └── Section ErrorBoundary (Header)
│       └── Suspense
│           └── Header Component
│   └── Section ErrorBoundary (Work)
│       └── Suspense
│           └── WorkExperience Component
│   └── ...
```

---

## Component Relationships

### Dependency Graph

```
                    ┌─────────────┐
                    │   page.tsx  │
                    │  (Root)     │
                    └──────┬──────┘
                           │
          ┌────────────────┼────────────────┐
          │                │                │
    ┌─────▼─────┐   ┌─────▼─────┐   ┌─────▼─────┐
    │ layout.tsx│   │ Components│   │CommandMenu│
    └─────┬─────┘   └─────┬─────┘   └─────┬─────┘
          │               │                │
    ┌─────▼─────┐   ┌─────▼─────┐   ┌─────▼─────┐
    │ Metadata  │   │ UI        │   │ Dialog    │
    │ Analytics │   │ Components│   │ Command   │
    └───────────┘   └─────┬─────┘   └───────────┘
                          │
                    ┌─────▼─────┐
                    │ Radix UI  │
                    │ Primitives│
                    └───────────┘


                    ┌─────────────┐
                    │ resume-data │
                    │    .tsx     │
                    └──────┬──────┘
                           │
          ┌────────────────┼────────────────┐
          │                │                │
    ┌─────▼─────┐   ┌─────▼─────┐   ┌─────▼─────┐
    │Components │   │ GraphQL   │   │Structured │
    │(direct)   │   │Resolver   │   │   Data    │
    └───────────┘   └─────┬─────┘   └───────────┘
                          │
                    ┌─────▼─────┐
                    │Type       │
                    │Transform  │
                    └───────────┘
```

### Data Flow Between Components

```
RESUME_DATA (Static)
      │
      ├──→ Page Components (Direct Import)
      │    └──→ Section Components
      │         └──→ UI Components
      │
      └──→ GraphQL Resolver
           └──→ Data Transformation
                └──→ API Response
```

---

## Data Flow Architecture

### 1. Server-Side Rendering (SSR) Flow

```
1. Client requests page (/)
        │
        ▼
2. Next.js Server receives request
        │
        ▼
3. Server Component executes
   - Import RESUME_DATA
   - Generate metadata
   - Render components to HTML
        │
        ▼
4. HTML streamed to client
        │
        ▼
5. Browser displays content (FCP)
        │
        ▼
6. React hydration begins
   - Load JavaScript bundle
   - Attach event listeners
   - Make interactive
        │
        ▼
7. Page fully interactive (TTI)
```

### 2. GraphQL API Flow

```
1. Client sends POST to /graphql
   Body: { query: "{ me { name } }" }
        │
        ▼
2. Next.js Route Handler receives request
        │
        ▼
3. Apollo Server processes query
   - Parse GraphQL query
   - Validate against schema
        │
        ▼
4. MeResolver.me() executes
   - Import RESUME_DATA
   - Call resumeDataToGraphQL()
        │
        ▼
5. Data transformation
   - Convert React nodes → strings
   - Strip UI-specific fields
   - Format for API
        │
        ▼
6. Apollo Server formats response
   - Wrap in { data: { me: {...} } }
   - Add error handling
        │
        ▼
7. JSON response sent to client
```

### 3. Build-Time Flow

```
1. Developer runs: bun run build
        │
        ▼
2. TypeScript compilation
   - Check types
   - Emit decorator metadata
        │
        ▼
3. Next.js build process
   - Analyze dependencies
   - Generate static pages
   - Create server bundles
        │
        ▼
4. Code optimization
   - Tree shaking
   - Minification (SWC)
   - Code splitting
        │
        ▼
5. Asset processing
   - CSS extraction
   - Image optimization
   - Font subsetting
        │
        ▼
6. Output to .next/ directory
   - Static assets → .next/static/
   - Server code → .next/server/
   - Build manifest
        │
        ▼
7. Ready for deployment
```

---

## Deployment Architecture

### Vercel Deployment

```
┌─────────────────────────────────────────────────────────────┐
│                    VERCEL EDGE NETWORK                      │
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐│
│  │ Global CDN  │  │   Caching   │  │  DDoS Protection    ││
│  │ (50+ PoPs)  │  │   Layer     │  │                     ││
│  └──────┬──────┘  └──────┬──────┘  └──────────┬──────────┘│
│         │                │                     │           │
└─────────┼────────────────┼─────────────────────┼───────────┘
          │                │                     │
          ▼                ▼                     ▼
┌─────────────────────────────────────────────────────────────┐
│              SERVERLESS INFRASTRUCTURE                      │
│                                                             │
│  ┌──────────────────────┐  ┌──────────────────────────┐   │
│  │  Static Pages        │  │  API Routes              │   │
│  │  (Pre-rendered)      │  │  (Lambda Functions)      │   │
│  │                      │  │                          │   │
│  │  - /                 │  │  - /graphql              │   │
│  │  - /opengraph-image  │  │    (Cold start: ~200ms)  │   │
│  │                      │  │    (Warm: ~50ms)         │   │
│  └──────────────────────┘  └──────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Docker Deployment

```
┌─────────────────────────────────────────────────────────────┐
│                      HOST MACHINE                           │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              DOCKER CONTAINER                        │  │
│  │                                                      │  │
│  │  ┌────────────────────────────────────────────────┐ │  │
│  │  │         Bun Runtime (Alpine Linux)            │ │  │
│  │  │                                               │ │  │
│  │  │  ┌─────────────────────────────────────────┐ │ │  │
│  │  │  │    Next.js Production Server            │ │ │  │
│  │  │  │    (Listening on port 3000)             │ │ │  │
│  │  │  │                                         │ │ │  │
│  │  │  │  - Static file serving                 │ │ │  │
│  │  │  │  - Server-side rendering               │ │ │  │
│  │  │  │  - API routes                          │ │ │  │
│  │  │  └─────────────────────────────────────────┘ │ │  │
│  │  └────────────────────────────────────────────────┘ │  │
│  │                                                      │  │
│  │  Volume Mounts:                                      │  │
│  │  - ./public → /app/public (optional)                 │  │
│  │  - ./.next → /app/.next (built assets)               │  │
│  │                                                      │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  Port Mapping: 3000:3000                                    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Technology Stack

### Frontend Stack

```
┌──────────────────────────────────────────┐
│           PRESENTATION LAYER             │
│                                          │
│  React 18.x (Server Components)          │
│  └─→ Concurrent Rendering                │
│  └─→ Suspense for Data Fetching          │
│  └─→ Automatic Batching                  │
└──────────────┬───────────────────────────┘
               │
┌──────────────▼───────────────────────────┐
│         FRAMEWORK LAYER                  │
│                                          │
│  Next.js 14.2.1 (App Router)             │
│  └─→ File-based Routing                  │
│  └─→ Server Components by Default        │
│  └─→ Built-in Image Optimization         │
│  └─→ Edge Runtime Support                │
└──────────────┬───────────────────────────┘
               │
┌──────────────▼───────────────────────────┐
│            STYLING LAYER                 │
│                                          │
│  Tailwind CSS 3.4.x                      │
│  └─→ JIT Compiler                        │
│  └─→ CSS Custom Properties               │
│  └─→ Print-optimized Styles              │
│                                          │
│  tailwindcss-animate                     │
│  └─→ Keyframe Animations                 │
└──────────────────────────────────────────┘
```

### Backend Stack

```
┌──────────────────────────────────────────┐
│            API LAYER                     │
│                                          │
│  Apollo Server 4.10.x                    │
│  └─→ GraphQL Query Processing            │
│  └─→ Error Handling                      │
│  └─→ Introspection (dev only)            │
└──────────────┬───────────────────────────┘
               │
┌──────────────▼───────────────────────────┐
│        SCHEMA GENERATION                 │
│                                          │
│  TypeGraphQL 2.0.0-beta.6                │
│  └─→ Decorator-based Schema              │
│  └─→ Type-safe Resolvers                 │
│  └─→ Automatic Schema Generation         │
│                                          │
│  reflect-metadata                        │
│  └─→ Runtime Type Information            │
└──────────────┬───────────────────────────┘
               │
┌──────────────▼───────────────────────────┐
│         INTEGRATION LAYER                │
│                                          │
│  @as-integrations/next 3.0.x             │
│  └─→ Next.js Route Handler Integration   │
│  └─→ Request/Response Transformation     │
└──────────────────────────────────────────┘
```

### Type System Stack

```
┌──────────────────────────────────────────┐
│         TypeScript 5.x                   │
│                                          │
│  Compiler Options:                       │
│  └─→ strict: true                        │
│  └─→ experimentalDecorators: true        │
│  └─→ emitDecoratorMetadata: true         │
│  └─→ target: ES2021                      │
└──────────────────────────────────────────┘
```

### UI Component Stack

```
┌──────────────────────────────────────────┐
│      COMPONENT PRIMITIVES                │
│                                          │
│  Radix UI                                │
│  └─→ @radix-ui/react-avatar              │
│  └─→ @radix-ui/react-dialog              │
│  └─→ @radix-ui/react-slot                │
│                                          │
│  Features:                               │
│  └─→ Unstyled (bring your own styles)    │
│  └─→ Accessible (ARIA compliant)         │
│  └─→ Keyboard Navigation                 │
└──────────────┬───────────────────────────┘
               │
┌──────────────▼───────────────────────────┐
│      STYLED COMPONENTS                   │
│                                          │
│  shadcn/ui (copied into codebase)        │
│  └─→ Pre-styled with Tailwind            │
│  └─→ Customizable                        │
│  └─→ Dark mode ready                     │
└──────────────┬───────────────────────────┘
               │
┌──────────────▼───────────────────────────┐
│       SPECIAL COMPONENTS                 │
│                                          │
│  cmdk 0.2.x                              │
│  └─→ Command Palette (Cmd+K)             │
│                                          │
│  vaul 0.8.x                              │
│  └─→ Drawer Component                    │
└──────────────────────────────────────────┘
```

### Build & Development Stack

```
┌──────────────────────────────────────────┐
│       PACKAGE MANAGER                    │
│                                          │
│  Bun 1.x                                 │
│  └─→ Fast package installation           │
│  └─→ Built-in TypeScript support         │
│  └─→ Docker-ready                        │
└──────────────┬───────────────────────────┘
               │
┌──────────────▼───────────────────────────┐
│       CODE QUALITY                       │
│                                          │
│  Biome.js 2.0.6                          │
│  └─→ Linting (replaces ESLint)           │
│  └─→ Formatting (replaces Prettier)      │
│  └─→ 10-20x faster                       │
│  └─→ Zero config                         │
└──────────────────────────────────────────┘
```

---

## Design Decisions

### Decision 1: Server Components by Default

**Context**: Next.js 14 App Router uses Server Components as the default.

**Decision**: Embrace Server Components, use Client Components only when needed.

**Rationale**:
- Smaller JavaScript bundles
- Faster initial page load
- Better SEO (fully rendered HTML)
- Reduced client-side processing

**Client Components Only**:
- `command-menu.tsx` (requires event listeners)
- `error-boundary.tsx` (uses React error handling)

**Trade-offs**:
- ✅ Better performance
- ✅ Improved SEO
- ⚠️ Learning curve for developers
- ⚠️ Some libraries incompatible

---

### Decision 2: Single Data File (No Database)

**Context**: Resume data is relatively static and small.

**Decision**: Store all data in `src/data/resume-data.tsx`.

**Rationale**:
- Simplicity (no database to maintain)
- Version control friendly (git tracks changes)
- Type-safe (TypeScript validation)
- Fast (no database queries)
- Portable (works anywhere)

**Trade-offs**:
- ✅ Zero infrastructure costs
- ✅ Instant deploys
- ✅ Easy to backup
- ❌ Not suitable for multi-user
- ❌ Requires code deploy to update

---

### Decision 3: TypeGraphQL Over Schema-First

**Context**: Need GraphQL API with type safety.

**Decision**: Use TypeGraphQL decorators to generate schema from TypeScript.

**Alternatives Considered**:
- Schema-first GraphQL (write `.graphql` files)
- Code-first with Nexus

**Rationale**:
- Single source of truth (TypeScript types)
- Automatic schema generation
- Type safety between TS and GraphQL
- Reduced boilerplate

**Trade-offs**:
- ✅ Type safety end-to-end
- ✅ Less code duplication
- ⚠️ Requires decorator support
- ⚠️ Slightly more complex setup

---

### Decision 4: Biome Over ESLint/Prettier

**Context**: Need linting and formatting for code quality.

**Decision**: Use Biome.js instead of ESLint + Prettier.

**Rationale**:
- 10-20x faster performance
- Single tool (vs two separate tools)
- Zero configuration needed
- Built in Rust (better performance)

**Trade-offs**:
- ✅ Much faster linting
- ✅ Simpler tooling
- ✅ Better DX
- ⚠️ Smaller ecosystem vs ESLint
- ⚠️ Fewer plugins available

---

### Decision 5: Tailwind CSS Over CSS-in-JS

**Context**: Need styling solution for components.

**Decision**: Use Tailwind CSS with utility-first approach.

**Alternatives Considered**:
- Styled Components
- CSS Modules
- Emotion

**Rationale**:
- Smaller bundle size (no runtime)
- Faster build times
- Easy to customize
- Print-friendly (pure CSS)
- Design system consistency

**Trade-offs**:
- ✅ Better performance (no JS runtime)
- ✅ Smaller bundles
- ✅ Easy to purge unused styles
- ⚠️ Learning curve for utility classes
- ⚠️ Verbose HTML in some cases

---

### Decision 6: Vercel Deployment First

**Context**: Need hosting for the application.

**Decision**: Optimize for Vercel, provide Docker as alternative.

**Rationale**:
- Zero-config deployment
- Automatic HTTPS
- Global CDN
- Serverless functions for API
- Free tier available

**Trade-offs**:
- ✅ Easiest deployment
- ✅ Excellent performance
- ✅ Free tier sufficient
- ⚠️ Vendor lock-in (mitigated by Docker)

---

## Scalability Considerations

### Current Scale

**Target**:
- **Users**: 1-1000 concurrent users
- **Requests**: < 10,000 requests/day
- **Data**: < 100KB static data
- **Geography**: Global (via CDN)

**Performance Targets**:
- Page load: < 2 seconds
- API response: < 200ms
- 99th percentile: < 3 seconds

---

### Horizontal Scaling (Serverless)

**Current Architecture** (Vercel):

```
Request → Load Balancer → Serverless Function (auto-scales)
```

**Benefits**:
- Automatic scaling (0 to thousands of instances)
- Pay-per-request pricing
- No server management
- Global distribution

**Limitations**:
- Cold start latency (~200ms)
- Execution time limit (10s on Vercel)
- Memory limit (1GB on Vercel)

**Mitigation**:
- Keep functions warm (regular pings)
- Optimize bundle size
- Cache responses at edge

---

### Vertical Scaling (Docker)

**Current Architecture** (Docker):

```
Nginx → Docker Container (Next.js) → Single Node.js Process
```

**Scaling Approach**:
1. Increase container resources (CPU, RAM)
2. Add more containers behind load balancer
3. Use container orchestration (Kubernetes)

**Recommended Setup for High Traffic**:

```
                   Load Balancer (Nginx)
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
   Container 1       Container 2       Container 3
   (4 vCPU, 8GB)    (4 vCPU, 8GB)    (4 vCPU, 8GB)
```

---

### Caching Strategy

**Multi-Layer Caching**:

```
Level 1: Browser Cache (24 hours for static assets)
   └─→ Cache-Control: public, max-age=86400

Level 2: CDN Cache (1 year for versioned assets)
   └─→ Cache-Control: public, max-age=31536000, immutable

Level 3: API Response Cache (5 minutes)
   └─→ Cache-Control: public, max-age=300
```

**Cache Invalidation**:
- Static assets: Automatic (hash-based filenames)
- HTML pages: On deploy (Vercel handles)
- API responses: Time-based (5 min TTL)

---

### Database Considerations (Future)

**If scaling beyond static data**:

**Option 1: PostgreSQL**
```
Vercel Postgres (Serverless SQL)
└─→ Auto-scaling
└─→ Connection pooling
└─→ Global replication
```

**Option 2: Redis**
```
Vercel KV (Redis)
└─→ For session storage
└─→ For API caching
```

**Migration Path**:
1. Keep static data as default
2. Add database for user-specific data
3. Cache database queries in Redis
4. Use CDN for static assets

---

## Security Architecture

### Security Layers

```
┌─────────────────────────────────────────────────────────┐
│                    NETWORK LAYER                        │
│  - HTTPS (TLS 1.3)                                      │
│  - DDoS Protection (Vercel)                             │
│  - Rate Limiting (hosting provider)                     │
└──────────────────┬──────────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────────┐
│                  APPLICATION LAYER                      │
│  - Security Headers (CSP, X-Frame-Options, etc.)        │
│  - Input Validation (GraphQL schema)                    │
│  - Error Sanitization (no stack traces in prod)         │
└──────────────────┬──────────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────────┐
│                    DATA LAYER                           │
│  - No sensitive data stored                             │
│  - Read-only API (no mutations)                         │
│  - Public data only                                     │
└─────────────────────────────────────────────────────────┘
```

### Security Headers

Implemented in `next.config.js`:

| Header | Purpose | Value |
|--------|---------|-------|
| `X-Content-Type-Options` | Prevent MIME sniffing | `nosniff` |
| `X-Frame-Options` | Prevent clickjacking | `SAMEORIGIN` |
| `X-XSS-Protection` | Enable browser XSS filter | `1; mode=block` |
| `Referrer-Policy` | Control referrer info | `origin-when-cross-origin` |
| `Permissions-Policy` | Restrict browser features | Restrictive |

**Missing** (should be added):
- Content Security Policy (CSP)
- Strict-Transport-Security (HSTS)

---

## Design Patterns

### 1. Layered Architecture

```
┌─────────────────────────────────────┐
│      Presentation Layer             │  (React Components)
├─────────────────────────────────────┤
│      Business Logic Layer           │  (Transformations, Utils)
├─────────────────────────────────────┤
│      Data Access Layer              │  (Resume Data, GraphQL)
├─────────────────────────────────────┤
│      Integration Layer              │  (Apollo, Next.js APIs)
└─────────────────────────────────────┘
```

### 2. Repository Pattern

```typescript
// Data repository (single source of truth)
export const RESUME_DATA: ResumeData = { /* ... */ };

// Consumers
import { RESUME_DATA } from '@/data/resume-data';
```

### 3. Adapter Pattern

```typescript
// Adapt internal types to external API
function resumeDataToGraphQL(data: ResumeData): GraphQLMe {
  // Transform React nodes → strings
  // Adapt structure for API consumption
}
```

### 4. Facade Pattern

```typescript
// Simple facade over Tailwind utility composition
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

### 5. Observer Pattern

```typescript
// React's built-in observer pattern
useEffect(() => {
  // Observe keyboard events
  document.addEventListener('keydown', handler);
  return () => document.removeEventListener('keydown', handler);
}, []);
```

---

## Future Architecture

### Phase 1: Current State

```
Static Resume → SSR → CDN → User
                ↓
              GraphQL API
```

**Characteristics**:
- Single user
- Static content
- No authentication
- Serverless deployment

---

### Phase 2: Multi-User Support (Future)

```
┌────────────────┐
│   Users DB     │  (PostgreSQL)
└───────┬────────┘
        │
┌───────▼────────┐
│  Auth Service  │  (NextAuth.js)
└───────┬────────┘
        │
┌───────▼────────────────────────┐
│  Dynamic Resume Generator      │
│  - Template Engine             │
│  - User-specific Data          │
│  - Custom Themes               │
└───────┬────────────────────────┘
        │
┌───────▼────────┐
│  Cache Layer   │  (Redis)
└───────┬────────┘
        │
   User Browser
```

### Phase 3: SaaS Platform (Future)

```
┌─────────────────────────────────────────────────────────┐
│                     MULTI-TENANT                        │
│                                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐  │
│  │  Tenant 1    │  │  Tenant 2    │  │  Tenant N   │  │
│  │  (User DB)   │  │  (User DB)   │  │  (User DB)  │  │
│  └──────┬───────┘  └──────┬───────┘  └──────┬──────┘  │
│         │                 │                  │         │
│         └─────────────────┼──────────────────┘         │
│                           │                            │
│  ┌────────────────────────▼─────────────────────────┐  │
│  │         Application Layer                        │  │
│  │  - Template Engine                               │  │
│  │  - Theme Customization                           │  │
│  │  - Export to PDF/DOCX                            │  │
│  │  - Analytics Dashboard                           │  │
│  └──────────────────────────────────────────────────┘  │
│                                                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │         Infrastructure                           │  │
│  │  - CDN (Cloudflare)                              │  │
│  │  - Database (PlanetScale)                        │  │
│  │  - Cache (Upstash Redis)                         │  │
│  │  - Search (Typesense)                            │  │
│  │  - Storage (S3)                                  │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

---

## Conclusion

The Minimalist CV architecture prioritizes **simplicity, performance, and maintainability** over premature optimization. The current design:

- ✅ Serves thousands of users without modifications
- ✅ Deploys in seconds with zero downtime
- ✅ Costs $0/month to run (excluding domain)
- ✅ Scales horizontally via serverless
- ✅ Maintains type safety end-to-end

**Key Architectural Strengths**:
1. **Stateless**: No database dependencies
2. **Type-safe**: Full TypeScript coverage
3. **Fast**: SSR + edge caching
4. **Portable**: Docker support
5. **Extensible**: Clear separation of concerns

**When to Refactor**:
- Multi-user support needed → Add authentication + database
- Real-time updates required → Add WebSocket layer
- User-generated content → Add storage + moderation
- International users → Add i18n + localization

---

**Document Version**: 1.0
**Last Updated**: 2025-11-15
**Status**: Production Ready
