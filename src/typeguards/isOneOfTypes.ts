import { stringify } from "@/stringify";

import type { TypeGuardFn } from "./isType";

/**
 * Combines multiple isType functions and returns true if at least one of them returns true.
 *
 * @param typeGuards - an array of isType functions
 * @returns true if the value passes at least one of the type guards, otherwise false
 */
export function isOneOfTypes<T>(...typeGuards: TypeGuardFn<T>[]): TypeGuardFn<T> {
  return function (value: unknown, config): value is T {
    const isValid = typeGuards.some((typeGuard) => typeGuard(value, null));

    if (!isValid && config) {
      const valueString = stringify(value);
      const displayValue = valueString.length > 200 ? config.identifier : `${config.identifier} (${valueString})`;

      const errorMessages = [
        `Expected ${displayValue} type to match one of "${typeGuards.map((fn) => fn.name).join(" | ")}"`,
      ];

      typeGuards.forEach((typeGuard) =>
        typeGuard(value, {
          ...config,
          callbackOnError: (error) => {
            const newError = `- ${error}`;
            if (!errorMessages.includes(newError)) {
              errorMessages.push(newError);
            }
          },
        }),
      );

      config.callbackOnError(errorMessages.join("\n"));
    }

    return isValid;
  };
}
