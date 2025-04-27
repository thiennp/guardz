"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDefined = void 0;
const generateTypeGuardError_1 = require("./generateTypeGuardError");
const isNil_1 = require("./isNil");
/**
 * Checks if a value is not null and not undefined.
 *
 * @param [value] - The value to check.
 * @param [config] - The effect of invalid type.
 * @return {boolean} Returns true if the value is not null and not undefined, otherwise false.
 */
const isDefined = function (value, config) {
    if ((0, isNil_1.isNil)(value)) {
        if (config) {
            config.callbackOnError((0, generateTypeGuardError_1.generateTypeGuardError)(value, config.identifier, "isDefined"));
        }
        return false;
    }
    return true;
};
exports.isDefined = isDefined;
