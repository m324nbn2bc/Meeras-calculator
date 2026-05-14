import { calculate } from ".";
import { add, toNumber } from "./fractions";
import { CalculationInput, Fraction, HeirId, ShareKind } from "./types";

interface Case {
  name: string;
  input: CalculationInput;
  expect: Record<string, string>; // heir -> "num/den"
  expectExclusions?: string[];
  expectKinds?: Partial<Record<HeirId, ShareKind[]>>;
  expectAwl?: { from: number; to: number };
  expectRadd?: boolean;
  expectResidue?: number;
  expectAbsentExclusions?: string[];
}

const E = (
  name: string,
  heirs: CalculationInput["heirs"],
  expect: Record<string, string>,
  opts: Partial<CalculationInput> = {},
  expectExclusions?: string[],
  extra: Omit<Case, "name" | "input" | "expect" | "expectExclusions"> = {},
): Case => ({
  name,
  input: {
    estate: 24,
    deceasedGender: "male",
    heirs,
    madhab: "hanafi",
    ...opts,
  },
  expect,
  expectExclusions,
  ...extra,
});

const M = (
  madhab: CalculationInput["madhab"],
  name: string,
  heirs: CalculationInput["heirs"],
  expect: Record<string, string>,
  expectAbsentExclusions: string[],
): Case =>
  E(name, heirs, expect, { madhab }, undefined, {
    expectAbsentExclusions,
  });

const cases: Case[] = [
  // 1. Husband + 2 daughters + father + mother
  // H=1/4, 2D=2/3, F=1/6, M=1/6 → 1/4+2/3+1/6+1/6 = 3/12+8/12+2/12+2/12 = 15/12 → 'awl
  E(
    "H + 2D + F + M ('Awl)",
    { husband: 1, daughter: 2, father: 1, mother: 1 },
    { husband: "3/15", daughter: "8/15", father: "2/15", mother: "2/15" },
    { deceasedGender: "female" },
    undefined,
    { expectAwl: { from: 12, to: 15 } },
  ),

  // 2. Wife + son + daughter (basic asabah 2:1)
  // W=1/8, remainder=7/8; son:daughter = 2:1 → S=14/24=7/12, D=7/24
  E(
    "W + S + D",
    { wife: 1, son: 1, daughter: 1 },
    { wife: "1/8", son: "7/12", daughter: "7/24" },
  ),

  // 3. Umariyyatain — Husband + Father + Mother (no other heirs)
  // H=1/2, remainder=1/2, M=1/3 of 1/2 = 1/6, F=asabah=1/3
  E(
    "Umariyyatain (H+F+M)",
    { husband: 1, father: 1, mother: 1 },
    { husband: "1/2", mother: "1/6", father: "1/3" },
    { deceasedGender: "female" },
  ),

  // 4. Umariyyatain — Wife + Father + Mother
  // W=1/4, M=1/3 of 3/4 = 1/4, F=1/2
  E(
    "Umariyyatain (W+F+M)",
    { wife: 1, father: 1, mother: 1 },
    { wife: "1/4", mother: "1/4", father: "1/2" },
  ),

  // 5. Granddaughter completes 2/3 with one daughter
  // 1D=1/2, 1GD=1/6, mother=1/6 (descendants), residue 1/6 to... no asabah → Radd
  // Without son/grandson/father/PGF/spouse, totals: D=1/2, GD=1/6, M=1/6 = 5/6, surplus 1/6 → Radd to all (no spouse)
  E(
    "1 Daughter + 1 Granddaughter + Mother (Radd)",
    { daughter: 1, granddaughter: 1, mother: 1 },
    { daughter: "3/5", granddaughter: "1/5", mother: "1/5" },
    {},
    undefined,
    { expectRadd: true },
  ),

  // 6. PGF acts as father when father absent
  // W=1/8, 2 sons, PGF=1/6, mother=1/6: M=4/24, PGF=4/24, W=3/24, sons=13/24
  E(
    "W + PGF + M + 2 Sons",
    { wife: 1, paternalGrandfather: 1, mother: 1, son: 2 },
    {
      wife: "1/8",
      paternalGrandfather: "1/6",
      mother: "1/6",
      son: "13/24",
    },
  ),

  // 7. Grandmother sharing
  // 1 daughter + maternal granny + paternal granny + paternal uncle
  // D=1/2, grannies share 1/6 → each 1/12, uncle = asabah = 1/2 - 1/12*2 - ... 
  // Total fixed: 1/2 + 1/6 = 2/3, asabah = 1/3 to uncle
  E(
    "Daughter + 2 Grannies + Full Uncle",
    { daughter: 1, maternalGrandmother: 1, paternalGrandmother: 1, fullPaternalUncle: 1 },
    {
      daughter: "1/2",
      maternalGrandmother: "1/12",
      paternalGrandmother: "1/12",
      fullPaternalUncle: "1/3",
    },
  ),

  // 8. Full sister becomes asabah ma'a ghayrihi
  // 1 daughter + full sister (no brother). D=1/2, FS takes remainder 1/2 as asabah
  E(
    "Daughter + Full Sister (asabah ma'a ghayrihi)",
    { daughter: 1, fullSister: 1 },
    { daughter: "1/2", fullSister: "1/2" },
  ),

  // 9. Uterine siblings split equally regardless of gender
  // M=1/6 (2+ siblings), 2 uterine = 1/3, husband = 1/2
  // total = 1/6+1/3+1/2 = 1/6+2/6+3/6=6/6 = 1
  E(
    "H + M + 2 Uterine",
    { husband: 1, mother: 1, maternalHalfSibling: 2 },
    { husband: "1/2", mother: "1/6", maternalHalfSibling: "1/3" },
    { deceasedGender: "female" },
  ),

  // 10. Extended asabah: only nephew left
  // Mother=1/3, nephew = 2/3 asabah
  E(
    "Mother + Full Brother's Son",
    { mother: 1, fullBrothersSon: 1 },
    { mother: "1/3", fullBrothersSon: "2/3" },
  ),

  // 11. Granddaughter excluded by 2 daughters
  // 2D=2/3, 1GD excluded, mother=1/6, residue→Radd (no spouse)
  // D=2/3, M=1/6 = 5/6, surplus 1/6 → radd
  E(
    "2 Daughters + Granddaughter (excluded) + Mother",
    { daughter: 2, granddaughter: 1, mother: 1 },
    { daughter: "4/5", mother: "1/5" },
    {},
    ["granddaughter"],
    { expectRadd: true },
  ),

  // 12. Cons sister completes 2/3 with one full sister
  E(
    "1 Full Sister + 1 Cons Sister + Mother",
    { fullSister: 1, paternalHalfSister: 1, mother: 1 },
    // FS=1/2, CS=1/6, M=1/6 = 5/6, residue 1/6 → Radd
    { fullSister: "3/5", paternalHalfSister: "1/5", mother: "1/5" },
    {},
    undefined,
    { expectRadd: true },
  ),

  // 13. Spouse alone does not receive Radd in Hanafi; residue remains undistributed.
  E(
    "Wife alone leaves residue",
    { wife: 1 },
    { wife: "1/4" },
    {},
    undefined,
    { expectResidue: 18 },
  ),

  // 14. Spouse is excluded from Radd, so mother receives the surplus.
  E(
    "Husband + Mother (Radd to mother only)",
    { husband: 1, mother: 1 },
    { husband: "1/2", mother: "1/2" },
    { deceasedGender: "female" },
    undefined,
    { expectRadd: true },
  ),

  // 15. Mother alone receives the entire estate by Radd.
  E(
    "Mother alone",
    { mother: 1 },
    { mother: "1/1" },
    {},
    undefined,
    { expectRadd: true },
  ),

  // 16. Father alone receives the entire estate as pure Asabah.
  E(
    "Father alone",
    { father: 1 },
    { father: "1/1" },
    {},
    undefined,
    { expectKinds: { father: ["asabah"] } },
  ),

  // 17. Father receives 1/6 fixed plus residue with a female descendant.
  E(
    "Wife + Daughter + Father",
    { wife: 1, daughter: 1, father: 1 },
    { wife: "1/8", daughter: "1/2", father: "3/8" },
    {},
    undefined,
    { expectKinds: { father: ["fixed", "asabah"] } },
  ),

  // 18. Hanafi: paternal grandfather fully blocks full siblings.
  E(
    "Wife + PGF + Full Brother",
    { wife: 1, paternalGrandfather: 1, fullBrother: 1 },
    { wife: "1/4", paternalGrandfather: "3/4" },
    {},
    ["fullBrother"],
  ),

  // 19. Hanafi: paternal grandfather blocks uterine siblings.
  E(
    "PGF + Uterine Sibling",
    { paternalGrandfather: 1, maternalHalfSibling: 1 },
    { paternalGrandfather: "1/1" },
    {},
    ["maternalHalfSibling"],
  ),

  // 20. Father blocks paternal grandfather and paternal grandmother.
  E(
    "Father blocks PGF and paternal grandmother",
    { father: 1, paternalGrandfather: 1, paternalGrandmother: 1 },
    { father: "1/1" },
    {},
    ["paternalGrandfather", "paternalGrandmother"],
  ),

  // 21. Son excludes grandson, while children split residue 2:1.
  E(
    "Son + Daughter + Grandson",
    { son: 1, daughter: 1, grandson: 1 },
    { son: "2/3", daughter: "1/3" },
    {},
    ["grandson"],
  ),

  // 22. Two or more siblings reduce mother's share to 1/6.
  E(
    "Mother + 2 Full Brothers",
    { mother: 1, fullBrother: 2 },
    { mother: "1/6", fullBrother: "5/6" },
  ),

  // 23. Consanguine sisters are blocked by two full sisters.
  E(
    "2 Full Sisters + Cons Sister + Mother",
    { fullSister: 2, paternalHalfSister: 1, mother: 1 },
    { fullSister: "4/5", mother: "1/5" },
    {},
    ["paternalHalfSister"],
    { expectRadd: true },
  ),

  // 24. One daughter blocks no full sister; sister becomes Asabah ma'a Ghayrihi.
  E(
    "Daughter + 2 Full Sisters",
    { daughter: 1, fullSister: 2 },
    { daughter: "1/2", fullSister: "1/2" },
    {},
    undefined,
    { expectKinds: { fullSister: ["asabahMaaGhayrihi"] } },
  ),

  // 25. Shafi'i: PGF shares by muqasamah with one full brother.
  E(
    "Shafi'i: PGF + Full Brother",
    { paternalGrandfather: 1, fullBrother: 1 },
    { paternalGrandfather: "1/2", fullBrother: "1/2" },
    { madhab: "shafii" },
    undefined,
    {
      expectKinds: { paternalGrandfather: ["asabah"], fullBrother: ["asabah"] },
      expectAbsentExclusions: ["fullBrother"],
    },
  ),

  // 26. Shafi'i: PGF is treated as a brother unit against a full sister.
  E(
    "Shafi'i: PGF + Full Sister",
    { paternalGrandfather: 1, fullSister: 1 },
    { paternalGrandfather: "2/3", fullSister: "1/3" },
    { madhab: "shafii" },
    undefined,
    {
      expectKinds: { paternalGrandfather: ["asabah"], fullSister: ["asabah"] },
      expectAbsentExclusions: ["fullSister"],
    },
  ),

  // 27. Shafi'i: PGF takes 1/3 when it is better than muqasamah.
  E(
    "Shafi'i: PGF + 3 Full Brothers",
    { paternalGrandfather: 1, fullBrother: 3 },
    { paternalGrandfather: "1/3", fullBrother: "2/3" },
    { madhab: "shafii" },
    undefined,
    {
      expectKinds: { paternalGrandfather: ["asabah"], fullBrother: ["asabah"] },
      expectAbsentExclusions: ["fullBrother"],
    },
  ),

  // 28. Shafi'i: spouse share is taken first, then PGF shares the residue.
  E(
    "Shafi'i: Wife + PGF + Full Brother",
    { wife: 1, paternalGrandfather: 1, fullBrother: 1 },
    { wife: "1/4", paternalGrandfather: "3/8", fullBrother: "3/8" },
    { madhab: "shafii" },
    undefined,
    {
      expectKinds: { paternalGrandfather: ["asabah"], fullBrother: ["asabah"] },
      expectAbsentExclusions: ["fullBrother"],
    },
  ),

  // 29. Shafi'i: PGF does not exclude uterine siblings merely by being present.
  E(
    "Shafi'i: PGF + Uterine Sibling",
    { paternalGrandfather: 1, maternalHalfSibling: 1 },
    { paternalGrandfather: "5/6", maternalHalfSibling: "1/6" },
    { madhab: "shafii" },
    undefined,
    {
      expectKinds: {
        paternalGrandfather: ["asabah"],
        maternalHalfSibling: ["fixed"],
      },
      expectAbsentExclusions: ["maternalHalfSibling"],
    },
  ),

  M(
    "maliki",
    "Maliki: PGF + Full Brother",
    { paternalGrandfather: 1, fullBrother: 1 },
    { paternalGrandfather: "1/2", fullBrother: "1/2" },
    ["fullBrother"],
  ),

  M(
    "maliki",
    "Maliki: PGF + Full Sister",
    { paternalGrandfather: 1, fullSister: 1 },
    { paternalGrandfather: "2/3", fullSister: "1/3" },
    ["fullSister"],
  ),

  M(
    "maliki",
    "Maliki: PGF + 3 Full Brothers",
    { paternalGrandfather: 1, fullBrother: 3 },
    { paternalGrandfather: "1/3", fullBrother: "2/3" },
    ["fullBrother"],
  ),

  M(
    "hanbali",
    "Hanbali: PGF + Full Brother",
    { paternalGrandfather: 1, fullBrother: 1 },
    { paternalGrandfather: "1/2", fullBrother: "1/2" },
    ["fullBrother"],
  ),

  M(
    "hanbali",
    "Hanbali: PGF + Full Sister",
    { paternalGrandfather: 1, fullSister: 1 },
    { paternalGrandfather: "2/3", fullSister: "1/3" },
    ["fullSister"],
  ),

  M(
    "hanbali",
    "Hanbali: PGF + 3 Full Brothers",
    { paternalGrandfather: 1, fullBrother: 3 },
    { paternalGrandfather: "1/3", fullBrother: "2/3" },
    ["fullBrother"],
  ),
];

function fracEq(actual: { num: number; den: number }, expected: string): boolean {
  const [n, d] = expected.split("/").map(Number);
  const left = actual.num * d;
  const right = (n || 0) * actual.den;
  return left === right;
}

function parseFraction(expected: string): Fraction {
  const [num, den] = expected.split("/").map(Number);
  return { num, den };
}

function closeEnough(a: number, b: number): boolean {
  return Math.abs(a - b) < 0.0001;
}

let passed = 0;
let failed = 0;
const fails: string[] = [];

for (const c of cases) {
  const out = calculate(c.input);
  const got: Partial<
    Record<HeirId, { fraction: Fraction; count: number; kinds: ShareKind[] }>
  > = {};
  for (const s of out.shares) {
    const existing = got[s.heir];
    got[s.heir] = {
      fraction: existing ? add(existing.fraction, s.fraction) : s.fraction,
      count: s.count,
      kinds: [...(existing?.kinds ?? []), s.kind],
    };
  }
  let ok = true;
  const detail: string[] = [];
  for (const [heir, expected] of Object.entries(c.expect)) {
    const gotShare = got[heir as HeirId];
    if (!gotShare) {
      ok = false;
      detail.push(`  missing ${heir} (expected ${expected})`);
    } else if (!fracEq(gotShare.fraction, expected)) {
      ok = false;
      detail.push(
        `  ${heir}: expected ${expected}, got ${gotShare.fraction.num}/${gotShare.fraction.den}`,
      );
    }
  }
  // Check no extra unexpected heirs
  for (const heir of Object.keys(got)) {
    if (!(heir in c.expect)) {
      const gotShare = got[heir as HeirId];
      ok = false;
      detail.push(
        `  unexpected ${heir} = ${gotShare?.fraction.num}/${gotShare?.fraction.den}`,
      );
    }
  }
  if (c.expectKinds) {
    for (const [heir, expectedKinds] of Object.entries(c.expectKinds)) {
      const gotKinds = got[heir as HeirId]?.kinds ?? [];
      for (const expectedKind of expectedKinds ?? []) {
        if (!gotKinds.includes(expectedKind)) {
          ok = false;
          detail.push(
            `  ${heir}: expected kind ${expectedKind}, got ${gotKinds.join(", ") || "none"}`,
          );
        }
      }
    }
  }
  // Check exclusions
  if (c.expectExclusions) {
    for (const h of c.expectExclusions) {
      if (!out.exclusions.find((e) => e.heir === h)) {
        ok = false;
        detail.push(`  expected exclusion of ${h}`);
      }
    }
  }
  if (c.expectAbsentExclusions) {
    for (const h of c.expectAbsentExclusions) {
      if (out.exclusions.find((e) => e.heir === h)) {
        ok = false;
        detail.push(`  unexpected exclusion of ${h}`);
      }
    }
  }
  if (c.expectAwl) {
    if (
      !out.awl ||
      out.awl.from !== c.expectAwl.from ||
      out.awl.to !== c.expectAwl.to
    ) {
      ok = false;
      detail.push(
        `  expected awl ${c.expectAwl.from}->${c.expectAwl.to}, got ${
          out.awl ? `${out.awl.from}->${out.awl.to}` : "none"
        }`,
      );
    }
  } else if (out.awl) {
    ok = false;
    detail.push(`  unexpected awl ${out.awl.from}->${out.awl.to}`);
  }
  if (c.expectRadd !== undefined) {
    if (!!out.radd !== c.expectRadd) {
      ok = false;
      detail.push(`  expected radd=${c.expectRadd}, got ${!!out.radd}`);
    }
  } else if (out.radd) {
    ok = false;
    detail.push("  unexpected radd");
  }
  if (c.expectResidue !== undefined) {
    if (!closeEnough(out.residue ?? 0, c.expectResidue)) {
      ok = false;
      detail.push(
        `  expected residue ${c.expectResidue}, got ${out.residue ?? 0}`,
      );
    }
  } else if (out.residue) {
    ok = false;
    detail.push(`  unexpected residue ${out.residue}`);
  }

  const expectedTotal =
    Object.values(c.expect).reduce((sum, expected) => {
      return sum + toNumber(parseFraction(expected)) * c.input.estate;
    }, 0) + (c.expectResidue ?? 0);
  if (!closeEnough(expectedTotal, c.input.estate)) {
    ok = false;
    detail.push(
      `  test expectation totals ${expectedTotal}, estate is ${c.input.estate}`,
    );
  }

  const actualTotal =
    out.shares.reduce((sum, share) => sum + share.amount, 0) +
    (out.residue ?? 0);
  if (!closeEnough(actualTotal, c.input.estate)) {
    ok = false;
    detail.push(`  output totals ${actualTotal}, estate is ${c.input.estate}`);
  }

  if (ok) {
    passed++;
    console.log(`✓ ${c.name}`);
  } else {
    failed++;
    fails.push(`✗ ${c.name}\n${detail.join("\n")}`);
  }
}

console.log(`\n${passed} passed, ${failed} failed`);
if (fails.length) {
  console.log("\nFailures:");
  for (const f of fails) console.log(f);
  process.exit(1);
}
