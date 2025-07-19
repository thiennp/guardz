import { generateTypeGuardError } from "./generateTypeGuardError";
import type { TypeGuardFn } from "./isType";

/**
 * Checks if a value is an ArrayBuffer object.
 *
 * @param value - The value to check
 * @param config - Optional configuration for error handling
 * @returns True if the value is an ArrayBuffer object, false otherwise
 * 
 * @example
 * ```typescript
 * import { isArrayBuffer } from 'guardz';
 * 
 * console.log(isArrayBuffer(new ArrayBuffer(8))); // true
 * console.log(isArrayBuffer(new Uint8Array(8).buffer)); // true
 * console.log(isArrayBuffer(new Uint8Array(8))); // false
 * console.log(isArrayBuffer([])); // false
 * console.log(isArrayBuffer({})); // false
 * console.log(isArrayBuffer(null)); // false
 * 
 * // With type narrowing
 * const data: unknown = new ArrayBuffer(16);
 * if (isArrayBuffer(data)) {
 *   // data is now typed as ArrayBuffer
 *   console.log(data.byteLength); // 16
 *   console.log(data.slice(0, 8)); // Creates a new ArrayBuffer
 * }
 * ```
 */
export const isArrayBuffer: TypeGuardFn<ArrayBuffer> = function (value, config): value is ArrayBuffer {
  if (!(value instanceof ArrayBuffer)) {
    if (config) {
      config.callbackOnError(generateTypeGuardError(value, config.identifier, "ArrayBuffer"));
    }
    return false;
  }
  return true;
}; 