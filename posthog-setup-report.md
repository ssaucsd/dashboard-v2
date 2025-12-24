# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your SSA Member Dashboard Next.js application. The integration includes:

- **Client-side initialization** via `instrumentation-client.ts` (Next.js 15.3+ approach) with automatic pageview capture, session replay, and error tracking enabled
- **Server-side tracking** via `posthog-node` for secure backend event capture with user identification
- **Reverse proxy configuration** in `next.config.ts` to route PostHog requests through `/ingest` to avoid ad blockers
- **User identification** on login and onboarding to correlate anonymous and authenticated sessions
- **Error tracking** with `captureException` calls on form submission failures and RSVP errors

## Events Tracked

| Event Name | Description | File Path |
|------------|-------------|-----------|
| `login_started` | User initiates login with Google OAuth | `src/app/(auth)/auth/page.tsx` |
| `login_completed` | User successfully completes OAuth authentication | `src/app/auth/callback/route.ts` |
| `login_failed` | OAuth authentication fails during callback | `src/app/auth/callback/route.ts` |
| `onboarding_completed` | User completes onboarding form with profile information | `src/app/onboarding/actions.ts` |
| `profile_updated` | User updates their profile settings | `src/app/(dashboard)/settings/actions.ts` |
| `event_rsvp_added` | User RSVPs to an event | `src/components/RsvpButton.tsx` |
| `event_rsvp_removed` | User removes their RSVP from an event | `src/components/RsvpButton.tsx` |
| `event_details_viewed` | User opens event detail dialog | `src/components/EventDetailDialog.tsx` |
| `resource_clicked` | User clicks on a resource link | `src/components/ResourceGrid.tsx` |
| `resource_filtered` | User filters resources by tag category | `src/app/(dashboard)/resources/resources-client.tsx` |
| `admin_event_created` | Admin creates a new event | `src/components/EventFormDialog.tsx` |
| `admin_event_updated` | Admin updates an existing event | `src/components/EventFormDialog.tsx` |
| `admin_resource_created` | Admin creates a new resource | `src/components/ResourceFormDialog.tsx` |
| `admin_resource_updated` | Admin updates an existing resource | `src/components/ResourceFormDialog.tsx` |

## Files Created/Modified

### New Files
- `instrumentation-client.ts` - Client-side PostHog initialization

### Modified Files
- `next.config.ts` - Added reverse proxy rewrites for PostHog
- `src/app/(auth)/auth/page.tsx` - Added login_started tracking
- `src/app/auth/callback/route.ts` - Added login_completed, login_failed tracking and user identification
- `src/app/onboarding/actions.ts` - Added onboarding_completed tracking and user identification
- `src/app/(dashboard)/settings/actions.ts` - Added profile_updated tracking
- `src/components/RsvpButton.tsx` - Added event_rsvp_added, event_rsvp_removed tracking with error capture
- `src/components/EventDetailDialog.tsx` - Added event_details_viewed tracking
- `src/components/ResourceGrid.tsx` - Added resource_clicked tracking
- `src/app/(dashboard)/resources/resources-client.tsx` - Added resource_filtered tracking
- `src/components/EventFormDialog.tsx` - Added admin_event_created, admin_event_updated tracking with error capture
- `src/components/ResourceFormDialog.tsx` - Added admin_resource_created, admin_resource_updated tracking with error capture

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

### Dashboard
- [Analytics basics](https://us.posthog.com/project/261966/dashboard/939228) - Core analytics dashboard tracking user engagement, conversions, and key business metrics

### Insights
- [User Signup Funnel](https://us.posthog.com/project/261966/insights/EQwLw8J7) - Tracks user journey from login started to onboarding completed
- [Event Engagement](https://us.posthog.com/project/261966/insights/hgGu7hCN) - Tracks user engagement with events - views, RSVPs added and removed
- [Resource Engagement](https://us.posthog.com/project/261966/insights/5azWcbrQ) - Tracks user interaction with resources - clicks and filtering
- [Admin Activity](https://us.posthog.com/project/261966/insights/jibow6XW) - Tracks admin content management - events and resources created/updated
- [Profile Updates](https://us.posthog.com/project/261966/insights/x3pzCuzk) - Tracks user profile management - updates after initial onboarding

## Environment Variables

The following environment variables are configured in `.env`:

```
NEXT_PUBLIC_POSTHOG_KEY=phc_HWyBybZGmiowT7Fr6fyC7aygV4d1GH1PfvjWNtcFZnr
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

Make sure to add these to your production environment as well.
