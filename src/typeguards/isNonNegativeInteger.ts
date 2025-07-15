import { generateTypeGuardError } from "./generateTypeGuardError";
import type { NonNegativeInteger } from "@/types/NonNegativeInteger";
import type { TypeGuardFn } from "./isType";

/**
 * Checks if a value is a non-negative integer (greater than or equal to 0 and a whole number).
 * 
 * Note: This includes zero but excludes negative numbers, decimals, NaN, and Infinity.
 *
 * @param value - The value to check
 * @param config - Optional configuration for error handling
 * @returns True if the value is a non-negative integer, false otherwise
 * 
 * @example
 * ```typescript
 * import { isNonNegativeInteger } from 'guardz';
 * 
 * console.log(isNonNegativeInteger(0)); // true
 * console.log(isNonNegativeInteger(1)); // true
 * console.log(isNonNegativeInteger(42)); // true
 * console.log(isNonNegativeInteger(100)); // true
 * console.log(isNonNegativeInteger(-1)); // false
 * console.log(isNonNegativeInteger(1.5)); // false (not an integer)
 * console.log(isNonNegativeInteger(NaN)); // false
 * console.log(isNonNegativeInteger("5")); // false
 * 
 * // With type narrowing
 * const data: unknown = getUserInput();
 * if (isNonNegativeInteger(data)) {
 *   // data is now typed as NonNegativeInteger
 *   console.log(`Count: ${data}`); // Safe to use as non-negative integer
 * }
 * ```
 */
export const isNonNegativeInteger: TypeGuardFn<NonNegativeInteger> = function (value, config): value is NonNegativeInteger {
  if (typeof value !== "number" || isNaN(value) || value < 0 || !isFinite(value) || !Number.isInteger(value)) {
    if (config) {
      config.callbackOnError(generateTypeGuardError(value, config.identifier, "NonNegativeInteger"));
    }
    return false;
  }
  return true;
}; 