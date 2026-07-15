/**
 * LessonListItem — one "Today's picks" row.
 *
 * Category icon tile + title + meta ("Category · 4 min · +20 XP", XP in amber) +
 * a right-side status indicator: a green check (completed), an amber ring with a
 * dot (in progress), or an empty grey ring (not started). Memoized so the
 * recycled feed re-renders only the rows that change. Styled with StyleSheet +
 * theme tokens; the icon routes through the centralized images.
 */
import { memo } from "react";
import { Image } from "expo-image";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { FeedImage } from "@/components/FeedImage";
import { images } from "@/constants/images";
import type { FeedItem } from "@/lib/feed";
import { fontFamily, radii, typeScale, useThemedStyles, type ThemeColors } from "@/theme";

// Empty-ring stroke (spec color; not a named token).
const RING = "#3A4258";

/** Where the user stands on a lesson, for the row's status indicator. */
export type LessonStatus = "not-started" | "in-progress" | "completed";

const STATUS_LABEL: Record<LessonStatus, string> = {
  "not-started": "",
  "in-progress": " In progress.",
  completed: " Completed.",
};

type LessonListItemProps = {
  item: FeedItem;
  status: LessonStatus;
  onPress: () => void;
};

function LessonListItemBase({ item, status, onPress }: LessonListItemProps) {
  const styles = useThemedStyles(makeStyles);
  const { lesson, categoryLabel, bg, xp } = item;

  // The lesson-specific title is the subtitle (the topic is shared across many
  // lessons, e.g. seven "Banking & Accounts" lessons); fall back to topic.
  const title = lesson.subtitle || lesson.topic;
  // Use the lesson's OWN hero (its first card visual) so each subtopic shows a
  // distinct image, not the shared category hero.
  const heroKey = lesson.cards.find((card) => card.image != null)?.image;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${title}. ${lesson.topic}, ${categoryLabel}, ${lesson.estimatedMinutes} min, +${xp} XP.${STATUS_LABEL[status]}`}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
    >
      <View style={[styles.tile, { backgroundColor: bg }]}>
        <FeedImage imageKey={heroKey} fallbackSeed={lesson.id} style={styles.icon} contentFit="cover" />
      </View>

      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
        <Text style={styles.meta} numberOfLines={1}>
          {lesson.topic} · {lesson.estimatedMinutes} min · <Text style={styles.xp}>+{xp} XP</Text>
        </Text>
      </View>

      {status === "completed" ? (
        <View style={styles.doneCircle}>
          <Image source={images.checkWhite} style={styles.check} contentFit="contain" />
        </View>
      ) : status === "in-progress" ? (
        <View style={styles.progressRing}>
          <View style={styles.progressDot} />
        </View>
      ) : (
        <View style={styles.ring} />
      )}
    </Pressable>
  );
}

export const LessonListItem = memo(LessonListItemBase);

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: c.surface,
    borderWidth: 1,
    borderColor: c.line,
    borderRadius: radii.input,
    padding: 14,
    // Soft Android elevation so cards lift off the ink background.
    elevation: 2,
  },
  pressed: { opacity: 0.85 },

  tile: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden", // clip the hero visual to the rounded tile
  },
  icon: { width: "100%", height: "100%" },

  body: { flex: 1 },
  title: {
    color: c.txt,
    fontFamily: fontFamily.semibold,
    fontSize: typeScale.h4.size,
    lineHeight: 21,
  },
  meta: {
    color: c.txtMuted,
    fontFamily: fontFamily.regular,
    fontSize: typeScale.bodySm.size,
    marginTop: 3,
  },
  xp: {
    color: c.amber,
    fontFamily: fontFamily.semibold,
  },

  doneCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: c.success,
    alignItems: "center",
    justifyContent: "center",
  },
  check: { width: 13, height: 13 },
  ring: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: RING,
  },
  progressRing: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: c.amber,
    alignItems: "center",
    justifyContent: "center",
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: c.amber,
  },
});
