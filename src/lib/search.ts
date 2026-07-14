/**
 * Tiny, reusable client-side search/filter (no backend, no fuzzy lib).
 *
 * Shared so the Explore screen (prompt 19) and the category-selection search
 * (prompt 22) behave identically: a forgiving, case-insensitive, token-AND match
 * — every whitespace-separated word in the query must appear somewhere in the
 * item's searchable fields.
 *
 * Kept deliberately simple (lowercase substring match, no diacritic stripping)
 * so it's safe on Hermes and obvious to teach.
 */

/** Lowercase + collapse whitespace for forgiving matching. */
export function normalize(text: string): string {
  return text.toLowerCase().replace(/\s+/g, " ").trim();
}

/** True if every token in `query` appears in `text` (case-insensitive). */
export function matchesQuery(text: string, query: string): boolean {
  const tokens = normalize(query).split(" ").filter(Boolean);
  if (tokens.length === 0) return true;
  const hay = normalize(text);
  return tokens.every((token) => hay.includes(token));
}

/**
 * Filter `items` by a query against the strings returned by `getFields`. An item
 * matches when every query token appears across its joined fields. An empty
 * query returns everything (callers usually skip filtering in that case).
 */
export function filterByQuery<T>(
  items: T[],
  query: string,
  getFields: (item: T) => (string | undefined)[]
): T[] {
  const tokens = normalize(query).split(" ").filter(Boolean);
  if (tokens.length === 0) return items;
  return items.filter((item) => {
    const hay = normalize(getFields(item).filter(Boolean).join(" "));
    return tokens.every((token) => hay.includes(token));
  });
}
