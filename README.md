# Jack of All Trades (JOAT)

**Brain rot, but brain food.** A visual-first, card-based micro-learning app for
**Android** that teaches practical life skills — Money & Finance, Mindfulness,
Home Repairs, Cooking, and more — in the same fast, swipeable loop that makes
social feeds addictive, pointed at basic competence instead of waste.

Each card is consumed in seconds: a strong visual, a punchy idea, minimal text,
with quizzes, a coin economy, XP/levels, and a daily streak to keep the loop
rewarding. **There is no live AI in the app** — all lesson text and images are
generated before launch and shipped as static markdown + assets.

> This is also a teaching project: the code favors clarity over cleverness so it
> can be read feature by feature. See [`AGENTS.md`](AGENTS.md) for the full
> engineering guide and [`NOTES.md`](NOTES.md) for open decisions / launch TODOs.

---

## Tech stack

- **Expo** (SDK 56) + **Expo Router** (file-based routing, typed routes)
- **React Native** + **TypeScript** (strict)
- **NativeWind / Tailwind** tokens — but UI is styled with `StyleSheet` +
  `@/theme` tokens, because `className` is unreliable on-device in this NativeWind
  preview (see `NOTES.md` / project memory)
- **Zustand** + **AsyncStorage** for centralized, persisted progress
- **expo-image** for the visual-first feed (caching, blur placeholders)
- **Clerk** for auth, **PostHog** for analytics
- **AdMob** (`react-native-google-mobile-ads`) + **RevenueCat**
  (`react-native-purchases`) for monetization — real SDKs outside Expo Go,
  stubbed inside (so the whole app runs in Expo Go with no native build)

Android only — no iOS code paths.

---

## Project structure

```txt
src/
  app/              # Expo Router screens
    (tabs)/         # Home (feed), Explore, Progress, Profile
    lesson/[id].tsx # full-screen lesson reader (cards → quiz → complete)
    onboarding · sign-in · sign-up · category-selection · paywall · notifications
  components/       # LessonCard, QuizRound, CategoryCard, SearchField, ...
  constants/images.ts   # centralized image registry (every asset routes through here)
  content/          # markdown lesson files — source of truth for lesson prose
  data/             # typed topic/subtopic index + static catalogs (no prose)
  hooks/            # ads, purchases, analytics, animations
  lib/              # content parser, ads, purchases, search, analytics, ...
  store/            # Zustand stores (progress, preferences)
  theme/            # design tokens (colors, spacing, radii, typography)
content/            # (root) bundled markdown
assets/images/      # bundled images (mascot, category heroes, lesson visuals, icons)
```

---

## Getting started (Expo Go)

The core app — feed, lessons, quizzes, progress, content — runs in **Expo Go**
with no native build. Ads and billing are stubbed there.

```bash
npm install
npx expo start          # then scan the QR with Expo Go on Android
# or: npm run android   # opens on a connected device / emulator
```

If the QR won't connect (different network / firewall), use tunnel mode:

```bash
npx expo start --tunnel
```

### Environment variables

Auth and analytics read public keys from `.env.local` (not committed):

```bash
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
EXPO_PUBLIC_POSTHOG_KEY=phc_...
EXPO_PUBLIC_POSTHOG_HOST=https://...
```

`EXPO_PUBLIC_*` keys are client-side by design. No secret keys ship in the bundle.

---

## Content pipeline (markdown-driven)

Lesson prose is **never** hardcoded in TS — it lives in markdown and is parsed at
runtime into typed models:

1. **Authoring** — lessons are markdown files under `content/` with frontmatter
   (`category`, `topic`, image keys, quiz).
2. **Bundling** — `md-transformer.js` (registered in `metro.config.js`) imports
   `.md` files as raw strings, so they ship in the JS bundle (React Native can't
   `fs.read`).
3. **Parsing** — `src/lib/content.ts` parses markdown + frontmatter into typed
   `Lesson` / `Card` / `Quiz` models and caches them in memory.
4. **Indexing** — `src/data/index.ts` builds the typed category → topic → lesson
   navigation index from the parsed lessons (metadata only, no prose).
5. **Images** — a card references its visual by an **image key**, resolved
   through `src/constants/images.ts` and rendered with `expo-image`. Every asset
   routes through that one registry.

No database: content = markdown + a typed index; state = Zustand + AsyncStorage.

---

## Scripts & checks

```bash
npm run lint            # expo lint (ESLint)
npx tsc --noEmit        # typecheck (no dedicated script)
npm run android         # start on Android
```

Keep both lint and typecheck clean before finishing any change.

---

## Monetization go-live

The policy code is complete (Pro = no ads; rewarded coins credited only on the
verified callback; interstitial frequency cap + 60s gap; fail-open entitlements)
and both `lib/ads.ts` and `lib/purchases.ts` run the **real SDK outside Expo Go**
with a stub fallback inside. Going live is paste-keys + build + verify:

- **AdMob** unit IDs and the App ID are wired; production fills via
  `PROD_AD_UNIT_IDS` (`lib/ads.ts`) + `androidAppId` (`app.json`). Test IDs are
  used automatically in development.
- **RevenueCat** uses a Test Store key in dev; the production `goog_…` key goes
  in `PROD_REVENUECAT_ANDROID_KEY` (`lib/purchases.ts`) once Play products exist.
- Native modules need a **dev client / EAS build** to run:
  `eas build --profile development --platform android` (or `npx expo run:android`).

The exact remaining checklist (AdMob/RevenueCat dashboards, service account,
on-device verification) lives in [`NOTES.md`](NOTES.md) →
*"Monetization go-live (prompt 24)"*.

---

## Building

Build profiles are in [`eas.json`](eas.json):

```bash
eas build --profile development --platform android   # dev client (APK, internal)
eas build --profile preview --platform android       # internal APK
eas build --profile production --platform android     # release AAB for Play
```

Production builds are deferred until the app is feature-complete (see `NOTES.md`).
