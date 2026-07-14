/**
 * Typed analytics layer — the single place event names and their property
 * shapes are defined. Screens/hooks call these helpers instead of touching the
 * raw PostHog client, so event schemas stay consistent and discoverable.
 *
 * Every call is safe: when no PostHog key is configured the shared client is
 * `disabled` (see `lib/posthog.ts`), so these become silent no-ops.
 */
import { posthog } from "@/lib/posthog";

/**
 * Identify the signed-in user and keep their person properties current.
 *
 * `signup_date` is written via `$set_once` so it only ever takes the value from
 * the first identify (i.e. the user's first session); later identifies can't
 * overwrite it. `selected_topics` and `is_pro` go through `$set` so they update
 * to the latest value every time this runs.
 */
export function identifyUser(
  distinctId: string,
  props: { selectedTopics: string[]; isPro: boolean }
): void {
  posthog.identify(distinctId, {
    $set: {
      selected_topics: props.selectedTopics,
      is_pro: props.isPro,
    },
    $set_once: {
      signup_date: new Date().toISOString(),
    },
  });
}

/** Fired when the user confirms their topic picks on the selection screen. */
export function trackTopicSelected(props: {
  topic_ids: string[];
  topic_count: number;
}): void {
  posthog.capture("topic_selected", props);
}

/** Fired when a lesson screen mounts and the user begins a lesson. */
export function trackLessonStarted(props: {
  lesson_id: string;
  topic_id: string;
  card_count: number;
}): void {
  posthog.capture("lesson_started", props);
}

/** Fired on each quiz answer selection. */
export function trackQuizAnswered(props: {
  lesson_id: string;
  quiz_id: string;
  correct: boolean;
}): void {
  posthog.capture("quiz_answered", props);
}

/** Fired when the user finishes a lesson (rewards totals are known here). */
export function trackLessonCompleted(props: {
  lesson_id: string;
  topic_id: string;
  duration_seconds: number;
  xp_earned: number;
  coins_earned: number;
}): void {
  posthog.capture("lesson_completed", props);
}

/** Fired when the user leaves a lesson before completing it. */
export function trackLessonAbandoned(props: {
  lesson_id: string;
  time_into_lesson_seconds: number;
  last_card_index: number;
}): void {
  posthog.capture("lesson_abandoned", props);
}

/** Fired on a verified rewarded-ad reward. */
export function trackAdWatched(props: {
  placement: string;
  coins_granted: number;
}): void {
  posthog.capture("ad_watched", props);
}

/** Fired after a successful RevenueCat purchase. */
export function trackProPurchased(props: {
  product_id: string;
  price?: number;
}): void {
  posthog.capture("pro_purchased", props);
}
