import React from "react";
import { Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { OptionRow } from "@/components/OptionRow";
import { ThemeMode, useSettings } from "@/contexts/SettingsContext";
import { useColors } from "@/hooks/useColors";
import { CURRENCIES, isRTL, LANGUAGES, MADHABS, t } from "@/lib/i18n";

export default function SettingsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { language, theme, madhab, currency, setLanguage, setTheme, setMadhab, setCurrency } =
    useSettings();
  const rtl = isRTL(language);
  const isWeb = Platform.OS === "web";

  const themeOptions: { mode: ThemeMode; key: string }[] = [
    { mode: "system", key: "settings.theme.system" },
    { mode: "light", key: "settings.theme.light" },
    { mode: "dark", key: "settings.theme.dark" },
  ];

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
              (isWeb ? Math.max(insets.bottom, 34) : insets.bottom) + 24,
          },
        ]}
      >
        <Text style={[styles.title, { color: colors.foreground }]}>
          {t(language, "settings.title")}
        </Text>

        <Section
          label={t(language, "settings.language")}
          color={colors.mutedForeground}
        />
        {LANGUAGES.map((l) => (
          <OptionRow
            key={l.code}
            label={l.label}
            selected={language === l.code}
            onPress={() => setLanguage(l.code)}
          />
        ))}

        <Section
          label={t(language, "settings.theme")}
          color={colors.mutedForeground}
        />
        {themeOptions.map((opt) => (
          <OptionRow
            key={opt.mode}
            label={t(language, opt.key)}
            selected={theme === opt.mode}
            onPress={() => setTheme(opt.mode)}
          />
        ))}

        <Section
          label={t(language, "settings.madhab")}
          color={colors.mutedForeground}
        />
        {MADHABS.map((m) => (
          <OptionRow
            key={m.id}
            label={t(language, m.labelKey)}
            selected={madhab === m.id}
            disabled={!m.available}
            badge={!m.available ? t(language, "settings.unavailable") : undefined}
            onPress={() => m.available && setMadhab(m.id)}
          />
        ))}

        <Section
          label={t(language, "settings.currency")}
          color={colors.mutedForeground}
        />
        {CURRENCIES.map((c) => (
          <OptionRow
            key={c.code}
            label={c.label}
            selected={currency === c.code}
            onPress={() => setCurrency(c.code)}
          />
        ))}

        <Section
          label={t(language, "settings.about")}
          color={colors.mutedForeground}
        />
        <View
          style={[
            styles.aboutCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              borderRadius: colors.radius,
            },
          ]}
        >
          <Text
            style={[
              styles.aboutText,
              {
                color: colors.foreground,
                textAlign: rtl ? "right" : "left",
              },
            ]}
          >
            {t(language, "settings.about.body")}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

function Section({ label, color }: { label: string; color: string }) {
  return (
    <Text style={[styles.sectionLabel, { color }]}>{label.toUpperCase()}</Text>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: {
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontFamily: "Inter_700Bold",
    fontWeight: "700",
    letterSpacing: -0.5,
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 1,
    marginTop: 24,
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  aboutCard: {
    padding: 18,
    borderWidth: 1,
  },
  aboutText: {
    fontSize: 14,
    lineHeight: 22,
    fontFamily: "Inter_400Regular",
  },
});
