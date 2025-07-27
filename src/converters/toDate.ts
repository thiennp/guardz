import type { DateLike } from '../types/DateLike';

/**
 * Converts a DateLike value to a Date object.
 * 
 * This utility function safely converts values that have been validated as DateLike
 * (Date objects, date strings, or numeric timestamps) to their actual Date representation.
 * Since DateLike is a branded type that guarantees the value can be converted to a Date,
 * this function is guaranteed to return a valid Date object.
 *
 * @param value - A DateLike value (Date, date string, or timestamp)
 * @returns The Date object representation of the value
 *
 * @example
 * ```typescript
 * import { isDateLike, toDate } from 'guardz';
 * import type { DateLike } from 'guardz';
 *
 * // Safe conversion after validation
 * const data: unknown = "2023-01-01";
 * if (isDateLike(data)) {
 *   const date = toDate(data); // TypeScript knows this is safe
 *   console.log(date.toISOString()); // "2023-01-01T00:00:00.000Z"
 * }
 *
 * // Direct usage with branded type
 * const dateLikeValue: DateLike = "2023-12-25T10:30:00Z";
 * const result = toDate(dateLikeValue);
 * console.log(result.getFullYear()); // 2023
 *
 * // Works with different input types
 * const date1 = toDate(new Date()); // Returns the same Date object
 * const date2 = toDate("2023-01-01"); // Creates Date from string
 * const date3 = toDate(1672531200000); // Creates Date from timestamp
 * const date4 = toDate("01/15/2023"); // Creates Date from various formats
 * ```
 */
export function toDate(value: DateLike): Date {
  if (value instanceof Date) {
    return value;
  }
  
  if (typeof value === 'number') {
    // Handle Unix timestamps (seconds) vs JavaScript timestamps (milliseconds)
    // If the number is less than 10000000000, it's likely a Unix timestamp in seconds
    if (value < 10000000000) {
      return new Date(value * 1000);
    }
    return new Date(value);
  }
  
  return new Date(value);
} 