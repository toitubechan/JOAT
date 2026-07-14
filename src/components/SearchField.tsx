/**
 * SearchField — a live text input with a search glyph and a clear (X) button.
 *
 * Shared so Explore (prompt 19) and the category-selection search (prompt 22)
 * look and behave identically. TextInput is an Android style-exception component
 * (input props aren't expressible via className), so it's styled with
 * StyleSheet + theme tokens; the glyphs route through the centralized images.
 */
import { Image } from "expo-image";
import {
  Pressable,
  StyleSheet,
  TextInput,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { images } from "@/constants/images";
import { colors, fontFamily, radii, typeScale } from "@/theme";

type SearchFieldProps = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  style?: StyleProp<ViewStyle>;
};

export function SearchField({
  value,
  onChangeText,
  placeholder = "Search",
  style,
}: SearchFieldProps) {
  const hasText = value.length > 0;

  return (
    <View style={[styles.field, style]}>
      <Image source={images.searchIcon} style={styles.icon} contentFit="contain" />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.txtMuted}
        style={styles.input}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
        accessibilityLabel={placeholder}
      />
      {hasText && (
        <Pressable
          onPress={() => onChangeText("")}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel="Clear search"
          style={({ pressed }) => [styles.clear, pressed && styles.pressed]}
        >
          <Image source={images.closeWhite} style={styles.clearIcon} contentFit="contain" />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radii.input,
    paddingHorizontal: 16,
  },
  icon: { width: 18, height: 18 },
  input: {
    flex: 1,
    color: colors.txt,
    fontFamily: fontFamily.regular,
    fontSize: typeScale.bodyLg.size,
    padding: 0,
  },
  clear: {
    width: 22,
    height: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  clearIcon: { width: 14, height: 14 },
  pressed: { opacity: 0.6 },
});
