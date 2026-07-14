/**
 * PostHog analytics client — initialized once and shared app-wide.
 *
 * The project API key and host come from env (`EXPO_PUBLIC_POSTHOG_*`), never
 * hardcoded. The key is a public, client-side key (safe to embed), like the
 * Clerk publishable key.
 *
 * When no key is set (e.g. plain Expo Go before `.env.local` is filled in) the
 * client is created `disabled`, so every `capture`/`identify` is a silent no-op
 * and nothing is sent — the app runs completely untouched. Paste a key into
 * `.env.local` to turn analytics on; no code changes needed.
 *
 * Capture/identify go through the typed helpers in `lib/analytics.ts`; screens
 * and hooks should call those, not this client directly.
 */
import PostHog from "posthog-react-native";

const apiKey = process.env.EXPO_PUBLIC_POSTHOG_KEY ?? "";
const host = process.env.EXPO_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com";

/** True when a PostHog key is configured; analytics is otherwise a no-op. */
export const analyticsEnabled = apiKey.length > 0;

/**
 * The shared PostHog instance. Built `disabled` when no key is configured so it
 * makes no network calls and silently drops all events.
 */
export const posthog = new PostHog(apiKey || "phc_disabled_no_key", {
  host,
  disabled: !analyticsEnabled,
});
