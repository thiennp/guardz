import { isOneOf } from "./isOneOf";
import type { TypeGuardFn } from "./isType";

/**
 * Generates a type guard function that checks if a value is any of the values from an enum.
 *
 * @template T - The type of the enum value.
 * @param {T extends Record<number | string, unknown>} enumValue - The enum value to check against.
 * @returns {TypeGuardFn<T[keyof T]>} - The type guard function.
 */
export function isEnum<T extends Record<number | string, unknown>>(enumValue: T): TypeGuardFn<T[keyof T]> {
  // Filter values to exclude reverse-mapped string keys for numeric enums
  const enumMembers = Object.values(enumValue).filter((v) => typeof v === 'number') as T[keyof T][];
  // If the filtered list is empty (e.g., string enum), use the original values
  const valuesToCheck = enumMembers.length > 0 ? enumMembers : (Object.values(enumValue) as T[keyof T][]);
  
  return function (value, config): value is T[keyof T] {
    return isOneOf(...valuesToCheck)(value, config);
  };
}
