import { stringify } from "../stringify";

export function generateTypeGuardError(value: unknown, identifier: string, expectedType: string): string {
  const valueString = stringify(value);
  return valueString.length > 200
    ? `Expected ${identifier} to be "${expectedType}"`
    : `Expected ${identifier} (${stringify(value)}) to be "${expectedType}"`;
}
