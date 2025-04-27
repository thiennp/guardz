"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isOneOf = isOneOf;
const stringify_1 = require("../stringify");
/**
 * A function that takes a list of possible value in a same type,
 * and returns a new function that checks if a value is one of them.
 *
 * @param {function} acceptableValues - the list of values that is acceptable and are all in type T
 * @returns {function} - a function that returns true if the value is of the listed acceptable values, false otherwise
 */
function isOneOf(...acceptableValues) {
    return function (value, config) {
        const isValid = acceptableValues.some(function (acceptableValue) {
            return value === acceptableValue;
        });
        if (!isValid && config) {
            config.callbackOnError(`${config.identifier} (${(0, stringify_1.stringify)(value)}) must be one of following values ${acceptableValues
                .map(stringify_1.stringify)
                .join(" | ")}`);
        }
        return isValid;
    };
}
