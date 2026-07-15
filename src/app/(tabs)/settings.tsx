/**
 * Settings (Settings tab) — matches design 08.
 *
 * Account (avatar + name/email, Manage account), Subscription (Joat Pro upsell /
 * status + Restore purchases), Appearance (Dark/Light/System theme), Preferences
 * (Notifications / Daily goal / Learning topics), and Sign out.
 *
 * Coins + the Shop live on the Profile tab. Styled with StyleSheet + theme tokens
 * (className is unreliable on device — project memory); glyphs render through the
 * centralized `images`.
 */
import { useAuth, useUser } from "@clerk/expo";
import { Image } from "expo-image";
import { router } from "expo-router";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { images, type ImageKey } from "@/constants/images";
import { usePurchases } from "@/hooks/purchases";
import { usePreferencesStore, useProgressStore, type ThemeMode } from "@/store";
import {
  fontFamily,
  radii,
  spacing,
  typeScale,
  useTheme,
  useThemedStyles,
  type ThemeColors,
} from "@/theme";

const THEME_MODES: { mode: ThemeMode; label: string }[] = [
  { mode: "dark", label: "Dark" },
  { mode: "light", label: "Light" },
  { mode: "system", label: "System" },
];

export default function SettingsScreen() {
  const styles = useThemedStyles(makeStyles);
  const { signOut } = useAuth();
  const { user } = useUser();
  const { restore } = usePurchases();
  const isPro = useProgressStore((s) => s.isPro);
  const themeMode = usePreferencesStore((s) => s.themeMode);
  const setThemeMode = usePreferencesStore((s) => s.setThemeMode);

  const name = user?.firstName ?? "Your account";
  const email = user?.primaryEmailAddress?.emailAddress ?? "";

  const manageAccount = () =>
    Alert.alert("Manage account", "Account management is coming soon.");

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Settings</Text>

        {/* ACCOUNT */}
        <Text style={styles.sectionLabel}>ACCOUNT</Text>
        <View style={styles.card}>
          <Pressable
            onPress={manageAccount}
            style={({ pressed }) => [styles.cardRow, pressed && styles.pressed]}
          >
            <View style={styles.avatar}>
              <Image source={images.jackHead} style={styles.avatarImg} contentFit="contain" />
            </View>
            <View style={styles.rowBody}>
              <Text style={styles.name} numberOfLines={1}>
                {name}
              </Text>
              {email ? (
                <Text style={styles.email} numberOfLines={1}>
                  {email}
                </Text>
              ) : null}
            </View>
            <Chevron />
          </Pressable>
          <View style={styles.divider} />
          <IconRow icon="userMut" label="Manage account" onPress={manageAccount} />
        </View>

        {/* SUBSCRIPTION */}
        <Text style={styles.sectionLabel}>SUBSCRIPTION</Text>
        <Pressable
          onPress={() => router.push("/paywall")}
          style={({ pressed }) => [
            styles.proCard,
            isPro && styles.proCardActive,
            pressed && styles.pressed,
          ]}
        >
          <View style={[styles.proBadge, isPro && styles.proBadgeActive]}>
            <Image
              source={isPro ? images.checkWhite : images.starAmber}
              style={styles.proBadgeIcon}
              contentFit="contain"
            />
          </View>
          <View style={styles.rowBody}>
            <Text style={styles.proTitle} numberOfLines={1}>
              Joat Pro
            </Text>
            <Text style={styles.proSubtitle} numberOfLines={2}>
              {isPro ? "Active — every lesson unlocked" : "Unlock every lesson · Remove ads"}
            </Text>
          </View>
          {!isPro && (
            <View style={styles.proBtn}>
              <Text style={styles.proBtnText}>Unlock Pro</Text>
            </View>
          )}
        </Pressable>
        {!isPro && (
          <View style={[styles.card, styles.cardSpaced]}>
            <IconRow icon="restoreIcon" label="Restore purchases" onPress={() => restore()} />
          </View>
        )}

        {/* APPEARANCE */}
        <Text style={styles.sectionLabel}>APPEARANCE</Text>
        <View style={[styles.card, styles.themeCard]}>
          <View style={styles.themeHead}>
            <Image source={images.paletteIcon} style={styles.rowIcon} contentFit="contain" />
            <Text style={styles.rowLabel}>Theme</Text>
          </View>
          <View style={styles.segment}>
            {THEME_MODES.map(({ mode, label }) => {
              const active = themeMode === mode;
              return (
                <Pressable
                  key={mode}
                  onPress={() => setThemeMode(mode)}
                  accessibilityRole="button"
                  accessibilityState={{ selected: active }}
                  style={[styles.segmentBtn, active && styles.segmentBtnActive]}
                >
                  <Text
                    numberOfLines={1}
                    style={[styles.segmentText, active && styles.segmentTextActive]}
                  >
                    {label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* PREFERENCES */}
        <Text style={styles.sectionLabel}>PREFERENCES</Text>
        <View style={styles.card}>
          <IconRow icon="bellWhite" label="Notifications" onPress={() => router.push("/notifications")} />
          <View style={styles.divider} />
          <IconRow
            icon="targetIcon"
            label="Daily goal"
            onPress={() => Alert.alert("Daily goal", "Custom daily goals are coming soon.")}
          />
          <View style={styles.divider} />
          <IconRow
            icon="bookIcon"
            label="Learning topics"
            onPress={() => router.push("/category-selection")}
          />
        </View>

        {/* Sign out */}
        <View style={[styles.card, styles.cardSpaced]}>
          <IconRow icon="logoutIcon" label="Sign out" onPress={() => signOut()} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/** A card row: leading glyph, label, trailing chevron. */
function IconRow({
  icon,
  label,
  onPress,
}: {
  icon: ImageKey;
  label: string;
  onPress: () => void;
}) {
  const c = useTheme();
  const styles = useThemedStyles(makeStyles);
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [styles.cardRow, pressed && styles.pressed]}
    >
      <Image
        source={images[icon]}
        style={styles.rowIcon}
        contentFit="contain"
        tintColor={c.txt}
      />
      <Text style={[styles.rowLabel, styles.rowBody]}>{label}</Text>
      <Chevron />
    </Pressable>
  );
}

function Chevron() {
  const c = useTheme();
  const styles = useThemedStyles(makeStyles);
  return (
    <Image
      source={images.chevronLeft}
      style={styles.chevron}
      contentFit="contain"
      tintColor={c.txtMuted}
    />
  );
}

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
  screen: { flex: 1, backgroundColor: c.ink, paddingHorizontal: spacing.screen },
  content: { paddingBottom: 40 },
  title: {
    color: c.txt,
    fontFamily: fontFamily.bold,
    fontSize: typeScale.h1.size,
    marginTop: 8,
    marginBottom: 8,
  },

  sectionLabel: {
    color: c.txtMuted,
    fontFamily: fontFamily.semibold,
    fontSize: typeScale.caption.size,
    letterSpacing: 1,
    marginTop: 26,
    marginBottom: 12,
  },

  // Generic surface card.
  card: {
    backgroundColor: c.surface,
    borderWidth: 1,
    borderColor: c.line,
    borderRadius: radii.hero,
    paddingHorizontal: 16,
  },
  cardSpaced: { marginTop: 0 },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 16,
  },
  rowBody: { flex: 1 },
  divider: { height: 1, backgroundColor: c.line },

  rowIcon: { width: 24, height: 24 },
  rowLabel: {
    color: c.txt,
    fontFamily: fontFamily.medium,
    fontSize: typeScale.h4.size,
  },
  chevron: {
    width: 18,
    height: 18,
    transform: [{ rotate: "180deg" }],
    opacity: 0.5,
  },

  // Account avatar.
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: c.surfaceRaised,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  avatarImg: { width: 40, height: 40 },
  name: {
    color: c.txt,
    fontFamily: fontFamily.bold,
    fontSize: typeScale.h4.size,
  },
  email: {
    color: c.txtMuted,
    fontFamily: fontFamily.regular,
    fontSize: typeScale.bodySm.size,
    marginTop: 2,
  },

  // Joat Pro card.
  proCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: "#231F14", // amber-tinted ink
    borderWidth: 1.5,
    borderColor: c.amber,
    borderRadius: radii.hero,
    padding: 16,
  },
  proCardActive: { backgroundColor: c.tealBg, borderColor: c.tealBorder },
  proBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#3A2E12",
    alignItems: "center",
    justifyContent: "center",
  },
  proBadgeActive: { backgroundColor: c.teal },
  proBadgeIcon: { width: 24, height: 24 },
  proTitle: {
    color: c.amber,
    fontFamily: fontFamily.bold,
    fontSize: typeScale.h4.size,
  },
  proSubtitle: {
    color: c.txtSecondary,
    fontFamily: fontFamily.regular,
    fontSize: typeScale.bodySm.size,
    marginTop: 2,
  },
  proBtn: {
    backgroundColor: c.amber,
    borderRadius: radii.card,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  proBtnText: {
    color: c.txtOnAmber,
    fontFamily: fontFamily.bold,
    fontSize: typeScale.bodySm.size,
  },

  // Theme row + segmented control (label on top, segments full-width below so
  // Dark / Light / System always fit and stay readable on narrow screens).
  themeCard: { paddingVertical: 16 },
  themeHead: { flexDirection: "row", alignItems: "center", gap: 14, marginBottom: 14 },
  segment: { flexDirection: "row", gap: 8 },
  segmentBtn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 9,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: c.line,
  },
  segmentBtnActive: { borderColor: c.amber },
  segmentText: {
    color: c.txtSecondary,
    fontFamily: fontFamily.semibold,
    fontSize: typeScale.bodySm.size,
  },
  segmentTextActive: { color: c.amber },

  pressed: { opacity: 0.7 },
});
