/**
 * Home-feed helpers: turn the parsed lessons (`lib/content.ts`) into the
 * display-ready "Today's picks" items, filtered by the user's selected topics.
 *
 * Lessons live under two top-level `category` strings in frontmatter; the rest
 * of the app keys categories by `CategorySlug` (the selection result in
 * `store/preferences.ts`). This module bridges the two and attaches the per-card
 * display data (label, icon, tile colors, XP reward) so the screen stays dumb.
 */
import { categoryBySlug, slugForLabel } from "@/data/categories";
import { categories } from "@/data/topics";
import { getLessonById, getPilotLessons } from "@/lib/content";
import type { CategorySlug } from "@/theme";
import type { ImageKey } from "@/constants/images";
import type { Lesson } from "@/types/content";

/** One "Today's picks" row: a lesson plus everything needed to render it. */
export type FeedItem = {
  lesson: Lesson;
  slug: CategorySlug;
  /** Short category label for the meta line, e.g. "Mindfulness". */
  categoryLabel: string;
  /** Category icon for the leading tile. */
  icon: ImageKey;
  /** Icon tint + tile background (category colors). */
  tint: string;
  bg: string;
  /** XP awarded for completing the lesson. */
  xp: number;
};

/** Label / icon / colors for a category slug (reuses the selection catalog). */
function metaForSlug(slug: CategorySlug) {
  const cat = categoryBySlug(slug);
  return {
    label: cat?.title ?? slug,
    icon: (cat?.icon ?? "walletIcon") as ImageKey,
    tint: cat?.tint ?? "#FFB020",
    bg: cat?.bg ?? "#1B2234",
  };
}

/** XP reward for a lesson: ~5 XP per minute, floored at the design's 20. */
export function xpForLesson(lesson: Lesson): number {
  return Math.max(20, lesson.estimatedMinutes * 5);
}

function toFeedItem(lesson: Lesson, slug: CategorySlug): FeedItem {
  const meta = metaForSlug(slug);
  return {
    lesson,
    slug,
    categoryLabel: meta.label,
    icon: meta.icon,
    tint: meta.tint,
    bg: meta.bg,
    xp: xpForLesson(lesson),
  };
}

/**
 * The feed: one representative lesson per topic (keeps the list a clean run of
 * distinct topics instead of repeating "Banking & Accounts" seven times),
 * filtered to the user's selected categories and ordered by that selection.
 *
 * Draws from the pilot lessons only (`getPilotLessons`), so non-pilot content
 * never reaches the Learn UI even though the parser can load it.
 */
export function getFeedLessons(selected: CategorySlug[]): FeedItem[] {
  if (selected.length === 0) return [];
  const selectedSet = new Set(selected);

  // Pick the lowest-`order` lesson in each topic as its representative.
  const byTopic = new Map<string, { lesson: Lesson; slug: CategorySlug }>();
  for (const lesson of getPilotLessons()) {
    const slug = slugForLabel(lesson.category);
    if (!slug || !selectedSet.has(slug)) continue;
    const existing = byTopic.get(lesson.topic);
    if (!existing || lesson.order < existing.lesson.order) {
      byTopic.set(lesson.topic, { lesson, slug });
    }
  }

  const items = [...byTopic.values()].map(({ lesson, slug }) => toFeedItem(lesson, slug));
  // Group by the order the user picked their categories, then by lesson order.
  items.sort(
    (a, b) =>
      selected.indexOf(a.slug) - selected.indexOf(b.slug) ||
      a.lesson.order - b.lesson.order ||
      a.lesson.topic.localeCompare(b.lesson.topic)
  );
  return items;
}

/**
 * Every available pilot lesson as feed items (one representative per topic),
 * ignoring the user's selection. Used as the Home fallback when the chosen
 * categories have no pilot content yet, so the feed never goes blank. Ordered by
 * the category catalog, then lesson order — reusing `getFeedLessons`.
 */
export function getAllPilotFeedItems(): FeedItem[] {
  const present = new Set<CategorySlug>();
  for (const lesson of getPilotLessons()) {
    const slug = slugForLabel(lesson.category);
    if (slug) present.add(slug);
  }
  const slugs = categories.map((c) => c.slug).filter((s) => present.has(s));
  return getFeedLessons(slugs);
}

/**
 * The lesson the "Continue learning" hero should resume: the user's saved spot
 * if it still resolves, otherwise the first pick's first card for a fresh user.
 */
export function resolveContinueLesson(
  currentCard: { lessonId: string; cardIndex: number } | null,
  feed: FeedItem[]
): { lesson: Lesson; cardIndex: number } | null {
  if (currentCard) {
    const lesson = getLessonById(currentCard.lessonId);
    if (lesson) {
      const lastIndex = Math.max(0, lesson.cards.length - 1);
      return { lesson, cardIndex: Math.min(currentCard.cardIndex, lastIndex) };
    }
  }
  if (feed.length > 0) return { lesson: feed[0].lesson, cardIndex: 0 };
  return null;
}

/** Mascot image key for a frontmatter category (falls back to the money cat). */
export function heroMascotForCategory(category: string): ImageKey {
  const slug = slugForLabel(category);
  return (slug && categoryBySlug(slug)?.icon) || "catMoneyHero";
}

/** Map a frontmatter `category` to its `CategorySlug` (undefined if unmapped). */
export function slugForCategory(category: string): CategorySlug | undefined {
  return slugForLabel(category);
}

/**
 * Coin cost to unlock a lesson's category, or undefined when the category is
 * free (or unmapped). Lets the lesson reader gate access to coin-locked
 * categories (prompt 21) without duplicating the catalog lookup.
 */
export function categoryCoinCost(category: string): number | undefined {
  const slug = slugForLabel(category);
  if (!slug) return undefined;
  return categoryBySlug(slug)?.coinCost;
}

// ---------------------------------------------------------------------------
// Explore feed (prompt 19)
//
// Unlike the Home feed (one representative lesson per topic, filtered to the
// user's selection), Explore is for *discovery*: every available pilot lesson,
// across all mapped categories, ignoring the user's selection. Helpers here turn
// the pilot lessons into display-ready feed items for Explore's browse + rows.
// ---------------------------------------------------------------------------

/**
 * Every pilot lesson as a feed item (mapped + colored), in registration order
 * (the order lessons appear in `RAW_LESSONS`, preserved by `getPilotLessons`).
 * `getRecentLessons` reverses this for its newest-first "recently added" row.
 */
function allPilotFeedItems(): FeedItem[] {
  const items: FeedItem[] = [];
  for (const lesson of getPilotLessons()) {
    const slug = slugForLabel(lesson.category);
    if (slug) items.push(toFeedItem(lesson, slug));
  }
  return items;
}

/**
 * Every pilot lesson as a feed item, NOT collapsed per topic — the full browse
 * set for Explore. Ordered by the category catalog, then lesson order, so the
 * list reads category-by-category.
 */
export function getExploreLessons(): FeedItem[] {
  const order = categories.map((c) => c.slug);
  // Group by category, then by topic (so a topic's lessons stay together —
  // topics each have multiple lessons), then by order within the topic.
  return allPilotFeedItems().sort(
    (a, b) =>
      order.indexOf(a.slug) - order.indexOf(b.slug) ||
      a.lesson.topic.localeCompare(b.lesson.topic) ||
      a.lesson.order - b.lesson.order
  );
}

/** A featured/popular row: the per-topic intros, catalog-ordered, capped. */
export function getFeaturedLessons(limit = 8): FeedItem[] {
  return getAllPilotFeedItems().slice(0, limit);
}

/**
 * A "recently added" row. The content model has no publish date yet, so this
 * uses registration order (the order lessons were added to the app) as a
 * stand-in — newest-registered first. Swap to a real `publishedAt` when content
 * carries one; callers don't change.
 */
export function getRecentLessons(limit = 8): FeedItem[] {
  return allPilotFeedItems().reverse().slice(0, limit);
}

/**
 * The user's saved (bookmarked) lessons as feed items, in save order (newest
 * first, matching the store). Skips ids that no longer resolve to a lesson.
 */
export function getSavedFeedItems(savedIds: string[]): FeedItem[] {
  const items: FeedItem[] = [];
  for (const id of savedIds) {
    const lesson = getLessonById(id);
    if (!lesson) continue;
    const slug = slugForLabel(lesson.category);
    if (slug) items.push(toFeedItem(lesson, slug));
  }
  return items;
}

/** One Explore "browse by category" group: catalog meta + that category's lessons. */
export type ExploreCategory = {
  slug: CategorySlug;
  /** Category label, e.g. "Money & Finance". */
  title: string;
  icon: ImageKey;
  /** Icon tint + tile background (category colors). */
  tint: string;
  bg: string;
  /** Coin price when the category is coin-locked (undefined for free ones). */
  coinCost?: number;
  items: FeedItem[];
};

/**
 * The pilot lessons grouped into "browse by category" sections, catalog-ordered.
 * Only categories that actually have pilot content appear (no empty sections),
 * so the list fills in naturally as content lands. `coinCost` comes from the
 * catalog so Explore can surface the lock badge (the unlock flow is prompt 21).
 */
export function getExploreCategories(): ExploreCategory[] {
  const order = categories.map((c) => c.slug);
  const bySlug = new Map<CategorySlug, FeedItem[]>();
  for (const item of getExploreLessons()) {
    const arr = bySlug.get(item.slug) ?? [];
    arr.push(item);
    bySlug.set(item.slug, arr);
  }

  const out: ExploreCategory[] = [];
  for (const [slug, items] of bySlug) {
    const catalog = categories.find((c) => c.slug === slug);
    const meta = metaForSlug(slug);
    out.push({
      slug,
      title: meta.label,
      icon: meta.icon,
      tint: meta.tint,
      bg: meta.bg,
      coinCost: catalog?.coinCost,
      items,
    });
  }
  out.sort((a, b) => order.indexOf(a.slug) - order.indexOf(b.slug));
  return out;
}
