import { generateTypeGuardError } from "./generateTypeGuardError";
import type { TypeGuardFn } from "./isType";

/**
 * Checks if a value is a Function.
 *
 * @param value - The value to check
 * @param config - Optional configuration for error handling
 * @returns True if the value is a Function, false otherwise
 * 
 * @example
 * ```typescript
 * import { isFunction } from 'guardz';
 * 
 * console.log(isFunction(() => {})); // true
 * console.log(isFunction(function() {})); // true
 * console.log(isFunction(async () => {})); // true
 * console.log(isFunction(function*() {})); // true
 * console.log(isFunction(Math.max)); // true
 * console.log(isFunction("function")); // false
 * console.log(isFunction(123)); // false
 * console.log(isFunction(null)); // false
 * 
 * // With type narrowing
 * const data: unknown = (x: number) => x * 2;
 * if (isFunction(data)) {
 *   // data is now typed as Function
 *   console.log(data(5)); // 10
 *   console.log(data.name); // ""
 * }
 * ```
 */
export const isFunction: TypeGuardFn<Function> = function (value, config): value is Function {
  if (typeof value !== "function") {
    if (config) {
      config.callbackOnError(generateTypeGuardError(value, config.identifier, "Function"));
    }
    return false;
  }
  return true;
}; 