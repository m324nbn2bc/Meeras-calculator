import { Feather } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { useColors } from "@/hooks/useColors";

interface Props {
  label: string;
  selected: boolean;
  onPress: () => void;
  description?: string;
  disabled?: boolean;
  badge?: string;
}

export function OptionRow({
  label,
  selected,
  onPress,
  description,
  disabled,
  badge,
}: Props) {
  const colors = useColors();
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.row,
        {
          backgroundColor: selected ? colors.primary : colors.card,
          borderColor: selected ? colors.primary : colors.border,
          borderRadius: colors.radius,
          opacity: disabled ? 0.5 : pressed ? 0.85 : 1,
        },
      ]}
    >
      <View style={{ flex: 1 }}>
        <View style={styles.labelRow}>
          <Text
            style={[
              styles.label,
              { color: selected ? colors.primaryForeground : colors.foreground },
            ]}
          >
            {label}
          </Text>
          {badge ? (
            <Text
              style={[
                styles.badge,
                {
                  color: selected ? colors.primaryForeground : colors.mutedForeground,
                  borderColor: selected ? colors.primaryForeground : colors.border,
                },
              ]}
            >
              {badge}
            </Text>
          ) : null}
        </View>
        {description ? (
          <Text
            style={[
              styles.desc,
              {
                color: selected
                  ? colors.primaryForeground
                  : colors.mutedForeground,
              },
            ]}
          >
            {description}
          </Text>
        ) : null}
      </View>
      {selected ? (
        <Feather name="check" size={22} color={colors.primaryForeground} />
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderWidth: 1,
    marginBottom: 12,
    gap: 12,
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  label: {
    fontSize: 17,
    fontWeight: "600",
    fontFamily: "Inter_600SemiBold",
  },
  desc: {
    marginTop: 4,
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    lineHeight: 18,
  },
  badge: {
    fontSize: 11,
    fontFamily: "Inter_500Medium",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderWidth: 1,
    borderRadius: 999,
    overflow: "hidden",
  },
});
