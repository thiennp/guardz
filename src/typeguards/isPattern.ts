import { generateTypeGuardError } from './generateTypeGuardError';
import type { TypeGuardFn } from './isType';
import type { Pattern } from '../types/Pattern';

/**
 * Creates a type guard that checks if a value is a string matching a specific regex pattern.
 *
 * This function creates a type guard that validates unknown values against a given
 * regular expression pattern and returns a branded type. It's useful for validating
 * string formats like emails, phone numbers, URLs, etc.
 *
 * @template P - The pattern identifier for the branded type
 * @param pattern - The regex pattern to test against (can be RegExp or string)
 * @returns A type guard function that validates and returns a branded string type
 *
 * @example
 * ```typescript
 * import { isPattern } from 'guardz';
 * import type { PatternMatched } from 'guardz';
 *
 * // Email validation
 * const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
 * const isEmail = isPattern<'Email'>(emailPattern);
 * type Email = PatternMatched<'Email'>;
 *
 * console.log(isEmail("user@example.com")); // true
 * console.log(isEmail("invalid-email")); // false
 * console.log(isEmail(123)); // false (not a string)
 *
 * // Phone number validation with string pattern
 * const isPhoneNumber = isPattern<'PhoneNumber'>('^\\+?[\\d\\s\\-\\(\\)]{10,}$');
 * type PhoneNumber = PatternMatched<'PhoneNumber'>;
 *
 * console.log(isPhoneNumber("+1-555-123-4567")); // true
 * console.log(isPhoneNumber("123")); // false
 *
 * // URL validation
 * const isUrl = isPattern<'URL'>('^https?:\\/\\/.+');
 * type URL = PatternMatched<'URL'>;
 *
 * console.log(isUrl("https://example.com")); // true
 * console.log(isUrl("ftp://example.com")); // false
 *
 * // With type narrowing
 * const data: unknown = getUserInput();
 * if (isEmail(data)) {
 *   // data is now typed as Email (branded string)
 *   console.log(`Valid email: ${data}`);
 * }
 *
 * // With error handling
 * const email: unknown = getEmail();
 * if (!isEmail(email, { identifier: 'userEmail' })) {
 *   console.error('Invalid email format');
 *   return;
 * }
 * // email is now typed as Email
 * ```
 */
export function isPattern<P extends string>(
  pattern: RegExp | string
): TypeGuardFn<Pattern<P>> {
  const regex = typeof pattern === 'string' ? new RegExp(pattern) : pattern;
  
  return function (value, config): value is Pattern<P> {
    if (typeof value !== 'string') {
      if (config) {
        config.callbackOnError(
          generateTypeGuardError(value, config.identifier, 'string')
        );
      }
      return false;
    }

    if (!regex.test(value)) {
      if (config) {
        config.callbackOnError(
          generateTypeGuardError(
            value,
            config.identifier,
            `string matching pattern ${regex.toString()}`
          )
        );
      }
      return false;
    }

    return true;
  };
} 