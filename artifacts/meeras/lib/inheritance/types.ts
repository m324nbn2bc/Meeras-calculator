import { MadhabId } from "@/lib/i18n";

export type HeirId =
  | "husband"
  | "wife"
  | "father"
  | "mother"
  | "son"
  | "daughter"
  | "fullBrother"
  | "fullSister"
  | "paternalHalfBrother"
  | "paternalHalfSister"
  | "maternalHalfSibling";

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

export type ShareKind = "fixed" | "asabah" | "radd" | "umariyyatan";

export interface ShareResult {
  heir: HeirId;
  count: number;
  fraction: Fraction;
  amount: number;
  perPerson: number;
  kind: ShareKind;
}

export interface CalculationOutput {
  estate: number;
  shares: ShareResult[];
  awl?: { from: number; to: number };
  radd?: boolean;
  residue?: number;
}
