import type { TypeGuardFn } from "./isType";
/**
 * Checks if a given value is an object with valid type properties.
 *
 * @param {(item: unknown) => boolean} predicate - The predicate function to apply to each property's value in the object.
 * @return {(value, MOCK_TYPE_GUARD_FN_CONFIG) => value is Record<string, T>} Returns a type-guard function that returns true if the
 *   value is an object with valid type properties, false otherwise.
 */
export declare function isObjectWithEachItem<T>(predicate: TypeGuardFn<T>): TypeGuardFn<Record<string, T>>;
