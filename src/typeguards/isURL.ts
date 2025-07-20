import { generateTypeGuardError } from './generateTypeGuardError';
import type { TypeGuardFn } from './isType';

/**
 * Checks if a value is a URL object.
 *
 * This type guard validates that a value is a URL instance, which is available
 * in all modern JavaScript environments.
 *
 * @param value - The value to check
 * @param config - Optional configuration for error handling
 * @returns True if the value is a URL object, false otherwise
 *
 * @example
 * ```typescript
 * import { isURL } from 'guardz';
 *
 * console.log(isURL(new URL('https://example.com'))); // true
 * console.log(isURL(new URL('http://localhost:3000'))); // true
 * console.log(isURL(new URL('file:///path/to/file'))); // true
 * console.log(isURL('https://example.com')); // false (string, not URL)
 * console.log(isURL({ href: 'https://example.com' })); // false (object, not URL)
 *
 * // With type narrowing
 * const data: unknown = getURLData();
 * if (isURL(data)) {
 *   // data is now typed as URL
 *   console.log('Protocol:', data.protocol);
 *   console.log('Hostname:', data.hostname);
 *   console.log('Pathname:', data.pathname);
 * }
 *
 * // With error handling
 * const urlData: unknown = getURLData();
 * if (!isURL(urlData, { identifier: 'apiEndpoint' })) {
 *   console.error('Invalid URL data');
 *   return;
 * }
 * // urlData is now typed as URL
 * ```
 */
export const isURL: TypeGuardFn<URL> = function (value, config): value is URL {
  if (typeof URL === 'undefined') {
    // URL is not available in this environment
    if (config) {
      config.callbackOnError(
        generateTypeGuardError(
          value,
          config.identifier,
          'URL (not available in this environment)'
        )
      );
    }
    return false;
  }

  if (!(value instanceof URL)) {
    if (config) {
      config.callbackOnError(
        generateTypeGuardError(value, config.identifier, 'URL')
      );
    }
    return false;
  }

  return true;
};
