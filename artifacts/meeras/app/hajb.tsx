import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useSettings } from "@/contexts/SettingsContext";
import { useColors } from "@/hooks/useColors";
import { HAJB_GROUPS } from "@/lib/hajb";
import { isRTL, t } from "@/lib/i18n";

export default function HajbScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { language } = useSettings();
  const rtl = isRTL(language);
  const isWeb = Platform.OS === "web";

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          direction: rtl ? "rtl" : "ltr",
        },
      ]}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          {
            paddingTop: isWeb ? Math.max(insets.top, 67) + 8 : 16,
            paddingBottom:
              (isWeb ? Math.max(insets.bottom, 34) : insets.bottom) + 40,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.title, { color: colors.foreground }]}>
          {t(language, "hajb.title")}
        </Text>
        <Text
          style={[
            styles.subtitle,
            {
              color: colors.mutedForeground,
              textAlign: rtl ? "right" : "left",
            },
          ]}
        >
          {t(language, "hajb.subtitle")}
        </Text>

        {HAJB_GROUPS.map((group) => (
          <View key={group.groupKey}>
            <Text
              style={[styles.groupLabel, { color: colors.mutedForeground }]}
            >
              {t(language, group.groupKey).toUpperCase()}
            </Text>

            {group.rules.map((rule) => (
              <View
                key={rule.blockedHeirId}
                style={[
                  styles.card,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                    borderRadius: colors.radius,
                  },
                ]}
              >
                <View style={styles.cardHeader}>
                  <Text style={[styles.heirName, { color: colors.foreground }]}>
                    {t(language, `heir.${rule.blockedHeirId}`)}
                  </Text>
                  <View
                    style={[
                      styles.blockedBadge,
                      {
                        backgroundColor: colors.accent + "15",
                        borderColor: colors.accent + "40",
                      },
                    ]}
                  >
                    <Feather
                      name="slash"
                      size={10}
                      color={colors.accent}
                    />
                    <Text style={[styles.blockedBadgeText, { color: colors.accent }]}>
                      {t(language, "hajb.blocked")}
                    </Text>
                  </View>
                </View>

                <Text
                  style={[styles.blockedByLabel, { color: colors.mutedForeground }]}
                >
                  {t(language, "hajb.blockedBy")}
                </Text>

                <View style={styles.pillsRow}>
                  {rule.blockedByIds.map((bid) => (
                    <View
                      key={bid}
                      style={[
                        styles.pill,
                        {
                          backgroundColor: colors.primary + "12",
                          borderColor: colors.primary + "35",
                        },
                      ]}
                    >
                      <Text style={[styles.pillText, { color: colors.primary }]}>
                        {t(language, `heir.${bid}`)}
                      </Text>
                    </View>
                  ))}
                </View>

                <View
                  style={[styles.noteSeparator, { borderTopColor: colors.border }]}
                />
                <Text
                  style={[
                    styles.note,
                    {
                      color: colors.mutedForeground,
                      textAlign: rtl ? "right" : "left",
                    },
                  ]}
                >
                  {t(language, rule.noteKey)}
                </Text>
              </View>
            ))}
          </View>
        ))}

        <View
          style={[
            styles.footerBox,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              borderRadius: colors.radius,
            },
          ]}
        >
          <Feather name="info" size={14} color={colors.mutedForeground} style={{ marginTop: 1 }} />
          <Text
            style={[
              styles.footerText,
              {
                color: colors.mutedForeground,
                textAlign: rtl ? "right" : "left",
              },
            ]}
          >
            {t(language, "hajb.footer")}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingHorizontal: 20 },
  title: {
    fontSize: 32,
    fontFamily: "Inter_700Bold",
    fontWeight: "700",
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    lineHeight: 21,
    marginBottom: 28,
  },
  groupLabel: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 1,
    marginTop: 20,
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  card: {
    padding: 16,
    borderWidth: 1,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
    gap: 10,
  },
  heirName: {
    fontSize: 17,
    fontFamily: "Inter_600SemiBold",
    fontWeight: "600",
    flex: 1,
  },
  blockedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    borderWidth: 1,
  },
  blockedBadgeText: {
    fontSize: 10,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 0.3,
    textTransform: "uppercase",
  },
  blockedByLabel: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 0.6,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  pillsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 12,
  },
  pill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 1,
  },
  pillText: {
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
    fontWeight: "600",
  },
  noteSeparator: {
    borderTopWidth: 1,
    marginBottom: 10,
  },
  note: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    lineHeight: 19,
  },
  footerBox: {
    flexDirection: "row",
    gap: 10,
    padding: 16,
    borderWidth: 1,
    marginTop: 8,
    alignItems: "flex-start",
  },
  footerText: {
    flex: 1,
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    lineHeight: 19,
  },
});
