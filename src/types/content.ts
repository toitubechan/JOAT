/**
 * Typed content model for the markdown-driven lesson system.
 *
 * Lessons are authored as markdown in `content/` (the source of truth) and
 * parsed into these types by `src/lib/content.ts`. The grouped navigation index
 * built from them lives in `src/data/index.ts`.
 *
 * Naming note: the markdown frontmatter uses `category` (e.g. "Money & Finance")
 * and `topic` (e.g. "Banking & Accounts"). In the index those map to `Topic`
 * (top-level category) and `Subtopic` (the frontmatter `topic`), matching the
 * "topics / subtopics" wording in AGENTS.md.
 */
import type { ImageKey } from "@/constants/images";

/** One quiz question with a single correct option. */
export interface QuizQuestion {
  /** The question text. */
  prompt: string;
  /** Answer choices in their authored order. */
  options: string[];
  /** Index into `options` of the correct answer (the `- [x]` choice). */
  correctIndex: number;
  /** One-line explanation revealed after answering (the `>` line). */
  explanation: string;
}

/** The quiz block at the end of a lesson. */
export interface Quiz {
  questions: QuizQuestion[];
}

/** One feed card, rendered from a `## Card: <title>` section. */
export interface Card {
  /** Card heading text (the part after `## Card:`). */
  title: string;
  /**
   * Optional lesson visual, referenced by key. Resolve against
   * `src/constants/images.ts`; when absent, render a text-forward card.
   */
  image?: ImageKey;
  /** Card body markdown (paragraphs / bold / bullet lists), image line stripped. */
  body: string;
}

/** A full lesson: frontmatter metadata + ordered cards + one quiz. */
export interface Lesson {
  /** Stable id from frontmatter `id` (lessons are keyed by this, not filename). */
  id: string;
  /** Top-level grouping, e.g. "Money & Finance". */
  category: string;
  /** Second-level grouping, e.g. "Banking & Accounts". */
  topic: string;
  /** Short one-line description shown under the title. */
  subtitle: string;
  /** Icon name from frontmatter (e.g. "credit-card"). */
  icon: string;
  /** Rough reading time in minutes. */
  estimatedMinutes: number;
  /** Sort order within its topic. */
  order: number;
  /** Feed cards in authored order. */
  cards: Card[];
  /** The lesson's quiz. */
  quiz: Quiz;
}

/** Lightweight lesson reference for the navigation index (no prose). */
export interface LessonRef {
  id: string;
  topic: string;
  subtitle: string;
  icon: string;
  estimatedMinutes: number;
  order: number;
}

/** A `topic` group within a category, e.g. "Banking & Accounts". */
export interface Subtopic {
  /** The frontmatter `topic` value. */
  title: string;
  /** Number of lessons in this subtopic. */
  lessonCount: number;
  /** Lessons in this subtopic, sorted by `order`. */
  lessons: LessonRef[];
}

/** A top-level `category`, e.g. "Money & Finance". */
export interface Topic {
  /** The frontmatter `category` value. */
  title: string;
  /** Total lessons across all subtopics. */
  lessonCount: number;
  /** Subtopics within this category. */
  subtopics: Subtopic[];
}
