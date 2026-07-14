/**
 * Reward animation hooks — the cheap, instant motion that makes earning feel
 * good (AGENTS.md UI Quality Bar: "instant feedback ... jank kills the loop").
 *
 * All three lean on React Native's built-in `Animated` (the same primitive the
 * tab bar uses) so there's no extra setup and the transform-based ones run on
 * the native driver. Each is small and self-contained:
 *
 *   useCountUp(value)        -> a number that ticks up to `value` (coin/XP totals)
 *   usePopOnIncrease(value)  -> a scale value that "pops" when `value` grows
 *   usePulse(enabled)        -> a scale value that gently breathes in a loop (flame)
 *
 * Animated values are held in a lazy `useState` initializer (stable across
 * renders without reading a ref during render — same pattern as CustomTabBar).
 */
import { useEffect, useRef, useState } from "react";
import { Animated, Easing } from "react-native";

type CountUpOptions = {
  duration?: number;
  /**
   * Start the count here instead of at `value`, so the first render animates up
   * to `value` (e.g. roll a freshly-earned reward up from 0). Omit for a total
   * that should simply track the store without a mount animation.
   */
  startFrom?: number;
};

/**
 * Animate a number up to `value`. Returns the current (rounded) display value,
 * so the count visibly rolls up when a reward lands. Decreases (e.g. a progress
 * reset, or spending coins) snap instantly — only gains are worth animating.
 *
 * Drives a non-native-driver `Animated.Value` (we read it on the JS side to set
 * text), which is fine for one short tween.
 */
export function useCountUp(value: number, { duration = 600, startFrom }: CountUpOptions = {}): number {
  const initial = startFrom ?? value;
  const [anim] = useState(() => new Animated.Value(initial));
  const previous = useRef(initial);
  const [display, setDisplay] = useState(initial);

  // Mirror the animated value into React state as it ticks.
  useEffect(() => {
    const id = anim.addListener(({ value: v }) => setDisplay(Math.round(v)));
    return () => anim.removeListener(id);
  }, [anim]);

  useEffect(() => {
    if (value === previous.current) return;
    if (value < previous.current) {
      // Snap downward changes (reset / spend) — no count-down animation.
      anim.setValue(value);
      setDisplay(value);
    } else {
      Animated.timing(anim, {
        toValue: value,
        duration,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }).start();
    }
    previous.current = value;
  }, [value, duration, anim]);

  return display;
}

/**
 * A scale value that briefly "pops" (springs up, then settles back to 1) each
 * time `value` increases — the little punch on a coin or XP award. Returns the
 * `Animated.Value`; apply it as `transform: [{ scale }]` on an `Animated.View`.
 */
export function usePopOnIncrease(value: number, scaleTo = 1.18): Animated.Value {
  const [scale] = useState(() => new Animated.Value(1));
  const previous = useRef(value);

  useEffect(() => {
    if (value > previous.current) {
      scale.setValue(1);
      Animated.sequence([
        Animated.spring(scale, {
          toValue: scaleTo,
          useNativeDriver: true,
          speed: 50,
          bounciness: 14,
        }),
        Animated.spring(scale, {
          toValue: 1,
          useNativeDriver: true,
          speed: 18,
          bounciness: 10,
        }),
      ]).start();
    }
    previous.current = value;
  }, [value, scaleTo, scale]);

  return scale;
}

/**
 * A scale value that gently breathes in a loop while `enabled` — used to keep
 * the streak flame feeling alive. Stops (and rests at 1) when disabled (e.g. a
 * streak of 0). Returns the `Animated.Value` for a `transform: [{ scale }]`.
 */
export function usePulse(
  enabled: boolean,
  { min = 1, max = 1.12, duration = 900 }: { min?: number; max?: number; duration?: number } = {}
): Animated.Value {
  const [scale] = useState(() => new Animated.Value(min));

  useEffect(() => {
    if (!enabled) {
      scale.stopAnimation();
      scale.setValue(min);
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(scale, {
          toValue: max,
          duration,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: min,
          duration,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [enabled, min, max, duration, scale]);

  return scale;
}
