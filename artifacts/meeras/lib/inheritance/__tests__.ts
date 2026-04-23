import { calculate } from ".";
import { CalculationInput } from "./types";

interface Case {
  name: string;
  input: CalculationInput;
  expect: Record<string, string>; // heir -> "num/den"
  expectExclusions?: string[];
}

const E = (
  name: string,
  heirs: CalculationInput["heirs"],
  expect: Record<string, string>,
  opts: Partial<CalculationInput> = {},
  expectExclusions?: string[],
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
});

const cases: Case[] = [
  // 1. Husband + 2 daughters + father + mother
  // H=1/4, 2D=2/3, F=1/6, M=1/6 → 1/4+2/3+1/6+1/6 = 3/12+8/12+2/12+2/12 = 15/12 → 'awl
  E(
    "H + 2D + F + M ('Awl)",
    { husband: 1, daughter: 2, father: 1, mother: 1 },
    { husband: "3/15", daughter: "8/15", father: "2/15", mother: "2/15" },
    { deceasedGender: "female" },
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
  ),

  // 12. Cons sister completes 2/3 with one full sister
  E(
    "1 Full Sister + 1 Cons Sister + Mother",
    { fullSister: 1, paternalHalfSister: 1, mother: 1 },
    // FS=1/2, CS=1/6, M=1/6 = 5/6, residue 1/6 → Radd
    { fullSister: "3/5", paternalHalfSister: "1/5", mother: "1/5" },
  ),
];

function fracEq(actual: { num: number; den: number }, expected: string): boolean {
  const [n, d] = expected.split("/").map(Number);
  const left = actual.num * d;
  const right = (n || 0) * actual.den;
  return left === right;
}

let passed = 0;
let failed = 0;
const fails: string[] = [];

for (const c of cases) {
  const out = calculate(c.input);
  const got: Record<string, { num: number; den: number; count: number }> = {};
  for (const s of out.shares) {
    got[s.heir] = { num: s.fraction.num, den: s.fraction.den, count: s.count };
  }
  let ok = true;
  const detail: string[] = [];
  for (const [heir, expected] of Object.entries(c.expect)) {
    if (!got[heir]) {
      ok = false;
      detail.push(`  missing ${heir} (expected ${expected})`);
    } else if (!fracEq(got[heir], expected)) {
      ok = false;
      detail.push(
        `  ${heir}: expected ${expected}, got ${got[heir].num}/${got[heir].den}`,
      );
    }
  }
  // Check no extra unexpected heirs
  for (const heir of Object.keys(got)) {
    if (!(heir in c.expect)) {
      ok = false;
      detail.push(
        `  unexpected ${heir} = ${got[heir].num}/${got[heir].den}`,
      );
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
