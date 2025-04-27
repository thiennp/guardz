"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isEqualTo = isEqualTo;
const stringify_1 = require("../stringify");
/**
 * Checks if a value is exactly equal to a given value.
 *
 * @param exactValue - The value to compare against.
 * @returns {TypeGuardFn<T>} A type guard function that returns true if the value is exactly equal to the given value, false otherwise.
 */
function isEqualTo(exactValue) {
    return function (value, config) {
        const isValid = value === exactValue;
        if (!isValid && config) {
            config.callbackOnError(`${config.identifier} (${(0, stringify_1.stringify)(value)}) must be exactly ${(0, stringify_1.stringify)(exactValue)}`);
        }
        return isValid;
    };
}
