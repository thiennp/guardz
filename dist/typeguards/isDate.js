"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDate = void 0;
const generateTypeGuardError_1 = require("./generateTypeGuardError");
/**
 * Checks if a value is of type Date.
 *
 * @param [value] - The value to be checked.
 * @param [config] - The effect of invalid type.
 * @return {boolean} Returns true if the value is of type Date, otherwise false.
 */
const isDate = function (value, config) {
    if (!(value instanceof Date)) {
        if (config) {
            config.callbackOnError((0, generateTypeGuardError_1.generateTypeGuardError)(value, config.identifier, "Date"));
        }
        return false;
    }
    return true;
};
exports.isDate = isDate;
