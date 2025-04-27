import { NonNegativeNumber } from "../types/NonNegativeNumber";
import { TypeGuardFn } from "./isType";
/**
 * Checks if a value is a non-negative number.
 *
 * @param [value] - The value to check.
 * @param [config] - The effect of invalid type.
 * @returns {boolean} Returns true if the value is a non-negative number, otherwise false.
 */
export declare const isNonNegativeNumber: TypeGuardFn<NonNegativeNumber>;
