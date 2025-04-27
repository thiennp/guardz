import type { TypeGuardFn } from "./isType";
export type NonNullObject = Record<number | string, unknown>;
/**
 * Checks if a value is a non-null object.
 *
 * @param [value] - The value to check.
 * @param [config] - The effect of invalid type.
 * @returns {boolean} Returns true if the value is a non-null object, otherwise false.
 */
export declare const isNonNullObject: TypeGuardFn<NonNullObject>;
