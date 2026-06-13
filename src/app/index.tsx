import { useAuth, useUser } from "@clerk/expo";
import { Redirect } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { colors, fontFamily, radii, typeScale } from "@/theme";

export default function Home() {
  const { isLoaded, isSignedIn, signOut } = useAuth();
  const { user } = useUser();

  // Hold an empty screen until Clerk has restored the session from the cache,
  // so we don't flash a redirect to onboarding for a returning, signed-in user.
  if (!isLoaded) {
    return <View style={styles.screen} />;
  }

  // Auth gate: signed-out users start at onboarding; signed-in users see home.
  if (!isSignedIn) {
    return <Redirect href="/onboarding" />;
  }

  const email = user?.primaryEmailAddress?.emailAddress;

  return (
    <SafeAreaView style={styles.screen}>
      <Text style={styles.title}>Joat</Text>

      <View style={styles.authBlock}>
        <Text style={styles.signedInLabel}>Signed in as</Text>
        <Text style={styles.email}>{email}</Text>
        <Pressable
          onPress={() => signOut()}
          style={({ pressed }) => [styles.outlineButton, pressed && styles.pressed]}
        >
          <Text style={styles.outlineButtonText}>Sign out</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.ink,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  title: {
    color: colors.txt,
    fontFamily: fontFamily.semibold,
    fontSize: typeScale.h2.size,
    marginBottom: 24,
  },

  authBlock: { width: "100%", gap: 12, marginBottom: 28 },
  signedInLabel: {
    color: colors.txtMuted,
    fontFamily: fontFamily.regular,
    fontSize: typeScale.caption.size,
    textAlign: "center",
  },
  email: {
    color: colors.txt,
    fontFamily: fontFamily.semibold,
    fontSize: typeScale.bodyLg.size,
    textAlign: "center",
    marginBottom: 8,
  },

  outlineButton: {
    width: "100%",
    borderWidth: 1,
    borderColor: colors.line,
    paddingVertical: 16,
    borderRadius: radii.card,
    alignItems: "center",
  },
  outlineButtonText: {
    color: colors.txt,
    fontFamily: fontFamily.semibold,
    fontSize: typeScale.h4.size,
  },

  pressed: { opacity: 0.85 },
});
