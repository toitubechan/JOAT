Read AGENTS.md first and follow it strictly.

Optimize the feed for a **fast, fluid scroll** — jank kills the loop. This is a polish pass; do not change visual design or content.

- **List recycling**: render the feed with a recycled list (FlashList, bundled in Expo Go) instead of a plain map/ScrollView. Provide stable keys, `estimatedItemSize`, and keep card renders cheap (memoize, avoid inline allocations).
- **Images**: ensure every lesson visual uses `expo-image` with caching enabled and a `placeholder`/blurhash so the scroll never shows blank cards; size assets appropriately.
- **Transitions**: snappy card-to-card and screen transitions; reuse the cheap animations from the gamification pass rather than adding heavy libraries.
- **Measure**: check for dropped frames while scrolling a long feed and during quiz feedback; fix the worst offenders (re-renders, oversized images, synchronous work on the JS thread).

No new major libraries beyond FlashList without approval. This replaces the live-captions step — there is no live audio to caption.
