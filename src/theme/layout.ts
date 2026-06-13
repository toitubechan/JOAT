/**
 * JOAT layout tokens — corner radii and named spacing (px).
 *
 * Mirrors the `--radius-*` and `--spacing-*` tokens in `src/global.css`. In JSX
 * use the NativeWind classes (`rounded-card`, `p-screen`, `h-btn-h`, ...);
 * import these only for StyleSheet/inline contexts.
 */

/** Corner radii (px). */
export const radii = {
  tile: 13, // icon tiles
  input: 16, // inputs, list items, social buttons
  card: 18, // category cards, quiz options, banners
  hero: 22, // daily-goal / continue-learning cards
} as const;

/** Named spacing (px) on top of the 4pt grid. */
export const spacing = {
  screen: 24, // default horizontal screen padding
  screenTight: 22,
  tabH: 76, // tab bar height
  btnH: 56, // primary button height
  inputH: 64,
  railBtn: 48, // feed save/share round buttons
  iconTile: 42,
} as const;

export type RadiusToken = keyof typeof radii;
export type SpacingToken = keyof typeof spacing;
