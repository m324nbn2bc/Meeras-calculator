import { calculateShafii } from "./shafii";
import type {
  CalculationInput,
  CalculationOutput,
  InheritanceEngine,
} from "../types";

export function calculateHanbali(input: CalculationInput): CalculationOutput {
  return calculateShafii(input);
}

export const hanbaliEngine: InheritanceEngine = {
  id: "hanbali",
  calculate: calculateHanbali,
};
