/**
 * AuthInput — labeled text field used by the auth screens.
 *
 * Stacked label (always visible) over the value, on a `surface` card with a
 * `line` border that turns amber while focused. Pass `secure` for the password
 * field to get a working show / hide toggle.
 */
import { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  type KeyboardTypeOptions,
  type TextInputProps,
} from "react-native";

import { colors, fontFamily, radii, spacing, typeScale } from "@/theme";

type AuthInputProps = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: TextInputProps["autoCapitalize"];
  /** Password mode: masks input and renders a show / hide toggle. */
  secure?: boolean;
  /** Validation message shown under the field (danger state) when set. */
  error?: string | null;
};

export function AuthInput({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  autoCapitalize = "none",
  secure = false,
  error,
}: AuthInputProps) {
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(true);

  return (
    <View>
      <View
        style={[
          styles.field,
          focused && styles.fieldFocused,
          error && styles.fieldError,
        ]}
      >
        <Text style={styles.label}>{label}</Text>

        <View style={styles.row}>
          <TextInput
            style={styles.input}
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor={colors.txtMuted}
            keyboardType={keyboardType}
            autoCapitalize={autoCapitalize}
            autoCorrect={false}
            secureTextEntry={secure && hidden}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
          />

          {secure && (
            <Text style={styles.toggle} onPress={() => setHidden((h) => !h)}>
              {hidden ? "show" : "hide"}
            </Text>
          )}
        </View>
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    height: spacing.inputH,
    borderRadius: radii.input,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    paddingHorizontal: 18,
    justifyContent: "center",
  },
  fieldFocused: { borderColor: colors.amber },
  fieldError: { borderColor: colors.danger },

  label: {
    color: colors.txtMuted,
    fontFamily: fontFamily.medium,
    fontSize: typeScale.caption.size,
    lineHeight: typeScale.caption.lineHeight,
  },

  row: { flexDirection: "row", alignItems: "center" },
  input: {
    flex: 1,
    color: colors.txt,
    fontFamily: fontFamily.regular,
    fontSize: typeScale.bodyLg.size,
    paddingVertical: 2,
    paddingTop: 2,
  },
  toggle: {
    color: colors.txtSecondary,
    fontFamily: fontFamily.regular,
    fontSize: typeScale.body.size,
    marginLeft: 12,
  },
  errorText: {
    color: colors.danger,
    fontFamily: fontFamily.regular,
    fontSize: typeScale.caption.size,
    lineHeight: typeScale.caption.lineHeight,
    marginTop: 6,
    marginLeft: 4,
  },
});
