/**
 * Build the app's lesson content from the Primer vault.
 *
 * The full lesson library (740 lessons / 44 categories) is authored in the
 * external Primer Obsidian vault; the app bundles a copy. Hand-maintaining 740
 * markdown imports and a 44-category catalog is untenable, so this script is the
 * single source of truth for the wiring:
 *
 *   1. Copies every Primer `*.md` into `content/`.
 *   2. Generates `src/lib/lessons.generated.ts` — the static `.md` imports Metro
 *      needs to bundle markdown as strings, plus the `RAW_LESSONS` array.
 *   3. Generates `src/data/categories.ts` — the data-driven category catalog
 *      (slug, label, hero image, accent color), derived from the content. Every
 *      category reuses its intro lesson's hero image; colors come from a fixed
 *      palette (money/mindfulness pinned for brand continuity).
 *
 * Re-run after any Primer change:  node scripts/build-content.js
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const PRIMER = "C:/Users/AhmedAmineFEKI/Downloads/Obsidian/Applications/Primer/MD Files for topics";
const CONTENT_DIR = path.join(ROOT, "content");
const LESSONS_OUT = path.join(ROOT, "src", "lib", "lessons.generated.ts");
const CATEGORIES_OUT = path.join(ROOT, "src", "data", "categories.ts");
const IMAGES_TS = path.join(ROOT, "src", "constants", "images.ts");

// Accent palette ({ tint, bg }) cycled across categories. money + mindfulness are
// pinned to their established brand colors; the rest are assigned in order.
const PALETTE = [
  { tint: "#22C55E", bg: "#16321F" }, // green
  { tint: "#FF7A00", bg: "#33230F" }, // orange
  { tint: "#4D8BFF", bg: "#15233D" }, // blue
  { tint: "#FFB020", bg: "#33290F" }, // amber
  { tint: "#2EC4B6", bg: "#16322F" }, // teal
  { tint: "#FF4D4F", bg: "#321616" }, // red
  { tint: "#B07CFF", bg: "#241A38" }, // purple
  { tint: "#FF6FB5", bg: "#331826" }, // pink
  { tint: "#38BDF8", bg: "#102A38" }, // cyan
  { tint: "#A3E635", bg: "#20300F" }, // lime
  { tint: "#818CF8", bg: "#1B1F3A" }, // indigo
  { tint: "#FB7185", bg: "#331519" }, // rose
  { tint: "#34D399", bg: "#123024" }, // emerald
  { tint: "#F59E0B", bg: "#2E2410" }, // gold
  { tint: "#A78BFA", bg: "#241B3A" }, // violet
  { tint: "#E879F9", bg: "#2E1633" }, // fuchsia
];
const SLUG_OVERRIDE = {
  "Money & Finance": "money",
  "Mindfulness & Mental Wellbeing": "mindfulness",
};

// Categories gated behind a coin unlock (the Shop / prompt 21). Everything is
// free by default; a category listed here gets a `coinCost` so the unlock
// economy has real targets. A discounted "random unlock" is offered in the Shop.
// The two brand-pilot categories (money, mindfulness) stay free on purpose.
const LOCKED = {
  "Space Deep Dive": 100,
  "Filmmaking & Video": 100,
  "Coding & Programming": 100,
  "Music & Audio": 100,
  "Philosophy & Big Ideas": 100,
  "Future Tech & Innovation": 100,
};

// Thematic group per category, for the "By type" sort in the picker. Any label
// not listed falls back to "Other" (surfaced by the verify step so it can be
// added here).
const GROUP_OF = {
  "Money & Finance": "Money & Life",
  "Business & Entrepreneurship": "Money & Life",
  "Career & Work": "Money & Life",
  "Everyday Economics": "Money & Life",
  "Home & Car": "Money & Life",
  "Law & Your Rights": "Money & Life",
  "Marketing & Branding": "Money & Life",
  "Practical Life Admin": "Money & Life",
  "Real Estate & Property": "Money & Life",
  "Technology & Online Safety": "Money & Life",
  "Animals & Wildlife": "Science & Nature",
  "Earth Science & Geology": "Science & Nature",
  "Energy & Power": "Science & Nature",
  "Everyday Science": "Science & Nature",
  "Future Tech & Innovation": "Science & Nature",
  "How Things Work": "Science & Nature",
  "Human Body Deep Dive": "Science & Nature",
  "Space Deep Dive": "Science & Nature",
  "Sustainable Living": "Science & Nature",
  "Health & Body": "Health & Mind",
  "Medicine & Public Health": "Health & Mind",
  "Mindfulness & Mental Wellbeing": "Health & Mind",
  "Parenting & Child Development": "Health & Mind",
  "Productivity & Self-Growth": "Health & Mind",
  "Psychology & Mind": "Health & Mind",
  "Relationships & Dating": "Health & Mind",
  "Sports & Fitness": "Health & Mind",
  "Communication & People Skills": "Health & Mind",
  "Baking & Desserts": "Skills & Creativity",
  "Coding & Programming": "Skills & Creativity",
  "Cooking & Food": "Skills & Creativity",
  "Creative Writing": "Skills & Creativity",
  "Design & Visual Creativity": "Skills & Creativity",
  "Filmmaking & Video": "Skills & Creativity",
  "Music & Audio": "Skills & Creativity",
  "World Cuisines": "Skills & Creativity",
  "Government & Politics": "World & Ideas",
  "History & the World": "World & Ideas",
  "Languages & Linguistics": "World & Ideas",
  "Logic & Critical Thinking": "World & Ideas",
  "Math Concepts": "World & Ideas",
  "Numbers & Data Literacy": "World & Ideas",
  "Philosophy & Big Ideas": "World & Ideas",
  "World Religions & Belief": "World & Ideas",
};

const slugify = (s) =>
  s.toLowerCase().replace(/&/g, " ").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

function read(file) {
  return fs.readFileSync(file, "utf8");
}
function front(text, key) {
  return (text.match(new RegExp(`^${key}:\\s*(.+)$`, "m")) || [])[1]?.trim();
}

function main() {
  if (!fs.existsSync(PRIMER)) throw new Error(`Primer vault not found at ${PRIMER}`);
  const registered = new Set(
    [...read(IMAGES_TS).matchAll(/import\s+(\w+)\s+from/g)].map((m) => m[1])
  );

  // 1) Regenerate from whatever is already in content/. Pass --sync to FIRST
  //    re-pull every lesson from the Primer vault (that re-adds all 740 — only do
  //    it intentionally; by default we leave content/ as-is so a prune sticks).
  fs.mkdirSync(CONTENT_DIR, { recursive: true });
  let primerFiles = [];
  if (process.argv.includes("--sync")) {
    primerFiles = fs.readdirSync(PRIMER).filter((f) => f.endsWith(".md"));
    for (const f of primerFiles) fs.copyFileSync(path.join(PRIMER, f), path.join(CONTENT_DIR, f));
  } else {
    console.log("(no --sync) regenerating from existing content/ — pass --sync to re-pull from Primer.");
  }

  // 2) generate lessons.generated.ts (imports + RAW_LESSONS), sorted for stable diffs
  const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".md")).sort();
  const importLines = files.map((f, i) => `import l${i} from "../../content/${f}";`).join("\n");
  const arrayItems = files.map((_, i) => `  l${i},`).join("\n");
  fs.writeFileSync(
    LESSONS_OUT,
    `/**\n * GENERATED by scripts/build-content.js — do not edit by hand.\n` +
      ` * Static markdown imports (bundled as strings by md-transformer) for every\n` +
      ` * lesson in content/. Re-run the script after changing the content.\n */\n\n` +
      `${importLines}\n\n/** Raw markdown for every bundled lesson. */\nexport const RAW_LESSONS: string[] = [\n${arrayItems}\n];\n`
  );

  // 3) build the category catalog from the content
  const byCat = new Map();
  for (const f of files) {
    const t = read(path.join(CONTENT_DIR, f));
    const cat = front(t, "category");
    if (!cat) continue;
    const order = Number(front(t, "order")) || 99;
    const heroImg = (t.match(/## Card:[^\n]*\r?\nimage:\s*(.+)/) || [])[1]?.trim();
    const entry = byCat.get(cat) || { count: 0, intro: null };
    entry.count += 1;
    if (!entry.intro || order < entry.intro.order) entry.intro = { order, heroImg };
    // keep a registered hero even if the lowest-order lesson lacks one
    if ((!entry.hero || order < entry.heroOrder) && heroImg && registered.has(heroImg)) {
      entry.hero = heroImg;
      entry.heroOrder = order;
    }
    byCat.set(cat, entry);
  }

  const labels = [...byCat.keys()].sort();
  let paletteIdx = 0;
  const cats = labels.map((label) => {
    const e = byCat.get(label);
    const slug = SLUG_OVERRIDE[label] || slugify(label);
    let color;
    if (slug === "money") color = PALETTE[0];
    else if (slug === "mindfulness") color = PALETTE[4];
    else {
      color = PALETTE[paletteIdx % PALETTE.length];
      paletteIdx += 1;
    }
    // Every category needs a registered hero; fall back to a safe one (and warn)
    // rather than emitting `icon: "undefined"` (an invalid ImageKey).
    const hero = e.hero || "catMoneyHero";
    if (!e.hero) console.warn(`[build-content] no registered hero for "${label}" — using catMoneyHero`);
    const group = GROUP_OF[label] || "Other";
    if (group === "Other") console.warn(`[build-content] no GROUP_OF mapping for "${label}" — using "Other"`);
    return {
      slug,
      label,
      hero,
      group,
      tint: color.tint,
      bg: color.bg,
      lessonCount: e.count,
      coinCost: LOCKED[label],
    };
  });

  const body = cats
    .map((c) => {
      const lock = c.coinCost != null ? `, coinCost: ${c.coinCost}` : "";
      return `  { slug: "${c.slug}", title: ${JSON.stringify(c.label)}, icon: "${c.hero}", group: ${JSON.stringify(c.group)}, tint: "${c.tint}", bg: "${c.bg}", lessonCount: ${c.lessonCount}${lock} },`;
    })
    .join("\n");

  fs.writeFileSync(
    CATEGORIES_OUT,
    `/**\n * GENERATED by scripts/build-content.js — do not edit by hand.\n` +
      ` * The data-driven category catalog: one entry per distinct lesson\n` +
      ` * \`category\`. \`icon\` reuses the category's intro-lesson hero illustration\n` +
      ` * (rendered as the category/row visual); colors come from a fixed palette.\n` +
      ` * Single source of truth for category slugs, titles, colors and visuals.\n */\n` +
      `import type { ImageKey } from "@/constants/images";\n\n` +
      `export type Category = {\n  slug: string;\n  /** Frontmatter category label, e.g. "Money & Finance". */\n  title: string;\n  /** Category hero illustration, reused as the small tile/row visual. */\n  icon: ImageKey;\n  /** Thematic group for the "By type" sort, e.g. "Science & Nature". */\n  group: string;\n  tint: string;\n  bg: string;\n  lessonCount: number;\n  /** Coin price to unlock; omitted = free. */\n  coinCost?: number;\n};\n\n` +
      `export const CATEGORIES: Category[] = [\n${body}\n];\n\n` +
      `/** Data-driven category slug (all slugs are derived from the content). */\nexport type CategorySlug = string;\n\n` +
      `/** Per-slug accent colors — drop-in for the old hand-written \`categoryColors\`. */\nexport const categoryColors: Record<string, { tint: string; bg: string }> =\n  Object.fromEntries(CATEGORIES.map((c) => [c.slug, { tint: c.tint, bg: c.bg }]));\n\n` +
      `const BY_SLUG = new Map(CATEGORIES.map((c) => [c.slug, c]));\nconst BY_LABEL = new Map(CATEGORIES.map((c) => [c.title, c]));\n\n` +
      `/** Lookup a category by slug. */\nexport function categoryBySlug(slug: string): Category | undefined {\n  return BY_SLUG.get(slug);\n}\n\n` +
      `/** Map a frontmatter \`category\` label to its slug (undefined if unknown). */\nexport function slugForLabel(label: string): string | undefined {\n  return BY_LABEL.get(label)?.slug;\n}\n`
  );

  console.log(`Copied ${primerFiles.length} Primer files → content/ (${files.length} total).`);
  console.log(`Wrote ${path.relative(ROOT, LESSONS_OUT)} (${files.length} imports).`);
  console.log(`Wrote ${path.relative(ROOT, CATEGORIES_OUT)} (${cats.length} categories).`);
}

main();
