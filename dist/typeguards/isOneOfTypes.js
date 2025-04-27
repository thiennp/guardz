"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isOneOfTypes = isOneOfTypes;
const stringify_1 = require("../stringify");
/**
 * Combines multiple isType functions and returns true if at least one of them returns true.
 *
 * @param typeGuards - an array of isType functions
 * @returns true if the value passes at least one of the type guards, otherwise false
 */
function isOneOfTypes(...typeGuards) {
    return function (value, config) {
        const isValid = typeGuards.some((typeGuard) => typeGuard(value, null));
        if (!isValid && config) {
            const valueString = (0, stringify_1.stringify)(value);
            const displayValue = valueString.length > 200 ? config.identifier : `${config.identifier} (${valueString})`;
            const errorMessages = [
                `Expected ${displayValue} type to match one of "${typeGuards.map((fn) => fn.name).join(" | ")}"`,
            ];
            typeGuards.forEach((typeGuard) => typeGuard(value, Object.assign(Object.assign({}, config), { callbackOnError: (error) => {
                    const newError = `- ${error}`;
                    if (!errorMessages.includes(newError)) {
                        errorMessages.push(newError);
                    }
                } })));
            config.callbackOnError(errorMessages.join("\n"));
        }
        return isValid;
    };
}
