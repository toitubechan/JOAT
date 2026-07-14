/**
 * CategoryCard — one cell of the "Pick your first category" grid.
 *
 * Colored icon tile + title + "N lessons", on a `surface` card. Selected gets the
 * amber border + check badge; coin-locked categories show a coin-cost badge
 * instead (the unlock flow is a later monetization step). Styled with
 * StyleSheet + theme tokens (className is unreliable on device — project memory).
 */
import { Image } from "expo-image";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { images } from "@/constants/images";
import type { Category } from "@/data/topics";
import { categoryColors, colors, fontFamily, radii, typeScale } from "@/theme";

type CategoryCardProps = {
  category: Category;
  selected: boolean;
  /** Computed column width so the two-column grid lines up edge to edge. */
  width: number;
  /** Pro unlocks every category — drops the coin gate so it behaves as free. */
  proUnlocked?: boolean;
  onPress: () => void;
};

export function CategoryCard({
  category,
  selected,
  width,
  proUnlocked = false,
  onPress,
}: CategoryCardProps) {
  // Coin-locked unless the user owns Pro (Pro unlocks all content).
  const locked = category.coinCost != null && !proUnlocked;
  const tile = categoryColors[category.slug];

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        { width },
        selected && styles.cardSelected,
        pressed && styles.pressed,
      ]}
    >
      <View style={[styles.tile, { backgroundColor: tile.bg }]}>
        <Image source={images[category.icon]} style={styles.icon} contentFit="cover" />
      </View>

      <Text style={styles.name} numberOfLines={2}>
        {category.title}
      </Text>
      <Text style={styles.count}>{category.lessonCount} lessons</Text>

      {/* Top-right badge: a coin cost when locked, else a check when selected. */}
      {locked ? (
        <View style={styles.coinBadge}>
          <Image source={images.coinIcon} style={styles.coinIcon} contentFit="contain" />
          <Text style={styles.coinText}>{category.coinCost}</Text>
        </View>
      ) : selected ? (
        <View style={styles.checkBadge}>
          <Image source={images.checkDark} style={styles.checkIcon} contentFit="contain" />
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 132,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.line,
    borderRadius: radii.card,
    padding: 14,
  },
  cardSelected: {
    borderWidth: 2,
    borderColor: colors.amber,
    backgroundColor: "#231F14", // amber-tinted ink for the selected state
  },
  pressed: { opacity: 0.85 },

  tile: {
    width: 42,
    height: 42,
    borderRadius: radii.tile,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden", // clip the hero illustration to the rounded tile
  },
  icon: { width: "100%", height: "100%" },

  name: {
    color: colors.txt,
    fontFamily: fontFamily.semibold,
    fontSize: 16,
    lineHeight: 21,
    marginTop: 14,
  },
  count: {
    color: colors.txtMuted,
    fontFamily: fontFamily.regular,
    fontSize: typeScale.bodySm.size,
    lineHeight: typeScale.bodySm.lineHeight,
    marginTop: 4,
  },

  checkBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.amber,
    alignItems: "center",
    justifyContent: "center",
  },
  checkIcon: { width: 13, height: 13 },

  coinBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: colors.line,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  coinIcon: { width: 14, height: 14 },
  coinText: {
    color: colors.coin,
    fontFamily: fontFamily.semibold,
    fontSize: 12,
  },
});
