import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";

import { useColors } from "@/hooks/useColors";

interface Props {
  value: number;
  onChange: (n: number) => void;
  min?: number;
  max?: number;
}

export function Counter({ value, onChange, min = 0, max = 99 }: Props) {
  const colors = useColors();

  const tap = (delta: number) => {
    const next = Math.max(min, Math.min(max, value + delta));
    if (next === value) return;
    if (Platform.OS !== "web") {
      Haptics.selectionAsync().catch(() => {});
    }
    onChange(next);
  };

  return (
    <View style={styles.row}>
      <Pressable
        onPress={() => tap(-1)}
        disabled={value <= min}
        style={({ pressed }) => [
          styles.btn,
          {
            backgroundColor: colors.secondary,
            borderRadius: colors.radius,
            opacity: value <= min ? 0.3 : pressed ? 0.7 : 1,
          },
        ]}
      >
        <Feather name="minus" size={26} color={colors.foreground} />
      </Pressable>

      <View style={styles.valueWrap}>
        <Text style={[styles.value, { color: colors.foreground }]}>{value}</Text>
      </View>

      <Pressable
        onPress={() => tap(1)}
        disabled={value >= max}
        style={({ pressed }) => [
          styles.btn,
          {
            backgroundColor: colors.primary,
            borderRadius: colors.radius,
            opacity: value >= max ? 0.3 : pressed ? 0.85 : 1,
          },
        ]}
      >
        <Feather name="plus" size={26} color={colors.primaryForeground} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 24,
    marginVertical: 24,
  },
  btn: {
    width: 64,
    height: 64,
    alignItems: "center",
    justifyContent: "center",
  },
  valueWrap: {
    minWidth: 80,
    alignItems: "center",
  },
  value: {
    fontSize: 56,
    fontWeight: "700",
    fontFamily: "Inter_700Bold",
  },
});
