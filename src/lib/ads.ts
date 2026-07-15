/**
 * AdMob ads — interstitials between lessons + rewarded ads that grant coins.
 *
 * `react-native-google-mobile-ads` is a NATIVE module: it is NOT bundled in Expo
 * Go and only loads in a custom dev client / release build. So this file runs the
 * real SDK when it's available (outside Expo Go) and falls back to a no-op stub
 * otherwise, which keeps the whole app — lesson flow, coin economy — running end
 * to end in Expo Go with no dev client. Same typed API either way; callers
 * (`hooks/ads.ts`) never know which path ran. (Same lib↔hook split as
 * lib/purchases ↔ hooks/purchases.)
 *
 * Policy (AGENTS.md "Monetization Rules"):
 *  - Pro users see NO ads — callers gate on `isPro` before invoking these
 *    (see `hooks/ads.ts`). This module is store-agnostic on purpose.
 *  - Rewarded ads credit coins ONLY on the verified reward callback (the SDK's
 *    EARNED_REWARD event), never on ad open. That callback is the single source
 *    of truth for the grant.
 *  - Interstitials show between lesson completions only — never mid-lesson,
 *    never on launch, never back-to-back. `showInterstitial()` enforces the
 *    frequency cap itself and returns whether an ad actually showed.
 *  - Preload both formats; never block the UI waiting on an ad to load.
 *  - Test ad unit ids in development. Never ship test ids; never ship without
 *    ids (`adUnitId()` throws in a release build that has none set).
 */
import Constants, { ExecutionEnvironment } from "expo-constants";
// Type-only imports (erased at runtime, so they touch no native code in Expo Go).
import type {
  InterstitialAd as InterstitialAdInstance,
  RewardedAd as RewardedAdInstance,
  RewardedAdReward,
} from "react-native-google-mobile-ads";

/**
 * A verified ad reward. In production this comes from the rewarded ad unit's
 * server-side config (the SDK's EARNED_REWARD event); the stub fills it from
 * `REWARDED_COIN_REWARD`.
 */
export type AdReward = {
  /** Reward currency (AdMob "reward type") — always coins in this app. */
  type: "coins";
  /** How many to grant. Source of truth is the reward callback, never ad-open. */
  amount: number;
};

/** Invoked once when (and only when) a rewarded ad's reward is verified. */
export type RewardCallback = (reward: AdReward) => void;

/**
 * Coins a single rewarded ad grants. In production the real amount is configured
 * server-side on the rewarded unit and arrives via the callback; this constant
 * lets the UI label the button ("+50 coins") beforehand and is the stub's payout.
 * Keep it in sync with the reward set on the AdMob rewarded unit.
 */
export const REWARDED_COIN_REWARD = 50;

// --- Native module (real SDK outside Expo Go) ------------------------------

// In Expo Go the native module isn't bundled; load it LAZILY only outside Expo
// Go so the native bridge is never touched there. The require is wrapped so a dev
// client built before this module was added falls back to the stub instead of
// crashing — rebuild the dev client (or do a release build) to get real ads.
const isExpoGo = Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

type GmaModule = typeof import("react-native-google-mobile-ads");
let gma: GmaModule | null = null;
if (!isExpoGo) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    gma = require("react-native-google-mobile-ads");
  } catch (e) {
    if (__DEV__) console.warn("[ads] native module unavailable; using stub", e);
  }
}

let adsInitialized = false;

/** Initialize the AdMob SDK once before the first ad request (real path only). */
function ensureAdsInit(): void {
  if (!gma || adsInitialized) return;
  adsInitialized = true;
  // `mobileAds()` is the default export; `initialize()` is fire-and-forget — the
  // SDK queues ad requests made before it resolves.
  gma.default().initialize();
}

// --- Consent (GDPR / UMP) --------------------------------------------------

/** Whether ad consent has already been gathered this session. */
let consentGathered = false;

/**
 * Gather GDPR / UMP ad consent before requesting ads — Google's User Messaging
 * Platform. Shows the consent form only where required (EEA users) and only once
 * a consent message is configured in the AdMob console (Privacy & messaging);
 * a no-op on the stub (Expo Go), outside the EEA, or when no message is set up.
 *
 * Fails open — a consent hiccup never blocks ads or the app (the SDK then serves
 * non-personalized ads). Call it once before the first ad load; safe to repeat.
 */
export async function gatherAdsConsent(): Promise<void> {
  if (!gma || consentGathered) return;
  consentGathered = true;
  try {
    // Requests the latest consent info and shows the form if the user's region
    // requires it. Personalized vs. non-personalized is then handled by the SDK.
    await gma.AdsConsent.gatherConsent();
  } catch (e) {
    consentGathered = false; // allow a later retry
    if (__DEV__) console.warn("[ads] consent gathering failed", e);
  }
}

// --- Ad unit ids -----------------------------------------------------------

/** Google's official sample ad unit ids — safe ONLY in development. */
const TEST_AD_UNIT_IDS = {
  interstitial: "ca-app-pub-3940256099942544/1033173712",
  rewarded: "ca-app-pub-3940256099942544/5224354917",
} as const;

/**
 * Real AdMob unit ids from the console go here before launch. Left empty in the
 * repo so we can never accidentally ship someone else's live ids; `adUnitId()`
 * enforces that a release build has them set.
 */
const PROD_AD_UNIT_IDS: Record<AdFormat, string> = {
  interstitial: "ca-app-pub-9884769028779738/9851592404",
  rewarded: "ca-app-pub-9884769028779738/5112406621",
};

type AdFormat = keyof typeof TEST_AD_UNIT_IDS;

/**
 * Resolve the unit id for a format: test ids in development, real ids in a
 * release build — and a release build MUST have them (never ship test ids,
 * never ship without ids).
 */
export function adUnitId(format: AdFormat): string {
  if (__DEV__) return TEST_AD_UNIT_IDS[format];
  const id = PROD_AD_UNIT_IDS[format];
  if (!id) {
    throw new Error(
      `[ads] Missing production ad unit id for "${format}". Set PROD_AD_UNIT_IDS before release.`
    );
  }
  return id;
}

// --- Frequency cap (interstitials) -----------------------------------------

/**
 * Interstitial frequency cap. Show at most once every N eligible lesson
 * completions, and never within `MIN_AD_GAP_MS` of any other ad (interstitial
 * OR rewarded) — that gap is what guarantees "never back-to-back", e.g. a
 * rewarded ad and an interstitial can't stack on the same completion screen.
 * Both are deliberately gentle for a micro-learning feed; tune as needed.
 */
const LESSONS_PER_INTERSTITIAL = 2;
const MIN_AD_GAP_MS = 60_000;

/** How long the stub pretends a rewarded ad plays, so the UI can show a wait. */
const STUB_REWARDED_WATCH_MS = 700;

// Module-level state. Resets when the JS context reloads — fine: caps are a
// per-session concern, and the real SDK also loses preloaded ads on reload.
let interstitialReady = false;
let rewardedReady = false;
let completionsSinceInterstitial = 0;
let lastAdShownAt = 0;

// Real-SDK ad instances (null on the stub path). Each is recreated after it shows.
let interstitialAd: InterstitialAdInstance | null = null;
let rewardedAd: RewardedAdInstance | null = null;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// --- Interstitials ---------------------------------------------------------

/** Preload an interstitial so a later show is instant (never block UI to load). */
export function loadInterstitial(): void {
  if (gma) {
    ensureAdsInit();
    const ad = gma.InterstitialAd.createForAdRequest(adUnitId("interstitial"));
    ad.addAdEventListener(gma.AdEventType.LOADED, () => {
      interstitialReady = true;
    });
    ad.addAdEventListener(gma.AdEventType.ERROR, (e: Error) => {
      interstitialReady = false;
      if (__DEV__) console.warn("[ads] interstitial failed to load", e);
    });
    ad.load();
    interstitialAd = ad;
    return;
  }
  // Stub (Expo Go): nothing to load — mark ready so the cap logic can proceed.
  interstitialReady = true;
}

/**
 * Count a lesson completion and, if the frequency cap allows, show an
 * interstitial. Returns true only if an ad actually showed. Free users only —
 * callers must check `isPro` first (Pro users see no ads).
 *
 * Call this exactly once per lesson completion: it owns the cap counter.
 */
export async function showInterstitial(): Promise<boolean> {
  completionsSinceInterstitial += 1;

  const capReached = completionsSinceInterstitial >= LESSONS_PER_INTERSTITIAL;
  const enoughGap = Date.now() - lastAdShownAt >= MIN_AD_GAP_MS;
  if (!capReached || !enoughGap || !interstitialReady) return false;

  if (gma && interstitialAd) {
    const mod = gma;
    const ad = interstitialAd;
    // Resolve when the ad is dismissed so the caller can navigate on.
    await new Promise<void>((resolve) => {
      const unsub = ad.addAdEventListener(mod.AdEventType.CLOSED, () => {
        unsub();
        resolve();
      });
      // show() rejects if the ad wasn't actually ready — don't hang the caller.
      ad.show().catch((e) => {
        if (__DEV__) console.warn("[ads] interstitial show failed", e);
        unsub();
        resolve();
      });
    });
  } else if (__DEV__) {
    console.log("[ads] (stub) interstitial shown");
  }

  interstitialReady = false;
  completionsSinceInterstitial = 0;
  lastAdShownAt = Date.now();
  loadInterstitial(); // preload the next one
  return true;
}

// --- Rewarded --------------------------------------------------------------

/** Preload a rewarded ad so "watch for coins" is instant (never block UI). */
export function loadRewarded(): void {
  if (gma) {
    ensureAdsInit();
    const ad = gma.RewardedAd.createForAdRequest(adUnitId("rewarded"));
    ad.addAdEventListener(gma.RewardedAdEventType.LOADED, () => {
      rewardedReady = true;
    });
    ad.addAdEventListener(gma.AdEventType.ERROR, (e: Error) => {
      rewardedReady = false;
      if (__DEV__) console.warn("[ads] rewarded failed to load", e);
    });
    ad.load();
    rewardedAd = ad;
    return;
  }
  rewardedReady = true;
}

/**
 * Show a rewarded ad. Calls `onReward` exactly once, and ONLY when the reward
 * is verified (the user watched enough) — never on ad open. Resolves to true if
 * an ad showed. Free users only.
 */
export async function showRewarded(onReward: RewardCallback): Promise<boolean> {
  // Not preloaded yet — don't block the UI waiting; just no-op so the caller can
  // try again after loadRewarded().
  if (!rewardedReady) return false;

  if (gma && rewardedAd) {
    const mod = gma;
    const ad = rewardedAd;
    await new Promise<void>((resolve) => {
      // The reward is granted from EARNED_REWARD only — not on open, not on a
      // close-without-watching. This is the single source of truth for the grant.
      const unsubReward = ad.addAdEventListener(
        mod.RewardedAdEventType.EARNED_REWARD,
        (reward: RewardedAdReward) => onReward({ type: "coins", amount: reward.amount })
      );
      const unsubClosed = ad.addAdEventListener(mod.AdEventType.CLOSED, () => {
        unsubReward();
        unsubClosed();
        resolve();
      });
      ad.show().catch((e) => {
        if (__DEV__) console.warn("[ads] rewarded show failed", e);
        unsubReward();
        unsubClosed();
        resolve();
      });
    });
  } else {
    // Stub: pretend the user watches to completion, then earn the reward — the
    // real path grants from EARNED_REWARD only; we mirror that contract exactly.
    await delay(STUB_REWARDED_WATCH_MS);
    onReward({ type: "coins", amount: REWARDED_COIN_REWARD });
  }

  rewardedReady = false;
  lastAdShownAt = Date.now();
  loadRewarded(); // preload the next one
  return true;
}
