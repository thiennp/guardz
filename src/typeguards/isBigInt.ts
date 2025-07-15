import { generateTypeGuardError } from "./generateTypeGuardError";
import type { TypeGuardFn } from "./isType";

/**
 * Checks if a value is a BigInt.
 * 
 * This validates values of the BigInt type, which is used for integers
 * larger than the safe integer range in JavaScript (beyond 2^53 - 1).
 * Useful for validating large identifiers, financial amounts, or timestamps.
 *
 * @param value - The value to check
 * @param config - Optional configuration for error handling
 * @returns True if the value is a BigInt, false otherwise
 * 
 * @example
 * ```typescript
 * import { isBigInt } from 'guardz';
 * 
 * console.log(isBigInt(123n)); // true
 * console.log(isBigInt(BigInt(123))); // true
 * console.log(isBigInt(BigInt("9007199254740991"))); // true
 * console.log(isBigInt(123)); // false (regular number)
 * console.log(isBigInt("123n")); // false (string)
 * console.log(isBigInt(null)); // false
 * 
 * // Useful for validating large IDs or financial data
 * const data: unknown = getDataFromAPI();
 * if (isBigInt(data)) {
 *   // data is now typed as bigint
 *   console.log(`Large ID: ${data.toString()}`);
 * }
 * 
 * // Common use cases:
 * // - Database IDs that exceed safe integer range
 * // - Financial amounts in smallest currency units (e.g., satoshis)
 * // - High-precision timestamps
 * // - Large mathematical calculations
 * ```
 */
export const isBigInt: TypeGuardFn<bigint> = function (value, config): value is bigint {
  if (typeof value !== "bigint") {
    if (config) {
      config.callbackOnError(generateTypeGuardError(value, config.identifier, "bigint"));
    }
    return false;
  }
  return true;
}; 