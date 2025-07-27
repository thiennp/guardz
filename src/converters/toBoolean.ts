import type { BooleanLike } from '../types/BooleanLike';

/**
 * Converts a BooleanLike value to a boolean.
 * 
 * This utility function safely converts values that have been validated as BooleanLike
 * (booleans, boolean strings, or boolean numbers) to their actual boolean representation.
 * Since BooleanLike is a branded type that guarantees the value can be converted to a boolean,
 * this function is guaranteed to return a valid boolean.
 *
 * @param value - A BooleanLike value (boolean, "true"/"false", "1"/"0", or 1/0)
 * @returns The boolean representation of the value
 *
 * @example
 * ```typescript
 * import { isBooleanLike, toBoolean } from 'guardz';
 * import type { BooleanLike } from 'guardz';
 *
 * // Safe conversion after validation
 * const data: unknown = "true";
 * if (isBooleanLike(data)) {
 *   const bool = toBoolean(data); // TypeScript knows this is safe
 *   console.log(bool); // true
 * }
 *
 * // Direct usage with branded type
 * const booleanLikeValue: BooleanLike = "1";
 * const result = toBoolean(booleanLikeValue);
 * console.log(result); // true
 *
 * // Works with different input types
 * const bool1 = toBoolean(true);     // true
 * const bool2 = toBoolean(false);    // false
 * const bool3 = toBoolean("true");   // true
 * const bool4 = toBoolean("false");  // false
 * const bool5 = toBoolean("1");      // true
 * const bool6 = toBoolean("0");      // false
 * const bool7 = toBoolean(1);        // true
 * const bool8 = toBoolean(0);        // false
 * ```
 */
export function toBoolean(value: BooleanLike): boolean {
  if (typeof value === 'boolean') {
    return value;
  }
  
  if (typeof value === 'string') {
    const lower = value.toLowerCase().trim();
    return lower === 'true' || lower === '1';
  }
  
  // Must be number (1 or 0)
  return value === 1;
} 