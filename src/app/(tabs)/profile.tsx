import { useAuth, useUser } from "@clerk/expo";
import { Image } from "expo-image";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { images } from "@/constants/images";
import { usePreferencesStore, useProgressStore } from "@/store";
import { colors, fontFamily, radii, spacing, typeScale } from "@/theme";

/**
 * Profile — placeholder. Carries the auth/dev controls (sign out + reset) that
 * previously lived on the root screen so the flow stays testable in Expo Go.
 */
export default function ProfileScreen() {
  const { signOut } = useAuth();
  const { user } = useUser();
  const email = user?.primaryEmailAddress?.emailAddress;
  const isPro = useProgressStore((s) => s.isPro);

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <Text style={styles.title}>Profile</Text>

      {/* Joat Pro: an upsell card when free, an "active" badge when subscribed.
          Both open the paywall (Pro users see their status / can manage). */}
      {isPro ? (
        <Pressable
          onPress={() => router.push("/paywall")}
          style={({ pressed }) => [styles.proCard, styles.proCardActive, pressed && styles.pressed]}
        >
          <View style={styles.proActiveBadge}>
            <Image source={images.checkWhite} style={styles.proCheckIcon} contentFit="contain" />
          </View>
          <View style={styles.proCardText}>
            <Text style={styles.proTitle}>Joat Pro</Text>
            <Text style={styles.proSubtitleActive}>Active — no ads, everything unlocked</Text>
          </View>
        </Pressable>
      ) : (
        <Pressable
          onPress={() => router.push("/paywall")}
          style={({ pressed }) => [styles.proCard, pressed && styles.pressed]}
        >
          <Image source={images.treasure} style={styles.proTreasure} contentFit="contain" />
          <View style={styles.proCardText}>
            <Text style={styles.proTitle}>Upgrade to Joat Pro</Text>
            <Text style={styles.proSubtitle}>No ads · every category unlocked</Text>
          </View>
        </Pressable>
      )}

      <View style={styles.block}>
        <Text style={styles.signedInLabel}>Signed in as</Text>
        <Text style={styles.email}>{email}</Text>

        <Pressable
          onPress={() => signOut()}
          style={({ pressed }) => [styles.outlineButton, pressed && styles.pressed]}
        >
          <Text style={styles.outlineButtonText}>Sign out</Text>
        </Pressable>

        {/* Dev-only control (compiled out of release builds): clearing topics
            sends you back through the category gate. */}
        {__DEV__ && (
          <Pressable
            onPress={() => {
              useProgressStore.getState().reset();
              usePreferencesStore.getState().reset();
            }}
            style={({ pressed }) => [styles.resetButton, pressed && styles.pressed]}
          >
            <Text style={styles.resetButtonText}>Reset progress / clear storage</Text>
          </Pressable>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.ink,
    paddingHorizontal: spacing.screen,
  },
  title: {
    color: colors.txt,
    fontFamily: fontFamily.semibold,
    fontSize: typeScale.h2.size,
    marginTop: 8,
    marginBottom: 24,
  },

  // Joat Pro upsell / status card.
  proCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: "#231F14", // amber-tinted ink (matches the selected-category card)
    borderWidth: 1.5,
    borderColor: colors.amber,
    borderRadius: radii.hero,
    padding: 16,
    marginBottom: 24,
  },
  proCardActive: {
    backgroundColor: colors.tealBg,
    borderColor: colors.tealBorder,
  },
  proTreasure: { width: 40, height: 40 },
  proActiveBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.teal,
    alignItems: "center",
    justifyContent: "center",
  },
  proCheckIcon: { width: 20, height: 20 },
  proCardText: { flex: 1 },
  proTitle: {
    color: colors.txt,
    fontFamily: fontFamily.semibold,
    fontSize: typeScale.h4.size,
  },
  proSubtitle: {
    color: colors.amber,
    fontFamily: fontFamily.medium,
    fontSize: typeScale.bodySm.size,
    marginTop: 2,
  },
  proSubtitleActive: {
    color: colors.tealText,
    fontFamily: fontFamily.medium,
    fontSize: typeScale.bodySm.size,
    marginTop: 2,
  },

  block: { gap: 12 },
  signedInLabel: {
    color: colors.txtMuted,
    fontFamily: fontFamily.regular,
    fontSize: typeScale.caption.size,
  },
  email: {
    color: colors.txt,
    fontFamily: fontFamily.semibold,
    fontSize: typeScale.bodyLg.size,
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

  // TEMP reset control — danger-tinted so it reads as a dev/testing affordance.
  resetButton: {
    width: "100%",
    borderWidth: 1,
    borderColor: colors.dangerBorder,
    backgroundColor: colors.dangerBg,
    paddingVertical: 14,
    borderRadius: radii.card,
    alignItems: "center",
    marginTop: 4,
  },
  resetButtonText: {
    color: colors.danger,
    fontFamily: fontFamily.semibold,
    fontSize: typeScale.body.size,
  },

  pressed: { opacity: 0.85 },
});
