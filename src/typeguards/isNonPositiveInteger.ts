import { generateTypeGuardError } from "./generateTypeGuardError";
import type { NonPositiveInteger } from "@/types/NonPositiveInteger";
import type { TypeGuardFn } from "./isType";

/**
 * Checks if a value is a non-positive integer (less than or equal to 0 and a whole number).
 * 
 * Note: This includes zero but excludes positive numbers, decimals, NaN, and Infinity.
 *
 * @param value - The value to check
 * @param config - Optional configuration for error handling
 * @returns True if the value is a non-positive integer, false otherwise
 * 
 * @example
 * ```typescript
 * import { isNonPositiveInteger } from 'guardz';
 * 
 * console.log(isNonPositiveInteger(0)); // true
 * console.log(isNonPositiveInteger(-1)); // true
 * console.log(isNonPositiveInteger(-42)); // true
 * console.log(isNonPositiveInteger(-100)); // true
 * console.log(isNonPositiveInteger(1)); // false
 * console.log(isNonPositiveInteger(-1.5)); // false (not an integer)
 * console.log(isNonPositiveInteger(NaN)); // false
 * console.log(isNonPositiveInteger("-5")); // false
 * 
 * // With type narrowing
 * const data: unknown = getUserInput();
 * if (isNonPositiveInteger(data)) {
 *   // data is now typed as NonPositiveInteger
 *   console.log(`Level below ground: ${Math.abs(data)}`); // Safe to use as non-positive integer
 * }
 * ```
 */
export const isNonPositiveInteger: TypeGuardFn<NonPositiveInteger> = function (value, config): value is NonPositiveInteger {
  if (typeof value !== "number" || isNaN(value) || value > 0 || !isFinite(value) || !Number.isInteger(value)) {
    if (config) {
      config.callbackOnError(generateTypeGuardError(value, config.identifier, "NonPositiveInteger"));
    }
    return false;
  }
  return true;
};
