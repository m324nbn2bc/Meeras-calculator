import { Feather } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useMemo } from "react";
import { Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { PrimaryButton } from "@/components/PrimaryButton";
import { useSettings } from "@/contexts/SettingsContext";
import { useColors } from "@/hooks/useColors";
import { isRTL, LanguageCode, MadhabId, t } from "@/lib/i18n";
import {
  calculate,
  CalculationOutput,
  formatFraction,
  HeirId,
  ShareResult,
} from "@/lib/inheritance";
import { WizardState } from "@/lib/wizard";

function formatMoney(n: number, lang: LanguageCode): string {
  const fixed = Math.round(n * 100) / 100;
  try {
    return new Intl.NumberFormat(lang === "ar" ? "ar" : lang, {
      maximumFractionDigits: 2,
    }).format(fixed);
  } catch {
    return fixed.toLocaleString();
  }
}

function heirLabel(lang: LanguageCode, heir: HeirId, count: number): string {
  return t(lang, `heir.${heir}`) + (count > 1 ? ` (${count})` : "");
}

export default function ResultScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { language, madhab: settingsMadhab } = useSettings();
  const params = useLocalSearchParams<{ state?: string; madhab?: string }>();
  const rtl = isRTL(language);
  const isWeb = Platform.OS === "web";

  const result: CalculationOutput | null = useMemo(() => {
    if (!params.state) return null;
    try {
      const state = JSON.parse(params.state) as WizardState;
      const madhab = (params.madhab as MadhabId) || settingsMadhab;
      return calculate({
        estate: state.estate,
        deceasedGender: state.deceasedGender,
        heirs: state.heirs,
        madhab,
      });
    } catch {
      return null;
    }
  }, [params.state, params.madhab, settingsMadhab]);

  if (!result) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <Text style={{ color: colors.foreground, padding: 20 }}>
          {t(language, "result.noHeirs")}
        </Text>
      </View>
    );
  }

  const totalShareSum = result.shares.reduce((s, x) => s + x.amount, 0);

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
              (isWeb ? Math.max(insets.bottom, 34) : insets.bottom) + 120,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Text style={[styles.title, { color: colors.foreground }]}>
          {t(language, "result.title")}
        </Text>

        {/* Estate summary card */}
        <View
          style={[
            styles.estateCard,
            { backgroundColor: colors.primary, borderRadius: colors.radius },
          ]}
        >
          <Text
            style={[
              styles.estateLabel,
              { color: colors.primaryForeground, opacity: 0.85 },
            ]}
          >
            {t(language, "result.estate")}
          </Text>
          <Text
            style={[styles.estateValue, { color: colors.primaryForeground }]}
          >
            {formatMoney(result.estate, language)}
          </Text>
        </View>

        {/* Rules applied */}
        {(result.awl || result.radd) && (
          <View
            style={[
              styles.alertBox,
              {
                backgroundColor: colors.card,
                borderColor: colors.accent,
                borderRadius: colors.radius,
              },
            ]}
          >
            <Text style={[styles.alertTitle, { color: colors.accent }]}>
              {t(language, "result.rules")}
            </Text>
            {result.awl ? (
              <Text style={[styles.alertText, { color: colors.foreground }]}>
                {t(language, "result.awl")} ({result.awl.from} → {result.awl.to})
              </Text>
            ) : null}
            {result.radd ? (
              <Text style={[styles.alertText, { color: colors.foreground }]}>
                {t(language, "result.radd")}
              </Text>
            ) : null}
          </View>
        )}

        {/* Shares list */}
        {result.shares.length === 0 ? (
          <Text
            style={{
              color: colors.mutedForeground,
              textAlign: "center",
              marginTop: 32,
            }}
          >
            {t(language, "result.noHeirs")}
          </Text>
        ) : (
          result.shares.map((share, idx) => (
            <ShareCard
              key={`${share.heir}-${idx}`}
              share={share}
              language={language}
            />
          ))
        )}

        {result.exclusions.length > 0 ? (
          <View
            style={[
              styles.alertBox,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                borderRadius: colors.radius,
                marginTop: 8,
              },
            ]}
          >
            <Text
              style={[styles.alertTitle, { color: colors.mutedForeground }]}
            >
              {t(language, "result.exclusions")}
            </Text>
            {result.exclusions.map((ex, i) => (
              <Text
                key={`${ex.heir}-${i}`}
                style={[
                  styles.alertText,
                  { color: colors.foreground, marginTop: 6 },
                ]}
              >
                · {t(language, `heir.${ex.heir}`)}
                {ex.count > 1 ? ` (${ex.count})` : ""} —{" "}
                <Text style={{ color: colors.mutedForeground }}>
                  {t(language, ex.reasonKey)}
                </Text>
              </Text>
            ))}
          </View>
        ) : null}

        {result.residue && result.residue > 0 ? (
          <View
            style={[
              styles.alertBox,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                borderRadius: colors.radius,
              },
            ]}
          >
            <Text style={[styles.alertTitle, { color: colors.mutedForeground }]}>
              {t(language, "result.residue")}
            </Text>
            <Text style={[styles.alertText, { color: colors.foreground }]}>
              {formatMoney(result.residue, language)}
            </Text>
          </View>
        ) : null}

        {/* Verification footer */}
        <Text
          style={{
            marginTop: 24,
            fontSize: 12,
            color: colors.mutedForeground,
            textAlign: "center",
            fontFamily: "Inter_400Regular",
          }}
        >
          {t(language, ("madhab." + (params.madhab || settingsMadhab)) as string)} ·{" "}
          {formatMoney(totalShareSum + (result.residue ?? 0), language)} /{" "}
          {formatMoney(result.estate, language)}
        </Text>
      </ScrollView>

      {/* Sticky footer button */}
      <View
        style={[
          styles.footer,
          {
            backgroundColor: colors.background,
            borderTopColor: colors.border,
            paddingBottom:
              (isWeb ? Math.max(insets.bottom, 34) : insets.bottom) + 12,
          },
        ]}
      >
        <PrimaryButton
          label={t(language, "common.startOver")}
          onPress={() => router.replace("/")}
        />
      </View>
    </View>
  );
}

function ShareCard({
  share,
  language,
}: {
  share: ShareResult;
  language: LanguageCode;
}) {
  const colors = useColors();
  const kindLabel =
    share.kind === "fixed"
      ? t(language, "result.share.fixed")
      : share.kind === "asabah"
        ? t(language, "result.share.asabah")
        : share.kind === "umariyyatan"
          ? t(language, "result.share.umariyyatan")
          : t(language, "result.share.radd");

  const accent =
    share.kind === "asabah"
      ? colors.accent
      : share.kind === "umariyyatan" || share.kind === "radd"
        ? colors.primary
        : colors.primary;

  return (
    <View
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
        <View style={{ flex: 1 }}>
          <Text style={[styles.heirName, { color: colors.foreground }]}>
            {heirLabel(language, share.heir, share.count)}
          </Text>
          <View
            style={[
              styles.kindPill,
              { borderColor: accent, marginTop: 6 },
            ]}
          >
            <Feather
              name={
                share.kind === "asabah"
                  ? "arrow-down-right"
                  : share.kind === "umariyyatan"
                    ? "star"
                    : share.kind === "radd"
                      ? "refresh-cw"
                      : "check-circle"
              }
              size={11}
              color={accent}
            />
            <Text style={[styles.kindLabel, { color: accent }]}>
              {kindLabel}
            </Text>
          </View>
        </View>
        <View style={{ alignItems: "flex-end" }}>
          <Text style={[styles.fraction, { color: colors.foreground }]}>
            {formatFraction(share.fraction)}
          </Text>
          <Text style={[styles.amount, { color: colors.primary }]}>
            {formatMoney(share.amount, language)}
          </Text>
        </View>
      </View>

      {share.reasonKey ? (
        <Text
          style={{
            marginTop: 8,
            fontSize: 12,
            color: colors.mutedForeground,
            fontFamily: "Inter_400Regular",
            lineHeight: 16,
          }}
        >
          {t(language, share.reasonKey)}
        </Text>
      ) : null}

      {share.count > 1 ? (
        <View
          style={[
            styles.perPersonRow,
            { borderTopColor: colors.border },
          ]}
        >
          <Text style={{ color: colors.mutedForeground, fontSize: 13 }}>
            {t(language, "result.each")} ({share.count})
          </Text>
          <Text
            style={{
              color: colors.foreground,
              fontSize: 14,
              fontFamily: "Inter_600SemiBold",
            }}
          >
            {formatMoney(share.perPerson, language)}
          </Text>
        </View>
      ) : null}
    </View>
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
    marginBottom: 18,
  },
  estateCard: {
    padding: 20,
    marginBottom: 18,
  },
  estateLabel: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },
  estateValue: {
    marginTop: 6,
    fontSize: 32,
    fontFamily: "Inter_700Bold",
    fontWeight: "700",
  },
  alertBox: {
    padding: 16,
    borderWidth: 1,
    marginBottom: 18,
  },
  alertTitle: {
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 0.5,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  alertText: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: "Inter_400Regular",
    marginTop: 2,
  },
  card: {
    padding: 16,
    borderWidth: 1,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
  },
  heirName: {
    fontSize: 17,
    fontFamily: "Inter_600SemiBold",
    fontWeight: "600",
  },
  kindPill: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    borderRadius: 999,
  },
  kindLabel: {
    fontSize: 10,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },
  fraction: {
    fontSize: 20,
    fontFamily: "Inter_700Bold",
    fontWeight: "700",
  },
  amount: {
    marginTop: 4,
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
    fontWeight: "600",
  },
  perPersonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: 1,
  },
});
