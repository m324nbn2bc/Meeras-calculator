import { DeceasedGender, HeirCounts, HeirId } from "@/lib/inheritance";

export type AnswerValue = number | boolean | DeceasedGender;

export interface WizardState {
  estate: number;
  deceasedGender: DeceasedGender;
  hasSpouse: boolean;
  heirs: HeirCounts;
}

export type StepKind =
  | "estate"
  | "gender"
  | "yesno"
  | "count";

export interface Step {
  id: string;
  kind: StepKind;
  titleKey: string;
  helpKey?: string;
  // For count steps:
  heirId?: HeirId;
  min?: number;
  max?: number;
  // For yes/no steps that don't directly set a heir count
  field?: "hasSpouse";
  // Whether to show this step given current state
  visible: (s: WizardState) => boolean;
  // Apply user answer to state
  apply: (s: WizardState, value: AnswerValue) => WizardState;
  // Read current value to seed the input
  read: (s: WizardState) => AnswerValue;
}

const setHeir = (s: WizardState, h: HeirId, n: number): WizardState => ({
  ...s,
  heirs: { ...s.heirs, [h]: n },
});

export const initialState: WizardState = {
  estate: 0,
  deceasedGender: "male",
  hasSpouse: false,
  heirs: {},
};

export const steps: Step[] = [
  {
    id: "estate",
    kind: "estate",
    titleKey: "q.estate.title",
    helpKey: "q.estate.help",
    visible: () => true,
    apply: (s, v) => ({ ...s, estate: Number(v) || 0 }),
    read: (s) => s.estate,
  },
  {
    id: "gender",
    kind: "gender",
    titleKey: "q.gender.title",
    helpKey: "q.gender.help",
    visible: () => true,
    apply: (s, v) => {
      const next = v as DeceasedGender;
      // Reset spouse counts on gender change
      const heirs = { ...s.heirs };
      if (next === "male") {
        delete heirs.husband;
      } else {
        delete heirs.wife;
      }
      return { ...s, deceasedGender: next, heirs };
    },
    read: (s) => s.deceasedGender,
  },
  {
    id: "spouse",
    kind: "yesno",
    titleKey: "q.spouse.title.male", // overridden in UI based on gender
    helpKey: "q.spouse.help",
    field: "hasSpouse",
    visible: () => true,
    apply: (s, v) => {
      const yes = !!v;
      const heirs = { ...s.heirs };
      if (!yes) {
        delete heirs.husband;
        delete heirs.wife;
      } else if (s.deceasedGender === "female") {
        heirs.husband = 1;
      }
      return { ...s, hasSpouse: yes, heirs };
    },
    read: (s) => s.hasSpouse,
  },
  {
    id: "wives",
    kind: "count",
    titleKey: "q.wives.title",
    helpKey: "q.wives.help",
    heirId: "wife",
    min: 1,
    max: 4,
    visible: (s) => s.hasSpouse && s.deceasedGender === "male",
    apply: (s, v) => setHeir(s, "wife", Number(v)),
    read: (s) => s.heirs.wife ?? 1,
  },
  {
    id: "father",
    kind: "yesno",
    titleKey: "q.father.title",
    helpKey: "q.father.help",
    visible: () => true,
    apply: (s, v) => setHeir(s, "father", v ? 1 : 0),
    read: (s) => (s.heirs.father ?? 0) > 0,
  },
  {
    id: "mother",
    kind: "yesno",
    titleKey: "q.mother.title",
    helpKey: "q.mother.help",
    visible: () => true,
    apply: (s, v) => setHeir(s, "mother", v ? 1 : 0),
    read: (s) => (s.heirs.mother ?? 0) > 0,
  },
  {
    id: "sons",
    kind: "count",
    titleKey: "q.sons.title",
    helpKey: "q.children.help",
    heirId: "son",
    min: 0,
    max: 20,
    visible: () => true,
    apply: (s, v) => setHeir(s, "son", Number(v)),
    read: (s) => s.heirs.son ?? 0,
  },
  {
    id: "daughters",
    kind: "count",
    titleKey: "q.daughters.title",
    helpKey: "q.children.help",
    heirId: "daughter",
    min: 0,
    max: 20,
    visible: () => true,
    apply: (s, v) => setHeir(s, "daughter", Number(v)),
    read: (s) => s.heirs.daughter ?? 0,
  },
  {
    id: "fullBrothers",
    kind: "count",
    titleKey: "q.fullBrothers.title",
    helpKey: "q.fullSiblings.help",
    heirId: "fullBrother",
    min: 0,
    max: 20,
    visible: (s) =>
      (s.heirs.son ?? 0) === 0 &&
      (s.heirs.daughter ?? 0) === 0 &&
      (s.heirs.father ?? 0) === 0,
    apply: (s, v) => setHeir(s, "fullBrother", Number(v)),
    read: (s) => s.heirs.fullBrother ?? 0,
  },
  {
    id: "fullSisters",
    kind: "count",
    titleKey: "q.fullSisters.title",
    helpKey: "q.fullSiblings.help",
    heirId: "fullSister",
    min: 0,
    max: 20,
    visible: (s) =>
      (s.heirs.son ?? 0) === 0 && (s.heirs.father ?? 0) === 0,
    apply: (s, v) => setHeir(s, "fullSister", Number(v)),
    read: (s) => s.heirs.fullSister ?? 0,
  },
  {
    id: "paternalHalfBrothers",
    kind: "count",
    titleKey: "q.paternalHalfBrothers.title",
    helpKey: "q.paternalHalf.help",
    heirId: "paternalHalfBrother",
    min: 0,
    max: 20,
    visible: (s) =>
      (s.heirs.son ?? 0) === 0 &&
      (s.heirs.father ?? 0) === 0 &&
      (s.heirs.fullBrother ?? 0) === 0,
    apply: (s, v) => setHeir(s, "paternalHalfBrother", Number(v)),
    read: (s) => s.heirs.paternalHalfBrother ?? 0,
  },
  {
    id: "paternalHalfSisters",
    kind: "count",
    titleKey: "q.paternalHalfSisters.title",
    helpKey: "q.paternalHalf.help",
    heirId: "paternalHalfSister",
    min: 0,
    max: 20,
    visible: (s) =>
      (s.heirs.son ?? 0) === 0 &&
      (s.heirs.father ?? 0) === 0 &&
      (s.heirs.fullBrother ?? 0) === 0 &&
      (s.heirs.fullSister ?? 0) < 2,
    apply: (s, v) => setHeir(s, "paternalHalfSister", Number(v)),
    read: (s) => s.heirs.paternalHalfSister ?? 0,
  },
  {
    id: "maternalHalf",
    kind: "count",
    titleKey: "q.maternalHalf.title",
    helpKey: "q.maternalHalf.help",
    heirId: "maternalHalfSibling",
    min: 0,
    max: 20,
    visible: (s) =>
      (s.heirs.son ?? 0) === 0 &&
      (s.heirs.daughter ?? 0) === 0 &&
      (s.heirs.father ?? 0) === 0,
    apply: (s, v) => setHeir(s, "maternalHalfSibling", Number(v)),
    read: (s) => s.heirs.maternalHalfSibling ?? 0,
  },
];

export function visibleSteps(state: WizardState): Step[] {
  return steps.filter((s) => s.visible(state));
}
