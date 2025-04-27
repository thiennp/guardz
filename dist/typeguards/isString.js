"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isString = void 0;
const generateTypeGuardError_1 = require("../typeguards/generateTypeGuardError");
/**
 * Checks if a value is a string.
 *
 * @param [value] - The value to check.
 * @param [config] - The effect of invalid type.
 * @return {boolean} Returns true if the value is a string, otherwise false.
 */
const isString = function (value, config) {
    if (typeof value !== "string") {
        if (config) {
            config.callbackOnError((0, generateTypeGuardError_1.generateTypeGuardError)(value, config.identifier, "string"));
        }
        return false;
    }
    return true;
};
exports.isString = isString;
