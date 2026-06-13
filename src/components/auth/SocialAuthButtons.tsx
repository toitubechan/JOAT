/**
 * SocialAuthButtons — "or continue with" divider + a white Google button.
 *
 * Google sign-in runs through Clerk's `useSSO()` flow, which opens the system
 * browser (expo-web-browser) for the OAuth handshake and returns a session.
 * The same component works on both the sign-in and sign-up screens. Brand logos
 * are SVGs rendered via expo-image through the centralized `images` object.
 */
import { useSSO } from "@clerk/expo";
import { Image } from "expo-image";
import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { images } from "@/constants/images";
import { clerkErrorMessage } from "@/lib/clerkErrors";
import { colors, fontFamily, radii, typeScale } from "@/theme";

// Finishes any auth session left dangling in the in-app browser (e.g. if the
// user navigated back). Safe to call at module scope.
WebBrowser.maybeCompleteAuthSession();

type SocialAuthButtonsProps = {
  /** Override the default Clerk Google flow (rarely needed). */
  onGoogle?: () => void;
};

export function SocialAuthButtons({ onGoogle }: SocialAuthButtonsProps) {
  const { startSSOFlow } = useSSO();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGoogle() {
    if (onGoogle) return onGoogle();
    if (busy) return;

    setBusy(true);
    setError(null);
    try {
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy: "oauth_google",
      });

      // createdSessionId is null if the user dismissed the browser without
      // completing sign-in — just stop quietly in that case.
      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
        router.replace("/");
      }
    } catch (err) {
      setError(clerkErrorMessage(err, "Google sign-in failed. Please try again."));
    } finally {
      setBusy(false);
    }
  }

  return (
    <View>
      {/* Divider: 1px rule — caption — 1px rule */}
      <View style={styles.divider}>
        <View style={styles.rule} />
        <Text style={styles.dividerText}>or continue with</Text>
        <View style={styles.rule} />
      </View>

      <SocialButton
        logo={images.googleLogo}
        label={busy ? "Connecting…" : "Continue with Google"}
        onPress={handleGoogle}
        disabled={busy}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

function SocialButton({
  logo,
  label,
  onPress,
  disabled,
  style,
}: {
  logo: number;
  label: string;
  onPress?: () => void;
  disabled?: boolean;
  style?: object;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.social,
        style,
        pressed && styles.socialPressed,
        disabled && styles.socialDisabled,
      ]}
    >
      <Image source={logo} style={styles.logo} contentFit="contain" />
      <Text style={styles.socialLabel}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  divider: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginVertical: 18,
  },
  rule: { flex: 1, height: 1, backgroundColor: colors.line },
  dividerText: {
    color: colors.txtMuted,
    fontFamily: fontFamily.medium,
    fontSize: typeScale.caption.size,
  },

  social: {
    height: 52,
    borderRadius: radii.input,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  socialPressed: { backgroundColor: "#F2F3F7" },
  socialDisabled: { opacity: 0.6 },
  logo: { width: 20, height: 20 },
  socialLabel: {
    color: colors.txtOnAmber,
    fontFamily: fontFamily.semibold,
    fontSize: typeScale.body.size,
  },

  error: {
    color: colors.danger,
    fontFamily: fontFamily.regular,
    fontSize: typeScale.caption.size,
    lineHeight: typeScale.caption.lineHeight,
    marginTop: 10,
    textAlign: "center",
  },
});
