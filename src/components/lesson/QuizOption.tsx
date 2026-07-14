/**
 * QuizOption — one answer row in the end-of-lesson quiz (design 07).
 *
 * Before answering: a surface card with an empty ring and white text. After
 * answering, the row reflects the result — the correct option turns green with a
 * check (whether or not it was picked), a wrong pick turns red with an X, and the
 * untouched options dim. Styled with StyleSheet + theme tokens.
 */
import { Image } from "expo-image";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { images } from "@/constants/images";
import { colors, fontFamily, radii, typeScale } from "@/theme";

export type QuizOptionState = "idle" | "correct" | "wrong" | "muted";

type QuizOptionProps = {
  text: string;
  state: QuizOptionState;
  disabled: boolean;
  onPress: () => void;
};

export function QuizOption({ text, state, disabled, onPress }: QuizOptionProps) {
  const isCorrect = state === "correct";
  const isWrong = state === "wrong";

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.row,
        isCorrect && styles.rowCorrect,
        isWrong && styles.rowWrong,
        state === "muted" && styles.rowMuted,
        pressed && !disabled && styles.pressed,
      ]}
    >
      <View
        style={[
          styles.marker,
          isCorrect && styles.markerCorrect,
          isWrong && styles.markerWrong,
        ]}
      >
        {isCorrect && (
          <Image source={images.checkWhite} style={styles.markerIcon} contentFit="contain" />
        )}
        {isWrong && (
          <Image source={images.closeWhite} style={styles.markerIcon} contentFit="contain" />
        )}
      </View>

      <Text
        style={[
          styles.text,
          isCorrect && styles.textCorrect,
          isWrong && styles.textWrong,
        ]}
      >
        {text}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    minHeight: 64,
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.line,
    borderRadius: radii.card,
  },
  rowCorrect: {
    backgroundColor: colors.successBg,
    borderColor: colors.success,
  },
  rowWrong: {
    backgroundColor: colors.dangerBg,
    borderColor: colors.danger,
  },
  rowMuted: { opacity: 0.55 },
  pressed: { opacity: 0.85 },

  marker: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: colors.txtMuted,
    alignItems: "center",
    justifyContent: "center",
  },
  markerCorrect: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  markerWrong: {
    backgroundColor: colors.danger,
    borderColor: colors.danger,
  },
  markerIcon: { width: 13, height: 13 },

  text: {
    flex: 1,
    color: colors.txt,
    fontFamily: fontFamily.medium,
    fontSize: typeScale.h4.size,
    lineHeight: 22,
  },
  textCorrect: { color: colors.successText },
  textWrong: { color: colors.txt },
});
