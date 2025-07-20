/**
 * Represents an array that contains at least one element
 * @example
 * const arr: NonEmptyArray<number> = [1, 2, 3]; // Valid
 * const invalid: NonEmptyArray<number> = []; // TypeScript error
 */
export type NonEmptyArray<T> = [T, ...T[]];
