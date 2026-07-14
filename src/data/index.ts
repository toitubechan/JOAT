/**
 * Typed navigation index for the pilot content.
 *
 * Built from the parsed lessons (`src/lib/content.ts`) and grouped
 * category -> topic -> lessons. This holds only metadata (titles, icons, counts,
 * lesson ids) — never lesson prose, which stays in the markdown.
 *
 * Mapping (see AGENTS.md "topics / subtopics"):
 *   Topic    = frontmatter `category`  (e.g. "Money & Finance")
 *   Subtopic = frontmatter `topic`     (e.g. "Banking & Accounts")
 */
import { getAllLessons } from "@/lib/content";
import type { Lesson, LessonRef, Subtopic, Topic } from "@/types/content";

function toLessonRef(lesson: Lesson): LessonRef {
  return {
    id: lesson.id,
    topic: lesson.topic,
    subtitle: lesson.subtitle,
    icon: lesson.icon,
    estimatedMinutes: lesson.estimatedMinutes,
    order: lesson.order,
  };
}

function buildTopics(): Topic[] {
  // category -> topic -> lesson refs
  const byCategory = new Map<string, Map<string, LessonRef[]>>();

  for (const lesson of getAllLessons()) {
    const byTopic = byCategory.get(lesson.category) ?? new Map<string, LessonRef[]>();
    const refs = byTopic.get(lesson.topic) ?? [];
    refs.push(toLessonRef(lesson));
    byTopic.set(lesson.topic, refs);
    byCategory.set(lesson.category, byTopic);
  }

  const topics: Topic[] = [];
  for (const [category, byTopic] of byCategory) {
    const subtopics: Subtopic[] = [];
    for (const [topic, refs] of byTopic) {
      const lessons = [...refs].sort((a, b) => a.order - b.order);
      subtopics.push({ title: topic, lessonCount: lessons.length, lessons });
    }
    // Order subtopics by their first lesson's `order`, then alphabetically.
    // (A topic's overall display order isn't encoded in frontmatter, so this is
    // the most meaningful deterministic ordering available.)
    subtopics.sort(
      (a, b) => a.lessons[0].order - b.lessons[0].order || a.title.localeCompare(b.title)
    );
    const lessonCount = subtopics.reduce((sum, s) => sum + s.lessonCount, 0);
    topics.push({ title: category, lessonCount, subtopics });
  }

  topics.sort((a, b) => a.title.localeCompare(b.title));
  return topics;
}

/** All categories, grouped and sorted, ready to drive navigation. */
export const topics: Topic[] = buildTopics();

/** Find a category by its title, e.g. "Money & Finance". */
export function getTopic(title: string): Topic | undefined {
  return topics.find((topic) => topic.title === title);
}

/** Find a subtopic by its title, e.g. "Banking & Accounts". */
export function getSubtopic(title: string): Subtopic | undefined {
  for (const topic of topics) {
    const match = topic.subtopics.find((subtopic) => subtopic.title === title);
    if (match) {
      return match;
    }
  }
  return undefined;
}
