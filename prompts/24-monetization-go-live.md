Read AGENTS.md first and follow it strictly.

Take monetization from Expo Go stubs to live, following `NOTES.md`. The policy code in `lib/ads.ts` and `lib/purchases.ts` is already complete (Pro = no ads, rewarded credit only on the verified callback, interstitial frequency cap + 60s gap, fail-open entitlements) and marked with `REAL:` markers. This is paste-keys-and-swap-bodies, not new logic.

- Build a custom dev client / EAS build so the native modules (`react-native-google-mobile-ads`, `react-native-purchases`) load outside Expo Go. Keep the existing lib/hook split intact.
- AdMob: run the `NOTES.md` checklist, swap the `REAL:` bodies in `lib/ads.ts`. Use TEST ad unit IDs in development; real IDs only in the release config. Never ship test IDs; never ship without IDs.
- RevenueCat: paste the public SDK key, swap the `REAL:` bodies in `lib/purchases.ts`, verify purchase AND restore, and confirm fail-open when the store is unreachable (app never blocks).
- Verify on a device: Pro removes all ads; rewarded coins credit only on completion; interstitials respect the cap and only fire between lessons.

Do not expose secrets in the bundle (AdMob unit IDs and the RevenueCat public key are client-side by design; nothing secret ships).
