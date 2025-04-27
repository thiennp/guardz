import type { TypeGuardFn } from "./isType";
/**
 * Checks if a value is exactly equal to a given value.
 *
 * @param exactValue - The value to compare against.
 * @returns {TypeGuardFn<T>} A type guard function that returns true if the value is exactly equal to the given value, false otherwise.
 */
export declare function isEqualTo<T>(exactValue: T): TypeGuardFn<T>;
