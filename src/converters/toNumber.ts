import type { Numeric } from '../types/Numeric';

/**
 * Converts a Numeric value to a number.
 * 
 * This utility function safely converts values that have been validated as Numeric
 * (numbers or strings that can be converted to numbers) to their actual number representation.
 * Since Numeric is a branded type that guarantees the value can be converted to a number,
 * this function is guaranteed to return a valid number.
 *
 * @param value - A Numeric value (number or string that can be converted to number)
 * @returns The number representation of the value
 *
 * @example
 * ```typescript
 * import { isNumeric, toNumber } from 'guardz';
 * import type { Numeric } from 'guardz';
 *
 * // Safe conversion after validation
 * const data: unknown = "123";
 * if (isNumeric(data)) {
 *   const num = toNumber(data); // TypeScript knows this is safe
 *   console.log(num.toFixed(2)); // 123.00
 * }
 *
 * // Direct usage with branded type
 * const numericValue: Numeric = "42.5";
 * const result = toNumber(numericValue); // 42.5
 * console.log(typeof result); // "number"
 *
 * // Works with both string and number inputs
 * const num1 = toNumber("100"); // 100
 * const num2 = toNumber(200);   // 200
 * const num3 = toNumber("3.14"); // 3.14
 * ```
 */
export function toNumber(value: Numeric): number {
  return typeof value === 'number' ? value : Number(value);
} 