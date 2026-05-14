import { calculateHanafi } from "./madhabs/hanafi";
import { hanbaliEngine } from "./madhabs/hanbali";
import { malikiEngine } from "./madhabs/maliki";
import { shafiiEngine } from "./madhabs/shafii";
import {
  CalculationInput,
  CalculationOutput,
  InheritanceEngine,
} from "./types";

export const hanafiEngine: InheritanceEngine = {
  id: "hanafi",
  calculate: calculateHanafi,
};

export const inheritanceEngines: Partial<
  Record<CalculationInput["madhab"], InheritanceEngine>
> = {
  hanafi: hanafiEngine,
  shafii: shafiiEngine,
  maliki: malikiEngine,
  hanbali: hanbaliEngine,
};

export function getInheritanceEngine(
  madhab: CalculationInput["madhab"],
): InheritanceEngine {
  return inheritanceEngines[madhab] ?? hanafiEngine;
}

export function calculate(input: CalculationInput): CalculationOutput {
  return getInheritanceEngine(input.madhab).calculate(input);
}

export * from "./types";
export { formatFraction, toNumber } from "./fractions";
