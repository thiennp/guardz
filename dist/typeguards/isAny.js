"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAny = void 0;
/**
 * Type-guard function that always returns true
 *
 * @param {unknown} _value - The value to be checked.
 * @return {boolean} always return true
 */
const isAny = function (_value) {
    return true;
};
exports.isAny = isAny;
