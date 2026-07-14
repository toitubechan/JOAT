/**
 * CoinBalance — the coins pill (treasure chest + balance).
 *
 * Reads the balance straight from the progress store, so it just drops into any
 * header. When coins are awarded the number counts up and the pill gives a quick
 * "pop" — the instant feedback that makes earning feel good. Optional `onPress`
 * (e.g. to open the Progress tab / store later).
 *
 * Styled with StyleSheet + theme tokens (className is unreliable on device —
 * project memory). The treasure asset routes through the centralized `images`.
 */
import { Image } from "expo-image";
import { Animated, Pressable, StyleSheet, Text, type StyleProp, type ViewStyle } from "react-native";

import { images } from "@/constants/images";
import { useCountUp, usePopOnIncrease } from "@/hooks/animations";
import { useProgressStore } from "@/store";
import { colors, fontFamily, typeScale } from "@/theme";

type CoinBalanceProps = {
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

export function CoinBalance({ onPress, style }: CoinBalanceProps) {
  const coins = useProgressStore((s) => s.coins);
  const display = useCountUp(coins);
  const scale = usePopOnIncrease(coins);

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole={onPress ? "button" : undefined}
      accessibilityLabel={`${coins} coins`}
      style={({ pressed }) => [pressed && onPress && styles.pressed, style]}
    >
      <Animated.View style={[styles.pill, { transform: [{ scale }] }]}>
        <Image source={images.treasure} style={styles.icon} contentFit="contain" />
        <Text style={styles.value}>{display}</Text>
      </Animated.View>
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
    color: colors.coin,
    fontFamily: fontFamily.semibold,
    fontSize: typeScale.bodySm.size,
  },
});
