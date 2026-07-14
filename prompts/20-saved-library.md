Read AGENTS.md first and follow it strictly.

Persist saved lessons and build the Library screen. Today the reader bookmark in `lesson/[id].tsx` is local `useState` only, so a save does not survive navigation and there is no list of saved lessons.

- Add a saved-lessons slice to `store/progress.ts` (AsyncStorage-persisted like the rest of the store): `savedLessonIds`, `toggleSaved(id)`, `isSaved(id)`. Guard against duplicates.
- Replace the reader's local bookmark state with this store so saves persist and the bookmark reflects correctly everywhere it appears.
- Build the Library screen (the Library tab): it lists the user's saved lessons only (reuse card components + `FeedImage`), each opening the reader, with a friendly empty state when there are none.

The Library tab itself, the four-tab layout, and Profile-in-header are introduced in prompt 28. Keep Library and Progress distinct - do not merge them:
- Library = saved lessons (this prompt).
- Progress = completed and in-progress lessons plus stats (prompt 28).

Match the design system; typecheck + lint clean.
