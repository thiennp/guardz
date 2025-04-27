"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isEnum = isEnum;
const isOneOf_1 = require("./isOneOf");
/**
 * Generates a type guard function that checks if a value is any of the values from an enum.
 *
 * @template T - The type of the enum value.
 * @param {T extends Record<number | string, unknown>} enumValue - The enum value to check against.
 * @returns {TypeGuardFn<T[keyof T]>} - The type guard function.
 */
function isEnum(enumValue) {
    return function (value, config) {
        return (0, isOneOf_1.isOneOf)(...Object.values(enumValue))(value, config);
    };
}
