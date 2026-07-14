Read AGENTS.md first and follow it strictly.

Resolve the dead store state. `quizAnswers` and `answerQuiz` are defined in `store/progress.ts` but never called - `QuizRound.tsx` uses local state, so quiz answers are neither persisted nor restored.

- Default to wiring it (persistence is the more useful outcome): have `QuizRound.tsx` record each selection via `answerQuiz`, and restore prior answers from `quizAnswers` on mount, so returning to a completed lesson shows previous quiz results instead of a blank slate.
- Keep the first-time-only reward logic exactly as today - rewards still award once, tracked in the ref/flag already used; persistence must not cause re-awards.
- If, on inspection, wiring adds no real v1 value, instead delete `quizAnswers` and `answerQuiz` so the store carries no dead state.

Pick one path and leave the store clean. Typecheck + lint clean.
