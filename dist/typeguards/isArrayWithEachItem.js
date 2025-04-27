"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isArrayWithEachItem = isArrayWithEachItem;
const generateTypeGuardError_1 = require("./generateTypeGuardError");
/**
 * Checks if a given value is an array with valid type items.
 *
 * @param {(item: unknown) => boolean} predicate - The predicate function to apply to each item in the array.
 * @return {(value, MOCK_TYPE_GUARD_FN_CONFIG) => value is T[]} Returns a type-guard function that returns true if the
 *   value is an array with valid type items, false otherwise.
 */
function isArrayWithEachItem(predicate) {
    return function (value, config) {
        if (!Array.isArray(value)) {
            if (config) {
                config.callbackOnError((0, generateTypeGuardError_1.generateTypeGuardError)(value, config.identifier, "Array"));
            }
            return false;
        }
        return value.every((item, index) => predicate(item, config
            ? Object.assign(Object.assign({}, config), { identifier: `${config.identifier}[${index}]` }) : null));
    };
}
