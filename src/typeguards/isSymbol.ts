import { generateTypeGuardError } from "./generateTypeGuardError";
import type { TypeGuardFn } from "./isType";

/**
 * Checks if a value is a Symbol.
 *
 * @param value - The value to check
 * @param config - Optional configuration for error handling
 * @returns True if the value is a Symbol, false otherwise
 * 
 * @example
 * ```typescript
 * import { isSymbol } from 'guardz';
 * 
 * console.log(isSymbol(Symbol())); // true
 * console.log(isSymbol(Symbol('description'))); // true
 * console.log(isSymbol(Symbol.iterator)); // true
 * console.log(isSymbol("symbol")); // false
 * console.log(isSymbol(123)); // false
 * console.log(isSymbol(null)); // false
 * 
 * // With type narrowing
 * const data: unknown = Symbol('user-id');
 * if (isSymbol(data)) {
 *   // data is now typed as Symbol
 *   console.log(data.description); // "user-id"
 *   console.log(typeof data); // "symbol"
 * }
 * ```
 */
export const isSymbol: TypeGuardFn<symbol> = function (value, config): value is symbol {
  if (typeof value !== "symbol") {
    if (config) {
      config.callbackOnError(generateTypeGuardError(value, config.identifier, "Symbol"));
    }
    return false;
  }
  return true;
}; 