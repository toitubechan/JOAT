/**
 * Profile (Profile tab) — matches design 09.
 *
 * The player's identity + wallet + coin Shop: a mascot header, a stats card
 * (Coins / XP / Day streak + level progress), and the Shop where coins are spent:
 *   - Streak freeze (bridges one missed day, consumed on launch).
 *   - Random lesson — a discounted "surprise" that spends coins, unlocks the
 *     lesson's category if it's coin-locked, and opens it.
 *   - Unlock Joat Pro (opens the paywall) + Manage subscription.
 *
 * Account + settings live on the Settings tab. Styled with StyleSheet + theme
 * tokens (className is unreliable on device — project memory).
 */
import { useEffect, useState } from "react";
import { useUser } from "@clerk/expo";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ProgressBar } from "@/components/ProgressBar";
import { images, type ImageKey } from "@/constants/images";
import { categoryBySlug } from "@/data/categories";
import { getExploreLessons } from "@/lib/feed";
import { useProgressStore } from "@/store";
import { levelInfo } from "@/store/progress";
import {
  fontFamily,
  radii,
  spacing,
  typeScale,
  useTheme,
  useThemedStyles,
  type ThemeColors,
} from "@/theme";

/** Shop prices (coins). */
const FREEZE_COST = 50;
const RANDOM_LESSON_COST = 80;

/** Group thousands with commas (Hermes-safe, no Intl dependency). */
const fmt = (n: number) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

export default function ProfileScreen() {
  const c = useTheme();
  const styles = useThemedStyles(makeStyles);
  const { user } = useUser();
  const name = user?.firstName ?? "Learner";

  const coins = useProgressStore((s) => s.coins);
  const xp = useProgressStore((s) => s.xp);
  const dailyStreak = useProgressStore((s) => s.dailyStreak);
  const streakFreezes = useProgressStore((s) => s.streakFreezes);
  const isPro = useProgressStore((s) => s.isPro);
  const unlockedIds = useProgressStore((s) => s.unlockedCategoryIds);
  const completedLessons = useProgressStore((s) => s.completedLessons);
  const buyStreakFreeze = useProgressStore((s) => s.buyStreakFreeze);
  const unlockCategory = useProgressStore((s) => s.unlockCategory);
  const spendCoins = useProgressStore((s) => s.spendCoins);

  const { level, xpIntoLevel, xpForLevel } = levelInfo(xp);
  const xpToNext = Math.max(0, xpForLevel - xpIntoLevel);

  // Brief inline confirmation for shop actions (auto-clears).
  const [flash, setFlash] = useState<string | null>(null);
  useEffect(() => {
    if (!flash) return;
    const t = setTimeout(() => setFlash(null), 2500);
    return () => clearTimeout(t);
  }, [flash]);

  const buyFreeze = () =>
    setFlash(buyStreakFreeze(FREEZE_COST) ? "Streak freeze added" : "Not enough coins");

  // Spend coins on a random unfinished lesson, unlocking its (coin-locked)
  // category if needed, then open it — the "surprise lesson".
  const buyRandomLesson = () => {
    if (coins < RANDOM_LESSON_COST) {
      setFlash("Not enough coins");
      return;
    }
    const candidates = getExploreLessons().filter(
      (it) => !completedLessons.includes(it.lesson.id)
    );
    if (candidates.length === 0) {
      setFlash("You've done every lesson!");
      return;
    }
    const pick = candidates[Math.floor(Math.random() * candidates.length)];
    const cat = categoryBySlug(pick.slug);
    const locked = cat?.coinCost != null && !isPro && !unlockedIds.includes(pick.slug);
    const ok = locked
      ? unlockCategory(pick.slug, RANDOM_LESSON_COST)
      : spendCoins(RANDOM_LESSON_COST);
    if (!ok) {
      setFlash("Not enough coins");
      return;
    }
    router.push({ pathname: "/lesson/[id]", params: { id: pick.lesson.id, card: "0" } });
  };

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Profile</Text>

        {/* Identity */}
        <View style={styles.identity}>
          <Image source={images.mascotWelcome} style={styles.mascot} contentFit="contain" />
          <View style={styles.identityText}>
            <Text style={styles.name} numberOfLines={1}>
              {name}
            </Text>
            <Text style={styles.tagline}>Curious generalist</Text>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsCard}>
          <View style={styles.statsRow}>
            <Stat icon="coinIcon" value={fmt(coins)} label="Coins" />
            <View style={styles.vDivider} />
            <Stat icon="boltAmber" value={fmt(xp)} label="XP" />
            <View style={styles.vDivider} />
            <Stat icon="streakFire" value={String(dailyStreak)} label="Day streak" />
          </View>
          <View style={styles.hDivider} />
          <View style={styles.levelHead}>
            <Text style={styles.levelTitle}>Level {level}</Text>
          </View>
          <Text style={styles.levelSub}>
            {xpToNext} XP to Level {level + 1}
          </Text>
          <ProgressBar
            progress={xpForLevel > 0 ? xpIntoLevel / xpForLevel : 0}
            animated
            height={8}
            style={styles.levelBar}
          />
        </View>

        {/* Shop */}
        <Text style={styles.sectionTitle}>Shop</Text>

        {flash && (
          <View style={styles.flash}>
            <Text style={styles.flashText}>{flash}</Text>
          </View>
        )}

        <ShopRow
          icon="shieldSnow"
          title="Streak freeze"
          subtitle="Protect a missed day"
          ownedLabel={`${streakFreezes} owned`}
          cost={FREEZE_COST}
          onPress={buyFreeze}
        />

        <ShopRow
          icon="treasure"
          title="Random lesson"
          subtitle="Unlock a surprise lesson"
          cost={RANDOM_LESSON_COST}
          onPress={buyRandomLesson}
        />

        {/* Unlock Pro */}
        <LinearGradient
          colors={[c.amber, c.amberDeep]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.proCard}
        >
          <View style={styles.proTop}>
            <View style={styles.proBadge}>
              <Image source={images.crownAmber} style={styles.proBadgeIcon} contentFit="contain" />
            </View>
            <View style={styles.proTopText}>
              <Text style={styles.proTitle}>{isPro ? "Joat Pro — active" : "Unlock Joat Pro"}</Text>
              <Text style={styles.proSubtitle}>Every lesson · No ads · Bonus rewards</Text>
            </View>
          </View>
          <Pressable
            onPress={() => router.push("/paywall")}
            style={({ pressed }) => [styles.proBtn, pressed && styles.pressed]}
          >
            <Image source={images.boltAmber} style={styles.proBtnBolt} contentFit="contain" />
            <Text style={styles.proBtnText}>{isPro ? "Manage plan" : "View plans"}</Text>
          </Pressable>
        </LinearGradient>

        <Pressable onPress={() => router.push("/paywall")} style={styles.manageWrap}>
          <Text style={styles.manageLink}>Manage subscription</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

/** One stat column in the stats card: icon, value, label. */
function Stat({ icon, value, label }: { icon: ImageKey; value: string; label: string }) {
  const styles = useThemedStyles(makeStyles);
  return (
    <View style={styles.stat}>
      <Image source={images[icon]} style={styles.statIcon} contentFit="contain" />
      <Text style={styles.statValue} numberOfLines={1} adjustsFontSizeToFit>
        {value}
      </Text>
      <Text style={styles.statLabel} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

/**
 * One Shop row: colored icon tile, title + subtitle (+ optional "owned" pill),
 * and an amber coin-price button.
 */
function ShopRow({
  icon,
  title,
  subtitle,
  ownedLabel,
  cost,
  onPress,
}: {
  icon: ImageKey;
  title: string;
  subtitle: string;
  ownedLabel?: string;
  cost: number;
  onPress: () => void;
}) {
  const styles = useThemedStyles(makeStyles);
  return (
    <View style={styles.shopRow}>
      <View style={styles.shopTile}>
        <Image source={images[icon]} style={styles.shopTileIcon} contentFit="contain" />
      </View>
      <View style={styles.shopBody}>
        <Text style={styles.shopTitle} numberOfLines={1}>
          {title}
        </Text>
        <Text style={styles.shopSubtitle} numberOfLines={2}>
          {subtitle}
        </Text>
        {ownedLabel ? (
          <View style={styles.ownedPill}>
            <Text style={styles.ownedText}>{ownedLabel}</Text>
          </View>
        ) : null}
      </View>
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={`${title}, ${cost} coins`}
        style={({ pressed }) => [styles.priceBtn, pressed && styles.pressed]}
      >
        <Image source={images.coinIcon} style={styles.priceCoin} contentFit="contain" />
        <Text style={styles.priceText}>{cost}</Text>
      </Pressable>
    </View>
  );
}

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
  screen: { flex: 1, backgroundColor: c.ink, paddingHorizontal: spacing.screen },
  content: { paddingBottom: 40 },
  title: {
    color: c.txt,
    fontFamily: fontFamily.bold,
    fontSize: typeScale.h1.size,
    marginTop: 8,
  },

  // Identity header.
  identity: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginTop: 12,
    marginBottom: 20,
  },
  mascot: { width: 68, height: 68 },
  identityText: { flex: 1 },
  name: {
    color: c.txt,
    fontFamily: fontFamily.bold,
    fontSize: typeScale.h2.size,
  },
  tagline: {
    color: c.txtMuted,
    fontFamily: fontFamily.regular,
    fontSize: typeScale.body.size,
    marginTop: 2,
  },

  // Stats card.
  statsCard: {
    backgroundColor: c.surface,
    borderWidth: 1,
    borderColor: c.line,
    borderRadius: radii.hero,
    padding: 18,
    elevation: 2,
  },
  statsRow: { flexDirection: "row", alignItems: "center" },
  stat: { flex: 1, alignItems: "center", paddingHorizontal: 4 },
  statIcon: { width: 26, height: 26, marginBottom: 8 },
  statValue: {
    color: c.txt,
    fontFamily: fontFamily.bold,
    fontSize: 26,
    lineHeight: 31,
  },
  statLabel: {
    color: c.txtMuted,
    fontFamily: fontFamily.regular,
    fontSize: typeScale.bodySm.size,
    marginTop: 2,
  },
  vDivider: { width: 1, height: 44, backgroundColor: c.line },
  hDivider: { height: 1, backgroundColor: c.line, marginVertical: 16 },
  levelHead: { flexDirection: "row", justifyContent: "space-between" },
  levelTitle: {
    color: c.txt,
    fontFamily: fontFamily.bold,
    fontSize: typeScale.h4.size,
  },
  levelSub: {
    color: c.txtMuted,
    fontFamily: fontFamily.regular,
    fontSize: typeScale.bodySm.size,
    marginTop: 2,
    marginBottom: 12,
  },
  levelBar: {},

  sectionTitle: {
    color: c.txt,
    fontFamily: fontFamily.bold,
    fontSize: typeScale.h2.size,
    marginTop: 28,
    marginBottom: 16,
  },

  flash: {
    marginBottom: 14,
    backgroundColor: c.successBg,
    borderWidth: 1,
    borderColor: c.successBorder,
    borderRadius: radii.card,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  flashText: {
    color: c.successText,
    fontFamily: fontFamily.medium,
    fontSize: typeScale.bodySm.size,
    textAlign: "center",
  },

  // Shop rows.
  shopRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: c.surface,
    borderWidth: 1,
    borderColor: c.line,
    borderRadius: radii.hero,
    padding: 14,
    marginBottom: 14,
  },
  shopTile: {
    width: 52,
    height: 52,
    borderRadius: radii.tile,
    backgroundColor: c.tealBg,
    alignItems: "center",
    justifyContent: "center",
  },
  shopTileIcon: { width: 30, height: 30 },
  shopBody: { flex: 1 },
  shopTitle: {
    color: c.txt,
    fontFamily: fontFamily.bold,
    fontSize: typeScale.h4.size,
  },
  shopSubtitle: {
    color: c.txtMuted,
    fontFamily: fontFamily.regular,
    fontSize: typeScale.bodySm.size,
    marginTop: 2,
  },
  ownedPill: {
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: c.tealBorder,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 3,
    marginTop: 8,
  },
  ownedText: {
    color: c.tealText,
    fontFamily: fontFamily.semibold,
    fontSize: typeScale.caption.size,
  },
  priceBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    minWidth: 58,
    height: 44,
    paddingHorizontal: 14,
    borderRadius: radii.card,
    backgroundColor: c.amber,
    justifyContent: "center",
  },
  priceCoin: { width: 18, height: 18 },
  priceText: {
    color: c.txtOnAmber,
    fontFamily: fontFamily.bold,
    fontSize: typeScale.h4.size,
  },

  // Unlock Pro card.
  proCard: {
    borderRadius: radii.hero,
    padding: 18,
    marginTop: 4,
  },
  proTop: { flexDirection: "row", alignItems: "center", gap: 14 },
  proBadge: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: c.ink,
    alignItems: "center",
    justifyContent: "center",
  },
  proBadgeIcon: { width: 28, height: 28 },
  proTopText: { flex: 1 },
  proTitle: {
    color: c.txtOnAmber,
    fontFamily: fontFamily.bold,
    fontSize: typeScale.h3.size,
  },
  proSubtitle: {
    color: "#5A3F04", // dark amber-brown, readable on the amber card
    fontFamily: fontFamily.medium,
    fontSize: typeScale.bodySm.size,
    marginTop: 3,
  },
  proBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: c.ink,
    borderRadius: radii.card,
    height: 52,
    marginTop: 16,
  },
  proBtnBolt: { width: 18, height: 18 },
  proBtnText: {
    color: c.txt,
    fontFamily: fontFamily.bold,
    fontSize: typeScale.h4.size,
  },

  manageWrap: { alignItems: "center", marginTop: 16 },
  manageLink: {
    color: c.amber,
    fontFamily: fontFamily.semibold,
    fontSize: typeScale.body.size,
  },

  pressed: { opacity: 0.85 },
});
