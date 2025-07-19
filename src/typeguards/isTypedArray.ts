import { generateTypeGuardError } from "./generateTypeGuardError";
import type { TypeGuardFn } from "./isType";

/**
 * Checks if a value is a TypedArray (Int8Array, Uint8Array, Int16Array, Uint16Array, etc.).
 * Optionally validates the element types of the TypedArray.
 *
 * @param elementGuard - Optional type guard for TypedArray elements
 * @returns A type guard function that validates TypedArray objects
 * 
 * @example
 * ```typescript
 * import { isTypedArray, isNumber } from 'guardz';
 * 
 * // Basic TypedArray validation
 * const isAnyTypedArray = isTypedArray();
 * console.log(isAnyTypedArray(new Int8Array())); // true
 * console.log(isAnyTypedArray(new Uint8Array([1, 2, 3]))); // true
 * console.log(isAnyTypedArray(new Float32Array([1.1, 2.2]))); // true
 * console.log(isAnyTypedArray([])); // false
 * console.log(isAnyTypedArray({})); // false
 * 
 * // TypedArray with specific element types
 * const isNumberTypedArray = isTypedArray(isNumber);
 * console.log(isNumberTypedArray(new Int8Array([1, 2, 3]))); // true
 * console.log(isNumberTypedArray(new Float64Array([1.1, 2.2]))); // true
 * 
 * // With type narrowing
 * const data: unknown = new Uint8Array([1, 2, 3, 4, 5]);
 * if (isTypedArray(isNumber)(data)) {
 *   // data is now typed as TypedArray<number>
 *   console.log(data.length); // 5
 *   console.log(data[0]); // 1
 * }
 * ```
 */
export function isTypedArray(elementGuard?: TypeGuardFn<number>): TypeGuardFn<TypedArray> {
  return function (value, config): value is TypedArray {
    // Check if it's any of the TypedArray types
    const isTypedArrayInstance = 
      value instanceof Int8Array ||
      value instanceof Uint8Array ||
      value instanceof Uint8ClampedArray ||
      value instanceof Int16Array ||
      value instanceof Uint16Array ||
      value instanceof Int32Array ||
      value instanceof Uint32Array ||
      value instanceof Float32Array ||
      value instanceof Float64Array;

    if (!isTypedArrayInstance) {
      if (config) {
        config.callbackOnError(generateTypeGuardError(value, config.identifier, "TypedArray"));
      }
      return false;
    }

    // If no element guard provided, just validate it's a TypedArray
    if (!elementGuard) {
      return true;
    }

    // Validate each element if guard is provided
    const typedArray = value as TypedArray;
    for (let i = 0; i < typedArray.length; i++) {
      if (!elementGuard(typedArray[i], config ? { ...config, identifier: `${config.identifier}[${i}]` } : null)) {
        return false;
      }
    }

    return true;
  };
}

// Type alias for TypedArray
type TypedArray = 
  | Int8Array 
  | Uint8Array 
  | Uint8ClampedArray 
  | Int16Array 
  | Uint16Array 
  | Int32Array 
  | Uint32Array 
  | Float32Array 
  | Float64Array; 