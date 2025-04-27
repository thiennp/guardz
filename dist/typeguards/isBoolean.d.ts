import type { TypeGuardFn } from "./isType";
/**
 * Checks if a value is a boolean.
 *
 * @param [value] - The value to check.
 * @param [config] - The effect of invalid type.
 * @return {boolean} Returns true if the value is a boolean, otherwise false.
 */
export declare const isBoolean: TypeGuardFn<boolean>;
