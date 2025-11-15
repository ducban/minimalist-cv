# Beginner's Guide to Building a Minimalist CV Web Application

## Introduction

This guide will walk you through building a modern CV/Resume web application from scratch, explaining every concept in beginner-friendly terms. By the end, you'll understand how to build a production-ready Next.js application with TypeScript, Tailwind CSS, and GraphQL.

**Who is this for?**
- Beginners who want to learn modern web development
- Developers transitioning from other frameworks to Next.js
- Anyone wanting to understand this codebase in depth

**What you'll learn:**
- Next.js 14 App Router fundamentals
- TypeScript basics and best practices
- Tailwind CSS styling approach
- Component-based architecture
- GraphQL API implementation
- Deployment strategies

---

## Table of Contents

1. [Setting Up the Project](#1-setting-up-the-project)
2. [Understanding the File Structure](#2-understanding-the-file-structure)
3. [Building the Data Layer](#3-building-the-data-layer)
4. [Creating Components](#4-creating-components)
5. [Styling with Tailwind CSS](#5-styling-with-tailwind-css)
6. [Building the Main Page](#6-building-the-main-page)
7. [Adding the GraphQL API](#7-adding-the-graphql-api)
8. [Optimizing for Print](#8-optimizing-for-print)
9. [Adding Special Features](#9-adding-special-features)
10. [Deployment](#10-deployment)

---

## 1. Setting Up the Project

### Step 1.1: Create a Next.js App

```bash
# Using bun (fastest)
bun create next-app minimalist-cv

# Answer the prompts:
# ✅ TypeScript? → Yes
# ✅ ESLint? → No (we'll use Biome)
# ✅ Tailwind CSS? → Yes
# ✅ src/ directory? → Yes
# ✅ App Router? → Yes
# ❌ Turbopack? → No
# ❌ Import alias? → No (we'll configure manually)
```

**What just happened?**
- `bun create next-app` is a command to scaffold (create the initial structure) of a Next.js project
- We chose TypeScript for type safety (catch errors before runtime)
- We chose Tailwind CSS for utility-first styling
- App Router is the modern way to handle routing in Next.js 14

### Step 1.2: Install Additional Dependencies

```bash
cd minimalist-cv

# Install UI components and utilities
bun add @radix-ui/react-avatar @radix-ui/react-dialog @radix-ui/react-slot
bun add lucide-react cmdk vaul
bun add class-variance-authority clsx tailwind-merge tailwindcss-animate

# Install GraphQL dependencies
bun add @apollo/server @as-integrations/next graphql graphql-scalars type-graphql
bun add reflect-metadata class-validator

# Install Vercel Analytics
bun add @vercel/analytics

# Install dev dependencies
bun add -d @biomejs/biome
```

**Explanation of each package:**

**UI Components:**
- `@radix-ui/*`: Unstyled, accessible UI primitives (building blocks)
- `lucide-react`: Beautiful icon library
- `cmdk`: Command menu component (like Cmd+K in VS Code)
- `vaul`: Drawer component for mobile

**Styling Utilities:**
- `class-variance-authority`: Type-safe way to manage component variants
- `clsx`: Utility for conditionally joining class names
- `tailwind-merge`: Intelligently merges Tailwind CSS classes

**GraphQL:**
- `@apollo/server`: GraphQL server
- `type-graphql`: TypeScript decorators for GraphQL schema
- `graphql-scalars`: Additional scalar types (Date, URL, etc.)
- `reflect-metadata`: Required for TypeScript decorators
- `class-validator`: Validation for GraphQL inputs

**Analytics:**
- `@vercel/analytics`: Privacy-friendly analytics

**Code Quality:**
- `@biomejs/biome`: Fast linter and formatter (replaces ESLint + Prettier)

### Step 1.3: Configure TypeScript

Edit `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2021",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,

    // ⭐ IMPORTANT for GraphQL decorators
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,

    // Path aliases
    "paths": {
      "@/*": ["./src/*"]
    },

    "plugins": [
      {
        "name": "next"
      }
    ]
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

**Key configurations explained:**

```typescript
"experimentalDecorators": true,
"emitDecoratorMetadata": true,
```
**Why?** These enable TypeScript decorators, which we use for GraphQL schema definition.

**Example of decorators:**
```typescript
@ObjectType()  // ← This is a decorator
class Person {
  @Field()     // ← This is also a decorator
  name: string;
}
```

```json
"paths": {
  "@/*": ["./src/*"]
}
```
**Why?** This allows you to import like `import { Button } from "@/components/ui/button"` instead of `import { Button } from "../../../../components/ui/button"`

### Step 1.4: Configure Biome

Create `biome.json`:

```json
{
  "$schema": "https://biomejs.dev/schemas/1.9.4/schema.json",
  "vcs": {
    "enabled": false,
    "clientKind": "git",
    "useIgnoreFile": false
  },
  "files": {
    "ignoreUnknown": false,
    "ignore": []
  },
  "formatter": {
    "enabled": true,
    "indentStyle": "space",
    "indentWidth": 2,
    "lineEnding": "lf",
    "lineWidth": 80
  },
  "organizeImports": {
    "enabled": true
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true
    }
  },
  "javascript": {
    "formatter": {
      "quoteStyle": "double",
      "trailingCommas": "es5",
      "semicolons": "always",
      "arrowParentheses": "always"
    }
  }
}
```

**What does this do?**
- Sets up automatic code formatting
- Enforces consistent code style
- Organizes imports automatically
- Lints for common errors

### Step 1.5: Configure Tailwind

Edit `tailwind.config.js`:

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  // Specify where to look for Tailwind classes
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    // Container settings
    container: {
      center: true,        // Center the container
      padding: "2rem",     // Add padding
      screens: {
        "2xl": "1400px",   // Max width on largest screens
      },
    },
    extend: {
      // Custom fonts
      fontFamily: {
        mono: ["Noto Sans Mono", "ui-monospace", "monospace"],
      },
      // Custom font sizes
      fontSize: {
        xs: ["0.75rem", { lineHeight: "1rem" }],
        sm: ["0.875rem", { lineHeight: "1.5rem" }],
      },
      // Custom colors using CSS variables
      colors: {
        border: "hsl(var(--border))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        // ... more colors
      },
      // Custom border radius
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),  // Adds animation utilities
  ],
};
```

**Why CSS variables for colors?**

```css
/* globals.css */
:root {
  --primary: 222.2 47.4% 11.2%;    /* Can change theme easily */
}

.dark {
  --primary: 210 40% 98%;          /* Different value for dark mode */
}
```

This allows easy theme switching without changing component code!

### Step 1.6: Setup Package Scripts

Edit `package.json` scripts:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "biome lint ./src",
    "lint:fix": "biome lint --write ./src",
    "format": "biome format ./src",
    "format:fix": "biome format --write ./src",
    "check": "biome check ./src",
    "check:fix": "biome check --write ./src"
  }
}
```

**Usage:**
- `bun dev` - Start development server
- `bun build` - Build for production
- `bun check:fix` - Lint and format your code

---

## 2. Understanding the File Structure

Next.js 14 uses the **App Router**, where your file system defines your routes.

```
src/
├── app/                       # 🚀 App Router (routes defined by folders)
│   ├── layout.tsx            # Root layout (wraps all pages)
│   ├── page.tsx              # Homepage (/)
│   ├── loading.tsx           # Loading UI for homepage
│   ├── error.tsx             # Error UI for homepage
│   ├── globals.css           # Global styles
│   │
│   └── graphql/              # Route: /graphql
│       └── route.ts          # API route handler
│
├── components/               # 🧩 Reusable components
│   ├── ui/                   # Base UI components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── ...
│   │
│   └── command-menu.tsx      # Feature components
│
├── data/                     # 📊 Data storage
│   └── resume-data.tsx       # CV data
│
├── lib/                      # 🛠️ Utility functions
│   ├── types.ts              # TypeScript types
│   └── utils.ts              # Helper functions
│
└── apollo/                   # 🔺 GraphQL configuration
    ├── resolvers.ts
    └── type-defs.ts
```

### How Routing Works in App Router

```
app/
├── page.tsx              → yourdomain.com/
├── about/
│   └── page.tsx          → yourdomain.com/about
└── blog/
    ├── page.tsx          → yourdomain.com/blog
    └── [slug]/
        └── page.tsx      → yourdomain.com/blog/any-slug-here
```

**Special files in App Router:**
- `page.tsx` - Defines a page
- `layout.tsx` - Wraps pages (persistent across navigation)
- `loading.tsx` - Loading UI (shown while page loads)
- `error.tsx` - Error boundary
- `route.ts` - API route

---

## 3. Building the Data Layer

### Step 3.1: Define TypeScript Types

Create `src/lib/types.ts`:

```typescript
import { type ReactNode } from "react";

// Social media link
export interface Social {
  name: string;          // "LinkedIn", "GitHub", etc.
  url: string;           // "https://linkedin.com/in/yourname"
  icon: ReactNode;       // Icon component
  navbar?: boolean;      // Show in navigation bar?
}

// Contact information
export interface Contact {
  email: string;
  tel: string;
  social: Social[];
}

// Work experience entry
export interface Work {
  company: string;         // "Google"
  title: string;          // "Senior Software Engineer"
  logo?: ReactNode;       // Company logo
  start: string;          // "2021" or "Jan 2021"
  end: string;            // "2024" or "Present"
  description: string;    // What you did
  link?: string;          // Company website
  badges?: readonly string[];  // ["React", "TypeScript"]
}

// Education entry
export interface Education {
  school: string;
  degree: string;
  start: string;
  end: string;
  link?: string;
}

// Project entry
export interface Project {
  title: string;
  href?: string;          // Link to project
  dates: string;          // "2023 - 2024"
  active: boolean;        // Is project still active?
  description: string;
  technologies: readonly string[];  // ["Next.js", "Prisma"]
  links: readonly {
    type: string;         // "Website", "GitHub"
    href: string;
    icon: ReactNode;
  }[];
  image?: string;         // Screenshot
  video?: string;         // Demo video
}

// Complete resume data structure
export interface ResumeData {
  name: string;
  initials: string;
  location: string;
  locationLink: string;
  about: string;
  summary: string | ReactNode;
  avatarUrl: string;
  personalWebsiteUrl: string;
  contact: Contact;
  education: readonly Education[];
  work: readonly Work[];
  skills: readonly string[];
  projects: readonly Project[];
}
```

**Why use TypeScript interfaces?**

```typescript
// ✅ With TypeScript
const work: Work = {
  company: "Google",
  title: "Engineer",
  // TypeScript error: Missing required fields 'start' and 'end'!
};

// ❌ Without TypeScript
const work = {
  company: "Google",
  title: "Engineer",
  // No error! But will crash at runtime when you try to display dates
};
```

TypeScript catches errors **during development** instead of **in production**!

### Step 3.2: Create Resume Data

Create `src/data/resume-data.tsx`:

```typescript
import { GitHubIcon, LinkedInIcon, XIcon } from "@/components/icons";
import { type ResumeData } from "@/lib/types";

export const RESUME_DATA: ResumeData = {
  // Personal information
  name: "Your Name",
  initials: "YN",
  location: "San Francisco, CA",
  locationLink: "https://www.google.com/maps/place/san-francisco",
  about: "Full Stack Engineer passionate about building great products",

  // Summary (can be a string or React component)
  summary: "Experienced software engineer with 5+ years...",

  // Profile
  avatarUrl: "https://avatars.githubusercontent.com/u/yourusername",
  personalWebsiteUrl: "https://yourwebsite.com",

  // Contact
  contact: {
    email: "you@example.com",
    tel: "+1234567890",
    social: [
      {
        name: "GitHub",
        url: "https://github.com/yourusername",
        icon: <GitHubIcon />,
        navbar: true,  // Show in navbar
      },
      {
        name: "LinkedIn",
        url: "https://linkedin.com/in/yourusername",
        icon: <LinkedInIcon />,
        navbar: true,
      },
      {
        name: "X",
        url: "https://x.com/yourusername",
        icon: <XIcon />,
        navbar: false,  // Don't show in navbar
      },
    ],
  },

  // Education
  education: [
    {
      school: "Stanford University",
      degree: "Bachelor's in Computer Science",
      start: "2015",
      end: "2019",
      link: "https://stanford.edu",
    },
  ],

  // Work experience
  work: [
    {
      company: "Meta",
      title: "Senior Software Engineer",
      start: "2021",
      end: "Present",
      description:
        "Led development of internal tools used by 10,000+ employees. " +
        "Improved performance by 40% through optimization.",
      link: "https://meta.com",
      badges: ["React", "GraphQL", "TypeScript", "Node.js"],
    },
    {
      company: "Startup Inc",
      title: "Full Stack Engineer",
      start: "2019",
      end: "2021",
      description:
        "Built MVP from scratch. Scaled from 0 to 100k users.",
      badges: ["Next.js", "PostgreSQL", "AWS"],
    },
  ],

  // Skills
  skills: [
    "JavaScript",
    "TypeScript",
    "React",
    "Next.js",
    "Node.js",
    "PostgreSQL",
    "GraphQL",
    "AWS",
    "Docker",
  ],

  // Projects
  projects: [
    {
      title: "Project Alpha",
      href: "https://projectalpha.com",
      dates: "Jan 2023 - Present",
      active: true,  // Green dot indicator
      description:
        "A platform that helps developers find remote jobs. " +
        "Built with Next.js 14, Prisma, and PostgreSQL.",
      technologies: [
        "Next.js",
        "TypeScript",
        "PostgreSQL",
        "Prisma",
        "TailwindCSS",
      ],
      links: [
        {
          type: "Website",
          href: "https://projectalpha.com",
          icon: <Globe className="size-3" />,
        },
        {
          type: "GitHub",
          href: "https://github.com/you/project-alpha",
          icon: <GitHubIcon className="size-3" />,
        },
      ],
      image: "/projects/alpha.png",
    },
    // ... more projects
  ],
};
```

**Key points:**

1. **Type Safety:** `RESUME_DATA` is typed as `ResumeData`, so TypeScript ensures all required fields are present

2. **Single Source of Truth:** All your CV data is in one place

3. **React Components in Data:** Notice `icon: <GitHubIcon />` - you can embed React components in your data!

4. **Easy Updates:** To update your CV, just edit this file

---

## 4. Creating Components

### Step 4.1: Utility Function

Create `src/lib/utils.ts`:

```typescript
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines class names intelligently
 * Merges Tailwind classes properly (later classes override earlier ones)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

**Why do we need this?**

```typescript
// Problem: What if we have conflicting classes?
const className = "text-red-500 text-blue-500";
// Which color wins? 🤷

// Solution: cn() merges them properly
cn("text-red-500", "text-blue-500");
// Result: "text-blue-500" (last one wins)

// Also great for conditional classes:
cn(
  "px-4 py-2",
  isActive && "bg-blue-500",  // Only add if isActive is true
  isDisabled && "opacity-50",
);
```

### Step 4.2: Base UI Components

Create `src/components/ui/card.tsx`:

```typescript
import { cn } from "@/lib/utils";
import { type HTMLAttributes } from "react";

// Main card container
export function Card({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-lg border bg-card text-card-foreground shadow-sm",
        className
      )}
      {...props}
    />
  );
}

// Card header section
export function CardHeader({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex flex-col space-y-1.5 p-6", className)}
      {...props}
    />
  );
}

// Card title
export function CardTitle({
  className,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn("text-2xl font-semibold leading-none tracking-tight", className)}
      {...props}
    />
  );
}

// Card description
export function CardDescription({
  className,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

// Card content section
export function CardContent({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("p-6 pt-0", className)} {...props} />
  );
}
```

**How to use:**

```tsx
<Card>
  <CardHeader>
    <CardTitle>My Title</CardTitle>
    <CardDescription>Some description</CardDescription>
  </CardHeader>
  <CardContent>
    Content goes here
  </CardContent>
</Card>
```

**What's happening here?**

1. **Component Props Pattern:**
```typescript
export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  // className: Custom classes from parent
  // ...props: All other HTML div attributes (onClick, id, etc.)
}
```

2. **cn() for Class Merging:**
```typescript
className={cn(
  "rounded-lg border bg-card",  // Default classes
  className                      // Parent's classes (can override defaults)
)}
```

3. **Spread Operator:**
```typescript
<div {...props} />
// Passes all props (onClick, id, data-*, etc.) to the div
```

### Step 4.3: Badge Component

Create `src/components/ui/badge.tsx`:

```typescript
import { cva, type VariantProps } from "class-variance-authority";
import { type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

// Define badge variants using CVA (Class Variance Authority)
const badgeVariants = cva(
  // Base classes (always applied)
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground",
        secondary: "border-transparent bg-secondary text-secondary-foreground",
        destructive: "border-transparent bg-destructive text-destructive-foreground",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}
```

**Usage:**

```tsx
<Badge>Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="destructive">Error</Badge>
<Badge variant="outline">Outline</Badge>
```

**What is CVA (Class Variance Authority)?**

CVA helps manage component variants in a type-safe way:

```typescript
// Without CVA (messy):
<div className={`badge ${variant === 'default' ? 'bg-blue' : variant === 'secondary' ? 'bg-gray' : '...'}`} />

// With CVA (clean):
<div className={cn(badgeVariants({ variant }))} />
```

It's type-safe too:
```typescript
<Badge variant="invalid" />
// TypeScript error: "invalid" is not assignable to type "default" | "secondary" | ...
```

### Step 4.4: Button Component

Create `src/components/ui/button.tsx`:

```typescript
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { type ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  // Base styles
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;  // Render as child component instead of button
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
```

**Advanced concepts explained:**

1. **forwardRef:**
```typescript
// Allows parent components to access the button DOM element
const myButtonRef = useRef<HTMLButtonElement>(null);
<Button ref={myButtonRef}>Click</Button>

// Later: myButtonRef.current.focus()
```

2. **asChild prop (Radix Slot):**
```tsx
// Normal usage:
<Button>Click me</Button>
// Renders: <button>Click me</button>

// With asChild:
<Button asChild>
  <a href="/home">Go Home</a>
</Button>
// Renders: <a href="/home" class="...button classes...">Go Home</a>
// Useful when you want button styling but need a different HTML element!
```

3. **Multiple variants:**
```tsx
<Button variant="outline" size="lg">Large Outline Button</Button>
<Button variant="ghost" size="icon"><Icon /></Button>
```

---

## 5. Styling with Tailwind CSS

### Tailwind Basics

Tailwind uses **utility classes** - small, single-purpose classes.

```html
<!-- Traditional CSS -->
<style>
  .card {
    padding: 1rem;
    background-color: white;
    border-radius: 0.5rem;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  }
</style>
<div class="card">Content</div>

<!-- Tailwind CSS -->
<div class="p-4 bg-white rounded-lg shadow">Content</div>
```

### Common Tailwind Patterns

**Responsive Design:**
```html
<!--
  Default (mobile): 1 column
  md (768px+): 2 columns
  lg (1024px+): 3 columns
-->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>
```

**Hover States:**
```html
<button class="bg-blue-500 hover:bg-blue-700">
  Hover me
</button>
```

**Conditional Classes:**
```tsx
<div className={cn(
  "p-4 rounded",
  isActive ? "bg-blue-500" : "bg-gray-200",
  isLarge && "text-lg",
)}>
  Content
</div>
```

**Print-Specific Styles:**
```html
<!-- Hide on screen, show when printing -->
<div class="hidden print:block">
  This only appears when printing
</div>

<!-- Different sizes -->
<div class="text-base print:text-sm">
  Normal size on screen, smaller when printed
</div>
```

### Global Styles

Edit `src/app/globals.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* CSS Variables for theming */
@layer base {
  :root {
    --background: 0 0% 100%;        /* White */
    --foreground: 222.2 47.4% 11.2%; /* Dark gray */
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
    --radius: 0.5rem;                /* Border radius */
  }

  /* Dark mode (optional) */
  .dark {
    --background: 224 71% 4%;
    --foreground: 213 31% 91%;
  }
}

/* Base element styles */
@layer base {
  * {
    @apply border-border;
  }

  body {
    @apply bg-background text-foreground;
    font-feature-settings: "rlig" 1, "calt" 1;
  }

  h1 {
    @apply text-4xl font-bold;
  }

  h2 {
    @apply text-3xl font-semibold;
  }
}

/* Print-specific styles */
@media print {
  /* Hide navigation, buttons, etc. */
  .no-print {
    display: none !important;
  }

  /* Adjust spacing for print */
  .print-tight {
    margin: 0;
    padding: 0;
  }

  /* Force page breaks */
  .print-force-new-page {
    page-break-before: always;
  }

  /* Ensure colors print */
  * {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
}
```

**Explanation:**

1. **@tailwind directives:** Import Tailwind's base, components, and utilities

2. **@layer base:** Add custom base styles that can be overridden by utilities

3. **CSS Variables:** Allow dynamic theming
```css
/* Define */
:root {
  --primary: 222.2 47.4% 11.2%;
}

/* Use in Tailwind */
.bg-primary {
  background-color: hsl(var(--primary));
}
```

4. **@apply directive:** Use Tailwind utilities in CSS
```css
h1 {
  @apply text-4xl font-bold;
  /* Same as: font-size: 2.25rem; font-weight: 700; */
}
```

---

## 6. Building the Main Page

### Step 6.1: Root Layout

Create/edit `src/app/layout.tsx`:

```typescript
import { Analytics } from "@vercel/analytics/react";
import { type Metadata } from "next";
import { Noto_Sans_Mono } from "next/font/google";
import { type ReactNode } from "react";
import "./globals.css";

// Configure Google Font
const notoSansMono = Noto_Sans_Mono({
  subsets: ["latin"],
  variable: "--font-mono",  // CSS variable
  display: "swap",          // Font loading strategy
});

// Metadata for SEO
export const metadata: Metadata = {
  title: {
    default: "Your Name | Full Stack Engineer",
    template: "%s | Your Name",  // For dynamic pages
  },
  description: "Experienced full stack engineer specializing in React and Node.js",
  keywords: ["software engineer", "full stack", "react", "typescript"],

  // Open Graph (for social media)
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://yourwebsite.com",
    title: "Your Name - Full Stack Engineer",
    description: "My professional CV and portfolio",
    siteName: "Your Name CV",
    images: [
      {
        url: "https://yourwebsite.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "Your Name",
      },
    ],
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "Your Name - Full Stack Engineer",
    description: "My professional CV and portfolio",
    images: ["https://yourwebsite.com/og-image.png"],
    creator: "@yourusername",
  },

  // Misc
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" className={notoSansMono.variable}>
      <body className="min-h-screen bg-background font-mono antialiased">
        {children}
        <Analytics />  {/* Vercel Analytics */}
      </body>
    </html>
  );
}
```

**Key concepts:**

1. **Root Layout:** Wraps all pages, defines HTML structure

2. **Font Loading:**
```typescript
const font = Noto_Sans_Mono({
  subsets: ["latin"],      // Character sets to load
  variable: "--font-mono", // CSS variable name
  display: "swap",         // Show fallback font while loading
});

// Used in HTML tag:
<html className={font.variable}>
```

3. **Metadata Object:** Next.js automatically generates:
- `<title>` tags
- `<meta>` tags for SEO
- Open Graph tags for social media
- Twitter Card tags

4. **Template Metadata:**
```typescript
title: {
  default: "Your Name",
  template: "%s | Your Name",
}

// Child page can set:
export const metadata = { title: "About" };
// Final title: "About | Your Name"
```

### Step 6.2: Main Resume Page

Create `src/app/page.tsx`:

```typescript
import { RESUME_DATA } from "@/data/resume-data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function Page() {
  return (
    <main className="container relative mx-auto scroll-my-12 overflow-auto p-4 print:p-12 md:p-16">
      {/* Header Section */}
      <section className="mx-auto w-full max-w-2xl space-y-8 bg-white print:space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex-1 space-y-1.5">
            {/* Name */}
            <h1 className="text-2xl font-bold">{RESUME_DATA.name}</h1>

            {/* About */}
            <p className="max-w-md text-pretty font-mono text-sm text-muted-foreground print:text-[10px]">
              {RESUME_DATA.about}
            </p>

            {/* Location */}
            <p className="max-w-md items-center text-pretty font-mono text-xs text-muted-foreground">
              <a
                className="inline-flex gap-x-1.5 align-baseline leading-none hover:underline"
                href={RESUME_DATA.locationLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                {RESUME_DATA.location}
              </a>
            </p>

            {/* Contact - Desktop */}
            <div className="flex gap-x-1 pt-1 font-mono text-sm text-muted-foreground print:hidden">
              {RESUME_DATA.contact.email ? (
                <a href={`mailto:${RESUME_DATA.contact.email}`}>
                  <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors h-8 rounded-md px-3">
                    <span className="underline">{RESUME_DATA.contact.email}</span>
                  </button>
                </a>
              ) : null}

              {RESUME_DATA.contact.tel ? (
                <a href={`tel:${RESUME_DATA.contact.tel}`}>
                  <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors h-8 rounded-md px-3">
                    <span className="underline">{RESUME_DATA.contact.tel}</span>
                  </button>
                </a>
              ) : null}

              {/* Social Icons */}
              {RESUME_DATA.contact.social.map((social) => (
                <a key={social.name} href={social.url} target="_blank" rel="noopener noreferrer">
                  <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors h-8 w-8">
                    {social.icon}
                  </button>
                </a>
              ))}
            </div>

            {/* Contact - Print Only */}
            <div className="hidden flex-col gap-x-1 font-mono text-sm text-muted-foreground print:flex print:text-[10px]">
              {RESUME_DATA.contact.email ? (
                <span>{RESUME_DATA.contact.email}</span>
              ) : null}
              {RESUME_DATA.contact.tel ? (
                <span>{RESUME_DATA.contact.tel}</span>
              ) : null}
            </div>
          </div>

          {/* Avatar */}
          <Avatar className="size-28 print:size-24">
            <AvatarImage alt={RESUME_DATA.name} src={RESUME_DATA.avatarUrl} />
            <AvatarFallback>{RESUME_DATA.initials}</AvatarFallback>
          </Avatar>
        </div>

        {/* About/Summary Section */}
        <section className="flex min-h-0 flex-col gap-y-3">
          <h2 className="text-xl font-bold">About</h2>
          <p className="text-pretty font-mono text-sm text-muted-foreground print:text-[10px]">
            {RESUME_DATA.summary}
          </p>
        </section>

        {/* Work Experience */}
        <section className="flex min-h-0 flex-col gap-y-3">
          <h2 className="text-xl font-bold">Work Experience</h2>
          {RESUME_DATA.work.map((work) => (
            <Card key={work.company}>
              <CardHeader>
                <div className="flex items-center justify-between gap-x-2 text-base">
                  <h3 className="inline-flex items-center justify-center gap-x-1 font-semibold leading-none">
                    {work.link ? (
                      <a className="hover:underline" href={work.link}>
                        {work.company}
                      </a>
                    ) : (
                      work.company
                    )}
                  </h3>
                  <div className="text-sm tabular-nums text-gray-500">
                    {work.start} - {work.end}
                  </div>
                </div>

                <h4 className="font-mono text-sm leading-none">{work.title}</h4>
              </CardHeader>

              <CardContent className="mt-2 text-xs print:text-[10px]">
                {work.description}

                {/* Tech Stack Badges */}
                {work.badges ? (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {work.badges.map((badge) => (
                      <Badge key={badge} className="print:px-1 print:py-0.5 print:text-[8px]" variant="secondary">
                        {badge}
                      </Badge>
                    ))}
                  </div>
                ) : null}
              </CardContent>
            </Card>
          ))}
        </section>

        {/* Education */}
        <section className="flex min-h-0 flex-col gap-y-3">
          <h2 className="text-xl font-bold">Education</h2>
          {RESUME_DATA.education.map((education) => (
            <Card key={education.school}>
              <CardHeader>
                <div className="flex items-center justify-between gap-x-2 text-base">
                  <h3 className="font-semibold leading-none">
                    {education.link ? (
                      <a href={education.link} className="hover:underline">
                        {education.school}
                      </a>
                    ) : (
                      education.school
                    )}
                  </h3>
                  <div className="text-sm tabular-nums text-gray-500">
                    {education.start} - {education.end}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="mt-2 print:text-[10px]">
                {education.degree}
              </CardContent>
            </Card>
          ))}
        </section>

        {/* Skills */}
        <section className="flex min-h-0 flex-col gap-y-3">
          <h2 className="text-xl font-bold">Skills</h2>
          <div className="flex flex-wrap gap-1">
            {RESUME_DATA.skills.map((skill) => (
              <Badge key={skill} className="print:text-[10px]">
                {skill}
              </Badge>
            ))}
          </div>
        </section>

        {/* Projects */}
        <section className="flex min-h-0 flex-col gap-y-3 print-force-new-page">
          <h2 className="text-xl font-bold">Projects</h2>
          <div className="-mx-3 grid grid-cols-1 gap-3 print:grid-cols-2 print:gap-2 md:grid-cols-2 lg:grid-cols-3">
            {RESUME_DATA.projects.map((project) => (
              <Card key={project.title} className="flex flex-col overflow-hidden border">
                <CardHeader className="px-2">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <h3 className="inline-flex items-center gap-1 font-semibold text-base">
                        {project.href ? (
                          <a href={project.href} className="hover:underline">
                            {project.title}
                          </a>
                        ) : (
                          project.title
                        )}

                        {/* Active indicator */}
                        {project.active && (
                          <span className="inline-flex gap-x-1">
                            <span className="relative flex size-2">
                              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                              <span className="relative inline-flex size-2 rounded-full bg-green-500" />
                            </span>
                          </span>
                        )}
                      </h3>

                      <div className="text-xs text-muted-foreground">{project.dates}</div>
                    </div>

                    <p className="text-xs text-muted-foreground print:text-[10px]">
                      {project.description}
                    </p>
                  </div>
                </CardHeader>

                <CardContent className="mt-auto px-2 pb-2">
                  {/* Tech Stack */}
                  <div className="mt-2 flex flex-wrap gap-1">
                    {project.technologies.map((tech) => (
                      <Badge key={tech} className="px-1 py-0 text-[10px]" variant="secondary">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
```

**Code breakdown:**

1. **Responsive Grid:**
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  {/*
    Mobile: 1 column
    Tablet: 2 columns
    Desktop: 3 columns
  */}
</div>
```

2. **Conditional Rendering:**
```tsx
{RESUME_DATA.contact.email ? (
  <a href={`mailto:${RESUME_DATA.contact.email}`}>
    {RESUME_DATA.contact.email}
  </a>
) : null}

// Only renders if email exists
```

3. **Array Mapping:**
```tsx
{RESUME_DATA.work.map((work) => (
  <Card key={work.company}>
    {/* Card content */}
  </Card>
))}

// Creates a Card for each work entry
// key prop is required for React performance
```

4. **Print-Specific Classes:**
```tsx
<div className="print:hidden">
  {/* Hidden when printing */}
</div>

<div className="hidden print:flex">
  {/* Only visible when printing */}
</div>

<p className="text-sm print:text-[10px]">
  {/* Smaller font when printing */}
</p>
```

5. **Active Indicator (Animated):**
```tsx
{project.active && (
  <span className="relative flex size-2">
    {/* Ping animation */}
    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
    {/* Solid dot */}
    <span className="relative inline-flex size-2 rounded-full bg-green-500" />
  </span>
)}
```

---

## 7. Adding the GraphQL API

### Step 7.1: Define GraphQL Types

Create `src/apollo/type-defs.ts`:

```typescript
import "reflect-metadata";  // Required for decorators
import { Field, ObjectType } from "type-graphql";

// Social media link type
@ObjectType()
export class Social {
  @Field()
  name!: string;

  @Field()
  url!: string;

  @Field({ nullable: true })
  navbar?: boolean;
}

// Contact information type
@ObjectType()
export class Contact {
  @Field()
  email!: string;

  @Field()
  tel!: string;

  @Field(() => [Social])
  social!: Social[];
}

// Work experience type
@ObjectType()
export class Work {
  @Field()
  company!: string;

  @Field()
  title!: string;

  @Field()
  start!: string;

  @Field()
  end!: string;

  @Field()
  description!: string;

  @Field({ nullable: true })
  link?: string;

  @Field(() => [String], { nullable: true })
  badges?: string[];
}

// Education type
@ObjectType()
export class Education {
  @Field()
  school!: string;

  @Field()
  degree!: string;

  @Field()
  start!: string;

  @Field()
  end!: string;

  @Field({ nullable: true })
  link?: string;
}

// Project link type
@ObjectType()
export class Link {
  @Field()
  type!: string;

  @Field()
  href!: string;
}

// Project type
@ObjectType()
export class Project {
  @Field()
  title!: string;

  @Field({ nullable: true })
  href?: string;

  @Field()
  dates!: string;

  @Field()
  active!: boolean;

  @Field()
  description!: string;

  @Field(() => [String])
  technologies!: string[];

  @Field(() => [Link])
  links!: Link[];

  @Field({ nullable: true })
  image?: string;

  @Field({ nullable: true })
  video?: string;
}

// Main "Me" type (root query)
@ObjectType()
export class Me {
  @Field()
  name!: string;

  @Field()
  initials!: string;

  @Field()
  location!: string;

  @Field()
  locationLink!: string;

  @Field()
  about!: string;

  @Field()
  summary!: string;

  @Field()
  avatarUrl!: string;

  @Field()
  personalWebsiteUrl!: string;

  @Field(() => Contact)
  contact!: Contact;

  @Field(() => [Education])
  education!: Education[];

  @Field(() => [Work])
  work!: Work[];

  @Field(() => [String])
  skills!: string[];

  @Field(() => [Project])
  projects!: Project[];
}
```

**Decorators explained:**

1. **@ObjectType():** Marks a class as a GraphQL type
```typescript
@ObjectType()
class Person {
  // This will be available in GraphQL queries
}
```

2. **@Field():** Marks a property as a GraphQL field
```typescript
@ObjectType()
class Person {
  @Field()
  name!: string;  // Required field

  @Field({ nullable: true })
  age?: number;   // Optional field
}
```

3. **@Field(() => [Type]):** For arrays
```typescript
@Field(() => [String])
skills!: string[];  // Array of strings

@Field(() => [Work])
work!: Work[];  // Array of Work objects
```

### Step 7.2: Create Resolver

Create `src/apollo/resolvers.ts`:

```typescript
import { type ReactElement } from "react";
import { Query, Resolver } from "type-graphql";
import { RESUME_DATA } from "@/data/resume-data";
import { type ResumeData } from "@/lib/types";
import {
  Contact,
  Education,
  Link,
  Me,
  Project,
  Social,
  Work,
} from "./type-defs";

/**
 * Converts React components to strings for GraphQL
 */
function reactNodeToString(node: ReactElement | string): string {
  if (typeof node === "string") {
    return node;
  }
  // For React elements, you could use a library like react-dom/server
  // For now, just return a placeholder
  return "[React Component]";
}

/**
 * Transforms resume data to GraphQL-compatible format
 */
export function resumeDataToGraphQL(data: ResumeData): Me {
  return {
    name: data.name,
    initials: data.initials,
    location: data.location,
    locationLink: data.locationLink,
    about: data.about,
    summary: typeof data.summary === "string" ? data.summary : reactNodeToString(data.summary),
    avatarUrl: data.avatarUrl,
    personalWebsiteUrl: data.personalWebsiteUrl,

    contact: {
      email: data.contact.email,
      tel: data.contact.tel,
      social: data.contact.social.map((s) => ({
        name: s.name,
        url: s.url,
        navbar: s.navbar,
      })),
    },

    education: data.education.map((edu) => ({
      school: edu.school,
      degree: edu.degree,
      start: edu.start,
      end: edu.end,
      link: edu.link,
    })),

    work: data.work.map((w) => ({
      company: w.company,
      title: w.title,
      start: w.start,
      end: w.end,
      description: w.description,
      link: w.link,
      badges: w.badges ? Array.from(w.badges) : undefined,
    })),

    skills: Array.from(data.skills),

    projects: data.projects.map((p) => ({
      title: p.title,
      href: p.href,
      dates: p.dates,
      active: p.active,
      description: p.description,
      technologies: Array.from(p.technologies),
      links: p.links.map((link) => ({
        type: link.type,
        href: link.href,
      })),
      image: p.image,
      video: p.video,
    })),
  };
}

/**
 * GraphQL Resolver
 */
@Resolver(() => Me)
export class MeResolver {
  @Query(() => Me)
  me(): Me {
    return resumeDataToGraphQL(RESUME_DATA);
  }
}
```

**Resolver explained:**

1. **@Resolver(() => Me):** Marks this class as a GraphQL resolver for the "Me" type

2. **@Query(() => Me):** Marks this method as a GraphQL query that returns "Me"

3. **Data transformation:** Converts React components (icons) to strings, makes arrays compatible

**GraphQL query this enables:**
```graphql
query {
  me {
    name
    about
    work {
      company
      title
      start
      end
      badges
    }
    skills
  }
}
```

### Step 7.3: Create API Route

Create `src/app/graphql/route.ts`:

```typescript
import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { buildSchema } from "type-graphql";
import { MeResolver } from "@/apollo/resolvers";

// Build GraphQL schema from TypeGraphQL classes
let schema: any;
try {
  schema = await buildSchema({
    resolvers: [MeResolver],
    validate: false,  // Disable validation in production
  });
} catch (error) {
  console.error("Failed to build GraphQL schema:", error);
  // Provide a minimal fallback schema
  schema = await buildSchema({
    resolvers: [],
    validate: false,
  });
}

// Create Apollo Server
const server = new ApolloServer({
  schema,
  introspection: process.env.NODE_ENV !== "production",  // Only in dev
  includeStacktraceInErrorResponses: process.env.NODE_ENV !== "production",
});

// Create Next.js handler
const handler = startServerAndCreateNextHandler(server, {
  context: async (req, res) => ({ req, res }),
});

// Export GET and POST handlers
export async function GET(request: Request) {
  return handler(request);
}

export async function POST(request: Request) {
  return handler(request);
}
```

**How this works:**

1. **Build Schema:** TypeGraphQL converts decorators to GraphQL schema
```typescript
@ObjectType()
class Person {
  @Field()
  name!: string;
}

// Becomes GraphQL schema:
// type Person {
//   name: String!
// }
```

2. **Apollo Server:** Handles GraphQL requests

3. **Next.js Integration:** Creates handlers for `/graphql` route

4. **Environment-Specific Config:**
```typescript
introspection: process.env.NODE_ENV !== "production"
// Introspection (exploring schema) only in development
// Security: don't expose schema structure in production
```

### Step 7.4: Test the GraphQL API

Start your dev server:
```bash
bun dev
```

Visit `http://localhost:3000/graphql`

You'll see Apollo Studio (in development mode). Try this query:

```graphql
query GetMyCV {
  me {
    name
    about
    location
    skills
    work {
      company
      title
      start
      end
      description
      badges
    }
    education {
      school
      degree
    }
    projects {
      title
      description
      technologies
      active
    }
  }
}
```

---

## 8. Optimizing for Print

### Step 8.1: Print-Specific CSS

Add to `src/app/globals.css`:

```css
/* Print-specific styles */
@media print {
  /* Hide elements that shouldn't print */
  .no-print,
  .print\\:hidden {
    display: none !important;
  }

  /* Ensure colors print correctly */
  * {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  /* Page breaks */
  .print-force-new-page {
    page-break-before: always;
  }

  .print-avoid-break {
    page-break-inside: avoid;
  }

  /* Optimize spacing */
  html,
  body {
    height: initial !important;
    overflow: initial !important;
  }

  /* Remove page margins for full bleed */
  @page {
    margin: 0.5in;
  }

  /* Typography adjustments */
  body {
    font-size: 10pt;
    line-height: 1.4;
  }

  h1 {
    font-size: 18pt;
  }

  h2 {
    font-size: 14pt;
  }

  /* Link URLs (show after link text) */
  a[href^="http"]:after {
    content: " (" attr(href) ")";
    font-size: 8pt;
    color: #666;
  }

  /* But don't show for icon links */
  a[href] > svg {
    display: none;
  }
}
```

### Step 8.2: Print Button Component

Create `src/components/print-button.tsx`:

```typescript
"use client";  // Client component (uses browser API)

import { Printer } from "lucide-react";
import { Button } from "./ui/button";

export function PrintButton() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <Button
      onClick={handlePrint}
      className="fixed bottom-4 right-4 print:hidden"
      size="icon"
      variant="outline"
    >
      <Printer className="h-4 w-4" />
      <span className="sr-only">Print Resume</span>
    </Button>
  );
}
```

**Why "use client"?**

Next.js 14 uses Server Components by default. But `window.print()` only works in the browser (client). So we need to mark this as a Client Component.

**sr-only (screen reader only):**
```html
<span className="sr-only">Print Resume</span>
```
This text is hidden visually but read by screen readers for accessibility.

### Step 8.3: Print Recommendations

Add to your README:

```markdown
## Printing Your Resume

For best results:
1. **Browser:** Use Chrome or Chromium-based browsers (Edge, Brave, Arc)
2. **Settings:**
   - Enable "Background graphics"
   - Set margins to "Default"
   - Paper size: "A4" or "Letter"
   - Orientation: "Portrait"
3. **Save as PDF:** Use "Save as PDF" destination for digital copies
```

---

## 9. Adding Special Features

### Step 9.1: Command Menu

Create `src/components/command-menu.tsx`:

```typescript
"use client";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { CommandIcon } from "lucide-react";
import { useEffect, useState } from "react";

export function CommandMenu() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      // Cmd+K on Mac, Ctrl+K on Windows/Linux
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = (command: () => void) => {
    setOpen(false);
    command();
  };

  return (
    <>
      {/* Trigger button */}
      <Button
        onClick={() => setOpen(true)}
        variant="outline"
        className="fixed bottom-4 left-4 print:hidden"
        size="icon"
      >
        <CommandIcon className="h-4 w-4" />
      </Button>

      {/* Command dialog */}
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>

          <CommandGroup heading="Actions">
            <CommandItem
              onSelect={() => runCommand(() => window.print())}
            >
              Print Resume
            </CommandItem>

            <CommandItem
              onSelect={() => runCommand(() => {
                window.scrollTo({ top: 0, behavior: "smooth" });
              })}
            >
              Scroll to Top
            </CommandItem>
          </CommandGroup>

          <CommandGroup heading="Links">
            <CommandItem
              onSelect={() => runCommand(() => {
                window.open("https://github.com/yourname", "_blank");
              })}
            >
              GitHub
            </CommandItem>

            <CommandItem
              onSelect={() => runCommand(() => {
                window.open("https://linkedin.com/in/yourname", "_blank");
              })}
            >
              LinkedIn
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
```

**Key concepts:**

1. **useEffect for Keyboard Listener:**
```typescript
useEffect(() => {
  const handler = (e: KeyboardEvent) => {
    if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();  // Don't trigger browser's default Cmd+K
      setOpen(true);
    }
  };

  document.addEventListener("keydown", handler);

  // Cleanup: remove listener when component unmounts
  return () => document.removeEventListener("keydown", handler);
}, []);  // Empty array = run once on mount
```

2. **metaKey vs ctrlKey:**
- `metaKey`: Cmd key on Mac
- `ctrlKey`: Ctrl key on Windows/Linux

3. **Controlled Component:**
```typescript
<CommandDialog open={open} onOpenChange={setOpen}>
```
The dialog's open state is controlled by our `open` variable.

### Step 9.2: Error Boundaries

Create `src/components/error-boundary.tsx`:

```typescript
"use client";

import { Button } from "@/components/ui/button";
import { type ReactNode } from "react";
import { ErrorBoundary as ReactErrorBoundary } from "react-error-boundary";

function ErrorFallback({
  error,
  resetErrorBoundary,
}: {
  error: Error;
  resetErrorBoundary: () => void;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="space-y-4 text-center">
        <h1 className="text-2xl font-bold">Something went wrong</h1>
        <p className="text-muted-foreground">{error.message}</p>
        <Button onClick={resetErrorBoundary}>Try again</Button>
      </div>
    </div>
  );
}

export function ErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ReactErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        // Reset app state here if needed
        window.location.reload();
      }}
    >
      {children}
    </ReactErrorBoundary>
  );
}
```

**Wrap your app:**

```tsx
// src/app/layout.tsx
import { ErrorBoundary } from "@/components/error-boundary";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </body>
    </html>
  );
}
```

**How it works:**
- If any component throws an error, ErrorBoundary catches it
- Shows user-friendly error message instead of blank screen
- Provides "Try again" button to recover

### Step 9.3: Loading States

Create `src/app/loading.tsx`:

```typescript
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="container relative mx-auto scroll-my-12 overflow-auto p-4 md:p-16">
      <div className="mx-auto w-full max-w-2xl space-y-8">
        {/* Header skeleton */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />  {/* Name */}
            <Skeleton className="h-4 w-64" />  {/* About */}
            <Skeleton className="h-3 w-32" />  {/* Location */}
          </div>
          <Skeleton className="size-28 rounded-full" />  {/* Avatar */}
        </div>

        {/* Content skeleton */}
        <div className="space-y-4">
          <Skeleton className="h-6 w-32" />     {/* Section title */}
          <Skeleton className="h-32 w-full" />  {/* Content card */}
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    </main>
  );
}
```

**Skeleton component** (`src/components/ui/skeleton.tsx`):

```typescript
import { cn } from "@/lib/utils";

export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  );
}
```

**When does loading.tsx show?**
- Automatic: Next.js shows it while page is loading
- Wrapped in Suspense boundary automatically

---

## 10. Deployment

### Method 1: Vercel (Recommended)

**Steps:**
1. Push your code to GitHub:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/cv.git
git push -u origin main
```

2. Go to [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select your GitHub repository
5. Vercel auto-detects Next.js configuration
6. Click "Deploy"

**That's it!** Vercel will:
- Build your project
- Deploy to global CDN
- Give you a URL: `yourproject.vercel.app`
- Auto-deploy on every git push

**Custom domain:**
1. Buy a domain (e.g., from Namecheap, Google Domains)
2. In Vercel dashboard, go to "Domains"
3. Add your domain
4. Update DNS records (Vercel provides instructions)

### Method 2: Docker

**Build and run:**
```bash
# Build image
docker build -t cv-app .

# Run container
docker run -p 3000:3000 cv-app

# Or use Docker Compose
docker compose up -d
```

**Deploy to cloud:**
```bash
# AWS ECR
docker tag cv-app:latest <aws-account-id>.dkr.ecr.region.amazonaws.com/cv-app:latest
docker push <aws-account-id>.dkr.ecr.region.amazonaws.com/cv-app:latest

# Then deploy to ECS, EKS, or EC2
```

### Method 3: Static Export (Limited)

If you don't need the GraphQL API:

1. Update `next.config.js`:
```javascript
module.exports = {
  output: 'export',
};
```

2. Build:
```bash
bun build
```

3. Deploy `out/` folder to:
- GitHub Pages
- Netlify
- Cloudflare Pages
- Any static hosting

**Limitations:**
- No API routes (no GraphQL)
- No server-side rendering
- No image optimization

---

## Key Takeaways

### What You've Learned:

1. **Next.js 14 App Router**
   - File-based routing
   - Server Components by default
   - Special files (layout, page, loading, error)

2. **TypeScript**
   - Type safety
   - Interfaces for data structures
   - Decorators for GraphQL

3. **Tailwind CSS**
   - Utility-first styling
   - Responsive design
   - Print-specific styles

4. **Component Architecture**
   - Small, reusable components
   - Composition over configuration
   - Props and variants

5. **GraphQL**
   - Type-safe API
   - Decorators for schema
   - Resolvers for data

6. **Modern Patterns**
   - Error boundaries
   - Loading states
   - Keyboard shortcuts
   - Accessibility

### Best Practices Applied:

✅ Single source of truth (resume-data.tsx)
✅ Type safety (TypeScript everywhere)
✅ Accessibility (ARIA, semantic HTML, keyboard nav)
✅ Performance (Server Components, image optimization)
✅ SEO (metadata, Open Graph, structured data)
✅ Print optimization
✅ Error handling
✅ Code quality (Biome linting/formatting)

### Next Steps:

1. **Customize your data:** Edit `src/data/resume-data.tsx`
2. **Adjust styling:** Modify `tailwind.config.js` and `globals.css`
3. **Add features:**
   - Dark mode toggle
   - Language switcher
   - Contact form
   - Blog section
4. **Deploy:** Push to Vercel or your preferred platform
5. **Share:** Send your CV link to potential employers!

---

**Congratulations!** You now understand how to build a modern, production-ready web application with Next.js, TypeScript, and GraphQL.

This knowledge is transferable to building any kind of web application, not just CVs. The patterns and practices you've learned here are industry-standard and used by companies like Vercel, Netflix, and Airbnb.

Happy coding! 🚀
