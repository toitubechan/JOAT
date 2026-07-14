/**
 * Notifications — the in-app announcements panel (presented as a modal).
 *
 * Opened from the home header bell. Lists the typed static announcements
 * (`@/data/announcements`) newest first — short product / onboarding notes, no
 * backend and no push (consistent with the no-database rule). When real
 * announcements arrive, only the data file changes; this screen stays put.
 *
 * No dedicated mockup — built in the app's visual language (ink background,
 * Poppins, icons via expo-image). Styled with StyleSheet + theme tokens
 * (className is unreliable on device — project memory).
 */
import { Image } from "expo-image";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { images } from "@/constants/images";
import { announcements, type Announcement } from "@/data/announcements";
import { colors, fontFamily, radii, spacing, typeScale } from "@/theme";

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
] as const;

/**
 * A short, drift-tolerant "posted" label. Recent notes read relatively (Today /
 * Yesterday / Nd ago / Nw ago); anything older falls back to an absolute
 * "Mon D" so a static seed date never grows into a silly "412d ago". Computed
 * from calendar days (no Intl — unreliable on Hermes/Android).
 */
function postedLabel(iso: string): string {
  const then = new Date(iso);
  const a = Date.UTC(then.getFullYear(), then.getMonth(), then.getDate());
  const now = new Date();
  const b = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  const days = Math.round((b - a) / 86_400_000);

  if (days <= 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  if (days < 56) return `${Math.floor(days / 7)}w ago`;
  return `${MONTHS[then.getMonth()]} ${then.getDate()}`;
}

export default function NotificationsScreen() {
  return (
    <SafeAreaView style={styles.screen} edges={["top", "bottom"]}>
      <StatusBar style="light" />

      {/* Header: title with the close (X) overlaid at the right (mirrors paywall). */}
      <View style={styles.header}>
        <Text style={styles.title}>Notifications</Text>
        <Pressable
          onPress={() => router.back()}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Close notifications"
          style={({ pressed }) => [styles.closeBtn, pressed && styles.pressed]}
        >
          <Image source={images.closeWhite} style={styles.closeIcon} contentFit="contain" />
        </Pressable>
      </View>

      <FlatList
        data={announcements}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <NotificationRow item={item} />}
        ItemSeparatorComponent={Separator}
        ListEmptyComponent={
          <Text style={styles.empty}>You&apos;re all caught up.</Text>
        }
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

/** One announcement: colored icon tile + title, body and a posted-at label. */
function NotificationRow({ item }: { item: Announcement }) {
  return (
    <View style={styles.row}>
      <View style={[styles.tile, { backgroundColor: item.accent }]}>
        <Image source={images[item.icon]} style={styles.tileIcon} contentFit="contain" />
      </View>
      <View style={styles.rowText}>
        <View style={styles.rowHead}>
          <Text style={styles.rowTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.rowDate}>{postedLabel(item.date)}</Text>
        </View>
        <Text style={styles.rowBody}>{item.body}</Text>
      </View>
    </View>
  );
}

function Separator() {
  return <View style={styles.separator} />;
}

const H_PAD = spacing.screen;

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.ink },

  header: {
    paddingHorizontal: H_PAD,
    paddingTop: 8,
    paddingBottom: 16,
    justifyContent: "center",
  },
  title: {
    color: colors.txt,
    fontFamily: fontFamily.bold,
    fontSize: typeScale.h2.size,
    lineHeight: typeScale.h2.lineHeight,
  },
  closeBtn: {
    position: "absolute",
    right: H_PAD,
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  closeIcon: { width: 20, height: 20 },
  pressed: { opacity: 0.7 },

  content: {
    paddingHorizontal: H_PAD,
    paddingTop: 4,
    paddingBottom: 24,
  },

  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 14,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radii.card,
    padding: 16,
  },
  tile: {
    width: spacing.iconTile,
    height: spacing.iconTile,
    borderRadius: radii.tile,
    alignItems: "center",
    justifyContent: "center",
  },
  tileIcon: { width: 22, height: 22 },
  rowText: { flex: 1 },
  rowHead: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  rowTitle: {
    flex: 1,
    color: colors.txt,
    fontFamily: fontFamily.semibold,
    fontSize: typeScale.h4.size,
  },
  rowDate: {
    color: colors.txtMuted,
    fontFamily: fontFamily.medium,
    fontSize: typeScale.caption.size,
  },
  rowBody: {
    color: colors.txtSecondary,
    fontFamily: fontFamily.regular,
    fontSize: typeScale.bodySm.size,
    lineHeight: typeScale.bodySm.lineHeight,
    marginTop: 3,
  },

  separator: { height: 12 },
  empty: {
    color: colors.txtMuted,
    fontFamily: fontFamily.regular,
    fontSize: typeScale.body.size,
    textAlign: "center",
    marginTop: 28,
  },
});
