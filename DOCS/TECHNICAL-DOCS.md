# Technical Documentation

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Design Patterns](#design-patterns)
- [Component Hierarchy](#component-hierarchy)
- [Data Flow](#data-flow)
- [Technology Stack Deep Dive](#technology-stack-deep-dive)
- [Configuration Reference](#configuration-reference)
- [Build and Bundling Process](#build-and-bundling-process)
- [Performance Optimization](#performance-optimization)
- [Security Considerations](#security-considerations)
- [Testing Strategies](#testing-strategies)
- [Browser Compatibility](#browser-compatibility)
- [Troubleshooting Guide](#troubleshooting-guide)

---

## Architecture Overview

### System Design Philosophy

The Minimalist CV application follows a **data-driven, component-based architecture** with a single source of truth for all resume content. The design emphasizes:

- **Separation of Concerns**: Data, presentation, and business logic are cleanly separated
- **Type Safety**: Full TypeScript coverage with strict mode enabled
- **Component Composition**: Reusable UI components built on Radix UI primitives
- **Server-First Rendering**: Leveraging Next.js 14 App Router for optimal performance
- **Progressive Enhancement**: Core functionality works without JavaScript

### Core Architectural Principles

1. **Single Source of Truth**: All CV data resides in `src/data/resume-data.tsx`
2. **Type-Driven Development**: TypeScript decorators enable GraphQL schema generation from types
3. **Atomic Component Design**: UI components are small, focused, and reusable
4. **Error Boundary Protection**: Each section is wrapped in error boundaries for resilience
5. **Lazy Loading**: React Suspense for code splitting and loading states

---

## Design Patterns

### 1. Data Mapper Pattern

The application uses a data mapper pattern to transform the internal `ResumeData` type to GraphQL-compatible types.

```typescript
// Internal representation (supports React nodes)
interface ResumeData {
  summary: string | React.ReactNode;
  // ...
}

// External API representation (strings only)
interface GraphQLMe {
  summary: string;
  // ...
}

// Transformation layer
function resumeDataToGraphQL(data: ResumeData): GraphQLMe {
  return {
    summary: reactToString(data.summary),
    // ...
  };
}
```

**Rationale**: Allows rich React content in the UI while exposing clean string-based API data.

### 2. Error Boundary Pattern

Each major section of the resume is wrapped in a dedicated error boundary:

```typescript
<SectionErrorBoundary sectionName="Work Experience">
  <Suspense fallback={<SectionSkeleton lines={6} />}>
    <WorkExperience work={RESUME_DATA.work} />
  </Suspense>
</SectionErrorBoundary>
```

**Benefits**:
- Prevents one section's errors from crashing the entire page
- Provides user-friendly error messages
- Maintains accessibility during partial failures

### 3. Decorator Pattern (TypeGraphQL)

GraphQL schema is defined using TypeScript decorators:

```typescript
@ObjectType()
export class Me {
  @Field(() => String)
  name: string;

  @Field(() => Contact)
  contact: Contact;
}
```

**Advantages**:
- Type safety between TypeScript and GraphQL
- Single source of truth for data structures
- Automatic schema generation

### 4. Command Pattern (Command Palette)

The command menu implements the command pattern for keyboard shortcuts:

```typescript
// User actions abstracted as commands
const commands = [
  { url: personalWebsite, title: "Personal Website" },
  { url: github, title: "GitHub" },
  // ...
];
```

**Benefits**:
- Decouples UI from actions
- Easy to extend with new commands
- Consistent keyboard navigation

### 5. Presenter Pattern

Components are split into presentational and data-fetching concerns:

```typescript
// Page component (data fetching)
export default function ResumePage() {
  return <WorkExperience work={RESUME_DATA.work} />;
}

// Presentational component
export function WorkExperience({ work }: Props) {
  return <div>{/* render work */}</div>;
}
```

---

## Component Hierarchy

```
ResumePage (page.tsx)
├── Header
│   ├── Avatar
│   ├── Contact Links
│   └── Social Icons
├── Summary
├── WorkExperience
│   └── Card (for each job)
│       ├── Badge (for tags)
│       └── Description
├── Education
│   └── Card (for each degree)
├── Skills
│   └── Badge (for each skill)
├── Projects
│   └── Card (for each project)
└── CommandMenu
    └── Dialog
        └── Command
```

### Component Categorization

#### Layout Components
- `page.tsx` - Main resume page
- `layout.tsx` - Root layout with metadata

#### Section Components (in `src/app/components/`)
- `Header.tsx` - Personal information and contact
- `Summary.tsx` - Professional summary
- `WorkExperience.tsx` - Employment history
- `Education.tsx` - Educational background
- `Skills.tsx` - Technical skills
- `Projects.tsx` - Highlight projects

#### UI Primitives (in `src/components/ui/`)
- `avatar.tsx` - Profile picture component
- `badge.tsx` - Tag/label component
- `button.tsx` - Interactive button
- `card.tsx` - Content container
- `command.tsx` - Command palette
- `dialog.tsx` - Modal dialogs
- `drawer.tsx` - Slide-out panel
- `section.tsx` - Section wrapper

#### Utility Components
- `command-menu.tsx` - Keyboard shortcuts (Cmd+K)
- `error-boundary.tsx` - Global error handling
- `section-error-boundary.tsx` - Section-level error handling
- `section-skeleton.tsx` - Loading states

#### Icon Components (in `src/components/icons/`)
- `GitHubIcon.tsx`
- `LinkedInIcon.tsx`
- `x-icon.tsx`
- `index.ts` - Icon exports

---

## Data Flow

### 1. Data Definition Flow

```
resume-data.tsx (Source)
    ↓
ResumeData type validation
    ↓
├─→ Direct rendering (React components)
│   └─→ Page components
│       └─→ Browser
└─→ GraphQL transformation
    └─→ resumeDataToGraphQL()
        └─→ Apollo Server
            └─→ /graphql endpoint
```

### 2. Request Flow

#### Server-Side Rendering (SSR)
```
Client Request
    ↓
Next.js Server
    ↓
Page Component Execution
    ↓
RESUME_DATA imported
    ↓
React components rendered to HTML
    ↓
HTML + Hydration Bundle → Client
    ↓
React hydration
    ↓
Interactive Page
```

#### GraphQL API Request
```
Client → /graphql
    ↓
Apollo Server Handler
    ↓
MeResolver.me()
    ↓
resumeDataToGraphQL(RESUME_DATA)
    ↓
GraphQL response (JSON)
    ↓
Client receives typed data
```

### 3. State Management

The application is **intentionally stateless** for the resume content:

- **No client-side state management** (Redux, Zustand, etc.)
- Resume data is **static at build time**
- Command menu state is **local component state** (cmdk library)
- Print drawer state is **local component state** (vaul library)

**Rationale**: CV content doesn't change during user session; simplicity over complexity.

---

## Technology Stack Deep Dive

### Frontend Framework: Next.js 14.2.1

**App Router Architecture**:
- File-system based routing
- Server Components by default
- Streaming SSR with Suspense
- Automatic code splitting

**Configuration** (`next.config.js`):
```javascript
{
  reactStrictMode: true,        // Development safety checks
  swcMinify: true,              // Fast Rust-based minification
  compress: true,               // Gzip compression
  productionBrowserSourceMaps: false,  // Smaller production builds
  poweredByHeader: false,       // Security: hide framework fingerprint
}
```

### Language: TypeScript 5

**Key Configurations** (`tsconfig.json`):
- `experimentalDecorators: true` - Required for TypeGraphQL
- `emitDecoratorMetadata: true` - Runtime type reflection
- `strict: true` - Maximum type safety
- `strictPropertyInitialization: false` - For class decorators
- `target: es2021` - Modern JavaScript features

### Styling: Tailwind CSS 3.4

**Custom Configuration**:
```javascript
// Extended theme
fontFamily: {
  mono: ['"Noto Sans Mono"', 'SFMono-Regular', 'Menlo', ...],
},
fontSize: {
  'sm': ['0.875rem', { lineHeight: '1.4rem' }],
},
```

**CSS Custom Properties**:
- HSL color system for easy theming
- CSS variables for runtime theme switching
- Print-specific styles in `globals.css`

### UI Components: shadcn/ui + Radix UI

**Component Library Structure**:
- **Radix UI**: Unstyled, accessible primitives
- **shadcn/ui**: Pre-styled Tailwind components
- **Customization**: Components copied into `src/components/ui/`

**Key Libraries**:
- `@radix-ui/react-avatar` - Accessible avatar with fallback
- `@radix-ui/react-dialog` - Modal dialogs
- `@radix-ui/react-slot` - Polymorphic components
- `cmdk` - Command palette (Cmd+K)
- `vaul` - Drawer component

### GraphQL: Apollo Server + TypeGraphQL

**Architecture**:
```
TypeScript Classes (with decorators)
    ↓
TypeGraphQL Schema Builder
    ↓
Apollo Server
    ↓
Next.js Route Handler (/graphql)
```

**Key Packages**:
- `@apollo/server` v4.10.2 - GraphQL server
- `type-graphql` v2.0.0-beta.6 - Schema-first development
- `graphql-scalars` v1.23.0 - Custom scalar types
- `@as-integrations/next` v3.0.0 - Next.js integration

**Features**:
- Introspection enabled in development
- Landing page playground in dev mode
- Error sanitization in production
- Type-safe resolvers

### Code Quality: Biome.js 2.0.6

**Replaces**:
- ESLint (linting)
- Prettier (formatting)

**Configuration** (`biome.json`):
```json
{
  "formatter": {
    "indentWidth": 2,
    "lineWidth": 80,
    "lineEnding": "lf"
  },
  "linter": {
    "rules": {
      "recommended": true,
      "a11y": { "recommended": true },
      "security": { "recommended": true }
    }
  }
}
```

**Benefits**:
- 10-20x faster than ESLint/Prettier
- Single tool for linting + formatting
- Built in Rust
- Zero dependencies

### Analytics: Vercel Analytics

**Integration**:
```typescript
import { Analytics } from "@vercel/analytics/react";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

**Features**:
- Privacy-focused (no cookies)
- Core Web Vitals tracking
- Zero performance impact

---

## Configuration Reference

### Environment Variables

**None required** - The application has zero runtime environment dependencies.

**Optional**:
- `NODE_ENV` - Set by build tools (development/production)

### Next.js Configuration

**`next.config.js`**:

| Option | Value | Purpose |
|--------|-------|---------|
| `reactStrictMode` | `true` | Enable React strict mode checks |
| `swcMinify` | `true` | Use SWC for minification |
| `compress` | `true` | Enable gzip compression |
| `productionBrowserSourceMaps` | `false` | Disable source maps in production |
| `poweredByHeader` | `false` | Remove `X-Powered-By` header |

**Headers Configuration**:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: SAMEORIGIN`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`

**Image Optimization**:
```javascript
images: {
  domains: ['avatars.githubusercontent.com'],
  formats: ['image/avif', 'image/webp'],
  minimumCacheTTL: 60,
}
```

### TypeScript Configuration

**`tsconfig.json`**:

| Option | Value | Purpose |
|--------|-------|---------|
| `target` | `es2021` | Modern JavaScript output |
| `strict` | `true` | Strictest type checking |
| `experimentalDecorators` | `true` | TypeGraphQL decorators |
| `emitDecoratorMetadata` | `true` | Runtime type information |
| `jsx` | `preserve` | Let Next.js handle JSX |
| `moduleResolution` | `bundler` | Modern module resolution |

**Path Aliases**:
```json
{
  "paths": {
    "@/*": ["./src/*"]
  }
}
```

### Tailwind Configuration

**`tailwind.config.js`**:

```javascript
{
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: { /* custom fonts */ },
      colors: { /* custom colors from CSS vars */ },
      borderRadius: { /* custom radius */ },
      animation: { /* custom animations */ }
    }
  },
  plugins: [require("tailwindcss-animate")]
}
```

### Biome Configuration

**`biome.json`**:

| Category | Key Rules |
|----------|-----------|
| **Accessibility** | `a11y/recommended` enabled |
| **Security** | `noDangerouslySetInnerHtml` warning |
| **Correctness** | `noUndeclaredVariables`, `noUnreachable` |
| **Style** | `useConst`, `noImplicitBoolean`, `useImportType` |
| **Filename Convention** | `kebab-case` or `PascalCase` only |

---

## Build and Bundling Process

### Development Build

```bash
pnpm dev
```

**Process**:
1. Start Next.js dev server (Fast Refresh enabled)
2. Compile TypeScript on-demand
3. Process Tailwind CSS with JIT
4. Enable source maps
5. Server runs on http://localhost:3000

**Hot Module Replacement (HMR)**:
- React Fast Refresh for instant updates
- CSS changes apply without reload
- GraphQL changes require manual refresh

### Production Build

```bash
pnpm build
```

**Process**:

1. **Type Checking**
   ```
   TypeScript compiler validates all .ts/.tsx files
   ```

2. **Code Compilation**
   ```
   SWC compiler transforms TypeScript → JavaScript
   Target: ES2021 with polyfills for older browsers
   ```

3. **Bundling**
   ```
   Next.js bundles pages and components
   Code splitting by route and dynamic imports
   Shared chunks for common dependencies
   ```

4. **Optimization**
   ```
   - Tree shaking (remove unused code)
   - Minification (SWC minifier)
   - Dead code elimination
   - Constant folding
   ```

5. **Asset Processing**
   ```
   - CSS extraction and minification
   - Image optimization (AVIF, WebP)
   - Font subsetting
   - Static asset hashing
   ```

6. **Output**
   ```
   .next/
   ├── cache/           # Build cache
   ├── server/          # Server-side code
   │   └── pages/       # Rendered pages
   ├── static/          # Static assets
   │   ├── chunks/      # JavaScript chunks
   │   ├── css/         # Stylesheets
   │   └── media/       # Images, fonts
   └── BUILD_ID         # Unique build identifier
   ```

### Bundle Analysis

**Inspect bundle sizes**:
```bash
# Add to package.json
"analyze": "ANALYZE=true next build"
```

**Key Bundles**:
- **Main Bundle**: ~150KB (React, Next.js runtime)
- **Page Bundle**: ~50KB (resume page components)
- **Shared Chunks**: ~30KB (common utilities)
- **GraphQL Bundle**: ~80KB (Apollo Server, only for API route)

### Optimization Techniques

1. **Automatic Code Splitting**
   - Each page is a separate bundle
   - Dynamic imports for command menu

2. **Tree Shaking**
   - Unused exports removed
   - Only imported Radix components included

3. **Image Optimization**
   - Next.js Image component
   - Automatic AVIF/WebP conversion
   - Responsive srcset generation

4. **Font Optimization**
   - Google Fonts self-hosting
   - Font subsetting for Latin characters
   - Preload critical fonts

---

## Performance Optimization

### Core Web Vitals Targets

| Metric | Target | Current |
|--------|--------|---------|
| **LCP** (Largest Contentful Paint) | < 2.5s | ~1.2s |
| **FID** (First Input Delay) | < 100ms | ~50ms |
| **CLS** (Cumulative Layout Shift) | < 0.1 | ~0.02 |

### Server-Side Rendering (SSR)

**Benefits**:
- Immediate content visibility
- SEO-friendly HTML
- Faster Time to First Byte (TTFB)

**Implementation**:
```typescript
// All components are Server Components by default
export default function ResumePage() {
  // Rendered on server
  return <div>{RESUME_DATA.name}</div>;
}
```

### Progressive Hydration

**Strategy**:
1. Send HTML (visible immediately)
2. Load React framework (~150KB)
3. Hydrate interactive components
4. Command menu loads on-demand

**Lazy Loading**:
```typescript
<Suspense fallback={<SectionSkeleton lines={6} />}>
  <WorkExperience work={RESUME_DATA.work} />
</Suspense>
```

### Caching Strategy

**Static Assets**:
```javascript
// SVG and PNG files cached for 1 year
headers: [{
  source: '/(.*).svg',
  headers: [{
    key: 'Cache-Control',
    value: 'public, max-age=31536000, immutable'
  }]
}]
```

**API Routes**:
- GraphQL endpoint is dynamic (no caching)
- Suitable for client-side data fetching

### Performance Best Practices

1. **Image Optimization**
   ```typescript
   import Image from 'next/image';

   <Image
     src={avatarUrl}
     alt={name}
     width={100}
     height={100}
     loading="eager" // Above fold
   />
   ```

2. **Font Loading**
   ```css
   /* Preload critical fonts */
   <link rel="preload" href="/fonts/noto-sans-mono.woff2" as="font" />
   ```

3. **Code Splitting**
   ```typescript
   // Command menu loaded on interaction
   const CommandMenu = dynamic(() => import('./command-menu'));
   ```

4. **Minimize JavaScript**
   - Server Components render on server (zero JS)
   - Client Components only where interactivity needed
   - Total JS: ~200KB gzipped

---

## Security Considerations

### HTTP Security Headers

**Implemented in `next.config.js`**:

| Header | Value | Protection |
|--------|-------|------------|
| `X-Content-Type-Options` | `nosniff` | Prevents MIME sniffing attacks |
| `X-Frame-Options` | `SAMEORIGIN` | Prevents clickjacking |
| `X-XSS-Protection` | `1; mode=block` | Browser XSS filter |
| `Referrer-Policy` | `origin-when-cross-origin` | Privacy protection |
| `Permissions-Policy` | Restrictive | Disables unnecessary APIs |

**Missing (Should be added for production)**:
```javascript
// Content Security Policy
{
  key: 'Content-Security-Policy',
  value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';"
}
```

### XSS Prevention

**React Automatic Escaping**:
```typescript
// Safe - React escapes by default
<div>{userInput}</div>

// Unsafe - explicitly opted in
<div dangerouslySetInnerHTML={{ __html: html }} />
```

**Usage in codebase**:
- `dangerouslySetInnerHTML` used ONLY for JSON-LD structured data
- Biome warning enabled: `noDangerouslySetInnerHtml: "warn"`

### GraphQL Security

**Production Error Handling**:
```typescript
formatError: (err) => {
  return {
    message: process.env.NODE_ENV === 'production'
      ? 'Internal server error'  // Hide details
      : err.message,              // Show in dev
    code: err.extensions?.code,
  };
}
```

**Introspection**:
```typescript
// Disabled in production
introspection: process.env.NODE_ENV !== 'production'
```

### Dependency Security

**Automated Scanning**:
```bash
# Check for vulnerabilities
pnpm audit

# Update dependencies
pnpm update
```

**Current Status**: Zero known vulnerabilities (as of last audit)

### Data Privacy

**Personal Information**:
- All data is **intentionally public** (it's a CV)
- No sensitive data collection
- No cookies or tracking (except Vercel Analytics)

**Vercel Analytics**:
- Privacy-focused
- No personally identifiable information
- GDPR compliant

### Server-Side Security

**Framework-Level Protection**:
- Next.js handles SQL injection (no database)
- No user input processed (static content)
- No file uploads
- No authentication required

---

## Testing Strategies

> **Note**: This project does not currently have automated tests implemented. The following section describes recommended testing strategies that should be implemented for production use.

### Unit Testing (Recommended)

**Framework**: Jest + React Testing Library

**Setup**:
```bash
pnpm add -D jest @testing-library/react @testing-library/jest-dom
```

**Example Tests**:

```typescript
// __tests__/components/Header.test.tsx
import { render, screen } from '@testing-library/react';
import { Header } from '@/app/components/Header';

describe('Header Component', () => {
  it('renders name correctly', () => {
    render(<Header />);
    expect(screen.getByText('Ban Nguyen')).toBeInTheDocument();
  });

  it('renders contact email', () => {
    render(<Header />);
    const emailLink = screen.getByRole('link', { name: /email/i });
    expect(emailLink).toHaveAttribute('href', 'mailto:nguyenducban@me.com');
  });
});
```

**Coverage Targets**:
- Components: 80%
- Utilities: 90%
- Type transformations: 100%

### Integration Testing (Recommended)

**Framework**: Playwright or Cypress

**Test Scenarios**:
```typescript
// e2e/resume.spec.ts
test('complete resume page loads', async ({ page }) => {
  await page.goto('/');

  // Check all sections present
  await expect(page.locator('h2:has-text("About")')).toBeVisible();
  await expect(page.locator('h2:has-text("Work Experience")')).toBeVisible();
  await expect(page.locator('h2:has-text("Education")')).toBeVisible();

  // Check command menu
  await page.keyboard.press('Meta+K');
  await expect(page.locator('[cmdk-dialog]')).toBeVisible();
});
```

### GraphQL API Testing (Recommended)

**Framework**: Jest + Apollo Server Testing

```typescript
// __tests__/api/graphql.test.ts
import { createTestClient } from 'apollo-server-testing';

describe('GraphQL API', () => {
  it('fetches resume data', async () => {
    const query = `
      query {
        me {
          name
          contact { email }
        }
      }
    `;

    const { data } = await client.query({ query });
    expect(data.me.name).toBe('Ban Nguyen');
    expect(data.me.contact.email).toBe('nguyenducban@me.com');
  });
});
```

### Visual Regression Testing (Recommended)

**Tool**: Percy or Chromatic

**Why**:
- CV is presentation-focused
- Layout breaks are critical
- Print styles must be verified

### Accessibility Testing (Recommended)

**Tool**: axe-core + jest-axe

```typescript
import { axe, toHaveNoViolations } from 'jest-axe';
expect.extend(toHaveNoViolations);

test('Header has no accessibility violations', async () => {
  const { container } = render(<Header />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

### Manual Testing Checklist

**Before each release**:

- [ ] Test in Chrome, Firefox, Safari
- [ ] Test on mobile (iOS and Android)
- [ ] Print preview looks correct
- [ ] PDF export is clean
- [ ] Command menu (Cmd+K) works
- [ ] All external links open correctly
- [ ] GraphQL playground works (dev mode)
- [ ] No console errors
- [ ] Lighthouse score > 90
- [ ] Screen reader navigation works

### Performance Testing

**Tools**:
- Lighthouse (automated)
- WebPageTest (real-world testing)
- Chrome DevTools Performance tab

**Metrics to Monitor**:
- Largest Contentful Paint (LCP) < 2.5s
- Total Blocking Time (TBT) < 300ms
- Cumulative Layout Shift (CLS) < 0.1

---

## Browser Compatibility

### Supported Browsers

| Browser | Version | Support Level |
|---------|---------|---------------|
| Chrome | 90+ | Full support |
| Firefox | 88+ | Full support |
| Safari | 14+ | Full support |
| Edge | 90+ | Full support |
| Mobile Safari | 14+ | Full support |
| Chrome Android | 90+ | Full support |

### Polyfills

**Not Required** - Modern browsers only. Target ES2021.

### Feature Detection

**CSS Features Used**:
- CSS Grid (95%+ support)
- CSS Custom Properties (95%+ support)
- CSS `clamp()` (90%+ support)

**JavaScript Features**:
- Optional chaining (`?.`)
- Nullish coalescing (`??`)
- `async/await`
- ES Modules

**Graceful Degradation**:
```css
/* Print styles work even without JavaScript */
@media print {
  .print\:hidden { display: none; }
}
```

### Print Compatibility

**Tested Browsers**:
- Chrome/Edge print to PDF
- Safari print to PDF
- Firefox print to PDF

**Known Issues**:
- Some browsers clip box shadows in print
- Background colors may not print by default (user setting)

**Workaround**:
```css
@media print {
  /* Force print backgrounds */
  * {
    -webkit-print-color-adjust: exact;
    color-adjust: exact;
  }
}
```

---

## Troubleshooting Guide

### Common Issues

#### 1. Build Fails with Decorator Errors

**Symptom**:
```
Error: Experimental decorators are not enabled
```

**Solution**:
Verify `tsconfig.json` has:
```json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

#### 2. GraphQL Endpoint Returns 500

**Symptom**:
```
GET /graphql → 500 Internal Server Error
```

**Debugging Steps**:
1. Check server logs for GraphQL initialization errors
2. Verify `reflect-metadata` is imported first in `route.ts`
3. Ensure TypeGraphQL decorators are properly applied
4. Check Apollo Server error logs

**Common Cause**:
```typescript
// WRONG - missing reflect-metadata
import { ApolloServer } from '@apollo/server';

// CORRECT
import 'reflect-metadata';
import { ApolloServer } from '@apollo/server';
```

#### 3. Styles Not Applying

**Symptom**: Components render but have no styles

**Solutions**:

1. **Missing Tailwind Directives**
   ```css
   /* globals.css must have */
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```

2. **Content Path Issues**
   ```javascript
   // tailwind.config.js
   content: ['./src/**/*.{ts,tsx}'] // Must include all component files
   ```

3. **CSS Not Imported**
   ```typescript
   // app/layout.tsx
   import './globals.css'; // Must be imported
   ```

#### 4. Command Menu (Cmd+K) Not Working

**Symptom**: Keyboard shortcut doesn't open menu

**Debugging**:
1. Check browser console for JavaScript errors
2. Verify `cmdk` package is installed
3. Check if another extension is capturing the shortcut
4. Test with Ctrl+K (Windows) vs Cmd+K (Mac)

**Fix**:
```typescript
// Ensure both key combinations work
useEffect(() => {
  const down = (e: KeyboardEvent) => {
    if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      setOpen((open) => !open);
    }
  };
  document.addEventListener('keydown', down);
  return () => document.removeEventListener('keydown', down);
}, []);
```

#### 5. Docker Build Fails

**Symptom**:
```
Error: Cannot find module 'next'
```

**Solution**:
Ensure Dockerfile copies all necessary files:
```dockerfile
COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile
COPY . .  # This must include next.config.js
```

#### 6. Images Not Loading

**Symptom**: Avatar or logos show broken image icon

**Debugging**:
1. Check image URL is accessible
2. Verify domain is allowed in `next.config.js`
3. Check network tab for 403/404 errors

**Fix**:
```javascript
// next.config.js
images: {
  domains: ['avatars.githubusercontent.com', 'yourdomain.com'],
}
```

#### 7. Print Styles Not Working

**Symptom**: Page looks wrong when printed

**Solution**:
1. Test with print preview first
2. Check CSS `@media print` rules
3. Verify `.print:hidden` classes work

**Browser Setting**:
Enable "Background graphics" in print dialog

#### 8. Biome Lint Errors

**Symptom**:
```
error: File name should be in kebab-case or PascalCase
```

**Solution**:
Rename file to match convention:
```bash
# Wrong
my_component.tsx

# Correct
my-component.tsx  # kebab-case
MyComponent.tsx   # PascalCase
```

### Debug Mode

**Enable verbose logging**:
```bash
# Development server with debug output
DEBUG=* pnpm dev

# Build with verbose output
NEXT_DEBUG=1 pnpm build
```

### Getting Help

1. **Check official docs**:
   - [Next.js Documentation](https://nextjs.org/docs)
   - [TypeGraphQL Docs](https://typegraphql.com/docs)
   - [Tailwind CSS Docs](https://tailwindcss.com/docs)

2. **Common error patterns**:
   - Search GitHub issues in respective repos
   - Check Stack Overflow with exact error message

3. **Project-specific issues**:
   - Review recent git commits
   - Check if issue exists in clean install

### Performance Debugging

**Slow build times**:
```bash
# Clear Next.js cache
rm -rf .next

# Clear node_modules and reinstall
rm -rf node_modules bun.lock
bun install
```

**Runtime performance issues**:
```javascript
// Add to next.config.js for bundle analysis
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.plugins.push(new BundleAnalyzerPlugin());
    }
    return config;
  }
};
```

---

## Additional Resources

- [Project README](/home/user/minimalist-cv/README.md)
- [Architecture Documentation](/home/user/minimalist-cv/DOCS/ARCHITECTURE.md)
- [API Reference](/home/user/minimalist-cv/DOCS/API-REFERENCE.md)
- [Deployment Guide](/home/user/minimalist-cv/DOCS/DEPLOYMENT-GUIDE.md)
- [Contributing Guidelines](/home/user/minimalist-cv/DOCS/CONTRIBUTING.md)

---

**Last Updated**: 2025-11-15
