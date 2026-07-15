/**
 * Progress-screen stats derived from the pilot content + the user's completions.
 *
 * These are pure helpers over the parsed lessons (`lib/content.ts`) and a list
 * of completed lesson ids (from the progress store). They keep the Progress
 * screen "dumb": it passes its completion data in and renders what comes back.
 */
import type { ImageKey } from "@/constants/images";
import { categories } from "@/data/topics";
import { getPilotLessons } from "@/lib/content";
import { slugForCategory } from "@/lib/feed";
import { categoryColors, type CategorySlug } from "@/theme";
import type { Lesson } from "@/types/content";

/** Per top-level category: how many of its pilot lessons are done, with display meta. */
export type TopicProgress = {
  slug: CategorySlug;
  /** Frontmatter category, e.g. "Money & Finance". */
  title: string;
  icon: ImageKey;
  tint: string;
  bg: string;
  completed: number;
  total: number;
};

/** Total pilot lessons and cards available (static — computed from content). */
export function getContentTotals(): { lessons: number; cards: number } {
  const lessons = getPilotLessons();
  return {
    lessons: lessons.length,
    cards: lessons.reduce((sum, lesson) => sum + lesson.cards.length, 0),
  };
}

/**
 * Group the pilot lessons by top-level category and count how many the user has
 * completed in each. Only categories the user has actually **started** are
 * returned — a category shows once it has ≥1 lesson completed or in progress
 * (`startedLessonIds`), so untouched categories stay off the Progress screen.
 * Ordered most-complete first so the screen leads with the user's strongest
 * topics.
 */
export function getTopicBreakdown(
  completedLessonIds: string[],
  startedLessonIds: string[]
): TopicProgress[] {
  const done = new Set(completedLessonIds);
  const started = new Set(startedLessonIds);

  // category title -> its lessons
  const byCategory = new Map<string, { slug: CategorySlug; lessons: Lesson[] }>();
  for (const lesson of getPilotLessons()) {
    const slug = slugForCategory(lesson.category);
    if (!slug) continue;
    const entry = byCategory.get(lesson.category) ?? { slug, lessons: [] };
    entry.lessons.push(lesson);
    byCategory.set(lesson.category, entry);
  }

  const rows: TopicProgress[] = [];
  for (const [title, { slug, lessons }] of byCategory) {
    // Skip categories the user hasn't opened yet (nothing started or completed).
    if (!lessons.some((l) => started.has(l.id))) continue;
    const completed = lessons.filter((l) => done.has(l.id)).length;
    const catalog = categories.find((c) => c.slug === slug);
    const color = categoryColors[slug];
    rows.push({
      slug,
      title,
      icon: (catalog?.icon ?? "walletIcon") as ImageKey,
      tint: color.tint,
      bg: color.bg,
      completed,
      total: lessons.length,
    });
  }

  // Most-complete first (by fraction), then alphabetical for a stable order.
  rows.sort(
    (a, b) =>
      b.completed / b.total - a.completed / a.total || a.title.localeCompare(b.title)
  );
  return rows;
}
