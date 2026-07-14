/**
 * Progress store — the single source of truth for user progress.
 *
 * Everything the app counts (coins, XP/level, streak), what the user has finished
 * (lessons & cards), where they currently are (card + in-progress quiz answers),
 * and their `isPro` status lives here. One store, one AsyncStorage key, so
 * "centralized progress" really means one place.
 *
 * Persisted via zustand's `persist` middleware and rehydrated on launch.
 */
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

/**
 * XP→level curve.
 *
 * Leveling gets gradually harder: clearing level 1 costs `BASE_LEVEL_XP`, and
 * every level after that costs `LEVEL_STEP` more than the one before. So early
 * levels come fast (rewarding for new users) and later ones feel earned —
 * a gentle curve rather than a flat "every 100 XP" line.
 *
 *   level 1 → 2 : 100 XP
 *   level 2 → 3 : 120 XP
 *   level 3 → 4 : 140 XP   …and so on.
 */
const BASE_LEVEL_XP = 100;
const LEVEL_STEP = 20;

/** Daily XP target shown on the home "Daily goal" card. */
export const DAILY_GOAL_XP = 20;

/** XP needed to advance *out of* a given level (level 1 → 2 costs BASE_LEVEL_XP). */
function xpToClearLevel(level: number): number {
  return BASE_LEVEL_XP + (level - 1) * LEVEL_STEP;
}

/** A total-XP value resolved into level + progress within that level. */
export type LevelInfo = {
  /** Current level (1-based). */
  level: number;
  /** XP earned so far within the current level. */
  xpIntoLevel: number;
  /** XP required to clear the current level (reach the next one). */
  xpForLevel: number;
};

/**
 * Resolve total lifetime XP into the current level and how far into it the user
 * is. Walks the curve one level at a time — levels are small numbers, so the
 * loop is cheap and easy to read. Use `levelInfo(xp)` anywhere the UI needs to
 * draw an XP bar ("Level N · x / y XP").
 */
export function levelInfo(totalXp: number): LevelInfo {
  let level = 1;
  let remaining = Math.max(0, totalXp);
  let need = xpToClearLevel(level);
  while (remaining >= need) {
    remaining -= need;
    level += 1;
    need = xpToClearLevel(level);
  }
  return { level, xpIntoLevel: remaining, xpForLevel: need };
}

/** Level for a given total XP (1-based). Convenience wrapper over `levelInfo`. */
function levelForXp(xp: number): number {
  return levelInfo(xp).level;
}

/** Stable key for a single card within a lesson. */
function cardKey(lessonId: string, cardIndex: number): string {
  return `${lessonId}:${cardIndex}`;
}

/**
 * Daily-streak date helpers.
 *
 * KNOWN LIMITATION (MVP): the streak is keyed off the device's local clock
 * (`new Date()`), which is untrusted — a user can advance the clock to fake a
 * streak, crossing timezones can shift the date string, and automatic clock
 * corrections can cause unexpected resets. Acceptable for the offline MVP;
 * if/when a backend exists, validate streaks against server time instead.
 */
/** Today's local date as "YYYY-MM-DD" (used for the daily streak). */
function todayKey(): string {
  const d = new Date();
  const month = `${d.getMonth() + 1}`.padStart(2, "0");
  const day = `${d.getDate()}`.padStart(2, "0");
  return `${d.getFullYear()}-${month}-${day}`;
}

/** Yesterday's local date as "YYYY-MM-DD". */
function yesterdayKey(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  const month = `${d.getMonth() + 1}`.padStart(2, "0");
  const day = `${d.getDate()}`.padStart(2, "0");
  return `${d.getFullYear()}-${month}-${day}`;
}

/** Where the user currently is in a lesson feed. */
type CurrentCard = { lessonId: string; cardIndex: number } | null;

type ProgressState = {
  // --- Economy ---
  coins: number;
  // --- Leveling ---
  xp: number;
  level: number;
  // --- Daily goal (XP earned today, toward DAILY_GOAL_XP) ---
  dailyXp: number;
  /** Day `dailyXp` belongs to, "YYYY-MM-DD"; lets it reset when the day rolls over. */
  dailyXpDate: string | null;
  // --- Daily streak ---
  dailyStreak: number;
  /** Last day the streak was bumped, "YYYY-MM-DD". */
  lastActiveDate: string | null;
  // --- Completion ---
  completedLessons: string[];
  /** Completed card keys, `${lessonId}:${cardIndex}`. */
  completedCards: string[];
  // --- Current card / quiz state ---
  currentCard: CurrentCard;
  /** In-progress quiz answers, keyed `${lessonId}:${questionIndex}` -> option index. */
  quizAnswers: Record<string, number>;
  // --- Monetization ---
  isPro: boolean;
  /** Slugs of coin-locked categories the user has unlocked by spending coins. */
  unlockedCategoryIds: string[];

  // --- Actions ---
  addCoins: (amount: number) => void;
  /** Spend coins; returns false (and changes nothing) if the balance is too low. */
  spendCoins: (amount: number) => boolean;
  /** Add XP and recompute the level. */
  addXp: (amount: number) => void;
  /** Count today toward the streak (+1 if yesterday was active, else restart at 1). */
  bumpStreak: () => void;
  /**
   * Run once on launch (from `onRehydrateStorage`): drop a streak that missed a
   * day while the app was closed, and resync the cached level from total XP.
   */
  reconcileOnLaunch: () => void;
  markCardComplete: (lessonId: string, cardIndex: number) => void;
  completeLesson: (lessonId: string) => void;
  setCurrentCard: (lessonId: string, cardIndex: number) => void;
  clearCurrentCard: () => void;
  answerQuiz: (lessonId: string, questionIndex: number, optionIndex: number) => void;
  setPro: (isPro: boolean) => void;
  /**
   * Unlock a coin-locked category by spending `cost` coins. Idempotent (an
   * already-unlocked category, or a Pro user, succeeds without spending) and
   * safe (returns false without changing anything if the balance is too low).
   * Returns whether the category is unlocked afterward.
   */
  unlockCategory: (categoryId: string, cost: number) => boolean;
  /** Wipe all progress back to a fresh account (temporary reset button). */
  reset: () => void;

  // --- Selectors ---
  isLessonComplete: (lessonId: string) => boolean;
  isCardComplete: (lessonId: string, cardIndex: number) => boolean;
  /** True if the category is unlocked — Pro unlocks every category. */
  isCategoryUnlocked: (categoryId: string) => boolean;
};

/** Fresh-account values. Spread into `set` for `reset`, and as the store defaults. */
const initialState = {
  coins: 0,
  xp: 0,
  level: 1,
  dailyXp: 0,
  dailyXpDate: null as string | null,
  dailyStreak: 0,
  lastActiveDate: null as string | null,
  completedLessons: [] as string[],
  completedCards: [] as string[],
  currentCard: null as CurrentCard,
  quizAnswers: {} as Record<string, number>,
  isPro: false,
  unlockedCategoryIds: [] as string[],
};

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      ...initialState,

      addCoins: (amount) => {
        // Guard against negative amounts so `addCoins` can never silently
        // subtract coins (e.g. a bad reward payout calling addCoins(-100)).
        if (amount < 0) {
          if (__DEV__) console.warn("[progress] addCoins: amount must be non-negative");
          return;
        }
        set((state) => ({ coins: state.coins + amount }));
      },

      spendCoins: (amount) => {
        // A negative amount would slip past the balance check below and *add*
        // coins, so reject it outright.
        if (amount < 0) {
          if (__DEV__) console.warn("[progress] spendCoins: amount must be non-negative");
          return false;
        }
        if (get().coins < amount) return false;
        set((state) => ({ coins: state.coins - amount }));
        return true;
      },

      addXp: (amount) =>
        set((state) => {
          const xp = state.xp + amount;
          // Roll the daily counter over to today: accumulate if it's still the
          // same day, otherwise restart it at this amount.
          const today = todayKey();
          const dailyXp = state.dailyXpDate === today ? state.dailyXp + amount : amount;
          return { xp, level: levelForXp(xp), dailyXp, dailyXpDate: today };
        }),

      bumpStreak: () =>
        set((state) => {
          const today = todayKey();
          // Already counted today — nothing to do.
          if (state.lastActiveDate === today) return state;
          // Continued from yesterday extends the streak; any other gap restarts it.
          const dailyStreak =
            state.lastActiveDate === yesterdayKey() ? state.dailyStreak + 1 : 1;
          return { dailyStreak, lastActiveDate: today };
        }),

      reconcileOnLaunch: () =>
        set((state) => {
          // Keep the cached level honest with the (curve-aware) XP total.
          const level = levelForXp(state.xp);
          // The streak is still alive only if the last active day was today or
          // yesterday; any larger gap means a day was missed, so it resets to 0.
          // We leave `lastActiveDate` untouched: the next activity's bumpStreak
          // sees the gap and correctly restarts the count at 1.
          const alive =
            state.lastActiveDate === todayKey() ||
            state.lastActiveDate === yesterdayKey();
          const dailyStreak = alive ? state.dailyStreak : 0;
          return { level, dailyStreak };
        }),

      markCardComplete: (lessonId, cardIndex) =>
        set((state) => {
          const key = cardKey(lessonId, cardIndex);
          if (state.completedCards.includes(key)) return state;
          return { completedCards: [...state.completedCards, key] };
        }),

      completeLesson: (lessonId) =>
        set((state) => {
          if (state.completedLessons.includes(lessonId)) return state;
          return { completedLessons: [...state.completedLessons, lessonId] };
        }),

      setCurrentCard: (lessonId, cardIndex) =>
        set({ currentCard: { lessonId, cardIndex } }),

      clearCurrentCard: () => set({ currentCard: null }),

      answerQuiz: (lessonId, questionIndex, optionIndex) =>
        set((state) => ({
          quizAnswers: {
            ...state.quizAnswers,
            [`${lessonId}:${questionIndex}`]: optionIndex,
          },
        })),

      setPro: (isPro) => set({ isPro }),

      unlockCategory: (categoryId, cost) => {
        const state = get();
        // Already available — Pro unlocks everything, and unlocking is idempotent.
        if (state.isPro || state.unlockedCategoryIds.includes(categoryId)) return true;
        // Reuse spendCoins for the negative-amount guard + balance check; it only
        // deducts when the balance covers the cost (returns false otherwise).
        if (!get().spendCoins(cost)) return false;
        set((s) => ({ unlockedCategoryIds: [...s.unlockedCategoryIds, categoryId] }));
        return true;
      },

      reset: () => set({ ...initialState }),

      isLessonComplete: (lessonId) => get().completedLessons.includes(lessonId),

      isCardComplete: (lessonId, cardIndex) =>
        get().completedCards.includes(cardKey(lessonId, cardIndex)),

      isCategoryUnlocked: (categoryId) => {
        const state = get();
        return state.isPro || state.unlockedCategoryIds.includes(categoryId);
      },
    }),
    {
      name: "joat:progress",
      storage: createJSONStorage(() => AsyncStorage),
      // On launch, once the saved progress has loaded, reconcile time-sensitive
      // state: expire a streak that missed a day while the app was closed (the
      // requirement's "compare against the stored last-active date on launch")
      // and resync the cached level from total XP.
      onRehydrateStorage: () => (state) => {
        state?.reconcileOnLaunch();
      },
    }
  )
);

/**
 * Today's earned XP toward the daily goal — `dailyXp` only counts if it still
 * belongs to today, otherwise the goal reads 0 (a fresh day). Use as a selector:
 * `useProgressStore(selectTodayXp)`.
 */
export function selectTodayXp(state: ProgressState): number {
  return state.dailyXpDate === todayKey() ? state.dailyXp : 0;
}
