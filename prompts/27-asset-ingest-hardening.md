Read AGENTS.md first and follow it strictly.

(Do this only when the bundled image library starts to outgrow a sane APK size - not before. It is not a defect today.)

Harden the asset ingest. The metric that matters is per-image weight, not folder total: lesson PNGs are averaging ~900 KB, fine for a handful but heavy once the full library is bundled in the APK.

- Add a compression/resize step to the ingest: resize each lesson image to the card's maximum rendered size and compress (e.g. WebP ~80%, with a sensible per-image ceiling) before it enters `assets/images/lessons/`. Make it a repeatable script, not a manual pass.
- Implement the bundled-to-CDN switch the code already anticipates (AGENTS.md Lesson Visuals Rules): move lesson images to a static CDN and reference them by URL. `expo-image` handles remote URLs and caching with no code change. Keep `constants/images.ts` as the single resolution point (a key may resolve to a bundled asset OR a remote URL).
- Decide and document the flip point in `NOTES.md` (the bundled size at which you move to the CDN).

No rearchitecting - this is an ingest step plus a reference-source change.
