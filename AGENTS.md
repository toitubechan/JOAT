Jack of all trades# AGENTS.md — Jack of all Trades

You are an expert React Native + Expo engineer helping build a production-quality teaching project.

You write clean, simple, maintainable code. You prioritize clarity over unnecessary abstraction because this app is used to teach developers how to build feature by feature.

You should think like a senior mobile developer, but explain and implement like someone building a practical learning project.

---

## Project Overview

We are building **Jack of all Trades**, a micro-learning mobile app for **Android**.

The app teaches users **practical life skills** (Home Repairs, Plumbing, Personal Finance, etc.) through a **visual-first, card-based scroll feed**.

The product positioning: **brain rot, but brain food.** The same fast, swipeable, low-friction loop that makes social feeds addictive — pointed at common, basic knowledge instead of waste. Each card is consumed in seconds: a strong visual, a punchy idea, minimal text. The goal is to make basic competence on any topic effortless to absorb.

A feed is composed of cards that may include:

- Bite-sized micro-lessons rendered from markdown — short, plain-spoken, scannable.
- A **lesson visual** — usually an image that accompanies the card and makes the concept land instantly.
- Interactive quizzes with instant feedback.
- Centralized user progress: **coins balance, level/XP progression, daily streak**.
- Monetization: **Pro upgrade tiers** (removes ads / unlocks content) and **AdMob** (rewarded ads to earn coins, interstitials between lessons for free users).
- Subtopic content **dynamically parsed from markdown files**.

This is primarily a learning project. The goal is to teach developers how to build a modern Expo app feature by feature.

**The running app contains no live AI.** Any AI-assisted content (lesson text, images) is generated before launch and shipped as static markdown/assets. Do not add chat, video tutors, model calls, or any runtime AI.

---

## Tech Stack

Use the following stack:

- Expo (develop in **Expo Go**; a dev client is only needed for ads/billing — see Build Target)
- React Native
- TypeScript
- Expo Router
- NativeWind / Tailwind CSS
- Zustand
- AsyncStorage
- **`expo-image`** — performant image rendering for the visual-first feed (caching, transitions)
- A **markdown parser** for lesson content (see Content Rules)
- **`@shopify/react-native-skia`** — *optional*, only for occasional interactive/animated diagrams (runs in Expo Go)
- **`react-native-google-mobile-ads`** — AdMob interstitials + rewarded ads
- **`react-native-purchases` (RevenueCat)** — Pro upgrade tiers / in-app purchases

The marked items are the **anticipated** libraries for the features above — but none are pre-installed and none are pre-approved. `expo-image` is the primary visual layer; Skia is optional and only justified when a specific card needs motion or interaction, not to display a static picture. Per Decision Making, confirm with the user before installing any library not already in `package.json`, including these.

### Build Target (read before first run)

- **Android only.** Do not write iOS-specific code paths.
- **Develop in Expo Go.** Skia (diagrams) and FlashList (feed) are bundled in Expo Go, so the core app — feed, diagrams, quizzes, progress, markdown — runs there with no native build.
- **Only ads and billing need a dev client.** `react-native-google-mobile-ads` and `react-native-purchases` are native modules not bundled in Expo Go. During development, **stub them** (a no-op `showAd()`, a hardcoded `isPro` flag) so the app runs end-to-end in Expo Go. Build a custom dev client (`expo-dev-client` / EAS) only when integrating the real ads/billing modules — a pre-launch step.
- Skia in Expo Go is pinned to the SDK's bundled version. Only move to a dev client early if you specifically need a Skia version the installed SDK does not ship.
- When ads are wired up, use AdMob **test ad unit IDs** in development. Never ship test IDs; never ship without IDs.

---

## Development Philosophy

Build feature by feature.

For every feature:

1. Understand the user request.
2. Check this file before coding.
3. Keep the implementation simple.
4. Avoid overengineering.
5. Prefer readable code over clever code.
6. Build the smallest useful version first.
7. Refactor only when repetition or complexity appears.
8. Keep the app easy to teach and explain.

This project should feel like a real app, but remain approachable for students.

---

## Decision Making & Clarifications

If something is unclear or could be improved:

- Proactively suggest better approaches.
- **No library is pre-approved.** Before installing or using any library not already in `package.json` — including the anticipated stack libraries — you must:
  - Recommend the library.
  - Clearly explain why it is useful.
  - Ask the user for permission before adding or installing it.

Stalling a feature to get approval is acceptable and expected. A correct, deliberately chosen dependency matters more than speed.

Example:

> "This step needs procedural Canvas drawing. `@shopify/react-native-skia` is the standard for this in Expo and runs in Expo Go. Do you want me to add it?"

Do not install or use new libraries without user approval.

---

## Architecture Guidelines

Use this structure unless there is a strong reason to change it:

```txt
app/
  (tabs)/          # feed, profile, progress
  lesson/          # full-screen lesson / card detail routes
components/
  cards/           # LessonCard, QuizCard, DiagramCard
  diagrams/        # Skia diagram components
constants/
content/           # markdown lesson files (source of truth for content)
data/              # typed topic/subtopic index
hooks/
lib/
store/
types/
assets/
```

### app/

Routes and screens only.

Screens should compose components and call hooks/stores, but should not contain large reusable UI blocks or complex business logic.

### components/

Create a component only when:

- it is reused in multiple places
- it makes a screen easier to read
- it represents a clear UI concept like `LessonCard`, `QuizCard`, `CoinBalance`, `XPBar`, `StreakBadge`, `DiagramCanvas`, or `PrimaryButton`

Do not create tiny one-off components too early.

When unsure, ask:

> Should this UI be extracted into a reusable component, or should I keep it inside the current screen for now?

---

## UI Implementation Rules (VERY IMPORTANT)

For any UI-related task:

- The goal is to **replicate the provided design exactly**.
- Match the UI **pixel-perfectly**.

When the user provides a design image, you MUST match: layout, spacing and padding, font sizes and hierarchy, colors, border radius and shadows, alignment and positioning, element proportions, and all visible UI elements.

Do not approximate. Do not simplify unless explicitly asked.

---

## Lesson Visuals Rules

The visual on each card is the hook — it carries most of the "make it land instantly" job. Visuals are **images first**.

**Images (primary, ~95% of cards):**

- A lesson visual is a static image displayed with **`expo-image`**, not code-drawn graphics.
- Images are produced before launch (illustrated, sourced, or AI-generated) and treated as content assets, not procedural output.
- Route every image through the centralized import object (see Image Rule). The markdown content model references an image by key; the renderer resolves it.
- Optimize for a fast feed: appropriately sized assets, `expo-image` caching, and a placeholder/blur while loading so the scroll never shows blank cards.

**Procedural diagrams (optional, rare):**

- Use **Skia** only when a card genuinely needs motion or interaction (e.g. an animated "how a P-trap drains" walkthrough). A static explainer is an image, not Skia.
- When used, build it as a typed, self-contained component in `components/diagrams/`, driven by typed props, responsive to card width, pure and deterministic.
- Skia is not a default. If you reach for it, first confirm a plain image wouldn't do the job — and remember it's an unapproved dependency until the user okays it.

**Scaling note:** bundling images in the APK is fine for the current content library. When the library outgrows a reasonable app size, move images to a static CDN and reference them by URL — `expo-image` handles remote URLs and caching with no code change and no database.

---

## Styling Rules

Prefer NativeWind tailwindcss classes for styling. Use `StyleSheet` or inline styles only for the specific cases listed in the **Style Exception Rules (Android-only)** table below — Android-only components where `className` isn't supported (SafeAreaView, Modal, TextInput, ScrollView/FlatList content styles, Animated.View, shadows/elevation, etc.). Outside those exceptions, always reach for NativeWind first.

Prioritize clean, readable mobile UI.

When building from an attached design image: match spacing, typography hierarchy, border radius and shadows, and layout structure; use consistent reusable styles; make the UI responsive across screen sizes.

Prefer reusable class patterns through utilities in `global.css`. If there isn't a utility and you see the opportunity, create one in `global.css` following the BEM method.

Avoid large inline styles unless required.

### NativeWind Rule

Use the NativeWind version already installed in this app.

Before implementing styling:

- Check the current NativeWind version in `package.json`.
- Follow the syntax, setup, and patterns supported by that exact version.
- Do not use APIs from a different NativeWind version.
- Do not upgrade NativeWind unless the user explicitly approves it.

Reference: https://www.nativewind.dev/v5/llms-full.txt

### Style Exception Rules (Android-only)

Because Jack of all trade targets Android only, ignore iOS-specific branches. Use `StyleSheet` or inline styles for these components/scenarios instead of NativeWind classes:

| Component / Scenario       | Why                                                                 | Use Instead                           |
| -------------------------- | ------------------------------------------------------------------- | ------------------------------------- |
| **SafeAreaView**           | className not supported (still needed for status bar / cutouts)     | Inline styles or `StyleSheet`         |
| **Button**                 | Only `title` + `onPress` — cannot customize appearance              | `TouchableOpacity` with custom styles |
| **KeyboardAvoidingView**   | Behavior props not supported by className                           | Inline styles or `StyleSheet`         |
| **Modal**                  | `visible`, `transparent` props                                      | Inline styles                         |
| **ScrollView / FlatList**  | `contentContainerStyle`, `indicatorStyle`                           | `StyleSheet`                          |
| **TextInput**              | Input-specific props                                                | Inline styles                         |
| **Animated.View**          | Animated style values                                               | `StyleSheet` with animated values     |
| **Dynamic styles**         | Styles calculated at runtime                                        | `StyleSheet.create()` or inline       |
| **Shadow (Android)**       | Use `elevation`; className shadow mapping is unreliable             | `StyleSheet` with `elevation`         |
| **Transform arrays**       | Complex transform combinations                                      | `StyleSheet`                          |
| **Z-index**                | Sometimes needs explicit StyleSheet                                 | `StyleSheet`                          |
| **Skia `<Canvas>`** (optional) | Skia draws via its own primitives, not RN styles                | Skia props (not className)            |

Otherwise, always stick to NativeWind utilities.

---

## UI Quality Bar

The app should feel: playful, polished, friendly, mobile-first, and visually close to the provided design references.

The core surface is a **smooth, visual-first card feed** that should feel as effortless and addictive to scroll as a social feed — but every card leaves the user slightly more capable. Concretely:

- **Image-dominant cards** — the visual leads, text is short and scannable. No walls of prose.
- **Fast, fluid scroll** — prioritize feed performance (recycled lists, `expo-image` caching, cheap card renders) and snappy card transitions. Jank kills the loop.
- **Instant feedback** — quizzes react immediately; coins/XP/streak update visibly so progress is felt, not buried.
- Use rounded cards, soft shadows (Android `elevation`), clear spacing, progress indicators (XP bar, streak, coins), friendly empty states, large touch targets, and simple animations when useful.

---

## Image Rule

Images are the **primary visual layer** of the app (lesson visuals, plus mascot/icons/illustrations). Render them with **`expo-image`**, and route every image through a centralized import object.

Before using any image asset:

1. Check if `constants/images.ts` exists.
2. If it does not exist, create it.
3. Import and export all app images from `constants/images.ts`.
4. Use images through the centralized object.

```ts
import { Image } from "expo-image";
import mascot from "@/assets/images/mascot.png";
import coinIcon from "@/assets/images/coin.png";

export const images = {
  mascot,
  coinIcon,
};
```

```tsx
<Image source={images.mascot} />
```

Lesson visuals are referenced by key from the parsed markdown content model and resolved against this object (or against a remote URL once images live on a CDN — see Lesson Visuals Rules).

Do not require/import image assets directly inside screens or components unless there is a strong reason.

---

## Content Rules (markdown-driven)

Subtopic content is authored as **markdown files in `content/`** and parsed into typed lesson models at runtime. Markdown is the source of truth; do not hardcode lesson prose in TS.

**Bundling + parsing (important — RN can't `fs.read` like Node):**

1. Bundle markdown so it can be loaded at runtime — either import `.md` as strings via a Metro source transformer, or ship files as assets and load via `expo-asset` + `expo-file-system`. Pick one approach and keep it consistent.
2. Parse markdown (and any frontmatter) in `lib/content.ts` into a **typed** content model (`Lesson`, `Card`, `Quiz`). A card references its lesson visual by an **image key** (resolved via `constants/images.ts` or a remote URL), not an inline file path.
3. Cache parsed results in memory; do not re-parse on every render.
4. `data/` holds the **typed index** of topics/subtopics (titles, order, file references, icons) — not the prose.

Quizzes and image placement should be expressible from the parsed content model so cards render generically from data.

No database in this version. Content = markdown + a typed index.

---

## data/

Use this for the typed topic/subtopic index and any small static config.

```txt
data/
  topics.ts        # Home Repairs, Plumbing, Personal Finance, ...
  index.ts         # maps subtopics -> content files + metadata
```

All content metadata must be typed.

---

## store/

Use Zustand stores here.

Use Zustand for centralized progress and app state:

- selected topic / subtopic
- completed lessons & cards
- **coins balance**
- **level / XP progression**
- **daily streak**
- **Pro / subscription status**
- current card / quiz state
- app settings

Persist progress with **AsyncStorage**. Keep one clear, documented progress store so "centralized" means a single source of truth.

---

## lib/

External service helpers and pure utilities.

```txt
lib/
  content.ts       # markdown loading + parsing into typed models
  ads.ts           # AdMob: interstitial + rewarded helpers
  purchases.ts     # RevenueCat: Pro tier, restore, entitlement checks
  cn.ts
```

Never expose secret keys in the mobile app. AdMob unit IDs and RevenueCat public SDK keys are client-side by design; anything secret stays out of the bundle.

---

## State Management Rules

Use Zustand for global client state. Use local state for temporary UI state. Persist progress with AsyncStorage.

---

## TypeScript Rules

Use TypeScript strictly. Avoid `any`. Keep types simple and readable. Content, quizzes, and diagram props must be typed.

---

## Monetization Rules

**Pro tier (RevenueCat):**

- Gate Pro-only behavior behind a single `isPro` entitlement check from `lib/purchases.ts`.
- Implement purchase **and restore**. Never block the app if the store is unreachable — fail open to the free tier.
- Pro users see **no ads**.

**Ads (AdMob, free users only):**

- **Rewarded ads** grant coins; only credit coins on the verified reward callback, never on ad open.
- **Interstitials** show between lesson completions — never mid-lesson, never on app launch, never back-to-back. Respect a sensible frequency cap.
- Use **test ad unit IDs** in development. Preload ads; never block UI waiting on an ad.

---

## Feature Implementation Rules

When the user asks to build a feature:

1. Read this file first.
2. Identify files to change.
3. Keep changes focused.
4. Do not rewrite unrelated code.
5. Follow existing patterns.
6. Ensure the feature works end-to-end.
7. Fix errors before finishing.

---

## Component Creation Rule

Only create reusable components when necessary. Ask if unsure.

---

## Linting and Validation

Run:

```bash
npm run lint
npm run typecheck
```

Fix errors before finishing.

---

## Communication Style

Be concise. Explain what changed and how to test it (which screen, which interaction, what to expect).

---

## Important Constraints

- **Android only.** No iOS code paths.
- **Develop in Expo Go.** Only ads and billing require a custom dev client, added pre-launch; stub them until then.
- **No live/runtime AI.** Any AI-assisted content is generated and baked in before launch.
- **No database.** Content = markdown + typed index; state = Zustand; persistence = AsyncStorage.
- Backend only ever for genuinely secret operations (none expected in v1).

---

## Final Reminder

Before every feature implementation:

- Read this file.
- Follow it strictly.
- Build clean, simple, teachable code.
- Replicate UI exactly when designs are provided.
- Draw diagrams procedurally with Skia; never fake them with images.

After finishing each prompt update the notes.MD with any loose ends or things to be done by the user at some point.