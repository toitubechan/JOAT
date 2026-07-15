/**
 * LessonCard — one full-screen card in the lesson reader's vertical pager.
 *
 * Layout follows the feed-card design: an optional lesson visual, a small
 * "KEY IDEA · {time}" kicker, the card title, then the body. Cards are
 * image-optional — when `card.image` is set we render it with `expo-image`
 * (cached, blur placeholder via `FeedImage`); when it's absent we render a clean
 * text-forward card with no placeholder.
 *
 * The card scrolls internally only when an expanded body overruns the page, so
 * normal swiping stays a smooth page-snap (the parent pager owns the gesture).
 * Styled with StyleSheet + theme tokens (className is unreliable on device).
 */
import { memo, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { FeedImage } from "@/components/FeedImage";
import { MarkdownBody } from "@/components/lesson/MarkdownBody";
import { fontFamily, radii, spacing, typeScale, useThemedStyles, type ThemeColors } from "@/theme";
import type { Card } from "@/types/content";

// The fixed save rail sits in the right gutter; inset the body so its mid-card
// text never slides under it.
const RAIL_INSET = 40;

// Fixed paddings around the body (mirror the styles below) so we can work out
// exactly how much room the body has before it would overflow the page.
const CONTENT_TOP_PAD = 12;
const BODY_MARGIN_TOP = 16;
// Don't bother collapsing below this — a couple of lines + "Read more" isn't
// worth it, and it guards against a tiny/negative budget on image-heavy cards.
const MIN_COLLAPSED_BODY = 120;

type LessonCardProps = {
  card: Card;
  /** Full page height (measured) so the card fills exactly one screen. */
  pageHeight: number;
  /** Bottom space reserved for the fixed mascot / XP / swipe-up chrome. */
  reservedBottom: number;
};

/** ~200 wpm reading estimate, rounded to a friendly "30 SEC" / "1 MIN" label. */
function readTimeLabel(body: string): string {
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  const seconds = Math.max(10, Math.round((words / 200) * 60));
  if (seconds < 60) {
    return `${Math.round(seconds / 5) * 5} SEC`;
  }
  return `${Math.max(1, Math.round(seconds / 60))} MIN`;
}

function LessonCardBase({ card, pageHeight, reservedBottom }: LessonCardProps) {
  const styles = useThemedStyles(makeStyles);
  const hasImage = card.image != null;
  const imageHeight = Math.min(210, Math.max(150, Math.round(pageHeight * 0.26)));

  // Height of the head block (image + kicker + title). Measured so we know how
  // much vertical room is genuinely left for the body.
  const [headHeight, setHeadHeight] = useState(0);
  // Whether the body is expanded ("Read more"). Owned here so the card only
  // enables internal scrolling once expanded — otherwise the nested ScrollView
  // would intercept the swipe and make paging to the next card feel sticky.
  const [expanded, setExpanded] = useState(false);

  // Only collapse the body when the card would actually overflow the screen:
  // the body's budget is the page minus the head block, the fixed paddings, and
  // the reserved bottom chrome. Until the head is measured, pass `undefined` (no
  // clipping) so a card that fits never shows a pointless "Read more".
  const collapsedMaxHeight =
    headHeight > 0
      ? Math.max(
          MIN_COLLAPSED_BODY,
          pageHeight - CONTENT_TOP_PAD - headHeight - BODY_MARGIN_TOP - reservedBottom
        )
      : undefined;

  return (
    <ScrollView
      style={{ height: pageHeight }}
      contentContainerStyle={[styles.content, { paddingBottom: reservedBottom }]}
      showsVerticalScrollIndicator={false}
      nestedScrollEnabled
      // Collapsed cards fit the page, so keep their scroll off — the swipe goes
      // straight to the pager. Only an expanded (long) body needs to scroll.
      scrollEnabled={expanded}
    >
      <View onLayout={(e) => setHeadHeight(e.nativeEvent.layout.height)}>
        {hasImage && (
          <FeedImage
            imageKey={card.image}
            fallbackSeed={card.title}
            style={[styles.image, { height: imageHeight }]}
            contentFit="cover"
          />
        )}

        <View style={styles.kicker}>
          <Text style={styles.kickerText}>KEY IDEA · {readTimeLabel(card.body)}</Text>
        </View>

        <Text style={styles.title}>{card.title}</Text>
      </View>

      {card.body.length > 0 && (
        <View style={styles.body}>
          <MarkdownBody
            body={card.body}
            collapsedMaxHeight={collapsedMaxHeight}
            expanded={expanded}
            onToggleExpanded={() => setExpanded((v) => !v)}
          />
        </View>
      )}
    </ScrollView>
  );
}

export const LessonCard = memo(LessonCardBase);

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
  content: {
    paddingHorizontal: spacing.screen,
    paddingTop: 12,
  },
  image: {
    width: "100%",
    borderRadius: radii.card,
    backgroundColor: c.surface,
    marginBottom: 22,
  },
  kicker: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(255,176,32,0.12)",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  kickerText: {
    color: c.amber,
    fontFamily: fontFamily.bold,
    fontSize: typeScale.caption.size,
    letterSpacing: 1,
  },
  title: {
    color: c.txt,
    fontFamily: typeScale.h1.family,
    fontSize: typeScale.h1.size,
    lineHeight: typeScale.h1.lineHeight,
    marginTop: 16,
  },
  body: {
    marginTop: 16,
    paddingRight: RAIL_INSET,
  },
});
