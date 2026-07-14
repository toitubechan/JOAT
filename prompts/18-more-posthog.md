Read AGENTS.md first and follow it strictly.

Add PostHog event tracking to the existing app using the PostHog instance already initialized in `lib/posthog.ts`. Do not reinitialize PostHog and do not change the existing PostHogProvider setup.

User identification:

- After Clerk authentication completes (sign-in or sign-up), call `posthog.identify()` with the Clerk user's id as distinctId.
- On the first identify after sign-up, set user properties: `signup_date` (current ISO date, via `$set_once`) and `selected_topics` (the topics chosen on the topic selection screen, or empty if not yet selected).
- On every subsequent identify, update `selected_topics` and `is_pro` if they have changed.

Custom events, captured at these moments:

1. `topic_selected` — fires when the user confirms topics on the topic selection screen.
   Properties: `{ topic_ids: string[], topic_count: number }`

2. `lesson_started` — fires when the lesson screen mounts and the user begins a lesson.
   Properties: `{ lesson_id: string, topic_id: string, card_count: number }`

3. `quiz_answered` — fires on each quiz selection.
   Properties: `{ lesson_id: string, quiz_id: string, correct: boolean }`

4. `lesson_completed` — fires when the user reaches the final card.
   Properties: `{ lesson_id: string, topic_id: string, duration_seconds: number, xp_earned: number, coins_earned: number }`

5. `lesson_abandoned` — fires when the user exits a lesson before `lesson_completed` (back navigation, screen unmount before completion).
   Properties: `{ lesson_id: string, time_into_lesson_seconds: number, last_card_index: number }`

6. `ad_watched` — fires on a verified rewarded-ad reward.
   Properties: `{ placement: string, coins_granted: number }`

7. `pro_purchased` — fires after a successful RevenueCat purchase.
   Properties: `{ product_id: string, price?: number }`

Implementation rules:

- Track lesson start time with a ref captured on mount so `duration_seconds` / `time_into_lesson_seconds` are accurate.
- Do not modify any UI.
- Do not expose any keys; PostHog is already configured via environment variables.
