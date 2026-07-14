/**
 * Tests for the progress store (`store/progress.ts`).
 *
 * Covers the pure logic most likely to drift silently: the XP→level curve at its
 * boundaries, the daily-streak date logic (same-day no-op, consecutive-day
 * increment, gapped-day reset) in both `bumpStreak` and the `reconcileOnLaunch`
 * path, and the negative-amount coin guards. Time is frozen so today/yesterday
 * are deterministic; AsyncStorage is mocked (see `jest.setup.js`).
 */
import { afterEach, beforeEach, describe, expect, it, jest } from "@jest/globals";

import { levelInfo, selectTodayXp, useProgressStore } from "@/store/progress";

/** Build a "YYYY-MM-DD" key the same way the store does (local date parts). */
function dayKey(d: Date): string {
  const m = `${d.getMonth() + 1}`.padStart(2, "0");
  const day = `${d.getDate()}`.padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

describe("levelInfo — XP→level curve boundaries", () => {
  it("stays level 1 below the first threshold", () => {
    expect(levelInfo(0)).toEqual({ level: 1, xpIntoLevel: 0, xpForLevel: 100 });
    expect(levelInfo(99)).toEqual({ level: 1, xpIntoLevel: 99, xpForLevel: 100 });
  });

  it("crosses to level 2 exactly at 100 XP", () => {
    expect(levelInfo(100)).toEqual({ level: 2, xpIntoLevel: 0, xpForLevel: 120 });
    expect(levelInfo(219)).toEqual({ level: 2, xpIntoLevel: 119, xpForLevel: 120 });
  });

  it("crosses to level 3 at 220 XP (100 + 120)", () => {
    expect(levelInfo(220)).toEqual({ level: 3, xpIntoLevel: 0, xpForLevel: 140 });
  });

  it("clamps negative XP to level 1", () => {
    expect(levelInfo(-50)).toEqual({ level: 1, xpIntoLevel: 0, xpForLevel: 100 });
  });
});

describe("progress store — coin guards", () => {
  beforeEach(() => {
    useProgressStore.getState().reset();
  });

  it("addCoins ignores negative amounts", () => {
    const warn = jest.spyOn(console, "warn").mockImplementation(() => {});
    useProgressStore.getState().addCoins(-100);
    expect(useProgressStore.getState().coins).toBe(0);
    warn.mockRestore();
  });

  it("addCoins adds non-negative amounts", () => {
    useProgressStore.getState().addCoins(40);
    expect(useProgressStore.getState().coins).toBe(40);
  });

  it("spendCoins rejects negative amounts without changing the balance", () => {
    const warn = jest.spyOn(console, "warn").mockImplementation(() => {});
    useProgressStore.getState().addCoins(50);
    expect(useProgressStore.getState().spendCoins(-10)).toBe(false);
    expect(useProgressStore.getState().coins).toBe(50);
    warn.mockRestore();
  });

  it("spendCoins rejects a spend larger than the balance", () => {
    useProgressStore.getState().addCoins(50);
    expect(useProgressStore.getState().spendCoins(80)).toBe(false);
    expect(useProgressStore.getState().coins).toBe(50);
  });

  it("spendCoins deducts when the balance covers it", () => {
    useProgressStore.getState().addCoins(50);
    expect(useProgressStore.getState().spendCoins(30)).toBe(true);
    expect(useProgressStore.getState().coins).toBe(20);
  });
});

describe("progress store — daily streak (time frozen)", () => {
  const NOW = new Date(2026, 5, 18, 12, 0, 0); // local 2026-06-18
  const today = dayKey(NOW);
  const yesterday = dayKey(new Date(2026, 5, 17, 12, 0, 0));
  const twoDaysAgo = dayKey(new Date(2026, 5, 16, 12, 0, 0));

  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(NOW);
    useProgressStore.getState().reset();
  });
  afterEach(() => {
    jest.useRealTimers();
  });

  describe("bumpStreak", () => {
    it("is a no-op when already counted today", () => {
      useProgressStore.setState({ dailyStreak: 3, lastActiveDate: today });
      useProgressStore.getState().bumpStreak();
      expect(useProgressStore.getState().dailyStreak).toBe(3);
      expect(useProgressStore.getState().lastActiveDate).toBe(today);
    });

    it("increments when the last active day was yesterday", () => {
      useProgressStore.setState({ dailyStreak: 3, lastActiveDate: yesterday });
      useProgressStore.getState().bumpStreak();
      expect(useProgressStore.getState().dailyStreak).toBe(4);
      expect(useProgressStore.getState().lastActiveDate).toBe(today);
    });

    it("restarts at 1 after a gap", () => {
      useProgressStore.setState({ dailyStreak: 9, lastActiveDate: twoDaysAgo });
      useProgressStore.getState().bumpStreak();
      expect(useProgressStore.getState().dailyStreak).toBe(1);
      expect(useProgressStore.getState().lastActiveDate).toBe(today);
    });
  });

  describe("reconcileOnLaunch", () => {
    it("keeps a streak active today", () => {
      useProgressStore.setState({ dailyStreak: 5, lastActiveDate: today });
      useProgressStore.getState().reconcileOnLaunch();
      expect(useProgressStore.getState().dailyStreak).toBe(5);
    });

    it("keeps a streak whose last active day was yesterday (date untouched)", () => {
      useProgressStore.setState({ dailyStreak: 5, lastActiveDate: yesterday });
      useProgressStore.getState().reconcileOnLaunch();
      expect(useProgressStore.getState().dailyStreak).toBe(5);
      expect(useProgressStore.getState().lastActiveDate).toBe(yesterday);
    });

    it("resets a streak that missed a day to 0", () => {
      useProgressStore.setState({ dailyStreak: 5, lastActiveDate: twoDaysAgo });
      useProgressStore.getState().reconcileOnLaunch();
      expect(useProgressStore.getState().dailyStreak).toBe(0);
    });

    it("resyncs the cached level from total XP", () => {
      useProgressStore.setState({ xp: 250, level: 1 });
      useProgressStore.getState().reconcileOnLaunch();
      expect(useProgressStore.getState().level).toBe(levelInfo(250).level);
    });
  });
});

describe("selectTodayXp", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date(2026, 5, 18, 12, 0, 0));
    useProgressStore.getState().reset();
  });
  afterEach(() => {
    jest.useRealTimers();
  });

  it("counts dailyXp only when it belongs to today", () => {
    const today = dayKey(new Date(2026, 5, 18, 12, 0, 0));
    useProgressStore.setState({ dailyXp: 15, dailyXpDate: today });
    expect(selectTodayXp(useProgressStore.getState())).toBe(15);
    useProgressStore.setState({ dailyXp: 15, dailyXpDate: "2020-01-01" });
    expect(selectTodayXp(useProgressStore.getState())).toBe(0);
  });
});
