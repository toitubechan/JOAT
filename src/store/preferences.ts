/**
 * Preferences store — the user's chosen interests (the topic-selection result).
 *
 * This is one of two persisted Zustand stores (the other is `progress.ts`). It
 * holds only the categories picked on the "Pick your first category" screen, and
 * drives the post-auth routing gate in `app/index.tsx`:
 *
 *   signed in + no topics  -> redirect to /category-selection
 *   signed in + >=1 topic   -> home (/)
 *
 * Persisted to AsyncStorage via zustand's `persist` middleware and rehydrated on
 * launch. Because rehydration is async, we expose `hasHydrated` so the router can
 * wait for the saved selection before deciding where to send the user (otherwise
 * a returning user would briefly look "empty" and get bounced to selection).
 */
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { CategorySlug } from "@/theme";

/** App theme mode (Settings → Appearance). `system` follows the OS setting. */
export type ThemeMode = "dark" | "light" | "system";

type PreferencesState = {
  /** Categories the user picked, in selection order. */
  selectedTopics: CategorySlug[];
  /** Chosen theme mode (Settings → Appearance). */
  themeMode: ThemeMode;
  /** True once the persisted selection has been read back from AsyncStorage. */
  hasHydrated: boolean;

  /** Replace the whole selection (used when committing the selection screen). */
  setSelectedTopics: (topics: CategorySlug[]) => void;
  /** Add/remove a single category. */
  toggleTopic: (slug: CategorySlug) => void;
  /** Set the app theme mode. */
  setThemeMode: (mode: ThemeMode) => void;
  /** Clear the selection (temporary reset button / sign-out). */
  reset: () => void;

  /** Internal: flipped by `onRehydrateStorage` once storage has loaded. */
  setHasHydrated: (value: boolean) => void;
};

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      selectedTopics: [],
      themeMode: "dark",
      hasHydrated: false,

      setSelectedTopics: (topics) => set({ selectedTopics: topics }),

      toggleTopic: (slug) =>
        set((state) => ({
          selectedTopics: state.selectedTopics.includes(slug)
            ? state.selectedTopics.filter((s) => s !== slug)
            : [...state.selectedTopics, slug],
        })),

      setThemeMode: (mode) => set({ themeMode: mode }),

      // Reset only clears the selection — the theme is a display preference,
      // not progress, so it survives a topic reset / sign-out.
      reset: () => set({ selectedTopics: [] }),

      setHasHydrated: (value) => set({ hasHydrated: value }),
    }),
    {
      name: "joat:preferences",
      storage: createJSONStorage(() => AsyncStorage),
      // Persist the selection + theme — `hasHydrated` is a runtime-only flag.
      partialize: (state) => ({
        selectedTopics: state.selectedTopics,
        themeMode: state.themeMode,
      }),
      onRehydrateStorage: () => (state) => {
        // Mark hydration complete even if it failed (state is undefined on
        // error). A failed read just means an empty selection — a valid initial
        // state — and we must still flip the flag, or the router gate in
        // `app/index.tsx` waits on `hasHydrated` forever and the app hangs.
        if (state) {
          state.setHasHydrated(true);
        } else {
          usePreferencesStore.setState({ hasHydrated: true });
        }
      },
    }
  )
);
