import "../global.css";

import { useEffect } from "react";
import { ClerkProvider } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";
import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";

import { colors, fonts } from "@/theme";

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
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.ink },
        }}
      />
    </ClerkProvider>
  );
}
