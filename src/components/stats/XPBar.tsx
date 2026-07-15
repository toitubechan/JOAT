/**
 * XPBar — level + progress toward the next level.
 *
 * Reads total XP from the progress store and resolves it through the XP→level
 * curve (`levelInfo`) into "Level N" and how far into that level the user is.
 * The fill glides to its new width after an award, and the level chip pops when
 * XP is gained — cheap, instant feedback for the leveling loop.
 *
 * Styled with StyleSheet + theme tokens (className is unreliable on device —
 * project memory).
 */
import { useMemo } from "react";
import { Image } from "expo-image";
import { Animated, StyleSheet, Text, View, type StyleProp, type ViewStyle } from "react-native";

import { ProgressBar } from "@/components/ProgressBar";
import { images } from "@/constants/images";
import { usePopOnIncrease } from "@/hooks/animations";
import { useProgressStore } from "@/store";
import { levelInfo } from "@/store/progress";
import { fontFamily, radii, typeScale, useThemedStyles, type ThemeColors } from "@/theme";

type XPBarProps = {
  style?: StyleProp<ViewStyle>;
};

export function XPBar({ style }: XPBarProps) {
  const styles = useThemedStyles(makeStyles);
  const xp = useProgressStore((s) => s.xp);
  const { level, xpIntoLevel, xpForLevel } = useMemo(() => levelInfo(xp), [xp]);
  const scale = usePopOnIncrease(xp);

  const remaining = Math.max(0, xpForLevel - xpIntoLevel);

  return (
    <View style={style}>
      <View style={styles.row}>
        <Animated.View style={[styles.levelChip, { transform: [{ scale }] }]}>
          <Image source={images.boltAmber} style={styles.bolt} contentFit="contain" />
          <Text style={styles.levelText}>Level {level}</Text>
        </Animated.View>
        <Text style={styles.xpText}>
          {xpIntoLevel} <Text style={styles.xpMuted}>/ {xpForLevel} XP</Text>
        </Text>
      </View>

      <ProgressBar progress={xpForLevel > 0 ? xpIntoLevel / xpForLevel : 0} animated style={styles.bar} />

      <Text style={styles.caption}>{remaining} XP to level {level + 1}</Text>
    </View>
  );
}

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  levelChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radii.tile,
    backgroundColor: c.coinBg,
    borderWidth: 1,
    borderColor: c.coinBorder,
  },
  bolt: { width: 16, height: 16 },
  levelText: {
    color: c.amber,
    fontFamily: fontFamily.bold,
    fontSize: typeScale.bodySm.size,
  },
  xpText: {
    color: c.txt,
    fontFamily: fontFamily.bold,
    fontSize: typeScale.h4.size,
  },
  xpMuted: {
    color: c.txtMuted,
    fontFamily: fontFamily.medium,
    fontSize: typeScale.bodySm.size,
  },
  bar: { marginTop: 14, height: 10 },
  caption: {
    color: c.txtMuted,
    fontFamily: fontFamily.regular,
    fontSize: typeScale.caption.size,
    marginTop: 8,
  },
});
