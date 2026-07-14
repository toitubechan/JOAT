/**
 * StatPill — a rounded `surface` pill with an icon and an optional count.
 *
 * The home header uses it for the streak (flame + count, streak tint) and coins
 * (treasure + count, coin tint); the value-less variant is the icon-only bell
 * button. Styled with StyleSheet + theme tokens per project convention.
 */
import { Image } from "expo-image";
import { Pressable, StyleSheet, Text } from "react-native";

import { images, type ImageKey } from "@/constants/images";
import { colors, fontFamily, typeScale } from "@/theme";

type StatPillProps = {
  icon: ImageKey;
  /** Count shown next to the icon; omit for the icon-only (bell) variant. */
  value?: number | string;
  /** Tint for the count text (streak vs coin). */
  valueColor?: string;
  onPress?: () => void;
  accessibilityLabel?: string;
};

export function StatPill({
  icon,
  value,
  valueColor = colors.txt,
  onPress,
  accessibilityLabel,
}: StatPillProps) {
  const iconOnly = value === undefined;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={({ pressed }) => [
        styles.pill,
        iconOnly && styles.iconOnly,
        pressed && onPress && styles.pressed,
      ]}
    >
      <Image source={images[icon]} style={styles.icon} contentFit="contain" />
      {!iconOnly && (
        <Text style={[styles.value, { color: valueColor }]}>{value}</Text>
      )}
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
  // Icon-only (bell): a square-ish pill with even padding.
  iconOnly: {
    width: 38,
    paddingHorizontal: 0,
    justifyContent: "center",
  },
  pressed: { opacity: 0.7 },
  icon: { width: 18, height: 18 },
  value: {
    fontFamily: fontFamily.semibold,
    fontSize: typeScale.bodySm.size,
  },
});
