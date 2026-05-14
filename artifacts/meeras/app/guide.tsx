import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useSettings } from "@/contexts/SettingsContext";
import { useColors } from "@/hooks/useColors";
import {
  GUIDE_CHAPTERS,
  type ComparisonRow,
  type LadderRung,
  type MadhabFilter,
  type MadhabNote,
  type TextBlock,
} from "@/lib/guide";
import { isRTL, t } from "@/lib/i18n";

const MADHAB_FILTERS: { id: MadhabFilter; labelKey: string }[] = [
  { id: "all", labelKey: "guide.filterAll" },
  { id: "hanafi", labelKey: "madhab.hanafi" },
  { id: "shafii", labelKey: "madhab.shafii" },
  { id: "maliki", labelKey: "madhab.maliki" },
  { id: "hanbali", labelKey: "madhab.hanbali" },
];

type Madhab = "hanafi" | "shafii" | "maliki" | "hanbali";

export default function GuideScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { language } = useSettings();
  const rtl = isRTL(language);
  const isWeb = Platform.OS === "web";

  const [activeFilter, setActiveFilter] = useState<MadhabFilter>("all");
  const [collapsedChapters, setCollapsedChapters] = useState<
    Record<string, boolean>
  >({
    foundations: true,
    zawilFurud: true,
    asabah: true,
    awlRadd: true,
    hajb: true,
    madhabMatrix: true,
    famousCases: true,
    impediments: true,
  });

  const toggleChapter = (key: string) => {
    setCollapsedChapters((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const filterNotes = (notes: MadhabNote[]) => {
    if (activeFilter === "all") return notes;
    return notes.filter((n) => n.madhabs.includes(activeFilter as Madhab));
  };

  const renderMadhabNotes = (notes: MadhabNote[]) => {
    const visible = filterNotes(notes);
    if (visible.length === 0) return null;
    const isAll = activeFilter === "all";
    return (
      <>
        <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>
          {t(language, "guide.label.madhabNotes")}
        </Text>
        {visible.map((note, i) => (
          <View
            key={i}
            style={[
              styles.noteRow,
              isAll
                ? { backgroundColor: "#F59E0B0C", borderLeftColor: "#F59E0B" }
                : { backgroundColor: colors.secondary, borderLeftColor: colors.accent },
            ]}
          >
            {isAll && (
              <Text style={[styles.noteMadhabs, { color: "#F59E0B" }]}>
                {note.madhabs.map((m) => t(language, `madhab.${m}`)).join(" · ")}
              </Text>
            )}
            <Text
              style={[
                styles.noteText,
                {
                  color: isAll ? colors.foreground : colors.mutedForeground,
                  textAlign: rtl ? "right" : "left",
                },
              ]}
            >
              {t(language, note.noteKey)}
            </Text>
          </View>
        ))}
      </>
    );
  };

  const renderNarrativeBlock = (block: TextBlock, i: number) => {
    const hasDiff = block.madhabNotes && block.madhabNotes.length > 0;
    return (
      <View
        key={i}
        style={[
          styles.narrativeBlock,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
            borderRadius: colors.radius,
          },
        ]}
      >
        <Text
          style={[styles.narrativeTitle, { color: colors.foreground }]}
        >
          {t(language, block.titleKey)}
        </Text>
        <Text
          style={[
            styles.narrativeBody,
            { color: colors.mutedForeground, textAlign: rtl ? "right" : "left" },
          ]}
        >
          {t(language, block.bodyKey)}
        </Text>
        {block.exampleKey && (
          <View
            style={[
              styles.exampleBox,
              { backgroundColor: colors.primary + "0A", borderColor: colors.primary + "25" },
            ]}
          >
            <Text style={[styles.exampleLabel, { color: colors.primary }]}>
              {t(language, "guide.label.example")}
            </Text>
            <Text
              style={[
                styles.exampleText,
                { color: colors.foreground, textAlign: rtl ? "right" : "left" },
              ]}
            >
              {t(language, block.exampleKey)}
            </Text>
          </View>
        )}
        {hasDiff && (
          <>
            <View style={[styles.separator, { borderTopColor: colors.border }]} />
            {renderMadhabNotes(block.madhabNotes!)}
          </>
        )}
      </View>
    );
  };

  const renderLadderRung = (rung: LadderRung) => {
    const hasDiff = rung.madhabNotes && rung.madhabNotes.length > 0;
    const isAll = activeFilter === "all";
    return (
      <View key={rung.priority} style={styles.rungWrapper}>
        {/* Connector line */}
        {rung.priority > 1 && (
          <View style={[styles.connectorLine, { backgroundColor: colors.border }]} />
        )}
        <View
          style={[
            styles.rungCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              borderRadius: colors.radius,
            },
          ]}
        >
          {/* Rung header */}
          <View style={styles.rungHeader}>
            <View
              style={[
                styles.rungNumber,
                { backgroundColor: colors.primary + "18", borderColor: colors.primary + "35" },
              ]}
            >
              <Text style={[styles.rungNumberText, { color: colors.primary }]}>
                {rung.priority}
              </Text>
            </View>
            <Text style={[styles.rungLabel, { color: colors.foreground }]}>
              {t(language, rung.labelKey)}
            </Text>
          </View>

          {/* Heir chips */}
          <View style={styles.rungHeirs}>
            {rung.heirIds.map((hid) => (
              <View
                key={hid}
                style={[
                  styles.heirChip,
                  {
                    backgroundColor: colors.accent + "12",
                    borderColor: colors.accent + "30",
                  },
                ]}
              >
                <Text style={[styles.heirChipText, { color: colors.accent }]}>
                  {t(language, `heir.${hid}`)}
                </Text>
              </View>
            ))}
          </View>

          {/* Note */}
          <Text
            style={[
              styles.rungNote,
              { color: colors.mutedForeground, textAlign: rtl ? "right" : "left" },
            ]}
          >
            {t(language, rung.noteKey)}
          </Text>

          {/* Madhab notes */}
          {hasDiff && (
            <>
              <View style={[styles.separator, { borderTopColor: colors.border, marginHorizontal: 0 }]} />
              {filterNotes(rung.madhabNotes!).map((note, i) => (
                <View
                  key={i}
                  style={[
                    styles.noteRow,
                    { marginHorizontal: 0 },
                    isAll
                      ? { backgroundColor: "#F59E0B0C", borderLeftColor: "#F59E0B" }
                      : { backgroundColor: colors.secondary, borderLeftColor: colors.accent },
                  ]}
                >
                  {isAll && (
                    <Text style={[styles.noteMadhabs, { color: "#F59E0B" }]}>
                      {note.madhabs.map((m) => t(language, `madhab.${m}`)).join(" · ")}
                    </Text>
                  )}
                  <Text
                    style={[
                      styles.noteText,
                      {
                        color: isAll ? colors.foreground : colors.mutedForeground,
                        textAlign: rtl ? "right" : "left",
                      },
                    ]}
                  >
                    {t(language, note.noteKey)}
                  </Text>
                </View>
              ))}
            </>
          )}
        </View>
      </View>
    );
  };

  const renderComparisonRow = (row: ComparisonRow, i: number) => {
    const schools: { id: Madhab; key: string }[] = [
      { id: "hanafi", key: row.hanafiKey },
      { id: "shafii", key: row.shafiiKey },
      { id: "maliki", key: row.malikiKey },
      { id: "hanbali", key: row.hanbaliKey },
    ];
    const visibleSchools =
      activeFilter === "all"
        ? schools
        : schools.filter((school) => school.id === activeFilter);

    return (
      <View
        key={`${row.topicKey}-${i}`}
        style={[
          styles.matrixCard,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
            borderRadius: colors.radius,
          },
        ]}
      >
        <Text style={[styles.matrixTopic, { color: colors.foreground }]}>
          {t(language, row.topicKey)}
        </Text>
        <View style={styles.matrixSchools}>
          {visibleSchools.map((school) => (
            <View
              key={school.id}
              style={[
                styles.matrixCell,
                {
                  backgroundColor: colors.secondary,
                  borderColor: colors.border,
                  borderRadius: colors.radius,
                },
              ]}
            >
              <Text style={[styles.matrixSchool, { color: colors.accent }]}>
                {t(language, `madhab.${school.id}`)}
              </Text>
              <Text
                style={[
                  styles.matrixText,
                  {
                    color: colors.foreground,
                    textAlign: rtl ? "right" : "left",
                  },
                ]}
              >
                {t(language, school.key)}
              </Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background, direction: rtl ? "rtl" : "ltr" },
      ]}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          {
            paddingTop: isWeb ? Math.max(insets.top, 67) + 8 : 16,
            paddingBottom: (isWeb ? Math.max(insets.bottom, 34) : insets.bottom) + 40,
          },
        ]}
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[1]}
      >
        {/* ── Hero ── */}
        <View style={styles.hero}>
          <Text style={[styles.title, { color: colors.foreground }]}>
            {t(language, "guide.title")}
          </Text>
          <Text
            style={[
              styles.subtitle,
              { color: colors.mutedForeground, textAlign: rtl ? "right" : "left" },
            ]}
          >
            {t(language, "guide.subtitle")}
          </Text>
        </View>

        {/* ── Sticky Filter Bar ── */}
        <View
          style={[
            styles.filterBarWrapper,
            { backgroundColor: colors.background, borderBottomColor: colors.border },
          ]}
        >
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterBar}
          >
            {MADHAB_FILTERS.map((f) => {
              const active = activeFilter === f.id;
              return (
                <Pressable
                  key={f.id}
                  onPress={() => setActiveFilter(f.id)}
                  style={[
                    styles.filterChip,
                    {
                      backgroundColor: active ? colors.accent : colors.card,
                      borderColor: active ? colors.accent : colors.border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      { color: active ? "#fff" : colors.foreground },
                    ]}
                  >
                    {t(language, f.labelKey)}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* ── Chapters ── */}
        {GUIDE_CHAPTERS.map((chapter) => {
          const collapsed = collapsedChapters[chapter.key] ?? true;
          const chapterType = chapter.type ?? "heirs";

          return (
            <View key={chapter.key} style={styles.chapterBlock}>
              {/* Chapter header */}
              <Pressable
                onPress={() => toggleChapter(chapter.key)}
                style={({ pressed }) => [
                  styles.chapterHeader,
                  {
                    backgroundColor: pressed ? colors.secondary : colors.card,
                    borderColor: colors.border,
                    borderRadius: colors.radius,
                  },
                ]}
              >
                <View style={styles.chapterHeaderLeft}>
                  <Text style={[styles.chapterTitle, { color: colors.foreground }]}>
                    {t(language, chapter.titleKey)}
                  </Text>
                  <Text
                    style={[
                      styles.chapterDesc,
                      { color: colors.mutedForeground, textAlign: rtl ? "right" : "left" },
                    ]}
                  >
                    {t(language, chapter.descKey)}
                  </Text>
                </View>
                <Feather
                  name={collapsed ? "chevron-right" : "chevron-down"}
                  size={18}
                  color={colors.mutedForeground}
                />
              </Pressable>

              {/* ── HEIRS chapter ── */}
              {!collapsed && chapterType === "heirs" &&
                chapter.entries!.map((entry, entryIndex) => {
                  const visibleNotes = filterNotes(entry.madhabNotes);
                  const showDiffBadge = entry.hasMadhabDiff && activeFilter === "all";
                  const hasDiffBorder = showDiffBadge;

                  return (
                    <View
                      key={entry.heirId}
                      style={[
                        styles.card,
                        {
                          backgroundColor: colors.card,
                          borderColor: hasDiffBorder
                            ? colors.accent + "55"
                            : colors.border,
                          borderRadius: colors.radius,
                        },
                      ]}
                    >
                      {/* Card header */}
                      <View style={styles.cardHeader}>
                        {/* Number badge — left side, prominent */}
                        <View
                          style={[
                            styles.numberBadge,
                            {
                              backgroundColor: colors.primary + "15",
                              borderColor: colors.primary + "35",
                            },
                          ]}
                        >
                          <Text style={[styles.numberBadgeText, { color: colors.primary }]}>
                            {entryIndex + 1}
                          </Text>
                        </View>
                        <View style={styles.cardHeaderMiddle}>
                          <Text style={[styles.heirName, { color: colors.foreground }]}>
                            {t(language, `heir.${entry.heirId}`)}
                          </Text>
                          <Text style={[styles.arabicName, { color: colors.mutedForeground }]}>
                            {entry.arabicName}
                          </Text>
                        </View>
                        {showDiffBadge && (
                          <View
                            style={[
                              styles.diffBadge,
                              { backgroundColor: "#F59E0B18", borderColor: "#F59E0B55" },
                            ]}
                          >
                            <Feather name="alert-triangle" size={9} color="#F59E0B" />
                            <Text style={[styles.diffBadgeText, { color: "#F59E0B" }]}>
                              {t(language, "guide.madhabDiffers")}
                            </Text>
                          </View>
                        )}
                      </View>

                      {/* Separator */}
                      <View style={[styles.separator, { borderTopColor: colors.border }]} />

                      {/* Share scenarios */}
                      <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>
                        {t(language, "guide.label.shares")}
                      </Text>
                      {entry.scenarios.map((sc, i) => (
                        <View key={i} style={styles.scenarioRow}>
                          <View
                            style={[
                              styles.fractionBadge,
                              {
                                backgroundColor: colors.primary + "12",
                                borderColor: colors.primary + "30",
                              },
                            ]}
                          >
                            <Text style={[styles.fractionText, { color: colors.primary }]}>
                              {t(language, sc.fractionKey)}
                            </Text>
                          </View>
                          <Text
                            style={[
                              styles.condText,
                              { color: colors.foreground, textAlign: rtl ? "right" : "left" },
                            ]}
                          >
                            {t(language, sc.condKey)}
                          </Text>
                        </View>
                      ))}

                      {/* Blockers */}
                      {entry.blockerIds.length > 0 && (
                        <>
                          <View style={[styles.separator, { borderTopColor: colors.border }]} />
                          <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>
                            {t(language, "guide.label.blockedBy")}
                          </Text>
                          <View style={styles.pillsRow}>
                            {entry.blockerIds.map((bid) => (
                              <View
                                key={bid}
                                style={[
                                  styles.pill,
                                  {
                                    backgroundColor: colors.accent + "12",
                                    borderColor: colors.accent + "35",
                                  },
                                ]}
                              >
                                <Text style={[styles.pillText, { color: colors.accent }]}>
                                  {t(language, `heir.${bid}`)}
                                </Text>
                              </View>
                            ))}
                          </View>
                        </>
                      )}

                      {/* Madhab diff notes */}
                      {visibleNotes.length > 0 && (
                        <>
                          <View style={[styles.separator, { borderTopColor: colors.border }]} />
                          {renderMadhabNotes(entry.madhabNotes)}
                        </>
                      )}
                    </View>
                  );
                })}

              {/* ── NARRATIVE chapter ── */}
              {!collapsed && chapterType === "narrative" && (
                <View style={styles.narrativeContainer}>
                  {chapter.blocks!.map((block, i) =>
                    renderNarrativeBlock(block, i)
                  )}
                </View>
              )}

              {/* ── LADDER chapter ── */}
              {!collapsed && chapterType === "ladder" && (
                <View style={styles.ladderContainer}>
                  <Text
                    style={[
                      styles.ladderIntro,
                      { color: colors.mutedForeground, textAlign: rtl ? "right" : "left" },
                    ]}
                  >
                    {t(language, "guide.hajb.intro")}
                  </Text>
                  {chapter.rungs!.map((rung) => renderLadderRung(rung))}
                </View>
              )}

              {/* ── COMPARISON chapter ── */}
              {!collapsed && chapterType === "comparison" && (
                <View style={styles.matrixContainer}>
                  {chapter.rows!.map((row, i) => renderComparisonRow(row, i))}
                </View>
              )}
            </View>
          );
        })}

        {/* ── Footer ── */}
        <View
          style={[
            styles.footerBox,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              borderRadius: colors.radius,
            },
          ]}
        >
          <Feather name="info" size={14} color={colors.mutedForeground} style={{ marginTop: 1 }} />
          <Text
            style={[
              styles.footerText,
              { color: colors.mutedForeground, textAlign: rtl ? "right" : "left" },
            ]}
          >
            {t(language, "guide.footer")}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingHorizontal: 20 },
  hero: { marginBottom: 4 },
  title: {
    fontSize: 32,
    fontFamily: "Inter_700Bold",
    fontWeight: "700",
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    lineHeight: 21,
    marginBottom: 4,
  },
  filterBarWrapper: {
    borderBottomWidth: 1,
    paddingVertical: 10,
    marginHorizontal: -20,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  filterBar: { flexDirection: "row", gap: 8, paddingRight: 4 },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
  },
  filterChipText: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
    fontWeight: "600",
  },
  chapterBlock: { marginBottom: 20 },
  chapterHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderWidth: 1,
    marginBottom: 12,
    gap: 12,
  },
  chapterHeaderLeft: { flex: 1, gap: 4 },
  chapterTitle: {
    fontSize: 17,
    fontFamily: "Inter_700Bold",
    fontWeight: "700",
    letterSpacing: -0.2,
  },
  chapterDesc: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    lineHeight: 19,
  },
  card: {
    borderWidth: 1,
    marginBottom: 12,
    overflow: "hidden",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    gap: 12,
  },
  cardHeaderMiddle: { flex: 1, gap: 2 },
  heirName: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
    fontWeight: "600",
  },
  arabicName: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    fontStyle: "italic",
  },
  numberBadge: {
    width: 36,
    height: 36,
    borderRadius: 6,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  numberBadgeText: {
    fontSize: 15,
    fontFamily: "Inter_700Bold",
    fontWeight: "700",
  },
  diffBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
  },
  diffBadgeText: {
    fontSize: 9,
    fontFamily: "Inter_700Bold",
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },
  separator: { borderTopWidth: 1, marginHorizontal: 14 },
  sectionLabel: {
    fontSize: 10,
    fontFamily: "Inter_700Bold",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 8,
  },
  scenarioRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    paddingHorizontal: 14,
    paddingBottom: 8,
  },
  fractionBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    minWidth: 60,
    alignItems: "center",
  },
  fractionText: {
    fontSize: 13,
    fontFamily: "Inter_700Bold",
    fontWeight: "700",
  },
  condText: {
    flex: 1,
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    lineHeight: 19,
    paddingTop: 3,
  },
  pillsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    paddingHorizontal: 14,
    paddingBottom: 12,
  },
  pill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
  },
  pillText: {
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
    fontWeight: "600",
  },
  noteRow: {
    marginHorizontal: 14,
    marginBottom: 8,
    borderLeftWidth: 3,
    paddingLeft: 10,
    paddingVertical: 6,
    borderRadius: 2,
    gap: 3,
  },
  noteMadhabs: {
    fontSize: 11,
    fontFamily: "Inter_700Bold",
    letterSpacing: 0.3,
  },
  noteText: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    lineHeight: 19,
  },
  // Narrative chapter styles
  narrativeContainer: { gap: 12 },
  narrativeBlock: {
    borderWidth: 1,
    padding: 16,
    marginBottom: 0,
    gap: 10,
  },
  narrativeTitle: {
    fontSize: 15,
    fontFamily: "Inter_700Bold",
    fontWeight: "700",
    letterSpacing: -0.1,
  },
  narrativeBody: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    lineHeight: 20,
  },
  exampleBox: {
    borderWidth: 1,
    borderRadius: 6,
    padding: 12,
    gap: 6,
  },
  exampleLabel: {
    fontSize: 10,
    fontFamily: "Inter_700Bold",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  exampleText: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    lineHeight: 19,
  },
  // Ladder chapter styles
  ladderContainer: { gap: 0 },
  ladderIntro: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    lineHeight: 19,
    marginBottom: 16,
  },
  rungWrapper: { position: "relative" },
  connectorLine: {
    width: 2,
    height: 16,
    marginLeft: 19,
    marginBottom: 0,
  },
  rungCard: {
    borderWidth: 1,
    marginBottom: 0,
    overflow: "hidden",
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 10,
    gap: 10,
  },
  rungHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  rungNumber: {
    width: 40,
    height: 40,
    borderRadius: 6,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  rungNumberText: {
    fontSize: 17,
    fontFamily: "Inter_700Bold",
    fontWeight: "700",
  },
  rungLabel: {
    flex: 1,
    fontSize: 14,
    fontFamily: "Inter_700Bold",
    fontWeight: "700",
    letterSpacing: -0.1,
  },
  rungHeirs: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  heirChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
  },
  heirChipText: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
  },
  rungNote: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    lineHeight: 19,
  },
  // Comparison chapter styles
  matrixContainer: { gap: 12 },
  matrixCard: {
    borderWidth: 1,
    padding: 14,
    gap: 12,
  },
  matrixTopic: {
    fontSize: 15,
    fontFamily: "Inter_700Bold",
    fontWeight: "700",
  },
  matrixSchools: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  matrixCell: {
    borderWidth: 1,
    padding: 10,
    gap: 5,
    flexBasis: "48%",
    flexGrow: 1,
  },
  matrixSchool: {
    fontSize: 11,
    fontFamily: "Inter_700Bold",
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },
  matrixText: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    lineHeight: 18,
  },
  footerBox: {
    flexDirection: "row",
    gap: 10,
    padding: 16,
    borderWidth: 1,
    marginTop: 8,
    alignItems: "flex-start",
  },
  footerText: {
    flex: 1,
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    lineHeight: 19,
  },
});
