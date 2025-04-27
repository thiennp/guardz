"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isBoolean = void 0;
const generateTypeGuardError_1 = require("./generateTypeGuardError");
/**
 * Checks if a value is a boolean.
 *
 * @param [value] - The value to check.
 * @param [config] - The effect of invalid type.
 * @return {boolean} Returns true if the value is a boolean, otherwise false.
 */
const isBoolean = function (value, config) {
    if (typeof value !== "boolean") {
        if (config) {
            config.callbackOnError((0, generateTypeGuardError_1.generateTypeGuardError)(value, config.identifier, "boolean"));
        }
        return false;
    }
    return true;
};
exports.isBoolean = isBoolean;
