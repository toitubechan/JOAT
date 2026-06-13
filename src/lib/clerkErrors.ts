/**
 * Turn a Clerk error into a message that's safe to show the user.
 *
 * Clerk errors carry two strings: `message` is developer-facing and may change
 * between versions, while `longMessage` is the friendly, user-readable version.
 * Prefer `longMessage`, fall back to `message`, then to a generic fallback.
 *
 * Duck-typed on purpose so it works for both the awaited `{ error }` returned
 * by the future auth methods and any thrown error.
 */
export function clerkErrorMessage(
  error: unknown,
  fallback = "Something went wrong. Please try again.",
): string {
  if (error && typeof error === "object") {
    const e = error as { longMessage?: string; message?: string };
    if (e.longMessage) return e.longMessage;
    if (e.message) return e.message;
  }
  return fallback;
}
