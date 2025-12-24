'use client';

import posthog from 'posthog-js';

interface PostHogIdentifierProps {
  userId: string;
  email: string | null;
  preferredName: string | null;
  firstName: string | null;
  isAdmin: boolean;
}

export function PostHogIdentifier({
  userId,
  email,
  preferredName,
  firstName,
  isAdmin,
}: PostHogIdentifierProps) {
  // Identify user on mount - we use a ref to track if we've already identified
  // to prevent duplicate calls
  if (typeof window !== 'undefined' && userId) {
    const currentDistinctId = posthog.get_distinct_id();
    // Only identify if we haven't already identified this user in this session
    if (currentDistinctId !== userId) {
      posthog.identify(userId, {
        email: email,
        name: preferredName || firstName,
        is_admin: isAdmin,
      });
    }
  }

  return null;
}
