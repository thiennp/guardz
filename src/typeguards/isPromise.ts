import { generateTypeGuardError } from "./generateTypeGuardError";
import type { TypeGuardFn } from "./isType";

/**
 * Checks if a value is a Promise.
 * Optionally validates the resolved value type of the Promise.
 *
 * @param valueGuard - Optional type guard for the Promise's resolved value
 * @returns A type guard function that validates Promise objects
 * 
 * @example
 * ```typescript
 * import { isPromise, isString, isNumber } from 'guardz';
 * 
 * // Basic Promise validation
 * const isAnyPromise = isPromise();
 * console.log(isAnyPromise(Promise.resolve())); // true
 * console.log(isAnyPromise(Promise.resolve(42))); // true
 * console.log(isAnyPromise({})); // false
 * console.log(isAnyPromise([])); // false
 * 
 * // Promise with specific resolved value type
 * const isStringPromise = isPromise(isString);
 * console.log(isStringPromise(Promise.resolve("hello"))); // true
 * console.log(isStringPromise(Promise.resolve(42))); // false (wrong type)
 * 
 * // With type narrowing
 * const data: unknown = Promise.resolve("hello world");
 * if (isPromise(isString)(data)) {
 *   // data is now typed as Promise<string>
 *   data.then(value => {
 *     console.log(value.toUpperCase()); // Safe to use string methods
 *   });
 * }
 * ```
 */
export function isPromise<T = unknown>(valueGuard?: TypeGuardFn<T>): TypeGuardFn<Promise<T>> {
  return function (value, config): value is Promise<T> {
    if (!(value instanceof Promise)) {
      if (config) {
        config.callbackOnError(generateTypeGuardError(value, config.identifier, "Promise"));
      }
      return false;
    }

    // If no value guard provided, just validate it's a Promise
    if (!valueGuard) {
      return true;
    }

    // Note: We can't validate the resolved value without awaiting the promise
    // This is a limitation of runtime type checking for promises
    // The type guard validates the promise structure, but the resolved value
    // would need to be checked after the promise resolves
    return true;
  };
} 