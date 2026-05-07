import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useSettings } from "@/contexts/SettingsContext";
import { useColors } from "@/hooks/useColors";
import { isRTL, t } from "@/lib/i18n";
import {
  deleteCalculation,
  formatSavedDate,
  listCalculations,
  SavedCalc,
} from "@/lib/history";

function formatAmount(n: number, currency: string, lang: string): string {
  const locale =
    lang === "ar" ? "ar-SA" : lang === "ur" ? "ur-PK" : lang;
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(n);
  } catch {
    return `${currency} ${n.toLocaleString()}`;
  }
}

export default function HistoryScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { language } = useSettings();
  const rtl = isRTL(language);
  const isWeb = Platform.OS === "web";

  const [calcs, setCalcs] = useState<SavedCalc[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const list = await listCalculations();
    setCalcs(list);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleDelete = useCallback(
    (item: SavedCalc) => {
      Alert.alert(
        t(language, "history.delete"),
        item.label,
        [
          { text: t(language, "common.close"), style: "cancel" },
          {
            text: t(language, "history.delete"),
            style: "destructive",
            onPress: async () => {
              await deleteCalculation(item.id);
              setCalcs((prev) => prev.filter((c) => c.id !== item.id));
            },
          },
        ],
      );
    },
    [language],
  );

  const handleOpen = useCallback((item: SavedCalc) => {
    router.push({
      pathname: "/result",
      params: { state: item.state, madhab: item.madhab },
    });
  }, []);

  const renderItem = ({ item }: { item: SavedCalc }) => (
    <Pressable
      onPress={() => handleOpen(item)}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          borderRadius: colors.radius,
          opacity: pressed ? 0.75 : 1,
        },
      ]}
    >
      <View style={styles.cardBody}>
        <Text
          style={[styles.cardLabel, { color: colors.foreground }]}
          numberOfLines={2}
        >
          {item.label}
        </Text>
        <View style={styles.metaRow}>
          <Text style={[styles.metaText, { color: colors.primary }]}>
            {formatAmount(item.estate, item.currency, language)}
          </Text>
          <Text
            style={[styles.metaDot, { color: colors.mutedForeground }]}
          >
            ·
          </Text>
          <Text style={[styles.metaText, { color: colors.mutedForeground }]}>
            {t(language, `madhab.${item.madhab}`)}
          </Text>
        </View>
        <Text style={[styles.dateText, { color: colors.mutedForeground }]}>
          {formatSavedDate(item.savedAt, language)}
        </Text>
      </View>
      <Pressable
        onPress={() => handleDelete(item)}
        hitSlop={12}
        style={({ pressed }) => [
          styles.deleteBtn,
          { opacity: pressed ? 0.5 : 1 },
        ]}
      >
        <Feather name="trash-2" size={16} color={colors.mutedForeground} />
      </Pressable>
    </Pressable>
  );

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
      <FlatList
        data={calcs}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={[
          styles.list,
          {
            paddingTop: isWeb ? Math.max(insets.top, 67) + 8 : 16,
            paddingBottom:
              (isWeb ? Math.max(insets.bottom, 34) : insets.bottom) + 32,
          },
        ]}
        ListHeaderComponent={
          <Text style={[styles.title, { color: colors.foreground }]}>
            {t(language, "history.title")}
          </Text>
        }
        ListEmptyComponent={
          !loading ? (
            <View style={styles.emptyState}>
              <Feather
                name="bookmark"
                size={48}
                color={colors.mutedForeground}
                style={{ opacity: 0.4 }}
              />
              <Text
                style={[styles.emptyTitle, { color: colors.foreground }]}
              >
                {t(language, "history.empty")}
              </Text>
              <Text
                style={[
                  styles.emptyHint,
                  { color: colors.mutedForeground },
                ]}
              >
                {t(language, "history.emptyHint")}
              </Text>
            </View>
          ) : null
        }
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  list: { paddingHorizontal: 20 },
  title: {
    fontSize: 32,
    fontFamily: "Inter_700Bold",
    fontWeight: "700",
    letterSpacing: -0.5,
    marginBottom: 20,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    padding: 16,
    gap: 12,
  },
  cardBody: { flex: 1, gap: 5 },
  cardLabel: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
    fontWeight: "600",
    lineHeight: 20,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flexWrap: "wrap",
  },
  metaText: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
  },
  metaDot: {
    fontSize: 13,
  },
  dateText: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    marginTop: 2,
  },
  deleteBtn: {
    padding: 4,
  },
  emptyState: {
    marginTop: 80,
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 17,
    fontFamily: "Inter_600SemiBold",
    fontWeight: "600",
    textAlign: "center",
  },
  emptyHint: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    lineHeight: 20,
    textAlign: "center",
  },
});
