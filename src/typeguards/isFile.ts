import { generateTypeGuardError } from './generateTypeGuardError';
import type { TypeGuardFn } from './isType';

/**
 * Checks if a value is a File object.
 *
 * This type guard is primarily useful in browser environments where File objects
 * are available. In Node.js environments, this will always return false.
 *
 * @param value - The value to check
 * @param config - Optional configuration for error handling
 * @returns True if the value is a File object, false otherwise
 *
 * @example
 * ```typescript
 * import { isFile } from 'guardz';
 *
 * // Browser environment
 * const fileInput = document.querySelector('input[type="file"]');
 * if (fileInput?.files?.[0] && isFile(fileInput.files[0])) {
 *   // file is typed as File
 *   console.log('File name:', file.name);
 *   console.log('File size:', file.size);
 * }
 *
 * // With error handling
 * const data: unknown = getFileData();
 * if (!isFile(data, { identifier: 'uploadedFile' })) {
 *   console.error('Invalid file data');
 *   return;
 * }
 * // data is now typed as File
 * ```
 */
export const isFile: TypeGuardFn<File> = function (
  value,
  config
): value is File {
  if (typeof File === 'undefined') {
    // File is not available in this environment (e.g., Node.js)
    if (config) {
      config.callbackOnError(
        generateTypeGuardError(
          value,
          config.identifier,
          'File (not available in this environment)'
        )
      );
    }
    return false;
  }

  if (!(value instanceof File)) {
    if (config) {
      config.callbackOnError(
        generateTypeGuardError(value, config.identifier, 'File')
      );
    }
    return false;
  }

  return true;
};
