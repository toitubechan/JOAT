import { useSignUp } from "@clerk/expo";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AuthHeader } from "@/components/auth/AuthHeader";
import { AuthInput } from "@/components/auth/AuthInput";
import { SocialAuthButtons } from "@/components/auth/SocialAuthButtons";
import { VerificationModal } from "@/components/auth/VerificationModal";
import { PrimaryButton } from "@/components/PrimaryButton";
import { clerkErrorMessage } from "@/lib/clerkErrors";
import { validateEmail, validatePassword } from "@/lib/validation";
import { colors, fontFamily, spacing, typeScale } from "@/theme";

export default function SignUp() {
  const { signUp } = useSignUp();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showVerify, setShowVerify] = useState(false);

  // Track an explicit dismissal so we don't fight the user by reopening the
  // sheet right after they close it.
  const dismissedVerify = useRef(false);

  // Clerk keeps the in-progress sign-up — and the code it already emailed —
  // even if this screen remounts (e.g. Expo Go reloads while the user is in
  // their email app copying the code). Reopen the verification sheet in that
  // case so the copied code stays valid instead of forcing a fresh one.
  const pendingVerification =
    signUp.status === "missing_requirements" &&
    (signUp.unverifiedFields?.includes("email_address") ?? false);

  useEffect(() => {
    if (pendingVerification && !dismissedVerify.current) {
      setShowVerify(true);
    }
  }, [pendingVerification]);

  async function handleSignUp() {
    const eErr = validateEmail(email);
    const pErr = validatePassword(password);
    setEmailError(eErr);
    setPasswordError(pErr);
    setFormError(null);
    if (eErr || pErr) return;

    setSubmitting(true);

    // Create the sign-up with email + password.
    const { error } = await signUp.password({
      emailAddress: email.trim(),
      password,
    });
    if (error) {
      setSubmitting(false);
      setFormError(clerkErrorMessage(error));
      return;
    }

    // If the instance doesn't require email verification, we're already done.
    if (signUp.status === "complete") {
      const { error: finErr } = await signUp.finalize();
      setSubmitting(false);
      if (finErr) {
        setFormError(clerkErrorMessage(finErr));
        return;
      }
      router.replace("/");
      return;
    }

    // Otherwise send the 6-digit email code and open the verification sheet.
    const { error: sendErr } = await signUp.verifications.sendEmailCode();
    setSubmitting(false);
    if (sendErr) {
      setFormError(clerkErrorMessage(sendErr));
      return;
    }
    dismissedVerify.current = false;
    setShowVerify(true);
  }

  // Verify the emailed code; returns an error message to show in the sheet, or
  // null on success (we activate the session and head to the feed).
  async function verifyCode(code: string): Promise<string | null> {
    const { error } = await signUp.verifications.verifyEmailCode({ code });
    if (error) return clerkErrorMessage(error);
    if (signUp.status !== "complete") {
      return "We couldn't verify that code. Please try again.";
    }
    const { error: finErr } = await signUp.finalize();
    if (finErr) return clerkErrorMessage(finErr);

    setShowVerify(false);
    router.replace("/");
    return null;
  }

  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <AuthHeader
            title="Create your account"
            subtitle="Your first lesson is 30 seconds away"
          />

          <View style={styles.form}>
            <AuthInput
              label="Email"
              value={email}
              onChangeText={(t) => {
                setEmail(t);
                setEmailError(null);
                setFormError(null);
              }}
              placeholder="you@example.com"
              keyboardType="email-address"
              error={emailError}
            />
            <AuthInput
              label="Password"
              value={password}
              onChangeText={(t) => {
                setPassword(t);
                setPasswordError(null);
                setFormError(null);
              }}
              placeholder="Create a password"
              secure
              error={passwordError}
            />
          </View>

          {formError ? <Text style={styles.formError}>{formError}</Text> : null}

          <PrimaryButton
            label={submitting ? "Creating account…" : "Sign Up"}
            onPress={handleSignUp}
            disabled={submitting}
            style={styles.cta}
          />

          <SocialAuthButtons />
        </ScrollView>

        {/* Footer pinned to the bottom of the screen. */}
        <Pressable
          style={styles.footer}
          onPress={() => router.push("/sign-in")}
        >
          <Text style={styles.footerText}>
            Already have an account? <Text style={styles.footerLink}>Log in</Text>
          </Text>
        </Pressable>
      </SafeAreaView>

      <VerificationModal
        visible={showVerify}
        onClose={() => {
          dismissedVerify.current = true;
          setShowVerify(false);
        }}
        onSubmit={verifyCode}
        onResend={async () => {
          await signUp.verifications.sendEmailCode();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.ink },
  safe: { flex: 1 },
  content: {
    paddingHorizontal: spacing.screen,
    paddingBottom: 8,
    flexGrow: 1,
  },

  form: { gap: 14, marginTop: 22 },
  cta: { marginTop: 22 },

  formError: {
    color: colors.danger,
    fontFamily: fontFamily.regular,
    fontSize: typeScale.body.size,
    lineHeight: typeScale.body.lineHeight,
    marginTop: 16,
  },

  footer: {
    alignItems: "center",
    paddingHorizontal: spacing.screen,
    paddingTop: 10,
  },
  footerText: {
    color: colors.txtSecondary,
    fontFamily: fontFamily.regular,
    fontSize: typeScale.body.size,
  },
  footerLink: {
    color: colors.amber,
    fontFamily: fontFamily.bold,
  },
});
