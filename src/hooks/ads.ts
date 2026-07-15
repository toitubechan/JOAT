/**
 * useAds — the screen-facing wiring around the stubbed AdMob API (`lib/ads.ts`).
 *
 * Keeps the two pieces of policy that need app state out of `lib/ads.ts` (which
 * stays store-agnostic): the Pro gate (Pro users see no ads) and crediting
 * rewarded coins into the progress store. Screens call these instead of the raw
 * ad functions so the rules live in one place.
 */
import { useCallback, useEffect } from "react";

import {
  REWARDED_COIN_REWARD,
  gatherAdsConsent,
  loadInterstitial,
  loadRewarded,
  showInterstitial,
  showRewarded,
} from "@/lib/ads";
import { trackAdWatched } from "@/lib/analytics";
import { useProgressStore } from "@/store";

export function useAds() {
  const isPro = useProgressStore((s) => s.isPro);
  const addCoins = useProgressStore((s) => s.addCoins);

  // Gather GDPR/UMP consent (EEA) first, then preload both formats so the first
  // show is instant (never block UI to load). lib/ads re-preloads after each show.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      await gatherAdsConsent();
      if (cancelled) return;
      loadInterstitial();
      loadRewarded();
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  /**
   * Show the between-lessons interstitial. No-op for Pro users; for free users
   * the frequency cap (in lib/ads) decides whether an ad actually shows.
   */
  const showLessonInterstitial = useCallback(async (): Promise<void> => {
    if (isPro) return;
    await showInterstitial();
  }, [isPro]);

  /**
   * Watch a rewarded ad to earn coins. Coins are credited ONLY on the verified
   * reward callback, straight into the progress store (the single source of
   * truth). The `ad_watched` event also fires there — on the verified reward,
   * never on ad open. Resolves to the coins earned, or 0 if no ad showed / Pro.
   */
  const watchRewardedForCoins = useCallback(
    async (placement = "lesson_complete"): Promise<number> => {
      if (isPro) return 0;
      let earned = 0;
      await showRewarded((reward) => {
        earned = reward.amount;
        addCoins(reward.amount);
        trackAdWatched({ placement, coins_granted: reward.amount });
      });
      return earned;
    },
    [isPro, addCoins]
  );

  return {
    isPro,
    showLessonInterstitial,
    watchRewardedForCoins,
    rewardCoins: REWARDED_COIN_REWARD,
  };
}
