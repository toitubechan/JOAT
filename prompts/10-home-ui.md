Read AGENTS.md first and follow it strictly.

Implement the Home screen - the core **visual-first, card-based scroll feed** - exactly as shown in the attached design, with spacing and structure done neatly. This is the surface that should feel as effortless and addictive to scroll as a social feed, but every card leaves the user more capable.

- Render the feed from the parsed content model (`lib/content.ts`) filtered by the user's selected topics from Zustand. Use a recycled list for performance.
- Each card is image-dominant (rendered with `expo-image` via the centralized images import), short scannable text, large touch targets, rounded corners, soft Android `elevation` shadows.
- Show a progress header reading from the Zustand progress store: **coins balance, XP/level, daily streak** (use `streak-fire` and `treasure` assets via the centralized images import).
- Display the logged-in user info from Clerk.
- If any image key is missing, use a suitable placeholder (Unsplash/Picsum) with a blur placeholder while loading so the scroll never shows blank cards.

Designs: feed/tab layout in 05-home-and-tab-navigation.png, full-screen card style in 06-feed-card-screen.png.

@prompt_material/05-home-and-tab-navigation.png
@prompt_material/06-feed-card-screen.png
