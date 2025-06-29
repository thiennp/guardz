
import { Nullable } from "@/types/Nullable";
import type { TypeGuardFn, TypeGuardFnConfig } from "./isType";

/**
 * @param data - The data to check
 * @param typeGuardFn - The type guard function to use
 * @param config - The configuration to use
 * @returns The data if the type guard function passes, otherwise the asserted data type
 */
export function guardWithTolerance<T>(
  data: unknown,
  typeGuardFn: TypeGuardFn<T>,
  config?: Nullable<TypeGuardFnConfig>,
): T {
  return typeGuardFn(data, config) ? data : (data as T);
}
