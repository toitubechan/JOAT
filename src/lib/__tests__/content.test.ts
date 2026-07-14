/**
 * Tests for the markdown → typed-model parser (`lib/content.ts`).
 *
 * Exercises frontmatter extraction, `## Card:` splitting, optional `image:`
 * stripping (known + unknown key), `## Quiz` parsing, the dev-mode validation
 * warnings, and malformed-input edge cases — all from crafted strings via the
 * exported `parseLesson`, so no bundled content or assets are loaded.
 */
import { describe, expect, it, jest } from "@jest/globals";

import { parseLesson } from "@/lib/content";

// Deterministic, tiny image registry so "known vs unknown key" is stable and we
// never pull in the ~200 real assets that `constants/images.ts` imports. Babel
// hoists this `jest.mock` above the imports, so it's registered before
// `@/lib/content` (and its `@/constants/images` import) loads.
jest.mock("@/constants/images", () => ({
  images: { bankHero: 1, mascotLogo: 1 },
}));

const FRONTMATTER = `---
id: finance-banking-what-a-bank-does
category: Money & Finance
topic: Banking & Accounts
subtitle: What a bank actually does
icon: walletIcon
estimated_minutes: 4
order: 1
---`;

describe("parseLesson — frontmatter", () => {
  it("extracts every field, coercing the numeric ones", () => {
    const lesson = parseLesson(`${FRONTMATTER}\n## Card: Intro\nHello.\n`);
    expect(lesson.id).toBe("finance-banking-what-a-bank-does");
    expect(lesson.category).toBe("Money & Finance");
    expect(lesson.topic).toBe("Banking & Accounts");
    expect(lesson.subtitle).toBe("What a bank actually does");
    expect(lesson.icon).toBe("walletIcon");
    expect(lesson.estimatedMinutes).toBe(4);
    expect(lesson.order).toBe(1);
  });

  it("defaults a missing key and a non-numeric number", () => {
    const lesson = parseLesson(`---\nid: x\n---\n## Card: A\nBody\n`);
    expect(lesson.id).toBe("x");
    expect(lesson.category).toBe("");
    expect(lesson.topic).toBe("");
    expect(lesson.estimatedMinutes).toBe(0);
    expect(lesson.order).toBe(0);
  });

  it("treats markdown with no frontmatter as empty meta + a parsed body", () => {
    const lesson = parseLesson(`## Card: Solo\nJust a card.\n`);
    expect(lesson.id).toBe("");
    expect(lesson.cards).toHaveLength(1);
    expect(lesson.cards[0].title).toBe("Solo");
  });
});

describe("parseLesson — cards", () => {
  it("splits multiple `## Card:` sections with titles + bodies", () => {
    const md = `${FRONTMATTER}
## Card: First
Body one.

## Card: Second
Body two line A.
Body two line B.

## Quiz
1. Q?
- [x] Right
- [ ] Wrong
> Because.
`;
    const lesson = parseLesson(md);
    expect(lesson.cards).toHaveLength(2);
    expect(lesson.cards[0].title).toBe("First");
    expect(lesson.cards[0].body).toBe("Body one.");
    expect(lesson.cards[1].title).toBe("Second");
    expect(lesson.cards[1].body).toBe("Body two line A.\nBody two line B.");
  });

  it("an empty card has an empty body and no image", () => {
    const lesson = parseLesson(`${FRONTMATTER}\n## Card: Empty\n`);
    expect(lesson.cards).toHaveLength(1);
    expect(lesson.cards[0].body).toBe("");
    expect(lesson.cards[0].image).toBeUndefined();
  });
});

describe("parseLesson — image stripping", () => {
  it("captures a known `image:` key and removes the line from the body", () => {
    const lesson = parseLesson(
      `${FRONTMATTER}\n## Card: Visual\nimage: bankHero\nText after image.\n`
    );
    expect(lesson.cards[0].image).toBe("bankHero");
    expect(lesson.cards[0].body).toBe("Text after image.");
  });

  it("drops an unknown `image:` key, still strips the line, and warns in dev", () => {
    const warn = jest.spyOn(console, "warn").mockImplementation(() => {});
    const lesson = parseLesson(
      `${FRONTMATTER}\n## Card: Visual\nimage: notARealKey\nBody.\n`
    );
    expect(lesson.cards[0].image).toBeUndefined();
    expect(lesson.cards[0].body).toBe("Body.");
    expect(warn).toHaveBeenCalledWith(expect.stringContaining("Unknown image key"));
    warn.mockRestore();
  });
});

describe("parseLesson — quiz", () => {
  it("parses questions, marks the correct option, and captures the explanation", () => {
    const md = `${FRONTMATTER}
## Card: A
Body.

## Quiz
1. What is 2 + 2?
- [ ] Three
- [x] Four
- [ ] Five
> Four is correct.

2. Capital of France?
- [x] Paris
- [ ] Berlin
> Paris.
`;
    const { quiz } = parseLesson(md);
    expect(quiz.questions).toHaveLength(2);
    expect(quiz.questions[0].prompt).toBe("What is 2 + 2?");
    expect(quiz.questions[0].options).toEqual(["Three", "Four", "Five"]);
    expect(quiz.questions[0].correctIndex).toBe(1);
    expect(quiz.questions[0].explanation).toBe("Four is correct.");
    expect(quiz.questions[1].correctIndex).toBe(0);
  });

  it("a lesson with no `## Quiz` has an empty questions list", () => {
    const lesson = parseLesson(`${FRONTMATTER}\n## Card: Only\nNo quiz here.\n`);
    expect(lesson.quiz.questions).toEqual([]);
  });

  it("warns when a question has no correct answer", () => {
    const warn = jest.spyOn(console, "warn").mockImplementation(() => {});
    parseLesson(`${FRONTMATTER}\n## Quiz\n1. No correct option?\n- [ ] A\n- [ ] B\n> Hmm.\n`);
    expect(warn).toHaveBeenCalledWith(expect.stringContaining("no correct answer"));
    warn.mockRestore();
  });

  it("warns on multiple correct answers and the later marker wins", () => {
    const warn = jest.spyOn(console, "warn").mockImplementation(() => {});
    const { quiz } = parseLesson(
      `${FRONTMATTER}\n## Quiz\n1. Two right?\n- [x] A\n- [x] B\n> Both.\n`
    );
    expect(warn).toHaveBeenCalledWith(expect.stringContaining("multiple correct answers"));
    expect(quiz.questions[0].correctIndex).toBe(1);
    warn.mockRestore();
  });
});
