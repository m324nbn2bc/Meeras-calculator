import { add, frac, isZero, lcm, reduce, sub, toNumber } from "../fractions";
import { calculateHanafi } from "./hanafi";
import {
  CalculationInput,
  CalculationOutput,
  ExclusionResult,
  Fraction,
  HeirId,
  InheritanceEngine,
  ShareKind,
  ShareResult,
} from "../types";

interface RawShare {
  heir: HeirId;
  count: number;
  fraction: Fraction;
  kind: ShareKind;
  reasonKey?: string;
}

function c(input: CalculationInput, h: HeirId): number {
  return input.heirs[h] ?? 0;
}

function siblingUnits(males: number, females: number): number {
  return males * 2 + females;
}

function makeShare(input: CalculationInput, raw: RawShare): ShareResult {
  const amount = toNumber(raw.fraction) * input.estate;
  return {
    heir: raw.heir,
    count: raw.count,
    fraction: raw.fraction,
    amount,
    perPerson: raw.count > 0 ? amount / raw.count : 0,
    kind: raw.kind,
    reasonKey: raw.reasonKey,
  };
}

function applyAwl(raw: RawShare[]): { from: number; to: number } | undefined {
  const totalFixed = raw.reduce<Fraction>((sum, share) => {
    return add(sum, share.fraction);
  }, frac(0, 1));

  if (toNumber(totalFixed) <= 1 + 1e-9) return undefined;

  let commonDen = 1;
  for (const share of raw) commonDen = lcm(commonDen, share.fraction.den);

  let sumNum = 0;
  for (const share of raw) {
    sumNum += (share.fraction.num * commonDen) / share.fraction.den;
  }

  for (const share of raw) {
    const numAtCommon = (share.fraction.num * commonDen) / share.fraction.den;
    share.fraction = reduce({ num: numAtCommon, den: sumNum });
  }

  return { from: commonDen, to: sumNum };
}

function calculateShafiiGrandfatherWithSiblings(
  input: CalculationInput,
): CalculationOutput | null {
  const father = c(input, "father") > 0;
  const pgf = c(input, "paternalGrandfather") > 0;
  const sons = c(input, "son");
  const grandsons = c(input, "grandson");
  const daughters = c(input, "daughter");
  const granddaughters = c(input, "granddaughter");
  const hasDescendant =
    sons > 0 || grandsons > 0 || daughters > 0 || granddaughters > 0;

  const fullBrothers = c(input, "fullBrother");
  const fullSisters = c(input, "fullSister");
  const consBrothers = c(input, "paternalHalfBrother");
  const consSisters = c(input, "paternalHalfSister");
  const uterineSibs = c(input, "maternalHalfSibling");
  const hasAgnaticSiblings =
    fullBrothers + fullSisters + consBrothers + consSisters > 0;
  const hasGrandfatherDisputeCase = pgf && !father && !hasDescendant;

  if (!hasGrandfatherDisputeCase || !hasAgnaticSiblings) {
    if (hasGrandfatherDisputeCase && uterineSibs > 0) {
      // Handover rule: unlike Hanafi, Shafi'i does not exclude uterine siblings
      // merely because the paternal grandfather is present.
    } else {
      return null;
    }
  }

  const raw: RawShare[] = [];
  const exclusions: ExclusionResult[] = [];
  const husband = input.deceasedGender === "female" && c(input, "husband") > 0;
  const wives = input.deceasedGender === "male" ? c(input, "wife") : 0;
  const mother = c(input, "mother") > 0;
  const mGranny = c(input, "maternalGrandmother") > 0;
  const pGranny = c(input, "paternalGrandmother") > 0;
  const totalSiblings =
    fullBrothers + fullSisters + consBrothers + consSisters + uterineSibs;

  const addEx = (heir: HeirId, count: number, reasonKey: string) => {
    if (count > 0) exclusions.push({ heir, count, reasonKey });
  };

  if (husband) {
    raw.push({
      heir: "husband",
      count: 1,
      fraction: frac(1, 2),
      kind: "fixed",
      reasonKey: "reason.husband.noDesc",
    });
  }
  if (wives > 0) {
    raw.push({
      heir: "wife",
      count: wives,
      fraction: frac(1, 4),
      kind: "fixed",
      reasonKey: "reason.wife.noDesc",
    });
  }

  if (mother) {
    raw.push({
      heir: "mother",
      count: 1,
      fraction: totalSiblings >= 2 ? frac(1, 6) : frac(1, 3),
      kind: "fixed",
      reasonKey:
        totalSiblings >= 2
          ? "reason.mother.withSiblings"
          : "reason.mother.alone",
    });
  }

  if (mGranny && mother) addEx("maternalGrandmother", 1, "ex.mGranny.byMother");
  if (pGranny && mother) addEx("paternalGrandmother", 1, "ex.pGranny.byMother");
  else if (pGranny && pgf) addEx("paternalGrandmother", 1, "ex.pGranny.byPGF");

  if (mGranny && !mother) {
    raw.push({
      heir: "maternalGrandmother",
      count: 1,
      fraction: frac(1, 6),
      kind: "fixed",
      reasonKey: "reason.granny.solo",
    });
  }

  if (uterineSibs > 0) {
    raw.push({
      heir: "maternalHalfSibling",
      count: uterineSibs,
      fraction: uterineSibs === 1 ? frac(1, 6) : frac(1, 3),
      kind: "fixed",
      reasonKey:
        uterineSibs === 1 ? "reason.uterine.solo" : "reason.uterine.multiple",
    });
  }

  const awl = applyAwl(raw);
  const totalFixed = raw.reduce<Fraction>((sum, share) => {
    return add(sum, share.fraction);
  }, frac(0, 1));
  const residue = sub(frac(1, 1), totalFixed);

  if (!isZero(residue) && pgf) {
    const useFullSiblings = fullBrothers + fullSisters > 0;
    const siblingMaleHeir: HeirId = useFullSiblings
      ? "fullBrother"
      : "paternalHalfBrother";
    const siblingFemaleHeir: HeirId = useFullSiblings
      ? "fullSister"
      : "paternalHalfSister";
    const siblingMales = useFullSiblings ? fullBrothers : consBrothers;
    const siblingFemales = useFullSiblings ? fullSisters : consSisters;
    const blockedMales = useFullSiblings ? consBrothers : 0;
    const blockedFemales = useFullSiblings ? consSisters : 0;
    const units = 2 + siblingUnits(siblingMales, siblingFemales);

    if (blockedMales > 0) {
      addEx("paternalHalfBrother", blockedMales, "ex.consSibling.byBlocker");
    }
    if (blockedFemales > 0) {
      addEx("paternalHalfSister", blockedFemales, "ex.consSibling.byBlocker");
    }

    if (siblingMales + siblingFemales > 0 && units > 0) {
      const muqasamahPgf = reduce({
        num: residue.num * 2,
        den: residue.den * units,
      });
      const oneThirdEstate = frac(1, 3);
      const pgfShare =
        toNumber(oneThirdEstate) > toNumber(muqasamahPgf) &&
        toNumber(oneThirdEstate) <= toNumber(residue)
          ? oneThirdEstate
          : muqasamahPgf;
      const siblingResidue = sub(residue, pgfShare);

      raw.push({
        heir: "paternalGrandfather",
        count: 1,
        fraction: pgfShare,
        kind: "asabah",
        reasonKey: "reason.pgf.asabah",
      });

      if (!isZero(siblingResidue)) {
        const siblingUnitsTotal = siblingUnits(siblingMales, siblingFemales);
        if (siblingMales > 0) {
          raw.push({
            heir: siblingMaleHeir,
            count: siblingMales,
            fraction: reduce({
              num: siblingResidue.num * siblingMales * 2,
              den: siblingResidue.den * siblingUnitsTotal,
            }),
            kind: "asabah",
            reasonKey: useFullSiblings
              ? "reason.fullBrother.asabah"
              : "reason.consBrother.asabah",
          });
        }
        if (siblingFemales > 0) {
          raw.push({
            heir: siblingFemaleHeir,
            count: siblingFemales,
            fraction: reduce({
              num: siblingResidue.num * siblingFemales,
              den: siblingResidue.den * siblingUnitsTotal,
            }),
            kind: "asabah",
            reasonKey: useFullSiblings
              ? "reason.fullBrother.asabah"
              : "reason.consBrother.asabah",
          });
        }
      }
    } else {
      raw.push({
        heir: "paternalGrandfather",
        count: 1,
        fraction: residue,
        kind: "asabah",
        reasonKey: "reason.pgf.asabah",
      });
    }
  }

  const shares = raw.map((share) => makeShare(input, share));
  const distributed = shares.reduce((sum, share) => sum + share.amount, 0);
  const leftover = input.estate - distributed;

  return {
    estate: input.estate,
    shares,
    exclusions,
    awl,
    residue: leftover > 0.0001 ? leftover : undefined,
  };
}

export function calculateShafii(input: CalculationInput): CalculationOutput {
  return calculateShafiiGrandfatherWithSiblings(input) ?? calculateHanafi(input);
}

export const shafiiEngine: InheritanceEngine = {
  id: "shafii",
  calculate: calculateShafii,
};
