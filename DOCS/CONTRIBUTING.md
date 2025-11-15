# Contributing Guidelines

## Table of Contents

- [Welcome](#welcome)
- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Code Style Guidelines](#code-style-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing Requirements](#testing-requirements)
- [Documentation Requirements](#documentation-requirements)
- [Commit Message Guidelines](#commit-message-guidelines)
- [Issue Guidelines](#issue-guidelines)
- [Feature Requests](#feature-requests)
- [Bug Reports](#bug-reports)
- [Community](#community)

---

## Welcome

Thank you for your interest in contributing to the Minimalist CV project! This document provides guidelines for contributing to the project. Following these guidelines helps maintain code quality and ensures a smooth collaboration process.

### Ways to Contribute

- **Report bugs** - Help us identify and fix issues
- **Suggest features** - Share ideas for improvements
- **Improve documentation** - Fix typos, clarify instructions
- **Submit code** - Fix bugs or add features
- **Review pull requests** - Help review code from other contributors
- **Share feedback** - Let us know how to improve

### Quick Links

- [Project Repository](https://github.com/username/minimalist-cv)
- [Issue Tracker](https://github.com/username/minimalist-cv/issues)
- [Pull Requests](https://github.com/username/minimalist-cv/pulls)
- [Technical Documentation](/home/user/minimalist-cv/DOCS/TECHNICAL-DOCS.md)

---

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inclusive experience for everyone, regardless of:

- Age, body size, disability, ethnicity, gender identity and expression
- Level of experience, nationality, personal appearance, race, religion
- Sexual identity and orientation

### Our Standards

**Positive behaviors**:
- Using welcoming and inclusive language
- Being respectful of differing viewpoints
- Gracefully accepting constructive criticism
- Focusing on what's best for the community
- Showing empathy towards others

**Unacceptable behaviors**:
- Trolling, insulting/derogatory comments, personal or political attacks
- Public or private harassment
- Publishing others' private information without permission
- Other conduct which could reasonably be considered inappropriate

### Enforcement

Violations may result in:
1. Warning
2. Temporary ban
3. Permanent ban

Report violations to: [project maintainer email]

---

## Getting Started

### Prerequisites

Before contributing, ensure you have:

- **Git** - Version control ([Download](https://git-scm.com/))
- **Bun** - Package manager ([Download](https://bun.sh))
- **Node.js** - v18+ ([Download](https://nodejs.org))
- **Code Editor** - VS Code recommended ([Download](https://code.visualstudio.com/))

### Development Environment Setup

**1. Fork the Repository**

Click the "Fork" button on GitHub to create your own copy.

**2. Clone Your Fork**

```bash
git clone https://github.com/YOUR_USERNAME/minimalist-cv.git
cd minimalist-cv
```

**3. Add Upstream Remote**

```bash
git remote add upstream https://github.com/original-owner/minimalist-cv.git
```

**4. Install Dependencies**

```bash
bun install
```

**5. Run Development Server**

```bash
bun dev
```

Visit: http://localhost:3000

**6. Verify Setup**

```bash
# Check TypeScript compilation
bun run build

# Check linting
bun check

# All should pass without errors
```

---

## Development Workflow

### 1. Create a Feature Branch

```bash
# Update main branch
git checkout main
git pull upstream main

# Create feature branch
git checkout -b feature/your-feature-name

# Or for bug fixes:
git checkout -b fix/bug-description
```

**Branch Naming Convention**:
- `feature/` - New features (e.g., `feature/dark-mode`)
- `fix/` - Bug fixes (e.g., `fix/header-alignment`)
- `docs/` - Documentation (e.g., `docs/update-readme`)
- `refactor/` - Code refactoring (e.g., `refactor/data-layer`)
- `test/` - Adding tests (e.g., `test/header-component`)

### 2. Make Your Changes

**Best Practices**:
- Make small, focused commits
- Write clear commit messages
- Test your changes locally
- Follow code style guidelines

### 3. Keep Your Branch Updated

```bash
# Fetch latest changes
git fetch upstream

# Rebase your branch
git rebase upstream/main

# If conflicts occur, resolve them and:
git rebase --continue
```

### 4. Run Quality Checks

```bash
# Lint and format code
bun check:fix

# Build to verify no errors
bun run build

# Test manually
bun dev
```

### 5. Push Your Changes

```bash
git push origin feature/your-feature-name
```

### 6. Create Pull Request

1. Go to your fork on GitHub
2. Click "Pull Request"
3. Select your branch
4. Fill out the PR template
5. Submit for review

---

## Code Style Guidelines

### TypeScript Style

**Use TypeScript for all files**:

```typescript
// ✅ GOOD - Explicit types
interface Props {
  name: string;
  age: number;
}

function Component({ name, age }: Props) {
  // ...
}

// ❌ BAD - No types
function Component(props) {
  // ...
}
```

**Prefer interfaces over types** for object shapes:

```typescript
// ✅ GOOD
interface User {
  name: string;
  email: string;
}

// ❌ BAD (for object shapes)
type User = {
  name: string;
  email: string;
};
```

**Use explicit return types** for functions:

```typescript
// ✅ GOOD
function calculateAge(birthYear: number): number {
  return new Date().getFullYear() - birthYear;
}

// ❌ BAD
function calculateAge(birthYear) {
  return new Date().getFullYear() - birthYear;
}
```

---

### React/Next.js Style

**Use Server Components by default**:

```typescript
// ✅ GOOD - Server Component (default)
export default function Page() {
  return <div>Content</div>;
}

// Only use 'use client' when necessary
'use client';

export function InteractiveButton() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

**Prefer named exports** for components:

```typescript
// ✅ GOOD
export function Header() {
  return <header>...</header>;
}

// ❌ BAD
export default function() {
  return <header>...</header>;
}
```

**Use destructuring** for props:

```typescript
// ✅ GOOD
export function Card({ title, description }: Props) {
  return (
    <div>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

// ❌ BAD
export function Card(props: Props) {
  return (
    <div>
      <h3>{props.title}</h3>
      <p>{props.description}</p>
    </div>
  );
}
```

---

### File Naming Conventions

**Biome enforces kebab-case or PascalCase**:

```bash
# ✅ GOOD
my-component.tsx          # kebab-case for utilities
MyComponent.tsx           # PascalCase for React components
resume-data.tsx           # kebab-case for data files

# ❌ BAD
my_component.tsx          # snake_case not allowed
myComponent.tsx           # camelCase not allowed
```

**Directory structure**:

```
src/
├── app/                  # Next.js App Router
│   ├── page.tsx         # Route pages
│   ├── layout.tsx       # Layouts
│   └── components/      # Page-specific components
├── components/          # Shared components
│   ├── ui/             # UI primitives
│   └── icons/          # Icon components
├── lib/                # Utilities
│   ├── utils.ts
│   └── types.ts
└── data/               # Data files
    └── resume-data.tsx
```

---

### Tailwind CSS Style

**Use utility classes**:

```tsx
// ✅ GOOD
<div className="flex items-center gap-4 p-4">
  <h1 className="text-2xl font-bold">Title</h1>
</div>

// ❌ BAD - Inline styles
<div style={{ display: 'flex', gap: '16px', padding: '16px' }}>
  <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Title</h1>
</div>
```

**Use the `cn()` utility** for conditional classes:

```tsx
import { cn } from "@/lib/utils";

// ✅ GOOD
<div className={cn(
  "base-classes",
  isActive && "active-classes",
  isDisabled && "disabled-classes"
)}>
  Content
</div>

// ❌ BAD
<div className={`base-classes ${isActive ? 'active-classes' : ''} ${isDisabled ? 'disabled-classes' : ''}`}>
  Content
</div>
```

**Group related utilities**:

```tsx
// ✅ GOOD - Grouped by concern
<div className="
  flex items-center gap-4           {/* Layout */}
  p-4 rounded-lg                    {/* Spacing/Shape */}
  bg-white shadow-md                {/* Appearance */}
  hover:shadow-lg transition-shadow {/* Interaction */}
">
  Content
</div>
```

---

### Import Order

**Biome enforces import sorting**:

```typescript
// 1. External libraries
import React from "react";
import { type NextPage } from "next";

// 2. Internal modules (via @/ alias)
import { Header } from "@/app/components/Header";
import { RESUME_DATA } from "@/data/resume-data";

// 3. UI components
import { Button } from "@/components/ui/button";

// 4. Utilities
import { cn } from "@/lib/utils";

// 5. Types
import type { ResumeData } from "@/lib/types";

// 6. Styles (if any)
import "./styles.css";
```

---

### Code Quality Rules

**Biome configuration** (`biome.json`):

```json
{
  "formatter": {
    "lineWidth": 80,
    "indentWidth": 2,
    "indentStyle": "space"
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

**Before committing**:

```bash
# Auto-fix all issues
bun check:fix

# Or separately:
bun lint:fix    # Fix linting issues
bun format:fix  # Fix formatting issues
```

---

## Pull Request Process

### Before Submitting

**Checklist**:

- [ ] Branch is up-to-date with main
- [ ] Code follows style guidelines
- [ ] All files pass linting (`bun check`)
- [ ] Project builds successfully (`bun run build`)
- [ ] Changes tested locally (`bun dev`)
- [ ] Commit messages are clear
- [ ] No console errors or warnings
- [ ] Documentation updated (if needed)

### PR Title Format

Use conventional commit format:

```
<type>(<scope>): <description>

Examples:
feat(ui): add dark mode toggle
fix(graphql): resolve resolver error
docs(readme): update installation steps
refactor(data): simplify type definitions
test(header): add component tests
```

**Types**:
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation changes
- `style` - Code style changes (formatting, etc.)
- `refactor` - Code refactoring
- `test` - Adding or updating tests
- `chore` - Maintenance tasks

### PR Description Template

```markdown
## Description
Brief description of what this PR does.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Changes Made
- List key changes
- Include technical details
- Reference related issues

## Testing
Describe how you tested these changes:
- Manual testing steps
- Browser tested
- Device tested

## Screenshots (if applicable)
Include before/after screenshots for UI changes.

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Build passes (`bun run build`)
- [ ] Linting passes (`bun check`)

## Related Issues
Closes #123
Fixes #456
```

### Review Process

1. **Automated Checks**:
   - CI/CD pipeline runs
   - Linting checks
   - Build verification

2. **Code Review**:
   - At least one approval required
   - Address review comments
   - Push updates to same branch

3. **Approval**:
   - All checks pass
   - Code reviewed
   - Approved by maintainer

4. **Merge**:
   - Squash and merge (default)
   - Delete branch after merge

### After PR is Merged

```bash
# Update your local repository
git checkout main
git pull upstream main

# Delete feature branch
git branch -d feature/your-feature-name
git push origin --delete feature/your-feature-name
```

---

## Testing Requirements

### Manual Testing

**Required for all PRs**:

1. **Visual Testing**:
   ```bash
   bun dev
   # Visit http://localhost:3000
   # Test all affected features
   ```

2. **Responsive Testing**:
   - Test on mobile (375px)
   - Test on tablet (768px)
   - Test on desktop (1024px+)
   - Use Chrome DevTools device toolbar

3. **Browser Testing**:
   - Chrome (latest)
   - Firefox (latest)
   - Safari (if available)

4. **Print Testing**:
   - Press Cmd+P / Ctrl+P
   - Verify layout looks correct
   - Check page breaks

5. **Accessibility Testing**:
   - Keyboard navigation works
   - Screen reader compatible
   - Color contrast sufficient

### Automated Testing (Future)

**When implemented, PRs should include**:

```typescript
// Example unit test
import { render, screen } from '@testing-library/react';
import { Header } from './Header';

describe('Header Component', () => {
  it('renders name correctly', () => {
    render(<Header />);
    expect(screen.getByText('Ban Nguyen')).toBeInTheDocument();
  });
});
```

---

## Documentation Requirements

### Code Documentation

**Add comments for complex logic**:

```typescript
// ✅ GOOD - Complex logic explained
/**
 * Converts React nodes to plain strings for GraphQL API.
 * Handles nested children and arrays recursively.
 */
export function reactToString(content: React.ReactNode): string {
  if (typeof content === "string") return content;
  if (Array.isArray(content)) {
    return content.map(reactToString).join("");
  }
  // ...
}

// ❌ BAD - Obvious code commented
// This function returns a name
function getName() {
  return "John";  // Returns John
}
```

**Use JSDoc for public APIs**:

```typescript
/**
 * Resume data structure containing all CV information.
 *
 * @property name - Full name of the person
 * @property contact - Contact information including email and social links
 * @property work - Array of work experience entries in chronological order
 *
 * @example
 * const resume: ResumeData = {
 *   name: "John Doe",
 *   contact: { email: "john@example.com", ... },
 *   work: [...]
 * };
 */
export interface ResumeData {
  name: string;
  contact: ContactInfo;
  work: WorkExperience[];
}
```

### README Updates

**Update README.md when**:
- Adding new features
- Changing installation steps
- Modifying available commands
- Updating dependencies

### Documentation Files

**Update relevant docs in `/DOCS/` when**:
- Architecture changes → `ARCHITECTURE.md`
- API changes → `API-REFERENCE.md`
- Deployment changes → `DEPLOYMENT-GUIDE.md`
- New best practices → `TECHNICAL-DOCS.md`

---

## Commit Message Guidelines

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type

- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation
- `style` - Formatting, missing semicolons, etc.
- `refactor` - Code restructuring
- `test` - Adding tests
- `chore` - Maintenance

### Scope

Optional, indicates area of change:

- `ui` - UI components
- `graphql` - GraphQL API
- `data` - Data layer
- `build` - Build system
- `deps` - Dependencies

### Subject

- Use imperative mood ("add" not "added")
- Don't capitalize first letter
- No period at the end
- Max 72 characters

### Examples

**Good commit messages**:

```bash
feat(ui): add dark mode toggle to header

fix(graphql): resolve type mismatch in resolver
- Convert React nodes to strings
- Add type transformation tests
- Update documentation

docs(readme): update installation instructions
Clarify dependency requirements and add troubleshooting section

refactor(data): simplify resume data structure
BREAKING CHANGE: ResumeData interface now requires 'initials' field
```

**Bad commit messages**:

```bash
# ❌ Too vague
Update files

# ❌ Not descriptive
Fix bug

# ❌ Past tense
Added new feature

# ❌ Not imperative
Adding dark mode

# ❌ Too long
feat(ui): I added a really cool dark mode feature that allows users to toggle between light and dark themes and also saves their preference to localStorage and updates the UI accordingly with smooth transitions
```

---

## Issue Guidelines

### Before Creating an Issue

1. **Search existing issues** - Avoid duplicates
2. **Check documentation** - May already be answered
3. **Reproduce the issue** - Verify it's a real problem
4. **Collect information** - Browser, OS, steps to reproduce

### Issue Template

**Bug Report**:

```markdown
## Bug Description
Clear description of the bug

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- OS: [e.g., macOS 13.0]
- Browser: [e.g., Chrome 120]
- Node version: [e.g., 18.17.0]
- Bun version: [e.g., 1.0.0]

## Screenshots
If applicable, add screenshots

## Additional Context
Any other relevant information
```

**Feature Request**:

```markdown
## Feature Description
Clear description of the feature

## Use Case
Why is this feature needed? What problem does it solve?

## Proposed Solution
How should this work?

## Alternatives Considered
Other solutions you've thought about

## Additional Context
Mockups, examples, references
```

---

## Feature Requests

### Evaluation Criteria

Features are evaluated based on:

1. **Value** - Does it benefit most users?
2. **Scope** - Fits project goals?
3. **Complexity** - Implementation effort
4. **Maintenance** - Long-term support needed?

### Priority Levels

- **P0 (Critical)** - Core functionality, security
- **P1 (High)** - Important features, major improvements
- **P2 (Medium)** - Nice-to-have features
- **P3 (Low)** - Minor enhancements

### Enhancement Process

1. Submit feature request issue
2. Discussion and feedback
3. Approval by maintainer
4. Implementation (you or maintainer)
5. Review and merge

---

## Bug Reports

### Bug Severity

- **Critical** - App crashes, data loss, security vulnerability
- **High** - Major feature broken, no workaround
- **Medium** - Feature partially broken, workaround exists
- **Low** - Minor issue, cosmetic problem

### Bug Fix Process

1. Report bug with template
2. Triage and prioritize
3. Assignment (you or maintainer)
4. Fix implementation
5. Testing and verification
6. Merge and deploy

---

## Community

### Getting Help

**Questions?**
- Check documentation first
- Search closed issues
- Ask in discussions (if enabled)
- Email maintainer

**Stuck?**
- Describe what you've tried
- Share error messages
- Provide minimal reproduction
- Be patient and respectful

### Recognition

**Contributors are recognized in**:
- README contributors section
- Release notes
- Project documentation

**Ways to stand out**:
- High-quality PRs
- Helpful code reviews
- Documentation improvements
- Community support

---

## Development Tips

### VS Code Setup

**Recommended Extensions**:

```json
{
  "recommendations": [
    "biomejs.biome",                    // Linting & Formatting
    "bradlc.vscode-tailwindcss",       // Tailwind IntelliSense
    "dbaeumer.vscode-eslint",          // ESLint (if used)
    "GraphQL.vscode-graphql",          // GraphQL syntax
    "ms-vscode.vscode-typescript-next" // TypeScript
  ]
}
```

**Settings** (`.vscode/settings.json`):

```json
{
  "editor.defaultFormatter": "biomejs.biome",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "quickfix.biome": "explicit",
    "source.organizeImports.biome": "explicit"
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true
}
```

### Useful Commands

```bash
# Development
bun dev                    # Start dev server
bun run build             # Production build
bun start                 # Start production server

# Code Quality
bun check                 # Check linting + formatting
bun check:fix             # Fix linting + formatting
bun lint                  # Lint only
bun lint:fix              # Fix linting
bun format                # Format only
bun format:fix            # Fix formatting

# Docker
docker compose build      # Build container
docker compose up -d      # Start container
docker compose logs -f    # View logs
docker compose down       # Stop container

# Git
git status                # Check status
git diff                  # View changes
git log --oneline -10     # Recent commits
git rebase -i HEAD~3      # Interactive rebase (last 3 commits)
```

### Debugging Tips

**TypeScript Errors**:
```bash
# Clear cache and rebuild
rm -rf .next node_modules bun.lock
bun install
bun run build
```

**Linting Errors**:
```bash
# Auto-fix most issues
bun check:fix

# Check specific file
bunx biome check src/app/page.tsx
```

**GraphQL Issues**:
```bash
# Test GraphQL in browser
open http://localhost:3000/graphql

# Check decorator metadata
# Ensure 'reflect-metadata' is imported first in route.ts
```

---

## License

By contributing, you agree that your contributions will be licensed under the same license as the project (MIT License).

---

## Questions?

**Need help?**
- Read the [Technical Documentation](/home/user/minimalist-cv/DOCS/TECHNICAL-DOCS.md)
- Check [Deployment Guide](/home/user/minimalist-cv/DOCS/DEPLOYMENT-GUIDE.md)
- Review [Architecture docs](/home/user/minimalist-cv/DOCS/ARCHITECTURE.md)
- Open a discussion or issue

**Thank you for contributing! 🙏**

---

**Document Version**: 1.0
**Last Updated**: 2025-11-15
**Maintained By**: Project Maintainers
