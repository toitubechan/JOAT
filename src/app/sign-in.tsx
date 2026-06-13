import { useSignIn } from "@clerk/expo";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
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
import { PrimaryButton } from "@/components/PrimaryButton";
import { clerkErrorMessage } from "@/lib/clerkErrors";
import { validateEmail, validatePassword } from "@/lib/validation";
import { colors, fontFamily, spacing, typeScale } from "@/theme";

export default function SignIn() {
  const { signIn } = useSignIn();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSignIn() {
    const eErr = validateEmail(email);
    const pErr = validatePassword(password);
    setEmailError(eErr);
    setPasswordError(pErr);
    setFormError(null);
    if (eErr || pErr) return;

    setSubmitting(true);

    const { error } = await signIn.password({
      identifier: email.trim(),
      password,
    });
    if (error) {
      setSubmitting(false);
      setFormError(clerkErrorMessage(error));
      return;
    }

    if (signIn.status === "complete") {
      const { error: finErr } = await signIn.finalize();
      setSubmitting(false);
      if (finErr) {
        setFormError(clerkErrorMessage(finErr));
        return;
      }
      router.replace("/");
      return;
    }

    // Anything else (e.g. multi-factor) isn't part of this version's flow.
    setSubmitting(false);
    setFormError("Additional verification is required to sign in.");
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
            title="Welcome back"
            subtitle="Pick up right where you left off"
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
              placeholder="Enter your password"
              secure
              error={passwordError}
            />
          </View>

          {formError ? <Text style={styles.formError}>{formError}</Text> : null}

          <PrimaryButton
            label={submitting ? "Signing in…" : "Sign In"}
            onPress={handleSignIn}
            disabled={submitting}
            style={styles.cta}
          />

          <SocialAuthButtons />
        </ScrollView>

        {/* Footer pinned to the bottom of the screen. */}
        <Pressable
          style={styles.footer}
          onPress={() => router.push("/sign-up")}
        >
          <Text style={styles.footerText}>
            Don&apos;t have an account?{" "}
            <Text style={styles.footerLink}>Sign up</Text>
          </Text>
        </Pressable>
      </SafeAreaView>
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
