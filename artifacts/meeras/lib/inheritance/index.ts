import { calculateHanafi } from "./madhabs/hanafi";
import { CalculationInput, CalculationOutput } from "./types";

type Engine = (input: CalculationInput) => CalculationOutput;

const engines: Record<string, Engine> = {
  hanafi: calculateHanafi,
  // Add other madhabs here as they become available.
  // shafii: calculateShafii,
  // maliki: calculateMaliki,
  // hanbali: calculateHanbali,
};

export function calculate(input: CalculationInput): CalculationOutput {
  const engine = engines[input.madhab] ?? calculateHanafi;
  return engine(input);
}

export * from "./types";
export { formatFraction } from "./fractions";
