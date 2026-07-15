/**
 * DailyGoalCard — "Daily goal" surface card: today's XP toward the daily target,
 * a bolt glyph, and a progress bar. Reads `current`/`goal` from the screen
 * (which pulls them from the progress store). Styled with StyleSheet + tokens.
 */
import { Image } from "expo-image";
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from "react-native";

import { ProgressBar } from "@/components/ProgressBar";
import { images } from "@/constants/images";
import { fontFamily, radii, typeScale, useThemedStyles, type ThemeColors } from "@/theme";

type DailyGoalCardProps = {
  /** XP earned today. */
  current: number;
  /** Daily XP target. */
  goal: number;
  /** Layout styling (e.g. margins) from the calling screen. */
  style?: StyleProp<ViewStyle>;
};

export function DailyGoalCard({ current, goal, style }: DailyGoalCardProps) {
  const styles = useThemedStyles(makeStyles);
  const progress = goal > 0 ? current / goal : 0;

  return (
    <View style={[styles.card, style]}>
      <View style={styles.row}>
        <View style={styles.textCol}>
          <Text style={styles.label}>Daily goal</Text>
          <View style={styles.valueRow}>
            <Text style={styles.value}>{current}</Text>
            <Text style={styles.goal}> / {goal} XP</Text>
          </View>
        </View>
        <Image source={images.boltAmber} style={styles.bolt} contentFit="contain" />
      </View>

      <ProgressBar progress={progress} style={styles.bar} />
    </View>
  );
}

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
  card: {
    backgroundColor: c.surface,
    borderWidth: 1,
    borderColor: c.line,
    borderRadius: radii.hero,
    paddingVertical: 18,
    paddingHorizontal: 18,
    // Soft Android elevation (className shadow mapping is unreliable).
    elevation: 2,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  textCol: { flex: 1 },
  label: {
    color: c.txtSecondary,
    fontFamily: fontFamily.medium,
    fontSize: typeScale.body.size,
  },
  valueRow: {
    flexDirection: "row",
    alignItems: "baseline",
    marginTop: 4,
  },
  value: {
    color: c.txt,
    fontFamily: fontFamily.bold,
    fontSize: typeScale.h2.size,
    lineHeight: typeScale.h2.size,
  },
  goal: {
    color: c.txtMuted,
    fontFamily: fontFamily.medium,
    fontSize: typeScale.h4.size,
  },
  bolt: { width: 34, height: 34 },
  bar: { marginTop: 16 },
});
