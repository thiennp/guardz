import type { TypeGuardFn } from "./isType";
/**
 * Checks if a value is a partial of a given type.
 *
 * @param propsTypesToCheck - The properties to check in the value.
 * @return {TypeGuardFn<Partial<T>>} - A type guard function that returns true if the value is a partial of the given type, false otherwise.
 */
export declare function isPartialOf<T>(propsTypesToCheck: {
    [P in keyof T]: TypeGuardFn<T[P]>;
}): TypeGuardFn<Partial<T>>;
