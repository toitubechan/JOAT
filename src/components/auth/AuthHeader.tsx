/**
 * AuthHeader — top of the Sign Up / Sign In screens.
 *
 * Back chevron, headline + subtitle, then the centered mascot. The two auth
 * screens share this exact block and only swap the copy via props.
 */
import { Image } from "expo-image";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { images } from "@/constants/images";
import { colors, fontFamily, typeScale } from "@/theme";

type AuthHeaderProps = {
  title: string;
  subtitle: string;
};

export function AuthHeader({ title, subtitle }: AuthHeaderProps) {
  return (
    <View>
      {/* Back chevron — left-pointing, drawn from two borders (no icon dep). */}
      <Pressable
        onPress={() => router.back()}
        hitSlop={12}
        style={styles.backBtn}
      >
        <View style={styles.chevron} />
      </Pressable>

      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>

      <View style={styles.mascotWrap}>
        <Image
          source={images.mascotWelcome}
          style={styles.mascot}
          contentFit="contain"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  backBtn: {
    width: 32,
    height: 32,
    justifyContent: "center",
    marginTop: 4,
  },
  chevron: {
    width: 13,
    height: 13,
    borderColor: colors.txt,
    borderLeftWidth: 2.5,
    borderBottomWidth: 2.5,
    transform: [{ rotate: "45deg" }],
    marginLeft: 4,
  },

  title: {
    color: colors.txt,
    fontFamily: fontFamily.bold,
    fontSize: 30,
    lineHeight: 36,
    marginTop: 18,
  },
  subtitle: {
    color: colors.txtSecondary,
    fontFamily: fontFamily.regular,
    fontSize: typeScale.body.size,
    lineHeight: typeScale.body.lineHeight,
    marginTop: 6,
  },

  mascotWrap: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
  },
  mascot: { width: 160, height: 152 },
});
