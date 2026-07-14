Read AGENTS.md first and follow it strictly.

Implement the full-screen Lesson experience exactly as shown in the attached design. When the user taps a card or subtopic from the Feed/Learn screen, open this screen with the selected lesson id and render that lesson's ordered cards from the parsed content model (`lib/content.ts`).

- A lesson is a swipeable sequence of full-screen cards (one `## Card:` each), with a progress indicator showing position in the lesson (e.g. "4 / 8").
- Cards are image-optional. When a card has an `image:` key, show the visual with `expo-image` (cached, blur placeholder while loading). When it has none, render a clean text-forward card - do not insert a placeholder image. Most cards will be text-only; the layout must look intentional either way.
- Card bodies vary in length. Show a sensible amount at a glance and add a "Read more" affordance to expand long bodies, so the card stays scannable and the swipe rhythm holds.
- After the last content card, present the lesson's end-of-lesson quiz round parsed from the `## Quiz` block (see the quiz prompt), then a lesson-completion state. Mark the lesson complete in the progress store.
- No locking logic for now - any lesson can be opened. Each lesson/subtopic entry on the Learn screen should still visually indicate status (completed, in progress, not started) from the Zustand progress store.
- Content already exists (the bundled lesson `.md` files) - render from it, do not invent lessons.

@prompt_material/06-feed-card-screen.png
