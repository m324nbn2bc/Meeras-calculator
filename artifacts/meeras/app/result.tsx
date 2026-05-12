import { Feather } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
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
import { CLASSICAL_CASES } from "@/lib/cases";
import { WizardState } from "@/lib/wizard";
import {
  findByStateAndMadhab,
  SavedCalc,
  saveCalculation,
} from "@/lib/history";

const SHARE_COLORS = [
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#06B6D4",
  "#F97316",
  "#EC4899",
  "#84CC16",
  "#6366F1",
];

function formatAmount(n: number, lang: LanguageCode): string {
  const fixed = Math.round(n * 100) / 100;
  const locale = lang === "ar" ? "ar-SA" : lang === "ur" ? "ur-PK" : "en";
  try {
    return new Intl.NumberFormat(locale, {
      maximumFractionDigits: 2,
    }).format(fixed);
  } catch {
    return fixed.toLocaleString();
  }
}

function heirLabel(lang: LanguageCode, heir: HeirId, count: number): string {
  return t(lang, `heir.${heir}`) + (count > 1 ? ` (${count})` : "");
}

function buildPdfHtml(
  result: CalculationOutput,
  language: LanguageCode,
  madhab: string,
  label: string,
): string {
  const dir = isRTL(language) ? "rtl" : "ltr";
  const dateStr = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  const colorDots = SHARE_COLORS;

  const rows = result.shares
    .map(
      (s, i) => `
    <tr>
      <td style="padding:10px 12px;border-bottom:1px solid #eee;">
        <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${colorDots[i % colorDots.length]};margin-inline-end:8px;vertical-align:middle;"></span>
        ${t(language, `heir.${s.heir}`)}${s.count > 1 ? ` (${s.count})` : ""}
      </td>
      <td style="padding:10px 12px;border-bottom:1px solid #eee;font-weight:600;">${formatFraction(s.fraction)}</td>
      <td style="padding:10px 12px;border-bottom:1px solid #eee;font-weight:700;">${formatAmount(s.amount, language)}</td>
      ${s.count > 1 ? `<td style="padding:10px 12px;border-bottom:1px solid #eee;color:#666;">${formatAmount(s.perPerson, language)} ${t(language, "result.each")}</td>` : "<td></td>"}
    </tr>`,
    )
    .join("");

  const exclusionRows =
    result.exclusions.length > 0
      ? `<h3 style="margin-top:28px;color:#666;font-size:13px;text-transform:uppercase;letter-spacing:0.5px;">${t(language, "result.exclusions")}</h3>
       <ul style="color:#444;font-size:14px;line-height:1.8;">${result.exclusions.map((ex) => `<li>${t(language, `heir.${ex.heir}`)}${ex.count > 1 ? ` (${ex.count})` : ""} — ${t(language, ex.reasonKey)}</li>`).join("")}</ul>`
      : "";

  const rulesHtml =
    result.awl || result.radd
      ? `<div style="background:#f5f5f5;border:1px solid #ddd;border-radius:6px;padding:14px 18px;margin-bottom:20px;">
          <p style="margin:0;font-size:13px;font-weight:700;color:#333;text-transform:uppercase;letter-spacing:0.4px;">${t(language, "result.rules")}</p>
          ${result.awl ? `<p style="margin:6px 0 0;font-size:14px;color:#333;">${t(language, "result.awl")} (${result.awl.from} → ${result.awl.to})</p>` : ""}
          ${result.radd ? `<p style="margin:6px 0 0;font-size:14px;color:#333;">${t(language, "result.radd")}</p>` : ""}
        </div>`
      : "";

  return `<!DOCTYPE html>
<html dir="${dir}" lang="${language}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Meeras Calculator</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: -apple-system, Arial, sans-serif; color: #1a1a1a; padding: 40px; direction: ${dir}; max-width: 720px; margin: 0 auto; }
  h1 { font-size: 24px; color: #111; margin-bottom: 4px; font-weight: 700; }
  .tagline { color: #555; font-size: 14px; margin-bottom: 24px; }
  .estate-card { background: #1E293B; color: #fff; border-radius: 10px; padding: 22px; margin-bottom: 24px; }
  .estate-label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.6px; opacity: 0.65; margin-bottom: 6px; }
  .estate-value { font-size: 30px; font-weight: 700; }
  table { width: 100%; border-collapse: collapse; font-size: 14px; margin-top: 8px; }
  th { background: #f5f5f5; padding: 10px 12px; text-align: start; font-size: 11px; text-transform: uppercase; letter-spacing: 0.4px; color: #666; }
  .disclaimer { margin-top: 40px; padding: 16px; background: #fffbeb; border: 1px solid #fde68a; border-radius: 8px; }
  .disclaimer-title { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #92400e; margin-bottom: 6px; }
  .disclaimer-body { font-size: 12px; color: #78350f; line-height: 1.6; }
  .footer { margin-top: 24px; padding-top: 16px; border-top: 1px solid #eee; color: #999; font-size: 11px; display: flex; justify-content: space-between; }
  @media print { body { padding: 20px; } }
</style>
</head>
<body>
<h1>Meeras Calculator</h1>
<p class="tagline">Islamic Inheritance Distribution · ${madhab} · ${dateStr}</p>
<div class="estate-card">
  <p class="estate-label">${t(language, "result.estate")}</p>
  <p class="estate-value">${formatAmount(result.estate, language)}</p>
</div>
${rulesHtml}
<p style="font-size:13px;font-weight:600;color:#444;margin-bottom:8px;">${label}</p>
<table>
  <tr>
    <th>${t(language, "result.heir")}</th>
    <th>${t(language, "result.share")}</th>
    <th>${t(language, "result.amount")}</th>
    <th></th>
  </tr>
  ${rows}
</table>
${exclusionRows}
<div class="disclaimer">
  <p class="disclaimer-title">⚠ Important Notice</p>
  <p class="disclaimer-body">This report was generated by the <strong>Meeras Calculator</strong> app for educational and reference purposes only. The calculations are based on established Faraid principles of the Hanafi school. This is <strong>not</strong> an official legal or religious ruling (Fatwa). For any actual inheritance distribution, please consult a qualified Islamic scholar (Mufti) who can account for the full circumstances of the case.</p>
</div>
<div class="footer">
  <span>Meeras Calculator — meeras.app</span>
  <span>All calculations are performed on-device. No data is transmitted.</span>
</div>
</body>
</html>`;
}

function DeductionCard({
  state,
  language,
  colors,
}: {
  state: WizardState;
  language: LanguageCode;
  colors: ReturnType<typeof import("@/hooks/useColors").useColors>;
}) {
  const gross = state.grossEstate ?? state.estate;
  const funeral = state.funeralExpenses ?? 0;
  const debts = state.debtsOwed ?? 0;
  const receivables = state.receivables ?? 0;
  const wasiyyahRaw = state.wasiyyah ?? 0;
  const afterDebts = Math.max(0, gross + receivables - funeral - debts);
  const maxWasiyyah = afterDebts / 3;
  const appliedWasiyyah = Math.min(wasiyyahRaw, maxWasiyyah);
  const net = Math.max(0, afterDebts - appliedWasiyyah);

  const Row = ({
    label,
    value,
    sign,
    muted,
  }: {
    label: string;
    value: number;
    sign: string;
    muted?: boolean;
  }) =>
    value > 0 ? (
      <View style={styles.dedRow}>
        <Text
          style={[
            styles.dedRowLabel,
            { color: muted ? colors.mutedForeground : colors.foreground },
          ]}
        >
          {sign} {label}
        </Text>
        <Text
          style={[
            styles.dedRowValue,
            { color: muted ? colors.mutedForeground : colors.foreground },
          ]}
        >
          {formatAmount(value, language)}
        </Text>
      </View>
    ) : null;

  return (
    <View
      style={[
        styles.dedCard,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          borderRadius: colors.radius,
        },
      ]}
    >
      <View style={[styles.dedHeader, { borderBottomColor: colors.border }]}>
        <Feather name="scissors" size={13} color={colors.mutedForeground} />
        <Text style={[styles.dedHeaderText, { color: colors.mutedForeground }]}>
          {t(language, "deductions.gross")}: {formatAmount(gross, language)}
        </Text>
      </View>
      <Row
        label={t(language, "deductions.funeral")}
        value={funeral}
        sign="−"
        muted
      />
      <Row
        label={t(language, "deductions.debts")}
        value={debts}
        sign="−"
        muted
      />
      <Row
        label={t(language, "deductions.receivables")}
        value={receivables}
        sign="+"
        muted
      />
      {appliedWasiyyah > 0 && (
        <Row
          label={`${t(language, "deductions.wasiyyah")}${wasiyyahRaw > maxWasiyyah ? " (capped)" : ""}`}
          value={appliedWasiyyah}
          sign="−"
          muted
        />
      )}
      <View
        style={[styles.dedNetRow, { borderTopColor: colors.border }]}
      >
        <Text style={[styles.dedNetLabel, { color: colors.foreground }]}>
          {t(language, "deductions.net")}
        </Text>
        <Text style={[styles.dedNetValue, { color: colors.foreground }]}>
          {formatAmount(net, language)}
        </Text>
      </View>
    </View>
  );
}

export default function ResultScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { language, madhab: settingsMadhab } = useSettings();
  const params = useLocalSearchParams<{
    state?: string;
    madhab?: string;
    caseId?: string;
  }>();
  const rtl = isRTL(language);
  const isWeb = Platform.OS === "web";

  const [savedEntry, setSavedEntry] = useState<SavedCalc | null>(null);
  const [sharing, setSharing] = useState(false);
  const autoSaveRef = useRef(false);

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

  const label = useMemo(() => {
    if (!result) return "";
    return result.shares
      .map((s) => heirLabel(language, s.heir, s.count))
      .join(" · ")
      .slice(0, 80);
  }, [result, language]);

  const effectiveMadhab = (params.madhab as MadhabId) || settingsMadhab;
  const madhabLabel = t(language, `madhab.${effectiveMadhab}`);

  useEffect(() => {
    if (autoSaveRef.current) return;
    if (!params.state || params.caseId || !result) return;
    autoSaveRef.current = true;

    (async () => {
      try {
        const existing = await findByStateAndMadhab(
          params.state!,
          effectiveMadhab,
        );
        if (existing) {
          setSavedEntry(existing);
        } else {
          const entry = await saveCalculation({
            label: label || t(language, "result.title"),
            madhab: effectiveMadhab,
            state: params.state!,
            estate: result.estate,
          });
          setSavedEntry(entry);
        }
      } catch {
        // silent — storage unavailable
      }
    })();
  }, [result, params.state, params.caseId, effectiveMadhab, label, language]);

  const handleShare = async () => {
    if (sharing || !result) return;
    setSharing(true);
    try {
      const html = buildPdfHtml(result, language, madhabLabel, label);
      if (isWeb) {
        const blob = new Blob([html], { type: "text/html" });
        const url = URL.createObjectURL(blob);
        const win = window.open(url, "_blank");
        win?.addEventListener("load", () => {
          win.print();
        });
        setTimeout(() => URL.revokeObjectURL(url), 60000);
      } else {
        const { uri } = await Print.printToFileAsync({ html });
        const canShare = await Sharing.isAvailableAsync();
        if (canShare) {
          await Sharing.shareAsync(uri, {
            mimeType: "application/pdf",
            dialogTitle: t(language, "result.export"),
            UTI: "com.adobe.pdf",
          });
        } else {
          await Print.printAsync({ html });
        }
      }
    } catch {
      // user cancelled or print failed — silent
    } finally {
      setSharing(false);
    }
  };

  if (!result) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <Text style={{ color: colors.foreground, padding: 20 }}>
          {t(language, "result.noHeirs")}
        </Text>
      </View>
    );
  }

  const classicalCase = params.caseId
    ? CLASSICAL_CASES.find((c) => c.id === params.caseId)
    : null;

  const wizardState = useMemo(() => {
    try {
      return params.state ? (JSON.parse(params.state) as WizardState) : null;
    } catch {
      return null;
    }
  }, [params.state]);

  const hasDeductions = useMemo(() => {
    if (!wizardState) return false;
    const gross = wizardState.grossEstate ?? wizardState.estate;
    return (
      gross > 0 &&
      ((wizardState.funeralExpenses ?? 0) > 0 ||
        (wizardState.debtsOwed ?? 0) > 0 ||
        (wizardState.receivables ?? 0) > 0 ||
        (wizardState.wasiyyah ?? 0) > 0)
    );
  }, [wizardState]);

  const totalShareSum = result.shares.reduce((s, x) => s + x.amount, 0);

  const isUserCalc = !!params.state && !params.caseId;

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
              (isWeb ? Math.max(insets.bottom, 34) : insets.bottom) + 160,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.title, { color: colors.foreground }]}>
          {classicalCase
            ? t(language, classicalCase.nameKey)
            : t(language, "result.title")}
        </Text>

        {classicalCase ? (
          <View
            style={[
              styles.noteBox,
              {
                backgroundColor: colors.secondary,
                borderColor: colors.border,
                borderRadius: colors.radius,
              },
            ]}
          >
            <View style={styles.noteHeader}>
              <Feather
                name="book-open"
                size={14}
                color={colors.mutedForeground}
              />
              <Text
                style={[styles.noteLabel, { color: colors.foreground }]}
              >
                {t(language, classicalCase.descKey)}
              </Text>
            </View>
            <Text
              style={[styles.noteBody, { color: colors.mutedForeground }]}
            >
              {t(language, classicalCase.noteKey)}
            </Text>
          </View>
        ) : null}

        {hasDeductions && wizardState ? (
          <DeductionCard
            state={wizardState}
            language={language}
            colors={colors}
          />
        ) : null}

        <View
          style={[
            styles.estateCard,
            { backgroundColor: colors.primary, borderRadius: colors.radius },
          ]}
        >
          <Text
            style={[
              styles.estateLabel,
              { color: colors.primaryForeground, opacity: 0.65 },
            ]}
          >
            {t(language, "result.estate")}
          </Text>
          <Text
            style={[styles.estateValue, { color: colors.primaryForeground }]}
          >
            {formatAmount(result.estate, language)}
          </Text>
        </View>

        {result.shares.length > 0 && result.estate > 0 && (
          <View style={{ marginBottom: 18 }}>
            <View
              style={[
                styles.shareBarTrack,
                { borderRadius: colors.radius, overflow: "hidden" },
              ]}
            >
              {result.shares.map((share, idx) => (
                <View
                  key={`bar-${share.heir}-${idx}`}
                  style={{
                    flex: share.amount,
                    backgroundColor: SHARE_COLORS[idx % SHARE_COLORS.length],
                  }}
                />
              ))}
            </View>
            <View style={styles.barLegend}>
              {result.shares.map((share, idx) => (
                <View
                  key={`leg-${share.heir}-${idx}`}
                  style={styles.legendItem}
                >
                  <View
                    style={[
                      styles.legendDot,
                      {
                        backgroundColor:
                          SHARE_COLORS[idx % SHARE_COLORS.length],
                      },
                    ]}
                  />
                  <Text
                    style={[
                      styles.legendText,
                      { color: colors.mutedForeground },
                    ]}
                  >
                    {t(language, `heir.${share.heir}`)}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {(result.awl || result.radd) && (
          <View
            style={[
              styles.alertBox,
              {
                backgroundColor: colors.secondary,
                borderColor: colors.border,
                borderRadius: colors.radius,
              },
            ]}
          >
            <Text style={[styles.alertTitle, { color: colors.foreground }]}>
              {t(language, "result.rules")}
            </Text>
            {result.awl ? (
              <Text
                style={[
                  styles.alertText,
                  { color: colors.mutedForeground },
                ]}
              >
                {t(language, "result.awl")} ({result.awl.from} →{" "}
                {result.awl.to})
              </Text>
            ) : null}
            {result.radd ? (
              <Text
                style={[
                  styles.alertText,
                  { color: colors.mutedForeground },
                ]}
              >
                {t(language, "result.radd")}
              </Text>
            ) : null}
          </View>
        )}

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
              color={SHARE_COLORS[idx % SHARE_COLORS.length]}
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
            <Text
              style={[styles.alertTitle, { color: colors.mutedForeground }]}
            >
              {t(language, "result.residue")}
            </Text>
            <Text style={[styles.alertText, { color: colors.foreground }]}>
              {formatAmount(result.residue, language)}
            </Text>
          </View>
        ) : null}

        <Text
          style={{
            marginTop: 24,
            fontSize: 12,
            color: colors.mutedForeground,
            textAlign: "center",
            fontFamily: "Inter_400Regular",
          }}
        >
          {madhabLabel} ·{" "}
          {formatAmount(totalShareSum + (result.residue ?? 0), language)} /{" "}
          {formatAmount(result.estate, language)}
        </Text>
      </ScrollView>

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
        <View style={styles.actionRow}>
          {isUserCalc ? (
            <Pressable
              onPress={() => router.push("/history")}
              style={({ pressed }) => [
                styles.actionBtn,
                {
                  backgroundColor: savedEntry
                    ? colors.accent + "14"
                    : colors.secondary,
                  borderColor: savedEntry ? colors.accent + "50" : colors.border,
                  borderRadius: colors.radius,
                  opacity: pressed ? 0.75 : 1,
                },
              ]}
            >
              <Feather
                name={savedEntry ? "check-circle" : "loader"}
                size={15}
                color={savedEntry ? colors.accent : colors.mutedForeground}
              />
              <Text
                style={[
                  styles.actionBtnText,
                  {
                    color: savedEntry ? colors.accent : colors.mutedForeground,
                  },
                ]}
              >
                {savedEntry
                  ? t(language, "result.inHistory")
                  : t(language, "result.saving")}
              </Text>
            </Pressable>
          ) : (
            <View style={[styles.actionBtn, { backgroundColor: "transparent", borderColor: "transparent" }]} />
          )}

          <Pressable
            onPress={handleShare}
            style={({ pressed }) => [
              styles.actionBtn,
              {
                backgroundColor: colors.secondary,
                borderColor: colors.border,
                borderRadius: colors.radius,
                opacity: pressed || sharing ? 0.7 : 1,
              },
            ]}
          >
            <Feather
              name={sharing ? "loader" : "share-2"}
              size={15}
              color={colors.foreground}
            />
            <Text style={[styles.actionBtnText, { color: colors.foreground }]}>
              {sharing
                ? t(language, "result.exporting")
                : t(language, "result.export")}
            </Text>
          </Pressable>
        </View>

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
  color,
}: {
  share: ShareResult;
  language: LanguageCode;
  color: string;
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

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          borderRadius: colors.radius,
          borderLeftColor: color,
          borderLeftWidth: 3,
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
              { borderColor: colors.border, marginTop: 6 },
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
              color={colors.mutedForeground}
            />
            <Text
              style={[styles.kindLabel, { color: colors.mutedForeground }]}
            >
              {kindLabel}
            </Text>
          </View>
        </View>
        <View style={{ alignItems: "flex-end" }}>
          <Text style={[styles.fraction, { color: colors.foreground }]}>
            {formatFraction(share.fraction)}
          </Text>
          <Text style={[styles.amount, { color: colors.foreground }]}>
            {formatAmount(share.amount, language)}
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
          style={[styles.perPersonRow, { borderTopColor: colors.border }]}
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
            {formatAmount(share.perPerson, language)}
          </Text>
        </View>
      ) : null}
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
  shareBarTrack: {
    height: 12,
    flexDirection: "row",
    marginBottom: 10,
  },
  barLegend: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
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
    borderRadius: 6,
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
    gap: 10,
  },
  actionRow: {
    flexDirection: "row",
    gap: 10,
  },
  actionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    paddingVertical: 11,
    borderWidth: 1,
  },
  actionBtnText: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
    fontWeight: "600",
  },
  noteBox: {
    borderWidth: 1,
    padding: 14,
    marginBottom: 14,
  },
  dedCard: {
    borderWidth: 1,
    marginBottom: 14,
    overflow: "hidden",
  },
  dedHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  dedHeaderText: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
  },
  dedRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  dedRowLabel: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
  },
  dedRowValue: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
  },
  dedNetRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderTopWidth: 1,
    marginTop: 4,
  },
  dedNetLabel: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
    fontWeight: "600",
  },
  dedNetValue: {
    fontSize: 15,
    fontFamily: "Inter_700Bold",
    fontWeight: "700",
  },
  noteHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },
  noteLabel: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
    fontWeight: "600",
    flex: 1,
    flexWrap: "wrap",
  },
  noteBody: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    lineHeight: 19,
  },
});
