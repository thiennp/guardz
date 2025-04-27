import type { TypeGuardFn } from "./isType";
/**
 * Checks if a value is not null and not undefined.
 *
 * @param [value] - The value to check.
 * @param [config] - The effect of invalid type.
 * @return {boolean} Returns true if the value is not null and not undefined, otherwise false.
 */
export declare const isDefined: TypeGuardFn<NonNullable<unknown>>;
