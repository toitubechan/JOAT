/**
 * Home — the visual-first, card-based scroll feed.
 *
 * One `FlatList` (recycled/virtualized) renders the whole screen so it scrolls
 * as a single smooth feed: the progress header, daily-goal card, "Continue
 * learning" hero, and the "Today's picks" section title ride in the list header;
 * each pick is a `LessonListItem` row.
 *
 * Data: lessons parsed from markdown (`lib/content.ts`), filtered to the user's
 * selected topics (`store/preferences.ts`) by `lib/feed.ts`. Progress (coins,
 * today's XP, streak, completion) and the resume point come from the progress
 * store. The greeting reads the signed-in user from Clerk.
 *
 * Styled with StyleSheet + theme tokens (className is unreliable on device —
 * project memory); all imagery routes through the centralized `images`.
 */
import { useCallback, useMemo } from "react";
import { useUser } from "@clerk/expo";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ContinueCard } from "@/components/home/ContinueCard";
import { DailyGoalCard } from "@/components/home/DailyGoalCard";
import { LessonListItem, type LessonStatus } from "@/components/home/LessonListItem";
import { StatPill } from "@/components/home/StatPill";
import { CoinBalance } from "@/components/stats/CoinBalance";
import { StreakBadge } from "@/components/stats/StreakBadge";
import {
  getAllPilotFeedItems,
  getFeedLessons,
  heroMascotForCategory,
  resolveContinueLesson,
  type FeedItem,
} from "@/lib/feed";
import { usePreferencesStore, useProgressStore } from "@/store";
import { DAILY_GOAL_XP, selectTodayXp } from "@/store/progress";
import {
  fontFamily,
  radii,
  spacing,
  typeScale,
  useThemeMode,
  useThemedStyles,
  type ThemeColors,
} from "@/theme";

const WEEKDAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

/** Greeting name from Clerk, with graceful fallbacks. */
function useFirstName(): string {
  const { user } = useUser();
  return (
    user?.firstName ||
    user?.username ||
    user?.primaryEmailAddress?.emailAddress?.split("@")[0] ||
    "there"
  );
}

export default function HomeScreen() {
  const styles = useThemedStyles(makeStyles);
  const barStyle = useThemeMode() === "light" ? "dark" : "light";
  const insets = useSafeAreaInsets();
  const firstName = useFirstName();

  // Header stats + resume point, straight from the progress store. (Coins and
  // streak read themselves inside CoinBalance / StreakBadge.)
  const todayXp = useProgressStore(selectTodayXp);
  const currentCard = useProgressStore((s) => s.currentCard);
  const completedLessons = useProgressStore((s) => s.completedLessons);
  const completedCards = useProgressStore((s) => s.completedCards);

  // The feed: lessons filtered to the user's chosen categories. If those topics
  // have no pilot content yet (e.g. only "coming soon" categories were picked),
  // fall back to every available pilot lesson so the feed is never blank.
  const selectedTopics = usePreferencesStore((s) => s.selectedTopics);
  const { feed, usingFallback } = useMemo(() => {
    const selectedFeed = getFeedLessons(selectedTopics);
    return selectedFeed.length > 0
      ? { feed: selectedFeed, usingFallback: false }
      : { feed: getAllPilotFeedItems(), usingFallback: true };
  }, [selectedTopics]);

  // Where "Continue learning" should resume (saved spot, else the first pick).
  const resume = useMemo(
    () => resolveContinueLesson(currentCard, feed),
    [currentCard, feed]
  );

  // Today's weekday for the greeting subtitle ("Wednesday hustle"). Indexed from
  // a constant list rather than `toLocaleDateString({ weekday })`, which isn't
  // reliable on Hermes (no full Intl) on Android.
  const weekday = WEEKDAYS[new Date().getDay()];

  // Open the full-screen lesson reader at a given card. The reader itself saves
  // the user's spot as they swipe, so we only pass the starting card.
  const openLesson = useCallback((lessonId: string, cardIndex = 0) => {
    router.push({ pathname: "/lesson/[id]", params: { id: lessonId, card: String(cardIndex) } });
  }, []);

  // Let the user broaden/fix their chosen categories (also the fallback's CTA).
  const openTopics = useCallback(() => {
    router.push("/category-selection");
  }, []);

  // Open the announcements panel (typed static list — no backend/push in v1).
  const openNotifications = useCallback(() => {
    router.push("/notifications");
  }, []);

  // Lesson status for the row indicator: done > started (current spot or any
  // card seen) > not started.
  const statusFor = useCallback(
    (lessonId: string): LessonStatus => {
      if (completedLessons.includes(lessonId)) return "completed";
      const started =
        currentCard?.lessonId === lessonId ||
        completedCards.some((key) => key.startsWith(`${lessonId}:`));
      return started ? "in-progress" : "not-started";
    },
    [completedLessons, completedCards, currentCard]
  );

  const renderItem = useCallback(
    ({ item }: { item: FeedItem }) => (
      <LessonListItem
        item={item}
        status={statusFor(item.lesson.id)}
        onPress={() => openLesson(item.lesson.id, 0)}
      />
    ),
    [statusFor, openLesson]
  );

  const header = (
    <View>
      {/* Progress header: greeting + streak / coins / bell */}
      <View style={styles.headerRow}>
        <View style={styles.greetingCol}>
          <Text style={styles.greeting} numberOfLines={1}>
            Hey, {firstName}!
          </Text>
          <Text style={styles.greetingSub}>{weekday} hustle</Text>
        </View>
        <View style={styles.pills}>
          <StreakBadge />
          <CoinBalance />
          <StatPill
            icon="bellWhite"
            accessibilityLabel="Notifications"
            onPress={openNotifications}
          />
        </View>
      </View>

      <DailyGoalCard current={todayXp} goal={DAILY_GOAL_XP} style={styles.goal} />

      {resume && (
        <ContinueCard
          kicker="CONTINUE LEARNING"
          title={resume.lesson.category}
          subtitle={`${resume.lesson.topic} · Card ${resume.cardIndex + 1} of ${resume.lesson.cards.length}`}
          mascot={heroMascotForCategory(resume.lesson.category)}
          onPress={() => openLesson(resume.lesson.id, resume.cardIndex)}
          style={styles.continue}
        />
      )}

      {usingFallback && (
        <Pressable
          onPress={openTopics}
          accessibilityRole="button"
          accessibilityLabel="Update your topics"
          style={({ pressed }) => [styles.notice, pressed && styles.noticePressed]}
        >
          <Text style={styles.noticeTitle}>Your topics don&apos;t have lessons yet</Text>
          <Text style={styles.noticeText}>
            Showing what&apos;s available. Tap to update your topics.
          </Text>
        </Pressable>
      )}

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          {usingFallback ? "Available lessons" : "Today's picks"}
        </Text>
        {/* Shortcut to broaden the chosen categories. */}
        <Pressable
          onPress={openTopics}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Update your topics"
        >
          {({ pressed }) => (
            <Text style={[styles.viewAll, pressed && styles.viewAllPressed]}>Topics</Text>
          )}
        </Pressable>
      </View>
    </View>
  );

  return (
    <View style={styles.root}>
      <StatusBar style={barStyle} />
      <FlatList
        data={feed}
        keyExtractor={(item) => item.lesson.id}
        renderItem={renderItem}
        ListHeaderComponent={header}
        ListEmptyComponent={
          <Text style={styles.empty}>
            No lessons for your topics yet — more are on the way.
          </Text>
        }
        ItemSeparatorComponent={Separator}
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + 8, paddingBottom: insets.bottom + 24 },
        ]}
        showsVerticalScrollIndicator={false}
        initialNumToRender={6}
        maxToRenderPerBatch={8}
        windowSize={11}
      />
    </View>
  );
}

function Separator() {
  const styles = useThemedStyles(makeStyles);
  return <View style={styles.separator} />;
}

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
  root: { flex: 1, backgroundColor: c.ink },
  content: { paddingHorizontal: spacing.screen },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  greetingCol: { flex: 1, paddingRight: 8 },
  greeting: {
    color: c.txt,
    fontFamily: fontFamily.bold,
    fontSize: 20,
    lineHeight: 26,
  },
  greetingSub: {
    color: c.txtMuted,
    fontFamily: fontFamily.regular,
    fontSize: typeScale.bodySm.size,
    marginTop: 2,
  },
  pills: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  goal: { marginTop: 18 },
  continue: { marginTop: 16 },

  notice: {
    marginTop: 18,
    padding: 16,
    borderRadius: radii.card,
    backgroundColor: c.surface,
    borderWidth: 1,
    borderColor: c.line,
  },
  noticePressed: { opacity: 0.85 },
  noticeTitle: {
    color: c.txt,
    fontFamily: fontFamily.semibold,
    fontSize: typeScale.h4.size,
  },
  noticeText: {
    color: c.txtMuted,
    fontFamily: fontFamily.regular,
    fontSize: typeScale.bodySm.size,
    marginTop: 3,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 26,
    marginBottom: 14,
  },
  sectionTitle: {
    color: c.txt,
    fontFamily: fontFamily.bold,
    fontSize: 22,
    lineHeight: 28,
  },
  viewAll: {
    color: c.amber,
    fontFamily: fontFamily.semibold,
    fontSize: typeScale.bodySm.size,
  },
  viewAllPressed: { opacity: 0.6 },

  separator: { height: 12 },
  empty: {
    color: c.txtMuted,
    fontFamily: fontFamily.regular,
    fontSize: typeScale.body.size,
    textAlign: "center",
    marginTop: 24,
  },
});
