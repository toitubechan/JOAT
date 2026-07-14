Read AGENTS.md first and follow it strictly.

Build the markdown-driven content system. Content is the source of truth in `content/`; do not hardcode lesson prose in TypeScript. The parser must match the EXACT format of the existing lesson files (740 of them, fully consistent) - adapt the parser to the content, do not reformat the content.

## Lesson file format (the contract)

Each lesson is one `.md` file:

```md
---
id: finance-banking-debit-vs-credit
category: Money & Finance
topic: Banking & Accounts
subtitle: What's really happening when you tap or swipe
icon: credit-card
estimated_minutes: 4
order: 3
---
## Card: What it is
Body markdown - paragraphs and/or bullet lists.

## Card: Key terms
- **Term**: definition.
- **Term**: definition.

## Quiz
1. Question text?
- [x] Correct option
- [ ] Wrong option
- [ ] Wrong option
> One-line explanation shown after answering.

2. Next question?
- [x] Correct option
- [ ] Wrong option
> Explanation.
```

Rules the parser MUST follow:

- **Frontmatter** keys are always: `id, category, topic, subtitle, icon, estimated_minutes, order`. Key every lesson by `id` (the source of truth - do NOT rely on the filename; some disagree with their `id`).
- **Cards**: each `## Card: <Title>` is one feed card. There are typically 7 per lesson. The heading text is the card title; everything until the next `##` is the card body (preserve markdown - bold, bullet lists).
- **Optional image**: a card MAY include an `image: <key>` line as the first line under its heading. It is optional - not every card has or needs a visual. When present, resolve the key via `constants/images.ts` (or a remote URL later) and strip it from the body. When absent, render a text-forward card.
- **Quiz**: the single `## Quiz` block at the end is the lesson's end-of-lesson quiz round (matches the quiz screen design). Parse each numbered question into `{ prompt, options[], correctIndex, explanation }`: `- [x]` marks the correct option, `- [ ]` the rest; the `>` blockquote line is the explanation.

## Code to create

- `types/content.ts` - `Topic`, `Subtopic`, `Lesson`, `Card`, `Quiz`, `QuizQuestion`. `Card.image` is optional. A `Lesson` carries its frontmatter metadata + ordered `Card[]` + a `Quiz`.
- `data/index.ts` - build the typed topic index by grouping lessons: `category` -> `topic` -> lessons (sorted by `order`). Titles, icons, counts only - not prose.
- `lib/content.ts` - load the bundled markdown at runtime (RN can't `fs.read` like Node - bundle `.md` as strings via a Metro transformer, or ship as assets and load via `expo-asset` + `expo-file-system`; pick one and keep it consistent), parse frontmatter + cards + quiz into the typed models per the contract above, and cache parsed results in memory.
- `content/` - the existing lesson `.md` files live here.

Quizzes and optional image placement must be expressible from the parsed model so cards render generically from data. No database.
