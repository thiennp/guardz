/**
 * Represents a value that can be converted to a Date.
 * This includes Date objects, date strings, and numeric timestamps.
 * @example
 * const date: DateLike = new Date(); // Valid
 * const str: DateLike = "2023-01-01"; // Valid
 * const timestamp: DateLike = 1672531200000; // Valid
 * const invalid: DateLike = "invalid-date"; // TypeScript error
 */
export type DateLike = (Date | string | number) & { __brand: 'DateLike' }; 