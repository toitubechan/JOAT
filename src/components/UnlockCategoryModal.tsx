/**
 * UnlockCategoryModal — the spend-to-unlock confirmation for a coin-locked
 * category (the coin sink, prompt 21).
 *
 * Shows the category, its coin cost, and the user's current balance, then:
 *   - enough coins  -> "Unlock" deducts via `unlockCategory` (the store's single
 *                      spend path, which reuses the negative-amount guard) and
 *                      reports success back to the caller.
 *   - short on coins -> offers the rewarded-ad earn flow (free users) and
 *                      re-checks live as coins land, so the Unlock button appears
 *                      the moment the balance covers the cost.
 *
 * Everything reads from the single progress store, so the balance and unlocked
 * state reflect immediately. Driven by a category `slug`; all display data comes
 * from the catalog (`data/topics`) + tokens. Modal is an Android style-exception
 * component, so it's styled with StyleSheet + theme tokens; imagery routes
 * through the centralized images.
 */
import { useState } from "react";
import { Image } from "expo-image";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

import { PrimaryButton } from "@/components/PrimaryButton";
import { images } from "@/constants/images";
import { categories } from "@/data/topics";
import { useAds } from "@/hooks/ads";
import { useProgressStore } from "@/store";
import {
  categoryColors,
  fontFamily,
  radii,
  spacing,
  typeScale,
  useTheme,
  useThemedStyles,
  type CategorySlug,
  type ThemeColors,
} from "@/theme";

type UnlockCategoryModalProps = {
  /** Category to unlock; null when nothing is targeted (modal stays hidden). */
  slug: CategorySlug | null;
  visible: boolean;
  onClose: () => void;
  /** Called after a successful unlock (e.g. to auto-select the category). */
  onUnlocked?: (slug: CategorySlug) => void;
};

export function UnlockCategoryModal({
  slug,
  visible,
  onClose,
  onUnlocked,
}: UnlockCategoryModalProps) {
  const coins = useProgressStore((s) => s.coins);
  const unlockCategory = useProgressStore((s) => s.unlockCategory);

  // Rewarded-ad earn flow (free users only; no-ops for Pro). `isPro` here also
  // hides the ad button — a Pro user would never reach a locked category anyway.
  const { isPro, watchRewardedForCoins, rewardCoins } = useAds();
  const [watching, setWatching] = useState(false);
  const styles = useThemedStyles(makeStyles);
  const theme = useTheme();

  const category = slug ? categories.find((c) => c.slug === slug) : undefined;
  const cost = category?.coinCost ?? 0;

  // Defensive: nothing to unlock (free / unmapped category) — render nothing.
  if (!slug || !category || cost <= 0) {
    return <Modal visible={false} transparent onRequestClose={onClose} />;
  }

  const color = categoryColors[slug];
  const enough = coins >= cost;
  const shortfall = Math.max(0, cost - coins);

  function handleUnlock() {
    if (!slug) return;
    if (unlockCategory(slug, cost)) {
      onUnlocked?.(slug);
      onClose();
    }
  }

  async function handleWatchAd() {
    if (watching) return;
    setWatching(true);
    try {
      // Coins are credited into the store on the verified reward, so the balance
      // (and the enough/short state above) updates on its own when this resolves.
      await watchRewardedForCoins("category_unlock");
    } finally {
      setWatching(false);
    }
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        {/* Stop taps inside the card from dismissing the modal. */}
        <Pressable style={styles.card} onPress={() => {}}>
          {/* Close (X) */}
          <Pressable
            onPress={onClose}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel="Close"
            style={({ pressed }) => [styles.close, pressed && styles.pressed]}
          >
            <Image source={images.closeWhite} style={styles.closeIcon} contentFit="contain" tintColor={theme.txt} />
          </Pressable>

          <View style={[styles.tile, { backgroundColor: color.bg }]}>
            <Image source={images[category.icon]} style={styles.tileIcon} contentFit="contain" />
          </View>

          <Text style={styles.title}>{category.title}</Text>
          <Text style={styles.subtitle}>Unlock this category to start learning.</Text>

          {/* Cost vs. balance */}
          <View style={styles.costRow}>
            <View style={styles.costChip}>
              <Image source={images.coinIcon} style={styles.coinIcon} contentFit="contain" />
              <Text style={styles.costText}>{cost}</Text>
            </View>
            <Text style={styles.balance}>You have {coins}</Text>
          </View>

          {enough ? (
            <PrimaryButton
              label={`Unlock for ${cost} coins`}
              onPress={handleUnlock}
              style={styles.cta}
            />
          ) : (
            <>
              <Text style={styles.shortfall}>
                You need {shortfall} more {shortfall === 1 ? "coin" : "coins"}.
              </Text>
              {!isPro && (
                <Pressable
                  onPress={handleWatchAd}
                  disabled={watching}
                  accessibilityRole="button"
                  accessibilityLabel={`Watch a quick ad for ${rewardCoins} coins`}
                  style={({ pressed }) => [
                    styles.watchAd,
                    pressed && styles.pressed,
                    watching && styles.watchAdBusy,
                  ]}
                >
                  <Image source={images.playWhite} style={styles.watchIcon} contentFit="contain" tintColor={theme.txt} />
                  <Text style={styles.watchLabel}>
                    {watching ? "Loading ad…" : `Watch a quick ad for +${rewardCoins} coins`}
                  </Text>
                </Pressable>
              )}
            </>
          )}

          <Pressable
            onPress={onClose}
            hitSlop={8}
            style={({ pressed }) => [styles.later, pressed && styles.pressed]}
          >
            <Text style={styles.laterText}>Maybe later</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(8,11,20,0.82)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.screen,
  },
  card: {
    width: "100%",
    maxWidth: 380,
    backgroundColor: c.surface,
    borderWidth: 1,
    borderColor: c.line,
    borderRadius: radii.hero,
    padding: 24,
    alignItems: "center",
    elevation: 8,
  },
  close: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  closeIcon: { width: 18, height: 18 },
  pressed: { opacity: 0.7 },

  tile: {
    width: 64,
    height: 64,
    borderRadius: radii.card,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  tileIcon: { width: 34, height: 34 },

  title: {
    color: c.txt,
    fontFamily: fontFamily.bold,
    fontSize: typeScale.h3.size,
    textAlign: "center",
    marginTop: 16,
  },
  subtitle: {
    color: c.txtSecondary,
    fontFamily: fontFamily.regular,
    fontSize: typeScale.bodySm.size,
    lineHeight: typeScale.bodySm.lineHeight,
    textAlign: "center",
    marginTop: 6,
  },

  costRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 20,
    marginBottom: 4,
  },
  costChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: c.coinBg,
    borderWidth: 1,
    borderColor: c.coinBorder,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  coinIcon: { width: 18, height: 18 },
  costText: {
    color: c.coin,
    fontFamily: fontFamily.bold,
    fontSize: typeScale.h4.size,
  },
  balance: {
    color: c.txtMuted,
    fontFamily: fontFamily.medium,
    fontSize: typeScale.bodySm.size,
  },

  cta: { width: "100%", marginTop: 18 },

  shortfall: {
    color: c.txtSecondary,
    fontFamily: fontFamily.medium,
    fontSize: typeScale.body.size,
    textAlign: "center",
    marginTop: 14,
  },
  watchAd: {
    width: "100%",
    height: spacing.btnH,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: radii.card,
    backgroundColor: c.surfaceRaised,
    borderWidth: 1,
    borderColor: c.line,
    marginTop: 14,
  },
  watchAdBusy: { opacity: 0.6 },
  watchIcon: { width: 18, height: 18 },
  watchLabel: {
    color: c.txt,
    fontFamily: fontFamily.semibold,
    fontSize: typeScale.body.size,
  },

  later: { marginTop: 16, paddingVertical: 6 },
  laterText: {
    color: c.txtMuted,
    fontFamily: fontFamily.medium,
    fontSize: typeScale.bodySm.size,
  },
});
