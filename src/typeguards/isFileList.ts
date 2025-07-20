import { generateTypeGuardError } from './generateTypeGuardError';
import type { TypeGuardFn } from './isType';

/**
 * Checks if a value is a FileList object.
 *
 * This type guard is primarily useful in browser environments where FileList objects
 * are available (typically from file input elements). In Node.js environments, this will always return false.
 *
 * @param value - The value to check
 * @param config - Optional configuration for error handling
 * @returns True if the value is a FileList object, false otherwise
 *
 * @example
 * ```typescript
 * import { isFileList } from 'guardz';
 *
 * // Browser environment
 * const fileInput = document.querySelector('input[type="file"]');
 * if (fileInput?.files && isFileList(fileInput.files)) {
 *   // files is typed as FileList
 *   console.log('Number of files:', files.length);
 *   for (let i = 0; i < files.length; i++) {
 *     console.log('File:', files[i].name);
 *   }
 * }
 *
 * // With error handling
 * const data: unknown = getFileListData();
 * if (!isFileList(data, { identifier: 'uploadedFiles' })) {
 *   console.error('Invalid file list data');
 *   return;
 * }
 * // data is now typed as FileList
 * ```
 */
export const isFileList: TypeGuardFn<FileList> = function (
  value,
  config
): value is FileList {
  // Check if we're in a browser environment where FileList is available
  try {
    // Try to access FileList constructor
    const FileListConstructor = (globalThis as any).FileList;
    if (typeof FileListConstructor === 'undefined') {
      // FileList is not available in this environment (e.g., Node.js)
      if (config) {
        config.callbackOnError(
          generateTypeGuardError(
            value,
            config.identifier,
            'FileList (not available in this environment)'
          )
        );
      }
      return false;
    }

    if (!(value instanceof FileListConstructor)) {
      if (config) {
        config.callbackOnError(
          generateTypeGuardError(value, config.identifier, 'FileList')
        );
      }
      return false;
    }

    return true;
  } catch {
    // If accessing FileList fails, it's not available in this environment
    if (config) {
      config.callbackOnError(
        generateTypeGuardError(
          value,
          config.identifier,
          'FileList (not available in this environment)'
        )
      );
    }
    return false;
  }
};
