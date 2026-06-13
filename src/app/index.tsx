import { Link } from "expo-router";
import { StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { colors, fontFamily, radii, typeScale } from "@/theme";

export default function Home() {
  return (
    <SafeAreaView style={styles.screen}>
      <Text style={styles.title}>Joat</Text>

      {/* The orange "door" that opens the onboarding screen. */}
      <Link href="/onboarding" style={styles.button}>
        Open Onboarding
      </Link>
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
  button: {
    width: "100%",
    backgroundColor: colors.amber,
    color: colors.txtOnAmber,
    fontFamily: fontFamily.bold,
    fontSize: typeScale.h4.size,
    textAlign: "center",
    paddingVertical: 18,
    borderRadius: radii.card,
    overflow: "hidden",
  },
});
