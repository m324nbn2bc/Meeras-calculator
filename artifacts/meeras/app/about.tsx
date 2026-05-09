import { Feather } from "@expo/vector-icons";
import React from "react";
import { Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useSettings } from "@/contexts/SettingsContext";
import { useColors } from "@/hooks/useColors";
import { isRTL, t } from "@/lib/i18n";

function Card({
  title,
  icon,
  children,
  colors,
  accent,
}: {
  title: string;
  icon: keyof typeof Feather.glyphMap;
  children: React.ReactNode;
  colors: ReturnType<typeof import("@/hooks/useColors").useColors>;
  accent?: boolean;
}) {
  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: accent ? colors.accent + "12" : colors.card,
          borderColor: accent ? colors.accent + "40" : colors.border,
          borderRadius: colors.radius,
        },
      ]}
    >
      <View style={styles.cardHeader}>
        <Feather
          name={icon}
          size={16}
          color={accent ? colors.accent : colors.mutedForeground}
        />
        <Text
          style={[
            styles.cardTitle,
            { color: accent ? colors.accent : colors.foreground },
          ]}
        >
          {title}
        </Text>
      </View>
      {children}
    </View>
  );
}

export default function AboutScreen() {
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
            paddingTop: isWeb ? Math.max(insets.top, 67) + 8 : 8,
            paddingBottom:
              (isWeb ? Math.max(insets.bottom, 34) : insets.bottom) + 40,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* App hero */}
        <View style={styles.hero}>
          <View
            style={[
              styles.heroIcon,
              { backgroundColor: colors.primary, borderRadius: colors.radius + 4 },
            ]}
          >
            <Feather name="pie-chart" size={32} color={colors.primaryForeground} />
          </View>
          <Text style={[styles.heroTitle, { color: colors.foreground }]}>
            {t(language, "app.name")}
          </Text>
          <View
            style={[
              styles.versionBadge,
              { backgroundColor: colors.secondary, borderRadius: 999 },
            ]}
          >
            <Text style={[styles.versionText, { color: colors.mutedForeground }]}>
              {t(language, "about.version")}
            </Text>
          </View>
        </View>

        {/* What is Faraid */}
        <Card
          title={t(language, "about.whatTitle")}
          icon="book-open"
          colors={colors}
        >
          <Text
            style={[
              styles.bodyText,
              { color: colors.mutedForeground, textAlign: rtl ? "right" : "left" },
            ]}
          >
            {t(language, "about.whatBody")}
          </Text>
        </Card>

        {/* Disclaimer */}
        <Card
          title={t(language, "about.disclaimerTitle")}
          icon="alert-triangle"
          colors={colors}
          accent
        >
          <Text
            style={[
              styles.bodyText,
              { color: colors.foreground, textAlign: rtl ? "right" : "left" },
            ]}
          >
            {t(language, "about.disclaimerBody")}
          </Text>
        </Card>

        {/* How to use */}
        <Card
          title={t(language, "about.howTitle")}
          icon="compass"
          colors={colors}
        >
          {(t(language, "about.howSteps") as string).split("\n").map(
            (step, i) =>
              step.trim() ? (
                <View key={i} style={styles.stepRow}>
                  <View
                    style={[
                      styles.stepDot,
                      { backgroundColor: colors.accent },
                    ]}
                  />
                  <Text
                    style={[
                      styles.stepText,
                      {
                        color: colors.mutedForeground,
                        textAlign: rtl ? "right" : "left",
                      },
                    ]}
                  >
                    {step.trim()}
                  </Text>
                </View>
              ) : null,
          )}
        </Card>

        {/* Supported schools */}
        <Card
          title={t(language, "about.schoolsTitle")}
          icon="layers"
          colors={colors}
        >
          {[
            { key: "madhab.hanafi", available: true },
            { key: "madhab.shafii", available: false },
            { key: "madhab.maliki", available: false },
            { key: "madhab.hanbali", available: false },
          ].map((m) => (
            <View key={m.key} style={styles.schoolRow}>
              <Feather
                name={m.available ? "check-circle" : "clock"}
                size={15}
                color={m.available ? colors.accent : colors.mutedForeground}
              />
              <Text
                style={[
                  styles.schoolText,
                  {
                    color: m.available
                      ? colors.foreground
                      : colors.mutedForeground,
                  },
                ]}
              >
                {t(language, m.key)}
                {!m.available
                  ? ` — ${t(language, "settings.unavailable")}`
                  : ""}
              </Text>
            </View>
          ))}
        </Card>

        {/* Offline */}
        <Card
          title={t(language, "about.offlineTitle")}
          icon="wifi-off"
          colors={colors}
        >
          <Text
            style={[
              styles.bodyText,
              { color: colors.mutedForeground, textAlign: rtl ? "right" : "left" },
            ]}
          >
            {t(language, "about.offlineBody")}
          </Text>
        </Card>

        {/* Footer note */}
        <Text
          style={[styles.footerNote, { color: colors.mutedForeground }]}
        >
          {t(language, "about.footer")}
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingHorizontal: 20 },
  hero: {
    alignItems: "center",
    paddingVertical: 28,
    gap: 10,
  },
  heroIcon: {
    width: 72,
    height: 72,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  heroTitle: {
    fontSize: 22,
    fontFamily: "Inter_700Bold",
    fontWeight: "700",
    letterSpacing: -0.3,
  },
  versionBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  versionText: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
  },
  card: {
    borderWidth: 1,
    padding: 16,
    marginBottom: 14,
    gap: 10,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  cardTitle: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
    fontWeight: "600",
    letterSpacing: 0.1,
  },
  bodyText: {
    fontSize: 14,
    lineHeight: 22,
    fontFamily: "Inter_400Regular",
  },
  stepRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    paddingVertical: 2,
  },
  stepDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 7,
    flexShrink: 0,
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 22,
    fontFamily: "Inter_400Regular",
  },
  schoolRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 4,
  },
  schoolText: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
  },
  footerNote: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    lineHeight: 18,
    marginTop: 8,
    marginBottom: 8,
    paddingHorizontal: 16,
  },
});
