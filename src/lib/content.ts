/**
 * Loads and parses the bundled lesson markdown into the typed content model.
 *
 * The markdown in `content/` is the source of truth. `md-transformer.js` bundles
 * each `.md` file as a raw string (works in Expo Go — no Node `fs` at runtime),
 * so here we just import those strings and parse them. Results are parsed once
 * and cached in memory.
 *
 * Markdown shape (see content/*.md):
 *   ---  frontmatter: id, category, topic, subtitle, icon, estimated_minutes, order  ---
 *   ## Card: <title>     -> one feed card; optional `image: <key>` as its first line
 *   ## Quiz              -> numbered questions, `- [x]`/`- [ ]` options, `> ` explanation
 */
import { images } from "@/constants/images";
import type { ImageKey } from "@/constants/images";
import type { Card, Lesson, Quiz, QuizQuestion } from "@/types/content";

import { RAW_LESSONS } from "./lessons.generated";

// ---------------------------------------------------------------------------
// Parsing helpers
// ---------------------------------------------------------------------------

function isImageKey(key: string): key is ImageKey {
  return key in images;
}

function toNumber(value: string | undefined): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

/** Split the leading `--- ... ---` frontmatter from the markdown body. */
function parseFrontmatter(raw: string): {
  meta: Record<string, string>;
  body: string;
} {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(raw);
  if (!match) {
    return { meta: {}, body: raw };
  }
  const [, frontmatter, body] = match;
  const meta: Record<string, string> = {};
  for (const line of frontmatter.split(/\r?\n/)) {
    const kv = /^([A-Za-z_]+):\s*(.*)$/.exec(line);
    if (kv) {
      meta[kv[1]] = kv[2].trim();
    }
  }
  return { meta, body };
}

/** Break the body into `## ` sections, keeping each heading and its lines. */
function splitSections(body: string): { heading: string; lines: string[] }[] {
  const sections: { heading: string; lines: string[] }[] = [];
  let current: { heading: string; lines: string[] } | null = null;
  for (const line of body.split(/\r?\n/)) {
    const headingMatch = /^##\s+(.*)$/.exec(line);
    if (headingMatch) {
      current = { heading: headingMatch[1].trim(), lines: [] };
      sections.push(current);
    } else if (current) {
      current.lines.push(line);
    }
  }
  return sections;
}

/** Parse one `## Card: <title>` section, pulling out an optional image key. */
function parseCard(heading: string, lines: string[]): Card {
  const title = heading.replace(/^Card:\s*/, "").trim();
  let bodyLines = lines;
  let image: ImageKey | undefined;

  // An image, when present, is the first non-empty line: `image: <key>`.
  const firstIdx = bodyLines.findIndex((line) => line.trim() !== "");
  if (firstIdx !== -1) {
    const imageMatch = /^image:\s*(.+)$/.exec(bodyLines[firstIdx].trim());
    if (imageMatch) {
      const key = imageMatch[1].trim();
      if (isImageKey(key)) {
        image = key;
      } else if (__DEV__) {
        console.warn(
          `[content] Unknown image key "${key}" on card "${title}" — rendering text-forward.`
        );
      }
      // Strip the image line either way so it never leaks into the body.
      bodyLines = [...bodyLines.slice(0, firstIdx), ...bodyLines.slice(firstIdx + 1)];
    }
  }

  return { title, image, body: bodyLines.join("\n").trim() };
}

/** Parse the `## Quiz` section into questions, options and explanations. */
function parseQuiz(lines: string[]): Quiz {
  const questions: QuizQuestion[] = [];
  let current: QuizQuestion | null = null;

  for (const raw of lines) {
    const line = raw.trim();
    if (line === "") {
      continue;
    }

    const questionMatch = /^\d+\.\s+(.*)$/.exec(line);
    const optionMatch = /^- \[([ xX])\]\s+(.*)$/.exec(line);
    const explanationMatch = /^>\s*(.*)$/.exec(line);

    if (questionMatch) {
      // Flag the question we're leaving if it never got a correct answer.
      if (__DEV__ && current && current.correctIndex === -1) {
        console.warn(`[content] Quiz question has no correct answer: "${current.prompt}"`);
      }
      current = { prompt: questionMatch[1].trim(), options: [], correctIndex: -1, explanation: "" };
      questions.push(current);
    } else if (optionMatch && current) {
      if (optionMatch[1].toLowerCase() === "x") {
        // A second [x] would silently overwrite the first — warn so it gets fixed.
        if (__DEV__ && current.correctIndex !== -1) {
          console.warn(`[content] Quiz question has multiple correct answers: "${current.prompt}"`);
        }
        current.correctIndex = current.options.length;
      }
      current.options.push(optionMatch[2].trim());
    } else if (explanationMatch && current) {
      current.explanation = explanationMatch[1].trim();
    }
  }

  // The loop only validates a question when the next one starts, so check the last.
  if (__DEV__ && current && current.correctIndex === -1) {
    console.warn(`[content] Quiz question has no correct answer: "${current.prompt}"`);
  }

  return { questions };
}

/**
 * Parse one lesson's raw markdown into the typed model. Exported for tests —
 * the app reaches lessons through `getAllLessons` / `getLessonById`.
 */
export function parseLesson(raw: string): Lesson {
  const { meta, body } = parseFrontmatter(raw);
  const cards: Card[] = [];
  let quiz: Quiz = { questions: [] };

  for (const section of splitSections(body)) {
    if (section.heading === "Quiz") {
      quiz = parseQuiz(section.lines);
    } else if (section.heading.startsWith("Card:")) {
      cards.push(parseCard(section.heading, section.lines));
    }
  }

  return {
    id: meta.id ?? "",
    category: meta.category ?? "",
    topic: meta.topic ?? "",
    subtitle: meta.subtitle ?? "",
    icon: meta.icon ?? "",
    estimatedMinutes: toNumber(meta.estimated_minutes),
    order: toNumber(meta.order),
    cards,
    quiz,
  };
}

// ---------------------------------------------------------------------------
// Exposure
// ---------------------------------------------------------------------------

/**
 * Whether id is a bundled lesson. Every bundled lesson now ships with its
 * content + visuals, so the app exposes them all (the old pilot allowlist is
 * retired). Kept for the Progress count and the lesson-route guard.
 */
export function isPilotLesson(id: string): boolean {
  return getAllLessons().some((lesson) => lesson.id === id);
}

// ---------------------------------------------------------------------------
// Public API (parsed once, cached in memory)
// ---------------------------------------------------------------------------

let cache: Lesson[] | null = null;

/** Every bundled lesson, parsed from markdown. Parsed on first call, then cached. */
export function getAllLessons(): Lesson[] {
  if (cache === null) {
    cache = RAW_LESSONS.map(parseLesson);
  }
  return cache;
}

/**
 * Every exposed lesson. Legacy name — the pilot allowlist was retired, so this
 * is now an alias for `getAllLessons`. Kept so feed/stats callers don't churn.
 */
export function getPilotLessons(): Lesson[] {
  return getAllLessons();
}

/** Look up a single bundled lesson by its frontmatter `id` (undefined if none). */
export function getLessonById(id: string): Lesson | undefined {
  return getAllLessons().find((lesson) => lesson.id === id);
}
