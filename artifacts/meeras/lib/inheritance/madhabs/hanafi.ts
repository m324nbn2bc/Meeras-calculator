import { add, frac, isZero, lcm, mul, reduce, sub, toNumber } from "../fractions";
import {
  CalculationInput,
  CalculationOutput,
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
}

function c(input: CalculationInput, h: HeirId): number {
  return input.heirs[h] ?? 0;
}

export function calculateHanafi(input: CalculationInput): CalculationOutput {
  const sons = c(input, "son");
  const daughters = c(input, "daughter");
  const father = c(input, "father") > 0;
  const mother = c(input, "mother") > 0;
  const husband = input.deceasedGender === "female" && c(input, "husband") > 0;
  const wives = input.deceasedGender === "male" ? c(input, "wife") : 0;

  const fullBrothers = c(input, "fullBrother");
  const fullSisters = c(input, "fullSister");
  const pHalfBrothers = c(input, "paternalHalfBrother");
  const pHalfSisters = c(input, "paternalHalfSister");
  const maternalHalf = c(input, "maternalHalfSibling");

  const hasChildren = sons > 0 || daughters > 0;
  const hasMaleDescendant = sons > 0;
  const hasFatherOrGF = father; // grandfather not modeled in v1
  const totalSiblings =
    fullBrothers + fullSisters + pHalfBrothers + pHalfSisters + maternalHalf;

  // Hanafi blocking
  const fullSiblingsBlocked = hasMaleDescendant || hasFatherOrGF;
  const paternalHalfBlocked =
    fullSiblingsBlocked || fullBrothers > 0 || fullSisters >= 2 ||
    (fullSisters === 1 && pHalfSisters === 0 && pHalfBrothers === 0 ? false : false);
  // Special: 1 full sister doesn't block paternal half-sisters (they complete to 2/3),
  // but DOES block paternal half-brothers (asaba relationship). We'll handle in logic below.
  const maternalHalfBlocked = hasChildren || hasFatherOrGF;

  const raw: RawShare[] = [];

  // ── Spouse ──
  if (husband) {
    raw.push({
      heir: "husband",
      count: 1,
      fraction: hasChildren ? frac(1, 4) : frac(1, 2),
      kind: "fixed",
    });
  }
  if (wives > 0) {
    raw.push({
      heir: "wife",
      count: wives,
      fraction: hasChildren ? frac(1, 8) : frac(1, 4),
      kind: "fixed",
    });
  }

  // ── Mother / Father (with Umariyyatan special case) ──
  // Umariyyatan: spouse + father + mother, no children, no 2+ siblings
  const umariyyatan =
    (husband || wives > 0) &&
    father &&
    mother &&
    !hasChildren &&
    totalSiblings < 2;

  if (mother) {
    if (umariyyatan) {
      // Mother gets 1/3 of remainder after spouse
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
      });
    } else if (hasChildren || totalSiblings >= 2) {
      raw.push({ heir: "mother", count: 1, fraction: frac(1, 6), kind: "fixed" });
    } else {
      raw.push({ heir: "mother", count: 1, fraction: frac(1, 3), kind: "fixed" });
    }
  }

  // Father: 1/6 fixed if any descendant; otherwise pure asabah (computed later from residue)
  let fatherTakesAsabah = false;
  if (father) {
    if (hasMaleDescendant) {
      raw.push({ heir: "father", count: 1, fraction: frac(1, 6), kind: "fixed" });
    } else if (hasChildren) {
      // Daughters only: 1/6 fixed + residue as asabah
      raw.push({ heir: "father", count: 1, fraction: frac(1, 6), kind: "fixed" });
      fatherTakesAsabah = true;
    } else if (umariyyatan) {
      // Father is residuary in Umariyyatan
      fatherTakesAsabah = true;
    } else {
      // No children: father takes everything left as asabah
      fatherTakesAsabah = true;
    }
  }

  // ── Daughters ──
  if (daughters > 0 && !hasMaleDescendant) {
    raw.push({
      heir: "daughter",
      count: daughters,
      fraction: daughters === 1 ? frac(1, 2) : frac(2, 3),
      kind: "fixed",
    });
  }

  // ── Maternal half-siblings (1/6 single, 1/3 collective) ──
  if (maternalHalf > 0 && !maternalHalfBlocked) {
    raw.push({
      heir: "maternalHalfSibling",
      count: maternalHalf,
      fraction: maternalHalf === 1 ? frac(1, 6) : frac(1, 3),
      kind: "fixed",
    });
  }

  // ── Full sisters (only if no full brother, no son, no father) ──
  let fullSistersTookFixed = false;
  if (
    fullSisters > 0 &&
    fullBrothers === 0 &&
    !fullSiblingsBlocked
  ) {
    raw.push({
      heir: "fullSister",
      count: fullSisters,
      fraction: fullSisters === 1 ? frac(1, 2) : frac(2, 3),
      kind: "fixed",
    });
    fullSistersTookFixed = true;
  }

  // ── Paternal half-sisters (only if not blocked) ──
  // Blocked by: son, father, full brother, 2+ full sisters, paternal half-brother (then becomes asabah)
  const pHalfSistersBlocked =
    hasMaleDescendant ||
    father ||
    fullBrothers > 0 ||
    fullSisters >= 2;
  if (
    pHalfSisters > 0 &&
    pHalfBrothers === 0 &&
    !pHalfSistersBlocked
  ) {
    if (fullSisters === 1) {
      // Complete the 2/3: collective 1/6 regardless of count
      raw.push({
        heir: "paternalHalfSister",
        count: pHalfSisters,
        fraction: frac(1, 6),
        kind: "fixed",
      });
    } else {
      raw.push({
        heir: "paternalHalfSister",
        count: pHalfSisters,
        fraction: pHalfSisters === 1 ? frac(1, 2) : frac(2, 3),
        kind: "fixed",
      });
    }
  }

  // ── Sum fixed shares & apply 'Awl ──
  let totalFixed = raw.reduce<Fraction>(
    (s, r) => add(s, r.fraction),
    frac(0, 1),
  );

  let awl: { from: number; to: number } | undefined;
  if (toNumber(totalFixed) > 1 + 1e-9) {
    // 'Awl: scale all fixed shares so their numerators sum to original denominator
    // Find LCM denominator
    let commonDen = 1;
    for (const r of raw) commonDen = lcm(commonDen, r.fraction.den);
    let sumNum = 0;
    for (const r of raw) sumNum += (r.fraction.num * commonDen) / r.fraction.den;
    awl = { from: commonDen, to: sumNum };
    // Replace fractions with new num/sumNum
    for (const r of raw) {
      const numAtCommon = (r.fraction.num * commonDen) / r.fraction.den;
      r.fraction = reduce({ num: numAtCommon, den: sumNum });
    }
    totalFixed = frac(1, 1);
  }

  // ── Asabah (residuary) ──
  // Asabah priority (Hanafi):
  // 1. Sons (with daughters 2:1)
  // 2. Father (if no son)
  // 3. Full brothers (with full sisters 2:1) — only if no son & no father
  // 4. Full sisters as residuary with daughters/granddaughters (al-akhawat ma'al-banat)
  //    — when there are daughters but no son, no father, no full brother, full sisters take residue
  // 5. Paternal half-brother (with sister 2:1)
  // 6. Paternal half-sister with daughters (similar to full sister with daughters)

  const remainderAfterFixed = sub(frac(1, 1), totalFixed);
  let assignedAsabah = false;
  let raddPossible = false;

  if (sons > 0) {
    // Sons + daughters 2:1
    const totalShares = sons * 2 + daughters;
    if (totalShares > 0 && !isZero(remainderAfterFixed)) {
      const sonShare = mul(remainderAfterFixed, frac(2 * sons, totalShares));
      raw.push({ heir: "son", count: sons, fraction: sonShare, kind: "asabah" });
      if (daughters > 0) {
        const dShare = mul(remainderAfterFixed, frac(daughters, totalShares));
        raw.push({
          heir: "daughter",
          count: daughters,
          fraction: dShare,
          kind: "asabah",
        });
      }
      assignedAsabah = true;
    }
  } else if (fatherTakesAsabah && !isZero(remainderAfterFixed)) {
    raw.push({
      heir: "father",
      count: 1,
      fraction: remainderAfterFixed,
      kind: "asabah",
    });
    assignedAsabah = true;
  } else if (!father) {
    // Brothers chain
    if (fullBrothers > 0) {
      const totalShares = fullBrothers * 2 + fullSisters;
      if (!isZero(remainderAfterFixed) && totalShares > 0) {
        const bShare = mul(
          remainderAfterFixed,
          frac(2 * fullBrothers, totalShares),
        );
        raw.push({
          heir: "fullBrother",
          count: fullBrothers,
          fraction: bShare,
          kind: "asabah",
        });
        if (fullSisters > 0) {
          // Replace any earlier full sister fixed share (shouldn't exist since fullBrothers>0 prevented it)
          const sShare = mul(
            remainderAfterFixed,
            frac(fullSisters, totalShares),
          );
          raw.push({
            heir: "fullSister",
            count: fullSisters,
            fraction: sShare,
            kind: "asabah",
          });
        }
        assignedAsabah = true;
      }
    } else if (
      fullSisters > 0 &&
      daughters > 0 &&
      !hasMaleDescendant &&
      !fullSistersTookFixed === false
    ) {
      // Full sisters with daughters become asabah for the residue
      // Remove their fixed share, give them remainder
      const fsIndex = raw.findIndex((r) => r.heir === "fullSister");
      if (fsIndex >= 0) raw.splice(fsIndex, 1);
      // Recompute remainder
      const newTotal = raw.reduce<Fraction>(
        (s, r) => add(s, r.fraction),
        frac(0, 1),
      );
      const newRem = sub(frac(1, 1), newTotal);
      if (!isZero(newRem)) {
        raw.push({
          heir: "fullSister",
          count: fullSisters,
          fraction: newRem,
          kind: "asabah",
        });
        assignedAsabah = true;
      }
    } else if (pHalfBrothers > 0) {
      const totalShares = pHalfBrothers * 2 + pHalfSisters;
      if (!isZero(remainderAfterFixed) && totalShares > 0) {
        const bShare = mul(
          remainderAfterFixed,
          frac(2 * pHalfBrothers, totalShares),
        );
        raw.push({
          heir: "paternalHalfBrother",
          count: pHalfBrothers,
          fraction: bShare,
          kind: "asabah",
        });
        if (pHalfSisters > 0) {
          const sShare = mul(
            remainderAfterFixed,
            frac(pHalfSisters, totalShares),
          );
          raw.push({
            heir: "paternalHalfSister",
            count: pHalfSisters,
            fraction: sShare,
            kind: "asabah",
          });
        }
        assignedAsabah = true;
      }
    }
  }

  // ── Radd (Hanafi: redistribute surplus to fixed-share heirs except spouse) ──
  let raddApplied = false;
  const totalAfterAsabah = raw.reduce<Fraction>(
    (s, r) => add(s, r.fraction),
    frac(0, 1),
  );
  let residue: number | undefined;

  if (toNumber(totalAfterAsabah) < 1 - 1e-9 && !assignedAsabah) {
    // Identify radd-eligible heirs (fixed-share, not spouse)
    const eligible = raw.filter(
      (r) =>
        (r.kind === "fixed" || r.kind === "umariyyatan") &&
        r.heir !== "husband" &&
        r.heir !== "wife",
    );
    if (eligible.length > 0) {
      raddPossible = true;
      // Sum eligible fractions
      const eligibleSum = eligible.reduce<Fraction>(
        (s, r) => add(s, r.fraction),
        frac(0, 1),
      );
      const remainder = sub(frac(1, 1), totalAfterAsabah);
      // Distribute remainder proportionally
      for (const r of eligible) {
        const proportion = reduce({
          num: r.fraction.num * eligibleSum.den,
          den: r.fraction.den * eligibleSum.num,
        });
        const extra = mul(remainder, proportion);
        r.fraction = add(r.fraction, extra);
        r.kind = "radd";
      }
      raddApplied = true;
    } else {
      // Only spouse(s) — residue goes to Bayt al-Mal in classical view
      residue = toNumber(sub(frac(1, 1), totalAfterAsabah)) * input.estate;
    }
  } else if (toNumber(totalAfterAsabah) < 1 - 1e-9) {
    // Surplus exists but assignedAsabah was true — shouldn't happen, safety:
    residue = toNumber(sub(frac(1, 1), totalAfterAsabah)) * input.estate;
  }

  if (raddPossible) raddApplied = true;

  // ── Build final shares ──
  const shares: ShareResult[] = raw.map((r) => {
    const amount = (r.fraction.num / r.fraction.den) * input.estate;
    return {
      heir: r.heir,
      count: r.count,
      fraction: r.fraction,
      amount,
      perPerson: r.count > 0 ? amount / r.count : 0,
      kind: r.kind,
    };
  });

  return {
    estate: input.estate,
    shares,
    awl,
    radd: raddApplied || undefined,
    residue: residue && residue > 0.0001 ? residue : undefined,
  };
}
