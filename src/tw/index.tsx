/**
 * NativeWind v5 / react-native-css className wrappers.
 *
 * Metro is configured with `globalClassNamePolyfill: false`, so RN core
 * components don't accept `className` directly. Wrap them once here with
 * `makeStyled` and import these throughout the app:
 *
 *   import { View, Text, ScrollView } from "@/tw";
 *
 * Keep this to the primitives screens actually use; add wrappers (Animated
 * lists, TouchableHighlight, Link, ...) when a feature needs them.
 */
import React from "react";
import {
  Platform,
  Pressable as RNPressable,
  ScrollView as RNScrollView,
  Text as RNText,
  TextInput as RNTextInput,
  View as RNView,
} from "react-native";
import { useNativeVariable as useFunctionalVariable } from "react-native-css";

import { makeStyled } from "./styled";

/** Read a CSS variable (e.g. `--color-amber`) from JS. */
export const useCSSVariable =
  Platform.OS !== "web"
    ? useFunctionalVariable
    : (variable: string) => `var(${variable})`;

export type ViewProps = React.ComponentProps<typeof RNView> & {
  className?: string;
};
export const View = makeStyled<ViewProps>(RNView);
View.displayName = "CSS(View)";

export type TextProps = React.ComponentProps<typeof RNText> & {
  className?: string;
};
export const Text = makeStyled<TextProps>(RNText);
Text.displayName = "CSS(Text)";

export type ScrollViewProps = React.ComponentProps<typeof RNScrollView> & {
  className?: string;
  contentContainerClassName?: string;
};
export const ScrollView = makeStyled<ScrollViewProps>(RNScrollView, {
  className: "style",
  contentContainerClassName: "contentContainerStyle",
});
ScrollView.displayName = "CSS(ScrollView)";

export type PressableProps = React.ComponentProps<typeof RNPressable> & {
  className?: string;
};
export const Pressable = makeStyled<PressableProps>(RNPressable);
Pressable.displayName = "CSS(Pressable)";

export type TextInputProps = React.ComponentProps<typeof RNTextInput> & {
  className?: string;
};
export const TextInput = makeStyled<TextInputProps>(RNTextInput);
TextInput.displayName = "CSS(TextInput)";
