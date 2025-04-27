/**
 * Converts a JavaScript value to a formatted JSON string.
 *
 * @param value - The value to convert to a JSON string.
 * @returns A formatted JSON string or the string 'undefined' if the value is undefined.
 */
export function stringify(value: unknown): string {
  if (value === undefined) {
    return "undefined";
  }

  if (value instanceof Date) {
    return isNaN(value.getTime()) ? "Invalid Date" : value.toISOString();
  }

  if (typeof value === "function") {
    return "function";
  }

  if (value instanceof Error) {
    return "Error";
  }

  if (typeof value === "number" && isNaN(value)) {
    return "NaN";
  }

  if (value === Infinity) {
    return "Infinity";
  }

  if (value === -Infinity) {
    return "-Infinity";
  }

  return JSON.stringify(value, null, 2);
}
