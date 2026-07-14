/**
 * LessonComplete — the celebratory end state after the quiz.
 *
 * Shows the category mascot, what the user earned this run (XP + coins), and the
 * current streak, then a single CTA back to the feed. When the lesson was
 * already completed before (a review pass), no rewards were granted, so we show a
 * lighter "refresher" message instead of an earnings summary.
 *
 * No dedicated design was provided for this state; it reuses the app's tokens,
 * mascot and primary button so it sits naturally alongside the rest. Styled with
 * StyleSheet + theme tokens (className is unreliable on device — project memory).
 */
import { useState } from "react";
import { Image } from "expo-image";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { FeedImage } from "@/components/FeedImage";
import { PrimaryButton } from "@/components/PrimaryButton";
import { images } from "@/constants/images";
import { useCountUp } from "@/hooks/animations";
import { heroMascotForCategory } from "@/lib/feed";
import { colors, fontFamily, radii, spacing, typeScale } from "@/theme";
import type { Lesson } from "@/types/content";

type LessonCompleteProps = {
  lesson: Lesson;
  xpEarned: number;
  coinsEarned: number;
  streak: number;
  /** True when the lesson was already complete (review pass — no rewards). */
  alreadyDone: boolean;
  onClose: () => void;
  /**
   * Free users only: watch a rewarded ad to earn coins. Resolves to the coins
   * earned (0 if no ad showed). Omitted for Pro users — no ads, no button.
   */
  onWatchAd?: () => Promise<number>;
  /** Coins the rewarded ad is expected to grant (button label). */
  rewardCoins?: number;
};

export function LessonComplete({
  lesson,
  xpEarned,
  coinsEarned,
  streak,
  alreadyDone,
  onClose,
  onWatchAd,
  rewardCoins = 0,
}: LessonCompleteProps) {
  const insets = useSafeAreaInsets();

  // Rewarded-ad button state: "loading" while the ad plays, then the one-time
  // claimed amount (button locks after a successful watch).
  const [adLoading, setAdLoading] = useState(false);
  const [claimedCoins, setClaimedCoins] = useState<number | null>(null);
  const [adError, setAdError] = useState<string | null>(null);

  const handleWatchAd = async () => {
    if (!onWatchAd || adLoading || claimedCoins !== null) return;
    setAdLoading(true);
    setAdError(null);
    try {
      const earned = await onWatchAd();
      if (earned > 0) setClaimedCoins(earned);
    } catch {
      // Real AdMob (lib/ads.ts) can reject on show; surface it so the user
      // isn't left tapping a button that silently does nothing.
      setAdError("Couldn't load that ad — tap to try again.");
    } finally {
      setAdLoading(false);
    }
  };

  // Roll the earned totals up from zero on mount, so the reward lands with a
  // little count-up rather than just appearing.
  const xpDisplay = useCountUp(xpEarned, { startFrom: 0 });
  const coinsDisplay = useCountUp(coinsEarned, { startFrom: 0 });

  return (
    <View style={[styles.root, { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 24 }]}>
      <View style={styles.center}>
        <FeedImage
          imageKey={heroMascotForCategory(lesson.category)}
          fallbackSeed={lesson.category}
          style={styles.mascot}
          contentFit="contain"
        />

        <Text style={styles.title}>Lesson complete!</Text>
        <Text style={styles.subtitle}>{lesson.topic}</Text>

        {alreadyDone ? (
          <Text style={styles.refresher}>Nice refresher — you&apos;d already finished this one.</Text>
        ) : (
          <View style={styles.stats}>
            <View style={styles.stat}>
              <Image source={images.boltAmber} style={styles.statIcon} contentFit="contain" />
              <Text style={styles.statValue}>+{xpDisplay}</Text>
              <Text style={styles.statLabel}>XP earned</Text>
            </View>
            <View style={styles.stat}>
              <Image source={images.coinIcon} style={styles.statIcon} contentFit="contain" />
              <Text style={styles.statValue}>+{coinsDisplay}</Text>
              <Text style={styles.statLabel}>Coins</Text>
            </View>
            <View style={styles.stat}>
              <Image source={images.streakFire} style={styles.statIcon} contentFit="contain" />
              <Text style={styles.statValue}>{streak}</Text>
              <Text style={styles.statLabel}>Day streak</Text>
            </View>
          </View>
        )}
      </View>

      <View style={styles.actions}>
        {onWatchAd && (
          <Pressable
            onPress={handleWatchAd}
            disabled={adLoading || claimedCoins !== null}
            accessibilityRole="button"
            accessibilityLabel={`Watch a quick ad for ${rewardCoins} coins`}
            style={({ pressed }) => [
              styles.watchAd,
              pressed && styles.pressed,
              (adLoading || claimedCoins !== null) && styles.watchAdDone,
            ]}
          >
            <Image source={images.playWhite} style={styles.watchAdIcon} contentFit="contain" />
            <Text style={styles.watchAdLabel}>
              {claimedCoins !== null
                ? `+${claimedCoins} coins added`
                : adLoading
                ? "Loading ad…"
                : adError
                ? adError
                : `Watch a quick ad for +${rewardCoins} coins`}
            </Text>
          </Pressable>
        )}

        <PrimaryButton label="Back to learning" onPress={onClose} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.ink,
    paddingHorizontal: spacing.screen,
    justifyContent: "space-between",
  },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  mascot: { width: 160, height: 160, marginBottom: 8 },
  title: {
    color: colors.txt,
    fontFamily: typeScale.h1.family,
    fontSize: typeScale.h1.size,
    lineHeight: typeScale.h1.lineHeight,
    textAlign: "center",
  },
  subtitle: {
    color: colors.txtMuted,
    fontFamily: fontFamily.medium,
    fontSize: typeScale.body.size,
    marginTop: 6,
    textAlign: "center",
  },
  refresher: {
    color: colors.txtSecondary,
    fontFamily: fontFamily.regular,
    fontSize: typeScale.body.size,
    lineHeight: typeScale.body.lineHeight,
    textAlign: "center",
    marginTop: 24,
    paddingHorizontal: 12,
  },

  stats: {
    flexDirection: "row",
    gap: 12,
    marginTop: 32,
    alignSelf: "stretch",
  },
  stat: {
    flex: 1,
    alignItems: "center",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radii.card,
    paddingVertical: 18,
  },
  statIcon: { width: 26, height: 26, marginBottom: 8 },
  statValue: {
    color: colors.txt,
    fontFamily: fontFamily.bold,
    fontSize: typeScale.h3.size,
  },
  statLabel: {
    color: colors.txtMuted,
    fontFamily: fontFamily.regular,
    fontSize: typeScale.caption.size,
    marginTop: 2,
  },

  actions: { gap: 12 },
  watchAd: {
    height: spacing.btnH,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: radii.card,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
  },
  watchAdDone: { opacity: 0.6 },
  pressed: { opacity: 0.8 },
  watchAdIcon: { width: 18, height: 18 },
  watchAdLabel: {
    color: colors.txt,
    fontFamily: fontFamily.semibold,
    fontSize: typeScale.body.size,
  },
});
