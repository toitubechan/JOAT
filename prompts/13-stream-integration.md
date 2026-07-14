Read AGENTS.md first and follow it strictly.

Implement the **gamification system** end to end: coins, XP/level progression, and daily streak — the loop that makes the feed feel rewarding.

- Centralize all of it in the Zustand progress store (persisted via AsyncStorage). Define clear rules: XP per card/quiz, coins per correct answer, an XP→level curve, and a daily streak that increments once per active day and resets on a missed day (compare against the stored last-active date on launch).
- Build reusable header components: `CoinBalance`, `XPBar`, `StreakBadge` (use `treasure` and `streak-fire` assets via the centralized images import).
- Build the **Progress screen** (the Progress tab): level + XP bar, current streak, total coins, lessons/cards completed, and topic breakdown — read entirely from the store.
- Make rewards feel good with cheap, instant animations: count-ups, a coin/XP pop on award, a streak flame pulse. Keep them performant; jank kills the loop.

No backend — progress is local state plus AsyncStorage only.

No dedicated mockup is provided for the Progress screen — follow the design system (01-design-system.png) and reuse the header components and visual language from the feed (06-feed-card-screen.png).
