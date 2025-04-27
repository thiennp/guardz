"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isType = isType;
const isNonNullObject_1 = require("./isNonNullObject");
/**
 * The data type that comes from different sources (like from server side, library, url params) is not always reliable.
 * Therefore, we need to use this function to ensure the data type is correct.
 *
 * Usage:
 *   Case 1:
 *     data = { prop1: 1, prop2: 'lorem' };
 *     isPropertyTypeValid<DataType>(data, { prop1: ['number'], prop2: ['string'] }); // true
 *
 *   Case 2:
 *     data = { prop1: 1, prop2: { prop3: 'lorem' } };
 *     isPropertyTypeValid<DataType['prop2']>(data.prop2, { prop3: ['string'] })
 *       && isPropertyTypeValid(data, { prop1: ['number'] }); // true
 *
 * @param propsTypesToCheck - list of keys and possible types that it can have
 * @return - a type-guard function to check whether the data type is correct
 */
function isType(propsTypesToCheck) {
    return function (value, config) {
        if (!(0, isNonNullObject_1.isNonNullObject)(value, config)) {
            return false;
        }
        return Object.keys(propsTypesToCheck).every(function (key) {
            const typeGuardFn = propsTypesToCheck[key];
            return typeGuardFn(value[key], config ? Object.assign(Object.assign({}, config), { identifier: `${config.identifier}.${key}` }) : null);
        });
    };
}
