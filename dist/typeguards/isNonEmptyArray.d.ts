import type { TypeGuardFnConfig } from "./isType";
import { NonEmptyArray } from "../types/NonEmptyArray";
export declare const isNonEmptyArray: <T>(value: unknown, config?: TypeGuardFnConfig | null) => value is NonEmptyArray<T>;
