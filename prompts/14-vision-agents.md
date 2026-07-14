Read AGENTS.md first and follow it strictly.

Integrate **AdMob** (free users only) via `react-native-google-mobile-ads`. This is a native module not bundled in Expo Go.

- Recommend the library and ask for approval before installing (per Decision Making). It is not pre-approved.
- Put all ad logic in `lib/ads.ts` behind a small typed API: `loadInterstitial()`, `showInterstitial()`, `loadRewarded()`, `showRewarded(onReward)`.
- **Stub it for Expo Go development** — no-op `showAd()` implementations and a simulated reward callback — so the whole app runs end to end without a dev client. Only swap in the real native module when building a custom dev client (a pre-launch step).
- **Rewarded ads** grant coins: credit coins only on the verified reward callback, never on ad open. Wire the granted coins through the Zustand progress store.
- **Interstitials** show between lesson completions only — never mid-lesson, never on launch, never back-to-back; respect a sensible frequency cap. Preload; never block UI waiting on an ad.
- Use **test ad unit IDs** in development. Never ship test IDs; never ship without IDs.

This replaces the live-AI teacher service — there is no Python service, Stream, or OpenAI in this app.
