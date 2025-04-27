import type { TypeGuardFn, TypeGuardFnConfig } from "./isType";
/**
 * Guards a value with a type guard function and returns the value if it passes the type guard, otherwise returns the value as the type T.
 *
 * @param data - The value to guard.
 * @param typeGuardFn - The type guard function to use.
 * @param config - The config to use.
 */
export declare function guardWithTolerance<T>(data: unknown, typeGuardFn: TypeGuardFn<T>, config?: TypeGuardFnConfig | null): T;
