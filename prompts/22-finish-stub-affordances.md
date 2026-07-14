Read AGENTS.md first and follow it strictly.

Finish the two remaining non-functional affordances so no dead control ships.

1. Home notification bell (`index.tsx`) is `onPress={() => {}}`. Either implement a simple notifications/announcements panel fed from a typed static list (no backend, consistent with the no-database rule), or - if notifications are out of scope for v1 - remove the bell entirely. State which and do it cleanly; do not leave a no-op.

2. Category-selection search (`category-selection.tsx`) is a non-functional input. Make it a live client-side filter over category and topic titles from `data/index.ts`. Extract the filter into a small reusable helper so Explore (prompt 19) uses the identical logic.

Typecheck + lint clean.
