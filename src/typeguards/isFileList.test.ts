import { isFileList } from './isFileList';

describe('isFileList', () => {
  // Mock FileList for testing
  const mockFileList = {
    length: 2,
    item: (index: number) => ({ name: `file${index}.txt` }),
    0: { name: 'file0.txt' },
    1: { name: 'file1.txt' },
  } as unknown as FileList;

  it('should return true for FileList objects in browser environment', () => {
    // This test will only pass in browser environments
    if (typeof FileList !== 'undefined') {
      // Create a mock FileList-like object that would pass instanceof check
      const fileList = Object.create(FileList.prototype);
      expect(isFileList(fileList)).toBe(true);
    } else {
      // In Node.js environment, FileList is not available
      expect(isFileList(mockFileList)).toBe(false);
    }
  });

  it('should return false for non-FileList objects', () => {
    expect(isFileList('not a file list')).toBe(false);
    expect(isFileList(123)).toBe(false);
    expect(isFileList({})).toBe(false);
    expect(isFileList([])).toBe(false);
    expect(isFileList(null)).toBe(false);
    expect(isFileList(undefined)).toBe(false);
    expect(isFileList(true)).toBe(false);
    expect(isFileList(() => {})).toBe(false);
  });

  it('should handle error reporting', () => {
    const mockCallback = jest.fn();
    const config = {
      identifier: 'uploadedFiles',
      callbackOnError: mockCallback,
    };

    isFileList('not a file list', config);
    expect(mockCallback).toHaveBeenCalledTimes(1);

    if (typeof FileList === 'undefined') {
      expect(mockCallback).toHaveBeenCalledWith(
        'Expected uploadedFiles ("not a file list") to be "FileList (not available in this environment)"'
      );
    } else {
      expect(mockCallback).toHaveBeenCalledWith(
        'Expected uploadedFiles ("not a file list") to be "FileList"'
      );
    }
  });

  it('should not call error callback for valid FileList objects', () => {
    if (typeof FileList !== 'undefined') {
      const mockCallback = jest.fn();
      const config = { identifier: 'files', callbackOnError: mockCallback };

      const fileList = Object.create(FileList.prototype);
      isFileList(fileList, config);

      expect(mockCallback).not.toHaveBeenCalled();
    }
  });

  it('should handle environment detection correctly', () => {
    // Test that the guard properly detects when FileList is not available
    const result = isFileList(mockFileList);

    if (typeof FileList === 'undefined') {
      expect(result).toBe(false);
    } else {
      expect(result).toBe(true);
    }
  });

  it('should work with array-like objects that are not FileList', () => {
    // Array-like object that might be confused with FileList
    const arrayLike = {
      length: 2,
      0: { name: 'file1.txt' },
      1: { name: 'file2.txt' },
    };

    expect(isFileList(arrayLike)).toBe(false);
  });
});
