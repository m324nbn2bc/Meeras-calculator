import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Counter } from "@/components/Counter";
import { OptionRow } from "@/components/OptionRow";
import { PrimaryButton } from "@/components/PrimaryButton";
import { useSettings } from "@/contexts/SettingsContext";
import { useColors } from "@/hooks/useColors";
import { isRTL, t } from "@/lib/i18n";
import {
  computeNetEstate,
  initialState,
  visibleSteps,
  WizardState,
} from "@/lib/wizard";

function fmt(n: number, lang: string): string {
  if (n === 0) return "—";
  const locale = lang === "ar" ? "ar-SA" : lang === "ur" ? "ur-PK" : "en";
  try {
    return new Intl.NumberFormat(locale, {
      maximumFractionDigits: 2,
    }).format(n);
  } catch {
    return n.toLocaleString();
  }
}

interface DeductionFieldProps {
  label: string;
  help: string;
  value: string;
  onChange: (v: string) => void;
  sign: "−" | "+" | "=";
  highlight?: boolean;
  rtl: boolean;
  colors: ReturnType<typeof import("@/hooks/useColors").useColors>;
  caption?: string;
}

function DeductionField({
  label,
  help,
  value,
  onChange,
  sign,
  highlight,
  rtl,
  colors,
  caption,
}: DeductionFieldProps) {
  return (
    <View
      style={[
        styles.deductField,
        {
          borderColor: highlight ? colors.primary : colors.border,
          borderRadius: colors.radius,
          backgroundColor: highlight
            ? colors.primary + "08"
            : colors.card,
        },
      ]}
    >
      <View style={styles.deductFieldTop}>
        <View style={{ flex: 1 }}>
          <Text
            style={[
              styles.deductLabel,
              { color: highlight ? colors.primary : colors.foreground },
            ]}
          >
            {label}
          </Text>
          <Text
            style={[styles.deductHelp, { color: colors.mutedForeground }]}
          >
            {help}
          </Text>
        </View>
        <Text
          style={[
            styles.deductSign,
            {
              color: highlight
                ? colors.primary
                : sign === "+"
                  ? "#10B981"
                  : colors.mutedForeground,
            },
          ]}
        >
          {sign}
        </Text>
      </View>
      <TextInput
        value={value}
        onChangeText={(v) => onChange(v.replace(/[^0-9.]/g, ""))}
        keyboardType="decimal-pad"
        placeholder="0"
        placeholderTextColor={colors.mutedForeground}
        style={[
          styles.deductInput,
          {
            color: highlight ? colors.primary : colors.foreground,
            borderTopColor: colors.border,
            textAlign: rtl ? "right" : "left",
            fontFamily: "Inter_700Bold",
          },
        ]}
      />
      {caption ? (
        <Text style={[styles.deductCaption, { color: colors.mutedForeground }]}>
          {caption}
        </Text>
      ) : null}
    </View>
  );
}

export default function WizardScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { language, madhab } = useSettings();
  const rtl = isRTL(language);
  const isWeb = Platform.OS === "web";

  const [state, setState] = useState<WizardState>(initialState);
  const [index, setIndex] = useState(0);

  const [estateText, setEstateText] = useState("");
  const [funeralText, setFuneralText] = useState("");
  const [debtsText, setDebtsText] = useState("");
  const [receivablesText, setReceivablesText] = useState("");
  const [wasiyyahText, setWasiyyahText] = useState("");

  const flow = useMemo(() => visibleSteps(state), [state]);
  const safeIndex = Math.min(index, flow.length - 1);
  const step = flow[safeIndex];
  const isLast = safeIndex === flow.length - 1;

  const goNext = () => {
    if (!step) return;
    const newState = step.apply(state, 0);
    if (step.id !== "deductions") {
      setState((s) => step.apply(s, step.read(s)));
    } else {
      setState(newState);
    }
    const newFlow = visibleSteps(newState);
    const newIndex = newFlow.findIndex((s) => s.id === step.id);
    if (newIndex < newFlow.length - 1) {
      setIndex(newIndex + 1);
    } else {
      const finalState = step.apply(state, 0);
      router.replace({
        pathname: "/result",
        params: { state: JSON.stringify(finalState), madhab },
      });
    }
  };

  const goNextWithCurrentState = () => {
    if (!step) return;
    const updatedState = step.id === "deductions"
      ? { ...state, estate: computeNetEstate(state) }
      : state;
    const newFlow = visibleSteps(updatedState);
    const newIndex = newFlow.findIndex((s) => s.id === step.id);
    if (newIndex < newFlow.length - 1) {
      setState(updatedState);
      setIndex(newIndex + 1);
    } else {
      router.replace({
        pathname: "/result",
        params: { state: JSON.stringify(updatedState), madhab },
      });
    }
  };

  const goBack = () => {
    if (safeIndex === 0) {
      router.back();
    } else {
      setIndex(safeIndex - 1);
    }
  };

  const setAnswer = (value: number | boolean | "male" | "female") => {
    setState((s) => step.apply(s, value));
  };

  if (!step) return null;

  let title = t(language, step.titleKey);
  if (step.id === "spouse") {
    title = t(
      language,
      state.deceasedGender === "male"
        ? "q.spouse.title.male"
        : "q.spouse.title.female",
    );
  }

  const gross = state.grossEstate ?? state.estate;
  const afterDebts = Math.max(
    0,
    gross +
      (state.receivables ?? 0) -
      (state.funeralExpenses ?? 0) -
      (state.debtsOwed ?? 0),
  );
  const maxWasiyyah = afterDebts / 3;
  const appliedWasiyyah = Math.min(state.wasiyyah ?? 0, maxWasiyyah);
  const netEstate = Math.max(0, afterDebts - appliedWasiyyah);
  const wasiyyahCapped =
    (state.wasiyyah ?? 0) > maxWasiyyah && maxWasiyyah > 0;

  const canProceed = true;

  const isDeductions = step.kind === "deductions";

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View
        style={[
          styles.container,
          {
            backgroundColor: colors.background,
            paddingTop: isWeb ? Math.max(insets.top, 67) : 8,
            paddingBottom:
              (isWeb ? Math.max(insets.bottom, 34) : insets.bottom) + 16,
            direction: rtl ? "rtl" : "ltr",
          },
        ]}
      >
        <View style={styles.header}>
          <Pressable
            onPress={goBack}
            hitSlop={12}
            style={({ pressed }) => [
              styles.iconBtn,
              { backgroundColor: colors.secondary, opacity: pressed ? 0.7 : 1 },
            ]}
          >
            <Feather
              name={rtl ? "arrow-right" : "arrow-left"}
              size={20}
              color={colors.foreground}
            />
          </Pressable>
          <Text style={[styles.progressText, { color: colors.mutedForeground }]}>
            {t(language, "wizard.progress")} {safeIndex + 1}{" "}
            {t(language, "common.of")} {flow.length}
          </Text>
          <View style={{ width: 40 }} />
        </View>

        <View
          style={[styles.progressTrack, { backgroundColor: colors.secondary }]}
        >
          <View
            style={[
              styles.progressFill,
              {
                backgroundColor: colors.primary,
                width: `${((safeIndex + 1) / flow.length) * 100}%`,
              },
            ]}
          />
        </View>

        {isDeductions ? (
          <ScrollView
            style={{ flex: 1 }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ paddingBottom: 24 }}
          >
            <Text
              style={[
                styles.title,
                { color: colors.foreground, textAlign: rtl ? "right" : "left" },
              ]}
            >
              {title}
            </Text>
            {step.helpKey ? (
              <Text
                style={[
                  styles.help,
                  {
                    color: colors.mutedForeground,
                    textAlign: rtl ? "right" : "left",
                  },
                ]}
              >
                {t(language, step.helpKey)}
              </Text>
            ) : null}

            <View style={[styles.answerArea, { gap: 10 }]}>
              <DeductionField
                label={t(language, "q.funeral.label")}
                help={t(language, "q.funeral.help")}
                value={funeralText}
                sign="−"
                rtl={rtl}
                colors={colors}
                onChange={(v) => {
                  setFuneralText(v);
                  setState((s) => ({ ...s, funeralExpenses: Number(v) || 0 }));
                }}
              />
              <DeductionField
                label={t(language, "q.debts.label")}
                help={t(language, "q.debts.help")}
                value={debtsText}
                sign="−"
                rtl={rtl}
                colors={colors}
                onChange={(v) => {
                  setDebtsText(v);
                  setState((s) => ({ ...s, debtsOwed: Number(v) || 0 }));
                }}
              />
              <DeductionField
                label={t(language, "q.receivables.label")}
                help={t(language, "q.receivables.help")}
                value={receivablesText}
                sign="+"
                rtl={rtl}
                colors={colors}
                onChange={(v) => {
                  setReceivablesText(v);
                  setState((s) => ({ ...s, receivables: Number(v) || 0 }));
                }}
              />
              <DeductionField
                label={t(language, "q.wasiyyah.label")}
                help={t(language, "q.wasiyyah.help")}
                value={wasiyyahText}
                sign="−"
                rtl={rtl}
                colors={colors}
                caption={
                  wasiyyahCapped
                    ? `${t(language, "q.wasiyyah.capped")}: ${fmt(maxWasiyyah, language)}`
                    : maxWasiyyah > 0
                      ? `Max 1/3: ${fmt(maxWasiyyah, language)}`
                      : undefined
                }
                onChange={(v) => {
                  setWasiyyahText(v);
                  setState((s) => ({ ...s, wasiyyah: Number(v) || 0 }));
                }}
              />

              {/* Live net estate preview */}
              <View
                style={[
                  styles.netCard,
                  {
                    backgroundColor: colors.primary,
                    borderRadius: colors.radius,
                  },
                ]}
              >
                <View style={styles.netRow}>
                  <Text
                    style={[
                      styles.netRowLabel,
                      { color: colors.primaryForeground, opacity: 0.75 },
                    ]}
                  >
                    {t(language, "deductions.gross")}
                  </Text>
                  <Text
                    style={[
                      styles.netRowValue,
                      { color: colors.primaryForeground },
                    ]}
                  >
                    {fmt(gross, language)}
                  </Text>
                </View>
                {(state.funeralExpenses ?? 0) > 0 && (
                  <View style={styles.netRow}>
                    <Text
                      style={[
                        styles.netRowLabel,
                        { color: colors.primaryForeground, opacity: 0.75 },
                      ]}
                    >
                      − {t(language, "deductions.funeral")}
                    </Text>
                    <Text
                      style={[
                        styles.netRowValue,
                        { color: colors.primaryForeground, opacity: 0.85 },
                      ]}
                    >
                      {fmt(state.funeralExpenses ?? 0, language)}
                    </Text>
                  </View>
                )}
                {(state.debtsOwed ?? 0) > 0 && (
                  <View style={styles.netRow}>
                    <Text
                      style={[
                        styles.netRowLabel,
                        { color: colors.primaryForeground, opacity: 0.75 },
                      ]}
                    >
                      − {t(language, "deductions.debts")}
                    </Text>
                    <Text
                      style={[
                        styles.netRowValue,
                        { color: colors.primaryForeground, opacity: 0.85 },
                      ]}
                    >
                      {fmt(state.debtsOwed ?? 0, language)}
                    </Text>
                  </View>
                )}
                {(state.receivables ?? 0) > 0 && (
                  <View style={styles.netRow}>
                    <Text
                      style={[
                        styles.netRowLabel,
                        { color: colors.primaryForeground, opacity: 0.75 },
                      ]}
                    >
                      + {t(language, "deductions.receivables")}
                    </Text>
                    <Text
                      style={[
                        styles.netRowValue,
                        { color: colors.primaryForeground, opacity: 0.85 },
                      ]}
                    >
                      {fmt(state.receivables ?? 0, language)}
                    </Text>
                  </View>
                )}
                {appliedWasiyyah > 0 && (
                  <View style={styles.netRow}>
                    <Text
                      style={[
                        styles.netRowLabel,
                        { color: colors.primaryForeground, opacity: 0.75 },
                      ]}
                    >
                      − {t(language, "deductions.wasiyyah")}
                      {wasiyyahCapped ? " ⚠" : ""}
                    </Text>
                    <Text
                      style={[
                        styles.netRowValue,
                        { color: colors.primaryForeground, opacity: 0.85 },
                      ]}
                    >
                      {fmt(appliedWasiyyah, language)}
                    </Text>
                  </View>
                )}
                <View
                  style={[
                    styles.netDivider,
                    { borderTopColor: colors.primaryForeground + "30" },
                  ]}
                />
                <View style={styles.netRow}>
                  <Text
                    style={[
                      styles.netTotalLabel,
                      { color: colors.primaryForeground },
                    ]}
                  >
                    {t(language, "deductions.net")}
                  </Text>
                  <Text
                    style={[
                      styles.netTotalValue,
                      { color: colors.primaryForeground },
                    ]}
                  >
                    {fmt(netEstate, language)}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.netNote,
                    { color: colors.primaryForeground, opacity: 0.65 },
                  ]}
                >
                  {t(language, "deductions.netNote")}
                </Text>
              </View>
            </View>
          </ScrollView>
        ) : (
          <View style={styles.body}>
            <Text
              style={[
                styles.title,
                { color: colors.foreground, textAlign: rtl ? "right" : "left" },
              ]}
            >
              {title}
            </Text>
            {step.helpKey ? (
              <Text
                style={[
                  styles.help,
                  {
                    color: colors.mutedForeground,
                    textAlign: rtl ? "right" : "left",
                  },
                ]}
              >
                {t(language, step.helpKey)}
              </Text>
            ) : null}

            <View style={styles.answerArea}>
              {step.kind === "estate" && (
                <View style={styles.estateWrap}>
                  <TextInput
                    value={estateText}
                    onChangeText={(v) => {
                      const cleaned = v.replace(/[^0-9.]/g, "");
                      setEstateText(cleaned);
                      const gross = Number(cleaned) || 0;
                      setState((s) => ({
                        ...s,
                        grossEstate: gross,
                        estate: gross,
                      }));
                    }}
                    keyboardType="decimal-pad"
                    placeholder={t(language, "q.estate.placeholder")}
                    placeholderTextColor={colors.mutedForeground}
                    style={[
                      styles.estateInput,
                      {
                        color: colors.foreground,
                        borderBottomColor: colors.border,
                        textAlign: rtl ? "right" : "left",
                      },
                    ]}
                    autoFocus
                  />
                  <Pressable
                    onPress={goNextWithCurrentState}
                    style={({ pressed }) => [
                      styles.skipBtn,
                      { opacity: pressed ? 0.6 : 1 },
                    ]}
                  >
                    <Text
                      style={[
                        styles.skipText,
                        { color: colors.mutedForeground },
                      ]}
                    >
                      {t(language, "q.estate.skip")}
                    </Text>
                  </Pressable>
                </View>
              )}

              {step.kind === "gender" && (
                <View>
                  <OptionRow
                    label={t(language, "common.male")}
                    selected={state.deceasedGender === "male"}
                    onPress={() => setAnswer("male")}
                  />
                  <OptionRow
                    label={t(language, "common.female")}
                    selected={state.deceasedGender === "female"}
                    onPress={() => setAnswer("female")}
                  />
                </View>
              )}

              {step.kind === "yesno" && (
                <View>
                  <OptionRow
                    label={t(language, "common.yes")}
                    selected={!!step.read(state)}
                    onPress={() => setAnswer(true)}
                  />
                  <OptionRow
                    label={t(language, "common.no")}
                    selected={!step.read(state)}
                    onPress={() => setAnswer(false)}
                  />
                </View>
              )}

              {step.kind === "count" && (
                <Counter
                  value={Number(step.read(state))}
                  onChange={(n) => setAnswer(n)}
                  min={step.min ?? 0}
                  max={step.max ?? 99}
                />
              )}
            </View>
          </View>
        )}

        <View style={styles.footer}>
          <PrimaryButton
            label={t(language, isLast ? "common.done" : "common.next")}
            onPress={goNextWithCurrentState}
            disabled={!canProceed}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  progressText: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
  },
  progressTrack: {
    height: 4,
    borderRadius: 2,
    overflow: "hidden",
    marginBottom: 28,
  },
  progressFill: {
    height: 4,
    borderRadius: 2,
  },
  body: {
    flex: 1,
  },
  title: {
    fontSize: 26,
    fontFamily: "Inter_700Bold",
    fontWeight: "700",
    lineHeight: 34,
    letterSpacing: -0.4,
  },
  help: {
    marginTop: 12,
    fontSize: 14,
    lineHeight: 20,
    fontFamily: "Inter_400Regular",
  },
  answerArea: {
    marginTop: 28,
  },
  estateWrap: {
    paddingTop: 8,
  },
  estateInput: {
    fontSize: 36,
    fontFamily: "Inter_700Bold",
    fontWeight: "700",
    paddingVertical: 12,
    borderBottomWidth: 2,
  },
  skipBtn: {
    marginTop: 20,
    alignSelf: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  skipText: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
    textDecorationLine: "underline",
  },
  footer: {
    gap: 12,
    paddingTop: 12,
  },
  // ── Deduction step ──
  deductField: {
    borderWidth: 1,
    padding: 14,
  },
  deductFieldTop: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  deductLabel: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
    fontWeight: "600",
  },
  deductHelp: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    marginTop: 2,
    lineHeight: 15,
  },
  deductSign: {
    fontSize: 22,
    fontFamily: "Inter_700Bold",
    fontWeight: "700",
    lineHeight: 26,
  },
  deductInput: {
    fontSize: 24,
    fontWeight: "700",
    paddingTop: 10,
    paddingBottom: 2,
    borderTopWidth: 1,
    marginTop: 10,
  },
  deductCaption: {
    fontSize: 11,
    fontFamily: "Inter_500Medium",
    marginTop: 4,
  },
  // ── Net preview card ──
  netCard: {
    padding: 18,
    marginTop: 4,
  },
  netRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  netRowLabel: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
  },
  netRowValue: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
  },
  netDivider: {
    borderTopWidth: 1,
    marginVertical: 10,
  },
  netTotalLabel: {
    fontSize: 15,
    fontFamily: "Inter_700Bold",
    fontWeight: "700",
  },
  netTotalValue: {
    fontSize: 18,
    fontFamily: "Inter_700Bold",
    fontWeight: "700",
  },
  netNote: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    marginTop: 6,
  },
});
