"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isNonNullObject = void 0;
const generateTypeGuardError_1 = require("../typeguards/generateTypeGuardError");
/**
 * Checks if a value is a non-null object.
 *
 * @param [value] - The value to check.
 * @param [config] - The effect of invalid type.
 * @returns {boolean} Returns true if the value is a non-null object, otherwise false.
 */
const isNonNullObject = function (value, config) {
    const isValid = typeof value === "object" && value != null;
    if (!isValid && config) {
        config.callbackOnError((0, generateTypeGuardError_1.generateTypeGuardError)(value, config.identifier, "non-null object"));
    }
    return isValid;
};
exports.isNonNullObject = isNonNullObject;
