import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useSettings } from "@/contexts/SettingsContext";
import { useColors } from "@/hooks/useColors";
import { isRTL, t } from "@/lib/i18n";
import { calculate, formatFraction } from "@/lib/inheritance";
import {
  CASE_CATEGORIES,
  CLASSICAL_CASES,
  ClassicalCase,
  CaseCategory,
} from "@/lib/cases";

// ─────────────────────────────────────────────────────────────────────────────
// Fraction pill to summarise key shares in a case row
// ─────────────────────────────────────────────────────────────────────────────
function CaseSummaryPills({
  cas,
  colors,
}: {
  cas: ClassicalCase;
  colors: ReturnType<typeof useColors>;
}) {
  const out = useMemo(() => {
    try {
      return calculate(cas.input);
    } catch {
      return null;
    }
  }, [cas.input]);

  if (!out) return null;

  const pills = out.shares.slice(0, 4);

  return (
    <View style={styles.pillRow}>
      {pills.map((s) => (
        <View
          key={s.heir}
          style={[
            styles.pill,
            {
              backgroundColor:
                s.kind === "fixed"
                  ? colors.primary + "20"
                  : s.kind === "umariyyatan"
                    ? colors.accent + "20"
                    : colors.secondary,
              borderColor:
                s.kind === "fixed"
                  ? colors.primary + "40"
                  : colors.border,
            },
          ]}
        >
          <Text style={[styles.pillFrac, { color: colors.primary }]}>
            {formatFraction(s.fraction)}
          </Text>
          <Text
            style={[
              styles.pillKind,
              { color: colors.mutedForeground },
            ]}
          >
            {s.kind === "umariyyatan" ? "Umar." : s.kind}
          </Text>
        </View>
      ))}
      {out.awl ? (
        <View
          style={[
            styles.pill,
            {
              backgroundColor: "#8B000018",
              borderColor: "#8B000040",
            },
          ]}
        >
          <Text style={[styles.pillFrac, { color: "#8B0000" }]}>'Awl</Text>
        </View>
      ) : null}
      {out.radd ? (
        <View
          style={[
            styles.pill,
            {
              backgroundColor: "#00666618",
              borderColor: "#00666640",
            },
          ]}
        >
          <Text style={[styles.pillFrac, { color: "#006666" }]}>Radd</Text>
        </View>
      ) : null}
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Single case row card
// ─────────────────────────────────────────────────────────────────────────────
function CaseCard({
  cas,
  lang,
  colors,
}: {
  cas: ClassicalCase;
  lang: ReturnType<typeof useSettings>["language"];
  colors: ReturnType<typeof useColors>;
}) {
  const isFamous =
    cas.category === "famous" || cas.category === "umariyyatain";

  const onPress = () => {
    router.push({
      pathname: "/result",
      params: {
        state: JSON.stringify({
          estate: cas.input.estate,
          deceasedGender: cas.input.deceasedGender,
          hasSpouse: false,
          heirs: cas.input.heirs,
        }),
        madhab: cas.input.madhab,
        caseId: cas.id,
      },
    });
  };

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: isFamous
            ? colors.primary + "55"
            : colors.border,
          borderRadius: colors.radius,
          opacity: pressed ? 0.8 : 1,
          shadowColor: colors.foreground,
        },
      ]}
    >
      <View style={styles.cardHeader}>
        <View style={{ flex: 1 }}>
          <View style={styles.nameRow}>
            {isFamous && (
              <View
                style={[
                  styles.famousBadge,
                  { backgroundColor: colors.primary + "20" },
                ]}
              >
                <Text
                  style={[
                    styles.famousBadgeText,
                    { color: colors.primary },
                  ]}
                >
                  ★
                </Text>
              </View>
            )}
            <Text
              style={[
                styles.caseName,
                { color: colors.foreground },
              ]}
            >
              {t(lang, cas.nameKey)}
            </Text>
          </View>
          <Text
            style={[
              styles.caseDesc,
              { color: colors.mutedForeground },
            ]}
          >
            {t(lang, cas.descKey)}
          </Text>
        </View>
        <Feather
          name="chevron-right"
          size={18}
          color={colors.mutedForeground}
        />
      </View>

      <CaseSummaryPills cas={cas} colors={colors} />
    </Pressable>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Screen
// ─────────────────────────────────────────────────────────────────────────────
export default function CasesScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { language } = useSettings();
  const rtl = isRTL(language);
  const isWeb = Platform.OS === "web";

  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim()) return CLASSICAL_CASES;
    const q = query.toLowerCase();
    return CLASSICAL_CASES.filter(
      (c) =>
        t(language, c.nameKey).toLowerCase().includes(q) ||
        t(language, c.descKey).toLowerCase().includes(q),
    );
  }, [query, language]);

  const grouped: Partial<Record<CaseCategory, ClassicalCase[]>> =
    useMemo(() => {
      if (query.trim()) return { famous: filtered };
      const g: Partial<Record<CaseCategory, ClassicalCase[]>> = {};
      for (const cat of CASE_CATEGORIES) {
        const items = filtered.filter((c) => c.category === cat);
        if (items.length) g[cat] = items;
      }
      return g;
    }, [filtered, query]);

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background, direction: rtl ? "rtl" : "ltr" },
      ]}
    >
      {/* Header */}
      <View
        style={[
          styles.header,
          {
            paddingTop:
              (isWeb ? Math.max(insets.top, 67) : insets.top) + 12,
            backgroundColor: colors.background,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <View style={styles.headerRow}>
          <Pressable
            onPress={() => router.back()}
            hitSlop={12}
            style={({ pressed }) => [
              styles.backBtn,
              { backgroundColor: colors.secondary, opacity: pressed ? 0.7 : 1 },
            ]}
          >
            <Feather
              name={rtl ? "chevron-right" : "chevron-left"}
              size={20}
              color={colors.foreground}
            />
          </Pressable>
          <View style={{ flex: 1 }}>
            <Text style={[styles.title, { color: colors.foreground }]}>
              {t(language, "cases.title")}
            </Text>
            <Text
              style={[styles.subtitle, { color: colors.mutedForeground }]}
            >
              {t(language, "cases.subtitle")}
            </Text>
          </View>
          <View
            style={[
              styles.countBadge,
              { backgroundColor: colors.primary + "20" },
            ]}
          >
            <Text style={[styles.countText, { color: colors.primary }]}>
              {CLASSICAL_CASES.length}
            </Text>
          </View>
        </View>

        {/* Search */}
        <View
          style={[
            styles.searchBox,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              borderRadius: colors.radius,
              marginTop: 12,
              marginBottom: 8,
            },
          ]}
        >
          <Feather
            name="search"
            size={16}
            color={colors.mutedForeground}
          />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder={t(language, "cases.search")}
            placeholderTextColor={colors.mutedForeground}
            style={[styles.searchInput, { color: colors.foreground }]}
          />
          {query.length > 0 && (
            <Pressable onPress={() => setQuery("")} hitSlop={8}>
              <Feather name="x" size={14} color={colors.mutedForeground} />
            </Pressable>
          )}
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          {
            paddingBottom:
              (isWeb ? Math.max(insets.bottom, 34) : insets.bottom) + 24,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {(Object.keys(grouped) as CaseCategory[]).map((cat) => (
          <View key={cat} style={{ marginBottom: 8 }}>
            <Text
              style={[
                styles.catLabel,
                { color: colors.primary },
              ]}
            >
              {t(language, `category.${cat}`)}
            </Text>
            {(grouped[cat] ?? []).map((cas) => (
              <CaseCard
                key={cas.id}
                cas={cas}
                lang={language}
                colors={colors}
              />
            ))}
          </View>
        ))}

        {filtered.length === 0 && (
          <View style={styles.empty}>
            <Feather
              name="search"
              size={40}
              color={colors.mutedForeground}
            />
            <Text
              style={[styles.emptyText, { color: colors.mutedForeground }]}
            >
              No cases match "{query}"
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 0,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 4,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontFamily: "Inter_700Bold",
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    marginTop: 1,
  },
  countBadge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  countText: {
    fontSize: 14,
    fontFamily: "Inter_700Bold",
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderWidth: 1,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    padding: 0,
  },
  scroll: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  catLabel: {
    fontSize: 13,
    fontFamily: "Inter_700Bold",
    letterSpacing: 0.5,
    textTransform: "uppercase",
    marginBottom: 10,
    marginTop: 4,
    paddingHorizontal: 4,
  },
  card: {
    borderWidth: 1,
    marginBottom: 10,
    padding: 14,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flexWrap: "wrap",
  },
  famousBadge: {
    borderRadius: 999,
    paddingHorizontal: 6,
    paddingVertical: 1,
  },
  famousBadgeText: {
    fontSize: 11,
    fontFamily: "Inter_700Bold",
  },
  caseName: {
    fontSize: 15,
    fontFamily: "Inter_700Bold",
    fontWeight: "700",
    flexShrink: 1,
  },
  caseDesc: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    marginTop: 3,
    lineHeight: 18,
  },
  pillRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 10,
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  pillFrac: {
    fontSize: 12,
    fontFamily: "Inter_700Bold",
  },
  pillKind: {
    fontSize: 10,
    fontFamily: "Inter_400Regular",
  },
  empty: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    gap: 12,
  },
  emptyText: {
    fontSize: 15,
    fontFamily: "Inter_400Regular",
  },
});
