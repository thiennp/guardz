import type { NonEmptyString } from "../types/NonEmptyString";
import type { TypeGuardFn } from "./isType";
/**
 * Checks if a value is a non-empty string.
 *
 * @param [value] - The value to check.
 * @param [config] - The effect of invalid type.
 * @return {boolean} Returns true if the value is a non-empty string, otherwise false.
 */
export declare const isNonEmptyString: TypeGuardFn<NonEmptyString>;
