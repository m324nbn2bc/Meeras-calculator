import { DeceasedGender, HeirCounts, HeirId } from "@/lib/inheritance";

export type AnswerValue = number | boolean | DeceasedGender;

export interface WizardState {
  estate: number;
  grossEstate?: number;
  funeralExpenses?: number;
  debtsOwed?: number;
  receivables?: number;
  wasiyyah?: number;
  deceasedGender: DeceasedGender;
  hasSpouse: boolean;
  heirs: HeirCounts;
}

export type StepKind = "estate" | "deductions" | "gender" | "yesno" | "count";

export interface Step {
  id: string;
  kind: StepKind;
  titleKey: string;
  helpKey?: string;
  heirId?: HeirId;
  min?: number;
  max?: number;
  field?: "hasSpouse";
  visible: (s: WizardState) => boolean;
  apply: (s: WizardState, value: AnswerValue) => WizardState;
  read: (s: WizardState) => AnswerValue;
}

export function computeNetEstate(s: WizardState): number {
  const gross = s.grossEstate ?? s.estate;
  const afterDebts = Math.max(
    0,
    gross +
      (s.receivables ?? 0) -
      (s.funeralExpenses ?? 0) -
      (s.debtsOwed ?? 0),
  );
  const maxWasiyyah = afterDebts / 3;
  const appliedWasiyyah = Math.min(s.wasiyyah ?? 0, maxWasiyyah);
  return Math.max(0, afterDebts - appliedWasiyyah);
}

const setHeir = (s: WizardState, h: HeirId, n: number): WizardState => ({
  ...s,
  heirs: { ...s.heirs, [h]: n },
});

const has = (s: WizardState, h: HeirId) => (s.heirs[h] ?? 0) > 0;

export const initialState: WizardState = {
  estate: 0,
  grossEstate: 0,
  funeralExpenses: 0,
  debtsOwed: 0,
  receivables: 0,
  wasiyyah: 0,
  deceasedGender: "male",
  hasSpouse: false,
  heirs: {},
};

const noSon = (s: WizardState) => !has(s, "son");
const noGrandson = (s: WizardState) => !has(s, "grandson");
const noMaleDesc = (s: WizardState) => noSon(s) && noGrandson(s);
const noDesc = (s: WizardState) =>
  noSon(s) &&
  noGrandson(s) &&
  !has(s, "daughter") &&
  !has(s, "granddaughter");
const noFather = (s: WizardState) => !has(s, "father");
const noPGF = (s: WizardState) => !has(s, "paternalGrandfather");
const noMaleAsc = (s: WizardState) => noFather(s) && noPGF(s);
const noBlockerForSiblings = (s: WizardState) =>
  noMaleDesc(s) && noMaleAsc(s);

export const steps: Step[] = [
  {
    id: "estate",
    kind: "estate",
    titleKey: "q.estate.title",
    helpKey: "q.estate.help",
    visible: () => true,
    apply: (s, v) => {
      const gross = Number(v) || 0;
      return { ...s, grossEstate: gross, estate: gross };
    },
    read: (s) => s.grossEstate ?? s.estate,
  },
  {
    id: "deductions",
    kind: "deductions",
    titleKey: "q.deductions.title",
    helpKey: "q.deductions.help",
    visible: (s) => (s.grossEstate ?? s.estate) > 0,
    apply: (s, _v) => ({ ...s, estate: computeNetEstate(s) }),
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
      const heirs = { ...s.heirs };
      if (next === "male") delete heirs.husband;
      else delete heirs.wife;
      return { ...s, deceasedGender: next, heirs };
    },
    read: (s) => s.deceasedGender,
  },
  {
    id: "spouse",
    kind: "yesno",
    titleKey: "q.spouse.title.male",
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
    read: (s) => has(s, "father"),
  },
  {
    id: "paternalGrandfather",
    kind: "yesno",
    titleKey: "q.pgf.title",
    helpKey: "q.pgf.help",
    visible: (s) => noFather(s),
    apply: (s, v) => setHeir(s, "paternalGrandfather", v ? 1 : 0),
    read: (s) => has(s, "paternalGrandfather"),
  },
  {
    id: "mother",
    kind: "yesno",
    titleKey: "q.mother.title",
    helpKey: "q.mother.help",
    visible: () => true,
    apply: (s, v) => setHeir(s, "mother", v ? 1 : 0),
    read: (s) => has(s, "mother"),
  },
  {
    id: "maternalGrandmother",
    kind: "yesno",
    titleKey: "q.mGranny.title",
    helpKey: "q.mGranny.help",
    visible: (s) => !has(s, "mother"),
    apply: (s, v) => setHeir(s, "maternalGrandmother", v ? 1 : 0),
    read: (s) => has(s, "maternalGrandmother"),
  },
  {
    id: "paternalGrandmother",
    kind: "yesno",
    titleKey: "q.pGranny.title",
    helpKey: "q.pGranny.help",
    visible: (s) => !has(s, "mother") && noFather(s) && noPGF(s),
    apply: (s, v) => setHeir(s, "paternalGrandmother", v ? 1 : 0),
    read: (s) => has(s, "paternalGrandmother"),
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
    id: "grandsons",
    kind: "count",
    titleKey: "q.grandsons.title",
    helpKey: "q.grandchildren.help",
    heirId: "grandson",
    min: 0,
    max: 20,
    visible: (s) => noSon(s),
    apply: (s, v) => setHeir(s, "grandson", Number(v)),
    read: (s) => s.heirs.grandson ?? 0,
  },
  {
    id: "granddaughters",
    kind: "count",
    titleKey: "q.granddaughters.title",
    helpKey: "q.grandchildren.help",
    heirId: "granddaughter",
    min: 0,
    max: 20,
    visible: (s) => noSon(s),
    apply: (s, v) => setHeir(s, "granddaughter", Number(v)),
    read: (s) => s.heirs.granddaughter ?? 0,
  },
  {
    id: "fullBrothers",
    kind: "count",
    titleKey: "q.fullBrothers.title",
    helpKey: "q.fullSiblings.help",
    heirId: "fullBrother",
    min: 0,
    max: 20,
    visible: noBlockerForSiblings,
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
    visible: noBlockerForSiblings,
    apply: (s, v) => setHeir(s, "fullSister", Number(v)),
    read: (s) => s.heirs.fullSister ?? 0,
  },
  {
    id: "consBrothers",
    kind: "count",
    titleKey: "q.consBrothers.title",
    helpKey: "q.consSiblings.help",
    heirId: "paternalHalfBrother",
    min: 0,
    max: 20,
    visible: (s) => noBlockerForSiblings(s) && !has(s, "fullBrother"),
    apply: (s, v) => setHeir(s, "paternalHalfBrother", Number(v)),
    read: (s) => s.heirs.paternalHalfBrother ?? 0,
  },
  {
    id: "consSisters",
    kind: "count",
    titleKey: "q.consSisters.title",
    helpKey: "q.consSiblings.help",
    heirId: "paternalHalfSister",
    min: 0,
    max: 20,
    visible: (s) =>
      noBlockerForSiblings(s) &&
      !has(s, "fullBrother") &&
      (s.heirs.fullSister ?? 0) < 2,
    apply: (s, v) => setHeir(s, "paternalHalfSister", Number(v)),
    read: (s) => s.heirs.paternalHalfSister ?? 0,
  },
  {
    id: "uterineSibs",
    kind: "count",
    titleKey: "q.uterineSibs.title",
    helpKey: "q.uterineSibs.help",
    heirId: "maternalHalfSibling",
    min: 0,
    max: 20,
    visible: (s) => noDesc(s) && noMaleAsc(s),
    apply: (s, v) => setHeir(s, "maternalHalfSibling", Number(v)),
    read: (s) => s.heirs.maternalHalfSibling ?? 0,
  },
  {
    id: "fullNephews",
    kind: "count",
    titleKey: "q.fullNephews.title",
    helpKey: "q.extended.help",
    heirId: "fullBrothersSon",
    min: 0,
    max: 20,
    visible: (s) =>
      noBlockerForSiblings(s) &&
      !has(s, "fullBrother") &&
      !has(s, "paternalHalfBrother") &&
      (s.heirs.fullSister ?? 0) === 0,
    apply: (s, v) => setHeir(s, "fullBrothersSon", Number(v)),
    read: (s) => s.heirs.fullBrothersSon ?? 0,
  },
  {
    id: "consNephews",
    kind: "count",
    titleKey: "q.consNephews.title",
    helpKey: "q.extended.help",
    heirId: "paternalHalfBrothersSon",
    min: 0,
    max: 20,
    visible: (s) =>
      noBlockerForSiblings(s) &&
      !has(s, "fullBrother") &&
      !has(s, "paternalHalfBrother") &&
      !has(s, "fullBrothersSon"),
    apply: (s, v) => setHeir(s, "paternalHalfBrothersSon", Number(v)),
    read: (s) => s.heirs.paternalHalfBrothersSon ?? 0,
  },
  {
    id: "fullUncles",
    kind: "count",
    titleKey: "q.fullUncles.title",
    helpKey: "q.extended.help",
    heirId: "fullPaternalUncle",
    min: 0,
    max: 20,
    visible: (s) =>
      noBlockerForSiblings(s) &&
      !has(s, "fullBrother") &&
      !has(s, "paternalHalfBrother") &&
      !has(s, "fullBrothersSon") &&
      !has(s, "paternalHalfBrothersSon"),
    apply: (s, v) => setHeir(s, "fullPaternalUncle", Number(v)),
    read: (s) => s.heirs.fullPaternalUncle ?? 0,
  },
  {
    id: "consUncles",
    kind: "count",
    titleKey: "q.consUncles.title",
    helpKey: "q.extended.help",
    heirId: "paternalHalfPaternalUncle",
    min: 0,
    max: 20,
    visible: (s) =>
      noBlockerForSiblings(s) &&
      !has(s, "fullBrother") &&
      !has(s, "paternalHalfBrother") &&
      !has(s, "fullBrothersSon") &&
      !has(s, "paternalHalfBrothersSon") &&
      !has(s, "fullPaternalUncle"),
    apply: (s, v) => setHeir(s, "paternalHalfPaternalUncle", Number(v)),
    read: (s) => s.heirs.paternalHalfPaternalUncle ?? 0,
  },
  {
    id: "fullCousins",
    kind: "count",
    titleKey: "q.fullCousins.title",
    helpKey: "q.extended.help",
    heirId: "fullPaternalUnclesSon",
    min: 0,
    max: 20,
    visible: (s) =>
      noBlockerForSiblings(s) &&
      !has(s, "fullBrother") &&
      !has(s, "paternalHalfBrother") &&
      !has(s, "fullBrothersSon") &&
      !has(s, "paternalHalfBrothersSon") &&
      !has(s, "fullPaternalUncle") &&
      !has(s, "paternalHalfPaternalUncle"),
    apply: (s, v) => setHeir(s, "fullPaternalUnclesSon", Number(v)),
    read: (s) => s.heirs.fullPaternalUnclesSon ?? 0,
  },
  {
    id: "consCousins",
    kind: "count",
    titleKey: "q.consCousins.title",
    helpKey: "q.extended.help",
    heirId: "paternalHalfPaternalUnclesSon",
    min: 0,
    max: 20,
    visible: (s) =>
      noBlockerForSiblings(s) &&
      !has(s, "fullBrother") &&
      !has(s, "paternalHalfBrother") &&
      !has(s, "fullBrothersSon") &&
      !has(s, "paternalHalfBrothersSon") &&
      !has(s, "fullPaternalUncle") &&
      !has(s, "paternalHalfPaternalUncle") &&
      !has(s, "fullPaternalUnclesSon"),
    apply: (s, v) => setHeir(s, "paternalHalfPaternalUnclesSon", Number(v)),
    read: (s) => s.heirs.paternalHalfPaternalUnclesSon ?? 0,
  },
];

export function visibleSteps(state: WizardState): Step[] {
  return steps.filter((s) => s.visible(state));
}
