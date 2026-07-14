/**
 * StreakBadge — the daily-streak pill (flame + day count).
 *
 * Reads the streak from the progress store. The flame stays alive with a gentle
 * continuous pulse while a streak is running, and gives an extra punch the day
 * the streak ticks up — combined into one transform via `Animated.multiply`.
 * A streak of 0 rests still. Optional `onPress` (e.g. open the Progress tab).
 *
 * Styled with StyleSheet + theme tokens (className is unreliable on device —
 * project memory). The streak-fire asset routes through the centralized `images`.
 */
import { Image } from "expo-image";
import { Animated, Pressable, StyleSheet, Text, type StyleProp, type ViewStyle } from "react-native";

import { images } from "@/constants/images";
import { usePopOnIncrease, usePulse } from "@/hooks/animations";
import { useProgressStore } from "@/store";
import { colors, fontFamily, typeScale } from "@/theme";

type StreakBadgeProps = {
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

export function StreakBadge({ onPress, style }: StreakBadgeProps) {
  const streak = useProgressStore((s) => s.dailyStreak);

  // Breathe while the streak is alive, and pop on the day it grows.
  const pulse = usePulse(streak > 0);
  const pop = usePopOnIncrease(streak, 1.4);
  const flameScale = Animated.multiply(pulse, pop);

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole={onPress ? "button" : undefined}
      accessibilityLabel={`${streak} day streak`}
      style={({ pressed }) => [styles.pill, pressed && onPress && styles.pressed, style]}
    >
      <Animated.View style={{ transform: [{ scale: flameScale }] }}>
        <Image source={images.streakFire} style={styles.icon} contentFit="contain" />
      </Animated.View>
      <Text style={styles.value}>{streak}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pill: {
    height: 38,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 999,
  },
  pressed: { opacity: 0.7 },
  icon: { width: 18, height: 18 },
  value: {
    color: colors.streak,
    fontFamily: fontFamily.semibold,
    fontSize: typeScale.bodySm.size,
  },
});
