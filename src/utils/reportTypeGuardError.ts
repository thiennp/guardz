import type { TypeGuardFnConfig } from '../typeguards/isType';
import { generateTypeGuardError } from '../typeguards/generateTypeGuardError';

/**
 * Reports a type guard error if configuration is provided.
 * This utility function centralizes error reporting logic to avoid code duplication.
 *
 * @param config - Optional configuration for error handling
 * @param value - The value that failed validation
 * @param expectedType - The expected type name
 */
export function reportTypeGuardError(
  config: TypeGuardFnConfig | null | undefined,
  value: unknown,
  expectedType: string
): void {
  if (config) {
    config.callbackOnError(
      generateTypeGuardError(value, config.identifier, expectedType)
    );
  }
}
