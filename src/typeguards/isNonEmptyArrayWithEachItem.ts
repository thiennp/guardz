import { NonEmptyArray } from "@/types/NonEmptyArray";
import { isArrayWithEachItem } from "./isArrayWithEachItem";
import { isNonEmptyArray } from "./isNonEmptyArray";
import type { TypeGuardFn } from "./isType";

export function isNonEmptyArrayWithEachItem<T>(predicate: TypeGuardFn<T>): TypeGuardFn<NonEmptyArray<T>> {
  return function (value, config): value is NonEmptyArray<T> {
    return (
      isArrayWithEachItem<T>(predicate)(value, config) &&
      isNonEmptyArray(value, config)
    );
  };
}
