"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isObjectWithEachItem = isObjectWithEachItem;
const generateTypeGuardError_1 = require("../typeguards/generateTypeGuardError");
/**
 * Checks if a given value is an object with valid type properties.
 *
 * @param {(item: unknown) => boolean} predicate - The predicate function to apply to each property's value in the object.
 * @return {(value, MOCK_TYPE_GUARD_FN_CONFIG) => value is Record<string, T>} Returns a type-guard function that returns true if the
 *   value is an object with valid type properties, false otherwise.
 */
function isObjectWithEachItem(predicate) {
    return function (value, config) {
        if (typeof value !== "object" || value === null) {
            if (config) {
                config.callbackOnError((0, generateTypeGuardError_1.generateTypeGuardError)(value, config.identifier, "Object"));
            }
            return false;
        }
        return Object.values(value).every((item, index) => predicate(item, config
            ? Object.assign(Object.assign({}, config), { identifier: `${config.identifier}[${index}]` }) : null));
    };
}
