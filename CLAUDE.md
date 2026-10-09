# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Minimalist CV/Resume web application** built with Next.js 14, React, TypeScript, and Tailwind CSS. The app renders a clean, print-friendly CV layout with data configured in a single file.

## Commands

### Development
```bash
bun dev          # Start development server on http://localhost:3000
bun build        # Create production build
bun start        # Start production server
bun lint         # Run Biome linting checks
bun lint:fix     # Run Biome linting with auto-fix
bun format       # Check code formatting with Biome
bun format:fix   # Format code with Biome
bun check        # Run both linting and formatting checks
bun check:fix    # Run both linting and formatting with auto-fix
```

### Docker Deployment
```bash
docker compose build     # Build the container
docker compose up -d     # Run the container
docker compose down      # Stop the container
```

**Note**: The project uses **Biome.js** for linting and formatting instead of ESLint and Prettier. Always run `bun check:fix` before committing to ensure code quality.

## Architecture

### Project Structure
- **`/src/app/`** - Next.js App Router pages and layouts
- **`/src/components/`** - Reusable UI components (using shadcn/ui)
- **`/src/data/resume-data.tsx`** - Single configuration file for all CV content
- **`/src/apollo/`** - GraphQL server setup with resolvers and type definitions
- **`/src/images/logos/`** - Company logo components

### Key Technologies
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript with decorators enabled
- **Styling**: Tailwind CSS with custom theme extensions
- **UI Components**: shadcn/ui (Radix UI based)
- **GraphQL**: Apollo Server with type-graphql at `/graphql` endpoint
- **Command Palette**: cmdk library for keyboard navigation
- **Print Optimization**: Custom print styles in global CSS

### Important Files
- **`src/data/resume-data.tsx`** - Main configuration file containing all CV data (personal info, work experience, education, skills, projects)
- **`src/app/page.tsx`** - Main resume page component that renders the CV
- **`src/app/layout.tsx`** - Root layout with metadata and analytics
- **`src/components/command-menu.tsx`** - Keyboard shortcuts (Cmd+K) for navigation
- **`src/components/print-drawer.tsx`** - Print functionality component

## Development Notes

### Adding New Sections
To add new sections to the CV, modify the `RESUME_DATA` object in `src/data/resume-data.tsx`. The layout automatically adjusts based on the data provided.

### GraphQL API
The app exposes a GraphQL endpoint at `/graphql` that serves the resume data. This can be used to integrate the CV data with other applications.

### Print Optimization
The app includes special print styles to ensure the CV looks good when printed. Test print functionality when making layout changes.

### Deployment
The app is optimized for Vercel deployment but can be deployed anywhere that supports Next.js applications. Docker support is included for containerized deployments.
## Multi-machine rules

This repo is developed on more than one machine — macOS, Arch Linux, and in some cases a
Linode VPS — and more than one of them still commits. Before changing anything here, read
`POLICY.md` in the `memex-vault` repo, which sits under the same `Workspace/Projects/`
tree as this repo. Derive that path, never hardcode it: `/Users/…` is only correct on the
Mac and `/home/…` only on Arch, and the VPS has neither.

The three rules that bite most often:

- **Rule 10** — one directory per OS (`macos/`, `linux-arch/`). Compiled sources use the
  language's own per-OS mechanism instead (Go: `*_darwin.go` / `*_linux.go`).
- **Rule 5** — a commit's `user.name` says which *machine*, the `Co-Authored-By` trailer
  says which *AI*, and the SSH signature is anti-forgery. Three independent slots; a
  commit with no trailer was typed by hand.
- **Rule 9** — whichever machine owns a part is the machine that changes it. No exception
  for a two-minute fix.

### Commit log

Every pushed commit gets one line, written automatically by a local `pre-push` hook into
`DIARY/` — git-ignored, machine-local, one file per machine. **Do not hand-edit it and do
not commit it.** The cross-machine rollup lives in the vault; rule 11 has the shape.

Git does not carry hooks across clones, so a fresh clone starts with none. Check with
`memex-vault/tools/diary/install-hook.sh --check` rather than assuming.
