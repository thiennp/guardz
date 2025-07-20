import { generateTypeGuardError } from './generateTypeGuardError';
import type { TypeGuardFn } from './isType';

/**
 * Checks if a value is a Blob object.
 *
 * This type guard is useful for validating Blob objects in both browser and Node.js
 * environments (where Blob is available).
 *
 * @param value - The value to check
 * @param config - Optional configuration for error handling
 * @returns True if the value is a Blob object, false otherwise
 *
 * @example
 * ```typescript
 * import { isBlob } from 'guardz';
 *
 * // Browser environment
 * const fileInput = document.querySelector('input[type="file"]');
 * if (fileInput?.files?.[0] && isBlob(fileInput.files[0])) {
 *   // file is typed as Blob (File extends Blob)
 *   console.log('Blob size:', file.size);
 *   console.log('Blob type:', file.type);
 * }
 *
 * // With error handling
 * const data: unknown = getBlobData();
 * if (!isBlob(data, { identifier: 'imageData' })) {
 *   console.error('Invalid blob data');
 *   return;
 * }
 * // data is now typed as Blob
 * ```
 */
export const isBlob: TypeGuardFn<Blob> = function (
  value,
  config
): value is Blob {
  if (typeof Blob === 'undefined') {
    // Blob is not available in this environment
    if (config) {
      config.callbackOnError(
        generateTypeGuardError(
          value,
          config.identifier,
          'Blob (not available in this environment)'
        )
      );
    }
    return false;
  }

  if (!(value instanceof Blob)) {
    if (config) {
      config.callbackOnError(
        generateTypeGuardError(value, config.identifier, 'Blob')
      );
    }
    return false;
  }

  return true;
};
