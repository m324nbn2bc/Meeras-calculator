import { MadhabId } from "@/lib/i18n";

export type HeirId =
  // Spouse
  | "husband"
  | "wife"
  // Ascendants
  | "father"
  | "mother"
  | "paternalGrandfather"
  | "maternalGrandmother"
  | "paternalGrandmother"
  // Descendants
  | "son"
  | "daughter"
  | "grandson"
  | "granddaughter"
  // Siblings
  | "fullBrother"
  | "fullSister"
  | "paternalHalfBrother"
  | "paternalHalfSister"
  | "maternalHalfSibling"
  // Extended Asabah
  | "fullBrothersSon"
  | "paternalHalfBrothersSon"
  | "fullPaternalUncle"
  | "paternalHalfPaternalUncle"
  | "fullPaternalUnclesSon"
  | "paternalHalfPaternalUnclesSon";

export const ALL_HEIRS: HeirId[] = [
  "husband",
  "wife",
  "father",
  "mother",
  "paternalGrandfather",
  "maternalGrandmother",
  "paternalGrandmother",
  "son",
  "daughter",
  "grandson",
  "granddaughter",
  "fullBrother",
  "fullSister",
  "paternalHalfBrother",
  "paternalHalfSister",
  "maternalHalfSibling",
  "fullBrothersSon",
  "paternalHalfBrothersSon",
  "fullPaternalUncle",
  "paternalHalfPaternalUncle",
  "fullPaternalUnclesSon",
  "paternalHalfPaternalUnclesSon",
];

export type DeceasedGender = "male" | "female";

export type HeirCounts = Partial<Record<HeirId, number>>;

export interface CalculationInput {
  estate: number;
  deceasedGender: DeceasedGender;
  heirs: HeirCounts;
  madhab: MadhabId;
}

export interface Fraction {
  num: number;
  den: number;
}

export type ShareKind = "fixed" | "asabah" | "radd" | "umariyyatan" | "asabahMaaGhayrihi";

export interface ShareResult {
  heir: HeirId;
  count: number;
  fraction: Fraction;
  amount: number;
  perPerson: number;
  kind: ShareKind;
  reasonKey?: string;
}

export interface ExclusionResult {
  heir: HeirId;
  count: number;
  reasonKey: string;
}

export interface CalculationOutput {
  estate: number;
  shares: ShareResult[];
  exclusions: ExclusionResult[];
  awl?: { from: number; to: number };
  radd?: boolean;
  residue?: number;
}
