import { CalculationInput } from "@/lib/inheritance";

export type CaseCategory =
  | "basic"
  | "awl"
  | "radd"
  | "umariyyatain"
  | "asabah"
  | "grandmother"
  | "famous";

export interface ClassicalCase {
  id: string;
  nameKey: string;
  descKey: string;
  noteKey: string;
  category: CaseCategory;
  input: CalculationInput;
}

export const CASE_CATEGORIES: CaseCategory[] = [
  "famous",
  "basic",
  "umariyyatain",
  "awl",
  "radd",
  "asabah",
  "grandmother",
];

// ─────────────────────────────────────────────────────────────────────────────
// Helper to build an input concisely
// ─────────────────────────────────────────────────────────────────────────────
const mk = (
  heirs: CalculationInput["heirs"],
  deceasedGender: "male" | "female" = "male",
  estate = 24,
): CalculationInput => ({
  estate,
  deceasedGender,
  heirs,
  madhab: "hanafi",
});

// ─────────────────────────────────────────────────────────────────────────────
// The 25 classical cases
// ─────────────────────────────────────────────────────────────────────────────
export const CLASSICAL_CASES: ClassicalCase[] = [
  // ══ FAMOUS ══
  {
    id: "mimbariyyah",
    nameKey: "case.mimbariyyah.name",
    descKey: "case.mimbariyyah.desc",
    noteKey: "case.mimbariyyah.note",
    category: "famous",
    input: mk({ wife: 1, daughter: 2, father: 1, mother: 1 }),
  },
  {
    id: "mushtarakah",
    nameKey: "case.mushtarakah.name",
    descKey: "case.mushtarakah.desc",
    noteKey: "case.mushtarakah.note",
    category: "famous",
    input: mk(
      { husband: 1, mother: 1, fullBrother: 2, maternalHalfSibling: 1 },
      "female",
    ),
  },
  {
    id: "umariyyatain_h",
    nameKey: "case.umariyyatainH.name",
    descKey: "case.umariyyatainH.desc",
    noteKey: "case.umariyyatainH.note",
    category: "umariyyatain",
    input: mk({ husband: 1, father: 1, mother: 1 }, "female"),
  },
  {
    id: "umariyyatain_w",
    nameKey: "case.umariyyatainW.name",
    descKey: "case.umariyyatainW.desc",
    noteKey: "case.umariyyatainW.note",
    category: "umariyyatain",
    input: mk({ wife: 1, father: 1, mother: 1 }),
  },
  {
    id: "akdariyyah_note",
    nameKey: "case.akdariyyah.name",
    descKey: "case.akdariyyah.desc",
    noteKey: "case.akdariyyah.note",
    category: "famous",
    input: mk({ husband: 1, mother: 1, paternalGrandfather: 1, fullSister: 1 }, "female"),
  },

  // ══ BASIC ══
  {
    id: "son_daughter",
    nameKey: "case.sonDaughter.name",
    descKey: "case.sonDaughter.desc",
    noteKey: "case.sonDaughter.note",
    category: "basic",
    input: mk({ wife: 1, son: 1, daughter: 1 }),
  },
  {
    id: "father_only",
    nameKey: "case.fatherOnly.name",
    descKey: "case.fatherOnly.desc",
    noteKey: "case.fatherOnly.note",
    category: "basic",
    input: mk({ father: 1 }),
  },
  {
    id: "two_daughters_parents",
    nameKey: "case.twoDaughtersParents.name",
    descKey: "case.twoDaughtersParents.desc",
    noteKey: "case.twoDaughtersParents.note",
    category: "basic",
    input: mk({ daughter: 2, father: 1, mother: 1 }),
  },
  {
    id: "mother_only",
    nameKey: "case.motherOnly.name",
    descKey: "case.motherOnly.desc",
    noteKey: "case.motherOnly.note",
    category: "basic",
    input: mk({ mother: 1 }),
  },
  {
    id: "four_wives",
    nameKey: "case.fourWives.name",
    descKey: "case.fourWives.desc",
    noteKey: "case.fourWives.note",
    category: "basic",
    input: mk({ wife: 4, son: 1 }),
  },
  {
    id: "siblings_only",
    nameKey: "case.siblingsOnly.name",
    descKey: "case.siblingsOnly.desc",
    noteKey: "case.siblingsOnly.note",
    category: "basic",
    input: mk({ fullBrother: 1, fullSister: 2 }),
  },

  // ══ 'AWL ══
  {
    id: "awl_h_2d_m",
    nameKey: "case.awlH2DM.name",
    descKey: "case.awlH2DM.desc",
    noteKey: "case.awlH2DM.note",
    category: "awl",
    input: mk({ husband: 1, daughter: 2, mother: 1 }, "female"),
  },
  {
    id: "awl_h_f_2s",
    nameKey: "case.awlHF2S.name",
    descKey: "case.awlHF2S.desc",
    noteKey: "case.awlHF2S.note",
    category: "awl",
    input: mk({ husband: 1, fullSister: 2, mother: 1 }, "female"),
  },
  {
    id: "awl_2d_f_m",
    nameKey: "case.awlH2DFM.name",
    descKey: "case.awlH2DFM.desc",
    noteKey: "case.awlH2DFM.note",
    category: "awl",
    input: mk({ wife: 1, daughter: 2, father: 1, mother: 1 }),
  },

  // ══ RADD ══
  {
    id: "radd_daughter_mother",
    nameKey: "case.raddDM.name",
    descKey: "case.raddDM.desc",
    noteKey: "case.raddDM.note",
    category: "radd",
    input: mk({ daughter: 1, mother: 1 }),
  },
  {
    id: "radd_2d_mother",
    nameKey: "case.radd2DM.name",
    descKey: "case.radd2DM.desc",
    noteKey: "case.radd2DM.note",
    category: "radd",
    input: mk({ daughter: 2, mother: 1 }),
  },
  {
    id: "radd_husband_daughter",
    nameKey: "case.raddHD.name",
    descKey: "case.raddHD.desc",
    noteKey: "case.raddHD.note",
    category: "radd",
    input: mk({ husband: 1, daughter: 1 }, "female"),
  },
  {
    id: "radd_uterine_husband",
    nameKey: "case.raddUterine.name",
    descKey: "case.raddUterine.desc",
    noteKey: "case.raddUterine.note",
    category: "radd",
    input: mk({ husband: 1, maternalHalfSibling: 2 }, "female"),
  },

  // ══ ASABAH ══
  {
    id: "grandson_asabah",
    nameKey: "case.grandsonAsabah.name",
    descKey: "case.grandsonAsabah.desc",
    noteKey: "case.grandsonAsabah.note",
    category: "asabah",
    input: mk({ wife: 1, grandson: 1, granddaughter: 1 }),
  },
  {
    id: "granddaughter_complete",
    nameKey: "case.granddaughterComplete.name",
    descKey: "case.granddaughterComplete.desc",
    noteKey: "case.granddaughterComplete.note",
    category: "asabah",
    input: mk({ daughter: 1, granddaughter: 1, mother: 1 }),
  },
  {
    id: "sister_maa_ghayrihi",
    nameKey: "case.sisterMaaGhayrihi.name",
    descKey: "case.sisterMaaGhayrihi.desc",
    noteKey: "case.sisterMaaGhayrihi.note",
    category: "asabah",
    input: mk({ daughter: 1, fullSister: 1 }),
  },
  {
    id: "cons_sister_complete",
    nameKey: "case.consSisterComplete.name",
    descKey: "case.consSisterComplete.desc",
    noteKey: "case.consSisterComplete.note",
    category: "asabah",
    input: mk({ fullSister: 1, paternalHalfSister: 1, mother: 1 }),
  },
  {
    id: "extended_uncle",
    nameKey: "case.extendedUncle.name",
    descKey: "case.extendedUncle.desc",
    noteKey: "case.extendedUncle.note",
    category: "asabah",
    input: mk({ mother: 1, fullPaternalUncle: 1 }),
  },
  {
    id: "pgf_excludes_siblings",
    nameKey: "case.pgfExcludesSiblings.name",
    descKey: "case.pgfExcludesSiblings.desc",
    noteKey: "case.pgfExcludesSiblings.note",
    category: "asabah",
    input: mk({ wife: 1, paternalGrandfather: 1, fullBrother: 2, fullSister: 1 }),
  },

  // ══ GRANDMOTHER ══
  {
    id: "two_grannies",
    nameKey: "case.twoGrannies.name",
    descKey: "case.twoGrannies.desc",
    noteKey: "case.twoGrannies.note",
    category: "grandmother",
    input: mk({
      daughter: 1,
      maternalGrandmother: 1,
      paternalGrandmother: 1,
      fullPaternalUncle: 1,
    }),
  },
  {
    id: "pgf_blocks_pgranny",
    nameKey: "case.pgfBlocksPGranny.name",
    descKey: "case.pgfBlocksPGranny.desc",
    noteKey: "case.pgfBlocksPGranny.note",
    category: "grandmother",
    input: mk({
      daughter: 1,
      maternalGrandmother: 1,
      paternalGrandmother: 1,
      paternalGrandfather: 1,
    }),
  },
];
