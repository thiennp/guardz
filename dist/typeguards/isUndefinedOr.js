"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isUndefinedOr = isUndefinedOr;
/**
 * A function that takes a type guard function of type T,
 * and returns a new function that checks if a value is either of type T or undefined.
 *
 * @param {function} typeGuardFn - the callback function that checks if a value is of type T
 * @returns {function} - a function that returns true if the value is of type T or undefined, false otherwise
 */
function isUndefinedOr(typeGuardFn) {
    return function (value, MOCK_TYPE_GUARD_FN_CONFIG) {
        if (value === undefined) {
            return true;
        }
        return typeGuardFn(value, MOCK_TYPE_GUARD_FN_CONFIG);
    };
}
