/**
 * Purchases wiring — the store-facing layer around the stubbed RevenueCat API
 * (`lib/purchases.ts`).
 *
 * `lib/purchases.ts` stays store-agnostic (a pure RevenueCat wrapper); this
 * module is where the single Pro entitlement gets mirrored into the progress
 * store so the whole app can read `isPro` synchronously (ad-gating, locked
 * content). Same split as lib/ads ↔ hooks/ads.
 */
import { useCallback, useState } from "react";

import { trackProPurchased } from "@/lib/analytics";
import {
  configurePurchases,
  isProEntitled,
  purchasePro,
  restorePurchases,
} from "@/lib/purchases";
import { useProgressStore } from "@/store";

/**
 * Run once on app launch (from the root layout): configure the SDK, then sync
 * the store's `isPro` from the entitlement check. FAILS OPEN — `isProEntitled`
 * never throws, so a flaky store leaves the user on the free tier, never blocked.
 *
 * The persisted `isPro` is passed as the stub's seed so a Pro bought in a
 * previous session survives the reload (see `configurePurchases`); in production
 * the seed is ignored and RevenueCat is the source of truth.
 */
export async function initPurchases(): Promise<void> {
  const { isPro, setPro } = useProgressStore.getState();
  await configurePurchases(isPro);
  setPro(await isProEntitled());
}

/**
 * Paywall-facing actions. Each one runs the purchase/restore through the store
 * gateway and mirrors the result into the progress store (the single source of
 * truth the rest of the app reads). `pending` drives the button spinner.
 */
export function usePurchases() {
  const isPro = useProgressStore((s) => s.isPro);
  const setPro = useProgressStore((s) => s.setPro);
  const [pending, setPending] = useState(false);

  /** Buy Pro. Resolves true if the user owns Pro afterward. */
  const buyPro = useCallback(async (): Promise<boolean> => {
    setPending(true);
    try {
      const { owned, productId, price } = await purchasePro();
      if (owned) {
        setPro(true);
        trackProPurchased({ product_id: productId, price });
      }
      return owned;
    } finally {
      setPending(false);
    }
  }, [setPro]);

  /** Restore a previous purchase. Mirrors the restored entitlement into the store. */
  const restore = useCallback(async (): Promise<boolean> => {
    setPending(true);
    try {
      const owned = await restorePurchases();
      setPro(owned);
      return owned;
    } finally {
      setPending(false);
    }
  }, [setPro]);

  return { isPro, pending, buyPro, restore };
}
