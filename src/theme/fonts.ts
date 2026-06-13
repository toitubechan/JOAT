/**
 * Poppins font assets for `useFonts()` (see app/_layout.tsx).
 *
 * Keys are the family names referenced by NativeWind (`--font-*` in global.css)
 * and by `theme/typography.ts`. Loaded at runtime so the app works in Expo Go.
 */
export const fonts = {
  "Poppins-Regular": require("../../assets/fonts/Poppins-Regular.ttf"),
  "Poppins-Medium": require("../../assets/fonts/Poppins-Medium.ttf"),
  "Poppins-SemiBold": require("../../assets/fonts/Poppins-SemiBold.ttf"),
  "Poppins-Bold": require("../../assets/fonts/Poppins-Bold.ttf"),
} as const;
