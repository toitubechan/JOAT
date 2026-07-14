/**
 * ContinueCard — the amber "Continue learning" hero.
 *
 * Gradient card with a kicker, the category title, a "Topic · Card n of m"
 * subtitle, a dark Continue button, and the mascot bottom-right. Tapping
 * anywhere resumes the saved card. Styled with StyleSheet + theme tokens; the
 * mascot routes through `FeedImage` (centralized images + blur/Picsum fallback).
 */
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { FeedImage } from "@/components/FeedImage";
import { images, type ImageKey } from "@/constants/images";
import { colors, fontFamily, radii, typeScale } from "@/theme";

type ContinueCardProps = {
  kicker: string;
  title: string;
  subtitle: string;
  mascot: ImageKey;
  onPress: () => void;
  /** Layout styling (e.g. margins) from the calling screen. */
  style?: StyleProp<ViewStyle>;
};

export function ContinueCard({
  kicker,
  title,
  subtitle,
  mascot,
  onPress,
  style,
}: ContinueCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, style, pressed && styles.pressed]}
    >
      <LinearGradient
        colors={["#FFC85A", "#FFB020", "#F39200"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.row}>
          <View style={styles.text}>
            <Text style={styles.kicker}>{kicker}</Text>
            <Text style={styles.title} numberOfLines={2}>
              {title}
            </Text>
            <Text style={styles.subtitle} numberOfLines={1}>
              {subtitle}
            </Text>
          </View>

          {/* Category illustration as a framed, rounded thumbnail (these heroes
              carry their own background, so they're clipped into a tidy tile —
              not floated as a transparent cutout). */}
          <View style={styles.thumbWrap}>
            <FeedImage imageKey={mascot} fallbackSeed={title} style={styles.thumb} contentFit="cover" />
          </View>
        </View>

        <View style={styles.button}>
          <Image source={images.playWhite} style={styles.play} contentFit="contain" />
          <Text style={styles.buttonText}>Continue</Text>
        </View>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radii.hero,
    // Soft Android elevation under the hero.
    elevation: 4,
  },
  pressed: { opacity: 0.95 },
  gradient: {
    borderRadius: radii.hero,
    padding: 20,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  text: { flex: 1 },
  kicker: {
    color: "#7A4A00",
    fontFamily: fontFamily.bold,
    fontSize: typeScale.caption.size,
    letterSpacing: 1,
  },
  title: {
    color: colors.txtOnAmber,
    fontFamily: fontFamily.bold,
    fontSize: 22,
    lineHeight: 28,
    marginTop: 8,
  },
  subtitle: {
    color: "#5C3A00",
    fontFamily: fontFamily.medium,
    fontSize: typeScale.bodySm.size,
    marginTop: 4,
  },
  thumbWrap: {
    width: 92,
    height: 92,
    borderRadius: 18,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.5)",
    backgroundColor: "rgba(0,0,0,0.12)",
  },
  thumb: {
    width: "100%",
    height: "100%",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    height: 52,
    marginTop: 18,
    paddingHorizontal: 18,
    backgroundColor: "#131726",
    borderRadius: 13,
  },
  play: { width: 15, height: 15 },
  buttonText: {
    color: colors.txt,
    fontFamily: fontFamily.semibold,
    fontSize: typeScale.h4.size,
  },
});
