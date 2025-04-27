import type { TypeGuardFn } from "./isType";
/**
 * Combines multiple isType functions and returns true if at least one of them returns true.
 *
 * @param typeGuards - an array of isType functions
 * @returns true if the value passes at least one of the type guards, otherwise false
 */
export declare function isOneOfTypes<T>(...typeGuards: TypeGuardFn<T>[]): TypeGuardFn<T>;
