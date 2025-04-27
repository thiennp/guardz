"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPartialOf = isPartialOf;
const isNonNullObject_1 = require("./isNonNullObject");
/**
 * Checks if a value is a partial of a given type.
 *
 * @param propsTypesToCheck - The properties to check in the value.
 * @return {TypeGuardFn<Partial<T>>} - A type guard function that returns true if the value is a partial of the given type, false otherwise.
 */
function isPartialOf(propsTypesToCheck) {
    return function (value, config) {
        if (!(0, isNonNullObject_1.isNonNullObject)(value, config)) {
            return false;
        }
        return Object.keys(propsTypesToCheck).every(function (key) {
            const typeGuardFn = propsTypesToCheck[key];
            return (value[key] === undefined ||
                typeGuardFn(value[key], config ? Object.assign(Object.assign({}, config), { identifier: `${config.identifier}.${key}` }) : null));
        });
    };
}
