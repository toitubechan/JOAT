/**
 * Analytics identify wiring.
 *
 * Watches Clerk auth + the persisted stores and (re)identifies the user in
 * PostHog: once the session is restored it calls `identify` with the Clerk user
 * id as distinctId, then re-runs whenever `selected_topics` or `is_pro` change
 * so those person properties stay current. `signup_date` is set once on the
 * first identify (handled via `$set_once` in `identifyUser`).
 */
import { useEffect } from "react";
import { useAuth } from "@clerk/expo";

import { identifyUser } from "@/lib/analytics";
import { usePreferencesStore, useProgressStore } from "@/store";

export function useIdentifyUser(): void {
  const { isSignedIn, userId } = useAuth();
  const selectedTopics = usePreferencesStore((s) => s.selectedTopics);
  const hasHydrated = usePreferencesStore((s) => s.hasHydrated);
  const isPro = useProgressStore((s) => s.isPro);

  useEffect(() => {
    // Wait for a signed-in user and for the persisted selection to load, so the
    // first identify carries the real topics (not a transient empty list).
    if (!isSignedIn || !userId || !hasHydrated) return;
    identifyUser(userId, { selectedTopics, isPro });
  }, [isSignedIn, userId, hasHydrated, selectedTopics, isPro]);
}
