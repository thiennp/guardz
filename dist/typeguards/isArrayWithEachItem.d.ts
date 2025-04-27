import type { TypeGuardFn } from "./isType";
/**
 * Checks if a given value is an array with valid type items.
 *
 * @param {(item: unknown) => boolean} predicate - The predicate function to apply to each item in the array.
 * @return {(value, MOCK_TYPE_GUARD_FN_CONFIG) => value is T[]} Returns a type-guard function that returns true if the
 *   value is an array with valid type items, false otherwise.
 */
export declare function isArrayWithEachItem<T>(predicate: TypeGuardFn<T>): TypeGuardFn<T[]>;
