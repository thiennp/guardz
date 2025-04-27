"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isNonEmptyArray = void 0;
const generateTypeGuardError_1 = require("./generateTypeGuardError");
const isNonEmptyArray = (value, config) => {
    // Check if it's an array first
    if (!Array.isArray(value)) {
        if (config) {
            config.callbackOnError((0, generateTypeGuardError_1.generateTypeGuardError)(value, config.identifier, "array"));
        }
        return false;
    }
    // Then check if it's non-empty
    if (value.length === 0) {
        if (config) {
            config.callbackOnError((0, generateTypeGuardError_1.generateTypeGuardError)(value, config.identifier, "non-empty array"));
        }
        return false;
    }
    return true;
};
exports.isNonEmptyArray = isNonEmptyArray;
