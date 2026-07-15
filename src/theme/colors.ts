/**
 * JOAT color tokens (raw hex) — now theme-aware.
 *
 * Two palettes with identical keys: `darkColors` (the original brand look) and
 * `lightColors`. Components should read the active set via `useTheme()`
 * (theme/useTheme.ts) and build their styles with `makeStyles(c)`; the exported
 * `colors` alias stays = dark for back-compat and non-component (data) files.
 *
 * Accents (amber, teal, coin, streak, semantic base colors) are shared across
 * both themes for brand consistency; only the neutrals and the *Bg/*Border/*Text
 * variants flip.
 */
export const darkColors = {
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

/** Any theme's color set — same keys as `darkColors`, values are plain strings. */
export type ThemeColors = Record<keyof typeof darkColors, string>;

/** Light palette. Same keys; neutrals + tinted-bg variants flipped for a light UI. */
export const lightColors: ThemeColors = {
  // Primary (shared brand accents)
  amber: "#FFB020",
  amberDeep: "#F59300",
  amberPressed: "#E08400",
  teal: "#0F9E92",
  tealBg: "#E1F5F1",
  tealBorder: "#B5E4DC",
  tealText: "#0C6C61",
  ink: "#F4F5F9", // app background (light)

  // Light surfaces
  surface: "#FFFFFF",
  surfaceRaised: "#EEF0F5",
  line: "#E3E6ED",
  tabbar: "#FFFFFF",

  // Text on light
  txt: "#141824",
  txtSecondary: "#4B5266",
  txtMuted: "#79808F",
  txtOnAmber: "#131726",

  // Semantic
  success: "#16A34A",
  successBg: "#E7F6EC",
  successBorder: "#BFE6CB",
  successText: "#15803D",
  danger: "#DC2626",
  dangerBg: "#FCEBEB",
  dangerBorder: "#F5C9C9",
  streak: "#EF6C00",
  coin: "#B7791F",
  coinBg: "#FBF1D5",
  coinBorder: "#EBD8A2",
  info: "#2563EB",
};

/** Back-compat default (dark). Prefer `useTheme()` in components. */
export const colors = darkColors;

export type ColorToken = keyof typeof darkColors;
