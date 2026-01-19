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
- `bun run format` - Format code with Prettier
- `bun run format:check` - Check code formatting without making changes

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

2. **OAuth Flow**:
   - Entry point: `/auth` page triggers `supabase.auth.signInWithOAuth()` with Google provider
   - Callback handler: `src/app/auth/callback/route.ts` exchanges OAuth code for session
   - Handles both local (`localhost:3000`) and production redirects
   - Auto-creates profile via database trigger on first signup

3. **Protected Routes**:
   - Use `<ProtectedPage>` component (src/components/ProtectedPage.tsx) to wrap protected content
   - Server-side auth check redirects to `/auth` if no session exists
   - Pattern: Wrap children in dashboard pages with this component

4. **Admin Authorization**:
   - PostgreSQL function `is_admin()` checks if `profiles.role = 'admin'`
   - RLS policies reference this function for admin-only operations
   - Only admins can update user roles via RLS policy

### Database Schema

Six core tables with relationships:

- **profiles** - User data synced from Supabase Auth (`auth.users`)
  - Auto-created on signup via `handle_new_user()` trigger
  - Fields: `first_name`, `last_name`, `email`, `preferred_name`, `instrument`, `major`, `graduation_year`, `role` (enum: 'admin' | 'user'), `is_onboarded`
  - RLS enabled with user/admin policies
  - Extended fields for onboarding: `preferred_name`, `major`, `graduation_year`, `is_onboarded`

- **events** - Organization events with location, timing, and images
  - Fields: `title`, `description`, `location`, `start_time`, `end_time`, `image_url`, `created_at`, `updated_at`
  - Ordered by `start_time` in queries
  - Public read access, admin-only write

- **rsvps** - Event RSVP tracking with user status
  - Fields: `id`, `user_id` (FK to auth.users and profiles), `event_id` (FK to events), `status` (enum: 'going' | 'maybe' | 'not_going'), `created_at`
  - Unique constraint on (`user_id`, `event_id`) - one RSVP per user per event
  - RLS: Users can manage their own RSVPs, anyone can view RSVP counts, admins can view all details
  - Default status: 'going'

- **resources** - Links and tools for members
  - Fields: `name`, `link`, `description`, `is_pinned`, `created_at`
  - Pinned resources appear first in listings (home page shows only pinned)
  - Public read access, admin-only write

- **tags** - Resource categorization
  - Fields: `name` (UNIQUE), `slug` (UNIQUE), `display_order`, `created_at`
  - Used for filtering resources on resources page

- **resource_tags** - Many-to-many junction table
  - Links resources to tags
  - Primary key: (`resource_id`, `tag_id`)

### Data Fetching Pattern

All queries in `src/lib/queries.ts` are Server Actions (marked `'use server'`):

**User Queries:**
- `getFirstName()` - Get authenticated user's first name
- `getUserProfile()` - Get full user profile data
- `getIsAdmin()` - Check if current user is admin

**Event Queries:**
- `getEvents()` - All events ordered by start_time
- `getUpcomingEvents()` - Future events only (start_time > now)
- `getUpcomingEventsWithRsvp()` - Upcoming events with user's RSVP status and "going" count for each event
- `getEventRsvps(eventId)` - All RSVPs for an event with joined profile data (user details)

**Resource Queries:**
- `getResources()` - All resources (pinned first, then alphabetical by name)
- `getPinnedResources()` - Only resources where `is_pinned = true`
- `getPinnedResourcesWithTags()` - Pinned resources with nested tag data (used on home page)
- `getResourcesWithTags()` - All resources with nested tags via join query
- `getTags()` - All tags ordered by display_order

**RSVP Queries:**
- `getUserRsvpEvents()` - Get user's RSVP'd events (filtered to future events where end_time >= now)

All queries respect Row-Level Security policies. Queries are called directly from Server Components (no API routes needed).

### RSVP System

The app includes a comprehensive RSVP system for event attendance tracking:

**Server Actions** (`src/app/actions/rsvp.ts`):
- `rsvpToEvent(eventId, status)` - Create or update user's RSVP with status ('going' | 'maybe' | 'not_going')
- `removeRsvp(eventId)` - Delete user's RSVP from an event
- `getUserRsvp(eventId)` - Get user's current RSVP status for an event

**Admin Actions** (`src/app/(dashboard)/admin/events/actions.ts`):
- `getEventRsvpsAction(eventId)` - Admin-only action to fetch all RSVPs with profile data for an event

**UI Components**:
- `RsvpButton.tsx` - Client component for RSVP/cancel toggle button with optimistic UI updates
  - Integrates PostHog analytics (tracks `event_rsvp_added` and `event_rsvp_removed`)
  - Shows current RSVP status and allows toggling
- `RsvpListDialog.tsx` - Admin dialog showing all RSVPs grouped by status with user profiles

**Key Features**:
- Unique constraint ensures one RSVP per user per event (handled via upsert in `rsvpToEvent`)
- Home page shows "Your RSVPs" section with user's upcoming RSVP'd events
- Event cards display "going" count and user's RSVP status
- Past events are automatically filtered from user's RSVP list (using `end_time >= now`)
- Admin view allows viewing all RSVPs with timestamps and user details

### Route Groups & Layouts

The app uses Next.js route groups for different layout contexts:

- `src/app/(auth)/` - Authentication pages (centered layout, no sidebar)
  - `/auth` - Google OAuth login page

- `src/app/(dashboard)/` - Main dashboard pages (sidebar layout)
  - Uses `<SidebarProvider>` and `<AppSidebar>` components
  - Fixed header with `<DynamicBreadcrumb>` for navigation context
  - All dashboard pages share this layout with navigation sidebar

  **Dashboard Routes:**
  - `/` - Home page (3-section layout: Upcoming Events, Pinned Resources, Your RSVPs)
  - `/events` - All upcoming events listing
  - `/resources` - Resources with tag filtering
  - `/settings` - User profile settings (update name, instrument, major, graduation year)
  - `/admin/events` - Admin event management (CRUD operations)
  - `/admin/resources` - Admin resource and tag management (CRUD operations)
  - `/admin/users` - Admin user management (view users, change roles)

- `src/app/onboarding/` - Onboarding flow for new users
  - Separate route for first-time user profile completion
  - Sets `is_onboarded = true` after completion

### Home Page Structure

The home page (`src/app/(dashboard)/page.tsx`) displays three main sections:

1. **Upcoming Events** - Shows next 3 upcoming events from `getUpcomingEventsWithRsvp()`
   - Each event card displays RSVP button and "going" count
   - Click to view full event details in dialog
   - Empty state if no upcoming events

2. **Resources** - Shows pinned resources from `getPinnedResourcesWithTags()`
   - Grid layout with resource cards (name, link, tags)
   - Empty state if no pinned resources

3. **Your RSVPs** - Shows user's RSVP'd events from `getUserRsvpEvents()`
   - Only displays events where `end_time >= now` (hides past events)
   - Shows events with "going" or "maybe" status
   - Empty state if no RSVPs

### Server Components by Default

- Pages are async server components that fetch data directly
- Use Client Components (`"use client"`) only for interactivity:
  - Auth page (OAuth flow)
  - RSVP system (RsvpButton, RsvpListDialog)
  - Resources filtering (tag selection)
  - Theme toggling
  - Breadcrumb navigation (pathname tracking)
  - Form dialogs (event, resource, user management)
  - PostHog identification (PostHogIdentify component)

### UI Components

- Built with shadcn/ui components in `src/components/ui/` (based on Base UI primitives)
- Uses Tailwind CSS v4 with custom theme system
- Theme provider supports dark mode via `next-themes`
- Styling uses OKLCH color space for perceptually uniform colors
- Custom utility function `cn()` in `src/lib/utils.ts` for className merging
- Icons from Hugeicons (`@hugeicons/react`)

### Fonts

Three custom fonts configured in root layout:

- Figtree (sans-serif, primary font)
- Geist Mono (monospace)
- Calistoga (serif, display font)

Access via CSS variables: `--font-sans`, `--font-geist-mono`, `--font-calistoga`

### Analytics & Error Tracking

**PostHog Integration:**
- Event tracking for user interactions
- Reverse proxy configuration on `/dih/` routes (configured in `next.config.ts`)
- User identification via `PostHogIdentify` component (loads on authenticated pages)
- Key tracked events:
  - `event_rsvp_added` - When user RSVPs to event
  - `event_rsvp_removed` - When user cancels RSVP
  - `event_details_viewed` - When event detail dialog opens

**Sentry Integration:**
- Error reporting and performance monitoring
- Configured in `next.config.ts` with source maps
- Vercel Cron monitoring enabled
- Auto-instruments client and server errors

### File Upload System

**UploadThing Integration:**
- Handles image uploads for events and resources
- Router configuration: `src/app/api/uploadthing/core.ts`
- Supports multiple image hosts (configured in `next.config.ts`):
  - `5wetyecq6s.ufs.sh` - UploadThing CDN
  - `utfs.io` - UploadThing storage
  - `images.unsplash.com` - Unsplash images
  - `placehold.co` - Placeholder images
- NextSSRPlugin included in root layout for server-side upload handling

### Environment Variables

Required environment variables (see `.env.example`):

**Supabase (Required):**
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL (local: http://127.0.0.1:54321)
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` - Supabase anonymous key
- `SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_SECRET` - Google OAuth secret (for auth)

**Analytics & Monitoring (Optional):**
- `NEXT_PUBLIC_POSTHOG_KEY` - PostHog project API key
- `NEXT_PUBLIC_POSTHOG_HOST` - PostHog host URL
- `SENTRY_AUTH_TOKEN` - Sentry authentication token for source map uploads

**File Upload (Optional):**
- `UPLOADTHING_TOKEN` - UploadThing API token for file uploads

Local development uses Supabase local instance on port 54321. The Studio UI is available at http://127.0.0.1:54323.

### Path Aliases

TypeScript configured with `@/*` alias mapping to `src/*` - use this for all imports.

### Database Migrations

Migrations are timestamped SQL files in `supabase/migrations/`:

- Use `bun run db:migrate` to create a new migration
- Use `bun run db:diff -f <migration_name>` to auto-generate from schema changes
- Migrations run automatically on `db:reset`
- Seeding data in `supabase/seed.sql` runs after migrations

Key migration patterns:

- RLS policies defined in dedicated migration files
- Triggers for auto-profile creation on signup (`handle_new_user()`)
- Admin role enforcement via PostgreSQL functions (`is_admin()`)

Recent migrations:

- `20251223190000_create_rsvps_table.sql` - RSVP system with status enum and RLS policies
- `20251224000000_add_rsvps_profiles_fkey.sql` - Foreign key from rsvps to profiles
- Profile extensions: Added `preferred_name`, `major`, `graduation_year`, `is_onboarded` fields
- Resource pinning: Added `is_pinned` column to resources table

## Recent Updates (December 2024 - January 2025)

This section documents major features added since initial project setup:

**RSVP System:**
- Complete event RSVP functionality with status tracking ('going', 'maybe', 'not_going')
- New `rsvps` database table with RLS policies
- Server actions for RSVP management (`src/app/actions/rsvp.ts`)
- UI components: `RsvpButton` and `RsvpListDialog`
- Admin view for managing event RSVPs
- Integration with home page to show user's upcoming RSVP'd events
- Automatic filtering of past events from RSVP lists

**Profile Enhancements:**
- Added onboarding flow (`/onboarding` route)
- Extended profile fields: `preferred_name`, `major`, `graduation_year`, `is_onboarded`
- Profile settings page for users to update their information

**Resource Pinning:**
- `is_pinned` field on resources table
- Home page displays only pinned resources
- Dedicated queries for pinned resources with tags

**Analytics & Monitoring:**
- PostHog integration for event tracking (RSVPs, event views)
- Sentry integration for error reporting
- User identification on authenticated pages

**File Upload:**
- UploadThing integration for image uploads
- Support for event and resource images
- Multiple CDN configurations in Next.js config

**UI/UX Improvements:**
- Home page redesign with three-section layout
- Event detail dialogs with RSVP functionality
- Admin management interfaces for events, resources, and users
- Empty states for all major sections

## Important Notes

- **Keep CLAUDE.md up to date**: When making significant architectural changes or adding new patterns, update this file to reflect the current state of the codebase.
- **Last updated**: January 2025
