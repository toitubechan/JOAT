/**
 * Paywall — the Joat Pro upgrade screen (presented as a modal).
 *
 * Describes the two Pro benefits (no ads, unlocked content) and runs the
 * purchase + restore flows through `usePurchases()`, which mirrors the result
 * into the progress store. When the user already owns Pro, it flips to a simple
 * "you're set" state instead of selling again.
 *
 * No dedicated mockup — built in the app's visual language: ink background,
 * amber CTA, teal check badges, Poppins, icons via expo-image (className is
 * unreliable on device — project memory).
 */
import { useEffect, useState } from "react";
import { Image } from "expo-image";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { PrimaryButton } from "@/components/PrimaryButton";
import { images } from "@/constants/images";
import { usePurchases } from "@/hooks/purchases";
import { fetchProPriceLabel, PRO_PRICE_LABEL } from "@/lib/purchases";
import {
  fontFamily,
  radii,
  spacing,
  typeScale,
  useTheme,
  useThemeMode,
  useThemedStyles,
  type ThemeColors,
} from "@/theme";

/** The honest Pro benefits — must match what the app actually gates. */
const BENEFITS = [
  {
    title: "No ads, ever",
    body: "No interstitials between lessons, no rewarded prompts. Just learning.",
  },
  {
    title: "Every category unlocked",
    body: "Open all coin-locked topics instantly — no grinding for coins.",
  },
  {
    title: "The whole library",
    body: "All lessons, plus everything we add later, included.",
  },
] as const;

export default function PaywallScreen() {
  const c = useTheme();
  const styles = useThemedStyles(makeStyles);
  const barStyle = useThemeMode() === "light" ? "dark" : "light";
  const { isPro, pending, buyPro, restore } = usePurchases();
  // Inline, non-blocking notice (fail-open: a failed/cancelled purchase or an
  // empty restore never traps the user — we just tell them and leave them free).
  const [notice, setNotice] = useState<string | null>(null);
  // Live, localized price from the RevenueCat offering when the real SDK is
  // active; the placeholder until it resolves / in Expo Go.
  const [price, setPrice] = useState(PRO_PRICE_LABEL);

  // Pro is optional — the paywall must always be dismissable. Pop the modal when
  // there's history; otherwise fall back to Home. (In dev, Expo Router can
  // restore `/paywall` as the entry route, leaving nothing to pop — a bare
  // `router.back()` then throws "GO_BACK was not handled by any navigator".)
  const dismiss = () => (router.canGoBack() ? router.back() : router.replace("/"));

  useEffect(() => {
    let active = true;
    fetchProPriceLabel().then((p) => {
      if (active) setPrice(p);
    });
    return () => {
      active = false;
    };
  }, []);

  async function handleBuy() {
    setNotice(null);
    const owned = await buyPro();
    // On success the store flips `isPro` and the UI switches to the Pro state;
    // otherwise stay put and explain, without blocking.
    if (!owned) setNotice("That didn’t go through — you’re still on the free plan.");
  }

  async function handleRestore() {
    setNotice(null);
    const owned = await restore();
    if (!owned) setNotice("No previous purchase found to restore.");
  }

  return (
    <SafeAreaView style={styles.screen} edges={["top", "bottom"]}>
      <StatusBar style={barStyle} />

      {/* Close (X) — dismiss the modal back to wherever it opened from (or Home
          when the paywall is the entry route). */}
      <Pressable
        onPress={dismiss}
        hitSlop={12}
        accessibilityRole="button"
        accessibilityLabel="Close"
        style={({ pressed }) => [styles.closeBtn, pressed && styles.pressed]}
      >
        <Image source={images.closeWhite} style={styles.closeIcon} contentFit="contain" tintColor={c.txt} />
      </Pressable>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        <View style={styles.hero}>
          <Image source={images.treasure} style={styles.heroImage} contentFit="contain" />
          <View style={styles.proPill}>
            <Text style={styles.proPillText}>JOAT PRO</Text>
          </View>
        </View>

        {isPro ? (
          <>
            <Text style={styles.title}>You’re on Joat Pro</Text>
            <Text style={styles.subtitle}>
              Ads are off and every category is unlocked. Thanks for the support — go learn
              something.
            </Text>
          </>
        ) : (
          <>
            <Text style={styles.title}>Unlock Joat Pro</Text>
            <Text style={styles.subtitle}>
              One upgrade, the whole app — no ads and every topic open.
            </Text>
          </>
        )}

        <View style={styles.benefits}>
          {BENEFITS.map((b) => (
            <View key={b.title} style={styles.benefitRow}>
              <View style={styles.checkBadge}>
                <Image source={images.checkWhite} style={styles.checkIcon} contentFit="contain" />
              </View>
              <View style={styles.benefitText}>
                <Text style={styles.benefitTitle}>{b.title}</Text>
                <Text style={styles.benefitBody}>{b.body}</Text>
              </View>
            </View>
          ))}
        </View>

        {notice ? <Text style={styles.notice}>{notice}</Text> : null}
      </ScrollView>

      {/* Sticky footer CTA. Pro users get a single "Done"; free users get the
          purchase button, the price, and a restore link. */}
      <View style={styles.footer}>
        {isPro ? (
          <PrimaryButton label="Done" onPress={dismiss} />
        ) : (
          <>
            <PrimaryButton
              label={pending ? "Processing…" : `Unlock Pro · ${price}`}
              onPress={handleBuy}
              disabled={pending}
            />
            <Text style={styles.priceNote}>One-time purchase. Cancel anytime before buying.</Text>

            <Pressable
              onPress={handleRestore}
              disabled={pending}
              hitSlop={8}
              style={({ pressed }) => [styles.restoreBtn, pressed && styles.pressed]}
            >
              <Text style={styles.restoreText}>Restore purchase</Text>
            </Pressable>

            {/* Skipping is fine — Pro is never required to use the app. */}
            <Pressable
              onPress={dismiss}
              disabled={pending}
              hitSlop={8}
              style={({ pressed }) => [styles.skipBtn, pressed && styles.pressed]}
            >
              <Text style={styles.skipText}>Maybe later</Text>
            </Pressable>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const H_PAD = spacing.screen;

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
  screen: { flex: 1, backgroundColor: c.ink },

  closeBtn: {
    position: "absolute",
    top: 0,
    right: H_PAD,
    zIndex: 10,
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  closeIcon: { width: 20, height: 20 },
  pressed: { opacity: 0.7 },

  scroll: {
    paddingHorizontal: H_PAD,
    paddingTop: 8,
    paddingBottom: 24,
  },

  hero: {
    alignItems: "center",
    marginTop: 24,
    marginBottom: 20,
  },
  heroImage: { width: 132, height: 132 },
  proPill: {
    marginTop: 12,
    backgroundColor: c.amber,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  proPillText: {
    color: c.txtOnAmber,
    fontFamily: fontFamily.bold,
    fontSize: typeScale.caption.size,
    letterSpacing: 1.5,
  },

  title: {
    color: c.txt,
    fontFamily: fontFamily.bold,
    fontSize: typeScale.h2.size,
    lineHeight: typeScale.h2.lineHeight,
    textAlign: "center",
  },
  subtitle: {
    color: c.txtSecondary,
    fontFamily: fontFamily.regular,
    fontSize: typeScale.bodyLg.size,
    lineHeight: 24,
    textAlign: "center",
    marginTop: 10,
    paddingHorizontal: 8,
  },

  benefits: {
    marginTop: 28,
    gap: 14,
  },
  benefitRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 14,
    backgroundColor: c.surface,
    borderWidth: 1,
    borderColor: c.line,
    borderRadius: radii.card,
    padding: 16,
  },
  checkBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: c.teal,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  checkIcon: { width: 15, height: 15 },
  benefitText: { flex: 1 },
  benefitTitle: {
    color: c.txt,
    fontFamily: fontFamily.semibold,
    fontSize: typeScale.h4.size,
  },
  benefitBody: {
    color: c.txtSecondary,
    fontFamily: fontFamily.regular,
    fontSize: typeScale.bodySm.size,
    lineHeight: typeScale.bodySm.lineHeight,
    marginTop: 2,
  },

  notice: {
    color: c.txtSecondary,
    fontFamily: fontFamily.medium,
    fontSize: typeScale.bodySm.size,
    lineHeight: typeScale.bodySm.lineHeight,
    textAlign: "center",
    marginTop: 18,
  },

  footer: {
    paddingHorizontal: H_PAD,
    paddingTop: 12,
    paddingBottom: 8,
    borderTopWidth: 1,
    borderTopColor: c.line,
    backgroundColor: c.ink,
  },
  priceNote: {
    color: c.txtMuted,
    fontFamily: fontFamily.regular,
    fontSize: typeScale.caption.size,
    textAlign: "center",
    marginTop: 10,
  },
  restoreBtn: {
    alignSelf: "center",
    paddingVertical: 10,
    marginTop: 4,
  },
  restoreText: {
    color: c.txt,
    fontFamily: fontFamily.semibold,
    fontSize: typeScale.body.size,
  },
  skipBtn: {
    alignSelf: "center",
    paddingVertical: 8,
  },
  skipText: {
    color: c.txtMuted,
    fontFamily: fontFamily.medium,
    fontSize: typeScale.bodySm.size,
  },
});
