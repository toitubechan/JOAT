/**
 * PrimaryButton — the app's main amber call-to-action.
 *
 * Amber gradient (`cta`), full-width, 56dp tall, rounded-card. Styled with
 * StyleSheet + theme tokens (NativeWind className is unreliable on device, see
 * AGENTS.md / project memory).
 */
import { LinearGradient } from "expo-linear-gradient";
import {
  Pressable,
  StyleSheet,
  Text,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { colors, fontFamily, radii, spacing } from "@/theme";

type PrimaryButtonProps = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  /** Extra layout styling (e.g. margins) from the calling screen. */
  style?: StyleProp<ViewStyle>;
};

export function PrimaryButton({
  label,
  onPress,
  disabled,
  style,
}: PrimaryButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        style,
        pressed && styles.pressed,
        disabled && styles.disabled,
      ]}
    >
      <LinearGradient
        colors={[colors.amber, colors.amberDeep]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <Text style={styles.label}>{label}</Text>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: spacing.btnH,
    borderRadius: radii.card,
    overflow: "hidden",
  },
  pressed: { opacity: 0.9 },
  disabled: { opacity: 0.4 },
  gradient: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    color: colors.txtOnAmber,
    fontFamily: fontFamily.bold,
    fontSize: 17,
  },
});
