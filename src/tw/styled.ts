import React from "react";
import { useCssElement } from "react-native-css";

/**
 * Make a React component accept `className` via react-native-css.
 *
 * `useCssElement`'s style-mapping generic builds a `DotNotation` union over
 * every prop of the component, which overflows the TypeScript checker (TS2590)
 * for large RN prop surfaces — ScrollView, Pressable, expo-image, etc. We erase
 * the component's prop type to an open record for that generic only; the runtime
 * component is unchanged, and each wrapper keeps a precise public props type via
 * the `P` generic.
 *
 *   export const View = makeStyled<ViewProps>(RNView);
 */
export function makeStyled<P extends object>(
  Component: React.ComponentType<any>,
  mapping: Record<string, string> = { className: "style" },
): React.FC<P> {
  const Styled: React.FC<P> = (props) =>
    useCssElement(
      Component as React.ComponentType<Record<string, unknown>>,
      props,
      mapping,
    ) as React.ReactElement;
  return Styled;
}
