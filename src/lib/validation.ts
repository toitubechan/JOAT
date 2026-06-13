/**
 * Pure, client-side auth field validation (UI only — there is no backend).
 *
 * Each validator returns an error message string when invalid, or `null` when
 * the value is acceptable. Screens render the message under the field via
 * `AuthInput`'s `error` prop.
 */

// Pragmatic email shape (local@domain.tld) — intentionally not RFC-exhaustive.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(email: string): string | null {
  const value = email.trim();
  if (!value) return "Enter your email address.";
  if (!EMAIL_RE.test(value)) return "Enter a valid email address.";
  return null;
}

const MIN_PASSWORD_LENGTH = 8;

export function validatePassword(password: string): string | null {
  if (!password) return "Enter a password.";
  if (password.length < MIN_PASSWORD_LENGTH) {
    return `Use at least ${MIN_PASSWORD_LENGTH} characters.`;
  }
  return null;
}
