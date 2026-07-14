/**
 * Progress — the gamification dashboard (Progress tab).
 *
 * Reads everything from the single progress store: level + XP (via the XP→level
 * curve), the daily streak and coin balance (the reusable header pills), how
 * many lessons/cards are done, and a per-topic completion breakdown. No mockup
 * was provided, so it follows the design system and reuses the feed's visual
 * language (surface cards, amber accents, the streak/coin pills, the XP bar).
 *
 * Styled with StyleSheet + theme tokens (className is unreliable on device —
 * project memory); imagery routes through the centralized `images`.
 */
import { useMemo } from "react";
import { Image } from "expo-image";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ProgressBar } from "@/components/ProgressBar";
import { CoinBalance } from "@/components/stats/CoinBalance";
import { StreakBadge } from "@/components/stats/StreakBadge";
import { XPBar } from "@/components/stats/XPBar";
import { images } from "@/constants/images";
import { isPilotLesson } from "@/lib/content";
import { getContentTotals, getTopicBreakdown, type TopicProgress } from "@/lib/stats";
import { useProgressStore } from "@/store";
import { colors, fontFamily, radii, spacing, typeScale } from "@/theme";

// Static totals from the bundled pilot content — same for every user.
const TOTALS = getContentTotals();

export default function ProgressScreen() {
  const insets = useSafeAreaInsets();

  const xp = useProgressStore((s) => s.xp);
  const completedLessons = useProgressStore((s) => s.completedLessons);
  const completedCards = useProgressStore((s) => s.completedCards);

  const lessonsDone = useMemo(
    () => completedLessons.filter(isPilotLesson).length,
    [completedLessons]
  );
  const breakdown = useMemo(() => getTopicBreakdown(completedLessons), [completedLessons]);

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + 8, paddingBottom: insets.bottom + 24 },
        ]}
      >
        {/* Header: title + the reusable streak / coins pills */}
        <View style={styles.header}>
          <Text style={styles.title}>Your progress</Text>
          <View style={styles.pills}>
            <StreakBadge />
            <CoinBalance />
          </View>
        </View>

        {/* Level + XP toward the next level */}
        <View style={styles.levelCard}>
          <Text style={styles.cardLabel}>Level progress</Text>
          <XPBar style={styles.xpBar} />
        </View>

        {/* Completion tiles */}
        <View style={styles.tiles}>
          <StatTile
            icon="checkWhite"
            value={lessonsDone}
            total={TOTALS.lessons}
            label="Lessons done"
          />
          <StatTile
            icon="bookmark"
            value={completedCards.length}
            total={TOTALS.cards}
            label="Cards read"
          />
          <StatTile icon="boltAmber" value={xp} label="Total XP" />
        </View>

        {/* Per-topic completion */}
        <Text style={styles.sectionTitle}>Topics</Text>
        {breakdown.length === 0 ? (
          <Text style={styles.empty}>
            Finish a lesson to start tracking your topics.
          </Text>
        ) : (
          <View style={styles.topics}>
            {breakdown.map((topic) => (
              <TopicRow key={topic.slug} topic={topic} />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

/** One completion stat: icon, a value (optionally "/ total"), and a label. */
function StatTile({
  icon,
  value,
  total,
  label,
}: {
  icon: "checkWhite" | "boltAmber" | "bookmark";
  value: number;
  total?: number;
  label: string;
}) {
  return (
    <View style={styles.tile}>
      <Image source={images[icon]} style={styles.tileIcon} contentFit="contain" />
      <Text style={styles.tileValue}>
        {value}
        {total !== undefined && <Text style={styles.tileTotal}> / {total}</Text>}
      </Text>
      <Text style={styles.tileLabel}>{label}</Text>
    </View>
  );
}

/** One topic's completion row: icon tile, title, count, and a progress bar.
 *  Tapping opens the next unfinished lesson in that category (else the first). */
function TopicRow({ topic }: { topic: TopicProgress }) {
  const fraction = topic.total > 0 ? topic.completed / topic.total : 0;
  return (
    <Pressable
      onPress={() =>
        router.push({ pathname: "/lesson/[id]", params: { id: topic.nextLessonId, card: "0" } })
      }
      accessibilityRole="button"
      accessibilityLabel={`${topic.title}, ${topic.completed} of ${topic.total} done. Continue this category.`}
      style={({ pressed }) => [styles.topicRow, pressed && styles.topicRowPressed]}
    >
      <View style={[styles.topicIconTile, { backgroundColor: topic.bg }]}>
        <Image source={images[topic.icon]} style={styles.topicIcon} contentFit="cover" />
      </View>
      <View style={styles.topicBody}>
        <View style={styles.topicTitleRow}>
          <Text style={styles.topicTitle} numberOfLines={1}>
            {topic.title}
          </Text>
          <Text style={styles.topicCount}>
            {topic.completed} / {topic.total}
          </Text>
        </View>
        <ProgressBar progress={fraction} animated height={7} style={styles.topicBar} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.ink },
  content: { paddingHorizontal: spacing.screen },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  title: {
    color: colors.txt,
    fontFamily: fontFamily.bold,
    fontSize: typeScale.h2.size,
  },
  pills: { flexDirection: "row", alignItems: "center", gap: 8 },

  levelCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radii.hero,
    padding: 18,
    elevation: 2,
  },
  cardLabel: {
    color: colors.txtSecondary,
    fontFamily: fontFamily.medium,
    fontSize: typeScale.bodySm.size,
    marginBottom: 14,
  },
  xpBar: { marginTop: 0 },

  tiles: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
  },
  tile: {
    flex: 1,
    alignItems: "center",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radii.card,
    paddingVertical: 18,
  },
  tileIcon: { width: 24, height: 24, marginBottom: 8 },
  tileValue: {
    color: colors.txt,
    fontFamily: fontFamily.bold,
    fontSize: typeScale.h3.size,
  },
  tileTotal: {
    color: colors.txtMuted,
    fontFamily: fontFamily.medium,
    fontSize: typeScale.bodySm.size,
  },
  tileLabel: {
    color: colors.txtMuted,
    fontFamily: fontFamily.regular,
    fontSize: typeScale.caption.size,
    marginTop: 2,
  },

  sectionTitle: {
    color: colors.txt,
    fontFamily: fontFamily.bold,
    fontSize: typeScale.h3.size,
    marginTop: 28,
    marginBottom: 14,
  },
  empty: {
    color: colors.txtMuted,
    fontFamily: fontFamily.regular,
    fontSize: typeScale.body.size,
  },

  topics: { gap: 12 },
  topicRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radii.card,
    padding: 14,
  },
  topicRowPressed: { opacity: 0.85 },
  topicIconTile: {
    width: spacing.iconTile,
    height: spacing.iconTile,
    borderRadius: radii.tile,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden", // clip the hero visual to the rounded tile
  },
  topicIcon: { width: "100%", height: "100%" },
  topicBody: { flex: 1 },
  topicTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  topicTitle: {
    flex: 1,
    color: colors.txt,
    fontFamily: fontFamily.semibold,
    fontSize: typeScale.h4.size,
    paddingRight: 12,
  },
  topicCount: {
    color: colors.txtMuted,
    fontFamily: fontFamily.bold,
    fontSize: typeScale.bodySm.size,
  },
  topicBar: {},
});
