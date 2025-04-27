import type { TypeGuardFn } from "./isType";
/**
 * Generates a type guard function that checks if a value is any of the values from an enum.
 *
 * @template T - The type of the enum value.
 * @param {T extends Record<number | string, unknown>} enumValue - The enum value to check against.
 * @returns {TypeGuardFn<T[keyof T]>} - The type guard function.
 */
export declare function isEnum<T extends Record<number | string, unknown>>(enumValue: T): TypeGuardFn<T[keyof T]>;
