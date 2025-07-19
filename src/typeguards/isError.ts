import { generateTypeGuardError } from "./generateTypeGuardError";
import type { TypeGuardFn } from "./isType";

/**
 * Checks if a value is an Error object.
 *
 * @param value - The value to check
 * @param config - Optional configuration for error handling
 * @returns True if the value is an Error object, false otherwise
 * 
 * @example
 * ```typescript
 * import { isError } from 'guardz';
 * 
 * console.log(isError(new Error())); // true
 * console.log(isError(new Error("Something went wrong"))); // true
 * console.log(isError(new TypeError("Type error"))); // true
 * console.log(isError(new ReferenceError("Reference error"))); // true
 * console.log(isError("error message")); // false
 * console.log(isError({ message: "error" })); // false
 * console.log(isError(null)); // false
 * 
 * // With type narrowing
 * const data: unknown = new Error("Database connection failed");
 * if (isError(data)) {
 *   // data is now typed as Error
 *   console.log(data.message); // "Database connection failed"
 *   console.log(data.name); // "Error"
 *   console.log(data.stack); // Stack trace
 * }
 * ```
 */
export const isError: TypeGuardFn<Error> = function (value, config): value is Error {
  if (!(value instanceof Error)) {
    if (config) {
      config.callbackOnError(generateTypeGuardError(value, config.identifier, "Error"));
    }
    return false;
  }
  return true;
}; 