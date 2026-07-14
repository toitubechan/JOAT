/**
 * QuizRound — the end-of-lesson quiz (design 07).
 *
 * Renders the lesson's parsed `## Quiz` one question at a time: tap an option to
 * lock in an answer, see the result + explanation, then advance with the amber
 * CTA until the last question, which finishes the lesson. A first correct answer
 * awards XP + coins via `onAward`; re-reviewing an already-completed lesson runs
 * with `rewardsEnabled={false}` so progress can't be farmed.
 *
 * Header / progress mirror the cards reader but in the quiz's centered layout.
 * Styled with StyleSheet + theme tokens (className is unreliable on device).
 */
import { useState } from "react";
import { Image } from "expo-image";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { images } from "@/constants/images";
import { ProgressBar } from "@/components/ProgressBar";
import { QuizOption, type QuizOptionState } from "@/components/lesson/QuizOption";
import { trackQuizAnswered } from "@/lib/analytics";
import { useProgressStore } from "@/store";
import { colors, fontFamily, radii, spacing, typeScale } from "@/theme";
import type { Lesson } from "@/types/content";

/** Reward for a first-time correct answer (matches the design's reward chips). */
const XP_PER_QUESTION = 10;
const COINS_PER_QUESTION = 5;

type QuizRoundProps = {
  lesson: Lesson;
  /** When false (lesson already completed), correct answers grant nothing. */
  rewardsEnabled: boolean;
  onAward: (xp: number, coins: number) => void;
  onClose: () => void;
  onComplete: () => void;
};

export function QuizRound({
  lesson,
  rewardsEnabled,
  onAward,
  onClose,
  onComplete,
}: QuizRoundProps) {
  const insets = useSafeAreaInsets();
  const questions = lesson.quiz.questions;
  const answerQuiz = useProgressStore((s) => s.answerQuiz);

  const [qIndex, setQIndex] = useState(0);
  // Per-question selections, keyed by question index → chosen option index.
  // Seeded once from any persisted answers (store `quizAnswers`) so reopening a
  // lesson restores prior results instead of showing a blank quiz.
  const [answers, setAnswers] = useState<Record<number, number>>(() => {
    const stored = useProgressStore.getState().quizAnswers;
    const seed: Record<number, number> = {};
    questions.forEach((_, i) => {
      const value = stored[`${lesson.id}:${i}`];
      if (value !== undefined) seed[i] = value;
    });
    return seed;
  });

  // Questions whose answers were restored from a previous visit. Their results
  // are shown, but the reward chips are suppressed — any reward was already
  // granted, so we never imply a fresh earn on a restored answer.
  const [restored] = useState<Set<number>>(() => {
    const stored = useProgressStore.getState().quizAnswers;
    const set = new Set<number>();
    questions.forEach((_, i) => {
      if (stored[`${lesson.id}:${i}`] !== undefined) set.add(i);
    });
    return set;
  });

  const question = questions[qIndex];
  // `?? null` (not `||`) so option index 0 stays a valid selection.
  const selected = answers[qIndex] ?? null;
  const answered = selected !== null;
  const isCorrect = answered && selected === question.correctIndex;
  const isLast = qIndex === questions.length - 1;

  const choose = (index: number) => {
    if (answered) return;
    setAnswers((prev) => ({ ...prev, [qIndex]: index }));
    // Persist the selection so it survives leaving + reopening the lesson. A
    // restored answer is seeded straight into state and never re-runs `choose`,
    // so it can't re-fire a reward — the first-time-only logic is unchanged.
    answerQuiz(lesson.id, qIndex, index);
    const correct = index === question.correctIndex;
    // quiz_id mirrors how the store keys answers (`${lessonId}:${questionIndex}`).
    trackQuizAnswered({
      lesson_id: lesson.id,
      quiz_id: `${lesson.id}:q${qIndex}`,
      correct,
    });
    if (correct && rewardsEnabled) {
      onAward(XP_PER_QUESTION, COINS_PER_QUESTION);
    }
  };

  const next = () => {
    if (isLast) {
      onComplete();
      return;
    }
    // `selected` is derived from `answers[qIndex]`, so advancing the index alone
    // reveals the next question's stored answer (or a clean slate if unanswered).
    setQIndex((i) => i + 1);
  };

  const optionState = (index: number): QuizOptionState => {
    if (!answered) return "idle";
    if (index === question.correctIndex) return "correct";
    if (index === selected) return "wrong";
    return "muted";
  };

  return (
    <View style={styles.root}>
      {/* Header: close · "Quiz" + topic · mascot */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Pressable
          onPress={onClose}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel="Close lesson"
          style={({ pressed }) => pressed && styles.pressed}
        >
          <Image source={images.closeWhite} style={styles.close} contentFit="contain" />
        </Pressable>

        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Quiz</Text>
          <Text style={styles.headerSubtitle} numberOfLines={1}>
            {lesson.topic}
          </Text>
        </View>

        <View style={styles.avatar}>
          <Image source={images.jackHead} style={styles.avatarIcon} contentFit="contain" />
        </View>
      </View>

      {/* Progress: "n / N" + continuous bar */}
      <View style={styles.progressRow}>
        <Text style={styles.progressText}>
          {qIndex + 1} / {questions.length}
        </Text>
        <ProgressBar progress={(qIndex + 1) / questions.length} style={styles.progressBar} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.kicker}>ANSWER TO COMPLETE THE LESSON</Text>
        <Text style={styles.prompt}>{question.prompt}</Text>

        <View style={styles.options}>
          {question.options.map((option, i) => (
            <QuizOption
              key={i}
              text={option}
              state={optionState(i)}
              disabled={answered}
              onPress={() => choose(i)}
            />
          ))}
        </View>

        {answered && (
          <View style={[styles.explain, isCorrect ? styles.explainCorrect : styles.explainWrong]}>
            <Text style={[styles.explainTitle, isCorrect ? styles.explainTitleCorrect : styles.explainTitleWrong]}>
              {isCorrect ? "Correct!" : "Not quite"}
            </Text>
            <Text style={styles.explainText}>{question.explanation}</Text>
          </View>
        )}
      </ScrollView>

      {/* Footer: reward chips (on a first correct answer) + CTA */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        {isCorrect && rewardsEnabled && !restored.has(qIndex) && (
          <View style={styles.rewards}>
            <View style={styles.rewardChip}>
              <Image source={images.boltAmber} style={styles.rewardIcon} contentFit="contain" />
              <Text style={styles.rewardText}>+{XP_PER_QUESTION} XP</Text>
            </View>
            <View style={styles.rewardChip}>
              <Image source={images.coinIcon} style={styles.rewardIcon} contentFit="contain" />
              <Text style={styles.rewardText}>+{COINS_PER_QUESTION} coins</Text>
            </View>
          </View>
        )}

        <Pressable
          onPress={next}
          disabled={!answered}
          accessibilityRole="button"
          style={({ pressed }) => [
            styles.cta,
            !answered && styles.ctaDisabled,
            pressed && answered && styles.pressed,
          ]}
        >
          <Text style={styles.ctaText}>
            {isLast ? "Finish" : "Next question"} <Text style={styles.ctaChevron}>›</Text>
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.ink },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.screen,
    paddingBottom: 12,
  },
  close: { width: 22, height: 22 },
  headerCenter: { flex: 1, alignItems: "center" },
  headerTitle: {
    color: colors.txt,
    fontFamily: fontFamily.bold,
    fontSize: typeScale.h4.size,
    lineHeight: 22,
  },
  headerSubtitle: {
    color: colors.txtMuted,
    fontFamily: fontFamily.regular,
    fontSize: typeScale.bodySm.size,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  avatarIcon: { width: 40, height: 40 },

  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingHorizontal: spacing.screen,
    marginTop: 4,
    marginBottom: 8,
  },
  progressText: {
    color: colors.txtMuted,
    fontFamily: fontFamily.bold,
    fontSize: typeScale.bodySm.size,
  },
  progressBar: { flex: 1 },

  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: spacing.screen,
    paddingTop: 20,
    paddingBottom: 24,
  },
  kicker: {
    color: colors.teal,
    fontFamily: fontFamily.bold,
    fontSize: typeScale.caption.size,
    letterSpacing: 1.2,
  },
  prompt: {
    color: colors.txt,
    fontFamily: typeScale.h1.family,
    fontSize: 28,
    lineHeight: 34,
    marginTop: 14,
  },
  options: { gap: 14, marginTop: 26 },

  explain: {
    marginTop: 22,
    padding: 16,
    borderRadius: radii.card,
    borderWidth: 1,
  },
  explainCorrect: {
    backgroundColor: colors.successBg,
    borderColor: colors.successBorder,
  },
  explainWrong: {
    backgroundColor: colors.dangerBg,
    borderColor: colors.dangerBorder,
  },
  explainTitle: {
    fontFamily: fontFamily.bold,
    fontSize: typeScale.h4.size,
    marginBottom: 6,
  },
  explainTitleCorrect: { color: colors.success },
  explainTitleWrong: { color: colors.danger },
  explainText: {
    color: colors.txtSecondary,
    fontFamily: fontFamily.regular,
    fontSize: typeScale.body.size,
    lineHeight: typeScale.body.lineHeight,
  },

  footer: {
    paddingHorizontal: spacing.screen,
    paddingTop: 12,
  },
  rewards: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 14,
    marginBottom: 16,
  },
  rewardChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: "rgba(255,176,32,0.10)",
    borderWidth: 1,
    borderColor: "rgba(255,176,32,0.35)",
  },
  rewardIcon: { width: 16, height: 16 },
  rewardText: {
    color: colors.amber,
    fontFamily: fontFamily.bold,
    fontSize: typeScale.body.size,
  },

  cta: {
    height: spacing.btnH,
    borderRadius: radii.card,
    backgroundColor: colors.amber,
    alignItems: "center",
    justifyContent: "center",
  },
  ctaDisabled: { opacity: 0.4 },
  ctaText: {
    color: colors.txtOnAmber,
    fontFamily: fontFamily.bold,
    fontSize: 17,
  },
  ctaChevron: {
    color: colors.txtOnAmber,
    fontFamily: fontFamily.bold,
    fontSize: 19,
  },
  pressed: { opacity: 0.85 },
});
