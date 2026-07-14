Read AGENTS.md first and follow it strictly.

Build the real Explore screen, replacing the "Coming soon" stub in `explore.tsx`. Explore is one of the four tabs, so it must be a finished surface - no dead controls.

- Drive everything from the typed content index (`data/index.ts`) and parsed content (`lib/content.ts`). No new prose, no hardcoded lessons.
- Help users discover content beyond their selected topics: browse-by-category (all categories, not just the user's), a featured/popular row, and a recently-added row. Each entry opens the lesson reader (`lesson/[id].tsx`).
- Reuse the existing card components and `FeedImage` (its blur placeholder + deterministic fallback) so partially-wired content never shows a blank card during the content ramp.
- Add a live search/filter over category, topic, and lesson titles - reuse the exact filter logic built for category selection (see prompt 22) so the two behave identically.
- Respect locked categories: surface the coin cost badge and route into the unlock flow (prompt 21).

Use the ink+amber tokens in `theme/`; no dedicated mockup, so follow the existing screens. Keep it fast (recycled lists, expo-image caching). Typecheck + lint clean.
