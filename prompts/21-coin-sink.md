Read AGENTS.md first and follow it strictly.

Wire the coin sink: a spend-to-unlock flow for coin-locked categories. Coins are earnable today (quiz + rewarded ads) but there is no spend path - locked categories show a cost badge that does nothing. The earn side is done; wire the spend side.

- Add unlock state to `store/progress.ts`: `unlockedCategoryIds`, and `unlockCategory(id, cost)` that deducts coins (reuse the existing negative-amount guard), persists, and is idempotent. Pro users (`isPro`) unlock everything without spending.
- On a locked category's cost badge (category selection and Explore), open an unlock confirmation showing the cost versus the current coin balance. On confirm, deduct and unlock. If the balance is short, offer the rewarded-ad earn flow (`hooks/ads.ts`) and re-check on completion.
- Reflect unlocked state in the UI immediately and gate lesson access on it.

This is the counterpart to the rewarded-ad earn flow already in place - it makes earned coins matter. Match the design system; typecheck + lint clean.
