import type { TypeGuardFn } from "./isType";
/**
 * Checks if a value is of type Date.
 *
 * @param [value] - The value to be checked.
 * @param [config] - The effect of invalid type.
 * @return {boolean} Returns true if the value is of type Date, otherwise false.
 */
export declare const isDate: TypeGuardFn<Date>;
