/**
 * Explore — the discovery surface (Explore tab).
 *
 * Helps users find content beyond their selected topics. Everything is driven by
 * the parsed content (`lib/content.ts`) via `lib/feed.ts` — no hardcoded prose:
 *   - a live search/filter over category, topic and lesson titles
 *     (`lib/search.ts`, shared with category-selection — prompt 22),
 *   - a "Featured" and a "Recently added" horizontal row,
 *   - "Browse by category": every category that has content, all its lessons.
 * Each entry opens the lesson reader (`lesson/[id]`). Lesson visuals route through
 * FeedImage (blur placeholder + deterministic fallback) so partially-wired
 * content never shows a blank card during the content ramp.
 *
 * Coin-locked categories surface a cost badge that opens the spend-to-unlock
 * sheet (`UnlockCategoryModal`, prompt 21); their lessons stay gated until
 * unlocked. Styled with StyleSheet + theme tokens (className is unreliable on
 * device — project memory).
 */
import { useCallback, useMemo, useState } from "react";
import { Image } from "expo-image";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ExploreCard } from "@/components/explore/ExploreCard";
import { LessonListItem, type LessonStatus } from "@/components/home/LessonListItem";
import { SearchField } from "@/components/SearchField";
import { UnlockCategoryModal } from "@/components/UnlockCategoryModal";
import { images } from "@/constants/images";
import {
  getExploreCategories,
  getExploreLessons,
  getFeaturedLessons,
  getRecentLessons,
  type ExploreCategory,
  type FeedItem,
} from "@/lib/feed";
import { filterByQuery } from "@/lib/search";
import { useProgressStore } from "@/store";
import {
  fontFamily,
  radii,
  spacing,
  typeScale,
  useTheme,
  useThemeMode,
  useThemedStyles,
  type CategorySlug,
  type ThemeColors,
} from "@/theme";

/** An Explore list row is either a search result (a lesson) or a category group. */
type ExploreRow = FeedItem | ExploreCategory;

function isCategory(row: ExploreRow): row is ExploreCategory {
  return "items" in row;
}

export default function ExploreScreen() {
  const styles = useThemedStyles(makeStyles);
  const barStyle = useThemeMode() === "light" ? "dark" : "light";
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState("");

  // Static, content-derived data (parsed once, memoized for the screen's life).
  const featured = useMemo(() => getFeaturedLessons(), []);
  const recent = useMemo(() => getRecentLessons(), []);
  const sections = useMemo(() => getExploreCategories(), []);
  const allLessons = useMemo(() => getExploreLessons(), []);

  // A separate, lightweight filter for the browse list — narrows which category
  // blocks show (by category name, plus the topics inside them). Independent of
  // the top lesson search above; reuses the shared `filterByQuery` helper.
  const [categoryQuery, setCategoryQuery] = useState("");
  const categoryTrimmed = categoryQuery.trim();
  const categorySearching = categoryTrimmed.length > 0;
  const visibleSections = useMemo(
    () =>
      categorySearching
        ? filterByQuery(sections, categoryTrimmed, (s) => [
            s.title,
            ...s.items.map((i) => i.lesson.topic),
            ...s.items.map((i) => i.lesson.subtitle),
          ])
        : sections,
    [categorySearching, categoryTrimmed, sections]
  );

  // Completion state for each row's status indicator (same rule as Home).
  const completedLessons = useProgressStore((s) => s.completedLessons);
  const completedCards = useProgressStore((s) => s.completedCards);
  const currentCard = useProgressStore((s) => s.currentCard);
  const isPro = useProgressStore((s) => s.isPro);
  const unlockedIds = useProgressStore((s) => s.unlockedCategoryIds);

  // The category whose unlock sheet is open, or null when none is.
  const [unlockSlug, setUnlockSlug] = useState<CategorySlug | null>(null);

  // Slugs still coin-locked (have a cost, not Pro, not unlocked). Drives gating
  // on both the category blocks and any locked lessons in search results.
  const lockedSlugs = useMemo(
    () =>
      new Set(
        sections
          .filter((s) => s.coinCost != null && !isPro && !unlockedIds.includes(s.slug))
          .map((s) => s.slug)
      ),
    [sections, isPro, unlockedIds]
  );

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

  const openLesson = useCallback((lessonId: string) => {
    router.push({ pathname: "/lesson/[id]", params: { id: lessonId, card: "0" } });
  }, []);

  const openCategory = useCallback((slug: CategorySlug) => {
    router.push({ pathname: "/category/[slug]", params: { slug } });
  }, []);

  const trimmed = query.trim();
  const searching = trimmed.length > 0;

  // Search across category, topic, subtitle and the frontmatter category.
  const results = useMemo(
    () =>
      searching
        ? filterByQuery(allLessons, trimmed, (item) => [
            item.categoryLabel,
            item.lesson.topic,
            item.lesson.subtitle,
            item.lesson.category,
          ])
        : [],
    [searching, trimmed, allLessons]
  );

  const data: ExploreRow[] = searching ? results : visibleSections;

  const renderItem = useCallback(
    ({ item }: { item: ExploreRow }) => {
      if (isCategory(item)) {
        return (
          <CategoryBlock
            section={item}
            locked={lockedSlugs.has(item.slug)}
            onOpen={openCategory}
            onRequestUnlock={setUnlockSlug}
          />
        );
      }
      // A locked lesson in search results opens the unlock sheet instead.
      const locked = lockedSlugs.has(item.slug);
      return (
        <LessonListItem
          item={item}
          status={statusFor(item.lesson.id)}
          onPress={() => (locked ? setUnlockSlug(item.slug) : openLesson(item.lesson.id))}
        />
      );
    },
    [lockedSlugs, statusFor, openLesson, openCategory]
  );

  const header = (
    <View>
      <Text style={styles.title}>Explore</Text>
      <Text style={styles.subtitle}>Browse every topic — search or scroll</Text>

      <SearchField
        value={query}
        onChangeText={setQuery}
        placeholder="Search topics & lessons"
        style={styles.search}
      />

      {searching ? (
        <Text style={styles.resultsCount}>
          {results.length} {results.length === 1 ? "result" : "results"}
        </Text>
      ) : (
        <>
          <HorizontalRow title="Featured" items={featured} onOpen={openLesson} />
          <HorizontalRow title="Recently added" items={recent} onOpen={openLesson} />
          {sections.length > 0 && (
            <>
              <Text style={styles.browseTitle}>Browse by category</Text>
              <SearchField
                value={categoryQuery}
                onChangeText={setCategoryQuery}
                placeholder="Search categories"
                style={styles.categorySearch}
              />
            </>
          )}
        </>
      )}
    </View>
  );

  return (
    <View style={styles.root}>
      <StatusBar style={barStyle} />
      <FlatList
        data={data}
        keyExtractor={(item) => (isCategory(item) ? `cat-${item.slug}` : item.lesson.id)}
        renderItem={renderItem}
        ListHeaderComponent={header}
        ItemSeparatorComponent={searching ? ResultSeparator : SectionSeparator}
        ListEmptyComponent={
          <Text style={styles.empty}>
            {searching
              ? `No lessons match “${trimmed}”.`
              : categorySearching
                ? `No categories match “${categoryTrimmed}”.`
                : "More lessons are on the way."}
          </Text>
        }
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + 8, paddingBottom: insets.bottom + 24 },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        initialNumToRender={6}
        maxToRenderPerBatch={8}
        windowSize={11}
      />

      {/* Spend-to-unlock sheet; on success the store updates and the gated
          lessons become openable on the next render. */}
      <UnlockCategoryModal
        slug={unlockSlug}
        visible={unlockSlug != null}
        onClose={() => setUnlockSlug(null)}
      />
    </View>
  );
}

/** A horizontal "Featured" / "Recently added" row. Hidden when it has no items. */
function HorizontalRow({
  title,
  items,
  onOpen,
}: {
  title: string;
  items: FeedItem[];
  onOpen: (lessonId: string) => void;
}) {
  const styles = useThemedStyles(makeStyles);
  if (items.length === 0) return null;
  return (
    <View style={styles.row}>
      <Text style={styles.rowTitle}>{title}</Text>
      <FlatList
        horizontal
        data={items}
        keyExtractor={(item) => item.lesson.id}
        renderItem={({ item }) => (
          <ExploreCard item={item} onPress={() => onOpen(item.lesson.id)} />
        )}
        showsHorizontalScrollIndicator={false}
        style={styles.hList}
        contentContainerStyle={styles.hContent}
        ItemSeparatorComponent={HSeparator}
      />
    </View>
  );
}

/**
 * One "browse by category" row: a tappable header (icon, title, lesson count,
 * lock badge) that opens the category's detail page (`/category/[slug]`), where
 * its full lesson list lives. Keeps the browse list a short, scannable directory
 * no matter how much content a category holds.
 */
function CategoryBlock({
  section,
  locked,
  onOpen,
  onRequestUnlock,
}: {
  section: ExploreCategory;
  /** Coin-locked and not yet unlocked (computed by the screen from the store). */
  locked: boolean;
  onOpen: (slug: CategorySlug) => void;
  onRequestUnlock: (slug: CategorySlug) => void;
}) {
  const c = useTheme();
  const styles = useThemedStyles(makeStyles);
  return (
    <Pressable
      onPress={() => onOpen(section.slug)}
      accessibilityRole="button"
      accessibilityLabel={`${section.title}, ${section.items.length} lessons`}
      style={({ pressed }) => [styles.sectionHead, pressed && styles.sectionHeadPressed]}
    >
      <View style={[styles.sectionTile, { backgroundColor: section.bg }]}>
        <Image source={images[section.icon]} style={styles.sectionIcon} contentFit="contain" />
      </View>
      <View style={styles.sectionMeta}>
        <Text style={styles.sectionTitle} numberOfLines={1}>
          {section.title}
        </Text>
        <Text style={styles.sectionCount}>
          {section.items.length} {section.items.length === 1 ? "lesson" : "lessons"}
        </Text>
      </View>
      {locked && section.coinCost != null && (
        <Pressable
          onPress={() => onRequestUnlock(section.slug)}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel={`Unlock ${section.title} for ${section.coinCost} coins`}
          style={({ pressed }) => [styles.coinBadge, pressed && styles.coinBadgePressed]}
        >
          <Image source={images.coinIcon} style={styles.coinIcon} contentFit="contain" />
          <Text style={styles.coinText}>{section.coinCost}</Text>
        </Pressable>
      )}
      {/* Left-chevron asset rotated to point right — opens the category page. */}
      <Image
        source={images.chevronLeft}
        style={styles.sectionChevron}
        contentFit="contain"
        tintColor={c.txtMuted}
      />
    </Pressable>
  );
}

function ResultSeparator() {
  const styles = useThemedStyles(makeStyles);
  return <View style={styles.resultSeparator} />;
}
function SectionSeparator() {
  const styles = useThemedStyles(makeStyles);
  return <View style={styles.sectionSeparator} />;
}
function HSeparator() {
  const styles = useThemedStyles(makeStyles);
  return <View style={styles.hSeparator} />;
}

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
  root: { flex: 1, backgroundColor: c.ink },
  content: { paddingHorizontal: spacing.screen },

  title: {
    color: c.txt,
    fontFamily: fontFamily.bold,
    fontSize: typeScale.h2.size,
  },
  subtitle: {
    color: c.txtMuted,
    fontFamily: fontFamily.regular,
    fontSize: typeScale.bodySm.size,
    marginTop: 2,
  },
  search: { marginTop: 16 },

  resultsCount: {
    color: c.txtMuted,
    fontFamily: fontFamily.medium,
    fontSize: typeScale.bodySm.size,
    marginTop: 16,
    marginBottom: 14,
  },

  // Horizontal rows bleed past the screen padding, so the cards reach the edge.
  row: { marginTop: 24 },
  rowTitle: {
    color: c.txt,
    fontFamily: fontFamily.bold,
    fontSize: 20,
    lineHeight: 26,
    marginBottom: 14,
  },
  hList: { marginHorizontal: -spacing.screen },
  hContent: { paddingHorizontal: spacing.screen },
  hSeparator: { width: 12 },

  browseTitle: {
    color: c.txt,
    fontFamily: fontFamily.bold,
    fontSize: 20,
    lineHeight: 26,
    marginTop: 28,
    marginBottom: 14,
  },
  categorySearch: { marginBottom: 4 },

  sectionHead: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 10,
  },
  sectionHeadPressed: { opacity: 0.7 },
  sectionChevron: {
    width: 16,
    height: 16,
    transform: [{ rotate: "180deg" }],
    opacity: 0.4,
  },
  sectionTile: {
    width: spacing.iconTile,
    height: spacing.iconTile,
    borderRadius: radii.tile,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionIcon: { width: 22, height: 22 },
  sectionMeta: { flex: 1 },
  sectionTitle: {
    color: c.txt,
    fontFamily: fontFamily.semibold,
    fontSize: typeScale.h4.size,
  },
  sectionCount: {
    color: c.txtMuted,
    fontFamily: fontFamily.regular,
    fontSize: typeScale.bodySm.size,
    marginTop: 1,
  },
  coinBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: c.line,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  coinBadgePressed: { opacity: 0.7 },
  coinIcon: { width: 14, height: 14 },
  coinText: {
    color: c.coin,
    fontFamily: fontFamily.semibold,
    fontSize: 12,
  },
  resultSeparator: { height: 12 },
  sectionSeparator: { height: 8 },

  empty: {
    color: c.txtMuted,
    fontFamily: fontFamily.regular,
    fontSize: typeScale.body.size,
    textAlign: "center",
    marginTop: 28,
  },
});
