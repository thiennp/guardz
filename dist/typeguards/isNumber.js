"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isNumber = void 0;
const generateTypeGuardError_1 = require("../typeguards/generateTypeGuardError");
/**
 * Checks if a value is a number.
 *
 * @param [value] - The value to check.
 * @param [config] - The effect of invalid type.
 * @return {boolean} Returns true if the value is a number, otherwise false.
 */
const isNumber = function (value, config) {
    if (typeof value !== "number" || isNaN(value)) {
        if (config) {
            config.callbackOnError((0, generateTypeGuardError_1.generateTypeGuardError)(value, config.identifier, "number"));
        }
        return false;
    }
    return true;
};
exports.isNumber = isNumber;
