import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { images } from "@/constants/images";
import { colors, fontFamily, radii, typeScale } from "@/theme";

export default function Onboarding() {
  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      {/* Subtle top glow behind the logo/headline, fading into the app ink. */}
      <LinearGradient
        colors={["#1A2139", colors.ink]}
        locations={[0, 0.55]}
        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView style={styles.safe}>
        <View style={styles.content}>
          {/* Logo + wordmark */}
          <View style={styles.header}>
            <Image
              source={images.mascotLogo}
              style={styles.logo}
              contentFit="contain"
            />
            <Text style={styles.wordmark}>
              Joat<Text style={styles.wordmarkDot}>.</Text>
            </Text>
          </View>

          {/* Headline */}
          <View style={styles.headline}>
            <Text style={styles.h1}>Doomscroll,</Text>
            <Text style={[styles.h1, styles.h1Amber]}>but you learn.</Text>
          </View>

          {/* Subtitle */}
          <Text style={styles.subtitle}>
            Swipe through bite-sized lessons on money, science, repairs & 60+
            topics.
          </Text>

          {/* Floating topic chips, staggered left / right / left */}
          <View style={styles.chips}>
            <View style={[styles.chip, styles.chipNeutral, styles.alignStart]}>
              <Text style={[styles.chipText, styles.chipTextNeutral]}>
                How do black holes work?
              </Text>
            </View>
            <View style={[styles.chip, styles.chipAmber, styles.alignEnd]}>
              <Text style={[styles.chipText, styles.chipTextAmber]}>
                Budget like a pro
              </Text>
            </View>
            <View
              style={[styles.chip, styles.chipTeal, styles.alignStart, styles.indent]}
            >
              <Text style={[styles.chipText, styles.chipTextTeal]}>
                Fix a leaky faucet
              </Text>
            </View>
          </View>

          {/* Mascot fills the remaining space, centered */}
          <View style={styles.mascotWrap}>
            <Image
              source={images.mascotWelcome}
              style={styles.mascot}
              contentFit="contain"
            />
          </View>

          {/* Get Started → account creation */}
          <Pressable
            onPress={() => router.push("/sign-up")}
            style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
          >
            <Text style={styles.buttonText}>Get Started</Text>
            {/* Right-pointing chevron drawn from two borders (no icon dependency) */}
            <View style={styles.chevron} />
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.ink },
  safe: { flex: 1 },
  content: { flex: 1, paddingHorizontal: 24 },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 16,
  },
  logo: { width: 40, height: 40 },
  wordmark: {
    color: colors.txt,
    fontFamily: fontFamily.bold,
    fontSize: typeScale.h1.size,
    lineHeight: typeScale.h1.lineHeight,
  },
  wordmarkDot: { color: colors.amber },

  headline: { alignItems: "center", marginTop: 32 },
  h1: {
    color: colors.txt,
    fontFamily: fontFamily.bold,
    fontSize: typeScale.h1.size,
    lineHeight: typeScale.h1.lineHeight,
    textAlign: "center",
  },
  h1Amber: { color: colors.amber },

  subtitle: {
    color: colors.txtSecondary,
    fontFamily: fontFamily.regular,
    fontSize: typeScale.bodyLg.size,
    lineHeight: typeScale.bodyLg.lineHeight,
    textAlign: "center",
    marginTop: 20,
  },

  chips: { marginTop: 32 },
  chip: {
    borderRadius: 999,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderWidth: 1,
    marginBottom: 16,
  },
  alignStart: { alignSelf: "flex-start" },
  alignEnd: { alignSelf: "flex-end" },
  indent: { marginLeft: 16 },
  chipNeutral: { backgroundColor: colors.surface, borderColor: colors.line },
  chipAmber: { backgroundColor: colors.coinBg, borderColor: colors.coinBorder },
  chipTeal: { backgroundColor: colors.tealBg, borderColor: colors.tealBorder },
  chipText: { fontFamily: fontFamily.semibold, fontSize: typeScale.body.size },
  chipTextNeutral: { color: colors.txt },
  chipTextAmber: { color: colors.amber },
  chipTextTeal: { color: colors.tealText },

  mascotWrap: { flex: 1, alignItems: "center", justifyContent: "center" },
  mascot: { width: "100%", height: "100%" },

  button: {
    height: 56,
    borderRadius: radii.card,
    backgroundColor: colors.amber,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    marginBottom: 16,
  },
  buttonPressed: { backgroundColor: colors.amberPressed },
  buttonText: {
    color: colors.txtOnAmber,
    fontFamily: fontFamily.bold,
    fontSize: typeScale.h4.size,
  },
  chevron: {
    width: 12,
    height: 12,
    borderColor: colors.txtOnAmber,
    borderRightWidth: 2,
    borderTopWidth: 2,
    transform: [{ rotate: "45deg" }],
  },
});
