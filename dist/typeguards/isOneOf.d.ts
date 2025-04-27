import type { TypeGuardFn } from "./isType";
/**
 * A function that takes a list of possible value in a same type,
 * and returns a new function that checks if a value is one of them.
 *
 * @param {function} acceptableValues - the list of values that is acceptable and are all in type T
 * @returns {function} - a function that returns true if the value is of the listed acceptable values, false otherwise
 */
export declare function isOneOf<T>(...acceptableValues: T[]): TypeGuardFn<T>;
