/**
 * FeedImage — the feed's resilient lesson-visual renderer.
 *
 * Renders an `expo-image` from a centralized image key, with two robustness
 * rules so the visual-first feed never shows a blank card (AGENTS.md):
 *   - a blurhash placeholder + fade-in transition cover the load, and
 *   - a missing/unknown key falls back to a deterministic Picsum photo.
 *
 * Styled with StyleSheet/inline + theme tokens (className is unreliable on
 * device — project memory); the visual itself routes through `images`.
 */
import { Image } from "expo-image";
import type { ImageStyle, StyleProp } from "react-native";

import {
  images,
  lessonImagesAreRemote,
  resolveLessonImage,
  type ImageKey,
  type ImageSource,
} from "@/constants/images";
import { colors } from "@/theme";

// Neutral blur shown under the image while it loads (valid base-83 blurhash).
const BLURHASH = "LGF5?xYk^6#M@-5c,1J5@[or[Q6.";

type FeedImageProps = {
  /** Centralized image key; when missing, a Picsum photo stands in. */
  imageKey?: ImageKey;
  /** Stable seed so the Picsum fallback stays consistent across renders. */
  fallbackSeed: string;
  style?: StyleProp<ImageStyle>;
  contentFit?: "cover" | "contain";
};

export function FeedImage({
  imageKey,
  fallbackSeed,
  style,
  contentFit = "cover",
}: FeedImageProps) {
  const hasKey = imageKey != null && imageKey in images;
  // A bundled asset is instant; a remote source (a CDN-served key, or the Picsum
  // fallback for an unknown key) needs the surface backdrop + blur-up.
  const remote = !hasKey || lessonImagesAreRemote;
  const source: ImageSource =
    imageKey != null && imageKey in images
      ? resolveLessonImage(imageKey)
      : { uri: `https://picsum.photos/seed/${encodeURIComponent(fallbackSeed)}/600/600` };

  return (
    <Image
      source={source}
      style={[remote && { backgroundColor: colors.surface }, style]}
      contentFit={contentFit}
      placeholder={remote ? BLURHASH : undefined}
      placeholderContentFit={contentFit}
      transition={250}
    />
  );
}
