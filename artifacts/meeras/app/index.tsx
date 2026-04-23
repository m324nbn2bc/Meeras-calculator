import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { PrimaryButton } from "@/components/PrimaryButton";
import { useSettings } from "@/contexts/SettingsContext";
import { useColors } from "@/hooks/useColors";
import { isRTL, t } from "@/lib/i18n";

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { language, hydrated } = useSettings();
  const rtl = isRTL(language);
  const isWeb = Platform.OS === "web";

  if (!hydrated) {
    return <View style={{ flex: 1, backgroundColor: colors.background }} />;
  }

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          paddingTop: (isWeb ? Math.max(insets.top, 67) : insets.top) + 16,
          paddingBottom: (isWeb ? Math.max(insets.bottom, 34) : insets.bottom) + 24,
          direction: rtl ? "rtl" : "ltr",
        },
      ]}
    >
      <View style={styles.topRow}>
        <View />
        <Pressable
          onPress={() => router.push("/settings")}
          hitSlop={12}
          style={({ pressed }) => [
            styles.iconBtn,
            { backgroundColor: colors.secondary, opacity: pressed ? 0.7 : 1 },
          ]}
        >
          <Feather name="settings" size={20} color={colors.foreground} />
        </Pressable>
      </View>

      <View style={styles.hero}>
        <View
          style={[
            styles.emblem,
            { backgroundColor: colors.primary, borderRadius: colors.radius * 1.6 },
          ]}
        >
          <Feather name="pie-chart" size={42} color={colors.primaryForeground} />
        </View>

        <Text style={[styles.title, { color: colors.foreground }]}>
          {t(language, "app.name")}
        </Text>
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
          {t(language, "app.tagline")}
        </Text>

        <Text
          style={[
            styles.intro,
            { color: colors.mutedForeground, textAlign: rtl ? "right" : "center" },
          ]}
        >
          {t(language, "home.intro")}
        </Text>

        <View
          style={[
            styles.badge,
            { borderColor: colors.border, backgroundColor: colors.card },
          ]}
        >
          <Feather name="shield" size={14} color={colors.primary} />
          <Text style={[styles.badgeText, { color: colors.foreground }]}>
            {t(language, "home.offlineBadge")}
          </Text>
        </View>
      </View>

      <View style={styles.actions}>
        <PrimaryButton
          label={t(language, "home.start")}
          onPress={() => router.push("/wizard")}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  hero: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
  },
  emblem: {
    width: 96,
    height: 96,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 30,
    fontFamily: "Inter_700Bold",
    fontWeight: "700",
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: "Inter_500Medium",
  },
  intro: {
    marginTop: 18,
    fontSize: 15,
    lineHeight: 22,
    fontFamily: "Inter_400Regular",
    paddingHorizontal: 8,
    maxWidth: 380,
  },
  badge: {
    marginTop: 24,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderRadius: 999,
  },
  badgeText: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
  },
  actions: {
    gap: 12,
  },
});
