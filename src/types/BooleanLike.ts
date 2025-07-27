/**
 * Represents a value that can be converted to a boolean.
 * This includes booleans, boolean strings ("true"/"false", "1"/"0"), and boolean numbers (1/0).
 * @example
 * const bool: BooleanLike = true; // Valid
 * const str: BooleanLike = "true"; // Valid
 * const num: BooleanLike = 1; // Valid
 * const invalid: BooleanLike = "yes"; // TypeScript error
 */
export type BooleanLike = (boolean | string | number) & { __brand: 'BooleanLike' }; 