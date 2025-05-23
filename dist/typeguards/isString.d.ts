import type { TypeGuardFn } from "./isType";
/**
 * Checks if a value is a string.
 *
 * @param [value] - The value to check.
 * @param [config] - The effect of invalid type.
 * @return {boolean} Returns true if the value is a string, otherwise false.
 */
export declare const isString: TypeGuardFn<string>;
