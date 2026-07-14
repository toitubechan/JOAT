/** JOAT design tokens (TS mirror of global.css). Single import surface. */
export { colors } from "./colors";
export type { ColorToken } from "./colors";

// Category accents + slug type are data-driven (`@/data/categories`); re-exported
// here so the rest of the app keeps importing them from `@/theme`.
export { categoryColors } from "@/data/categories";
export type { CategorySlug } from "@/data/categories";

export { fontFamily, typeScale } from "./typography";
export type { TypeRole } from "./typography";

export { radii, spacing } from "./layout";
export type { RadiusToken, SpacingToken } from "./layout";

export { fonts } from "./fonts";
