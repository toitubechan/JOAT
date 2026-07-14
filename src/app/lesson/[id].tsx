/**
 * Full-screen lesson reader — `/lesson/[id]`.
 *
 * Orchestrates the three phases of a lesson:
 *   1. "cards"    — a vertical, full-screen pager of the lesson's `## Card:`s
 *                   (image-optional, "Read more" for long bodies), with a
 *                   segmented progress header and a save/share rail.
 *   2. "quiz"     — the end-of-lesson `## Quiz` round (see QuizRound / design 07).
 *   3. "complete" — a completion summary; the lesson is marked done here.
 *
 * Content is parsed from the bundled markdown (`lib/content.ts`) and gated to the
 * pilot set — a non-pilot id renders an "unavailable" state rather than opening.
 * Rewards (per-card XP, per-correct-answer XP + coins) are first-time only and
 * accumulate into the completion summary; re-reading a finished lesson grants
 * nothing. Progress (cards seen, current spot, streak, completion) flows through
 * the single progress store. Styled with StyleSheet + theme tokens (className is
 * unreliable on device — project memory).
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { Image } from "expo-image";
import { Stack, router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { images } from "@/constants/images";
import { LessonCard } from "@/components/lesson/LessonCard";
import { LessonComplete } from "@/components/lesson/LessonComplete";
import { QuizRound } from "@/components/lesson/QuizRound";
import { UnlockCategoryModal } from "@/components/UnlockCategoryModal";
import { categories } from "@/data/topics";
import { useAds } from "@/hooks/ads";
import {
  trackLessonAbandoned,
  trackLessonCompleted,
  trackLessonStarted,
} from "@/lib/analytics";
import { getLessonById } from "@/lib/content";
import { categoryCoinCost, slugForCategory } from "@/lib/feed";
import { useProgressStore } from "@/store";
import { categoryBySlug } from "@/data/categories";
import { colors, fontFamily, spacing, typeScale, type CategorySlug } from "@/theme";
import type { Card } from "@/types/content";

/** XP granted the first time each content card is viewed (the on-card chip). */
const XP_PER_CARD = 5;

// Card-pager snap thresholds (instead of pagingEnabled's ~50%): a swipe advances
// if it travels past this fraction of the screen OR is flicked past this speed.
const SWIPE_DISTANCE_RATIO = 0.22;
const SWIPE_VELOCITY = 0.4; // points per millisecond

type Phase = "cards" | "quiz" | "complete";

export default function LessonScreen() {
  const params = useLocalSearchParams<{ id: string; card?: string }>();
  const lesson = getLessonById(params.id);

  // Read unlock state up front so the gate below reacts to a coin unlock.
  const isPro = useProgressStore((s) => s.isPro);
  const unlockedIds = useProgressStore((s) => s.unlockedCategoryIds);

  // Non-pilot / unknown id: don't open content that isn't ready.
  if (!lesson) {
    return <LessonUnavailable />;
  }

  // Gate coin-locked categories (prompt 21): a lesson in a locked, not-yet-
  // unlocked category shows a locked state with the unlock sheet rather than
  // opening — a safety net for deep-links / resume past the Explore UI gate.
  // (Free categories — all current content — never trip this.)
  //
  // An unmapped category has no slug and no cost (`categoryCoinCost` returns
  // undefined), so it's treated as free and falls through to the reader.
  const slug = slugForCategory(lesson.category);
  const cost = categoryCoinCost(lesson.category);
  if (slug != null && cost != null && !isPro && !unlockedIds.includes(slug)) {
    return <LessonLocked slug={slug} />;
  }

  return <LessonReader key={lesson.id} lesson={lesson} startCard={Number(params.card) || 0} />;
}

function LessonReader({
  lesson,
  startCard,
}: {
  lesson: NonNullable<ReturnType<typeof getLessonById>>;
  startCard: number;
}) {
  const insets = useSafeAreaInsets();

  // Progress store actions / values.
  const setCurrentCard = useProgressStore((s) => s.setCurrentCard);
  const clearCurrentCard = useProgressStore((s) => s.clearCurrentCard);
  const markCardComplete = useProgressStore((s) => s.markCardComplete);
  const completeLesson = useProgressStore((s) => s.completeLesson);
  const isCardComplete = useProgressStore((s) => s.isCardComplete);
  const addXp = useProgressStore((s) => s.addXp);
  const addCoins = useProgressStore((s) => s.addCoins);
  const bumpStreak = useProgressStore((s) => s.bumpStreak);
  const streak = useProgressStore((s) => s.dailyStreak);

  // Ads (free users only; no-ops for Pro). Preloads on mount.
  const { isPro, showLessonInterstitial, watchRewardedForCoins, rewardCoins } = useAds();

  const lastIndex = Math.max(0, lesson.cards.length - 1);
  const initialIndex = Math.min(Math.max(0, startCard), lastIndex);

  const [phase, setPhase] = useState<Phase>("cards");
  const [index, setIndex] = useState(initialIndex);
  const [pageHeight, setPageHeight] = useState(0);
  const [saved, setSaved] = useState(false);

  const listRef = useRef<FlatList<Card>>(null);
  // Scroll offset when the current drag started, for distance-based snapping.
  const dragStartY = useRef(0);
  // Run total accumulated as rewards are granted (event handlers + the mount
  // effect). Kept in a ref so awarding never re-renders mid-swipe; it's snapshot
  // into `summary` state when the completion screen needs to show it.
  const earned = useRef({ xp: 0, coins: 0 });
  const [summary, setSummary] = useState({ xp: 0, coins: 0 });
  // First-ever completion grants rewards; a review pass does not. Captured once.
  const [rewardsEnabled] = useState(() => !useProgressStore.getState().isLessonComplete(lesson.id));

  // Analytics: when the lesson opened (for duration; set in the mount effect),
  // whether it was completed (so the unmount handler can tell completed from
  // abandoned), and the latest card index reached.
  const startedAt = useRef(0);
  const completedRef = useRef(false);
  const lastIndexRef = useRef(initialIndex);

  /** Grant a reward: bump the store and remember the run total. */
  const award = useCallback(
    (xp: number, coins: number) => {
      earned.current = { xp: earned.current.xp + xp, coins: earned.current.coins + coins };
      if (xp) addXp(xp);
      if (coins) addCoins(coins);
    },
    [addXp, addCoins]
  );

  /** Record that a card became visible: save the spot, complete + reward once. */
  const viewCard = useCallback(
    (i: number) => {
      setCurrentCard(lesson.id, i);
      if (!isCardComplete(lesson.id, i)) {
        if (rewardsEnabled) award(XP_PER_CARD, 0);
        markCardComplete(lesson.id, i);
      }
    },
    [award, isCardComplete, lesson.id, markCardComplete, rewardsEnabled, setCurrentCard]
  );

  // Opening a pilot lesson counts as today's activity; the first card is "seen".
  useEffect(() => {
    const startTime = Date.now();
    startedAt.current = startTime; // also read by finishLesson for duration
    bumpStreak();
    viewCard(initialIndex);
    trackLessonStarted({
      lesson_id: lesson.id,
      topic_id: lesson.topic,
      card_count: lesson.cards.length,
    });
    // On unmount before completion (back nav, switching lessons), record how
    // far the user got. A completed lesson sets `completedRef`, so this no-ops.
    return () => {
      if (completedRef.current) return;
      trackLessonAbandoned({
        lesson_id: lesson.id,
        time_into_lesson_seconds: Math.round((Date.now() - startTime) / 1000),
        last_card_index: lastIndexRef.current,
      });
    };
    // Run once on mount for this lesson.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep the latest card index in a ref for the unmount (abandon) handler.
  useEffect(() => {
    lastIndexRef.current = index;
  }, [index]);

  const close = useCallback(() => {
    if (router.canGoBack()) router.back();
    else router.replace("/");
  }, []);

  // Leaving the completion screen is "between lessons" — the only place an
  // interstitial may show (free users; cap-gated in lib/ads). Preloaded, so it
  // shows instantly or not at all; then we navigate back.
  const closeFromComplete = useCallback(async () => {
    await showLessonInterstitial();
    close();
  }, [showLessonInterstitial, close]);

  const finishLesson = useCallback(() => {
    completeLesson(lesson.id);
    clearCurrentCard();
    setSummary(earned.current);
    setPhase("complete");
    // Mark complete before the screen can unmount, so the abandon handler skips.
    completedRef.current = true;
    trackLessonCompleted({
      lesson_id: lesson.id,
      topic_id: lesson.topic,
      duration_seconds: Math.round((Date.now() - startedAt.current) / 1000),
      xp_earned: earned.current.xp,
      coins_earned: earned.current.coins,
    });
  }, [clearCurrentCard, completeLesson, lesson.id, lesson.topic]);

  const startQuiz = useCallback(() => {
    // No quiz authored — finish straight from the cards.
    if (lesson.quiz.questions.length === 0) {
      finishLesson();
    } else {
      setPhase("quiz");
    }
  }, [finishLesson, lesson.quiz.questions.length]);

  const onMomentumEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (pageHeight <= 0) return;
      const i = Math.round(e.nativeEvent.contentOffset.y / pageHeight);
      if (i !== index) {
        setIndex(i);
        viewCard(i);
      }
    },
    [index, pageHeight, viewCard]
  );

  const onScrollBeginDrag = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
    dragStartY.current = e.nativeEvent.contentOffset.y;
  }, []);

  // Snap by distance/velocity: advance (or go back) if the swipe passed the
  // distance OR velocity threshold, otherwise settle back on the current card.
  const onScrollEndDrag = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (pageHeight <= 0) return;
      const { contentOffset, velocity } = e.nativeEvent;
      const delta = contentOffset.y - dragStartY.current; // + = swiped toward next
      const vy = velocity?.y ?? 0;
      const passed =
        Math.abs(delta) > pageHeight * SWIPE_DISTANCE_RATIO || Math.abs(vy) > SWIPE_VELOCITY;

      let target = index;
      if (passed && delta > 0) target = Math.min(index + 1, lastIndex);
      else if (passed && delta < 0) target = Math.max(index - 1, 0);

      listRef.current?.scrollToIndex({ index: target, animated: true });
      if (target !== index) {
        setIndex(target);
        viewCard(target);
      }
    },
    [index, lastIndex, pageHeight, viewCard]
  );

  /** Bottom chevron: next card, or start the quiz from the last one. */
  const advance = useCallback(() => {
    if (index >= lastIndex) {
      startQuiz();
    } else {
      listRef.current?.scrollToIndex({ index: index + 1, animated: true });
    }
  }, [index, lastIndex, startQuiz]);

  if (phase === "complete") {
    return (
      <>
        <Stack.Screen options={{ animation: "fade" }} />
        <StatusBar style="light" />
        <LessonComplete
          lesson={lesson}
          xpEarned={summary.xp}
          coinsEarned={summary.coins}
          streak={streak}
          alreadyDone={!rewardsEnabled}
          onClose={closeFromComplete}
          onWatchAd={isPro ? undefined : watchRewardedForCoins}
          rewardCoins={rewardCoins}
        />
      </>
    );
  }

  if (phase === "quiz") {
    return (
      <>
        <StatusBar style="light" />
        <QuizRound
          lesson={lesson}
          rewardsEnabled={rewardsEnabled}
          onAward={award}
          onClose={close}
          onComplete={finishLesson}
        />
      </>
    );
  }

  // --- Cards phase ---------------------------------------------------------
  const reservedBottom = 116 + insets.bottom;
  const dotColor = categoryBySlug(slugForCategory(lesson.category) ?? "")?.tint ?? colors.amber;
  const shortCategory = lesson.category.split(" & ")[0];
  const isLast = index >= lastIndex;

  return (
    <View style={styles.root}>
      <Stack.Screen options={{ animation: "slide_from_bottom" }} />
      <StatusBar style="light" />

      {/* Header: category chip · n/N · close, then a segmented progress bar */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <View style={styles.headerRow}>
          <View style={styles.chip}>
            <View style={[styles.chipDot, { backgroundColor: dotColor }]} />
            <Text style={styles.chipText} numberOfLines={1}>
              {shortCategory} · {lesson.topic}
            </Text>
          </View>
          <Text style={styles.count}>
            {index + 1} / {lesson.cards.length}
          </Text>
          <Pressable
            onPress={close}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel="Close lesson"
            style={({ pressed }) => pressed && styles.dim}
          >
            <Image source={images.closeWhite} style={styles.close} contentFit="contain" />
          </Pressable>
        </View>

        <View style={styles.segments}>
          {lesson.cards.map((_, i) => (
            <View key={i} style={[styles.segment, i <= index && styles.segmentOn]} />
          ))}
        </View>
      </View>

      {/* Pager area: measure it, then render full-height card pages into it */}
      <View style={styles.pager} onLayout={(e) => setPageHeight(e.nativeEvent.layout.height)}>
        {pageHeight > 0 && (
          <FlatList
            ref={listRef}
            style={styles.list}
            data={lesson.cards}
            keyExtractor={(_, i) => String(i)}
            renderItem={({ item }) => (
              <LessonCard card={item} pageHeight={pageHeight} reservedBottom={reservedBottom} />
            )}
            showsVerticalScrollIndicator={false}
            decelerationRate="fast"
            initialScrollIndex={initialIndex}
            getItemLayout={(_, i) => ({
              length: pageHeight,
              offset: pageHeight * i,
              index: i,
            })}
            onScrollToIndexFailed={() => {}}
            onScrollBeginDrag={onScrollBeginDrag}
            onScrollEndDrag={onScrollEndDrag}
            onMomentumScrollEnd={onMomentumEnd}
          />
        )}

        {/* Save rail — fixed in the right gutter (taps only on the button) */}
        <View style={styles.rail} pointerEvents="box-none">
          <RailButton
            icon={saved ? "bookmarkFilled" : "bookmark"}
            label="Save"
            onPress={() => setSaved((v) => !v)}
          />
        </View>

        {/* Bottom chrome — mascot, XP chip, swipe-up affordance (fixed) */}
        <View style={[styles.bottom, { paddingBottom: insets.bottom + 14 }]} pointerEvents="box-none">
          <View style={styles.mascot} pointerEvents="none">
            <Image source={images.jackHead} style={styles.mascotIcon} contentFit="contain" />
          </View>

          <View style={styles.bottomCenter} pointerEvents="box-none">
            <Pressable
              onPress={advance}
              hitSlop={12}
              accessibilityRole="button"
              accessibilityLabel={isLast ? "Start the quiz" : "Next card"}
              style={({ pressed }) => [styles.chevron, pressed && styles.dim]}
            >
              <Image source={images.chevronUp} style={styles.chevronIcon} contentFit="contain" />
            </Pressable>
            <Text style={styles.swipeHint} pointerEvents="none">
              {isLast ? "Tap to start the quiz" : "Swipe up for the next card"}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

/** One round glyph button + caption in the save/share rail. */
function RailButton({
  icon,
  label,
  onPress,
}: {
  icon: "bookmark" | "bookmarkFilled";
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={styles.railItem}
    >
      {({ pressed }) => (
        <>
          <View style={[styles.railCircle, pressed && styles.dim]}>
            <Image source={images[icon]} style={styles.railIcon} contentFit="contain" />
          </View>
          <Text style={styles.railLabel}>{label}</Text>
        </>
      )}
    </Pressable>
  );
}

function LessonUnavailable() {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.root, styles.unavailable, { paddingTop: insets.top }]}>
      <StatusBar style="light" />
      <Text style={styles.unavailableText}>This lesson isn&apos;t available yet.</Text>
      <Pressable
        onPress={() => (router.canGoBack() ? router.back() : router.replace("/"))}
        hitSlop={10}
        style={({ pressed }) => pressed && styles.dim}
      >
        <Text style={styles.unavailableLink}>Go back</Text>
      </Pressable>
    </View>
  );
}

/** Locked-category state: a coin-locked lesson reached before unlocking. */
function LessonLocked({ slug }: { slug: CategorySlug }) {
  const insets = useSafeAreaInsets();
  const [showUnlock, setShowUnlock] = useState(false);
  const category = categories.find((c) => c.slug === slug);

  return (
    <View style={[styles.root, styles.unavailable, { paddingTop: insets.top }]}>
      <StatusBar style="light" />
      <Image source={images.treasure} style={styles.lockedImage} contentFit="contain" />
      <Text style={styles.unavailableText}>
        {category?.title ?? "This category"} is locked
      </Text>
      <Text style={styles.lockedSub}>Unlock it with coins to start this lesson.</Text>

      <Pressable
        onPress={() => setShowUnlock(true)}
        hitSlop={10}
        style={({ pressed }) => pressed && styles.dim}
      >
        <Text style={styles.unavailableLink}>Unlock category</Text>
      </Pressable>
      <Pressable
        onPress={() => (router.canGoBack() ? router.back() : router.replace("/"))}
        hitSlop={10}
        style={({ pressed }) => pressed && styles.dim}
      >
        <Text style={styles.lockedBack}>Go back</Text>
      </Pressable>

      {/* On a successful unlock the store updates and LessonScreen re-renders
          past the gate into the reader. */}
      <UnlockCategoryModal
        slug={slug}
        visible={showUnlock}
        onClose={() => setShowUnlock(false)}
      />
    </View>
  );
}

const RAIL_CIRCLE = spacing.railBtn; // 48

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.ink },

  header: { paddingHorizontal: spacing.screen },
  headerRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  chip: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    alignSelf: "flex-start",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  chipDot: { width: 8, height: 8, borderRadius: 4 },
  chipText: {
    flex: 1,
    color: colors.txtSecondary,
    fontFamily: fontFamily.medium,
    fontSize: typeScale.caption.size,
  },
  count: {
    color: colors.txtMuted,
    fontFamily: fontFamily.bold,
    fontSize: typeScale.bodySm.size,
  },
  close: { width: 22, height: 22 },

  segments: { flexDirection: "row", gap: 5, marginTop: 14 },
  segment: { flex: 1, height: 4, borderRadius: 2, backgroundColor: colors.line },
  segmentOn: { backgroundColor: colors.amber },

  pager: { flex: 1 },
  list: { flex: 1 },

  rail: {
    position: "absolute",
    right: 10,
    top: 0,
    bottom: 0,
    justifyContent: "center",
    gap: 22,
  },
  railItem: { alignItems: "center", gap: 6 },
  railCircle: {
    width: RAIL_CIRCLE,
    height: RAIL_CIRCLE,
    borderRadius: RAIL_CIRCLE / 2,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: "center",
    justifyContent: "center",
  },
  railIcon: { width: 20, height: 20 },
  railLabel: {
    color: colors.txtMuted,
    fontFamily: fontFamily.medium,
    fontSize: typeScale.caption.size,
  },

  bottom: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: spacing.screen,
  },
  mascot: {
    position: "absolute",
    left: spacing.screen,
    bottom: 14,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  mascotIcon: { width: 48, height: 48 },
  bottomCenter: { alignItems: "center", gap: 10 },
  chevron: { padding: 2 },
  chevronIcon: { width: 22, height: 22 },
  swipeHint: {
    color: colors.txtMuted,
    fontFamily: fontFamily.regular,
    fontSize: typeScale.bodySm.size,
  },

  dim: { opacity: 0.6 },

  unavailable: { alignItems: "center", justifyContent: "center", gap: 16 },
  unavailableText: {
    color: colors.txt,
    fontFamily: fontFamily.semibold,
    fontSize: typeScale.h4.size,
    textAlign: "center",
    paddingHorizontal: spacing.screen,
  },
  unavailableLink: {
    color: colors.amber,
    fontFamily: fontFamily.semibold,
    fontSize: typeScale.body.size,
  },
  lockedImage: { width: 96, height: 96, marginBottom: 4 },
  lockedSub: {
    color: colors.txtMuted,
    fontFamily: fontFamily.regular,
    fontSize: typeScale.bodySm.size,
    textAlign: "center",
    marginTop: -8,
    paddingHorizontal: spacing.screen,
  },
  lockedBack: {
    color: colors.txtMuted,
    fontFamily: fontFamily.medium,
    fontSize: typeScale.bodySm.size,
  },
});
