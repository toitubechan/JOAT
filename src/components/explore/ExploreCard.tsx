/**
 * ExploreCard — a compact lesson card for Explore's horizontal rows
 * (Featured / Recently added).
 *
 * Lesson visual on top (via FeedImage's blur placeholder + deterministic
 * fallback, so partially-wired content never shows a blank card), then a small
 * category chip, the lesson title, and a short meta line. Tapping opens the
 * lesson reader. Memoized for the recycled horizontal lists. Styled with
 * StyleSheet + theme tokens (className is unreliable on device — project memory).
 */
import { memo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { FeedImage } from "@/components/FeedImage";
import type { FeedItem } from "@/lib/feed";
import { colors, fontFamily, radii, typeScale } from "@/theme";

/** Fixed card width for the horizontal rows. */
export const EXPLORE_CARD_WIDTH = 180;

type ExploreCardProps = {
  item: FeedItem;
  onPress: () => void;
};

function ExploreCardBase({ item, onPress }: ExploreCardProps) {
  const { lesson, categoryLabel, tint, bg, xp } = item;
  // First card visual if the lesson has one; FeedImage falls back otherwise.
  const imageKey = lesson.cards.find((card) => card.image != null)?.image;
  // Distinct, lesson-specific title (the topic is shared across many lessons).
  const title = lesson.subtitle || lesson.topic;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${title}. ${lesson.topic}, ${categoryLabel}, ${lesson.estimatedMinutes} min, +${xp} XP.`}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <FeedImage
        imageKey={imageKey}
        fallbackSeed={lesson.id}
        style={styles.image}
        contentFit="cover"
      />

      <View style={styles.body}>
        <View style={[styles.chip, { backgroundColor: bg }]}>
          <Text style={[styles.chipText, { color: tint }]} numberOfLines={1}>
            {categoryLabel}
          </Text>
        </View>

        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
        <Text style={styles.meta} numberOfLines={1}>
          {lesson.topic} · {lesson.estimatedMinutes} min
        </Text>
      </View>
    </Pressable>
  );
}

export const ExploreCard = memo(ExploreCardBase);

const styles = StyleSheet.create({
  card: {
    width: EXPLORE_CARD_WIDTH,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radii.card,
    overflow: "hidden",
    elevation: 2,
  },
  pressed: { opacity: 0.85 },
  image: {
    width: "100%",
    height: 104,
    backgroundColor: colors.surfaceRaised,
  },
  body: { padding: 12 },
  chip: {
    alignSelf: "flex-start",
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  chipText: {
    fontFamily: fontFamily.semibold,
    fontSize: typeScale.caption.size,
  },
  title: {
    color: colors.txt,
    fontFamily: fontFamily.semibold,
    fontSize: typeScale.h4.size,
    lineHeight: 21,
    marginTop: 8,
  },
  meta: {
    color: colors.txtMuted,
    fontFamily: fontFamily.regular,
    fontSize: typeScale.bodySm.size,
    marginTop: 4,
  },
});
