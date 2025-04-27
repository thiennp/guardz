"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTypeGuardError = generateTypeGuardError;
const stringify_1 = require("../stringify");
function generateTypeGuardError(value, identifier, expectedType) {
    const valueString = (0, stringify_1.stringify)(value);
    return valueString.length > 200
        ? `Expected ${identifier} to be "${expectedType}"`
        : `Expected ${identifier} (${(0, stringify_1.stringify)(value)}) to be "${expectedType}"`;
}
