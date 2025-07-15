import { generateTypeGuardError } from "./generateTypeGuardError";
import type { NegativeNumber } from "@/types/NegativeNumber";
import type { TypeGuardFn } from "./isType";

/**
 * Checks if a value is a negative number (less than 0).
 * 
 * Note: This excludes zero, positive numbers, NaN, and Infinity.
 *
 * @param value - The value to check
 * @param config - Optional configuration for error handling
 * @returns True if the value is a negative number, false otherwise
 * 
 * @example
 * ```typescript
 * import { isNegativeNumber } from 'guardz';
 * 
 * console.log(isNegativeNumber(-1)); // true
 * console.log(isNegativeNumber(-42.5)); // true
 * console.log(isNegativeNumber(-0.001)); // true
 * console.log(isNegativeNumber(0)); // false (zero is not negative)
 * console.log(isNegativeNumber(1)); // false
 * console.log(isNegativeNumber(0.1)); // false
 * console.log(isNegativeNumber(NaN)); // false
 * console.log(isNegativeNumber(-Infinity)); // false
 * console.log(isNegativeNumber("-5")); // false
 * 
 * // With type narrowing
 * const data: unknown = getUserInput();
 * if (isNegativeNumber(data)) {
 *   // data is now typed as NegativeNumber
 *   console.log(Math.abs(data)); // Safe to convert to positive
 * }
 * ```
 */
export const isNegativeNumber: TypeGuardFn<NegativeNumber> = function (value, config): value is NegativeNumber {
  if (typeof value !== "number" || isNaN(value) || value >= 0 || !isFinite(value)) {
    if (config) {
      config.callbackOnError(generateTypeGuardError(value, config.identifier, "NegativeNumber"));
    }
    return false;
  }
  return true;
}; 