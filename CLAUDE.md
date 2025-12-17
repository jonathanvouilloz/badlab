# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

BadLab is a badminton tournament management web application built with SvelteKit 5, Convex backend, and Better Auth for authentication. It allows organizers to create tournaments, manage participants, and run elimination brackets.

## Commands

```bash
# Development
pnpm dev           # Start dev server (Vite)
pnpm run build     # Production build
pnpm run preview   # Preview production build
pnpm check         # Run svelte-check for TypeScript errors
pnpm check:watch   # Run svelte-check in watch mode

# Convex
npx convex dev     # Start Convex dev server (run alongside pnpm dev)
npx convex deploy  # Deploy Convex functions to production
```

## Architecture

### Tech Stack
- **Frontend**: SvelteKit 5 (Svelte 5 runes syntax), TailwindCSS 4, DaisyUI
- **Backend**: Convex (serverless database + functions)
- **Auth**: Better Auth with `@convex-dev/better-auth` integration

### Directory Structure

- `src/convex/` - Convex backend functions and schema (aliased as `$convex`)
  - `schema.ts` - Database schema definition
  - `auth.ts` - Better Auth integration and `getCurrentUser` query
  - `tournaments.ts` - Tournament CRUD operations
  - `bracket.ts` - Bracket generation and match scoring logic
  - `participants.ts`, `matches.ts`, `pools.ts` - Related domain functions
  - `convex.config.ts` - Convex app configuration with Better Auth component
  - `_generated/` - Auto-generated Convex types and API

- `src/lib/`
  - `auth-client.ts` - Better Auth client configuration
  - `components/` - Svelte components organized by domain
    - `ui/` - Reusable UI components (Button, Card, Modal, etc.)
    - `layout/` - Header, Footer
    - `auth/` - Login, Register, UserMenu forms
    - `tournament/` - Tournament-specific components
      - `wizard/` - Multi-step tournament creation wizard
      - `bracket/` - Bracket visualization (uses `@xyflow/svelte` for canvas rendering)

- `src/routes/` - SvelteKit file-based routing
  - `api/auth/[...all]/` - Better Auth API handler
  - `tournament/create/` - Tournament creation wizard
  - `tournament/[id]/` - Tournament detail with bracket view
  - `dashboard/` - Organizer dashboard

### Key Patterns

**Convex Integration**: Uses `convex-svelte` with `setupConvex()` in root layout. Queries use `useQuery(api.module.function)` pattern.

**Authentication Flow**: Better Auth configured in `src/convex/auth.ts`, client in `src/lib/auth-client.ts`. Uses `@mmailaender/convex-better-auth-svelte` for Svelte integration.

**Tournament Workflow**:
1. Create tournament via wizard (draft status)
2. Add participants manually
3. Start tournament (`bracket.startTournament`) generates elimination bracket
4. Enter match scores (`bracket.saveMatchResult`) auto-propagates winners
5. Finalize tournament (`bracket.finalizeTournament`)

**Bracket Logic** (`src/convex/bracket.ts`):
- Standard seeding algorithm placing complementary seeds in opposite halves
- BYE handling for non-power-of-2 participant counts
- Winner propagation to next round on score save

### Path Aliases
- `$lib` -> `src/lib`
- `$convex` -> `src/convex`

### Environment Variables
- `PUBLIC_CONVEX_URL` - Convex deployment URL (public)
- `SITE_URL` - Application URL for Better Auth (used in Convex functions)
- `CONVEX_SITE_URL` - Convex HTTP actions URL
