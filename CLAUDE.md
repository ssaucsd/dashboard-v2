# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SSAUCSD Dashboard V2 - A Next.js dashboard application for managing SSA UCSD member data with Supabase authentication and database integration.

## Development Commands

### Running the Application
- `bun dev` - Start Next.js development server
- `bun run build` - Build production bundle
- `bun start` - Start production server
- `bun run lint` - Run ESLint

### Database (Supabase Local Development)
- `bun run db:start` - Start local Supabase instance (runs on port 54321)
- `bun run db:stop` - Stop local Supabase instance
- `bun run db:reset` - Reset database to initial state (runs migrations and seeds)
- `bun run db:migrate` - Create a new migration file
- `bun run db:diff -f <migration_name>` - Generate migration from schema changes
- `bun run db:push` - Push local migrations to remote database

## Architecture

### Authentication & Route Protection

The app uses Supabase Auth with Google OAuth integration. Authentication follows this pattern:

1. **Supabase Client Creation**:
   - `src/lib/supabase/client.ts` - Browser client (client components)
   - `src/lib/supabase/server.ts` - Server client (server components/actions)
   - Both use `@supabase/ssr` for proper Next.js integration

2. **Protected Routes**:
   - Use `<ProtectedPage>` component (src/components/ProtectedPage.tsx) to wrap protected content
   - Server-side auth check redirects to `/login` if no session exists
   - Pattern: Wrap children in dashboard pages with this component

### Route Groups & Layouts

The app uses Next.js route groups for different layout contexts:

- `src/app/(auth)/` - Authentication pages (centered layout, no sidebar)
  - `/login` - Google OAuth login page

- `src/app/(dashboard)/` - Main dashboard pages (sidebar layout)
  - Uses `<SidebarProvider>` and `<AppSidebar>` components
  - All dashboard pages share this layout with navigation sidebar

### UI Components

- Built with shadcn/ui components in `src/components/ui/`
- Uses Tailwind CSS v4 with custom theme system
- Theme provider supports dark mode via `next-themes`
- Styling uses OKLCH color space for better color consistency
- Custom utility function `cn()` in `src/lib/utils.ts` for className merging

### Fonts

Three custom fonts configured in root layout:
- Figtree (sans-serif, primary font)
- Geist Mono (monospace)
- Calistoga (serif, display font)

Access via CSS variables: `--font-sans`, `--font-geist-mono`, `--font-calistoga`

### Environment Variables

Required environment variables (see `.env.example`):
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL (local: http://127.0.0.1:54321)
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` - Supabase anonymous key
- `SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_SECRET` - Google OAuth secret (for auth)

Local development uses Supabase local instance. The `.env.example` file contains the local URL.

### Path Aliases

TypeScript configured with `@/*` alias mapping to `src/*` - use this for all imports.

## Project Status

Currently in early development. From README TODO list:
- Basic UI with mock data: ✓ Complete
- Supabase setup: ✓ Complete
- Auth implementation: In Progress
- Remaining: Error tracking, data fetching, CRUD operations, RSVP functionality
