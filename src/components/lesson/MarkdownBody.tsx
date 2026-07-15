/**
 * MarkdownBody — renders a lesson card's body markdown for the full-screen reader.
 *
 * Card bodies are short and authored as plain markdown (`lib/content.ts` strips
 * the frontmatter / image line / `## Card:` heading and hands us the rest). We
 * render just the small subset the content actually uses:
 *   - paragraphs
 *   - `- ` bullet lists
 *   - `> ` blockquotes  -> a rounded callout box
 *   - inline `**bold**`   -> amber accent (the key terms the card is teaching)
 *   - inline `*italic*`   -> teal accent
 * matching the multi-color highlighting in the feed-card design.
 *
 * Bodies vary in length, so when a `collapsedMaxHeight` is given we clip the
 * content, fade its bottom, and reveal a "Read more" toggle — keeping every card
 * scannable so the swipe rhythm holds. Styled with StyleSheet + theme tokens
 * (className is unreliable on device — project memory).
 */
import { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { fontFamily, typeScale, useTheme, useThemedStyles, type ThemeColors } from "@/theme";

type MarkdownBodyProps = {
  /** Card body markdown (image line + heading already stripped upstream). */
  body: string;
  /**
   * When set, the body is clipped to this height with a "Read more" toggle if it
   * overflows. Omit to always render the full body.
   */
  collapsedMaxHeight?: number;
  /** Background the bottom fade blends into (defaults to the app ink). */
  fadeColor?: string;
  /**
   * Optional controlled expand state. When provided, the parent owns whether the
   * body is expanded (so it can react to it, e.g. enabling card scroll); when
   * omitted, the component manages its own toggle.
   */
  expanded?: boolean;
  onToggleExpanded?: () => void;
};

// --- Block model -----------------------------------------------------------

type Block =
  | { type: "para"; text: string }
  | { type: "bullets"; items: string[] }
  | { type: "quote"; text: string };

/** Group body lines into paragraphs, bullet lists and blockquotes. */
function parseBlocks(body: string): Block[] {
  const blocks: Block[] = [];
  let bullets: string[] | null = null;
  let quote: string[] | null = null;

  const flush = () => {
    if (bullets) {
      blocks.push({ type: "bullets", items: bullets });
      bullets = null;
    }
    if (quote) {
      blocks.push({ type: "quote", text: quote.join(" ") });
      quote = null;
    }
  };

  for (const raw of body.split(/\r?\n/)) {
    const line = raw.trim();
    if (line === "") {
      flush();
      continue;
    }
    const bullet = /^-\s+(.*)$/.exec(line);
    const blockquote = /^>\s?(.*)$/.exec(line);
    if (bullet) {
      if (quote) flush();
      (bullets ??= []).push(bullet[1]);
    } else if (blockquote) {
      if (bullets) flush();
      (quote ??= []).push(blockquote[1]);
    } else {
      flush();
      blocks.push({ type: "para", text: line });
    }
  }
  flush();
  return blocks;
}

// --- Inline (**bold** / *italic*) ------------------------------------------

type Span = { text: string; kind: "normal" | "bold" | "italic" };

/** Split a line into normal / bold / italic spans. Bold is matched first. */
function parseInline(text: string): Span[] {
  const spans: Span[] = [];
  const re = /(\*\*([^*]+)\*\*|\*([^*]+)\*)/g;
  let last = 0;
  let match: RegExpExecArray | null;
  while ((match = re.exec(text)) !== null) {
    if (match.index > last) {
      spans.push({ text: text.slice(last, match.index), kind: "normal" });
    }
    if (match[2] !== undefined) spans.push({ text: match[2], kind: "bold" });
    else if (match[3] !== undefined) spans.push({ text: match[3], kind: "italic" });
    last = match.index + match[0].length;
  }
  if (last < text.length) spans.push({ text: text.slice(last), kind: "normal" });
  return spans;
}

function Inline({ text }: { text: string }) {
  const styles = useThemedStyles(makeStyles);
  return (
    <>
      {parseInline(text).map((span, i) => (
        <Text
          key={i}
          style={
            span.kind === "bold"
              ? styles.bold
              : span.kind === "italic"
                ? styles.italic
                : undefined
          }
        >
          {span.text}
        </Text>
      ))}
    </>
  );
}

function BlockView({ block }: { block: Block }) {
  const styles = useThemedStyles(makeStyles);
  if (block.type === "para") {
    return (
      <Text style={styles.paragraph}>
        <Inline text={block.text} />
      </Text>
    );
  }
  if (block.type === "bullets") {
    return (
      <View style={styles.bulletList}>
        {block.items.map((item, i) => (
          <View key={i} style={styles.bulletRow}>
            <Text style={styles.bulletDot}>•</Text>
            <Text style={styles.bulletText}>
              <Inline text={item} />
            </Text>
          </View>
        ))}
      </View>
    );
  }
  return (
    <View style={styles.callout}>
      <View style={styles.calloutBar} />
      <Text style={styles.calloutText}>
        <Inline text={block.text} />
      </Text>
    </View>
  );
}

export function MarkdownBody({
  body,
  collapsedMaxHeight,
  fadeColor,
  expanded: expandedProp,
  onToggleExpanded,
}: MarkdownBodyProps) {
  const c = useTheme();
  const styles = useThemedStyles(makeStyles);
  const resolvedFade = fadeColor ?? c.ink;
  const blocks = parseBlocks(body);
  const [fullHeight, setFullHeight] = useState<number | null>(null);
  const [internalExpanded, setInternalExpanded] = useState(false);
  // Controlled when the parent passes `expanded`, otherwise self-managed.
  const expanded = expandedProp ?? internalExpanded;
  const toggleExpanded = onToggleExpanded ?? (() => setInternalExpanded((v) => !v));

  const collapsible = collapsedMaxHeight != null;
  // Small slack so a body that's a hair over the limit doesn't show a pointless
  // toggle that reveals one extra line.
  const truncated = collapsible && fullHeight != null && fullHeight > collapsedMaxHeight + 8;
  const showCollapsed = truncated && !expanded;

  const content = blocks.map((block, i) => (
    <View key={i} style={i > 0 ? styles.blockGap : undefined}>
      <BlockView block={block} />
    </View>
  ));

  return (
    <View>
      {/* A hidden, full-height copy is what we measure. Because it's never
          clipped, the measurement can't feed back into the clip on the visible
          copy below — which is what caused the height to oscillate (flicker). */}
      {collapsible && (
        <View
          style={styles.measure}
          pointerEvents="none"
          onLayout={(e) => setFullHeight(e.nativeEvent.layout.height)}
        >
          {content}
        </View>
      )}

      <View style={showCollapsed ? { maxHeight: collapsedMaxHeight, overflow: "hidden" } : undefined}>
        {content}
        {showCollapsed && (
          <LinearGradient
            pointerEvents="none"
            colors={["transparent", resolvedFade]}
            style={styles.fade}
          />
        )}
      </View>

      {truncated && (
        <Pressable
          onPress={toggleExpanded}
          hitSlop={8}
          accessibilityRole="button"
          style={({ pressed }) => [styles.readMore, pressed && styles.pressed]}
        >
          <Text style={styles.readMoreText}>{expanded ? "Show less" : "Read more"}</Text>
        </Pressable>
      )}
    </View>
  );
}

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
  // Off-layout measuring copy: full width (so wrapping matches the visible copy),
  // invisible, non-interactive, and absolute so it never affects real layout.
  measure: { position: "absolute", left: 0, right: 0, top: 0, opacity: 0, zIndex: -1 },
  blockGap: { marginTop: 14 },

  paragraph: {
    color: c.txtSecondary,
    fontFamily: typeScale.bodyLg.family,
    fontSize: typeScale.bodyLg.size,
    lineHeight: typeScale.bodyLg.lineHeight,
  },
  bold: {
    color: c.amber,
    fontFamily: fontFamily.semibold,
  },
  italic: {
    color: c.teal,
    fontFamily: fontFamily.medium,
  },

  bulletList: { gap: 10 },
  bulletRow: { flexDirection: "row", paddingRight: 4 },
  bulletDot: {
    color: c.amber,
    fontFamily: fontFamily.bold,
    fontSize: typeScale.bodyLg.size,
    lineHeight: typeScale.bodyLg.lineHeight,
    width: 18,
  },
  bulletText: {
    flex: 1,
    color: c.txtSecondary,
    fontFamily: typeScale.bodyLg.family,
    fontSize: typeScale.bodyLg.size,
    lineHeight: typeScale.bodyLg.lineHeight,
  },

  callout: {
    flexDirection: "row",
    backgroundColor: c.surfaceRaised,
    borderRadius: 16,
    padding: 16,
  },
  calloutBar: {
    width: 3,
    borderRadius: 2,
    backgroundColor: c.teal,
    marginRight: 12,
  },
  calloutText: {
    flex: 1,
    color: c.txtSecondary,
    fontFamily: fontFamily.medium,
    fontSize: typeScale.body.size,
    lineHeight: typeScale.body.lineHeight,
  },

  fade: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 40,
  },

  readMore: { marginTop: 12, alignSelf: "flex-start" },
  readMoreText: {
    color: c.amber,
    fontFamily: fontFamily.semibold,
    fontSize: typeScale.bodySm.size,
  },
  pressed: { opacity: 0.6 },
});
