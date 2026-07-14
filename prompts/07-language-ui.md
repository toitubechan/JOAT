Read AGENTS.md first and follow it strictly.

Implement the topic / interest selection screen UI based on the attached design. Use the hardcoded topics from `data/topics.ts` and the existing NativeWind/global.css design utilities.

This is where the user picks the skill/interest categories they want to learn (Money & Finance, Cooking Basics, Science Explained, DIY & Home Repair, Mindfulness, Health Essentials, ...). Match the attached design exactly:

- Title "Pick your first category", a search bar ("Search 60+ categories"), and a "POPULAR" section of two-column category cards.
- Each category card shows its colored icon tile, title, and "N lessons" subtitle, pulled from the typed index in `data/topics.ts`.
- The selected card gets the amber border plus a check badge (top-right). Allow selecting one or more.
- Some categories are coin-gated: show the coin cost badge (e.g. "100") on locked cards; selecting/unlocking these ties into the coin economy (see later monetization prompts).
- Keep the secondary "See all categories" button and a primary "Start learning" button at the bottom; "Start learning" is disabled until at least one category is selected.

Use the icon/image keys and accent colors via the centralized images import.

Add a link on the home route (/) to navigate to the category selection screen route.

@prompt_material/04-category-selection-screen.png
