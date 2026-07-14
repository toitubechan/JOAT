Read AGENTS.md first and follow it strictly.

This is a change to the already-built app. Prompts 09 and 13 are done and frozen - do NOT edit them; this prompt supersedes them where they conflict.

Two changes:

1. Navigation restructure. The current bottom tabs are Feed, Learn, Progress, Profile. Change them to **Feed, Learn, Library, and Progress**. Move Profile OFF the tab bar and reach it from an avatar/icon in the top header (keep the existing Profile screen; only change how it is opened). Preserve the existing custom tab-bar styling and active-circle animation - only the set of tabs changes. The Library tab's screen and saved-lessons store are built in prompt 20.

2. Progress screen - add lesson lists. In addition to the existing stats (level + XP bar, streak, coins, topic breakdown), the Progress screen lists the user's lessons by status: **completed** and **in-progress (ongoing)**, each opening the lesson reader, with counts and a friendly empty state. Read entirely from the progress store.

Keep Library and Progress distinct - do not merge them:
- Library = saved / bookmarked lessons (prompt 20).
- Progress = completed and in-progress lessons plus stats (this prompt).

Match the design system; typecheck + lint clean.
