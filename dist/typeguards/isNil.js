"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isNil = void 0;
const generateTypeGuardError_1 = require("./generateTypeGuardError");
/**
 * Checks if a value is a null or undefined.
 *
 * @param [value] - The value to check.
 * @param [config] - The effect of invalid type.
 * @return {boolean} Returns true if the value is null or undefined, otherwise false.
 */
const isNil = function (value, config) {
    if (value !== null && value !== undefined) {
        if (config) {
            config.callbackOnError((0, generateTypeGuardError_1.generateTypeGuardError)(value, config.identifier, "null | undefined"));
        }
        return false;
    }
    return true;
};
exports.isNil = isNil;
