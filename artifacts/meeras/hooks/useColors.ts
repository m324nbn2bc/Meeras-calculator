import { useColorScheme } from "react-native";

import colors from "@/constants/colors";
import { useSettings } from "@/contexts/SettingsContext";

export function useColors() {
  const systemScheme = useColorScheme();
  const { theme } = useSettings();
  const effective =
    theme === "system" ? (systemScheme ?? "light") : theme;
  const palette = effective === "dark" ? colors.dark : colors.light;
  return { ...palette, radius: colors.radius, scheme: effective };
}
