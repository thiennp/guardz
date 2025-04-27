import type { TypeGuardFn } from "./isType";
/**
 * A function that takes a type guard function of type T,
 * and returns a new function that checks if a value is either of type T or null.
 *
 * @param {function} typeGuardFn - the callback function that checks if a value is of type T
 * @returns {function} - a function that returns true if the value is of type T or null, false otherwise
 */
export declare function isNullOr<T>(typeGuardFn: TypeGuardFn<T>): TypeGuardFn<T | null>;
