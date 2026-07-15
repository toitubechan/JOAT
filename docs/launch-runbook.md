# Joat — Launch Runbook (Google Play via EAS)

Ship order, end to end. Commands run from the project root. Things only **you**
can do (account-gated) are marked 👤; everything else I can prep.

Known app facts this runbook uses:
- Package: `com.jackofalltrades.app` · version `1.0.0`
- Pro product id: `joat_pro` · entitlement id: `pro` · price ~`$4.99`
- AdMob app id + prod unit ids: already set (`app.json`, `lib/ads.ts`)
- `eas.json`: profiles `development` / `preview` / `production` + submit (internal)

---

## ⚠️ Read first — 3 gotchas that will bite

1. **Release builds run with `__DEV__ = false`**, so they use the **production**
   keys, not the test ones:
   - `PROD_REVENUECAT_ANDROID_KEY` in `lib/purchases.ts` is **empty** → a
     `production`/`preview` build **crashes at purchases init** until you set the
     `goog_…` key. (A `development` build uses the `test_…` key and is fine.)
   - Prod AdMob unit ids are already set, so ads are OK in release.
2. **`.env.local` is gitignored and is NOT uploaded to the cloud build.** So a
   release build has **no** Clerk / PostHog keys unless you add them as EAS env
   vars (see Phase 1). Missing the Clerk key = the app throws on launch.
3. **The app is gated behind Clerk sign-in**, so Play reviewers can't get past the
   login. You must give them a **test account** in Play's *App access* section, or
   they'll reject the app.

---

## Phase 0 — Tooling (one-time) 👤

- Use **Node 20 LTS** (repo is pinned via `.nvmrc`; Node 24 breaks Metro/EAS).
- Install EAS CLI: `npm i -g eas-cli`  (or prefix commands with `npx eas-cli@latest`)
- Accounts: **Expo** (expo.dev), **Google Play Developer** ($25, you have it),
  **AdMob**, **RevenueCat**.

```bash
eas login            # 👤 sign in to your Expo account
eas whoami           # confirm
```

---

## Phase 1 — Fill keys + env (the blockers)

**RevenueCat key** — ✅ **done**: the `goog_…` public key is set in
`PROD_REVENUECAT_ANDROID_KEY` (`lib/purchases.ts`). (You still need to finish the
RevenueCat product/entitlement/offering + Play credentials in Phase 4 for real
purchases to validate.)

**EAS environment variables** (so the release build has the public keys). The
Clerk *publishable* key and PostHog keys are public/safe; the Clerk **secret** key
is NOT used by the app and must never ship.

```bash
# 👤 create these for the production (and preview) environment:
eas env:create --environment production --name EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY --value "pk_live_…"
eas env:create --environment production --name EXPO_PUBLIC_POSTHOG_KEY --value "phc_…"
eas env:create --environment production --name EXPO_PUBLIC_POSTHOG_HOST --value "https://us.i.posthog.com"
```
(Use your real values from `.env.local`. Repeat with `--environment preview` if you
build a preview APK.)

---

## Phase 2 — Link the EAS project 👤

```bash
eas init            # creates the project on expo.dev, writes extra.eas.projectId into app.json
```
Commit the resulting `app.json` change.

---

## Phase 3 — Verify on a real device (test config)

Build a **development** client — it runs with `__DEV__ = true`, so it uses the
**test** RevenueCat key + **test** AdMob units (real Google test ads), no prod keys
needed:

```bash
eas build -p android --profile development
```
Install the APK on your phone, then start Metro and connect:
```bash
npx expo start --dev-client
```
Smoke-test the whole app in a real build (not Expo Go):
- [ ] Sign up / sign in (Clerk)
- [ ] Feed → open a lesson → cards → quiz → complete (XP/coins/streak update)
- [ ] Explore, category detail, Progress
- [ ] Profile shop: buy streak freeze, random lesson, **watch-ad-for-coins shows a real test ad**
- [ ] Settings: **Theme → Light / System** recolors the app
- [ ] Paywall: **buy Pro + restore** work (RevenueCat Test Store)
- [ ] Coin-locked category → unlock flow

Fix anything that only breaks in a real build, then continue.

---

## Phase 4 — Console setup 👤

### Google Play Console
- **Create app** → **store listing title = `JOAT: Jack of all trades`** (Play
  allows ≤30 chars; this is 24), Free, "App".
- Accept the **Developer Distribution Agreement**.
- **App content**:
  - **Privacy policy** URL → host `docs/privacy-policy.md` (e.g. GitHub Pages) and paste the link.
  - **Data safety** → fill using the cheat-sheet at the bottom of `docs/privacy-policy.md`.
  - **Content rating** questionnaire.
  - **Target audience** → general / not for children.
  - **Ads** → **Yes, contains ads**.
  - **App access** → the app needs login → **add a test account** (email + password)
    so reviewers can get in. ⟵ don't skip this.
- **Monetize → Products → In-app products** → create **`joat_pro`**, price ~$4.99, **Activate**.

### AdMob 👤
- Link the app; **Privacy & messaging** → create a **GDPR (EEA) consent message**
  so the in-app UMP form (`gatherAdsConsent`) actually appears. Add your test-device
  id there to preview it.

### RevenueCat 👤
- Upload a Play **service-account JSON** (App → Google Play credentials) so it can
  verify purchases.
- **Products** → add `joat_pro` → **Entitlement** `pro` → attach → add to the
  default **Offering**.

---

## Phase 5 — Service account for `eas submit` 👤

1. Play Console → **Setup → API access** → create/link a Google Cloud **service
   account**, grant it **Admin (or Release)** permissions in Play.
2. Download its **JSON key**. Save it OUTSIDE git (e.g. `./secrets/play-sa.json`)
   and make sure it's gitignored.
3. I add the path to `eas.json`:
   ```json
   "submit": { "production": { "android": {
     "serviceAccountKeyPath": "./secrets/play-sa.json",
     "track": "internal"
   } } }
   ```
   (The same JSON can be reused for RevenueCat's Play credentials.)

---

## Phase 6 — Build + submit 🚀

Once Phase 1 keys are in and Phase 4/5 are done:

```bash
eas build -p android --profile production      # signed .aab in the cloud
eas submit -p android --profile production --latest   # uploads to the Internal track
```
Or in one shot: `eas build -p android --profile production --auto-submit`.

Then in Play Console: **Testing → Internal testing** → add testers → verify the
store build → **promote Internal → Production** and submit for review.

---

## Phase 7 — After review

- Google review is typically a few days for a first submission; fix + resubmit if
  rejected (common causes: missing privacy policy, Data safety mismatch, no
  reviewer login).
- Later updates: bump nothing manually — `production.autoIncrement` bumps
  `versionCode`; bump the human `version` in `app.json` when you want.

---

## Optional polish before first submit

- ✅ Home-screen label (`expo.name`) set to **`JOAT`** (short + clean). The full
  **`JOAT: Jack of all trades`** is the Play **store listing title** (set in
  Console, Phase 4). `slug` left as-is (it ties to the EAS project).
- Store listing assets: icon (have it), feature graphic (1024×500), 2–8
  screenshots, short + full description.
