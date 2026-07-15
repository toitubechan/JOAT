/**
 * RevenueCat Pro tier — the single gateway to the in-app-purchase "store".
 *
 * `react-native-purchases` (RevenueCat) is now installed, but it's a NATIVE
 * module that is NOT bundled in Expo Go — it only works in a custom dev client /
 * release build. So this file runs the real SDK when it's available (outside
 * Expo Go) and falls back to a mock otherwise, which keeps the whole app —
 * paywall, ad-gating, locked content — running end to end in Expo Go with no dev
 * client. Same typed API either way; callers never know which path ran.
 *
 * Policy (AGENTS.md "Monetization Rules"):
 *  - ONE entitlement check is the source of truth: `isProEntitled()`. Everything
 *    Pro-gated (no ads, unlocked content) keys off the mirrored `isPro` flag in
 *    the progress store — this module is store-agnostic on purpose; `hooks/
 *    purchases.ts` does the mirroring (same split as lib/ads ↔ hooks/ads).
 *  - Implement purchase AND restore (`purchasePro`, `restorePurchases`).
 *  - FAIL OPEN: if the store is unreachable, never block the app — every call
 *    resolves to the free tier (`false`) instead of throwing.
 *  - Only RevenueCat's PUBLIC SDK key is client-side (it's safe by design — see
 *    `revenueCatApiKey()`). No secret keys ever ship in the bundle.
 */
import Constants, { ExecutionEnvironment } from "expo-constants";

// In Expo Go the native module isn't bundled. Detect that and load the SDK
// LAZILY only outside Expo Go, so the native bridge is never touched there (the
// app uses the stub path below instead). `import type` is compile-time only — it
// pulls no runtime code, so the type stays available even where the module isn't.
const isExpoGo = Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

type PurchasesApi = typeof import("react-native-purchases").default;
let Purchases: PurchasesApi | null = null;
if (!isExpoGo) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    Purchases = require("react-native-purchases").default as PurchasesApi;
  } catch (e) {
    // A dev client built before this module was added won't have it; fall back to
    // the stub instead of crashing on launch. Rebuild the dev client for real IAP.
    if (__DEV__) console.warn("[purchases] native module unavailable; using stub", e);
  }
}

/** True once `configurePurchases` has wired up the real SDK successfully. */
let useReal = false;

/**
 * The entitlement identifier configured in the RevenueCat dashboard. A customer
 * has Pro when this id is present in `customerInfo.entitlements.active`.
 */
export const PRO_ENTITLEMENT_ID = "pro";

/**
 * Store product identifier for the Pro upgrade (configured in the Play Console /
 * RevenueCat). Used for the `pro_purchased` analytics event; the real SDK
 * reports the actual id off the purchased package.
 */
export const PRO_PRODUCT_ID = "joat_pro";

/** Outcome of a purchase attempt: owned status plus what was bought (for analytics). */
export type PurchaseResult = { owned: boolean; productId: string; price?: number };

/**
 * Fallback display price for the Pro upgrade. When the real SDK is active the
 * paywall shows the live, localized price off the fetched offering
 * (`fetchProPriceLabel`); this is just the placeholder shown before that
 * resolves / in Expo Go.
 */
export const PRO_PRICE_LABEL = "$4.99";

// --- API keys --------------------------------------------------------------

/**
 * RevenueCat API keys (Android). Both are client-side / public by design — they
 * identify the app to RevenueCat and grant no privileged access, so they are
 * safe in the bundle (AGENTS.md: "RevenueCat public SDK keys are client-side by
 * design; anything secret stays out of the bundle").
 *
 * TEST is RevenueCat's **Test Store** key (`test_…`): it lets the real SDK run
 * purchase + restore in a dev build with NO Play Console products configured, so
 * the flow is verifiable now. PROD is the real **Google Play** public key
 * (`goog_…`) from the dashboard, used once Play products + the `pro` entitlement
 * + an offering are set up. Left empty in the repo so we never ship without it.
 *
 * `__DEV__` picks TEST in development and PROD in a release build — never ship
 * the test key, and a release build MUST have PROD set (`revenueCatApiKey()`
 * throws otherwise).
 */
const TEST_REVENUECAT_ANDROID_KEY = "test_FugyRNdDgVaJFcsOhSwylGtzeEx";
const PROD_REVENUECAT_ANDROID_KEY = "goog_CuwQeEvbRpTYPYVnoCxyuytbWtv";

/**
 * Resolve the public SDK key: the Test Store key in development, the real Google
 * Play key in a release build — and a release build MUST have it set.
 */
export function revenueCatApiKey(): string {
  if (__DEV__) return TEST_REVENUECAT_ANDROID_KEY;
  if (!PROD_REVENUECAT_ANDROID_KEY) {
    throw new Error(
      "[purchases] Missing production RevenueCat Android key. Set PROD_REVENUECAT_ANDROID_KEY before release."
    );
  }
  return PROD_REVENUECAT_ANDROID_KEY;
}

// --- Stub state ------------------------------------------------------------

/**
 * The stub's stand-in for RevenueCat's server: whether this user currently owns
 * Pro. Used only on the stub path (Expo Go). Seeded on configure from the
 * persisted store flag (so a purchase survives a JS reload) and flipped by
 * `purchasePro`. On the real path RevenueCat owns the truth and this is unused.
 */
let stubProActive = false;
let configured = false;

/** How long the stub pretends the store sheet is open, so the UI can show a spinner. */
const STUB_PURCHASE_MS = 700;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Is `id` among the active entitlements on this customer info? */
function hasProEntitlement(info: Awaited<ReturnType<PurchasesApi["getCustomerInfo"]>>): boolean {
  return info.entitlements.active[PRO_ENTITLEMENT_ID] !== undefined;
}

// --- Lifecycle -------------------------------------------------------------

/**
 * Initialize once on app launch (before any entitlement check).
 *
 * `stubSeedPro` is a STUB-ONLY bridge (Expo Go): the stub has no server, so it
 * seeds its in-memory "owns Pro" flag from the value the progress store
 * rehydrated, which keeps a previously-bought Pro alive across reloads. The real
 * SDK ignores it — RevenueCat restores entitlements from its own cache/server.
 */
export async function configurePurchases(stubSeedPro = false): Promise<void> {
  if (configured) return;
  configured = true;

  if (!Purchases) {
    // Expo Go: no native module — pure stub.
    stubProActive = stubSeedPro;
    if (__DEV__) console.log("[purchases] (stub / Expo Go) pro =", stubProActive);
    return;
  }

  try {
    Purchases.configure({ apiKey: revenueCatApiKey() });
    useReal = true;
    if (__DEV__) console.log("[purchases] RevenueCat configured");
  } catch (e) {
    // Native module present but configure failed (e.g. missing key). Fail open
    // to the free tier — never block the app — and leave `useReal` false.
    if (__DEV__) console.warn("[purchases] configure failed; free tier", e);
    stubProActive = false;
  }
}

// --- Entitlement -----------------------------------------------------------

/**
 * The single Pro entitlement check — the source of truth for `isPro`. Resolves
 * to whether the current user owns Pro. FAILS OPEN: any store/network error
 * resolves to `false` (free tier) rather than throwing, so a flaky store can
 * never block the app.
 */
export async function isProEntitled(): Promise<boolean> {
  try {
    if (useReal && Purchases) {
      return hasProEntitlement(await Purchases.getCustomerInfo());
    }
    return stubProActive;
  } catch (e) {
    if (__DEV__) console.warn("[purchases] entitlement check failed; failing open to free", e);
    return false;
  }
}

/**
 * The localized Pro price for the paywall. Returns the live offering price when
 * the real SDK is active, else the `PRO_PRICE_LABEL` fallback. Fails open.
 */
export async function fetchProPriceLabel(): Promise<string> {
  try {
    if (useReal && Purchases) {
      const offerings = await Purchases.getOfferings();
      const pkg = offerings.current?.availablePackages[0];
      if (pkg) return pkg.product.priceString;
    }
  } catch (e) {
    if (__DEV__) console.warn("[purchases] price fetch failed; using default", e);
  }
  return PRO_PRICE_LABEL;
}

// --- Purchase / restore ----------------------------------------------------

/**
 * Buy the Pro upgrade. Resolves with whether the user owns Pro afterward
 * (`owned: true` on success, `false` if they cancelled or it failed) plus the
 * product id / price for analytics. FAILS OPEN: errors — including a
 * user-cancelled purchase — resolve to `owned: false`, never throwing.
 */
export async function purchasePro(): Promise<PurchaseResult> {
  try {
    if (useReal && Purchases) {
      const offerings = await Purchases.getOfferings();
      const pkg = offerings.current?.availablePackages[0];
      if (!pkg) return { owned: false, productId: PRO_PRODUCT_ID }; // nothing to sell
      const { customerInfo } = await Purchases.purchasePackage(pkg);
      return {
        owned: hasProEntitlement(customerInfo),
        productId: pkg.product.identifier,
        price: pkg.product.price,
      };
    }
    // Stub: pretend the store sheet opens, then grant Pro.
    await delay(STUB_PURCHASE_MS);
    stubProActive = true;
    if (__DEV__) console.log("[purchases] (stub) purchase complete, pro = true");
    return { owned: true, productId: PRO_PRODUCT_ID };
  } catch (e) {
    // A user-cancelled purchase is a normal "no", not an error — both land here
    // and resolve to owned:false (the caller stays on the free tier, never blocked).
    if (__DEV__ && !(e as { userCancelled?: boolean }).userCancelled) {
      console.warn("[purchases] purchase failed; staying on free", e);
    }
    return { owned: false, productId: PRO_PRODUCT_ID };
  }
}

/**
 * Restore a previous Pro purchase (e.g. on a new device or reinstall). Resolves
 * to whether Pro is active after restoring. FAILS OPEN: errors resolve to
 * `false`.
 */
export async function restorePurchases(): Promise<boolean> {
  try {
    if (useReal && Purchases) {
      return hasProEntitlement(await Purchases.restorePurchases());
    }
    await delay(STUB_PURCHASE_MS);
    if (__DEV__) console.log("[purchases] (stub) restore complete, pro =", stubProActive);
    return stubProActive;
  } catch (e) {
    if (__DEV__) console.warn("[purchases] restore failed; staying on free", e);
    return false;
  }
}
