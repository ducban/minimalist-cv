# Implementation Plan

## Table of Contents

- [Executive Summary](#executive-summary)
- [Project Timeline Overview](#project-timeline-overview)
- [Phase 1: Project Initialization](#phase-1-project-initialization)
- [Phase 2: Core Infrastructure](#phase-2-core-infrastructure)
- [Phase 3: UI Development](#phase-3-ui-development)
- [Phase 4: GraphQL Integration](#phase-4-graphql-integration)
- [Phase 5: Polish & Optimization](#phase-5-polish--optimization)
- [Phase 6: Deployment & Launch](#phase-6-deployment--launch)
- [Testing & QA Checkpoints](#testing--qa-checkpoints)
- [Resource Allocation](#resource-allocation)
- [Risk Management](#risk-management)
- [Success Metrics](#success-metrics)

---

## Executive Summary

This document outlines the comprehensive implementation plan for building the Minimalist CV web application from scratch. The project would be developed over **4-6 weeks** with a single full-stack developer, focusing on creating a production-ready, performant, and maintainable CV platform.

### Project Goals

1. Create a modern, print-friendly CV/resume application
2. Implement a GraphQL API for programmatic access to resume data
3. Achieve Lighthouse scores > 90 across all metrics
4. Support multiple deployment options (Vercel, Docker, self-hosted)
5. Maintain clean, well-documented codebase

### Technology Decisions Rationale

| Technology | Alternative Considered | Decision Rationale |
|------------|------------------------|-------------------|
| **Next.js 14** | Remix, Astro | App Router for modern React patterns, excellent DX |
| **TypeScript** | JavaScript | Type safety critical for CV data accuracy |
| **Tailwind CSS** | CSS Modules, Styled Components | Rapid UI development, small bundle size |
| **Biome** | ESLint + Prettier | 10-20x faster, single tool for linting & formatting |
| **shadcn/ui** | Custom components | Accessible, customizable, own the code |
| **TypeGraphQL** | Schema-first GraphQL | Type safety between TS and GraphQL schema |
| **Bun** | npm, yarn, pnpm | Fastest package manager, Docker-ready |

---

## Project Timeline Overview

```
Week 1: Setup & Infrastructure
├── Day 1-2: Project initialization, tooling setup
├── Day 3-4: Data modeling, type system
└── Day 5:   Basic routing, layout structure

Week 2: Core UI Development
├── Day 1-2: shadcn/ui integration, design system
├── Day 3-4: Resume sections (Header, Work, Education)
└── Day 5:   Skills & Projects sections

Week 3: Advanced Features
├── Day 1-2: GraphQL API implementation
├── Day 3:   Command menu (Cmd+K)
└── Day 4-5: Print optimization, error handling

Week 4: Polish & Testing
├── Day 1-2: Performance optimization
├── Day 3:   Accessibility improvements
└── Day 4-5: Browser testing, bug fixes

Week 5: Deployment & Documentation
├── Day 1-2: Docker setup, CI/CD pipeline
├── Day 3-4: Deploy to Vercel, domain setup
└── Day 5:   Documentation, launch prep

Week 6: Buffer & Contingency
└── Reserved for unexpected issues, refinements
```

**Total Estimated Time**: 4-5 weeks (6 weeks with buffer)

---

## Phase 1: Project Initialization

**Duration**: 2 days
**Status**: Foundation

### Objectives

- Set up development environment
- Initialize Next.js project with TypeScript
- Configure tooling (Biome, Git)
- Define project structure

### Tasks

#### Day 1: Environment Setup

**Morning (4 hours)**

1. **Create Next.js Project**
   ```bash
   bunx create-next-app@latest minimalist-cv \
     --typescript \
     --tailwind \
     --app \
     --no-src-dir
   ```

2. **Project Structure Planning**
   ```
   minimalist-cv/
   ├── src/
   │   ├── app/           # Next.js App Router
   │   ├── components/    # UI components
   │   ├── lib/           # Utilities, types
   │   ├── data/          # Resume data
   │   └── apollo/        # GraphQL setup
   ├── public/            # Static assets
   └── config files
   ```

3. **Git Initialization**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Next.js + TypeScript + Tailwind"
   ```

**Afternoon (4 hours)**

4. **Replace ESLint/Prettier with Biome**
   ```bash
   bun remove eslint prettier
   bun add -D @biomejs/biome
   bunx biome init
   ```

5. **Configure Biome** (`biome.json`)
   - Set line width to 80
   - Enable accessibility rules
   - Configure filename conventions
   - Set up recommended linting rules

6. **Update package.json scripts**
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

**Testing Checkpoint**:
- ✅ `bun dev` starts development server
- ✅ `bun check` runs without errors
- ✅ TypeScript compiles successfully

---

#### Day 2: TypeScript & Configuration

**Morning (4 hours)**

1. **Configure TypeScript for Decorators**

   Update `tsconfig.json`:
   ```json
   {
     "compilerOptions": {
       "experimentalDecorators": true,
       "emitDecoratorMetadata": true,
       "strictPropertyInitialization": false,
       "target": "es2021"
     }
   }
   ```

2. **Set Up Path Aliases**
   ```json
   {
     "paths": {
       "@/*": ["./src/*"]
     }
   }
   ```

3. **Create Base Type Definitions**

   File: `src/lib/types.ts`
   ```typescript
   export interface ResumeData {
     name: string;
     initials: string;
     // ... define all resume fields
   }
   ```

**Afternoon (4 hours)**

4. **Configure Next.js** (`next.config.js`)
   - Enable React strict mode
   - Configure image domains
   - Set up security headers
   - Enable compression and SWC minification

5. **Set Up Tailwind Custom Theme**

   File: `tailwind.config.js`
   - Configure color system with CSS variables
   - Add custom fonts
   - Set up responsive breakpoints

6. **Create Global Styles**

   File: `src/app/globals.css`
   - Define CSS custom properties
   - Set up print styles foundation
   - Configure base typography

**Git Checkpoint**:
```bash
git add .
git commit -m "Configure TypeScript, Next.js, and Tailwind"
```

---

## Phase 2: Core Infrastructure

**Duration**: 3 days
**Status**: Data & Layout

### Objectives

- Define comprehensive data model
- Create resume data file
- Set up page routing and layouts
- Implement error handling foundation

---

#### Day 3: Data Modeling

**Morning (4 hours)**

1. **Define Complete Type System**

   File: `src/lib/types.ts`
   ```typescript
   // Main resume data structure
   export interface ResumeData {
     name: string;
     initials: string;
     location: string;
     locationLink: string;
     about: string;
     summary: string | React.ReactNode;
     avatarUrl: string;
     personalWebsiteUrl: string;
     contact: ContactInfo;
     education: Education[];
     work: WorkExperience[];
     skills: string[];
     projects: Project[];
   }

   // Nested types
   export interface ContactInfo { /* ... */ }
   export interface Education { /* ... */ }
   export interface WorkExperience { /* ... */ }
   export interface Project { /* ... */ }
   ```

2. **Create Initial Resume Data**

   File: `src/data/resume-data.tsx`
   ```typescript
   import type { ResumeData } from "@/lib/types";

   export const RESUME_DATA: ResumeData = {
     name: "Your Name",
     initials: "YN",
     // ... populate with actual data
   };
   ```

**Afternoon (4 hours)**

3. **Type Validation & Testing**
   - Ensure data matches types exactly
   - Test with optional fields
   - Verify array structures

4. **Create GraphQL-Compatible Types**

   Add to `src/lib/types.ts`:
   ```typescript
   // GraphQL-safe types (no React nodes)
   export interface GraphQLMe {
     name: string;
     summary: string; // Always string
     // ...
   }

   // Transformation helper
   export function resumeDataToGraphQL(data: ResumeData): GraphQLMe {
     // Convert React nodes to strings
   }
   ```

**Testing Checkpoint**:
- ✅ TypeScript validates all data fields
- ✅ No type errors in IDE
- ✅ Data structure is logical and complete

---

#### Day 4: Routing & Layout

**Morning (4 hours)**

1. **Create Root Layout**

   File: `src/app/layout.tsx`
   ```typescript
   export default function RootLayout({
     children,
   }: {
     children: React.ReactNode;
   }) {
     return (
       <html lang="en">
         <body>
           {children}
         </body>
       </html>
     );
   }
   ```

2. **Add Metadata & SEO**
   ```typescript
   export const metadata: Metadata = {
     title: "Name - Resume",
     description: "Professional resume",
     openGraph: { /* ... */ },
     twitter: { /* ... */ },
   };
   ```

3. **Integrate Vercel Analytics**
   ```bash
   bun add @vercel/analytics
   ```

   Add to layout:
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

**Afternoon (4 hours)**

4. **Create Main Resume Page**

   File: `src/app/page.tsx`
   ```typescript
   import { RESUME_DATA } from "@/data/resume-data";

   export default function ResumePage() {
     return (
       <main className="container mx-auto p-4">
         <h1>{RESUME_DATA.name}</h1>
         {/* Placeholder sections */}
       </main>
     );
   }
   ```

5. **Implement Error Boundaries**

   File: `src/components/error-boundary.tsx`
   ```typescript
   'use client';

   export class ErrorBoundary extends Component {
     // Catch component errors
   }
   ```

   File: `src/components/section-error-boundary.tsx`
   ```typescript
   export function SectionErrorBoundary({
     sectionName,
     children
   }) {
     // Section-specific error handling
   }
   ```

6. **Create Loading States**

   File: `src/components/section-skeleton.tsx`
   ```typescript
   export function SectionSkeleton({ lines }: { lines: number }) {
     return (
       <div className="animate-pulse">
         {/* Skeleton UI */}
       </div>
     );
   }
   ```

**Git Checkpoint**:
```bash
git add .
git commit -m "Add routing, layouts, and error handling"
```

---

#### Day 5: Infrastructure Completion

**Morning (4 hours)**

1. **Structured Data for SEO**

   File: `src/lib/structured-data.ts`
   ```typescript
   export function generateResumeStructuredData() {
     return {
       "@context": "https://schema.org/",
       "@type": "Person",
       name: RESUME_DATA.name,
       // ... JSON-LD schema
     };
   }
   ```

2. **Utility Functions**

   File: `src/lib/utils.ts`
   ```typescript
   import { clsx } from "clsx";
   import { twMerge } from "tailwind-merge";

   export function cn(...inputs: ClassValue[]) {
     return twMerge(clsx(inputs));
   }
   ```

**Afternoon (4 hours)**

3. **Testing Infrastructure**
   - Manual test: page loads correctly
   - Verify error boundary catches errors
   - Test loading states
   - Check TypeScript compilation

4. **Code Quality Check**
   ```bash
   bun check:fix
   ```

**Phase 1-2 Review**:
- ✅ Project structure is clean and logical
- ✅ Type system is comprehensive
- ✅ Error handling is in place
- ✅ SEO metadata is configured
- ✅ No linting/formatting issues

---

## Phase 3: UI Development

**Duration**: 5 days
**Status**: Component Building

### Objectives

- Integrate shadcn/ui component library
- Build all resume section components
- Implement responsive design
- Add print-specific styles

---

#### Day 6: Design System Setup

**Morning (4 hours)**

1. **Install shadcn/ui Dependencies**
   ```bash
   bun add class-variance-authority clsx tailwind-merge
   bun add @radix-ui/react-slot @radix-ui/react-avatar
   bun add lucide-react
   ```

2. **Initialize shadcn/ui**
   ```bash
   bunx shadcn-ui@latest init
   ```

   Configuration:
   - Style: Default
   - Base color: Slate
   - CSS variables: Yes

3. **Add Core UI Components**
   ```bash
   bunx shadcn-ui@latest add button
   bunx shadcn-ui@latest add card
   bunx shadcn-ui@latest add badge
   bunx shadcn-ui@latest add avatar
   bunx shadcn-ui@latest add dialog
   ```

**Afternoon (4 hours)**

4. **Customize Theme Colors**

   Update `globals.css`:
   ```css
   :root {
     --primary: 220.9 39.3% 11%;
     --secondary: 220 14.3% 95.9%;
     /* ... custom colors */
   }
   ```

5. **Create Custom Section Component**

   File: `src/components/ui/section.tsx`
   ```typescript
   export function Section({
     heading,
     children
   }: SectionProps) {
     return (
       <section className="space-y-4">
         <h2 className="text-xl font-bold">{heading}</h2>
         {children}
       </section>
     );
   }
   ```

6. **Design System Testing**
   - Create component showcase page
   - Test all variants (button, badge, etc.)
   - Verify color contrast for accessibility

**Git Checkpoint**:
```bash
git add .
git commit -m "Add shadcn/ui and design system"
```

---

#### Day 7-8: Resume Section Components

**Day 7 Morning (4 hours)**

1. **Header Component**

   File: `src/app/components/Header.tsx`
   ```typescript
   import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
   import { RESUME_DATA } from "@/data/resume-data";

   export function Header() {
     return (
       <header className="flex items-start justify-between">
         <div className="flex-1">
           <h1 className="text-3xl font-bold">
             {RESUME_DATA.name}
           </h1>
           <p className="text-muted-foreground">
             {RESUME_DATA.about}
           </p>
           {/* Contact info */}
         </div>
         <Avatar>
           <AvatarImage src={RESUME_DATA.avatarUrl} />
           <AvatarFallback>{RESUME_DATA.initials}</AvatarFallback>
         </Avatar>
       </header>
     );
   }
   ```

**Day 7 Afternoon (4 hours)**

2. **Summary Component**

   File: `src/app/components/Summary.tsx`
   ```typescript
   export function Summary({ summary }: { summary: React.ReactNode }) {
     return (
       <Section heading="About">
         <div className="text-sm text-muted-foreground">
           {summary}
         </div>
       </Section>
     );
   }
   ```

3. **Create Icon Components**

   File: `src/components/icons/GitHubIcon.tsx`
   File: `src/components/icons/LinkedInIcon.tsx`
   File: `src/components/icons/x-icon.tsx`

   ```typescript
   export function GitHubIcon(props: React.SVGProps<SVGSVGElement>) {
     return <svg {...props}>{/* SVG path */}</svg>;
   }
   ```

**Day 8 Morning (4 hours)**

4. **Work Experience Component**

   File: `src/app/components/WorkExperience.tsx`
   ```typescript
   import { Card } from "@/components/ui/card";
   import { Badge } from "@/components/ui/badge";

   export function WorkExperience({ work }: Props) {
     return (
       <Section heading="Work Experience">
         {work.map((job) => (
           <Card key={job.company}>
             <div className="flex justify-between">
               <div>
                 <h3 className="font-semibold">{job.title}</h3>
                 <p className="text-sm text-muted-foreground">
                   {job.company}
                 </p>
               </div>
               <div className="text-sm text-muted-foreground">
                 {job.start} - {job.end}
               </div>
             </div>
             <div className="flex gap-1 flex-wrap mt-2">
               {job.badges.map((badge) => (
                 <Badge key={badge}>{badge}</Badge>
               ))}
             </div>
             <p className="mt-2 text-sm">{job.description}</p>
           </Card>
         ))}
       </Section>
     );
   }
   ```

**Day 8 Afternoon (4 hours)**

5. **Education Component**

   File: `src/app/components/Education.tsx`
   ```typescript
   export function Education({ education }: Props) {
     return (
       <Section heading="Education">
         {education.map((edu) => (
           <Card key={edu.school}>
             <h3 className="font-semibold">{edu.school}</h3>
             <p className="text-sm">{edu.degree}</p>
             <p className="text-xs text-muted-foreground">
               {edu.start} - {edu.end}
             </p>
           </Card>
         ))}
       </Section>
     );
   }
   ```

6. **Skills Component**

   File: `src/app/components/Skills.tsx`
   ```typescript
   import { Badge } from "@/components/ui/badge";

   export function Skills({ skills }: Props) {
     return (
       <Section heading="Skills">
         <div className="flex flex-wrap gap-1">
           {skills.map((skill) => (
             <Badge key={skill} variant="secondary">
               {skill}
             </Badge>
           ))}
         </div>
       </Section>
     );
   }
   ```

---

#### Day 9: Projects & Polish

**Morning (4 hours)**

1. **Projects Component**

   File: `src/app/components/Projects.tsx`
   ```typescript
   export function Projects({ projects }: Props) {
     return (
       <Section heading="Highlight Projects">
         {projects.map((project) => (
           <Card key={project.title}>
             <h3 className="font-semibold">{project.title}</h3>
             <div className="flex gap-1 flex-wrap mt-1">
               {project.techStack.map((tech) => (
                 <Badge key={tech} variant="outline">
                   {tech}
                 </Badge>
               ))}
             </div>
             <p className="mt-2 text-sm">{project.description}</p>
             {project.link && (
               <a
                 href={project.link.href}
                 className="text-sm text-blue-600 hover:underline"
               >
                 {project.link.label}
               </a>
             )}
           </Card>
         ))}
       </Section>
     );
   }
   ```

**Afternoon (4 hours)**

2. **Integrate All Sections in Page**

   Update `src/app/page.tsx`:
   ```typescript
   export default function ResumePage() {
     return (
       <main className="container mx-auto p-4 md:p-16">
         <div className="max-w-2xl mx-auto space-y-8">
           <SectionErrorBoundary sectionName="Header">
             <Suspense fallback={<SectionSkeleton lines={4} />}>
               <Header />
             </Suspense>
           </SectionErrorBoundary>

           {/* Repeat for all sections */}
         </div>
       </main>
     );
   }
   ```

3. **Responsive Design Testing**
   - Mobile (375px)
   - Tablet (768px)
   - Desktop (1024px+)

**Git Checkpoint**:
```bash
git add .
git commit -m "Add all resume section components"
```

---

#### Day 10: Print Optimization

**Morning (4 hours)**

1. **Print Styles in globals.css**
   ```css
   @media print {
     /* Hide non-printable elements */
     .print\:hidden {
       display: none !important;
     }

     /* Force page breaks */
     .print-force-new-page {
       page-break-before: always;
     }

     /* Optimize spacing */
     .print\:space-y-4 > * + * {
       margin-top: 1rem;
     }

     /* Ensure backgrounds print */
     * {
       -webkit-print-color-adjust: exact;
       color-adjust: exact;
     }

     /* Remove shadows for cleaner print */
     .shadow,
     .shadow-sm,
     .shadow-md {
       box-shadow: none !important;
     }
   }
   ```

2. **Update Components for Print**
   - Add `print:hidden` to command menu
   - Adjust spacing: `space-y-8 print:space-y-4`
   - Optimize page breaks
   - Test PDF export

**Afternoon (4 hours)**

3. **Print Testing Across Browsers**
   - Chrome: Print to PDF
   - Safari: Print to PDF
   - Firefox: Print to PDF
   - Verify layout consistency

4. **Print Optimization Checklist**
   - ✅ Fits on standard letter/A4 paper
   - ✅ No content clipping
   - ✅ Interactive elements hidden
   - ✅ Colors print correctly
   - ✅ Links show URLs in print (optional)

**Phase 3 Review**:
- ✅ All sections implemented and styled
- ✅ Responsive on mobile, tablet, desktop
- ✅ Print styles work perfectly
- ✅ Accessibility features present
- ✅ Code is clean and maintainable

---

## Phase 4: GraphQL Integration

**Duration**: 2.5 days
**Status**: API Development

### Objectives

- Set up Apollo Server with TypeGraphQL
- Define GraphQL schema using decorators
- Create resolvers for resume data
- Test GraphQL endpoint

---

#### Day 11: GraphQL Setup

**Morning (4 hours)**

1. **Install GraphQL Dependencies**
   ```bash
   bun add @apollo/server graphql type-graphql
   bun add @as-integrations/next reflect-metadata
   bun add graphql-scalars class-validator
   ```

2. **Create GraphQL Type Definitions**

   File: `src/apollo/type-defs.ts`
   ```typescript
   import { Field, ObjectType } from "type-graphql";

   @ObjectType()
   export class Social {
     @Field(() => String)
     name: string;

     @Field(() => String)
     url: string;
   }

   @ObjectType()
   export class Contact {
     @Field(() => String)
     email: string;

     @Field(() => String)
     tel: string;

     @Field(() => [Social])
     social: Social[];
   }

   // ... define all GraphQL types
   ```

**Afternoon (4 hours)**

3. **Create Resolver**

   File: `src/apollo/resolvers.ts`
   ```typescript
   import { Query, Resolver } from "type-graphql";
   import { RESUME_DATA } from "../data/resume-data";
   import { resumeDataToGraphQL } from "../lib/types";
   import { Me } from "./type-defs";

   @Resolver(() => Me)
   export class MeResolver {
     @Query(() => Me)
     me(): Me {
       return resumeDataToGraphQL(RESUME_DATA);
     }
   }
   ```

4. **Testing Type Transformations**
   - Test `resumeDataToGraphQL()` function
   - Verify React nodes convert to strings
   - Check optional fields handling

---

#### Day 12: Apollo Server Integration

**Morning (4 hours)**

1. **Create GraphQL Route Handler**

   File: `src/app/graphql/route.ts`
   ```typescript
   import "reflect-metadata";
   import { ApolloServer } from "@apollo/server";
   import { startServerAndCreateNextHandler } from "@as-integrations/next";
   import { NextRequest, NextResponse } from "next/server";
   import { buildSchema } from "type-graphql";
   import { MeResolver } from "../../apollo/resolvers";

   let apolloServer: ApolloServer;
   let handler: any;

   try {
     const schema = await buildSchema({
       resolvers: [MeResolver],
     });

     apolloServer = new ApolloServer({
       schema,
       introspection: process.env.NODE_ENV !== "production",
       formatError: (err) => {
         // Error handling
       },
     });

     handler = startServerAndCreateNextHandler<NextRequest>(
       apolloServer,
       { context: async (req) => ({ req }) }
     );
   } catch (error) {
     console.error("Failed to initialize Apollo Server:", error);
     handler = async () => NextResponse.json(
       { error: "GraphQL server initialization failed" },
       { status: 500 }
     );
   }

   export { handler as GET, handler as POST };
   ```

**Afternoon (4 hours)**

2. **Test GraphQL Endpoint**

   Visit: `http://localhost:3000/graphql`

   Test query:
   ```graphql
   query {
     me {
       name
       initials
       about
       contact {
         email
         tel
         social {
           name
           url
         }
       }
       work {
         company
         title
         start
         end
         description
       }
       education {
         school
         degree
         start
         end
       }
       skills
       projects {
         title
         techStack
         description
       }
     }
   }
   ```

3. **Error Handling & Validation**
   - Test with missing data
   - Verify error messages
   - Check production error sanitization

---

#### Day 13: GraphQL Testing & Documentation

**Morning (4 hours)**

1. **Create Example Queries**

   File: `DOCS/graphql-examples.md`
   ```markdown
   # Example Queries

   ## Get Basic Info
   query GetBasicInfo {
     me {
       name
       about
       contact {
         email
       }
     }
   }

   ## Get Work Experience
   query GetWorkExperience {
     me {
       work {
         company
         title
         start
         end
       }
     }
   }
   ```

**Afternoon (4 hours)**

2. **GraphQL Schema Documentation**
   - Auto-generate schema docs
   - Document all types and fields
   - Add usage examples

3. **Integration Testing**
   - Test from external client (Postman, Insomnia)
   - Verify CORS if needed
   - Check response times

**Git Checkpoint**:
```bash
git add .
git commit -m "Add GraphQL API with Apollo Server"
```

**Phase 4 Review**:
- ✅ GraphQL endpoint working
- ✅ All resume data accessible via API
- ✅ Type safety maintained
- ✅ Error handling in place
- ✅ Documentation complete

---

## Phase 5: Polish & Optimization

**Duration**: 3 days
**Status**: Enhancement

### Objectives

- Add command menu (Cmd+K)
- Optimize performance
- Improve accessibility
- Add animations and polish

---

#### Day 14: Command Menu

**Morning (4 hours)**

1. **Install cmdk**
   ```bash
   bun add cmdk
   bunx shadcn-ui@latest add command
   ```

2. **Create Command Menu Component**

   File: `src/components/command-menu.tsx`
   ```typescript
   'use client';

   import { useEffect, useState } from "react";
   import { Command } from "@/components/ui/command";
   import { Dialog } from "@/components/ui/dialog";

   export function CommandMenu({ links }: Props) {
     const [open, setOpen] = useState(false);

     useEffect(() => {
       const down = (e: KeyboardEvent) => {
         if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
           e.preventDefault();
           setOpen((open) => !open);
         }
       };

       document.addEventListener("keydown", down);
       return () => document.removeEventListener("keydown", down);
     }, []);

     return (
       <Dialog open={open} onOpenChange={setOpen}>
         <Command>
           {/* Command palette UI */}
         </Command>
       </Dialog>
     );
   }
   ```

**Afternoon (4 hours)**

3. **Integrate Command Menu**

   Update `page.tsx`:
   ```typescript
   function getCommandMenuLinks() {
     return [
       { url: RESUME_DATA.personalWebsiteUrl, title: "Website" },
       ...RESUME_DATA.contact.social.map(s => ({
         url: s.url,
         title: s.name
       }))
     ];
   }

   export default function ResumePage() {
     return (
       <>
         {/* Resume sections */}
         <CommandMenu links={getCommandMenuLinks()} />
       </>
     );
   }
   ```

4. **Test Keyboard Navigation**
   - Cmd+K / Ctrl+K opens menu
   - Arrow keys navigate
   - Enter selects
   - Escape closes

---

#### Day 15: Performance Optimization

**Morning (4 hours)**

1. **Run Lighthouse Audit**
   ```bash
   # Install Lighthouse CLI
   npm install -g lighthouse

   # Run audit
   lighthouse http://localhost:3000 --view
   ```

2. **Optimize Images**
   - Use Next.js Image component
   - Serve WebP/AVIF formats
   - Add proper width/height
   - Lazy load below-fold images

3. **Code Splitting**
   ```typescript
   // Lazy load command menu
   const CommandMenu = dynamic(
     () => import('@/components/command-menu'),
     { ssr: false }
   );
   ```

**Afternoon (4 hours)**

4. **Font Optimization**
   - Self-host Google Fonts
   - Preload critical fonts
   - Use `font-display: swap`

5. **Bundle Size Optimization**
   ```bash
   # Analyze bundle
   ANALYZE=true bun run build
   ```

   - Remove unused dependencies
   - Tree-shake imports
   - Check for duplicate packages

6. **Performance Metrics**

   Target:
   - LCP < 2.5s
   - FID < 100ms
   - CLS < 0.1
   - Total Bundle < 300KB

**Git Checkpoint**:
```bash
git add .
git commit -m "Add command menu and performance optimizations"
```

---

#### Day 16: Accessibility & Final Polish

**Morning (4 hours)**

1. **Accessibility Audit**
   - Run axe DevTools
   - Check keyboard navigation
   - Test with screen reader (NVDA/VoiceOver)
   - Verify color contrast (WCAG AA)

2. **Accessibility Improvements**
   ```typescript
   // Add skip link
   <a href="#main-content" className="sr-only focus:not-sr-only">
     Skip to main content
   </a>

   // Add ARIA labels
   <section aria-label="Resume Content">
   <nav aria-label="Quick navigation">

   // Improve focus indicators
   .focus-visible {
     outline: 2px solid blue;
   }
   ```

3. **Semantic HTML Review**
   - Proper heading hierarchy (h1 → h2 → h3)
   - Meaningful alt text for images
   - Correct landmark elements

**Afternoon (4 hours)**

4. **Add Animations**
   ```typescript
   // Subtle entrance animations
   <div className="animate-in fade-in duration-300">
     {children}
   </div>
   ```

5. **Micro-interactions**
   - Hover states on links
   - Button press effects
   - Smooth scrolling

6. **Final Visual Polish**
   - Consistent spacing
   - Typography refinement
   - Color adjustments
   - Shadow depths

**Phase 5 Review**:
- ✅ Command menu works perfectly
- ✅ Lighthouse score > 90 all metrics
- ✅ WCAG AA accessibility standards met
- ✅ Smooth animations and interactions
- ✅ Professional polish applied

---

## Phase 6: Deployment & Launch

**Duration**: 2 days
**Status**: Production Ready

### Objectives

- Set up Docker support
- Deploy to Vercel
- Configure custom domain
- Final testing and documentation

---

#### Day 17: Docker & CI/CD

**Morning (4 hours)**

1. **Create Dockerfile**

   File: `Dockerfile`
   ```dockerfile
   FROM oven/bun:1 as BUILD_STAGE

   WORKDIR /app

   COPY package.json bun.lockb ./
   RUN bun install --frozen-lockfile

   COPY . .
   RUN bun run build

   FROM oven/bun:1-alpine

   WORKDIR /app

   COPY --from=BUILD_STAGE /app/package.json ./package.json
   COPY --from=BUILD_STAGE /app/node_modules ./node_modules
   COPY --from=BUILD_STAGE /app/.next ./.next
   COPY --from=BUILD_STAGE /app/public ./public

   EXPOSE 3000

   CMD ["bun", "start"]
   ```

2. **Create docker-compose.yaml**
   ```yaml
   version: '3.8'

   services:
     app:
       build: .
       ports:
         - '3000:3000'
       environment:
         - NODE_ENV=production
       restart: unless-stopped
   ```

3. **Test Docker Build**
   ```bash
   docker compose build
   docker compose up -d
   # Test: http://localhost:3000
   docker compose down
   ```

**Afternoon (4 hours)**

4. **Create .dockerignore**
   ```
   node_modules
   .next
   .git
   .env*.local
   ```

5. **GitHub Actions CI/CD** (Optional)

   File: `.github/workflows/ci.yml`
   ```yaml
   name: CI

   on: [push, pull_request]

   jobs:
     build:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         - uses: oven-sh/setup-bun@v1
         - run: bun install
         - run: bun check
         - run: bun run build
   ```

---

#### Day 18: Vercel Deployment

**Morning (4 hours)**

1. **Push to GitHub**
   ```bash
   git remote add origin https://github.com/username/minimalist-cv.git
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Visit vercel.com
   - Import GitHub repository
   - Configure project settings:
     - Framework: Next.js
     - Build command: `bun run build`
     - Output directory: `.next`
   - Deploy

3. **Environment Variables** (if any)
   - Add to Vercel dashboard
   - No secrets needed for this project

**Afternoon (4 hours)**

4. **Custom Domain Setup**
   - Add custom domain in Vercel
   - Configure DNS records:
     ```
     A    @    76.76.21.21
     CNAME www  cname.vercel-dns.com
     ```
   - Wait for SSL certificate

5. **Post-Deployment Testing**
   - Test production URL
   - Verify all links work
   - Check GraphQL endpoint
   - Test on mobile devices
   - Verify print functionality
   - Run Lighthouse on production

6. **Final Checklist**
   - ✅ All pages load correctly
   - ✅ No console errors
   - ✅ GraphQL API works
   - ✅ Print to PDF works
   - ✅ Mobile responsive
   - ✅ Command menu works
   - ✅ Analytics tracking
   - ✅ SEO metadata correct
   - ✅ Custom domain active

**Git Checkpoint**:
```bash
git add .
git commit -m "Add Docker support and deployment configuration"
git push origin main
```

---

## Testing & QA Checkpoints

### Checkpoint 1: After Phase 2 (Infrastructure)

**Tests**:
- ✅ TypeScript compiles without errors
- ✅ Development server starts (`bun dev`)
- ✅ Production build succeeds (`bun build`)
- ✅ Linting passes (`bun check`)
- ✅ Data types are correct

**Action**: Proceed if all tests pass

---

### Checkpoint 2: After Phase 3 (UI)

**Tests**:
- ✅ All sections render correctly
- ✅ Responsive on mobile (375px), tablet (768px), desktop (1024px+)
- ✅ Print preview looks good
- ✅ No visual bugs
- ✅ Error boundaries catch errors
- ✅ Loading states work

**Manual Testing**:
```bash
# Test responsive design
# Chrome DevTools → Device Toolbar
# Test: iPhone SE, iPad, Desktop

# Test print
# Cmd+P → Print Preview
# Verify layout fits on one page
```

**Action**: Fix any UI issues before proceeding

---

### Checkpoint 3: After Phase 4 (GraphQL)

**Tests**:
- ✅ GraphQL endpoint accessible (`/graphql`)
- ✅ Query returns correct data
- ✅ Error handling works
- ✅ Introspection enabled (dev only)
- ✅ Types match between TS and GraphQL

**Manual Testing**:
```graphql
# Test in GraphQL Playground
query TestQuery {
  me {
    name
    work { company title }
    education { school }
    skills
  }
}
```

**Action**: Verify API before optimization phase

---

### Checkpoint 4: After Phase 5 (Optimization)

**Tests**:
- ✅ Lighthouse Performance > 90
- ✅ Lighthouse Accessibility > 90
- ✅ Lighthouse Best Practices > 90
- ✅ Lighthouse SEO > 90
- ✅ Core Web Vitals pass
- ✅ Command menu works (Cmd+K)
- ✅ Keyboard navigation functional

**Tools**:
```bash
# Run Lighthouse
lighthouse http://localhost:3000 --view

# Check bundle size
ANALYZE=true bun run build
```

**Action**: Optimize further if any score < 90

---

### Checkpoint 5: Pre-Deployment

**Tests**:
- ✅ Production build succeeds
- ✅ Docker build succeeds
- ✅ All environment variables set
- ✅ No hardcoded secrets
- ✅ Error pages configured
- ✅ Security headers present

**Manual Testing**:
```bash
# Test production build locally
bun run build
bun start
# Verify: http://localhost:3000

# Test Docker
docker compose up
# Verify: http://localhost:3000
```

**Action**: Deploy if all tests pass

---

### Checkpoint 6: Post-Deployment

**Tests**:
- ✅ Production URL loads
- ✅ Custom domain works (if configured)
- ✅ SSL certificate active
- ✅ GraphQL endpoint works
- ✅ Analytics tracking
- ✅ No 404 errors
- ✅ Mobile devices work

**Cross-Browser Testing**:
- ✅ Chrome (Windows, Mac)
- ✅ Firefox
- ✅ Safari (Mac, iOS)
- ✅ Edge

**Action**: Monitor for 24-48 hours after launch

---

## Resource Allocation

### Team Structure

**Single Developer** (Full-stack)
- Frontend development (React, Next.js)
- Backend development (GraphQL)
- DevOps (Docker, Vercel)
- Design implementation
- Testing and QA

**Total Time**: 160 hours (4 weeks × 40 hours/week)

---

### Time Breakdown by Phase

| Phase | Duration | Hours | % of Total |
|-------|----------|-------|------------|
| **Phase 1**: Initialization | 2 days | 16h | 10% |
| **Phase 2**: Infrastructure | 3 days | 24h | 15% |
| **Phase 3**: UI Development | 5 days | 40h | 25% |
| **Phase 4**: GraphQL | 2.5 days | 20h | 12.5% |
| **Phase 5**: Optimization | 3 days | 24h | 15% |
| **Phase 6**: Deployment | 2 days | 16h | 10% |
| **Testing & QA** | Ongoing | 20h | 12.5% |
| **Total** | 17.5 days | 160h | 100% |

**Buffer**: Additional 1-2 weeks reserved for:
- Unexpected technical challenges
- Scope changes
- Additional polish
- Documentation

---

### Required Skills

**Essential**:
- TypeScript proficiency
- React/Next.js experience
- Tailwind CSS knowledge
- GraphQL basics
- Git version control

**Nice to Have**:
- Docker experience
- Design sense
- Accessibility knowledge
- Performance optimization

---

### Tools & Services

| Category | Tool | Cost |
|----------|------|------|
| **Hosting** | Vercel | Free (Hobby plan) |
| **Domain** | Your provider | ~$10-15/year |
| **Analytics** | Vercel Analytics | Free |
| **Version Control** | GitHub | Free |
| **Development** | VS Code | Free |
| **Package Manager** | Bun | Free |
| **Design** | Figma (optional) | Free |

**Total Monthly Cost**: $0 (excluding domain)

---

## Risk Management

### Technical Risks

#### Risk 1: TypeScript Decorator Issues

**Probability**: Medium
**Impact**: High

**Mitigation**:
- Test decorator setup early (Day 2)
- Keep `reflect-metadata` updated
- Follow TypeGraphQL documentation exactly
- Have fallback plan (schema-first approach)

**Contingency**:
If decorators fail, switch to schema-first GraphQL:
```typescript
// Instead of decorators, use SDL
const typeDefs = `
  type Query {
    me: Me
  }
  type Me {
    name: String!
  }
`;
```

---

#### Risk 2: Performance Below Target

**Probability**: Low
**Impact**: Medium

**Mitigation**:
- Profile performance early and often
- Use Lighthouse CI in development
- Implement code splitting from start
- Monitor bundle sizes continuously

**Contingency**:
- Remove heavy dependencies (e.g., replace library with custom code)
- Implement more aggressive code splitting
- Use dynamic imports for non-critical features
- Consider server-side rendering optimization

---

#### Risk 3: Browser Compatibility Issues

**Probability**: Low
**Impact**: Medium

**Mitigation**:
- Target modern browsers only (ES2021+)
- Test in Chrome, Firefox, Safari early
- Use standard CSS (avoid experimental features)
- Implement feature detection where needed

**Contingency**:
- Add polyfills for specific features
- Implement graceful degradation
- Provide fallback styles for older browsers

---

### Project Risks

#### Risk 4: Scope Creep

**Probability**: Medium
**Impact**: High

**Mitigation**:
- Define clear MVP features upfront
- Maintain "nice to have" vs "must have" list
- Time-box each phase strictly
- Regular progress reviews

**Out of Scope**:
- User authentication
- Database integration
- Multi-user support
- Content management system
- Real-time updates

---

#### Risk 5: Timeline Overrun

**Probability**: Medium
**Impact**: Medium

**Mitigation**:
- Build in 1-2 week buffer
- Prioritize core features first
- Daily progress tracking
- Weekly milestone reviews

**Contingency Plan**:
If behind schedule, defer these features:
- Command menu (can add post-launch)
- Advanced animations
- Docker support (can deploy Vercel-only)
- GraphQL API (can add later)

**Minimum Viable Product**:
1. Resume page with all sections
2. Print-friendly layout
3. Responsive design
4. Deployed to Vercel

---

#### Risk 6: Deployment Issues

**Probability**: Low
**Impact**: Medium

**Mitigation**:
- Test deployment early (Week 3)
- Use Vercel's one-click deployment
- Keep Docker as backup option
- Document deployment process

**Contingency**:
- Alternative hosts: Netlify, AWS Amplify, Cloudflare Pages
- Static export as last resort: `next export`

---

### Dependency Risks

#### Risk 7: Breaking Package Updates

**Probability**: Low
**Impact**: Low

**Mitigation**:
- Lock dependency versions (`bun.lockb`)
- Review changelogs before updating
- Test after each major update
- Keep Next.js on stable channel (not canary)

**Response**:
- Pin working versions
- Wait for community fixes
- Fork and patch if critical

---

## Success Metrics

### Technical Metrics

**Performance**:
- ✅ Lighthouse Performance > 90
- ✅ Largest Contentful Paint < 2.5s
- ✅ First Input Delay < 100ms
- ✅ Cumulative Layout Shift < 0.1
- ✅ Total bundle size < 300KB gzipped

**Accessibility**:
- ✅ Lighthouse Accessibility > 90
- ✅ WCAG 2.1 Level AA compliant
- ✅ Keyboard navigable
- ✅ Screen reader compatible

**SEO**:
- ✅ Lighthouse SEO > 90
- ✅ Valid structured data (JSON-LD)
- ✅ Proper meta tags
- ✅ Semantic HTML

**Code Quality**:
- ✅ Zero TypeScript errors
- ✅ Zero linting errors
- ✅ All Biome checks pass
- ✅ No console warnings

---

### Business Metrics

**Functionality**:
- ✅ All resume sections complete
- ✅ Print to PDF works perfectly
- ✅ GraphQL API functional
- ✅ Mobile responsive
- ✅ Command menu working

**User Experience**:
- ✅ Loads in < 3 seconds
- ✅ No layout shifts
- ✅ Smooth interactions
- ✅ Professional appearance
- ✅ Print looks identical to screen

**Deployment**:
- ✅ Deployed to production
- ✅ Custom domain active (optional)
- ✅ SSL certificate valid
- ✅ Analytics tracking
- ✅ Zero downtime

---

### Project Metrics

**Timeline**:
- ✅ Completed within 4-6 weeks
- ✅ All phases on schedule
- ✅ No major delays

**Budget**:
- ✅ Infrastructure costs = $0/month (excluding domain)
- ✅ No unexpected costs

**Documentation**:
- ✅ README complete
- ✅ API documentation written
- ✅ Deployment guide created
- ✅ Code comments present

---

## Post-Launch Activities

### Week 1 After Launch

**Monitoring**:
- Check Vercel analytics daily
- Monitor error logs
- Review performance metrics
- Gather initial feedback

**Quick Wins**:
- Fix any critical bugs
- Adjust styling if needed
- Optimize images further
- Update content if necessary

---

### Month 1 After Launch

**Enhancements**:
- Add missing features from "nice to have" list
- Implement user feedback
- A/B test different layouts
- Optimize for search engines

**Potential Additions**:
- Dark mode toggle
- Multiple language support
- Downloadable PDF button
- Theme customization

---

### Ongoing Maintenance

**Monthly**:
- Update dependencies
- Review security advisories
- Check performance metrics
- Update resume content

**Quarterly**:
- Major dependency updates
- Feature enhancements
- Design refreshes
- SEO optimization

---

## Conclusion

This implementation plan provides a comprehensive roadmap for building the Minimalist CV application from scratch. By following this structured approach with clear phases, checkpoints, and risk mitigation strategies, the project can be delivered on time with high quality.

**Key Success Factors**:
1. **Clear scope definition** - Know what's in/out of MVP
2. **Regular testing** - Don't wait until the end
3. **Type safety** - Leverage TypeScript fully
4. **Performance first** - Optimize from day one
5. **Documentation** - Write as you build

**Next Steps**:
1. Review and approve this plan
2. Set up development environment
3. Begin Phase 1: Project Initialization
4. Follow daily tasks as outlined
5. Review progress weekly

---

**Document Version**: 1.0
**Last Updated**: 2025-11-15
**Status**: Ready for Implementation
