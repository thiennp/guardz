import { generateTypeGuardError } from "./generateTypeGuardError";
import type { NegativeInteger } from "@/types/NegativeInteger";
import type { TypeGuardFn } from "./isType";

/**
 * Checks if a value is a negative integer (less than 0 and a whole number).
 * 
 * Note: This excludes zero, positive numbers, decimals, NaN, and Infinity.
 *
 * @param value - The value to check
 * @param config - Optional configuration for error handling
 * @returns True if the value is a negative integer, false otherwise
 * 
 * @example
 * ```typescript
 * import { isNegativeInteger } from 'guardz';
 * 
 * console.log(isNegativeInteger(-1)); // true
 * console.log(isNegativeInteger(-42)); // true
 * console.log(isNegativeInteger(-100)); // true
 * console.log(isNegativeInteger(0)); // false (zero is not negative)
 * console.log(isNegativeInteger(1)); // false
 * console.log(isNegativeInteger(-1.5)); // false (not an integer)
 * console.log(isNegativeInteger(NaN)); // false
 * console.log(isNegativeInteger("-5")); // false
 * 
 * // With type narrowing
 * const data: unknown = getUserInput();
 * if (isNegativeInteger(data)) {
 *   // data is now typed as NegativeInteger
 *   console.log(`Debt amount: ${Math.abs(data)}`); // Safe to use as negative integer
 * }
 * ```
 */
export const isNegativeInteger: TypeGuardFn<NegativeInteger> = function (value, config): value is NegativeInteger {
  if (typeof value !== "number" || isNaN(value) || value >= 0 || !isFinite(value) || !Number.isInteger(value)) {
    if (config) {
      config.callbackOnError(generateTypeGuardError(value, config.identifier, "NegativeInteger"));
    }
    return false;
  }
  return true;
}; 