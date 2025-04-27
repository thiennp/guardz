import { generateTypeGuardError } from "./generateTypeGuardError";
import type { TypeGuardFnConfig } from "./isType";
import { NonEmptyArray } from "@/types/NonEmptyArray";

export const isNonEmptyArray = <T>(value: unknown, config?: TypeGuardFnConfig | null): value is NonEmptyArray<T> => {
  // Check if it's an array first
  if (!Array.isArray(value)) {
     if (config) {
        config.callbackOnError(generateTypeGuardError(value, config.identifier, "array"));
     }
     return false;
  }
  // Then check if it's non-empty
  if (value.length === 0) {
    if (config) {
        config.callbackOnError(generateTypeGuardError(value, config.identifier, "non-empty array"));
    }
    return false;
  }
  return true;
};
