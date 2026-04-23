import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Platform,
  Pressable,
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
import { initialState, visibleSteps, WizardState } from "@/lib/wizard";

export default function WizardScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { language, madhab } = useSettings();
  const rtl = isRTL(language);
  const isWeb = Platform.OS === "web";

  const [state, setState] = useState<WizardState>(initialState);
  const [index, setIndex] = useState(0);
  const [estateText, setEstateText] = useState("");

  const flow = useMemo(() => visibleSteps(state), [state]);
  const safeIndex = Math.min(index, flow.length - 1);
  const step = flow[safeIndex];
  const isLast = safeIndex === flow.length - 1;

  const goNext = () => {
    if (!step) return;
    // Re-evaluate visibility because answers may have changed flow
    const newFlow = visibleSteps(state);
    const newIndex = newFlow.findIndex((s) => s.id === step.id);
    if (newIndex < newFlow.length - 1) {
      setIndex(newIndex + 1);
    } else {
      router.replace({
        pathname: "/result",
        params: {
          state: JSON.stringify(state),
          madhab,
        },
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

  // Resolve dynamic title for spouse step
  let title = t(language, step.titleKey);
  if (step.id === "spouse") {
    title = t(
      language,
      state.deceasedGender === "male"
        ? "q.spouse.title.male"
        : "q.spouse.title.female",
    );
  }

  const canProceed = (() => {
    if (step.kind === "estate") return state.estate > 0;
    return true;
  })();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          paddingTop: isWeb ? Math.max(insets.top, 67) : 8,
          paddingBottom: (isWeb ? Math.max(insets.bottom, 34) : insets.bottom) + 16,
          direction: rtl ? "rtl" : "ltr",
        },
      ]}
    >
      {/* Header */}
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

      {/* Progress bar */}
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

      {/* Body */}
      <View style={styles.body}>
        <Text
          style={[
            styles.title,
            {
              color: colors.foreground,
              textAlign: rtl ? "right" : "left",
            },
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
                  setState((s) => ({ ...s, estate: Number(cleaned) || 0 }));
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

      <View style={styles.footer}>
        <PrimaryButton
          label={t(language, isLast ? "common.done" : "common.next")}
          onPress={goNext}
          disabled={!canProceed}
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
    marginTop: 36,
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
  footer: {
    gap: 12,
  },
});
