/**
 * Represents a value that can be converted to a number.
 * This includes numbers and strings that can be parsed as numbers.
 * @example
 * const num: Numeric = 42; // Valid
 * const str: Numeric = "123"; // Valid
 * const invalid: Numeric = "abc"; // TypeScript error
 */
export type Numeric = (number | string) & { __brand: 'Numeric' }; 