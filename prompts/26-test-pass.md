Read AGENTS.md first and follow it strictly.

Add a focused test pass on the pure logic most likely to break silently as the content library scales. Introduce a test runner first (jest-expo or vitest) - this is a new dependency, so recommend it and ask for approval before installing, per AGENTS.md.

Cover the two highest-value modules:

- `lib/content.ts` parsing: frontmatter extraction, `## Card:` splitting, optional `image:` stripping, and `## Quiz` parsing (correct-answer detection via the checkbox marker, explanation capture from the blockquote). Include the dev-mode validation warnings - unknown image key, and a quiz with zero or multiple correct answers - and malformed-input edge cases (missing frontmatter key, empty card, no quiz).
- `store/progress.ts`: the XP-to-level curve at its boundaries, the streak reconcile in `onRehydrateStorage` (same-day no-op, consecutive-day increment, gapped-day reset), and the negative-amount coin guards.

Keep tests fast, deterministic, and free of device/network dependencies. Typecheck + lint clean.
