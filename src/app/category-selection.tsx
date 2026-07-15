/**
 * Category selection — "Pick your first category".
 *
 * Two-column grid of categories from the typed catalog (`@/data/topics`). Tapping
 * a free category toggles selection (amber border + check badge); coin-locked
 * categories show a coin badge and aren't selectable yet (unlock = later
 * monetization step). "Start learning" stays disabled until something is picked.
 *
 * Styled with StyleSheet + theme tokens (className is unreliable on device —
 * project memory); icons render through expo-image via the centralized images.
 */
import { useMemo, useState } from "react";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { CategoryCard } from "@/components/CategoryCard";
import { PrimaryButton } from "@/components/PrimaryButton";
import { SearchField } from "@/components/SearchField";
import { UnlockCategoryModal } from "@/components/UnlockCategoryModal";
import { images } from "@/constants/images";
import { trackTopicSelected } from "@/lib/analytics";
import { slugForCategory } from "@/lib/feed";
import { filterByQuery } from "@/lib/search";
import { topics } from "@/data";
import { categories } from "@/data/topics";
import { usePreferencesStore, useProgressStore } from "@/store";
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

const H_PAD = spacing.screen; // 24dp horizontal screen padding
const GAP = 12; // grid gap between cards

export default function CategorySelection() {
  const c = useTheme();
  const styles = useThemedStyles(makeStyles);
  const barStyle = useThemeMode() === "light" ? "dark" : "light";
  const insets = useSafeAreaInsets();
  // Derive card width from the live window width so the two-column grid stays
  // correct across device rotation (a module-level Dimensions read wouldn't).
  const { width } = useWindowDimensions();
  const cardWidth = (width - H_PAD * 2 - GAP) / 2;
  const setSelectedTopics = usePreferencesStore((s) => s.setSelectedTopics);
  // Pro unlocks every category, so coin-locked tiles become selectable.
  const isPro = useProgressStore((s) => s.isPro);
  // Categories the user has unlocked by spending coins (prompt 21). Drives both
  // the tile's locked state and whether a tap toggles vs. opens the unlock flow.
  const unlockedIds = useProgressStore((s) => s.unlockedCategoryIds);
  // The category whose unlock sheet is open, or null when none is.
  const [unlockSlug, setUnlockSlug] = useState<CategorySlug | null>(null);
  // Seed from any previously saved selection (so re-opening this screen to edit
  // shows the current picks); "Start learning" stays disabled until ≥1 is picked.
  const [selected, setSelected] = useState<CategorySlug[]>(
    () => usePreferencesStore.getState().selectedTopics
  );

  // Live search over the grid. Each category is matched on its own title plus its
  // inner topic ("subtopic") titles from the content index (`@/data/index`), so
  // typing "budgeting" surfaces the category that contains it — not just exact
  // category-name hits. The match itself uses the shared `filterByQuery` helper
  // (same logic Explore uses), so the two search surfaces behave identically.
  const [query, setQuery] = useState("");
  const topicTitlesBySlug = useMemo(() => {
    const map = new Map<CategorySlug, string[]>();
    for (const topic of topics) {
      const slug = slugForCategory(topic.title);
      if (slug) map.set(slug, topic.subtopics.map((subtopic) => subtopic.title));
    }
    return map;
  }, []);
  const searching = query.trim().length > 0;
  const visibleCategories = useMemo(
    () =>
      searching
        ? filterByQuery(categories, query, (category) => [
            category.title,
            ...(topicTitlesBySlug.get(category.slug) ?? []),
          ])
        : categories,
    [searching, query, topicTitlesBySlug]
  );

  // Category sort: alphabetical (A–Z), by thematic group, or by lesson count.
  const [sortMode, setSortMode] = useState<"az" | "type" | "lessons">("az");
  const sortedCategories = useMemo(() => {
    const arr = [...visibleCategories];
    arr.sort((a, b) => {
      if (sortMode === "lessons") return b.lessonCount - a.lessonCount || a.title.localeCompare(b.title);
      if (sortMode === "type") return a.group.localeCompare(b.group) || a.title.localeCompare(b.title);
      return a.title.localeCompare(b.title);
    });
    return arr;
  }, [visibleCategories, sortMode]);

  function toggle(slug: CategorySlug) {
    setSelected((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  }

  const hasSelection = selected.length > 0;

  // Commit the selection to the persisted store, then head to home. `replace`
  // (not `back`) so it also works when this screen is the topic gate, where
  // there's no home in the stack to return to.
  function startLearning() {
    trackTopicSelected({ topic_ids: selected, topic_count: selected.length });
    setSelectedTopics(selected);
    router.replace("/");
  }

  return (
    <View style={styles.root}>
      <StatusBar style={barStyle} />

      {/* Top nav: centered title with the back button overlaid at the left */}
      <View style={[styles.topNav, { paddingTop: insets.top + 8 }]}>
        <Text style={styles.title} numberOfLines={1}>
          Pick your first category
        </Text>
        <Pressable
          onPress={() => router.back()}
          hitSlop={12}
          style={[styles.backBtn, { top: insets.top + 5 }]}
        >
          <Image source={images.chevronLeft} style={styles.backIcon} contentFit="contain" tintColor={c.txt} />
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 150 }]}
      >
        {/* Live client-side filter over category + inner topic titles. */}
        <SearchField
          value={query}
          onChangeText={setQuery}
          placeholder="Search categories"
          style={styles.search}
        />

        {/* Section label + sort chips (a result count replaces the label while
            searching, when results are already ranked by relevance). */}
        <View style={styles.sortRow}>
          <Text style={styles.sectionLabel}>
            {searching
              ? `${sortedCategories.length} ${sortedCategories.length === 1 ? "RESULT" : "RESULTS"}`
              : "CATEGORIES"}
          </Text>
          {!searching && (
            <View style={styles.sortChips}>
              <SortChip label="A–Z" active={sortMode === "az"} onPress={() => setSortMode("az")} />
              <SortChip label="Type" active={sortMode === "type"} onPress={() => setSortMode("type")} />
              <SortChip
                label="Lessons"
                active={sortMode === "lessons"}
                onPress={() => setSortMode("lessons")}
              />
            </View>
          )}
        </View>

        <View style={styles.grid}>
          {sortedCategories.map((category) => (
            <CategoryCard
              key={category.slug}
              category={category}
              width={cardWidth}
              selected={selected.includes(category.slug)}
              proUnlocked={isPro || unlockedIds.includes(category.slug)}
              onPress={() => {
                // Free, Pro, or already-unlocked categories toggle; a still-locked
                // tile opens the spend-to-unlock sheet instead.
                const available =
                  category.coinCost == null ||
                  isPro ||
                  unlockedIds.includes(category.slug);
                if (available) toggle(category.slug);
                else setUnlockSlug(category.slug);
              }}
            />
          ))}
        </View>

        {searching && sortedCategories.length === 0 && (
          <Text style={styles.noResults}>No categories match “{query.trim()}”.</Text>
        )}

        {/* Jump to Explore to browse every category with its lessons. */}
        {!searching && (
          <Pressable
            onPress={() => router.push("/explore")}
            style={({ pressed }) => [styles.seeAll, pressed && styles.pressed]}
          >
            <Image source={images.globeIcon} style={styles.globeIcon} contentFit="contain" tintColor={c.txt} />
            <Text style={styles.seeAllText}>Browse all in Explore</Text>
          </Pressable>
        )}
      </ScrollView>

      {/* Sticky CTA over a bottom fade of ink */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        <LinearGradient
          colors={["rgba(15,19,32,0)", c.ink]}
          locations={[0, 0.55]}
          style={styles.footerFade}
        />
        <PrimaryButton
          label="Start learning"
          disabled={!hasSelection}
          onPress={startLearning}
        />
      </View>

      {/* Spend-to-unlock sheet for a coin-locked tile; auto-selects on success. */}
      <UnlockCategoryModal
        slug={unlockSlug}
        visible={unlockSlug != null}
        onClose={() => setUnlockSlug(null)}
        onUnlocked={(slug) => {
          setUnlockSlug(null);
          toggle(slug);
        }}
      />
    </View>
  );
}

/** A small sort toggle chip (amber when active). */
function SortChip({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  const styles = useThemedStyles(makeStyles);
  return (
    <Pressable
      onPress={onPress}
      hitSlop={6}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      accessibilityLabel={`Sort by ${label}`}
      style={({ pressed }) => [styles.sortChip, active && styles.sortChipActive, pressed && styles.pressed]}
    >
      <Text style={[styles.sortChipText, active && styles.sortChipTextActive]}>{label}</Text>
    </Pressable>
  );
}

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
  root: { flex: 1, backgroundColor: c.ink },

  topNav: {
    paddingHorizontal: H_PAD,
    paddingBottom: 12,
  },
  title: {
    textAlign: "center",
    color: c.txt,
    fontFamily: fontFamily.bold,
    fontSize: 20,
    lineHeight: 26,
  },
  backBtn: {
    position: "absolute",
    left: H_PAD,
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  backIcon: { width: 22, height: 22 },

  scroll: { paddingHorizontal: H_PAD },

  // SearchField carries its own box styling; this only spaces it from the nav.
  search: { marginTop: 4 },

  sectionLabel: {
    color: c.txtMuted,
    fontFamily: fontFamily.semibold,
    fontSize: typeScale.caption.size,
    lineHeight: typeScale.caption.lineHeight,
    letterSpacing: 1,
  },
  sortRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 28,
    marginBottom: 14,
  },
  sortChips: { flexDirection: "row", gap: 8 },
  sortChip: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: c.line,
    backgroundColor: c.surface,
  },
  sortChipActive: { backgroundColor: c.amber, borderColor: c.amber },
  sortChipText: {
    color: c.txtMuted,
    fontFamily: fontFamily.semibold,
    fontSize: typeScale.caption.size,
  },
  sortChipTextActive: { color: c.txtOnAmber },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: GAP,
  },

  noResults: {
    color: c.txtMuted,
    fontFamily: fontFamily.regular,
    fontSize: typeScale.body.size,
    marginTop: 8,
  },

  seeAll: {
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: c.surface,
    borderRadius: radii.card,
    marginTop: 16,
  },
  globeIcon: { width: 20, height: 20 },
  seeAllText: {
    color: c.txt,
    fontFamily: fontFamily.medium,
    fontSize: typeScale.h4.size,
  },

  pressed: { opacity: 0.85 },

  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: H_PAD,
    paddingTop: 36,
    pointerEvents: "box-none", // let scroll touches pass through the fade region
  },
  footerFade: {
    position: "absolute",
    left: 0,
    right: 0,
    top: -40,
    bottom: 0,
    pointerEvents: "none",
  },
});
