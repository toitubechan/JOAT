Read AGENTS.md first and follow it strictly.

Set up centralized app state with Zustand, persisted with the modern `@react-native-async-storage/async-storage` package. Keep one clear, documented progress store so "centralized" means a single source of truth.

Two concerns:

1. **Selected topics** — the interests chosen on the topic selection screen. If an authenticated user has selected no topics, route them to the topic selection screen. Only after confirming at least one topic should they reach the home route (/).
2. **Progress store** — `coins`, `level`/`xp`, `dailyStreak` (with last-active date), completed lessons & cards, current card/quiz state, and `isPro`. Expose typed actions (`addCoins`, `addXp`, `markCardComplete`, `completeLesson`, `bumpStreak`, etc.). Persist everything via AsyncStorage; rehydrate on launch.

Preserve the existing UI exactly. Add a temporary "reset progress / clear storage" button on a screen for testing the selection + progress flow.
