/**
 * Static announcements feed for the home notification bell.
 *
 * AGENTS.md allows small static config in `data/` (no backend, no database), so
 * this is the typed source of truth for the in-app notifications panel
 * (`app/notifications.tsx`): short product / onboarding notes, newest first. Each
 * one points at a real app behavior — there is no live or push notification in
 * v1; when announcements ship from a backend, only this list moves.
 *
 * Icons route through the centralized `images` object (Image Rule); `accent`
 * tints the round tile behind the icon.
 */
import type { ImageKey } from "@/constants/images";
import { colors } from "@/theme";

export type Announcement = {
  id: string;
  title: string;
  body: string;
  /** Leading icon (centralized image key). */
  icon: ImageKey;
  /** Tile background tint behind the icon. */
  accent: string;
  /** ISO date the note was posted (drives the relative "Nd ago" label). */
  date: string;
};

/** Newest first — the panel renders them top to bottom in this order. */
export const announcements: Announcement[] = [
  {
    id: "pro",
    title: "Go ad-free with Joat Pro",
    body: "One upgrade removes ads between lessons and unlocks every category. Find it on your profile.",
    icon: "treasure",
    accent: colors.tealBg,
    date: "2026-06-16",
  },
  {
    id: "coins",
    title: "Earn coins, unlock more",
    body: "Hit rewarded goals to bank coins, then spend them to open premium categories like World History.",
    icon: "coinIcon",
    accent: colors.coinBg,
    date: "2026-06-14",
  },
  {
    id: "streaks",
    title: "Keep your streak alive",
    body: "Reach your daily XP goal to grow your streak. Miss a day and it resets — so swipe a couple of cards.",
    icon: "streakFire",
    accent: "#33230F",
    date: "2026-06-10",
  },
  {
    id: "pilot-content",
    title: "Money & Mindfulness are live",
    body: "Our first categories are ready — accounts, budgeting, stress, sleep and more. Pick them from Topics.",
    icon: "walletIcon",
    accent: "#16321F",
    date: "2026-06-05",
  },
  {
    id: "welcome",
    title: "Welcome to Joat!",
    body: "Brain rot, but brain food. Swipe bite-sized lessons and get a little more capable every day.",
    icon: "mascotLogo",
    accent: colors.surfaceRaised,
    date: "2026-06-01",
  },
];
