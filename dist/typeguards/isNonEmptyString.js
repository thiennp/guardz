"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isNonEmptyString = void 0;
const generateTypeGuardError_1 = require("../typeguards/generateTypeGuardError");
/**
 * Checks if a value is a non-empty string.
 *
 * @param [value] - The value to check.
 * @param [config] - The effect of invalid type.
 * @return {boolean} Returns true if the value is a non-empty string, otherwise false.
 */
const isNonEmptyString = function (value, config) {
    if (typeof value !== "string" || value.trim().length === 0) {
        if (config) {
            config.callbackOnError((0, generateTypeGuardError_1.generateTypeGuardError)(value, config.identifier, "NonEmptyString"));
        }
        return false;
    }
    return true;
};
exports.isNonEmptyString = isNonEmptyString;
