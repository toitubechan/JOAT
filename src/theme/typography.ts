/**
 * JOAT typography tokens.
 *
 * Mirrors the `--font-*` and `--text-*` tokens in `src/global.css`. In JSX use
 * the NativeWind classes (`text-h1 font-bold`, `text-body font-sans`, ...);
 * import these only for StyleSheet/inline contexts.
 */

/** Poppins families — keys must match those registered in `theme/fonts.ts`
 *  and the `--font-*` values in `global.css`. */
export const fontFamily = {
  regular: "Poppins-Regular",
  medium: "Poppins-Medium",
  semibold: "Poppins-SemiBold",
  bold: "Poppins-Bold",
} as const;

type TypeStyle = {
  /** font size in px */
  size: number;
  /** line height in px */
  lineHeight: number;
  /** Poppins family for this role */
  family: (typeof fontFamily)[keyof typeof fontFamily];
};

/** The JOAT type scale, keyed by role. */
export const typeScale = {
  h1: { size: 32, lineHeight: 38, family: fontFamily.bold }, // feed card title
  h2: { size: 24, lineHeight: 31, family: fontFamily.semibold }, // section title
  h3: { size: 20, lineHeight: 26, family: fontFamily.semibold }, // card / module title
  h4: { size: 16, lineHeight: 22, family: fontFamily.medium }, // subheading
  bodyLg: { size: 16, lineHeight: 28, family: fontFamily.regular }, // feed card body
  body: { size: 14, lineHeight: 22, family: fontFamily.regular }, // body text
  bodySm: { size: 13, lineHeight: 21, family: fontFamily.regular }, // supporting text
  caption: { size: 11, lineHeight: 15, family: fontFamily.medium }, // labels, meta, chips
} as const satisfies Record<string, TypeStyle>;

export type TypeRole = keyof typeof typeScale;
