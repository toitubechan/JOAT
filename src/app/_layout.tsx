import "../global.css";

import { useEffect } from "react";
import { ClerkProvider } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";
import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { PostHogProvider } from "posthog-react-native";

import { useIdentifyUser } from "@/hooks/analytics";
import { initPurchases } from "@/hooks/purchases";
import { posthog } from "@/lib/posthog";
import { colors, fonts } from "@/theme";

/**
 * Headless bridge: identifies the signed-in user in PostHog. Lives inside the
 * providers (needs Clerk auth) and renders nothing.
 */
function AnalyticsBridge() {
  useIdentifyUser();
  return null;
}

// Clerk publishable key — written to .env.local by `clerk init`. It must be
// passed to ClerkProvider explicitly: env vars inside node_modules are not
// inlined in production builds, so Clerk can't read it on its own.
const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

// Keep the splash screen up until Poppins is ready (loaded at runtime so the
// app works in Expo Go).
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts(fonts);

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  // Configure RevenueCat (stubbed in Expo Go) and sync the Pro entitlement into
  // the store once on launch. Fire-and-forget: it fails open, so a flaky store
  // never blocks startup.
  useEffect(() => {
    initPurchases();
  }, []);

  // Hold the (already-visible) splash while fonts load; render nothing.
  if (!loaded && !error) {
    return null;
  }

  if (!publishableKey) {
    throw new Error(
      "Missing EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY. Add it to .env.local (clerk init writes it).",
    );
  }

  return (
    // ClerkProvider makes auth state available app-wide. `tokenCache` persists
    // the session token in the device keychain (expo-secure-store) so users
    // stay signed in across app restarts.
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      {/* Shares the pre-initialized PostHog client app-wide. Autocapture is off
          — we only send the explicit events defined in lib/analytics.ts. */}
      <PostHogProvider client={posthog} autocapture={false} style={{ flex: 1 }}>
        <AnalyticsBridge />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.ink },
          }}
        >
          {/* Paywall slides up over whatever opened it (e.g. Profile). */}
          <Stack.Screen name="paywall" options={{ presentation: "modal" }} />
          {/* Notifications panel slides up from the home header bell. */}
          <Stack.Screen name="notifications" options={{ presentation: "modal" }} />
        </Stack>
      </PostHogProvider>
    </ClerkProvider>
  );
}
