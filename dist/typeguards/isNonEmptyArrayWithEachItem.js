"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isNonEmptyArrayWithEachItem = isNonEmptyArrayWithEachItem;
const isArrayWithEachItem_1 = require("./isArrayWithEachItem");
const isNonEmptyArray_1 = require("./isNonEmptyArray");
function isNonEmptyArrayWithEachItem(predicate) {
    return function (value, MOCK_TYPE_GUARD_FN_CONFIG) {
        return ((0, isArrayWithEachItem_1.isArrayWithEachItem)(predicate)(value, MOCK_TYPE_GUARD_FN_CONFIG) &&
            (0, isNonEmptyArray_1.isNonEmptyArray)(value, MOCK_TYPE_GUARD_FN_CONFIG));
    };
}
