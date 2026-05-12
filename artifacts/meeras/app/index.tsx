import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { PrimaryButton } from "@/components/PrimaryButton";
import { useSettings } from "@/contexts/SettingsContext";
import { useColors } from "@/hooks/useColors";
import { isRTL, t } from "@/lib/i18n";

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { language, hydrated } = useSettings();
  const rtl = isRTL(language);
  const isWeb = Platform.OS === "web";

  const [menuOpen, setMenuOpen] = useState(false);
  const menuBtnRef = useRef<View>(null);
  const [menuPos, setMenuPos] = useState({ top: 0, right: 0 });

  if (!hydrated) {
    return <View style={{ flex: 1, backgroundColor: colors.background }} />;
  }

  const openMenu = () => {
    menuBtnRef.current?.measure((_fx, _fy, _w, _h, px, py) => {
      setMenuPos({ top: py + _h + 4, right: isWeb ? 24 : 16 });
      setMenuOpen(true);
    });
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          paddingTop: isWeb ? Math.max(insets.top, 0) : insets.top,
          paddingBottom:
            (isWeb ? Math.max(insets.bottom, 34) : insets.bottom) + 24,
          direction: rtl ? "rtl" : "ltr",
        },
      ]}
    >
      {/* ── Header ── */}
      <View
        style={[
          styles.header,
          { borderBottomColor: colors.border, paddingTop: 12 },
        ]}
      >
        <View style={styles.headerBrand}>
          <View
            style={[styles.headerIcon, { backgroundColor: colors.primary }]}
          >
            <Feather
              name="pie-chart"
              size={16}
              color={colors.primaryForeground}
            />
          </View>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>
            {t(language, "app.name")}
          </Text>
        </View>

        <Pressable
          ref={menuBtnRef}
          onPress={openMenu}
          hitSlop={12}
          style={({ pressed }) => [
            styles.menuBtn,
            {
              backgroundColor: pressed ? colors.secondary : "transparent",
              borderColor: colors.border,
            },
          ]}
        >
          <Feather name="menu" size={20} color={colors.foreground} />
        </Pressable>
      </View>

      {/* ── Dropdown Menu ── */}
      <Modal
        visible={menuOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuOpen(false)}
      >
        <TouchableWithoutFeedback onPress={() => setMenuOpen(false)}>
          <View style={StyleSheet.absoluteFill}>
            <View
              style={[
                styles.dropdown,
                {
                  top: menuPos.top,
                  right: menuPos.right,
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                  shadowColor: "#000",
                },
              ]}
            >
              <Pressable
                onPress={() => {
                  setMenuOpen(false);
                  router.push("/settings");
                }}
                style={({ pressed }) => [
                  styles.dropdownItem,
                  {
                    backgroundColor: pressed
                      ? colors.secondary
                      : "transparent",
                  },
                ]}
              >
                <Feather name="settings" size={15} color={colors.foreground} />
                <Text
                  style={[
                    styles.dropdownItemText,
                    { color: colors.foreground },
                  ]}
                >
                  {t(language, "home.settings")}
                </Text>
              </Pressable>
              <View
                style={[
                  styles.dropdownDivider,
                  { backgroundColor: colors.border },
                ]}
              />
              <Pressable
                onPress={() => {
                  setMenuOpen(false);
                  router.push("/guide");
                }}
                style={({ pressed }) => [
                  styles.dropdownItem,
                  {
                    backgroundColor: pressed
                      ? colors.secondary
                      : "transparent",
                  },
                ]}
              >
                <Feather name="book" size={15} color={colors.foreground} />
                <Text
                  style={[
                    styles.dropdownItemText,
                    { color: colors.foreground },
                  ]}
                >
                  {t(language, "home.guide")}
                </Text>
              </Pressable>
              <View
                style={[
                  styles.dropdownDivider,
                  { backgroundColor: colors.border },
                ]}
              />
              <Pressable
                onPress={() => {
                  setMenuOpen(false);
                  router.push("/about");
                }}
                style={({ pressed }) => [
                  styles.dropdownItem,
                  {
                    backgroundColor: pressed
                      ? colors.secondary
                      : "transparent",
                  },
                ]}
              >
                <Feather name="info" size={15} color={colors.foreground} />
                <Text
                  style={[
                    styles.dropdownItemText,
                    { color: colors.foreground },
                  ]}
                >
                  {t(language, "home.about")}
                </Text>
              </Pressable>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* ── Hero ── */}
      <View style={styles.hero}>
        <Text style={[styles.title, { color: colors.foreground }]}>
          {t(language, "app.tagline")}
        </Text>
        <Text
          style={[
            styles.intro,
            {
              color: colors.mutedForeground,
              textAlign: rtl ? "right" : "center",
            },
          ]}
        >
          {t(language, "home.intro")}
        </Text>
      </View>

      {/* ── Actions ── */}
      <View style={styles.actions}>
        <PrimaryButton
          label={t(language, "home.start")}
          onPress={() => router.push("/wizard")}
        />

        <Pressable
          onPress={() => router.push("/cases")}
          style={({ pressed }) => [
            styles.secondaryBtn,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              borderRadius: colors.radius,
              opacity: pressed ? 0.7 : 1,
            },
          ]}
        >
          <Feather name="book-open" size={16} color={colors.foreground} />
          <Text
            style={[styles.secondaryBtnText, { color: colors.foreground }]}
          >
            {t(language, "home.cases")}
          </Text>
        </Pressable>

        <View
          style={[
            styles.tertiaryRow,
            { borderColor: colors.border, borderRadius: colors.radius },
          ]}
        >
          <Pressable
            onPress={() => router.push("/guide")}
            style={({ pressed }) => [
              styles.tertiaryBtn,
              {
                flex: 1,
                borderRightWidth: 1,
                borderRightColor: colors.border,
                opacity: pressed ? 0.6 : 1,
              },
            ]}
          >
            <Feather
              name="book"
              size={14}
              color={colors.mutedForeground}
            />
            <Text
              style={[styles.tertiaryBtnText, { color: colors.mutedForeground }]}
            >
              {t(language, "home.guide")}
            </Text>
          </Pressable>
          <Pressable
            onPress={() => router.push("/history")}
            style={({ pressed }) => [
              styles.tertiaryBtn,
              { flex: 1, opacity: pressed ? 0.6 : 1 },
            ]}
          >
            <Feather
              name="bookmark"
              size={14}
              color={colors.mutedForeground}
            />
            <Text
              style={[styles.tertiaryBtnText, { color: colors.mutedForeground }]}
            >
              {t(language, "home.history")}
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  headerBrand: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  headerIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 17,
    fontFamily: "Inter_700Bold",
    fontWeight: "700",
    letterSpacing: -0.3,
  },
  menuBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  dropdown: {
    position: "absolute",
    borderRadius: 10,
    borderWidth: 1,
    minWidth: 180,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    overflow: "hidden",
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 13,
  },
  dropdownItemText: {
    fontSize: 15,
    fontFamily: "Inter_500Medium",
  },
  dropdownDivider: { height: 1 },
  hero: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
    paddingHorizontal: 8,
  },
  title: {
    fontSize: 26,
    fontFamily: "Inter_700Bold",
    fontWeight: "700",
    letterSpacing: -0.5,
    textAlign: "center",
  },
  intro: {
    fontSize: 15,
    lineHeight: 23,
    fontFamily: "Inter_400Regular",
    maxWidth: 340,
  },
  actions: { gap: 10 },
  secondaryBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 15,
    borderWidth: 1,
  },
  secondaryBtnText: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
    fontWeight: "600",
  },
  tertiaryRow: {
    flexDirection: "row",
    borderWidth: 1,
    overflow: "hidden",
  },
  tertiaryBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 13,
  },
  tertiaryBtnText: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
  },
});
