import { generateTypeGuardError } from './generateTypeGuardError';
import type { TypeGuardFn } from './isType';

/**
 * Checks if a value is a FormData object.
 *
 * This type guard validates that a value is a FormData instance, which is available
 * in both browser and Node.js environments (where FormData is available).
 *
 * @param value - The value to check
 * @param config - Optional configuration for error handling
 * @returns True if the value is a FormData object, false otherwise
 *
 * @example
 * ```typescript
 * import { isFormData } from 'guardz';
 *
 * // Browser environment
 * const form = document.querySelector('form');
 * if (form && isFormData(new FormData(form))) {
 *   // formData is typed as FormData
 *   console.log('Form data entries:', Array.from(formData.entries()));
 * }
 *
 * // Node.js environment (where FormData is available)
 * const formData = new FormData();
 * formData.append('name', 'John');
 * formData.append('email', 'john@example.com');
 *
 * if (isFormData(formData)) {
 *   // formData is typed as FormData
 *   console.log('Form data created successfully');
 * }
 *
 * // With error handling
 * const data: unknown = getFormData();
 * if (!isFormData(data, { identifier: 'userForm' })) {
 *   console.error('Invalid form data');
 *   return;
 * }
 * // data is now typed as FormData
 * ```
 */
export const isFormData: TypeGuardFn<FormData> = function (
  value,
  config
): value is FormData {
  if (typeof FormData === 'undefined') {
    // FormData is not available in this environment
    if (config) {
      config.callbackOnError(
        generateTypeGuardError(
          value,
          config.identifier,
          'FormData (not available in this environment)'
        )
      );
    }
    return false;
  }

  if (!(value instanceof FormData)) {
    if (config) {
      config.callbackOnError(
        generateTypeGuardError(value, config.identifier, 'FormData')
      );
    }
    return false;
  }

  return true;
};
