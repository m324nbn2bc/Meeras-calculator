import { Fraction } from "./types";

export function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b > 0) {
    [a, b] = [b, a % b];
  }
  return a || 1;
}

export function lcm(a: number, b: number): number {
  return Math.abs(a * b) / gcd(a, b);
}

export function reduce(f: Fraction): Fraction {
  if (f.num === 0) return { num: 0, den: 1 };
  const g = gcd(f.num, f.den);
  return { num: f.num / g, den: f.den / g };
}

export function add(a: Fraction, b: Fraction): Fraction {
  return reduce({ num: a.num * b.den + b.num * a.den, den: a.den * b.den });
}

export function sub(a: Fraction, b: Fraction): Fraction {
  return reduce({ num: a.num * b.den - b.num * a.den, den: a.den * b.den });
}

export function mul(a: Fraction, b: Fraction): Fraction {
  return reduce({ num: a.num * b.num, den: a.den * b.den });
}

export function frac(num: number, den: number): Fraction {
  return reduce({ num, den });
}

export function isZero(f: Fraction): boolean {
  return f.num === 0;
}

export function toNumber(f: Fraction): number {
  return f.num / f.den;
}

export function formatFraction(f: Fraction): string {
  const r = reduce(f);
  if (r.num === 0) return "0";
  if (r.den === 1) return `${r.num}`;
  return `${r.num}/${r.den}`;
}
