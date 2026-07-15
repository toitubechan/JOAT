/**
 * CustomTabBar — the app's bottom navigation.
 *
 * The active tab is shown as a single dark glyph inside a filled amber circle
 * (no label); inactive tabs show a muted glyph + label. The circle slides
 * smoothly between tabs when the selection changes.
 *
 * Styled with StyleSheet + theme tokens (NativeWind className is unreliable on
 * device — see project memory). The slide uses RN's built-in Animated so it
 * needs no extra setup and runs on the native driver.
 */
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  Text,
  View,
  type LayoutChangeEvent,
} from "react-native";
import { Image } from "expo-image";
import { Tabs } from "expo-router";

import { images, type ImageKey } from "@/constants/images";
import { spacing, typeScale, useThemedStyles, type ThemeColors } from "@/theme";

// Derive the tab-bar prop shape from the Tabs component so we don't depend on
// an internal react-navigation import path.
type TabBarProps = Parameters<
  NonNullable<React.ComponentProps<typeof Tabs>["tabBar"]>
>[0];

type TabMeta = { label: string; activeIcon: ImageKey; inactiveIcon: ImageKey };

/** Route name -> label + the dark (active, on amber) / muted (inactive) glyphs. */
const TAB_META: Record<string, TabMeta> = {
  index: { label: "Home", activeIcon: "homeDark", inactiveIcon: "homeMut" },
  explore: { label: "Explore", activeIcon: "compassDark", inactiveIcon: "compassMut" },
  progress: { label: "Progress", activeIcon: "libraryDark", inactiveIcon: "libraryMut" },
  profile: { label: "Profile", activeIcon: "userDark", inactiveIcon: "userMut" },
  settings: { label: "Settings", activeIcon: "wrenchDark", inactiveIcon: "wrenchMut" },
};

const BAR_HEIGHT = spacing.tabH; // 76
const CIRCLE = 52;
const ICON = 24;

export function CustomTabBar({ state, navigation, insets }: TabBarProps) {
  const styles = useThemedStyles(makeStyles);
  const [barWidth, setBarWidth] = useState(0);
  const tabWidth = barWidth / state.routes.length;

  // Lazy useState initializer keeps the Animated.Value stable across renders
  // without reading a ref during render (react-hooks/refs).
  const [translateX] = useState(() => new Animated.Value(0));
  const initialized = useRef(false);

  // Slide the amber circle to the active tab. First measure jumps without
  // animating; subsequent selections glide.
  useEffect(() => {
    if (!tabWidth) return;
    const target = state.index * tabWidth + (tabWidth - CIRCLE) / 2;
    if (!initialized.current) {
      translateX.setValue(target);
      initialized.current = true;
      return;
    }
    Animated.timing(translateX, {
      toValue: target,
      duration: 220,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [state.index, tabWidth, translateX]);

  const activeMeta = TAB_META[state.routes[state.index]?.name];

  return (
    <View style={[styles.bar, { paddingBottom: insets.bottom }]}>
      <View
        style={styles.row}
        onLayout={(e: LayoutChangeEvent) => setBarWidth(e.nativeEvent.layout.width)}
      >
        {state.routes.map((route, index) => {
          const meta = TAB_META[route.name];
          if (!meta) return null;
          const focused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });
            if (!focused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <Pressable
              key={route.key}
              accessibilityRole="button"
              accessibilityState={focused ? { selected: true } : {}}
              accessibilityLabel={meta.label}
              onPress={onPress}
              style={styles.tab}
            >
              {/* Active tab is covered by the floating amber circle below, so it
                  renders no inline content. */}
              {!focused && (
                <>
                  <Image
                    source={images[meta.inactiveIcon]}
                    contentFit="contain"
                    style={styles.icon}
                  />
                  <Text style={styles.label}>{meta.label}</Text>
                </>
              )}
            </Pressable>
          );
        })}

        {/* Sliding active indicator. Sits on top (taps pass through) so it
            glides over the tab row between selections. */}
        {tabWidth > 0 && activeMeta && (
          <Animated.View
            pointerEvents="none"
            style={[styles.circle, { transform: [{ translateX }] }]}
          >
            <Image
              source={images[activeMeta.activeIcon]}
              contentFit="contain"
              style={styles.icon}
            />
          </Animated.View>
        )}
      </View>
    </View>
  );
}

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
  bar: {
    backgroundColor: c.tabbar,
    borderTopWidth: 1,
    borderTopColor: c.line,
  },
  row: {
    height: BAR_HEIGHT,
    flexDirection: "row",
    alignItems: "center",
  },
  tab: {
    flex: 1,
    height: BAR_HEIGHT,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  icon: { width: ICON, height: ICON },
  label: {
    color: c.txtMuted,
    fontFamily: typeScale.caption.family,
    fontSize: typeScale.caption.size,
    lineHeight: typeScale.caption.lineHeight,
  },
  circle: {
    position: "absolute",
    left: 0,
    top: (BAR_HEIGHT - CIRCLE) / 2,
    width: CIRCLE,
    height: CIRCLE,
    borderRadius: CIRCLE / 2,
    backgroundColor: c.amber,
    alignItems: "center",
    justifyContent: "center",
  },
});
