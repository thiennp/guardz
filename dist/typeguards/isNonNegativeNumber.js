"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isNonNegativeNumber = void 0;
const generateTypeGuardError_1 = require("./generateTypeGuardError");
/**
 * Checks if a value is a non-negative number.
 *
 * @param [value] - The value to check.
 * @param [config] - The effect of invalid type.
 * @returns {boolean} Returns true if the value is a non-negative number, otherwise false.
 */
const isNonNegativeNumber = function (value, config) {
    if (typeof value !== "number" || value < 0) {
        if (config) {
            config.callbackOnError((0, generateTypeGuardError_1.generateTypeGuardError)(value, config.identifier, "NonNegativeNumber"));
        }
        return false;
    }
    return true;
};
exports.isNonNegativeNumber = isNonNegativeNumber;
