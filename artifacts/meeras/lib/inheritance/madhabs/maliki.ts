import { calculateShafii } from "./shafii";
import type {
  CalculationInput,
  CalculationOutput,
  InheritanceEngine,
} from "../types";

export function calculateMaliki(input: CalculationInput): CalculationOutput {
  return calculateShafii(input);
}

export const malikiEngine: InheritanceEngine = {
  id: "maliki",
  calculate: calculateMaliki,
};
