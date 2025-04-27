import { NonEmptyArray } from "../types/NonEmptyArray";
import type { TypeGuardFn } from "./isType";
export declare function isNonEmptyArrayWithEachItem<T>(predicate: TypeGuardFn<T>): TypeGuardFn<NonEmptyArray<T>>;
