/**
 * Category catalog for the "Pick your category" screen and the feed.
 *
 * Now data-driven: the catalog is generated from the bundled lesson content into
 * `@/data/categories` (one entry per distinct frontmatter `category`, with its
 * hero illustration + accent color). This file re-exports it under the names the
 * rest of the app already uses (`categories`, `Category`), so consumers are
 * unchanged. Regenerate via `node scripts/build-content.js`.
 */
export type { Category, CategorySlug } from "@/data/categories";
export { CATEGORIES as categories } from "@/data/categories";
