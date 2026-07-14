/**
 * JOAT color tokens (raw hex).
 *
 * Mirrors the `--color-*` tokens in `src/global.css`. In JSX, prefer NativeWind
 * classes (`bg-surface`, `text-txt-secondary`, ...). Import these raw values only
 * where className can't reach — the StyleSheet/inline contexts called out in
 * AGENTS.md "Style Exception Rules" (Android `elevation`, SafeAreaView, Animated
 * values, runtime-computed styles).
 */
export const colors = {
  // Primary
  amber: "#FFB020",
  amberDeep: "#F59300",
  amberPressed: "#E08400",
  teal: "#2EC4B6",
  tealBg: "#16322F",
  tealBorder: "#1F4F4B",
  tealText: "#7FE3DA",
  ink: "#0F1320", // app background

  // Dark surfaces
  surface: "#1B2234",
  surfaceRaised: "#222A40",
  line: "#2A3349", // borders
  tabbar: "#161B29",

  // Text on dark
  txt: "#FFFFFF",
  txtSecondary: "#A8B0C3",
  txtMuted: "#7C859B",
  txtOnAmber: "#131726",

  // Semantic
  success: "#22C55E",
  successBg: "#10271A",
  successBorder: "#1E4D32",
  successText: "#A9E8C3",
  danger: "#FF4D4F",
  dangerBg: "#2A1414",
  dangerBorder: "#5C1E1E",
  streak: "#FF7A00",
  coin: "#FFD338",
  coinBg: "#3A2F14",
  coinBorder: "#5C4A1E",
  info: "#4D8BFF",
} as const;

export type ColorToken = keyof typeof colors;

// Category accent colors + the `CategorySlug` type are now data-driven (one per
// distinct lesson category); they live in `@/data/categories` and are re-exported
// from `@/theme` (see theme/index.ts) so existing imports keep working.
