Read AGENTS.md first and follow it strictly.

Integrate the **Pro tier with RevenueCat** (`react-native-purchases`). Native module — not bundled in Expo Go.

- Recommend the library and ask for approval before installing (not pre-approved). Stub it in Expo Go (a hardcoded `isPro` flag + mock purchase/restore) so the app runs end to end; wire the real SDK only when building the dev client.
- Put all purchase logic in `lib/purchases.ts`: a single `isPro` entitlement check, `purchasePro()`, and `restorePurchases()`. Mirror `isPro` into the Zustand store.
- Build a **paywall** screen/modal describing Pro benefits (no ads, unlocked content). Implement purchase **and** restore.
- **Fail open**: if the store is unreachable, never block the app — drop to the free tier.
- Keep only RevenueCat's public SDK key client-side; no secrets in the bundle.

This replaces the agent-to-UI connection step — there is no live AI agent to wire up.

No dedicated mockup is provided for the paywall — follow the design system (01-design-system.png) and the app's existing visual language.
