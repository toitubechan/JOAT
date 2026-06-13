/**
 * className-enabled `expo-image` (the app's primary visual layer).
 *
 *   import { Image } from "@/tw/image";
 *   <Image source={images.mascotLogo} className="h-16 w-16 object-contain" />
 *
 * Maps the CSS `object-fit` / `object-position` styles onto expo-image's
 * `contentFit` / `contentPosition` props.
 */
import React from "react";
import { StyleSheet } from "react-native";
import Animated from "react-native-reanimated";
import { Image as ExpoImage } from "expo-image";

import { makeStyled } from "./styled";

const AnimatedExpoImage = Animated.createAnimatedComponent(ExpoImage);

type AnimatedImageProps = React.ComponentProps<typeof AnimatedExpoImage>;
type ExpoImageProps = React.ComponentProps<typeof ExpoImage>;

function CSSImage(props: AnimatedImageProps) {
  // Remap the web-style object-fit / object-position that NativeWind emits onto
  // expo-image's content props (those keys aren't part of RN's style type).
  const flat = (StyleSheet.flatten(props.style) ?? {}) as Record<string, unknown>;
  const { objectFit, objectPosition, ...style } = flat;

  return (
    <AnimatedExpoImage
      contentFit={objectFit as ExpoImageProps["contentFit"]}
      contentPosition={objectPosition as ExpoImageProps["contentPosition"]}
      {...props}
      source={
        typeof props.source === "string" ? { uri: props.source } : props.source
      }
      style={style as AnimatedImageProps["style"]}
    />
  );
}

export type ImageProps = AnimatedImageProps & { className?: string };
export const Image = makeStyled<ImageProps>(CSSImage);
Image.displayName = "CSS(Image)";
