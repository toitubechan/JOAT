/**
 * Centralized image imports (AGENTS.md "Image Rule").
 *
 * Every raster asset is registered here and rendered via `expo-image`
 * (see src/tw/image.tsx). Reference images by key, e.g. `images.mascotLogo`.
 * Do not import asset files directly inside screens/components.
 */
import mascotLogo from "../../assets/images/mascot-logo.png";
import mascotWelcome from "../../assets/images/mascot-welcome.png";
import mascotAuth from "../../assets/images/mascot-auth.png";
import streakFire from "../../assets/images/streak-fire.png";
import treasure from "../../assets/images/treasure.png";
import earth from "../../assets/images/earth.png";

// Brand logo for social auth. SVG renders through expo-image (Android-supported)
// just like the raster assets above, so it stays in this one import object.
import googleLogo from "../../assets/images/google.svg";

export const images = {
  mascotLogo,
  mascotWelcome,
  mascotAuth,
  streakFire,
  treasure,
  earth,
  googleLogo,
} as const;

export type ImageKey = keyof typeof images;
