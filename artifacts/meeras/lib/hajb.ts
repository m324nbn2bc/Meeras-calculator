import { HeirId } from "@/lib/inheritance";

export interface HajbRule {
  blockedHeirId: HeirId;
  blockedByIds: HeirId[];
  noteKey: string;
}

export interface HajbGroup {
  groupKey: string;
  rules: HajbRule[];
}

export const HAJB_GROUPS: HajbGroup[] = [
  {
    groupKey: "hajb.group.ascendants",
    rules: [
      {
        blockedHeirId: "paternalGrandfather",
        blockedByIds: ["father"],
        noteKey: "hajb.note.pgf",
      },
      {
        blockedHeirId: "maternalGrandmother",
        blockedByIds: ["mother"],
        noteKey: "hajb.note.mGranny",
      },
      {
        blockedHeirId: "paternalGrandmother",
        blockedByIds: ["mother", "father", "paternalGrandfather"],
        noteKey: "hajb.note.pGranny",
      },
    ],
  },
  {
    groupKey: "hajb.group.descendants",
    rules: [
      {
        blockedHeirId: "grandson",
        blockedByIds: ["son"],
        noteKey: "hajb.note.grandson",
      },
      {
        blockedHeirId: "granddaughter",
        blockedByIds: ["son"],
        noteKey: "hajb.note.granddaughter",
      },
    ],
  },
  {
    groupKey: "hajb.group.siblings",
    rules: [
      {
        blockedHeirId: "fullBrother",
        blockedByIds: ["son", "grandson", "father", "paternalGrandfather"],
        noteKey: "hajb.note.fullSiblings",
      },
      {
        blockedHeirId: "fullSister",
        blockedByIds: ["son", "grandson", "father", "paternalGrandfather"],
        noteKey: "hajb.note.fullSiblings",
      },
      {
        blockedHeirId: "paternalHalfBrother",
        blockedByIds: ["son", "grandson", "father", "paternalGrandfather", "fullBrother"],
        noteKey: "hajb.note.consSiblings",
      },
      {
        blockedHeirId: "paternalHalfSister",
        blockedByIds: ["son", "grandson", "father", "paternalGrandfather", "fullBrother"],
        noteKey: "hajb.note.consSiblings",
      },
      {
        blockedHeirId: "maternalHalfSibling",
        blockedByIds: ["son", "daughter", "grandson", "granddaughter", "father", "paternalGrandfather"],
        noteKey: "hajb.note.uterineSibs",
      },
    ],
  },
  {
    groupKey: "hajb.group.asabah",
    rules: [
      {
        blockedHeirId: "fullBrothersSon",
        blockedByIds: ["fullBrother", "paternalHalfBrother"],
        noteKey: "hajb.note.asabahChain",
      },
      {
        blockedHeirId: "paternalHalfBrothersSon",
        blockedByIds: ["fullBrother", "paternalHalfBrother", "fullBrothersSon"],
        noteKey: "hajb.note.asabahChain",
      },
      {
        blockedHeirId: "fullPaternalUncle",
        blockedByIds: ["fullBrothersSon", "paternalHalfBrothersSon"],
        noteKey: "hajb.note.asabahChain",
      },
      {
        blockedHeirId: "paternalHalfPaternalUncle",
        blockedByIds: ["fullPaternalUncle"],
        noteKey: "hajb.note.asabahChain",
      },
      {
        blockedHeirId: "fullPaternalUnclesSon",
        blockedByIds: ["fullPaternalUncle", "paternalHalfPaternalUncle"],
        noteKey: "hajb.note.asabahChain",
      },
      {
        blockedHeirId: "paternalHalfPaternalUnclesSon",
        blockedByIds: ["fullPaternalUnclesSon"],
        noteKey: "hajb.note.asabahChain",
      },
    ],
  },
];
