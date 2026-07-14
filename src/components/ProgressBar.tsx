/**
 * ProgressBar — a `line` track with an amber-gradient fill, rounded to a pill.
 * Used by the home daily-goal card, the quiz, and the XP bar. `progress` is
 * clamped to 0–1. Styled with StyleSheet + theme tokens per project convention.
 *
 * Pass `animated` to glide the fill to a new width (e.g. the XP bar after an
 * award); left off, the fill snaps as before so existing callers are unchanged.
 */
import { useEffect, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Animated, Easing, StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

import { colors } from "@/theme";

type ProgressBarProps = {
  /** Fill fraction, 0–1 (clamped). */
  progress: number;
  height?: number;
  /** Smoothly animate width changes (default: snap). */
  animated?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function ProgressBar({ progress, height = 9, animated = false, style }: ProgressBarProps) {
  const pct = Math.max(0, Math.min(1, progress));
  const radius = height / 2;

  // Drive the fill width from an Animated.Value so it can either snap or glide.
  // Width is a layout prop, so this can't use the native driver — fine for one
  // short tween on a single bar. Lazy useState keeps it stable across renders
  // without reading a ref during render (react-hooks/refs).
  const [fill] = useState(() => new Animated.Value(pct));

  useEffect(() => {
    if (!animated) {
      fill.setValue(pct);
      return;
    }
    Animated.timing(fill, {
      toValue: pct,
      duration: 500,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [pct, animated, fill]);

  const width = fill.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <View style={[styles.track, { height, borderRadius: radius }, style]}>
      <Animated.View style={[styles.fill, { width, borderRadius: radius }]}>
        <LinearGradient
          colors={[colors.amber, colors.amberDeep]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradient}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: "100%",
    backgroundColor: colors.line,
    overflow: "hidden",
  },
  fill: { height: "100%", overflow: "hidden" },
  gradient: { flex: 1 },
});
