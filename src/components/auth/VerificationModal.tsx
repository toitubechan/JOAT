/**
 * VerificationModal — bottom sheet that asks for a 6-digit email code.
 *
 * One hidden number-pad TextInput drives six visible digit boxes (far more
 * reliable on Android than juggling focus across six inputs). The sheet tracks
 * the keyboard height and lifts itself so it always sits above the keypad.
 *
 * When the sixth digit lands, `onSubmit(code)` runs. It should verify the code
 * and resolve to an error message to show (kept open for a retry) or `null` on
 * success (the parent flips `visible` off and navigates away).
 */
import { useEffect, useRef, useState } from "react";
import {
  AppState,
  Keyboard,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colors, fontFamily, radii, typeScale } from "@/theme";

const CODE_LENGTH = 6;

type VerificationModalProps = {
  visible: boolean;
  onClose: () => void;
  /**
   * Verify the entered code. Resolve to an error message to display (the sheet
   * stays open for a retry) or `null` on success.
   */
  onSubmit: (code: string) => Promise<string | null>;
  /** Optional: re-send the code. */
  onResend?: () => Promise<void>;
};

export function VerificationModal({
  visible,
  onClose,
  onSubmit,
  onResend,
}: VerificationModalProps) {
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const inputRef = useRef<TextInput>(null);
  const insets = useSafeAreaInsets();

  // Lift the sheet to sit above the keyboard (Android Modals don't reliably
  // resize, so we drive the offset ourselves).
  useEffect(() => {
    const show = Keyboard.addListener("keyboardDidShow", (e) =>
      setKeyboardHeight(e.endCoordinates.height),
    );
    const hide = Keyboard.addListener("keyboardDidHide", () =>
      setKeyboardHeight(0),
    );
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  // When the user leaves to grab the code from their inbox and comes back,
  // bring the keyboard back up — without clearing what they've already typed.
  useEffect(() => {
    if (!visible) return;
    const sub = AppState.addEventListener("change", (state) => {
      if (state === "active") {
        setTimeout(() => inputRef.current?.focus(), 150);
      }
    });
    return () => sub.remove();
  }, [visible]);

  // Reset + focus when the sheet finishes opening (onShow avoids resetting
  // state synchronously inside an effect).
  function handleShow() {
    setCode("");
    setError(null);
    setSubmitting(false);
    // Android needs a beat after the modal window is presented before focus
    // reliably raises the soft keyboard.
    setTimeout(() => inputRef.current?.focus(), 150);
  }

  async function submit(value: string) {
    if (submitting) return;
    Keyboard.dismiss();
    setSubmitting(true);
    setError(null);

    const message = await onSubmit(value);

    if (message) {
      // Verification failed — show the error and let the user re-enter.
      setError(message);
      setCode("");
      setSubmitting(false);
      setTimeout(() => inputRef.current?.focus(), 50);
      return;
    }
    // Success: the parent closes the sheet and navigates away.
    setSubmitting(false);
  }

  function handleChange(text: string) {
    if (submitting) return;
    const digits = text.replace(/\D/g, "").slice(0, CODE_LENGTH);
    setCode(digits);
    setError(null);
    if (digits.length === CODE_LENGTH) {
      submit(digits);
    }
  }

  async function handleResend() {
    if (!onResend || submitting) return;
    setCode("");
    setError(null);
    await onResend();
    inputRef.current?.focus();
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
      onShow={handleShow}
      onRequestClose={onClose}
    >
      {/* Scrim — tap outside to dismiss */}
      <Pressable style={styles.scrim} onPress={onClose} />

      <View
        style={[
          styles.sheet,
          {
            marginBottom: keyboardHeight,
            // Clear the Android navigation bar when the keyboard is down; when
            // it's up the sheet is already lifted above both.
            paddingBottom: 28 + (keyboardHeight > 0 ? 0 : insets.bottom),
          },
        ]}
      >
        <View style={styles.grabber} />

        <Text style={styles.title}>Check your email</Text>
        <Text style={styles.subtitle}>
          We sent a 6-digit verification code to your email. Enter it below to
          continue.
        </Text>

        {/* The boxes are display-only; a transparent, full-size TextInput sits
            on top of them and is the real keyboard target. An opacity:0 / 1px
            input doesn't reliably raise the soft keyboard on Android, so the
            input must stay visible (transparent text) and tappable. */}
        <View style={styles.codeWrap}>
          <View style={styles.boxes} pointerEvents="none">
            {Array.from({ length: CODE_LENGTH }).map((_, i) => {
              const filled = i < code.length;
              const active = i === code.length;
              return (
                <View
                  key={i}
                  style={[
                    styles.box,
                    (filled || active) && styles.boxActive,
                    error && styles.boxError,
                  ]}
                >
                  <Text style={styles.boxDigit}>{code[i] ?? ""}</Text>
                </View>
              );
            })}
          </View>

          <TextInput
            ref={inputRef}
            style={styles.codeInput}
            value={code}
            onChangeText={handleChange}
            keyboardType="number-pad"
            maxLength={CODE_LENGTH}
            editable={!submitting}
            autoFocus
            caretHidden
          />
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        {submitting ? (
          <Text style={styles.statusText}>Verifying…</Text>
        ) : onResend ? (
          <Text style={styles.resend} onPress={handleResend}>
            Didn&apos;t get a code? <Text style={styles.resendLink}>Resend</Text>
          </Text>
        ) : null}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  scrim: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  sheet: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.surfaceRaised,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 12,
  },
  grabber: {
    alignSelf: "center",
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.line,
    marginBottom: 18,
  },
  title: {
    color: colors.txt,
    fontFamily: fontFamily.semibold,
    fontSize: typeScale.h3.size,
    lineHeight: typeScale.h3.lineHeight,
  },
  subtitle: {
    color: colors.txtSecondary,
    fontFamily: fontFamily.regular,
    fontSize: typeScale.body.size,
    lineHeight: typeScale.body.lineHeight,
    marginTop: 8,
  },

  codeWrap: {
    marginTop: 24,
    position: "relative",
  },
  boxes: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  box: {
    flex: 1,
    height: 58,
    marginHorizontal: 4,
    borderRadius: radii.input,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.line,
    alignItems: "center",
    justifyContent: "center",
  },
  boxActive: { borderColor: colors.amber },
  boxError: { borderColor: colors.danger },
  boxDigit: {
    color: colors.txt,
    fontFamily: fontFamily.semibold,
    fontSize: typeScale.h2.size,
  },

  errorText: {
    color: colors.danger,
    fontFamily: fontFamily.regular,
    fontSize: typeScale.caption.size,
    lineHeight: typeScale.caption.lineHeight,
    marginTop: 12,
  },
  statusText: {
    color: colors.txtSecondary,
    fontFamily: fontFamily.medium,
    fontSize: typeScale.body.size,
    marginTop: 16,
  },
  resend: {
    color: colors.txtSecondary,
    fontFamily: fontFamily.regular,
    fontSize: typeScale.body.size,
    marginTop: 16,
  },
  resendLink: {
    color: colors.amber,
    fontFamily: fontFamily.bold,
  },

  // Overlays the digit boxes as the real keypad target. Kept visible (Android
  // won't show the keyboard for an opacity:0 input) but with transparent text
  // so the digits only ever appear in the boxes above.
  codeInput: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    color: "transparent",
    backgroundColor: "transparent",
    textAlign: "center",
    fontSize: 1,
  },
});
