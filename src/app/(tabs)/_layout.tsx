import { Redirect, Tabs } from "expo-router";
import { StyleSheet, View } from "react-native";
import { useAuth } from "@clerk/expo";

import { CustomTabBar } from "@/components/CustomTabBar";
import { usePreferencesStore } from "@/store";
import { colors } from "@/theme";

/**
 * Authenticated tab area (Feed / Explore / Progress / Profile).
 *
 * Gates entry the same way the old root screen did: hold while Clerk and the
 * saved selection hydrate, send signed-out users to onboarding, and bounce
 * users with no chosen topics to the category picker. Once past the gate, the
 * custom amber-circle tab bar takes over.
 */
export default function TabsLayout() {
  const { isLoaded, isSignedIn } = useAuth();
  const hasHydrated = usePreferencesStore((s) => s.hasHydrated);
  const selectedTopics = usePreferencesStore((s) => s.selectedTopics);

  // Hold an empty screen until Clerk has restored the session from the cache,
  // so we don't flash a redirect to onboarding for a returning, signed-in user.
  if (!isLoaded) {
    return <View style={styles.gate} />;
  }

  if (!isSignedIn) {
    return <Redirect href="/onboarding" />;
  }

  // Wait for the saved selection before deciding the topic gate.
  if (!hasHydrated) {
    return <View style={styles.gate} />;
  }

  if (selectedTopics.length === 0) {
    return <Redirect href="/category-selection" />;
  }

  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: colors.ink },
      }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="explore" />
      <Tabs.Screen name="progress" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  gate: { flex: 1, backgroundColor: colors.ink },
});
