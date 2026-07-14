Read AGENTS.md first and follow it strictly.

Wire the monetization rules into the UI so free and Pro experiences differ correctly. Touch only the integration points — do not redesign screens.

- **Pro removes ads**: gate every ad call behind the single `isPro` check from `lib/purchases.ts`. Pro users never see interstitials or rewarded prompts.
- **Earn coins**: add a clear "watch to earn coins" entry point (e.g. when coins are low or to unlock a coin-gated item) that calls the rewarded-ad flow and credits coins on the verified reward callback.
- **Spend coins**: implement coin-gated content unlocks — unlocking a premium subtopic costs a fixed coin amount; deduct via the Zustand store and persist. Pro unlocks everything without spending.
- **Interstitial cadence**: trigger only on lesson completion for free users, respecting the frequency cap from `lib/ads.ts`.
- Surface state honestly: locked vs unlocked items, current coin balance, and an upsell to Pro at natural friction points (not intrusive).

Keep the existing UI and progress store intact; this is wiring, not new design. This replaces the AI-teacher prompt tuning step — there is no AI teacher.
