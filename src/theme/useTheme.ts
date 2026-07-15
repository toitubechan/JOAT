/**
 * Theme hooks — resolve the user's chosen `themeMode` (Settings → Appearance)
 * into the active color palette.
 *
 *   dark   -> darkColors
 *   light  -> lightColors
 *   system -> follows the OS color scheme
 *
 * Components read `useTheme()` and build styles with a `makeStyles(c)` factory
 * (memoized via `useThemedStyles`), so a mode change re-renders with new colors.
 */
import { useMemo } from "react";
import { useColorScheme } from "react-native";

import { usePreferencesStore } from "@/store";
import { darkColors, lightColors, type ThemeColors } from "./colors";

/** The effective light/dark mode (resolves `system` against the OS setting). */
export function useThemeMode(): "light" | "dark" {
  const mode = usePreferencesStore((s) => s.themeMode);
  const system = useColorScheme();
  if (mode === "system") return system === "light" ? "light" : "dark";
  return mode === "light" ? "light" : "dark";
}

/** The active color palette. */
export function useTheme(): ThemeColors {
  return useThemeMode() === "light" ? lightColors : darkColors;
}

/** Build + memoize a themed StyleSheet: `const styles = useThemedStyles(makeStyles)`. */
export function useThemedStyles<T>(factory: (c: ThemeColors) => T): T {
  const c = useTheme();
  return useMemo(() => factory(c), [factory, c]);
}
