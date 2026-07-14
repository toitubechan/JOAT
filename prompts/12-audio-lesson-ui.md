Read AGENTS.md first and follow it strictly.

Implement interactive **quiz cards with instant feedback** inside the lesson flow. A quiz is just another card type in the parsed content model (`Quiz`), so it renders generically from data alongside lesson cards.

- Build a `QuizCard` component: prompt, tappable options, and on selection an **immediate** correct/incorrect reaction (color, icon, short haptic) plus the explanation from the content model.
- On a correct answer, award XP and coins via the Zustand progress store actions; reflect the change visibly in the header so progress is felt, not buried.
- Wrong answers are non-punishing: reveal the explanation and let the user continue. Track the answer in card/quiz state.
- Keep the experience snappy — no blocking spinners, feedback within the same frame as the tap.
- Match the attached design exactly: spacing, option states (default / selected / correct / incorrect), and the feedback banner.

This replaces any audio/video lesson concept — there is no live AI, audio call, mic, or captions in this app.

@prompt_material/07-quiz-screen.png
