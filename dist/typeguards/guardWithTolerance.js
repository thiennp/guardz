"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.guardWithTolerance = guardWithTolerance;
/**
 * Guards a value with a type guard function and returns the value if it passes the type guard, otherwise returns the value as the type T.
 *
 * @param data - The value to guard.
 * @param typeGuardFn - The type guard function to use.
 * @param config - The config to use.
 */
function guardWithTolerance(data, typeGuardFn, config) {
    return typeGuardFn(data, config) ? data : data;
}
