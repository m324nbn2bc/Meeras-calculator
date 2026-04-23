import { add, frac, isZero, lcm, mul, reduce, sub, toNumber } from "../fractions";
import {
  CalculationInput,
  CalculationOutput,
  ExclusionResult,
  Fraction,
  HeirId,
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

export function calculateHanafi(input: CalculationInput): CalculationOutput {
  const sons = c(input, "son");
  const daughters = c(input, "daughter");
  const grandsons = c(input, "grandson");
  const granddaughters = c(input, "granddaughter");
  const father = c(input, "father") > 0;
  const mother = c(input, "mother") > 0;
  const pgf = c(input, "paternalGrandfather") > 0;
  const mGranny = c(input, "maternalGrandmother") > 0;
  const pGranny = c(input, "paternalGrandmother") > 0;
  const husband = input.deceasedGender === "female" && c(input, "husband") > 0;
  const wives = input.deceasedGender === "male" ? c(input, "wife") : 0;

  const fullBrothers = c(input, "fullBrother");
  const fullSisters = c(input, "fullSister");
  const consBrothers = c(input, "paternalHalfBrother");
  const consSisters = c(input, "paternalHalfSister");
  const uterineSibs = c(input, "maternalHalfSibling");

  const fullNephews = c(input, "fullBrothersSon");
  const consNephews = c(input, "paternalHalfBrothersSon");
  const fullUncles = c(input, "fullPaternalUncle");
  const consUncles = c(input, "paternalHalfPaternalUncle");
  const fullCousins = c(input, "fullPaternalUnclesSon");
  const consCousins = c(input, "paternalHalfPaternalUnclesSon");

  const hasMaleDescendant = sons > 0 || grandsons > 0;
  const hasFemaleDescendant = daughters > 0 || granddaughters > 0;
  const hasDescendant = hasMaleDescendant || hasFemaleDescendant;
  const hasMaleAscendant = father || pgf;

  // Total siblings (any type) — used for mother's share reduction (Hajb Nuqsan)
  const totalSiblings =
    fullBrothers + fullSisters + consBrothers + consSisters + uterineSibs;

  const raw: RawShare[] = [];
  const exclusions: ExclusionResult[] = [];

  const addEx = (heir: HeirId, count: number, reasonKey: string) => {
    if (count > 0) exclusions.push({ heir, count, reasonKey });
  };

  // ═════════ SPOUSE ═════════
  if (husband) {
    raw.push({
      heir: "husband",
      count: 1,
      fraction: hasDescendant ? frac(1, 4) : frac(1, 2),
      kind: "fixed",
      reasonKey: hasDescendant ? "reason.husband.withDesc" : "reason.husband.noDesc",
    });
  }
  if (wives > 0) {
    raw.push({
      heir: "wife",
      count: wives,
      fraction: hasDescendant ? frac(1, 8) : frac(1, 4),
      kind: "fixed",
      reasonKey: hasDescendant ? "reason.wife.withDesc" : "reason.wife.noDesc",
    });
  }

  // ═════════ MOTHER (with Umariyyatain) ═════════
  // Umariyyatain triggers ONLY with father (NOT PGF), spouse, no descendants, < 2 siblings
  const umariyyatain =
    (husband || wives > 0) &&
    father &&
    mother &&
    !hasDescendant &&
    totalSiblings < 2;

  if (mother) {
    if (umariyyatain) {
      const spouseShare = husband
        ? frac(1, 2)
        : wives > 0
          ? frac(1, 4)
          : frac(0, 1);
      const remainder = sub(frac(1, 1), spouseShare);
      const motherShare = mul(remainder, frac(1, 3));
      raw.push({
        heir: "mother",
        count: 1,
        fraction: motherShare,
        kind: "umariyyatan",
        reasonKey: "reason.mother.umariyyatain",
      });
    } else if (hasDescendant || totalSiblings >= 2) {
      raw.push({
        heir: "mother",
        count: 1,
        fraction: frac(1, 6),
        kind: "fixed",
        reasonKey: hasDescendant
          ? "reason.mother.withDesc"
          : "reason.mother.withSiblings",
      });
    } else {
      raw.push({
        heir: "mother",
        count: 1,
        fraction: frac(1, 3),
        kind: "fixed",
        reasonKey: "reason.mother.alone",
      });
    }
  }

  // ═════════ FATHER ═════════
  let fatherTakesAsabah = false;
  if (father) {
    if (hasMaleDescendant) {
      raw.push({
        heir: "father",
        count: 1,
        fraction: frac(1, 6),
        kind: "fixed",
        reasonKey: "reason.father.withMaleDesc",
      });
    } else if (hasFemaleDescendant) {
      raw.push({
        heir: "father",
        count: 1,
        fraction: frac(1, 6),
        kind: "fixed",
        reasonKey: "reason.father.withFemaleDesc",
      });
      fatherTakesAsabah = true;
    } else {
      // No descendants — pure asabah (and umariyyatain handled via spouse + mother above)
      fatherTakesAsabah = true;
    }
  }

  // ═════════ PATERNAL GRANDFATHER ═════════
  let pgfTakesAsabah = false;
  if (pgf) {
    if (father) {
      addEx("paternalGrandfather", 1, "ex.pgf.byFather");
    } else {
      if (hasMaleDescendant) {
        raw.push({
          heir: "paternalGrandfather",
          count: 1,
          fraction: frac(1, 6),
          kind: "fixed",
          reasonKey: "reason.pgf.withMaleDesc",
        });
      } else if (hasFemaleDescendant) {
        raw.push({
          heir: "paternalGrandfather",
          count: 1,
          fraction: frac(1, 6),
          kind: "fixed",
          reasonKey: "reason.pgf.withFemaleDesc",
        });
        pgfTakesAsabah = true;
      } else {
        pgfTakesAsabah = true;
      }
    }
  }

  // ═════════ GRANDMOTHERS ═════════
  // Maternal granny: blocked only by mother
  // Paternal granny: blocked by mother, father, OR PGF
  // If both eligible → share 1/6 equally; else single eligible takes 1/6
  const mEligible = mGranny && !mother;
  const pEligible = pGranny && !mother && !father && !pgf;

  if (mGranny && mother) addEx("maternalGrandmother", 1, "ex.mGranny.byMother");
  if (pGranny && mother) addEx("paternalGrandmother", 1, "ex.pGranny.byMother");
  else if (pGranny && father) addEx("paternalGrandmother", 1, "ex.pGranny.byFather");
  else if (pGranny && pgf) addEx("paternalGrandmother", 1, "ex.pGranny.byPGF");

  if (mEligible && pEligible) {
    raw.push({
      heir: "maternalGrandmother",
      count: 1,
      fraction: frac(1, 12),
      kind: "fixed",
      reasonKey: "reason.granny.shared",
    });
    raw.push({
      heir: "paternalGrandmother",
      count: 1,
      fraction: frac(1, 12),
      kind: "fixed",
      reasonKey: "reason.granny.shared",
    });
  } else if (mEligible) {
    raw.push({
      heir: "maternalGrandmother",
      count: 1,
      fraction: frac(1, 6),
      kind: "fixed",
      reasonKey: "reason.granny.solo",
    });
  } else if (pEligible) {
    raw.push({
      heir: "paternalGrandmother",
      count: 1,
      fraction: frac(1, 6),
      kind: "fixed",
      reasonKey: "reason.granny.solo",
    });
  }

  // ═════════ DAUGHTERS (fixed only when no son) ═════════
  if (daughters > 0 && sons === 0) {
    raw.push({
      heir: "daughter",
      count: daughters,
      fraction: daughters === 1 ? frac(1, 2) : frac(2, 3),
      kind: "fixed",
      reasonKey: daughters === 1 ? "reason.daughter.solo" : "reason.daughter.multiple",
    });
  }

  // ═════════ GRANDDAUGHTERS ═════════
  // Excluded by son. With grandson → asabah. Else fixed depending on daughters.
  if (granddaughters > 0) {
    if (sons > 0) {
      addEx("granddaughter", granddaughters, "ex.granddaughter.bySon");
    } else if (grandsons > 0) {
      // Asabah handled in residuary section
    } else if (daughters >= 2) {
      addEx("granddaughter", granddaughters, "ex.granddaughter.byTwoDaughters");
    } else if (daughters === 1) {
      // Complete to 2/3: collective 1/6
      raw.push({
        heir: "granddaughter",
        count: granddaughters,
        fraction: frac(1, 6),
        kind: "fixed",
        reasonKey: "reason.granddaughter.complete",
      });
    } else {
      raw.push({
        heir: "granddaughter",
        count: granddaughters,
        fraction: granddaughters === 1 ? frac(1, 2) : frac(2, 3),
        kind: "fixed",
        reasonKey:
          granddaughters === 1
            ? "reason.granddaughter.solo"
            : "reason.granddaughter.multiple",
      });
    }
  }

  // ═════════ GRANDSON exclusions ═════════
  if (grandsons > 0 && sons > 0) {
    addEx("grandson", grandsons, "ex.grandson.bySon");
  }

  // ═════════ UTERINE SIBLINGS ═════════
  // Excluded by any descendant, father, or PGF
  const uterineBlocked = hasDescendant || father || pgf;
  if (uterineSibs > 0) {
    if (uterineBlocked) {
      addEx("maternalHalfSibling", uterineSibs, "ex.uterine.byBlocker");
    } else {
      raw.push({
        heir: "maternalHalfSibling",
        count: uterineSibs,
        fraction: uterineSibs === 1 ? frac(1, 6) : frac(1, 3),
        kind: "fixed",
        reasonKey:
          uterineSibs === 1 ? "reason.uterine.solo" : "reason.uterine.multiple",
      });
    }
  }

  // ═════════ FULL SIBLINGS ═════════
  // Hanafi: blocked by son, grandson, father, OR PGF
  const fullBlocked = hasMaleDescendant || hasMaleAscendant;
  let fullSistersTookAsabahMaaGhayrihi = false;

  if (fullBlocked) {
    addEx("fullBrother", fullBrothers, "ex.fullSibling.byBlocker");
    addEx("fullSister", fullSisters, "ex.fullSibling.byBlocker");
  } else if (fullBrothers > 0) {
    // Asabah bi-Ghayrihi handled in residuary section (with sisters 2:1)
  } else if (fullSisters > 0) {
    if (hasFemaleDescendant) {
      // Asabah ma'a Ghayrihi: full sister(s) take residue like a brother
      // Actually handled in residuary section, but mark flag so cons sisters know they're blocked
      fullSistersTookAsabahMaaGhayrihi = true;
    } else {
      raw.push({
        heir: "fullSister",
        count: fullSisters,
        fraction: fullSisters === 1 ? frac(1, 2) : frac(2, 3),
        kind: "fixed",
        reasonKey:
          fullSisters === 1
            ? "reason.fullSister.solo"
            : "reason.fullSister.multiple",
      });
    }
  }

  // ═════════ CONSANGUINE (Paternal Half) SIBLINGS ═════════
  // Blocked by son, grandson, father, PGF, full brother, OR (2+ full sisters with no female descendant)
  // Also blocked when full sister becomes asabah ma'a ghayrihi (acts like brother)
  const consBlocked =
    fullBlocked ||
    fullBrothers > 0 ||
    fullSistersTookAsabahMaaGhayrihi ||
    (fullSisters >= 2 && !hasFemaleDescendant);

  let consSistersTookAsabahMaaGhayrihi = false;

  if (consBrothers + consSisters > 0) {
    if (consBlocked) {
      addEx("paternalHalfBrother", consBrothers, "ex.consSibling.byBlocker");
      addEx("paternalHalfSister", consSisters, "ex.consSibling.byBlocker");
    } else if (consBrothers > 0) {
      // Asabah bi-Ghayrihi handled below
    } else if (consSisters > 0) {
      if (hasFemaleDescendant && fullSisters === 0) {
        consSistersTookAsabahMaaGhayrihi = true;
      } else if (fullSisters === 1) {
        // Complete to 2/3: collective 1/6
        raw.push({
          heir: "paternalHalfSister",
          count: consSisters,
          fraction: frac(1, 6),
          kind: "fixed",
          reasonKey: "reason.consSister.complete",
        });
      } else {
        raw.push({
          heir: "paternalHalfSister",
          count: consSisters,
          fraction: consSisters === 1 ? frac(1, 2) : frac(2, 3),
          kind: "fixed",
          reasonKey:
            consSisters === 1
              ? "reason.consSister.solo"
              : "reason.consSister.multiple",
        });
      }
    }
  }

  // ═════════ SUM FIXED & APPLY 'AWL ═════════
  let totalFixed = raw.reduce<Fraction>(
    (s, r) => add(s, r.fraction),
    frac(0, 1),
  );

  let awl: { from: number; to: number } | undefined;
  if (toNumber(totalFixed) > 1 + 1e-9) {
    let commonDen = 1;
    for (const r of raw) commonDen = lcm(commonDen, r.fraction.den);
    let sumNum = 0;
    for (const r of raw) sumNum += (r.fraction.num * commonDen) / r.fraction.den;
    awl = { from: commonDen, to: sumNum };
    for (const r of raw) {
      const numAtCommon = (r.fraction.num * commonDen) / r.fraction.den;
      r.fraction = reduce({ num: numAtCommon, den: sumNum });
    }
    totalFixed = frac(1, 1);
  }

  // ═════════ ASABAH (Residuary) ═════════
  const remainder = sub(frac(1, 1), totalFixed);
  let assignedAsabah = false;

  const distributeMixed = (
    maleHeir: HeirId,
    males: number,
    femaleHeir: HeirId,
    females: number,
    rem: Fraction,
    reasonKey: string,
  ) => {
    const totalUnits = males * 2 + females;
    if (totalUnits === 0 || isZero(rem)) return;
    const malePart = mul(rem, frac(2 * males, totalUnits));
    raw.push({
      heir: maleHeir,
      count: males,
      fraction: malePart,
      kind: "asabah",
      reasonKey,
    });
    if (females > 0) {
      const femalePart = mul(rem, frac(females, totalUnits));
      raw.push({
        heir: femaleHeir,
        count: females,
        fraction: femalePart,
        kind: "asabah",
        reasonKey,
      });
    }
  };

  // Strict top-down Asabah priority
  if (sons > 0) {
    distributeMixed("son", sons, "daughter", daughters, remainder, "reason.son.asabah");
    assignedAsabah = true;
  } else if (grandsons > 0) {
    distributeMixed(
      "grandson",
      grandsons,
      "granddaughter",
      granddaughters,
      remainder,
      "reason.grandson.asabah",
    );
    assignedAsabah = true;
  } else if (fatherTakesAsabah && !isZero(remainder)) {
    raw.push({
      heir: "father",
      count: 1,
      fraction: remainder,
      kind: "asabah",
      reasonKey: "reason.father.asabah",
    });
    assignedAsabah = true;
  } else if (pgfTakesAsabah && !isZero(remainder)) {
    raw.push({
      heir: "paternalGrandfather",
      count: 1,
      fraction: remainder,
      kind: "asabah",
      reasonKey: "reason.pgf.asabah",
    });
    assignedAsabah = true;
  } else if (!fullBlocked && fullBrothers > 0) {
    distributeMixed(
      "fullBrother",
      fullBrothers,
      "fullSister",
      fullSisters,
      remainder,
      "reason.fullBrother.asabah",
    );
    assignedAsabah = true;
  } else if (fullSistersTookAsabahMaaGhayrihi && !isZero(remainder)) {
    raw.push({
      heir: "fullSister",
      count: fullSisters,
      fraction: remainder,
      kind: "asabahMaaGhayrihi",
      reasonKey: "reason.fullSister.maaGhayrihi",
    });
    assignedAsabah = true;
  } else if (!consBlocked && consBrothers > 0) {
    distributeMixed(
      "paternalHalfBrother",
      consBrothers,
      "paternalHalfSister",
      consSisters,
      remainder,
      "reason.consBrother.asabah",
    );
    assignedAsabah = true;
  } else if (consSistersTookAsabahMaaGhayrihi && !isZero(remainder)) {
    raw.push({
      heir: "paternalHalfSister",
      count: consSisters,
      fraction: remainder,
      kind: "asabahMaaGhayrihi",
      reasonKey: "reason.consSister.maaGhayrihi",
    });
    assignedAsabah = true;
  } else {
    // Extended Asabah chain (Category 1C continued + 1D)
    const extendedChain: { heir: HeirId; count: number; reasonKey: string }[] = [
      { heir: "fullBrothersSon", count: fullNephews, reasonKey: "reason.fullNephew.asabah" },
      { heir: "paternalHalfBrothersSon", count: consNephews, reasonKey: "reason.consNephew.asabah" },
      { heir: "fullPaternalUncle", count: fullUncles, reasonKey: "reason.fullUncle.asabah" },
      { heir: "paternalHalfPaternalUncle", count: consUncles, reasonKey: "reason.consUncle.asabah" },
      { heir: "fullPaternalUnclesSon", count: fullCousins, reasonKey: "reason.fullCousin.asabah" },
      { heir: "paternalHalfPaternalUnclesSon", count: consCousins, reasonKey: "reason.consCousin.asabah" },
    ];

    let claimed = false;
    for (let i = 0; i < extendedChain.length; i++) {
      const slot = extendedChain[i];
      if (slot.count > 0) {
        if (!claimed && !isZero(remainder)) {
          raw.push({
            heir: slot.heir,
            count: slot.count,
            fraction: remainder,
            kind: "asabah",
            reasonKey: slot.reasonKey,
          });
          claimed = true;
          assignedAsabah = true;
        } else {
          addEx(slot.heir, slot.count, "ex.asabah.byCloser");
        }
      }
    }
  }

  // ═════════ RADD (Hanafi) ═════════
  let raddApplied = false;
  const totalAfterAsabah = raw.reduce<Fraction>(
    (s, r) => add(s, r.fraction),
    frac(0, 1),
  );
  let residue: number | undefined;

  if (toNumber(totalAfterAsabah) < 1 - 1e-9 && !assignedAsabah) {
    const eligible = raw.filter(
      (r) =>
        (r.kind === "fixed" || r.kind === "umariyyatan") &&
        r.heir !== "husband" &&
        r.heir !== "wife",
    );
    if (eligible.length > 0) {
      const eligibleSum = eligible.reduce<Fraction>(
        (s, r) => add(s, r.fraction),
        frac(0, 1),
      );
      const surplus = sub(frac(1, 1), totalAfterAsabah);
      for (const r of eligible) {
        const proportion = reduce({
          num: r.fraction.num * eligibleSum.den,
          den: r.fraction.den * eligibleSum.num,
        });
        const extra = mul(surplus, proportion);
        r.fraction = add(r.fraction, extra);
        r.kind = "radd";
      }
      raddApplied = true;
    } else {
      residue = toNumber(sub(frac(1, 1), totalAfterAsabah)) * input.estate;
    }
  }

  // ═════════ BUILD FINAL ═════════
  const shares: ShareResult[] = raw.map((r) => {
    const amount = (r.fraction.num / r.fraction.den) * input.estate;
    return {
      heir: r.heir,
      count: r.count,
      fraction: r.fraction,
      amount,
      perPerson: r.count > 0 ? amount / r.count : 0,
      kind: r.kind,
      reasonKey: r.reasonKey,
    };
  });

  return {
    estate: input.estate,
    shares,
    exclusions,
    awl,
    radd: raddApplied || undefined,
    residue: residue && residue > 0.0001 ? residue : undefined,
  };
}
