import type { TypeGuardFn } from './isType';
/**
 * Type-guard function that always returns true
 *
 * @param {unknown} _value - The value to be checked.
 * @return {boolean} always return true
 */
export declare const isAny: TypeGuardFn<unknown>;
