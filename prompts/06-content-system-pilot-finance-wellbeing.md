Read AGENTS.md first and follow it strictly.

Build the markdown-driven pilot content system for the first test release. The current goal is NOT to import the full content library yet. Only introduce:

- `Mindfulness & Mental Wellbeing`
- `Money & Finance`

Content is the source of truth in `content/`; do not hardcode lesson prose in TypeScript. The source lesson files currently live outside this repo at:

```txt
C:\Users\AhmedAmineFEKI\Downloads\Obsidian\Applications\Primer\MD Files for topics
```

Copy only the pilot lessons into this app's `content/` folder. Do not copy all 740 lessons.

## Pilot Lesson Scope

Include every `.md` file matching these filename prefixes:

```txt
mindful-*
personal-finance-*
banking-accounts-*
credit-loans-*
saving-budgeting-*
investing-basics-*
taxes-*
insurance-*
crypto-*
```

Expected pilot size: 58 lesson files.

Expected groups:

- Mindfulness & Mental Wellbeing: 10 lessons
- Money & Finance / Personal Finance: 7 lessons
- Money & Finance / Banking & Accounts: 7 lessons
- Money & Finance / Credit & Loans: 7 lessons
- Money & Finance / Saving & Budgeting: 6 lessons
- Money & Finance / Investing Basics: 6 lessons
- Money & Finance / Taxes Explained: 5 lessons
- Money & Finance / Insurance: 5 lessons
- Money & Finance / Crypto Basics: 5 lessons

## Lesson File Format

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
image: optionalImageKey
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
```

## Parser Rules

- Frontmatter keys are always: `id`, `category`, `topic`, `subtitle`, `icon`, `estimated_minutes`, `order`.
- Key every lesson by frontmatter `id`, not filename.
- Each `## Card: <Title>` is one feed card.
- Preserve card body markdown exactly enough to render bold text, paragraphs, and bullet lists.
- A card may include `image: <key>` as the first line under its heading.
- When an image line exists, parse it into `Card.image` and strip that line from the card body.
- When no image line exists, render a text-forward card.
- Resolve image keys through `src/constants/images.ts`.
- Each lesson has one `## Quiz` block at the end.
- Parse quiz questions into `{ prompt, options, correctIndex, explanation }`.
- `- [x]` marks the correct option. `- [ ]` marks incorrect options.
- The `>` blockquote line is the answer explanation.

## Code To Create

- `src/types/content.ts`
  - Define `Topic`, `Subtopic`, `Lesson`, `Card`, `Quiz`, and `QuizQuestion`.
  - `Card.image` is optional.
  - `Lesson` carries frontmatter metadata, ordered `cards`, and a `quiz`.

- `src/data/index.ts`
  - Build a typed index from parsed lessons.
  - Group by `category -> topic -> lessons`.
  - Sort lessons by `order`.
  - Include titles, icons, counts, and lesson ids.
  - Do not duplicate lesson prose in TypeScript.

- `src/lib/content.ts`
  - Load bundled pilot markdown at runtime.
  - React Native cannot use Node `fs` at runtime, so choose a bundling approach that works in Expo Go.
  - Prefer a simple, teachable approach for this pilot.
  - Parse frontmatter, cards, optional image keys, and quiz blocks into the typed model.
  - Cache parsed results in memory.

- `content/`
  - Store only the pilot markdown files listed above.

## Image Integration

The pilot images already exist in:

```txt
assets/images/
assets/images/lessons/
```

The central image registry is:

```txt
src/constants/images.ts
```

Cards that include `image: <key>` must render that visual with `expo-image` via the centralized image object. Do not import image assets directly inside screens or card components.

## Constraints

- Android only.
- Expo Go friendly.
- No live/runtime AI.
- No database.
- Do not install any new library without asking first.
- Keep the implementation simple and teachable.
- Do not reformat all lesson markdown just to satisfy the parser. Adapt the parser to the existing format.
- Do not import the full Primer library yet. This prompt is only for the Finance + Wellbeing pilot.

## Validation

Run:

```bash
npm run lint
npx tsc --noEmit
```

If `npm run typecheck` exists later, run it too. At the moment this repo may not define that script.
