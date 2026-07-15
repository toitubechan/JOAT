/**
 * Category detail — `/category/[slug]`.
 *
 * A dedicated page for one category: a hero header (illustration, title,
 * completion progress) with a Start/Continue CTA that jumps to the next
 * unfinished lesson, then the full lesson list grouped under topic subheadings
 * (shown only when a topic actually has several lessons). Opened from the Explore
 * browse list and the Progress topic rows.
 *
 * Coin-locked categories (prompt 21) render a locked state: the CTA and every
 * lesson row open the spend-to-unlock sheet instead of the reader, mirroring the
 * lesson gate. Styled with StyleSheet + theme tokens (className is unreliable on
 * device — project memory); imagery routes through the centralized `images`.
 */
import { useMemo, useState } from "react";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets, type EdgeInsets } from "react-native-safe-area-context";

import { LessonListItem, type LessonStatus } from "@/components/home/LessonListItem";
import { PrimaryButton } from "@/components/PrimaryButton";
import { ProgressBar } from "@/components/ProgressBar";
import { UnlockCategoryModal } from "@/components/UnlockCategoryModal";
import { images } from "@/constants/images";
import { categoryBySlug } from "@/data/categories";
import { getExploreCategories, type FeedItem } from "@/lib/feed";
import { useProgressStore } from "@/store";
import {
  fontFamily,
  radii,
  spacing,
  typeScale,
  useTheme,
  useThemeMode,
  useThemedStyles,
  type ThemeColors,
} from "@/theme";

// Stable empty reference so the `rows` memo below doesn't re-run every render
// while the category is resolving / unknown.
const EMPTY_ITEMS: FeedItem[] = [];

/** A flattened list row: a topic subheading or a lesson. */
type Row = { kind: "heading"; topic: string } | { kind: "lesson"; item: FeedItem };

/** Group consecutive same-topic items (the category list is already topic-sorted). */
function groupByTopic(items: FeedItem[]): { topic: string; items: FeedItem[] }[] {
  const groups: { topic: string; items: FeedItem[] }[] = [];
  for (const item of items) {
    const last = groups[groups.length - 1];
    if (last && last.topic === item.lesson.topic) last.items.push(item);
    else groups.push({ topic: item.lesson.topic, items: [item] });
  }
  return groups;
}

/** Flatten the lessons into rows, interleaving topic headings only when a topic
 *  has multiple lessons (one-per-topic categories stay a clean flat list). */
function buildRows(items: FeedItem[]): Row[] {
  const groups = groupByTopic(items);
  const showHeadings = groups.length < items.length;
  if (!showHeadings) return items.map((item) => ({ kind: "lesson", item }));
  const out: Row[] = [];
  for (const g of groups) {
    out.push({ kind: "heading", topic: g.topic });
    for (const item of g.items) out.push({ kind: "lesson", item });
  }
  return out;
}

export default function CategoryScreen() {
  const c = useTheme();
  const styles = useThemedStyles(makeStyles);
  const barStyle = useThemeMode() === "light" ? "dark" : "light";
  const insets = useSafeAreaInsets();
  const { slug } = useLocalSearchParams<{ slug: string }>();

  const completedLessons = useProgressStore((s) => s.completedLessons);
  const completedCards = useProgressStore((s) => s.completedCards);
  const currentCard = useProgressStore((s) => s.currentCard);
  const isPro = useProgressStore((s) => s.isPro);
  const unlockedIds = useProgressStore((s) => s.unlockedCategoryIds);
  const [unlockOpen, setUnlockOpen] = useState(false);

  const section = useMemo(
    () => getExploreCategories().find((s) => s.slug === slug),
    [slug]
  );
  const category = useMemo(() => categoryBySlug(slug ?? ""), [slug]);
  const items = section?.items ?? EMPTY_ITEMS;
  const rows = useMemo(() => buildRows(items), [items]);

  // Unknown slug / category with no content: a small, escapable empty state.
  if (!section || !category) {
    return <CategoryNotFound insets={insets} />;
  }

  const locked =
    section.coinCost != null && !isPro && !unlockedIds.includes(section.slug);

  const total = items.length;
  const completed = items.filter((i) => completedLessons.includes(i.lesson.id)).length;
  // The lesson the CTA resumes: first unfinished, else the first (review).
  const next = items.find((i) => !completedLessons.includes(i.lesson.id)) ?? items[0];
  const ctaLabel =
    completed === 0 ? "Start learning" : completed >= total ? "Review from start" : "Continue";

  const statusFor = (lessonId: string): LessonStatus => {
    if (completedLessons.includes(lessonId)) return "completed";
    const started =
      currentCard?.lessonId === lessonId ||
      completedCards.some((key) => key.startsWith(`${lessonId}:`));
    return started ? "in-progress" : "not-started";
  };

  // A locked category can't open the reader — every entry opens the unlock sheet.
  const openLesson = (lessonId: string) => {
    if (locked) {
      setUnlockOpen(true);
      return;
    }
    router.push({ pathname: "/lesson/[id]", params: { id: lessonId, card: "0" } });
  };

  const header = (
    <View>
      <View style={styles.topNav}>
        <Pressable
          onPress={() => router.back()}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          style={({ pressed }) => [styles.backBtn, pressed && styles.pressed]}
        >
          <Image source={images.chevronLeft} style={styles.backIcon} contentFit="contain" tintColor={c.txt} />
        </Pressable>
      </View>

      <View style={styles.hero}>
        <View style={[styles.heroTile, { backgroundColor: category.bg }]}>
          <Image source={images[category.icon]} style={styles.heroImage} contentFit="cover" />
        </View>
        <Text style={styles.heroTitle}>{category.title}</Text>
        <Text style={styles.heroMeta}>
          {total} {total === 1 ? "lesson" : "lessons"} · {completed} done
        </Text>
        <ProgressBar
          progress={total > 0 ? completed / total : 0}
          animated
          height={7}
          style={styles.heroBar}
        />

        {locked ? (
          <Pressable
            onPress={() => setUnlockOpen(true)}
            accessibilityRole="button"
            accessibilityLabel={`Unlock ${category.title} for ${section.coinCost} coins`}
            style={({ pressed }) => [styles.unlockBtn, pressed && styles.pressed]}
          >
            <Image source={images.coinIcon} style={styles.unlockCoin} contentFit="contain" />
            <Text style={styles.unlockText}>Unlock · {section.coinCost}</Text>
          </Pressable>
        ) : (
          next && (
            <PrimaryButton
              label={ctaLabel}
              onPress={() => openLesson(next.lesson.id)}
              style={styles.cta}
            />
          )
        )}
      </View>

      <Text style={styles.listLabel}>All lessons</Text>
    </View>
  );

  return (
    <View style={styles.root}>
      <StatusBar style={barStyle} />
      <FlatList
        data={rows}
        keyExtractor={(row) => (row.kind === "heading" ? `h-${row.topic}` : row.item.lesson.id)}
        renderItem={({ item: row }) =>
          row.kind === "heading" ? (
            <Text style={styles.topicHeading}>{row.topic}</Text>
          ) : (
            <View style={styles.lessonRow}>
              <LessonListItem
                item={row.item}
                status={statusFor(row.item.lesson.id)}
                onPress={() => openLesson(row.item.lesson.id)}
              />
            </View>
          )
        }
        ListHeaderComponent={header}
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + 8, paddingBottom: insets.bottom + 24 },
        ]}
        showsVerticalScrollIndicator={false}
        initialNumToRender={8}
        maxToRenderPerBatch={10}
        windowSize={11}
      />

      {/* Spend-to-unlock sheet; on success the store updates and the CTA/rows
          switch to opening the reader on the next render. */}
      <UnlockCategoryModal
        slug={section.slug}
        visible={unlockOpen}
        onClose={() => setUnlockOpen(false)}
      />
    </View>
  );
}

/** Fallback for an unknown slug or a category with no bundled lessons. */
function CategoryNotFound({ insets }: { insets: EdgeInsets }) {
  const styles = useThemedStyles(makeStyles);
  const barStyle = useThemeMode() === "light" ? "dark" : "light";
  return (
    <View style={[styles.root, styles.notFound, { paddingTop: insets.top + 24 }]}>
      <StatusBar style={barStyle} />
      <Text style={styles.notFoundText}>This category isn’t available.</Text>
      <Pressable
        onPress={() => router.back()}
        style={({ pressed }) => [styles.notFoundBtn, pressed && styles.pressed]}
      >
        <Text style={styles.notFoundBtnText}>Go back</Text>
      </Pressable>
    </View>
  );
}

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
  root: { flex: 1, backgroundColor: c.ink },
  content: { paddingHorizontal: spacing.screen },

  topNav: { height: 40, justifyContent: "center", marginBottom: 8 },
  backBtn: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: -6,
  },
  backIcon: { width: 22, height: 22 },

  hero: { alignItems: "center", marginBottom: 8 },
  heroTile: {
    width: 88,
    height: 88,
    borderRadius: radii.hero,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden", // clip the illustration to the rounded tile
    marginBottom: 16,
  },
  heroImage: { width: "100%", height: "100%" },
  heroTitle: {
    color: c.txt,
    fontFamily: fontFamily.bold,
    fontSize: typeScale.h2.size,
    textAlign: "center",
  },
  heroMeta: {
    color: c.txtMuted,
    fontFamily: fontFamily.medium,
    fontSize: typeScale.bodySm.size,
    marginTop: 4,
    marginBottom: 16,
  },
  heroBar: { width: "100%", marginBottom: 18 },
  cta: { width: "100%" },

  unlockBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    width: "100%",
    height: 54,
    borderRadius: radii.card,
    backgroundColor: c.amber,
  },
  unlockCoin: { width: 20, height: 20 },
  unlockText: {
    color: c.txtOnAmber,
    fontFamily: fontFamily.semibold,
    fontSize: typeScale.h4.size,
  },

  listLabel: {
    color: c.txt,
    fontFamily: fontFamily.bold,
    fontSize: typeScale.h3.size,
    marginTop: 28,
    marginBottom: 14,
  },
  topicHeading: {
    color: c.txtSecondary,
    fontFamily: fontFamily.semibold,
    fontSize: typeScale.bodySm.size,
    marginTop: 16,
    marginBottom: 12,
  },
  lessonRow: { marginBottom: 12 },

  notFound: { paddingHorizontal: spacing.screen, alignItems: "center" },
  notFoundText: {
    color: c.txt,
    fontFamily: fontFamily.medium,
    fontSize: typeScale.body.size,
    marginBottom: 20,
  },
  notFoundBtn: {
    borderWidth: 1,
    borderColor: c.line,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: radii.card,
  },
  notFoundBtnText: {
    color: c.txt,
    fontFamily: fontFamily.semibold,
    fontSize: typeScale.body.size,
  },

  pressed: { opacity: 0.85 },
});
