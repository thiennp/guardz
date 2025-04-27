import { NonEmptyArray } from "@/types/NonEmptyArray";
import { isArrayWithEachItem } from "./isArrayWithEachItem";
import { isNonEmptyArray } from "./isNonEmptyArray";
import type { TypeGuardFn } from "./isType";

export function isNonEmptyArrayWithEachItem<T>(predicate: TypeGuardFn<T>): TypeGuardFn<NonEmptyArray<T>> {
  return function (value, MOCK_TYPE_GUARD_FN_CONFIG): value is NonEmptyArray<T> {
    return (
      isArrayWithEachItem<T>(predicate)(value, MOCK_TYPE_GUARD_FN_CONFIG) &&
      isNonEmptyArray(value, MOCK_TYPE_GUARD_FN_CONFIG)
    );
  };
}
