import { generateTypeGuardError } from "./generateTypeGuardError";
import type { NonNegativeNumber } from "@/types/NonNegativeNumber";
import type { TypeGuardFn } from "./isType";

/**
 * Checks if a value is a non-negative number (greater than or equal to 0).
 * 
 * Note: This includes zero but excludes negative numbers, NaN, and Infinity.
 *
 * @param value - The value to check
 * @param config - Optional configuration for error handling
 * @returns True if the value is a non-negative number, false otherwise
 * 
 * @example
 * ```typescript
 * import { isNonNegativeNumber } from 'guardz';
 * 
 * console.log(isNonNegativeNumber(0)); // true
 * console.log(isNonNegativeNumber(1)); // true
 * console.log(isNonNegativeNumber(42.5)); // true
 * console.log(isNonNegativeNumber(-1)); // false
 * console.log(isNonNegativeNumber(-0.1)); // false
 * console.log(isNonNegativeNumber(NaN)); // false
 * console.log(isNonNegativeNumber(Infinity)); // false
 * console.log(isNonNegativeNumber("5")); // false
 * 
 * // With type narrowing
 * const data: unknown = getUserInput();
 * if (isNonNegativeNumber(data)) {
 *   // data is now typed as NonNegativeNumber
 *   console.log(Math.sqrt(data)); // Safe since we know it's non-negative
 * }
 * ```
 */
export const isNonNegativeNumber: TypeGuardFn<NonNegativeNumber> = function (value, config): value is NonNegativeNumber {
  if (typeof value !== "number" || isNaN(value) || value < 0 || !isFinite(value)) {
    if (config) {
      config.callbackOnError(generateTypeGuardError(value, config.identifier, "NonNegativeNumber"));
    }
    return false;
  }
  return true;
};
