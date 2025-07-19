import { generateTypeGuardError } from "./generateTypeGuardError";
import type { TypeGuardFn } from "./isType";

/**
 * Checks if a value is a DataView object.
 *
 * @param value - The value to check
 * @param config - Optional configuration for error handling
 * @returns True if the value is a DataView object, false otherwise
 * 
 * @example
 * ```typescript
 * import { isDataView } from 'guardz';
 * 
 * const buffer = new ArrayBuffer(16);
 * console.log(isDataView(new DataView(buffer))); // true
 * console.log(isDataView(new DataView(buffer, 0, 8))); // true
 * console.log(isDataView(buffer)); // false
 * console.log(isDataView(new Uint8Array(buffer))); // false
 * console.log(isDataView([])); // false
 * console.log(isDataView({})); // false
 * console.log(isDataView(null)); // false
 * 
 * // With type narrowing
 * const data: unknown = new DataView(new ArrayBuffer(16));
 * if (isDataView(data)) {
 *   // data is now typed as DataView
 *   console.log(data.byteLength); // 16
 *   console.log(data.getUint8(0)); // Reads first byte
 *   data.setUint16(0, 12345); // Writes 16-bit value
 * }
 * ```
 */
export const isDataView: TypeGuardFn<DataView> = function (value, config): value is DataView {
  if (!(value instanceof DataView)) {
    if (config) {
      config.callbackOnError(generateTypeGuardError(value, config.identifier, "DataView"));
    }
    return false;
  }
  return true;
}; 